import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import * as cheerio from 'cheerio';
const catalog=JSON.parse(await fs.readFile('src/data/product-catalog.json','utf8'));
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
for(const [path,data]of Object.entries(detailRecords)){
  const detail=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
  assert.equal(detail('h1').length,1);assert.equal(detail('main').length,1);
  assert.equal(detail('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
  const labels=detail('.rk-native-breadcrumbs li').map((i,e)=>detail(e).text()).get();
  assert.deepEqual(labels,['Home','Products','Roofing Products','Shingles','GAF',data.title]);
  const schemas=detail('script[type="application/ld+json"]').toArray().map(e=>JSON.parse(detail(e).text()));
  const breadcrumbs=schemas.find(s=>s['@type']==='BreadcrumbList');
  assert.deepEqual(breadcrumbs.itemListElement.map(i=>i.name),labels);
  assert.equal(schemas.find(s=>s['@type']==='Product').name,data.title);
  assert.equal(schemas.find(s=>s['@type']==='Product').offers,undefined);
  assert.equal(detail('.rk-product-details details').length,2);
  assert.equal(detail('.rk-product-photo .rk-product-badge').length,4);
  const record=catalog[data.key];
  assert.equal(detail('[data-component=ProductCompanions]').length,record.id==='timberline-hdz'?1:0,'Pairings require an explicit reviewed mapping.');
  if(record.id==='timberline-hdz'){
    assert.equal(detail('[data-companion]').length,5);
    assert.equal(detail('[data-companion] a[href^="https://www.gaf.com/"]').length,5);
    assert.ok(detail('#roof-system').text().includes('do not add a guaranteed number of years'));
    assert.ok(detail('#roof-system').text().includes('intake'));
  }
  assert.equal(detail('.rk-product-swatches a').length,record.colors.length);
  assert.ok($(`a[href="${path}"]`).length,'GAF catalog must link to each detail record');
}
assert.equal(Object.keys(detailRecords).length,11);
assert.deepEqual($('.rk-native-breadcrumbs li').map((i,e)=>$(e).text()).get(),['Home','Products','Roofing Products','Shingles','GAF']);
assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com/roofing/gaf/types/');
for(const path of ['/products/','/products/roofing/','/products/roofing/shingles/']){
  const hub=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));assert.equal(hub('h1').length,1);assert.equal(hub('[data-product-pillar="native"]').length,1);
}
console.log('Three product hubs, eleven individual product records, logical breadcrumbs/schema and retained catalog canonical passed.');
