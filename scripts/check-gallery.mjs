import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
const library=JSON.parse(await fs.readFile('src/data/project-gallery.json','utf8'));
const media=JSON.parse(await fs.readFile('src/data/gallery-media.json','utf8'));
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const sourceByAsset=new Map();
for(const item of library.items){
 const record=media[item.src];assert.ok(record.width>0&&record.height>0,'Retain real source dimensions.');
 if(record.width<800)assert.equal(item.contain,true,'Small originals must be contained, never stretched to fill a card.');
 assert.equal(new Set(record.variants.map(v=>v.width)).size,record.variants.length,'Unique srcset widths.');
 for(const variant of record.variants){assert.ok(variant.width<=record.width);assert.ok((await fs.stat('public'+variant.src)).size<=180000);}
 sourceByAsset.set(record.variants.at(-1).src,item);
}
function topic(family){
 if(family==='painting')return 'painting';
 if(family==='commercial-siding'||family.startsWith('siding'))return 'siding';
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
 const gallery=$('.rk-editorial-gallery');if(editorial[path]?.reviewPresentation?.hideGallery){assert.equal(gallery.length,0,path+' omits irrelevant residential photos');continue;}assert.equal(gallery.length,1,path+' needs one gallery.');
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
 if(family==='local')for(const card of rendered.toArray())assert.ok(!['company','other'].includes($(card).attr('data-photo-kind')),'Local exterior galleries exclude company and unrelated references.');
}
const inventory=JSON.parse(await fs.readFile('migration/client-gallery-inventory.json','utf8'));
const homepage=await fs.readFile('dist/index.html','utf8');
for(const record of inventory.records)assert.ok(!homepage.includes(record.driveId),'Do not serialize private source-file IDs into the public gallery.');
assert.equal(inventory.records.length,98,'Account for every supplied image file.');
assert.equal(new Set(inventory.records.map(r=>r.driveId)).size,98);
const ids=new Map(library.items.map(i=>[i.id,i]));const hashes=new Set();let bytes=0;
for(const record of inventory.records){
 assert.ok(['gallery','duplicate','non-photographic'].includes(record.disposition));
 if(record.disposition==='non-photographic'){assert.ok(record.reason);assert.ok(!record.galleryId);continue;}
 const item=ids.get(record.galleryId);assert.ok(item,'Every photograph must have a gallery destination: '+record.filename);
 assert.ok(item.sourceIds.includes(record.driveId),'Keep duplicate-file provenance on its canonical photo.');
 assert.ok(item.tags.length&&item.caption&&item.alt&&item.sourceLabel);
 if(record.disposition==='duplicate'){assert.ok(inventory.records.some(r=>r.driveId===record.duplicateOf&&r.disposition==='gallery'));continue;}
 assert.ok(!hashes.has(record.sha256),'Exact duplicate photographs must not be separate gallery entries.');hashes.add(record.sha256);
 for(const variant of record.optimization.variants){
  const buffer=await fs.readFile('public'+variant.src);const meta=await sharp(buffer).metadata();
  assert.equal(meta.format,'webp');assert.equal(meta.width,variant.width);assert.ok(meta.width<=record.width&&meta.height<=record.height);
  assert.ok(!meta.exif&&!meta.xmp&&!meta.iptc,'Strip embedded camera and location metadata.');
  assert.equal(buffer.length,variant.bytes);assert.ok(buffer.length<=180000);bytes+=buffer.length;
 }
 if(['inspection','manufacturer','reference','third-party','other'].includes(record.kind))assert.match(item.sourceLabel,/reference/i,'Reference photos need a visible reference label.');
}
assert.equal(bytes,inventory.summary.optimizedBytes);
assert.equal(inventory.summary.totalGalleryPhotos,library.items.length);
assert.equal(inventory.records.filter(r=>r.disposition==='gallery').length,77);
assert.equal(inventory.records.filter(r=>r.disposition==='duplicate').length,9);
assert.equal(inventory.records.filter(r=>r.disposition==='non-photographic').length,12);
const redirect=await fs.readFile('dist/gallery/index.html','utf8');assert.match(redirect,/http-equiv="refresh" content="0;url=\/#projects"/);
assert.match(await fs.readFile('public/.htaccess','utf8'),/RewriteRule \^gallery\/\?\$ \/#projects \[R=301,L,NE\]/);
console.log(`${library.items.length} optimized gallery photos; all 98 supplied image files accounted for, reference labels, no enlargement, stripped metadata, topic galleries, paging and approved redirect passed.`);
