import {assertContactActions} from './contact-checks.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const html = await fs.readFile('dist/index.html', 'utf8');
const $ = cheerio.load(html);
assert.equal($('[data-homepage-build="astro-components"]').length, 1, 'Homepage must use the native component route.');
assert.equal($('h1').length, 1);
assert.equal($('.rk-home-service-card').length, 8);
const reviewLibrary=JSON.parse(await fs.readFile('src/data/featured-reviews.json','utf8')).items;const homeReviewIds=JSON.parse(await fs.readFile('src/data/home.json','utf8')).reviews.reviewIds;const featuredReviews=homeReviewIds.map(id=>reviewLibrary.find(review=>review.id===id));
assert.equal($('.rk-home-review-card').length, featuredReviews.length);
for(const review of featuredReviews){
  const card=$('.rk-home-review-card').filter((i,e)=>$(e).find('.rk-review-author').text().startsWith(review.author));
  assert.equal(card.length,1,'Featured review author must match the verified record.');
  const link=card.find('.rk-review-source');
  assert.equal(link.attr('href'),review.source.url);
  assert.equal(link.attr('target'),'_blank');
  assert.ok(new URL(link.attr('href'),'https://www.roofkingco.com').protocol==='https:','Review sources need a working published HTTPS destination.');
  assert.equal(card.find('.rk-stars[aria-label]').length,review.rating?1:0,'Do not invent individual star scores.');
  assert.ok(card.find('p').text().includes(review.description),'Keep the verified excerpt intact.');
}
const galleryLibrary=JSON.parse(await fs.readFile('src/data/project-gallery.json','utf8'));
assert.equal($('.rk-project-gallery-item').length,galleryLibrary.items.length,'Every retained gallery photo must exist in server-rendered HTML.');
assert.equal($('[data-component=FAQSection] details').length, JSON.parse(await fs.readFile('src/data/home.json','utf8')).faq.items.length);
assert.equal($('dialog').length, 2);
assertContactActions($);
assert.equal($('.rk-before-after-range[aria-label]').length, 1);
assert.ok($('.rk-home-hero img').attr('srcset'), 'Hero needs responsive image variants.');
assert.equal($('.rk-home-hero img').attr('fetchpriority'), 'high');
assert.equal($('main').text().includes('<div class='), false, 'Escaped import markup must never be visible.');
for (const img of $('main img').toArray()) {
  assert.ok($(img).attr('width') && $(img).attr('height'), 'Reserve space for ' + $(img).attr('src'));
}

const ids = $('[id]').toArray().map(e => $(e).attr('id'));
assert.equal(ids.length, new Set(ids).size, 'IDs must be unique across inline contact actions and modal content.');
assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
console.log('Homepage SSR, gallery, image sizing, booking and phone contact checks passed.');
const roofr = JSON.parse(await fs.readFile('src/data/roofr.json', 'utf8'));
assert.equal(new URL(roofr.estimatorUrl).origin, 'https://app.roofr.com');
for (const route of roofr.calculatorPaths) {
  const calculator = cheerio.load(await fs.readFile('dist' + route + 'index.html', 'utf8'));
  assert.equal(calculator('#roofr-estimator').length, 1, 'Missing estimator on ' + route);
  assert.ok(calculator('#roofr-estimator a').toArray().some(e => calculator(e).attr('href') === roofr.estimatorUrl), 'Missing no-JS estimator link.');
  assert.equal(calculator('#roofr-estimator iframe').length, 0, 'Do not load Roofr until the visitor starts the estimator.');
}
console.log('Both calculator URLs preserve a click-to-load Roofr estimator and a direct-link fallback.');
