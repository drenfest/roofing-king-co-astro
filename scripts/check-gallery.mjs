import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const library=JSON.parse(await fs.readFile('src/data/project-gallery.json','utf8'));
const media=JSON.parse(await fs.readFile('src/data/gallery-media.json','utf8'));
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const sourceByAsset=new Map();
for(const item of library.items){
 const record=media[item.src];assert.ok(record.width>=800,'Do not enlarge low-resolution gallery sources.');
 assert.equal(new Set(record.variants.map(v=>v.width)).size,record.variants.length,'Unique srcset widths.');
 for(const variant of record.variants){assert.ok(variant.width<=record.width);assert.ok((await fs.stat('public'+variant.src)).size<=180000);}
 sourceByAsset.set(record.variants.at(-1).src,item);
}
function topic(family){
 if(family==='commercial-siding'||family.startsWith('siding')||family==='painting')return 'siding';
 if(/gutter|seamless|guards/.test(family))return 'gutters';
 if(family.startsWith('commercial'))return 'commercial-roofing';
 if(family.startsWith('deck'))return 'decks';
 if(family==='windows'||family==='insulation')return family;
 if(['storm','hail','wind','claims'].includes(family))return 'storm-damage';
 if(family==='metal')return 'metal';
 return family==='local'?'all':'roofing';
}
for(const [path,family] of [['/','all'],['/past-projects/','all'],['/roofing/','roofing'],['/roofing/gaf/types/','gaf-catalog'],...Object.entries(editorial).map(([path,data])=>[path,data.family])]){
 const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 const gallery=$('.rk-editorial-gallery');assert.equal(gallery.length,1,path+' needs one gallery.');
 const expected=family==='all'?'all':topic(family);
 assert.equal(gallery.attr('data-gallery-topic'),expected,path);
 const rendered=gallery.find('.rk-project-gallery-item');
 assert.ok(rendered.length>0,path);
 for(const item of rendered.toArray()){
  const photo=sourceByAsset.get($(item).attr('href'));assert.ok(photo,'Lightbox must use an optimized library source.');
  if(expected!=='all')assert.ok(photo.tags.includes(expected),path+' must use topic-matched photos.');
  if(['gaf','certification','gaf-catalog'].includes(family))assert.ok(!photo.tags.includes('metal'));
 }
 assert.equal(gallery.find('.rk-gallery-page:not([hidden])').length,1,'Only one SSR group is visible.');
 for(const group of gallery.find('.rk-gallery-page').toArray())assert.ok($(group).find('.rk-project-gallery-item').length<=4,'At most four desktop photos per group.');
 for(const image of gallery.find('img').toArray()){
  assert.equal($(image).attr('loading'),'lazy');assert.ok($(image).attr('width')&&$(image).attr('height')&&$(image).attr('srcset'));
 }
 assert.equal($('header a[href="/gallery/"],header a[href="/#projects"]').length,0,'Gallery removed from menu.');
 if(family==='all')assert.equal(rendered.length,library.items.length,'Full gallery page contains the complete retained library.');
}
const redirect=await fs.readFile('dist/gallery/index.html','utf8');assert.match(redirect,/http-equiv="refresh" content="0;url=\/#projects"/);
assert.match(await fs.readFile('public/.htaccess','utf8'),/RewriteRule \^gallery\/\?\$ \/#projects \[R=301,L,NE\]/);
console.log(`${library.items.length} optimized photos; homepage paging, topic galleries on all 84 service pages and GAF catalog, and the approved gallery redirect passed.`);
