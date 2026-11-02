import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
import plan from '../src/data/internal-link-plan.json' with {type:'json'};
import {htmlFiles} from './html-attributes.mjs';

const normal=s=>(s||'').normalize('NFKC').replace(/[‘’]/g,"'").replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
const label=s=>normal(s).replace(/[↗→↓↑←]/g,'').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function destination(href){try{const u=new URL(href,'https://www.roofkingco.com');return ['roofkingco.com','www.roofkingco.com','127.0.0.1'].includes(u.hostname)?u.pathname+u.hash:href;}catch{return href;}}
const visible=($,node)=>{const copy=$(node).clone();copy.find('script,style,noscript,template,[aria-hidden=true]').remove();return normal(copy.text());};
function paragraph($,record){
 const context=normal(record.paragraph_context);
 if(!context)return $();
 const matches=$('main p,main li,main blockquote,main figcaption').filter((_i,n)=>visible($,n)===context);
 return matches.length===1?matches:matches.filter('p').first();
}
function selected($,record){try{return $(record.section.selector).first();}catch{return $();}}
function containingSection($,record){
 if(record.section.section_id){const match=$('[id]').filter((_i,n)=>$(n).attr('id')===record.section.section_id).first();if(match.length)return match;}
 const heading=$('main h1,main h2,main h3,main h4').filter((_i,n)=>normal($(n).text())===normal(record.section.heading)).first();
 return heading.length?heading.closest('section,article'): $();
}
function textNodes(node,out=[]){for(const child of node.children||[]){if(child.type==='text')out.push(child);else if(!['a','script','style'].includes(child.name))textNodes(child,out);}return out;}
function wrap($,record){
 let target=paragraph($,record);
 if(!target.length){const scope=containingSection($,record);const candidates=scope.find('p,li').filter((_i,n)=>visible($,n).includes(normal(record.text_to_wrap)));if(candidates.length===1)target=candidates;}
 if(!target.length){const direct=selected($,record);if(direct.is('p,li')&&visible($,direct).includes(normal(record.text_to_wrap)))target=direct;}
 if(!target.length)return 'Paragraph no longer matches';
 const existing=target.find('a').filter((_i,n)=>label($(n).text())===label(record.text_to_wrap)&&destination($(n).attr('href'))===record.destination);
 if(existing.length){existing.first().attr('data-internal-link-id',record.id);return 'already-present';}
 const pattern=new RegExp(escape(record.text_to_wrap).replace(/\s+/g,'\\s+'));
 for(const node of textNodes(target[0])){const match=node.data.match(pattern);if(!match)continue;
  const anchor=$('<a/>').attr({href:record.destination,title:record.destination_page_title||record.text_to_wrap,'data-internal-link-id':record.id}).text(match[0]);
  const before=node.data.slice(0,match.index),after=node.data.slice(match.index+match[0].length);$(node).replaceWith(anchor);if(before)anchor.before({type:'text',data:before});if(after)anchor.after({type:'text',data:after});return 'applied';
 }
 return 'Phrase is absent, split across markup, or already linked differently';
}
function retarget($,record){
 const matches=node=>node.is('a')&&(node.attr('href')===record.existing_destination||destination(node.attr('href'))===destination(record.existing_destination))&&(record.action==='retarget_image_link'?node.find('img').length>0:label(node.text())===label(record.current_link_text));
 let target=selected($,record);if(!matches(target)){
  let scope=paragraph($,record);if(!scope.length)scope=containingSection($,record);if(!scope.length)scope=$('main');
  const candidates=scope.find('a').filter((_i,n)=>!$(n).attr('data-internal-link-id')&&matches($(n)));if(candidates.length===1)target=candidates;else if(record.action==='retarget_image_link'&&candidates.length)target=candidates.first();else return 'Existing anchor is missing or ambiguous';
 }
 target.attr({href:record.destination,'data-internal-link-id':record.id});
 if(record.proposed_link_text&&label(record.proposed_link_text)!==label(record.current_link_text)){
  const old=label(record.current_link_text),replacement=label(record.proposed_link_text),suffix=old.startsWith(replacement)?old.slice(replacement.length):'';
  const icons=target.children('[aria-hidden=true]').clone();target.text(record.proposed_link_text).append(icons);target.attr('title',record.proposed_link_text);
  if(/^[,.;:!?]+$/.test(suffix))target.after({type:'text',data:suffix});
 }
 return 'applied';
}
function insertionPoint($,record,pathname){
 if(pathname.startsWith('/reviews/'))return {target:$('main article').first(),method:'append'};
 if(pathname==='/deck-visualizer/')return {target:$('main article').first(),method:'append'};
 const indicated=selected($,record);
 if(record.section.component==='ContentSection'&&/^After /.test(record.placement)){
  const section=indicated.closest('.rk-article-section');if(section.length)return {target:section,method:'append'};
 }
 if(record.section.component==='ServiceContentBand'&&/^After /.test(record.placement)){
  const section=indicated.closest('section').children('.rk-section-inner').first();if(section.length)return {target:section,method:'append'};
 }
 let target=paragraph($,record);
 if(target.length)return {target:target.is('li')?target.closest('ul,ol'):target,method:'after'};
 target=selected($,record);
 if(target.is('h1')){
  const hero=target.closest('section');const description=hero.find('.rk-editorial-hero-description').first();
  if(description.length)return {target:description,method:'after'};
  const following=target.nextAll('p').first();return {target:following.length?following:target,method:'after'};
 }
 if(target.length)return {target,method:'after'};
 return {target:$(),method:'after'};
}
function insert($,record,pathname){
 const text=record.proposed_text||record.text_to_wrap;const at=text.indexOf(record.text_to_wrap);if(at<0)return 'Proposed anchor text is absent from insertion';
 const anchor=$('<a/>').attr({href:record.destination,title:record.destination_page_title||record.text_to_wrap,'data-internal-link-id':record.id}).text(record.text_to_wrap);
 if(pathname==='/site-map/'&&record.section.proposed_section){
  const id='contextual-'+record.section.label.toLowerCase().replace(/[^a-z0-9]+/g,'-');let section=$('#'+id);
  if(!section.length){section=$('<section/>').attr('id',id).addClass('rk-section-inner rk-contextual-directory');section.append($('<h2/>').text(record.section.label),$('<ul/>'));$('main').append(section);}
  section.find('ul').append($('<li/>').append(anchor));return 'applied';
 }
 const {target,method}=insertionPoint($,record,pathname);if(!target.length)return 'Insertion location no longer matches';
 const row=$('<p/>').addClass('rk-contextual-links').attr('data-contextual-link-row',record.id);
 if(at)row.append({type:'text',data:text.slice(0,at)});row.append(anchor);if(at+record.text_to_wrap.length<text.length)row.append({type:'text',data:text.slice(at+record.text_to_wrap.length)});
 if(method==='append')target.append(row);else{let cursor=target;while(cursor.next().is('.rk-contextual-links'))cursor=cursor.next();cursor.after(row);}return 'applied';
}
export function applyInternalLinks(html,{pathname,strict=false}={}){
 const records=plan.pages[pathname];if(!records?.length)return {html,changed:false,results:[]};
 const $=load(html),results=[];let changed=false;
 for(const record of records){
  if($('[data-internal-link-id]').filter((_i,n)=>$(n).attr('data-internal-link-id')===record.id).length){results.push({id:record.id,status:'already-present'});continue;}
  const status=record.action==='wrap_existing_text'?wrap($,record):record.action.startsWith('retarget')?retarget($,record):insert($,record,pathname);
  if(status==='applied'||status==='already-present')changed=true;results.push({id:record.id,status});
 }
 const failures=results.filter(r=>!['applied','already-present'].includes(r.status));if(strict&&failures.length)throw Error(pathname+' internal link instructions: '+JSON.stringify(failures));
 return {html:changed?$.html():html,changed,results};
}
export default function internalLinks(){return {name:'contextual-internal-links',hooks:{'astro:build:done':async({dir,logger})=>{
 const root=fileURLToPath(dir);let count=0;for(const file of await htmlFiles(root)){const pathname='/'+path.relative(root,file).replaceAll(path.sep,'/').replace(/index\.html$/,'');const original=await fs.readFile(file,'utf8');const result=applyInternalLinks(original,{pathname,strict:true});if(result.changed)await fs.writeFile(file,result.html);count+=result.results.length;}
 logger.info(`Contextual internal links: ${count} approved instructions processed.`);
}}};}
