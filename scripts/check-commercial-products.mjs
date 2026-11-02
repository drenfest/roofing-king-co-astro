import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import sharp from 'sharp';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const catalog=await read('src/data/commercial-products.json');
const details=await read('src/data/product-details.json');
const hubs=await read('src/data/product-pillar.json');
const companions=await read('src/data/commercial-product-companions.json');
const evidence=await read('migration/mule-hide-commercial-sources.json');
const summary=await read('migration/mule-hide-catalog-summary.json');
const manifest=await read('migration/route-manifest.json');
const inventory=await read('migration/url-inventory.json');
const paths=new Set(manifest.routes.map(r=>r.path));
assert.equal(paths.size,manifest.routes.length,'Unique canonical routes');
for(const original of inventory.rows)assert.ok(paths.has(original.path),'Preserve existing URL: '+original.path);
assert.equal(Object.keys(catalog).length,172);
assert.equal(evidence.records.length,Object.keys(catalog).length);
assert.equal(evidence.categories.length,10);
const bySource=new Map(evidence.records.map(r=>[r.url,r]));
for(const category of evidence.categories)for(const url of category.productUrls)assert.ok(bySource.has(url)||evidence.excluded.some(e=>e.url===url),'Every discovered category product has a disposition: '+url);
for(const [category,count] of [['TPO',7],['EPDM',5],['EdgeMetal',34]])assert.equal(evidence.records.filter(r=>r.categories.includes(category)).length,count);
let relationCount=0;
for(const product of Object.values(catalog)){
 const record=bySource.get(product.sourceUrl);assert.ok(record,product.id+' source');
 assert.ok(!/\bPVC\b/i.test(JSON.stringify(product)),product.id+' excludes PVC offerings');
 assert.equal(details[product.detailPath].key,product.id);assert.ok(paths.has(product.detailPath));
 assert.ok(product.thumbnail&&product.thumbnail.width<=160);
 assert.ok(product.hero.srcset.includes('160w'),product.id+' responsive thumbnail');
 assert.ok(product.manufacturerData);assert.ok(product.documents.length);
 const set=companions[product.id];
 for(const item of set?.items||[]){
  relationCount++;const related=catalog[item.relatedProduct];assert.ok(related,'Shared component canonical product: '+item.id);
  const target=bySource.get(related.sourceUrl);assert.ok(target);
  assert.ok(record.related.includes(target.url)||target.related.includes(record.url)||record.systems.some(system=>/TPO|EPDM/i.test(system)&&target.systems.includes(system)),'Source-backed related/system-family relationship: '+product.id+' / '+item.id);
 }
 if(process.argv.includes('--source-only'))continue;
 const $=load(await fs.readFile('dist'+product.detailPath+'index.html','utf8'));
 assert.equal($('[data-component=ProductHero]').length,1);
 assert.equal($('.rk-product-card-detail[data-product="'+product.id+'"]').length,1);
 assert.equal($('[data-product-panel]').length,set?3:2);
 assert.equal($('#specifications dl>div').length,product.specs.length);
 assert.equal($('#product-comparison').length,0);
 assert.ok($('.rk-product-hero-logo[src="/media/brands/mule-hide.webp"]').length);
 assert.ok($('a[href="/commercial-roofing/"]').length);
 assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+product.detailPath);
 assert.equal($('#specifications [data-manufacturer-data]').length,1);
 assert.equal($('#specifications .rk-manufacturer-table tbody tr').length,product.manufacturerData.options.length);
 assert.equal($('[data-companion]').length,set?.items.length||0);
 for(const item of set?.items||[])assert.ok($('#roof-system a[href="'+catalog[item.relatedProduct].detailPath+'"]').length);
}
assert.equal(relationCount,summary.companionLinks);
for(const product of Object.values(catalog))assert.ok(Object.values(hubs).some(h=>h.catalogItems?.some(item=>item.productId===product.id)),product.id+' collection discoverability');
for(const asset of evidence.assets)for(const variant of asset.variants){
 const raw=await fs.readFile('public'+variant.src),meta=await sharp(raw).metadata();
 assert.equal(raw.length,variant.bytes);assert.equal(meta.width,variant.width);assert.equal(meta.height,variant.height);
 assert.ok(meta.width<=asset.sourceWidth&&meta.height<=asset.sourceHeight);assert.ok(!meta.exif&&!meta.xmp&&!meta.iptc);assert.ok(raw.length<260000);
}
if(!process.argv.includes('--source-only'))for(const path of ['/commercial-roofing/','/commercial-roofing/repair/','/commercial-roofing/replacement/','/commercial-roofing/roof-types/','/commercial-roofing/gutters/']){
 const $=load(await fs.readFile('dist'+path+'index.html','utf8'));
 assert.ok($('[data-brand-id="mule-hide"]').length,path+' manufacturer logo');
 assert.ok($('main a[href^="/products/roofing/commercial/mule-hide/"]').length,path+' product links');
 assert.ok(!/\bPVC\b/i.test($('main').text()),path+' excludes PVC offerings');
}
console.log('Commercial catalog: '+Object.keys(catalog).length+' sourced products, '+Object.keys(companions).length+' related-component sets, '+relationCount+' source-backed links and '+evidence.assets.flatMap(a=>a.variants).length+' image variants verified'+(process.argv.includes('--source-only')?' in source; rendered CI checks remain separate.':'.'));
