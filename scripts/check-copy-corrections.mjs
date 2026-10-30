import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {assertContactActions} from './contact-checks.mjs';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const catalogs=await Promise.all(['product-catalog','manufacturer-products','product-accessories','ply-gem-products'].map(name=>read(`src/data/${name}.json`)));
const products=Object.assign({},...catalogs),details=await read('src/data/product-details.json'),profiles=await read('src/data/product-care.json');
const html=async path=>load(await fs.readFile('dist'+path+'index.html','utf8'));
const seen=new Set();let count=0;
for(const [path,detail]of Object.entries(details)){
 const $=await html(path),product=products[detail.key],care=$(`[data-product-care="${product.id}"]`),type=care.attr('data-care-type');
 assert.equal(care.length,1,path+' one relevant care section');assert.ok(profiles[type],path+' documented care profile');seen.add(type);
 const expected=product.care||profiles[type];assert.equal(care.find('h2').text(),expected.title,path);assert.deepEqual(care.find('h3').map((_,e)=>$(e).text()).get(),expected.items.map(i=>i.title));
 for(const item of expected.items)assert.ok(care.text().includes(item.body),path+' complete practical guidance');
 assert.ok(care.text().includes(expected.footnote));assert.ok(care.find('a[title]').length>=1);assert.equal($('[data-product-energy]').length,!product.brand||product.brand==='GAF'?1:0,path+' no GAF roof measurements on another product');
 if(product.brand&&product.brand!=='GAF')assert.ok(!$('#specifications').text().includes('CRRC'));
 for(const link of $('.rk-product-document').toArray())assert.equal($(link).text().includes('(PDF)'),new URL($(link).attr('href'),'https://www.roofkingco.com').pathname.toLowerCase().endsWith('.pdf'),path+' accurate document format');
 assertContactActions($);count++;
}
assert.deepEqual([...seen].sort(),Object.keys(profiles).sort(),'Every care profile has a product consumer.');
const typeCases={'/products/siding/vinyl/ply-gem/cedar-dimensions/':'polypropylene','/products/decking/composite/trex/refuge/':'pvc','/products/decking/composite/trex/rainescape/':'drainage','/products/decking/composite/trex/deck-lighting/':'lighting','/products/decking/composite/trex/hideaway-fasteners/':'fasteners'};
for(const [path,type]of Object.entries(typeCases))assert.equal((await html(path))('[data-product-care]').attr('data-care-type'),type,path);
const lineage=await html('/products/decking/composite/trex/lineage/');
assert.deepEqual(lineage('.rk-product-document').map((_,e)=>lineage(e).text().replace('↗','').trim()).get(),['Trex Lineage product information','Trex installation guides']);
const contactPage=await html('/contact-us/');
assert.equal(contactPage('.rk-contact-heading>p').last().text(),'Call our team to discuss your project, or choose a time for an inspection using our online calendar.');
assert.equal(contactPage('.rk-home-final-cta .rk-home-eyebrow').first().text(),'Ready to discuss your project?');
const repairPage=await html('/roofing/repair/');
assert.equal(repairPage('#service-gallery h2').text(),'Roofing and exterior photos');
assert.equal(lineage('[data-product-care] h2').text(),'Deck lifespan and long-term care');
assert.deepEqual(lineage('.rk-product-badge strong').map((_,e)=>lineage(e).text()).get(),['Wood-plastic composite','Refined wood grain','7 options','50-year limited']);
assert.ok(lineage('#specifications>p').first().text().startsWith('Compare the board material, surface texture, available colors and care requirements.'));
for(const url of ['care-and-cleaning','downloads','warranty'])assert.equal(lineage(`[data-product-care] a[href="https://www.trex.com/customer-support/trex-owners/${url}/"]`).length,1);
const cases={
 '/roof-repair-dublin-oh/':['Common roof repairs in Dublin','Water coming in? Call our team','Finding the source of your roof leak','What your roof repair includes','Should you repair or replace your roof?','What affects roof repair costs in Dublin?','Roof repair financing','Roofing and exterior photos'],
 '/roofing/repair/':['Finding the source of a roof leak','How we repair the affected area','Repairing a leaking pipe boot','Repairing wall and chimney flashing']
};
for(const [path,expected]of Object.entries(cases)){const $=await html(path),headings=$('main h2,main h3').map((_,e)=>$(e).text()).get();for(const heading of expected)assert.ok(headings.includes(heading),path+' '+heading);assert.equal($('.rk-service-hero-credit').text(),'Roof repair illustration.');assert.equal($('.rk-comparison-caption').text(),'Illustrated roof repair comparison - not a completed Roof King project.');assertContactActions($);}
const dublin=await html('/roof-repair-dublin-oh/');assert.ok(dublin('figcaption').toArray().some(e=>dublin(e).text()==='Photo supplied by Roof King.'));assert.equal(lineage('.rk-service-hero-credit').text(),'Manufacturer photo courtesy of Trex.');
const sitemap=load(await fs.readFile('dist/sitemap.xml','utf8'),{xmlMode:true});let contacts=0;
for(const url of sitemap('loc').map((_,e)=>sitemap(e).text()).get()){const $=await html(new URL(url).pathname);if($('#quote-form [data-contact-actions]').length){assertContactActions($);contacts++;}}
console.log(`PDF corrections passed; ${count} product pages use ${seen.size} material/component care profiles, and ${contacts} canonical pages show working booking/phone actions instead of unavailable forms.`);
