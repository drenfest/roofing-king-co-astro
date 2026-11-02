import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {reviewIdsForService} from '../src/data/service-reviews.ts';

const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const reviews=JSON.parse(await fs.readFile('src/data/featured-reviews.json','utf8')).items;
const routes=['/siding/','/siding/types/','/siding/replacement/','/commercial-siding/','/cincinnati-oh/the-cost-of-siding-replacement/'];
for(const route of routes){
 const $=load(await fs.readFile('dist'+route+'index.html','utf8'));
 assert.equal($('[data-component=ServiceExplorer]').length,1,route+' uses the existing selector');
 assert.equal($('.rk-service-faq details').length,7,route+' has seven relevant FAQs');
 assert.ok($('.rk-service-topic-cards article').length>5,route+' has substantive planning/product cards');
 const expected=reviewIdsForService(editorial[route].family);
 assert.equal($('.rk-home-review-card').length,expected.length,route+' retains sourced customer feedback');
 assert.ok(expected.length>0,route+' must retain a review section');for(const id of expected)assert.ok(reviews.find(review=>review.id===id).services.includes('siding'),route+' prioritizes sourced siding work');
 assert.ok($('main a[href="/offers/5-year-workmanship-warranty/"]').length,route+' links the approved workmanship terms');
 assert.ok(!/\[COMPONENT:|\[SITE\]|\[CONFIRM\]|awaiting approval|not a documented Roof King project/.test($('main').text()),route+' has no report annotations or removed captions');
}
const types=load(await fs.readFile('dist/siding/types/index.html','utf8'));
assert.equal(types('.rk-service-topic-table table').length,1,'Real comparison table in the selector');
assert.equal(types('.rk-service-topic-table thead th[scope=col]').length,4,'Comparable materials plus row labels');
assert.ok(types('.rk-service-topic-table tbody th[scope=row]').length>=7,'Care, finish, climate, coverage and cost are compared');
const siding=load(await fs.readFile('dist/siding/index.html','utf8'));
assert.equal(siding('.rk-material-installation').length,1,'Retain the approved horizontal material selector');
assert.ok(siding('a[href="/roofing/replacement/"]').length&&siding('a[href="/windows/"]').length,'Preserve complementary service links');
const commercial=load(await fs.readFile('dist/commercial-siding/index.html','utf8'));
assert.equal(commercial('[data-component=FeaturedArticles]').length,0,'Do not fill commercial pages with residential articles');
assert.equal(commercial('.rk-editorial-gallery').length,0,'Do not present house photos as commercial work');
for(const family of ['gutters','decking','storm','repair']){
 const ids=reviewIdsForService(family);
 assert.ok(ids.length>0,family+' uses relevant retained customer feedback');
 for(const id of ids){const review=reviews.find(review=>review.id===id);const topic=family==='repair'?'roofing':family;assert.ok(review.services.includes(topic));}
}
console.log('Five reviewed siding pages: shared selectors, material comparison, seven FAQs, preserved approved components and service-specific reviews passed.');
