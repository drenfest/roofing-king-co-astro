import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8'));
const paths=manifest.routes.filter(route=>route.path.startsWith('/offers/')).map(route=>route.path);
const hub=load(await fs.readFile('dist/offers/index.html','utf8'));
for(const path of paths){
 const $=load(await fs.readFile(`dist${path}index.html`,'utf8'));
 assert.equal($('h1').length,1,path);
 assert.equal($('[data-component=PageHero]').length,1,path);
 assert.equal($('.rk-imported-content,.rk-blog-single,.rk-blog-sidebar,.rk-blog-meta').length,0,path);
 assert.equal($('link[rel=canonical]').attr('href'),`https://www.roofkingco.com${path}`,path);
 assert.equal($('#quote-form button[type=submit]').is('[disabled]'),true,path);
 if(path!=='/offers/')assert.ok(hub(`main a[href="${path}"]`).length,path);
 if(path!=='/offers/' && path!=='/offers/gaf-system-plus/'){
  assert.equal($('[data-component=OfferPage]').length,1,path);
  assert.ok($('[data-component=FAQSection] details').length>=3,path);
  assert.equal($('[data-component=MediaContentRow]').length,1,path);
 }
}
const payments=load(await fs.readFile('dist/offers/payments/index.html','utf8'));
assert.match(payments('main').text(),/financed amount, APR, repayment period/);
assert.match(payments('h1').text(),/\$47/);
assert.ok(payments('.rk-editorial-hero-actions a[href^=tel]').length);
const silver=load(await fs.readFile('dist/offers/gaf-silver-pledge/index.html','utf8'));
assert.ok(silver('main a[href*="reswt210-legal-sample.pdf"]').length);
const golden=load(await fs.readFile('dist/offers/gaf-golden-pledge/index.html','utf8'));
assert.ok(golden('main a[href*="reswt161l.pdf"]').length);
const home=load(await fs.readFile('dist/index.html','utf8'));
assert.match(home('.rk-home-offers').text(),/\$47/);
const navigation=JSON.parse(await fs.readFile('src/data/navigation.json','utf8'));
const about=navigation.items.find(item=>item.href==='/about-us/');
for(const path of [about.href,...about.children.map(item=>item.href)]){
 const $=load(await fs.readFile(`dist${path}index.html`,'utf8'));
 assert.equal($('.rk-imported-content').length,0,path);
 assert.equal($('h1').length,1,path);
 assert.doesNotMatch($('main').text(),/#TITLE|Roof King Blog/);
 assert.equal($('main a[href="/gallery/"]').length,0,path);
}
console.log(`${paths.length} native offer URLs: hub destinations, canonical paths, shared components, qualified financing, official GAF sources and disabled forms passed. All About menu destinations use native pages.`);
