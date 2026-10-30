import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import * as cheerio from 'cheerio';
const catalog=JSON.parse(await fs.readFile('src/data/product-catalog.json','utf8'));
const energy=JSON.parse(await fs.readFile('src/data/product-energy.json','utf8'));
assert.equal(energy.rows.length,13);
for(const row of energy.rows){assert.ok(row.solarReflectance>=0&&row.solarReflectance<=1);assert.ok(row.thermalEmittance>=0&&row.thermalEmittance<=1);assert.equal(row.agedStatus,'Pending');}
const evidence=JSON.parse(await fs.readFile('migration/sources/gaf-product-catalog.json','utf8'));
const $=cheerio.load(await fs.readFile('dist/roofing/gaf/types/index.html','utf8'));
assert.equal($('.rk-product-card').length,Object.keys(catalog).length);
assert.equal($('[data-legacy-product]').length,2,'Keep unresolved catalog entries visible without invented variants.');
assert.equal(Object.keys(catalog).length,11);
let colors=0;
for(const [title,product]of Object.entries(catalog)){
  const card=$(`[data-product="${product.id}"]`);
  assert.equal(card.length,1);
  assert.equal(card.find('.rk-product-details details').length,2);
  assert.equal(card.find('.rk-product-details dl > div').length,product.specs.length);
  assert.equal(card.find('.rk-product-swatches a[href]').length,product.colors.length,'Every color needs a non-JS image link.');
  assert.equal(product.colors.length,new Set(product.colors.map(c=>c.id)).size);
  assert.ok(product.warrantyLabels.length>0);
  assert.deepEqual(product.specs,evidence.records[title].specs);
  assert.deepEqual(product.badges,evidence.records[title].badges);
  assert.equal(card.find('[data-product-energy]').length,1);
  assert.equal(card.find('.rk-product-energy tbody tr').length,energy.rows.filter(r=>r.productId===product.id).length);
  assert.equal(card.find('.rk-product-photo .rk-product-badge').length,4);
  assert.equal(card.find('.rk-product-badge-disclosure summary').length,4);
  assert.equal(card.find('.rk-product-badge-icon').length,4);
  assert.equal(card.find('.rk-product-badge-explanation a[href]').length,4);
  for(const badge of product.badges){assert.ok(product.specs.some(s=>s.label===badge.specLabel));
    assert.ok(card.find('summary[aria-label="Explain '+badge.label+': '+badge.value+'"]').length);
  }
  assert.ok(card.find('[data-kind="wind"] summary').text().includes('150 mph'));
  assert.ok(card.find('[data-kind="wind"] .rk-product-badge-explanation').text().includes('110 mph'));
  assert.ok(card.find('[data-kind="wind"] .rk-product-badge-explanation').text().includes('not a prediction'));
  assert.equal(product.specs.find(s=>s.label==='Expected lifespan').value,'20–25 years — general residential roof guide');
  assert.ok(card.find('[data-kind=lifespan] summary').text().includes('General roof guide'));
  assert.ok(card.find('[data-kind=fire] summary').text().includes('Severe exposure'));
  if(product.badges.find(b=>b.label==='Impact').value==='Class 3')assert.ok(card.find('[data-kind=impact] .rk-product-badge-explanation').text().includes('17 feet'));
  if(product.badges.find(b=>b.label==='Impact').value==='Class 4')assert.ok(card.find('[data-kind=impact] .rk-product-badge-explanation').text().includes('20 feet'));
  assert.ok(product.specs.find(s=>s.label==='Expected lifespan').note.includes('not a lifespan guarantee'));
  assert.ok(product.sourceUrl.startsWith('https://www.gaf.com/'));
  const selected=product.colors.find(c=>c.id===product.defaultColorId);
  assert.ok(selected,'Default color must belong to this product');
  assert.equal(card.find('.rk-product-photo img').attr('src'),selected.image.src);
  assert.ok(card.find('.rk-product-photo img').attr('alt').includes(selected.name));
  assert.ok(card.find('.rk-product-color-caption').text().includes(selected.name));
  for(const color of product.colors){
    const source=evidence.records[title].colors.find(c=>c.id===color.id);
    assert.equal(source.name,color.name);assert.equal(source.sourceImageUrl,color.sourceImageUrl,'Product/color identity must match manufacturer evidence.');
    const assets=[color.image.src,color.swatch,...color.image.srcset.split(', ').map(item=>item.split(' ')[0])];
    for(const src of new Set(assets)){
      assert.ok(src.startsWith('/media/products/'));
      const metadata=await sharp('dist'+src).metadata();assert.ok(metadata.width&&metadata.height);
    }
    assert.ok(color.image.width&&color.image.height);
    colors++;
  }
}
assert.equal(colors,73);
console.log(`Product/color provenance, all variant assets, default SSR images, no-JS links and warranty/spec panels passed for 11 products / ${colors} colors.`);
const detailRecords=JSON.parse(await fs.readFile('src/data/product-details.json','utf8'));
for(const [path,data]of Object.entries(detailRecords).filter(([,data])=>catalog[data.key])){
  const detail=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
  assert.equal(detail('h1').length,1);assert.equal(detail('main').length,1);
  assert.equal(detail('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
  const labels=detail('.rk-native-breadcrumbs li').map((i,e)=>detail(e).text()).get();
  assert.deepEqual(labels,['Home','Products','Roofing Products','Shingles','GAF',data.title]);
  const schemas=detail('script[type="application/ld+json"]').toArray().flatMap(e=>{const schema=JSON.parse(detail(e).text());return schema['@graph']||[schema];});
  const breadcrumbs=schemas.find(s=>s['@type']==='BreadcrumbList');
  assert.deepEqual(breadcrumbs.itemListElement.map(i=>i.name),labels);
  assert.equal(schemas.find(s=>s['@type']==='Product').name,data.title);
  assert.equal(schemas.find(s=>s['@type']==='Product').offers,undefined);
  assert.equal(detail('.rk-product-details details').length,0);
  assert.equal(detail('[data-product-panel]').length,3);
  assert.equal(detail('#specifications dl > div').length,catalog[data.key].specs.length);
  assert.equal(detail('.rk-product-tab-nav a').length,3);
  assert.equal(detail('.rk-product-photo .rk-product-badge').length,4);
  const record=catalog[data.key];
  assert.equal(detail('[data-component=ProductCompanions]').length,1,'Pairings require an explicit reviewed mapping.');
  if(record.id==='timberline-hdz'){
    assert.equal(detail('[data-companion]').length,5);
    assert.equal(detail('.rk-accessory-photo img[width][height][alt]').length,5);
    assert.equal(detail('.rk-accessory-infographic svg[role=img]').length,5);
    assert.equal(detail('.rk-accessory-infographic figcaption').length,5);
    for(const img of detail('.rk-accessory-photo img').toArray()){const asset=detail(img).attr('src');const meta=await sharp('dist'+asset).metadata();assert.equal(meta.width,Number(detail(img).attr('width')));}
    assert.equal(detail('[data-companion] a[href^="https://www.gaf.com/"]').length,5);
    assert.ok(detail('#roof-system').text().includes('do not add a guaranteed number of years'));
    assert.ok(detail('#roof-system').text().includes('intake'));
  }
  assert.equal(detail('.rk-product-swatches a').length,record.colors.length);
  assert.ok($(`a[href="${path}"]`).length,'GAF catalog must link to each detail record');
}
assert.equal(Object.values(detailRecords).filter(data=>catalog[data.key]).length,11);
assert.deepEqual($('.rk-native-breadcrumbs li').map((i,e)=>$(e).text()).get(),['Home','Products','Roofing Products','Shingles','GAF']);
assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com/roofing/gaf/types/');
for(const path of ['/products/','/products/roofing/','/products/roofing/shingles/']){
  const hub=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));assert.equal(hub('h1').length,1);assert.equal(hub('[data-product-pillar="native"]').length,1);
}
console.log('Three product hubs, eleven individual product records, logical breadcrumbs/schema and retained catalog canonical passed.');

const brandPages=JSON.parse(await fs.readFile('src/data/brand-pages.json','utf8'));
const hubs=JSON.parse(await fs.readFile('src/data/product-pillar.json','utf8'));
const homeBrands=cheerio.load(await fs.readFile('dist/index.html','utf8'));
for(const name of ['Variform','LP SmartSide','Trex','James Hardie','Ply Gem','Alu-Rex','LeafFilter']){
  const path=brandPages[name];assert.ok(homeBrands('.rk-home-brand-mark[href="'+path+'"]').length,'Logo must link internally: '+name);
  const page=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));assert.equal(page('h1').length,1);assert.equal(page('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
  assert.ok(page('.rk-native-breadcrumbs').text().includes(name));assert.ok(page(`a[href="${hubs[path].reference.href}"]`).length,'Primary manufacturer reference required: '+path);
}
for(const path of Object.keys(hubs)){const page=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));assert.equal(page('[data-product-pillar=native]').length,1);}
console.log('Seven internal brand overviews, shared logo links and all material/category hubs passed.');

const brandLibrary=JSON.parse(await fs.readFile('src/data/brand-library.json','utf8'));
const services=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
const home=JSON.parse(await fs.readFile('src/data/home.json','utf8'));
assert.deepEqual(new Set(home.brands.brandIds),new Set(Object.keys(brandLibrary)),'Homepage must include every inventoried brand/product line.');
for(const [id,brand]of Object.entries(brandLibrary)){
  const meta=await sharp('dist'+brand.image.src).metadata();
  assert.equal(meta.width,brand.image.width);assert.equal(meta.height,brand.image.height);
  assert.equal(homeBrands('[data-brand-id="'+id+'"]').attr('href'),brandPages[brand.pageKey]);
}
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const selections=[['/',home.brands],...Object.entries(editorial).filter(([path,data])=>!data.reference).map(([path,data])=>[path,{brandIds:data.brandIds}]),...Object.entries(services).filter(([path])=>!editorial[path]||editorial[path].reference).flatMap(([path,page])=>page.sections.filter(s=>s.type==='brands').map(s=>[path,s])),...Object.entries(hubs).filter(([path,hub])=>hub.brands).map(([path,hub])=>[path,hub.brands])];
for(const [path,section]of selections){const page=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));assert.deepEqual(page('.rk-block-trusted-brands [data-brand-id]').map((i,e)=>page(e).attr('data-brand-id')).get(),section.brandIds);for(const id of section.brandIds){assert.ok(brandLibrary[id]);assert.ok(page('[data-brand-id="'+id+'"] img[width][height]').length);}}
assert.deepEqual(services['/cleveland-oh/roofing/'].sections.find(s=>s.type==='brands').brandIds,['gaf']);
console.log('Per-page brand selections, homepage mix, roofing-only GAF and sized brand images passed.');
/* Protect the complete product presentation, not just the original three hubs. */
for(const path of [...Object.keys(hubs),...Object.keys(detailRecords)]){
 const page=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 const hero=page('[data-component=ProductHero]');assert.equal(hero.length,1,'Product route needs its image-led hero: '+path);
 const image=hero.children('img');assert.equal(image.attr('loading'),'eager');assert.equal(image.attr('fetchpriority'),'high');
 assert.ok(image.attr('src').endsWith('.webp'),'Optimized hero fallback: '+path);assert.ok(image.attr('srcset'));
 assert.ok(Number(image.attr('width'))>0&&Number(image.attr('height'))>0);
 const asset=await sharp('dist'+image.attr('src')).metadata();assert.ok(asset.width&&asset.height);
 const target=hero.find('a[href^="#"]').attr('href');assert.ok(target&&page(target).length,'Hero action must reach real content: '+path);
 if(hubs[path]){
  const data=hubs[path],text=page('main').text().replace(/\s+/g,' ');
  assert.ok(text.includes(data.copy));
  assert.equal(page('.rk-product-guidance-grid h3').length,data.secondary.length);
  for(const item of data.secondary){assert.ok(text.includes(item.copy),'Keep comparison copy: '+path);if(item.href)assert.ok(page('main a[href="'+item.href+'"]').length);}
  for(const card of data.cards){assert.ok(page('.rk-product-hub-card[href="'+card.href+'"] h3').length,'Preserve child destinations and heading hierarchy');assert.ok(text.includes(card.description));}
  const sources=page('.rk-product-hub-card figure>img').map((_,e)=>page(e).attr('src')).get();assert.equal(new Set(sources).size,sources.length,'Distinct pictures within every collection: '+path);
 }
}
const collectionMedia=JSON.parse(await fs.readFile('src/data/product-collection-media.json','utf8'));
for(const record of Object.values(collectionMedia))for(const variant of record.variants){
 const filename='dist'+variant.src,meta=await sharp(filename).metadata();assert.equal(meta.width,variant.width);assert.equal(meta.height,Math.round(variant.width/1.6));assert.ok((await fs.stat(filename)).size<190000,'Keep material images within their WebP budget');
}
console.log('All 29 product heroes, real jump targets, collection uniqueness, source descriptions/links, subordinate headings and 15 optimized material assets passed.');
