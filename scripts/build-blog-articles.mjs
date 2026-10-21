import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
import sharp from 'sharp';
import {canonicalBlogLink} from './html-attributes.mjs';
const routes=JSON.parse(await fs.readFile('src/data/blog-routes.json','utf8')).posts;
const index=JSON.parse(await fs.readFile('src/data/blog-index.json','utf8'));
const seasonal=JSON.parse(await fs.readFile('migration/navigation-extra-images.json','utf8')).images;
const heroes={...JSON.parse(await fs.readFile('src/data/service-heroes.json','utf8')),...JSON.parse(await fs.readFile('src/data/roofing-heroes.json','utf8'))};
const heroRoutes={
 'best-roofing-contractors-dublin-oh-what-homeowners-should-know-before-hiring-a':'/roofing/gaf/master-elite/',
 'columbus-roof-damage-after-early-august-storms-your-first-72-hours':'/columbus-oh/storm-damage/',
 'columbus-roofs-face-wind-gusts-over-40-mph-during-fall-stormsenough-to-lift':'/storm-damage/wind/',
 'from-hail-to-high-winds-how-to-spot-hidden-roof-damage-after-ohios-late-summer':'/storm-damage/hail/',
 'how-long-does-a-roof-last-in-dublin-oh':'/roofing/types/',
 'how-much-does-a-roof-replacement-cost-in-dublin-oh':'/cost-of-a-new-roof/',
 'how-much-does-roof-repair-cost-in-dublin-oh':'/roof-repair-dublin-oh/',
 'replacing-your-roof-in-columbus-why-hiring-experts-is-the-best-choice':'/columbus-oh/roofing/',
 'replace-your-home-siding-in-columbus-with-expert-help':'/siding/replacement/',
 'the-importance-of-gutters-for-your-columbus-home':'/gutters/seamless/',
 'the-5-step-roofing-process':'/roofing/replacement/',
 'should-i-go-with-gaf-shingles-for-my-roof-replacement':'/roofing/gaf/',
 'how-to-know-if-you-need-a-roof-repair-or-roof-replacement':'/roofing/repair/',
 'how-to-spot-roof-damage-this-storm-season':'/storm-damage/',
 'post-storm-roof-inspection-checklist-what-to-do-before-calling-insurance':'/storm-damage/insurance-claims/',
 'why-gutter-guard-installation-in-columbus-oh-is-a-good-idea':'/gutters/guards/',
 'storm-ready-roofing-protecting-your-home-from-fall-winter-storms':'/storm-damage-roof-repair-dublin-oh/',
 'prevent-roof-damage-this-winter-with-ice-dam-removal-in-columbus-oh':'/ice-dam-removal/',
 'signs-you-need-roof-repair-in-dublin-oh':'/roofing-contractor-dublin-oh/'
};
const normalize=text=>text.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
const fixLink=href=>canonicalBlogLink(href?.replace('/storm-damage-repair-dublin-oh/','/storm-damage-roof-repair-dublin-oh/').replace('/blog/p.251204000/prevent-roof-damage-this-winter-with-ice-dam-removal-in-columbus-oh/ice-dam-removal/','/ice-dam-removal/'));
const records=JSON.parse(await fs.readFile('migration/sources/wordpress-content.json','utf8')).records;
const articles={},media={},audit=[];
await fs.mkdir('public/media/articles/hero',{recursive:true});
for(const route of routes){
 const raw=await fs.readFile(route.sourceFile,'utf8');const meta=YAML.parse(raw.split('---')[1]);const $=cheerio.load(raw.split('---').slice(2).join('---'));
 const root=$('.rk-blog-component-body,.rk-blog-article').first().length?$('.rk-blog-component-body,.rk-blog-article').first():$('.rk-migration-archive').first();
 if(!root.length)throw Error('Missing article body '+route.sourceFile);
 function rich(node){
  if(node.type==='text'){const text=node.data.replace(/\u200b/g,'').replace(/\s+/g,' ');return text?[{text}]:[];}
  if(node.type!=='tag')return [];
  const tag=node.tagName;if(['img','figure','script','style','h1'].includes(tag)||$(node).attr('aria-hidden')==='true')return [];
  const children=(node.children||[]).flatMap(rich);
  if(!['p','h2','h3','h4','a','ul','ol','li','strong','b','em','i','br'].includes(tag))return children;
  return [{tag,...(tag==='a'?{href:fixLink($(node).attr('href'))}:{}),...(node.attribs.id?{id:node.attribs.id}:{}),children}];
 }
 const importedImages=new Map(root.find('img').toArray().map(n=>[n.attribs.src.split('/').at(-1),n.attribs]));
 const original=records.find(p=>meta.wordpressId&&p.id===meta.wordpressId);
 const originalRoot=original?cheerio.load(original.rawContent)('.post-content').first():null;
 const bodyImages=[];
 async function optimizeImage(attrs){
  const input='public'+attrs.src;const dimensions=await sharp(input).metadata();const widths=[480,800,1280].filter(w=>w<dimensions.width);widths.push(Math.min(1600,dimensions.width));
  const variants=[];for(const width of [...new Set(widths)]){const src='/media/articles/body/'+attrs.src.split('/').at(-1).replace(/\.[^.]+$/,'')+'-'+width+'.webp';await fs.mkdir('public/media/articles/body',{recursive:true});let quality=82;let buffer;do{buffer=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality}).toBuffer();quality-=5;}while(buffer.length>=300000&&quality>=47);if(buffer.length>=300000)throw Error('Article image exceeds budget '+src);await fs.writeFile('public'+src,buffer);variants.push({src,width});}
  const src=variants.at(-1).src;media[src]={width:variants.at(-1).width,height:Math.round(dimensions.height*variants.at(-1).width/dimensions.width),variants};return {src,alt:attrs.alt||route.title};
 }
 for(const attrs of importedImages.values())bodyImages.push(await optimizeImage(attrs));
 function tokenize(node){
  if(node.type==='text')return normalize(node.data)?[{kind:'prose',node:{tag:'p',children:[{text:normalize(node.data)}]}}]:[];
  if(node.type!=='tag')return [];
  if(node.tagName==='img'){
   const basename=node.attribs.src.split('/').at(-1);const i=[...importedImages.keys()].indexOf(basename);
   return i>=0?[{kind:'image',image:bodyImages[i]}]:[];
  }
  if(node.tagName==='p'&&(!normalize($(node).text())||/^\x60/.test(normalize($(node).text()))))return [];
  if(['ul','ol'].includes(node.tagName))return $(node).children('li').toArray().map(li=>{let nodes=(li.children||[]).flatMap(rich);if(!nodes.some(n=>n.tag==='p'))nodes=[{tag:'p',children:nodes}];return {kind:'check',nodes};});
  if($(node).hasClass('rk-blog-component-card')){
   let nodes=rich(node).filter(n=>n.tag||normalize(n.text));if(!nodes.some(n=>['p','h3','h4','ul','ol'].includes(n.tag)))nodes=[{tag:'p',children:nodes}];else nodes=nodes.map(n=>n.tag?n:{tag:'p',children:[n]});
   return [{kind:'check',nodes}];
  }
  if(['p','h2','h3','h4','ul','ol'].includes(node.tagName))return rich(node).map(item=>({kind:'prose',node:item}));
  if(['h1','script','style'].includes(node.tagName)||$(node).attr('aria-hidden')==='true')return [];
  if(['a','strong','b','em','i','span'].includes(node.tagName)&&normalize($(node).text()))return [{kind:'prose',node:{tag:'p',children:rich(node)}}];
  return (node.children||[]).flatMap(tokenize);
 }
 let tokens;
 if(originalRoot?.length){
  // Keep the reviewed heading levels while recovering original paragraph/list ordering.
  const levels=new Map(root.find('h2,h3,h4').toArray().map(n=>[normalize($(n).text()),n.tagName]));
  originalRoot.find('h1,h2,h3,h4').each((_,n)=>{const level=levels.get(normalize($(n).text()));if(level)n.tagName=level;});
  originalRoot.find('p').each((_,n)=>{if(/\bscop(?:e|es|ing)\b/i.test($(n).text())){const reviewed=root.find('p').toArray().find(p=>normalize($(p).text()).endsWith('The plan helps to set standards and a schedule for the roofing installation.'));if(reviewed)$(n).html($(reviewed).html());else throw Error('Unreviewed generic wording in '+route.slug);}});
  originalRoot.find('a[href]').each((_,n)=>{n.attribs.href=n.attribs.href.replace(/^https?:\/\/localhost\/roofingkingco(?=\/)/,'');});
  tokens=originalRoot.contents().toArray().flatMap(tokenize);
 }else tokens=root.contents().toArray().flatMap(tokenize);
 if(bodyImages.length){const first=tokens.findIndex(t=>t.kind==='image');if(first>=0)tokens.splice(first,1);}
 const lead=[],sections=[];let current=null;
 function text(nodes){return nodes.map(n=>n.tag?text(n.children):n.text).join('');}
 for(const token of tokens){
  if(token.kind==='prose'&&token.node.tag==='h2'){
   current={id:`article-section-${sections.length+1}`,title:text(token.node.children),tokens:[]};sections.push(current);
  }else if(current)current.tokens.push(token);else lead.push(token);
 }
 function blocks(list){
  const result=[];for(const token of list){if(token.kind==='image'){result.push(token);continue;}const kind=token.kind==='check'?'checklist':'prose';let block=result.at(-1);if(block?.kind!==kind){block=kind==='checklist'?{kind,items:[]}:{kind,nodes:[]};result.push(block);}if(kind==='checklist')block.items.push(token.nodes);else block.nodes.push(token.node);}return result;
 }
 const output=sections.map(section=>{
  const nodes=section.tokens.flatMap(t=>t.kind==='check'?t.nodes:t.kind==='image'?[]:[t.node]);
  if(/\bFAQs?\b|frequently asked/i.test(section.title)){
   const items=[];let question=null;const preamble=[];
   for(const node of nodes){if(node.tag==='h3'){question={question:text(node.children),answer:[]};items.push(question);}else if(question)question.answer.push(node);else preamble.push(node);}
   if(items.length&&items.every(item=>item.answer.length))return {id:section.id,title:section.title,kind:'faq',preamble,items};
  }
  return {id:section.id,title:section.title,kind:'section',blocks:blocks(section.tokens)};
 });
 let hero;
 if(bodyImages.length){hero={...bodyImages[0],generated:false};}
 else if(heroRoutes[route.slug]){const asset=heroes[heroRoutes[route.slug]];if(!asset)throw Error('Missing hero '+heroRoutes[route.slug]);hero={...asset.image,generated:asset.generated};}
 else{
  const scene=seasonal[route.slug.includes('christmas')?'holiday-lighting':'winter-roofing'];
  let input=scene.originalFile;try{await fs.access(input);}catch{input='public/media/articles/hero/'+route.slug+'-1672.webp';}
  const metadata=await sharp(input).metadata();const widths=[480,800,1280,1600,1920].filter(w=>w<=metadata.width);if(!widths.includes(metadata.width)&&metadata.width<1920)widths.push(metadata.width);widths.sort((a,b)=>a-b);
  const variants=[];for(const width of widths){const file=`/media/articles/hero/${route.slug}-${width}.webp`;await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:78}).toFile('public'+file);variants.push({src:file,width});}
  const key=variants.at(-1).src;media[key]={width:metadata.width,height:metadata.height,variants};hero={src:key,alt:route.slug.includes('christmas')?'Illustration of a home with warm holiday lights along its roofline':'Illustration of a snow-covered shingle roof and gutter',generated:true};
 }
 const author=normalize($('.rk-blog-meta span').first().text()).replace(/^By\s+/i,'')||null;
 const publishedAt=$('time[datetime]').first().attr('datetime')||null;
 const plainRoot=root.clone();plainRoot.find('h1,img,figure,script,style,[aria-hidden=true]').remove();
 const paragraphs=root.find('p,h2,h3,h4,.rk-blog-component-card>div').toArray().map(el=>normalize($(el).text())).filter(value=>value&&!/^\x60/.test(value));
 const links=root.find('a[href]').toArray().map(el=>({href:fixLink($(el).attr('href')),label:normalize($(el).text())}));
 const readingMinutes=Math.max(1,Math.ceil(normalize(plainRoot.text()).split(/\s+/).length/220));
 const article={path:route.canonicalPath,title:route.title,description:index.find(p=>p.href===route.canonicalPath).description,sourceFile:route.sourceFile,source:meta.source,hero,author,publishedAt,readingMinutes,lead:blocks(lead),sections:output};
 articles[route.canonicalPath]=article;
 audit.push({path:route.canonicalPath,sourceFile:route.sourceFile,sourceText:normalize(plainRoot.text()),paragraphs,links,sections:output.length,images:bodyImages.slice(1),originalImageCount:bodyImages.length,checklistGroups:[lead,...sections.map(s=>s.tokens)].flatMap(list=>blocks(list).filter(b=>b.kind==='checklist').map(b=>b.items.map(nodes=>normalize(text(nodes))))),checklistItems:tokens.filter(t=>t.kind==='check').length,faqs:output.filter(s=>s.kind==='faq').reduce((n,s)=>n+s.items.length,0),heroRoute:heroRoutes[route.slug]||null,generatedHero:hero.generated});
}
await fs.writeFile('src/data/blog-articles.json',JSON.stringify(articles,null,2)+'\n');
await fs.writeFile('src/data/blog-article-media.json',JSON.stringify(media,null,2)+'\n');
await fs.writeFile('migration/blog-article-components.json',JSON.stringify({articleCount:audit.length,policy:'Original article copy and links rendered through shared native components; checklists restored to semantic lists; FAQs reuse FAQSection. Existing service hero assets are illustrative; previously generated seasonal scenes are optimized from their full-resolution originals without enlargement.',articles:audit},null,2)+'\n');
console.log(`Compiled ${audit.length} complete articles into native prose, checklists and FAQs.`);
