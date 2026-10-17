import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
// Explicit migration authoring step; normal builds read committed typed data only.
const defaults=['/roofing/','/roofing/repair/','/roofing/replacement/','/roofing/types/','/roofing/metal/','/roofing/gaf/','/roofing/gaf/types/','/roofing/gaf/master-elite/'];
const paths=process.argv.length>2?process.argv.slice(2):defaults;
const result=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
for(const path of paths){if(!/^\/[a-z0-9/-]+\/$/.test(path))throw Error('Expected an explicit preserved permalink: '+path);}
const clean=s=>s.replace(/\s+/g,' ').trim();
for(const permalink of paths){
 const file='src/content/pages'+permalink+'index.md';const source=await fs.readFile(file,'utf8');const meta=YAML.parse(source.split('---')[1]);const $=cheerio.load(source.split('---').slice(2).join('---'));
 const text=(root,sel)=>clean(root.find(sel).first().text());
 const image=el=>({src:el.attr('src')||'',alt:el.attr('alt')||''});
 function nodes(elements){return elements.toArray().flatMap(e=>{if(e.type==='text')return [{text:e.data}];if(e.type!=='tag')return [];const el=$(e);if(el.hasClass('rk-card-rule'))return [];if(!['p','div','span','article','h2','h3','h4','a','ul','ol','li','strong','b','em','i','br'].includes(e.tagName))throw Error('Unsupported prose tag '+e.tagName+' on '+permalink);return [{tag:e.tagName,...(el.hasClass('rk-home-eyebrow')?{role:'eyebrow'}:{}),...(e.tagName==='a'?{href:el.attr('href')}:{}),children:nodes(el.contents())}];});}
 const sections=[];
 const hero=$('.rk-home-hero');const card=hero.find('aside');
 const heroData={eyebrow:text(hero,'.rk-home-eyebrow'),title:permalink==='/roofing/gaf/types/'?meta.title:(text(hero,'h1')||meta.title),description:clean(hero.find('.rk-home-hero-copy > p:not(.rk-home-eyebrow)').text()),image:hero.attr('style')?.match(/url\(['"]?([^'"\)]+)/)?.[1]||'/media/wordpress/a102470cfba2-hero-roofing.jpg',booking:{eyebrow:text(card,'.rk-home-card-kicker'),title:text(card,'h2'),description:clean(card.find('p:not(.rk-home-card-kicker)').text())},bookingUrl:card.find('.rk-button').attr('href')||'/contact-us/',bookingLabel:text(card,'.rk-button')};
 function heading(el){const root=el.find('.rk-home-section-header,.rk-brands-heading,.rk-coverage-map-copy,.rk-home-before-copy').first();return {eyebrow:text(root,'.rk-home-eyebrow'),title:text(root,'h2'),description:clean(root.find('> p:not(.rk-home-eyebrow)').text())};}
 const article=$('article.rk-page-content');
 article.children().each((i,e)=>{const el=$(e);if(el.is('.rk-home-hero,.rk-home-badges,.rk-breadcrumbs'))return;
  if(el.is('.rk-block-trusted-brands'))sections.push({type:'brands',...heading(el),items:el.find('.rk-home-brand-list img').map((i,e)=>image($(e))).get()});
  else if(el.is('.rk-offers-block,.rk-reviews-block')){const kind=el.is('.rk-offers-block')?'offers':'reviews';sections.push({type:'cards',kind,...heading(el),items:el.find(kind==='offers'?'.rk-home-offer-card':'.rk-home-review-card').map((i,e)=>{const c=$(e);return {title:text(c,'h3'),description:text(c,'p'),...(c.find('a').length?{href:c.find('a').attr('href')}:{}),...(c.find('img').length?{image:image(c.find('img').first())}:{})};}).get()});}
  else if(el.is('.rk-project-gallery-block'))sections.push({type:'gallery',...heading(el),filters:el.find('[data-rk-gallery-filter]').map((i,e)=>({label:clean($(e).text()),value:$(e).attr('data-rk-gallery-filter')})).get(),items:el.find('.rk-project-gallery-item').map((i,e)=>({...image($(e).find('img').first()),tags:($(e).attr('data-rk-gallery-tags')||'').split(/[\s,]+/).filter(Boolean)})).get()});
  else if(el.is('.rk-before-after-block'))sections.push({type:'comparison',...heading(el),before:image(el.find('.rk-before-after-before')),after:{...image(el.find('.rk-before-after-after')),alt:'Roof after replacement'}});
  else if(el.is('.rk-coverage-map-block'))sections.push({type:'coverage',...heading(el),image:image(el.find('img').first())});
  else if(el.is('.rk-page-final-cta'))sections.push({type:'quote',eyebrow:text(el,'.rk-home-eyebrow'),title:text(el,'h2'),description:clean(el.find('.rk-section-inner > p:not(.rk-home-eyebrow)').text())});
  else if(el.is('.rk-page-faq-section'))sections.push({type:'faq',eyebrow:text(el,'.rk-home-eyebrow'),title:text(el,'h2'),description:clean(el.find('.rk-page-section-heading > p:not(.rk-home-eyebrow)').text()),items:el.find('details').map((i,e)=>({question:text($(e),'summary'),answer:nodes($(e).children('div').contents())})).get()});
  else if(permalink==='/roofing/gaf/types/'&&el.is('.rk-page-copy-section')){const items=[];let current;el.find('.rk-page-copy-narrow').children().each((i,e)=>{if(e.tagName==='h2'){current={productId:clean($(e).text()).toLowerCase().replaceAll('+','-plus').replace(/[^a-z0-9]+/g,'-'),title:clean($(e).text()),body:[]};items.push(current);}else{if(!current)throw Error('Product body without title');current.body.push(...nodes($(e)));}});sections.push({type:'products',eyebrow:'Roofing materials',title:'Explore GAF Shingle Types',description:'Compare the shingle options described below and talk with Roof King about your project.',items});}
  else if(el.is('.rk-page-section')){const variant=el.is('.rk-page-feature-section')?'features':el.find('.rk-page-service-grid').length?'services':'prose';const inner=el.find('.rk-section-inner').first();const copy=variant==='features'?inner.find('.rk-page-feature-copy'):inner.clone();copy.find('.rk-page-service-grid').remove();sections.push({type:'content',variant,body:nodes(copy.contents()),cards:el.find(variant==='features'?'.rk-page-feature-list > article':'.rk-page-service-card').map((i,e)=>({title:text($(e),'h3'),body:nodes($(e).children('p')),href:$(e).attr('href')})).get()});}
  else throw Error('Unmapped section '+el.attr('class'));
 });
 result[permalink]={sourceFile:file,contentReview:'Imported business claims need editorial verification; delivery remains disabled.',hero:heroData,breadcrumbs:$('.rk-breadcrumbs a,.rk-breadcrumbs [aria-current]').map((i,e)=>({label:clean($(e).text()),href:$(e).attr('href')})).get(),sections};
}
await fs.writeFile('src/data/service-pages.json',JSON.stringify(result,null,2)+'\n');
console.log('Transferred '+paths.length+' service pages into structured section data.');
