import fs from 'node:fs/promises';import assert from 'node:assert/strict';import sharp from 'sharp';import * as cheerio from 'cheerio';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const products=await read('src/data/manufacturer-products.json'),evidence=await read('migration/sources/product-expansion.json'),details=await read('src/data/product-details.json'),hubs=await read('src/data/product-pillar.json'),report=await read('migration/product-image-optimization.json');
const navigation=await read('src/data/navigation.json');
const menuPaths=new Set();function walkMenu(items){for(const item of items){menuPaths.add(item.href);walkMenu(item.children);}}walkMenu(navigation.items);
assert.equal(Object.keys(products).length,62);let options=0;
const used=new Set();
for(const [key,p]of Object.entries(products)){
 assert.ok(menuPaths.has(p.detailPath)||p.brand==='Trex'&&Object.entries(hubs).some(([path,h])=>menuPaths.has(path)&&h.catalogItems?.some(i=>i.productId===p.id)),'Product or collection must be reachable from its brand submenu: '+p.detailPath);
 const source=evidence.records[key];assert.ok(source,key);assert.equal(p.brand,source.brand);assert.equal(p.detailPath,source.detailPath);assert.deepEqual(p.specs,source.specs);
 const data=details[p.detailPath];assert.equal(data.key,key);assert.ok(p.colors.some(c=>c.id===p.defaultColorId));assert.equal(new Set(p.colors.map(c=>c.id)).size,p.colors.length);
 assert.equal(p.colors.length,source.options.length);assert.ok(p.specs.length>=5);assert.ok(p.documents.length>0);assert.ok(p.warrantyUrl.startsWith('https://'));assert.ok(p.warrantyLabels.length>0);
 for(const b of p.badges){assert.ok(p.specs.some(s=>s.label===b.specLabel));assert.ok(p.badgeExplanations[b.label]?.sourceUrl===p.sourceUrl,'Manufacturer-specific badge explanations required.');}
 const page=cheerio.load(await fs.readFile('dist'+p.detailPath+'index.html','utf8'));
 assert.equal(page('main').length,1);assert.equal(page('h1').length,1);assert.equal(page('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+p.detailPath);assert.deepEqual(page('.rk-native-breadcrumbs li').map((_,e)=>page(e).text()).get(),data.breadcrumbs.map(c=>c.label));
 assert.equal(page('article[data-product]').attr('data-product-brand'),p.brand);assert.equal(page('#specifications dl>div').length,p.specs.length);assert.equal(page('[data-product-panel]').length,3);
 const schemas=page('script[type="application/ld+json"]').toArray().flatMap(e=>{const s=JSON.parse(page(e).text());return s['@graph']||[s];});const schema=schemas.find(s=>s['@type']==='Product');assert.equal(schema.brand.name,p.brand);assert.equal(schema.offers,undefined,'No invented price or stock.');
 assert.equal(page('.rk-product-swatches a').length,p.colors.length>1?p.colors.length:0);assert.equal(page('.rk-product-photo img').attr('src'),(p.colorPreview?.image||p.colors.find(c=>c.id===p.defaultColorId).image).src);
 if(p.previewMode==='palette'){assert.ok(page('.rk-product-reference-note').text().includes(p.colorPreview?'physical sample':'photo shows the product style'));assert.equal(new Set(p.colors.map(c=>c.image.src)).size,1,'Palette selection must not simulate recolored product photographs.');}
 for(const [i,c]of p.colors.entries()){assert.equal(c.name,source.options[i].name);assert.equal(c.sourceImageUrl,source.options[i].sourceImageUrl);assert.equal(c.swatchColor,source.options[i].swatchColor);if(c.swatchColor)assert.match(c.swatchColor,/^#[a-f0-9]{3,8}$/i);for(const v of c.image.srcset.split(', ')){used.add(v.split(' ')[0]);}if(c.swatch)used.add(c.swatch);options++;}
 for(const v of p.hero.srcset.split(', '))used.add(v.split(' ')[0]);
 const parent=Object.entries(hubs).find(([,h])=>h.catalogItems?.some(i=>i.productId===p.id))?.[0];assert.ok(hubs[parent].catalogItems.some(i=>i.productId===p.id));
 const hub=cheerio.load(await fs.readFile('dist'+parent+'index.html','utf8'));assert.ok(hub(`a[href="${p.detailPath}"]`).length);
 assert.ok(!/GAF warranty|Read GAF/.test(page('#warranty').text()),'Do not apply GAF coverage to another manufacturer.');
}
for(const asset of report.assets){for(const v of [...asset.variants,...(asset.swatch?[asset.swatch]:[])]){const raw=await fs.readFile('public'+v.src),m=await sharp(raw).metadata();assert.equal(raw.length,v.bytes);assert.equal(m.width,v.width);assert.equal(m.height,v.height);assert.ok(m.width<=asset.sourceWidth&&m.height<=asset.sourceHeight,'No enlargement');assert.ok(!m.exif&&!m.xmp&&!m.iptc,'Strip private metadata');assert.ok(raw.length<260000,'Web image budget');used.delete(v.src);}}
assert.equal(used.size,0,'Every catalog derivative must have source and optimization evidence.');
assert.equal(report.optimizedFiles,report.assets.reduce((n,a)=>n+a.variants.length+(a.swatch?1:0),0));assert.equal(report.optimizedBytes,report.assets.reduce((n,a)=>n+a.variants.reduce((n,v)=>n+v.bytes,0)+(a.swatch?.bytes||0),0));
console.log(`Manufacturer expansion passed: ${Object.keys(products).length} products, ${options} exact options, correct brands/schema, genuine previews and ${report.optimizedFiles} source-backed web images.`);

const previews=await read('migration/product-color-preview-media.json');
assert.equal(Object.values(products).filter(p=>p.colorPreview?.mode==='alpha').length,6);assert.equal(Object.values(products).filter(p=>p.colorPreview?.mode==='mask').length,21);
for(const asset of previews.assets){for(const v of asset.variants){const m=await sharp('public'+v.src).metadata();assert.equal(m.width,v.width);assert.equal(m.height,v.height);assert.ok(!m.exif&&!m.xmp&&!m.iptc);assert.ok(m.width<=asset.sourceWidth&&m.height<=asset.sourceHeight);assert.ok((await fs.stat('public'+v.src)).size<260000);}const svg=await fs.readFile('public'+asset.mask.src,'utf8');assert.ok(!/<script|<image|onload|owner=/i.test(svg));assert.ok(asset.sidingMaskPixels>30);}
for(const p of Object.values(products).filter(p=>p.colorPreview?.mode==='alpha'))assert.ok((await sharp('public'+p.colors[0].image.src).metadata()).hasAlpha,'Native color layers retain transparency.');
console.log('27 interactive siding color previews have manufacturer alpha layers or source-backed siding masks; original product photos, source colors and limited coverage remain separate.');
const manifest=await read('migration/route-manifest.json'),added=manifest.routes.filter(r=>r.source==='authored-manufacturer-products');
assert.equal(added.length,70);for(const route of added){assert.ok(route.path.startsWith('/products/'));assert.ok(hubs[route.path]||details[route.path],'Every additional product route belongs to the native catalog.');}

// Trex deliberately stops at collection links in both menus.
const trexCollections=await read('src/data/trex-collections.json');
const findTrex=items=>items.flatMap(i=>[i,...(i.children?.length?findTrex(i.children):[])]);
const trexMenu=findTrex(navigation.items).find(i=>i.href==='/products/decking/composite/trex/');
assert.deepEqual(trexMenu.children.map(i=>i.href),trexCollections.map(c=>c.path));
assert.ok(trexMenu.children.every(i=>i.children.length===0),'Trex menu stops at categories');
const collectionProducts=[];
for(const collection of trexCollections){const page=cheerio.load(await fs.readFile('dist'+collection.path+'index.html','utf8'));assert.equal(page('[data-product]').length,collection.productIds.length);assert.equal(page('#product-range').length,1);for(const id of collection.productIds){const detail=Object.entries(details).find(([,d])=>d.key===id);assert.ok(detail);assert.ok(page('a[href="'+detail[0]+'"]').length,'Every Trex product remains linked from its collection');assert.ok(!menuPaths.has(detail[0]),'No individual Trex product in menu');assert.ok(detail[1].parentProductId||detail[1].breadcrumbs.at(-2).href===collection.path);collectionProducts.push(id);}}
assert.equal(collectionProducts.length,23);assert.equal(new Set(collectionProducts).size,23);
console.log('Trex menu: three collection links, 23 preserved products, matching breadcrumbs and no product-level menu links passed.');
