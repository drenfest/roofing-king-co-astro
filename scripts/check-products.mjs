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
