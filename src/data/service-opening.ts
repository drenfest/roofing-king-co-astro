// Build-time migration adapter. No source database or network access is required.
import type {AnyNode} from 'domhandler';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
import type {RichNode,ServiceSection,ServicePathsData} from './section-types';
type Topic={id:string;label:string;title:string;body:RichNode[];href?:string;action?:string};
export type ServiceOpening={mode:'children'|'topics';title:string;items:Topic[]};
type RecordPage={path:string;title:string;description:string;category:string;html:string};
const sources=import.meta.glob('../content/pages/**/index.md',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
const pages:RecordPage[]=Object.entries(sources).map(([,source])=>{
  const [,front,...body]=source.split('---');const meta=YAML.parse(front);
  return {path:meta.permalink,title:meta.title,description:meta.description,category:meta.category,html:body.join('---')};
});
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
const eligible=(p:RecordPage)=>/service/i.test(p.category)||p.category==='Product guide';
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const allowed=new Set(['p','div','span','article','h2','h3','h4','a','ul','ol','li','strong','b','em','i','br']);
function rich(html:string):RichNode[]{
  const $=cheerio.load(html,null,false);
  function walk(elements:cheerio.Cheerio<AnyNode>):RichNode[]{return elements.toArray().flatMap((e):RichNode[]=>{
    if(e.type==='text')return [{text:e.data}];if(e.type!=='tag')return [];
    const el=$(e);if(!allowed.has(e.tagName))return walk(el.contents());
    return [{tag:e.tagName as Exclude<RichNode['tag'],undefined>,...(el.attr('id')?{id:el.attr('id')}:{}),...(e.tagName==='a'?{href:el.attr('href')}:{}),children:walk(el.contents())}];
  });}return walk($.root().contents());
}
function renderNodes(nodes:RichNode[]):string{return nodes.map(n=>n.tag?`<${n.tag}${n.tag==='a'?` href="${(n.href||'').replaceAll('&','&amp;').replaceAll('"','&quot;')}"`:''}>${renderNodes(n.children)}</${n.tag}>`:n.text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')).join('');}
function contentHTML(section:Extract<ServiceSection,{type:'content'}>){return renderNodes(section.body)+section.cards.map(card=>`<article><h3>${card.title}</h3>${renderNodes(card.body)}${card.href?`<a href="${card.href}">${card.title}</a>`:''}</article>`).join('');}
function topics(html:string):Topic[]{
  const $=cheerio.load(html,null,false);const output:Topic[]=[];let current:Topic|undefined;const leading:RichNode[]=[];
  // Flatten layout wrappers while retaining paragraphs, lists, links and their headings.
  function visit(elements:cheerio.Cheerio<AnyNode>){for(const e of elements.toArray()){
    if(e.type==='text'){if(e.data.trim())(current?.body || leading).push({text:e.data});continue;}
    if(e.type!=='tag')continue;const el=$(e);
    if(e.tagName==='h2'){
      const title=clean(el.text());if(!title)continue;
      current={id:el.attr('id') || `topic-${slug(title)}-${output.length+1}`,label:title,title,body:output.length?[]:leading};output.push(current);
    }else if(['div','article','section'].includes(e.tagName))visit(el.children());
    else (current?.body || leading).push(...rich($.html(el)));
  }}visit($.root().children());return output.filter(item=>item.body.length);
}
export function serviceOpening(path:string,sections?:ServiceSection[]){
  const page=pages.find(p=>p.path===path);if(!page||!eligible(page))return undefined;
  const children=pages.filter(p=>p.path!==path&&p.path.startsWith(path)&&!p.path.slice(path.length).replace(/\/$/,'').includes('/'));
  const $=cheerio.load(page.html,null,false);
  const wordpress=$('article.rk-page-content > .rk-page-section').not('.rk-page-final-cta,.rk-page-faq-section');
  const originals=wordpress.length?wordpress:$('section.sec').filter((_i,e)=>$(e).find('h2').length>0).first();
  let items:Topic[]=[];
  if(children.length)items=children.map(child=>{
    const childHTML=cheerio.load(child.html);const paragraphs=childHTML('.rk-page-intro-section p,.rk-page-copy-section p').filter((_i,e)=>!childHTML(e).hasClass('rk-home-eyebrow')).slice(0,2).map((_i,e)=>childHTML.html(e)).get().join('');
    const label=child.title.replace(/^Columbus,?\s*(?:OH|Ohio)\s*/i,'').replace(/\s+(?:Contractor|Company)$/i,'');
    return {id:`service-${slug(child.path)}`,label,title:child.title,body:paragraphs?rich(paragraphs):[{tag:'p',children:[{text:child.description}]}],href:child.path,action:`Explore ${label}`};
  });
  else items=topics(sections?sections.filter(s=>s.type==='content').map(s=>contentHTML(s as Extract<ServiceSection,{type:'content'}>)).join(''):originals.toArray().map(e=>$.html(e)).join(''));
  const firstContent=sections?.find(s=>s.type==='content');
  // Transfer the former introductory grid into an overview tab rather than duplicate it below.
  if(children.length){
    const overview=topics(firstContent?.type==='content'?contentHTML(firstContent):wordpress.first().toString());
    if(overview.length)items.push(...overview.map((item,index)=>({...item,label:index?'More service information':'Service overview'})));
  }
  if(!items.length)return undefined;
  const opening:ServiceOpening={mode:children.length?'children':'topics',title:page.title,items};
  // Legacy source is already imported HTML; split it at the first substantive section.
  const first=originals.first();if(first.length){first.before('<span id="rk-service-opening-marker"></span>');if(wordpress.length){if(!children.length)originals.remove();else first.remove();}}
  const [before,after]=$.html().split('<span id="rk-service-opening-marker"></span>');
  return {opening,children:children.map(p=>p.path),before,after,sections:sections?.filter(s=>children.length?s!==firstContent:s.type!=='content')};
}
export function completeServicePaths(path:string,section:ServicePathsData):ServicePathsData{
  const opening=serviceOpening(path)?.opening;if(opening?.mode!=='children')return section;
  const text=(nodes:RichNode[]):string=>nodes.map(n=>n.tag?text(n.children):n.text).join('');
  return {...section,items:[...section.items,...opening.items.filter(topic=>topic.href&&!section.items.some(item=>item.href===topic.href)).map(topic=>({id:topic.id,tabLabel:topic.label,title:topic.title,description:text(topic.body.slice(0,1)),detail:text(topic.body.slice(1)),highlights:[],href:topic.href!,label:topic.action!,icon:'roof'}))]};
}
