import {assertContactActions} from './contact-checks.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8')).routes;
const inventory=JSON.parse(await fs.readFile('migration/location-service-review.json','utf8')).locations;
const profiles=JSON.parse(await fs.readFile('src/data/location-profiles.json','utf8'));
assert.equal(inventory.length,24);
const headings=new Set();
for(const location of inventory){
 const data=editorial[location.path];const $=cheerio.load(await fs.readFile('dist'+location.path+'index.html','utf8'));
 const explorer=$('[data-component=ServicePaths]');assert.equal(explorer.length,1,location.path);
 assert.equal(explorer.find('[data-service-panel]').length,11);
 assert.equal(explorer.find('.has-scrollable-tabs').length,1);
 assert.deepEqual(data.opening.items.slice(0,3).map(i=>i.tabLabel),['Roofing','Siding','Storm damage']);
 assert.ok(explorer.find('h2').text().includes(location.city));
 for(const heading of $('main h2:not(#quote-dialog-title)').toArray())assert.ok($(heading).text().includes(location.city),'Location-specific section heading: '+location.path+' '+$(heading).text());
 const destinations=new Set(explorer.find('a[href]').toArray().map(a=>$(a).attr('href')));
 for(const child of location.childRoutes)assert.ok(destinations.has(child),'Every local descendant is reachable: '+child);
 for(const item of data.opening.items){
  assert.ok($('#'+item.id+' h3').text().includes(location.city));
  assert.ok(destinations.has(item.href));
  for(const related of item.related)assert.ok(destinations.has(related.href));
 }
 const primary=data.opening.items.slice(0,3);const minimum=[180,170,150];
 for(const [index,item] of primary.entries())assert.ok($('#'+item.id).find('p,h3,h4,a').toArray().map(el=>$(el).text()).join(' ').split(/\s+/).length>=minimum[index],'Substantial lead-service content: '+location.path+' '+item.tabLabel);
 const profile=profiles.find(p=>p.city===location.city);
 for(const key of ['context','roof','siding','storm'])assert.ok($('main').text().includes(profile[key]),'Keep authored local context: '+location.path+' '+key);
 assert.ok(!headings.has(data.opening.title));headings.add(data.opening.title);
 assert.equal($('[data-component=ServiceArticle]').length,0,'Location hubs remain full-service selectors.');
 assert.equal($('dialog.rk-native-quote-dialog').length,1);
 assertContactActions($);
}
const cleveland=editorial['/cleveland-oh/'];assert.equal(cleveland.opening.items[0].href,'/cleveland-oh/roofing/');assert.equal(cleveland.opening.items[1].href,'/siding/');assert.equal(cleveland.opening.items[2].href,'/cleveland-oh/storm-damage/');
assert.equal(editorial['/dublin-oh/'].opening.items[0].href,'/roofing-contractor-dublin-oh/');
assert.equal(editorial['/akron-oh/'].opening.items[0].href,'/roofing/');
assert.equal(manifest.filter(r=>!['authored-blog-hub','blog-canonical','authored-topic-archive','authored-manufacturer-products','authored-product-accessories','authored-ply-gem-products','authored-trex-collections'].includes(r.source)).length,244,'No duplicate location/service routes created; manufacturer product routes are counted separately.');
console.log('24 full-service hubs: localized section headings, roofing/siding/storm priority, all local descendants, main-service fallbacks and 11 scrollable choices passed.');
