import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const batches=(await fs.readdir('migration')).filter(name=>/^service-review-batch-\d+\.json$/.test(name));
const copy=JSON.parse(await fs.readFile('src/data/service-copy.json','utf8'));
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
let checked=0;
for(const file of batches){
 const batch=JSON.parse(await fs.readFile('migration/'+file,'utf8'));
 for(const page of batch.pages){
  const $=cheerio.load(await fs.readFile('dist'+page.route+'index.html','utf8'));$('dialog').remove();
  assert.equal($('main h1').length,1,page.route);
  assert.equal($('[data-content-review]').attr('data-content-review'),batch.batch,page.route+' batch marker');
  const headings=$('main h1,main h2,main h3,main h4').toArray();let previous=0;
  for(const heading of headings){const level=Number(heading.tagName[1]);assert.ok(level<=previous+1,page.route+' skipped heading level: '+$(heading).text());previous=level;}
  assert.ok($('main h2').not('[data-component=FeaturedArticles] h2,[data-service-comparison] h2').length<page.beforeH2,page.route+' retain reviewed heading grouping');
  assert.equal($('.rk-home-brands h2').length,0,page.route+' manufacturers are a subsection');
  assert.equal($('[data-component=ServiceContentBand] .rk-home-brands h3').length,editorial[page.route].brandIds.length?1:0,page.route+' nested manufacturer heading when relevant product data exists');
  assert.ok($('#'+copy[page.route].budgetSectionId+' #service-budget-title').length===1,page.route+' explicit estimate section');
  for(const section of $('[aria-labelledby]').toArray())for(const id of ($(section).attr('aria-labelledby')||'').split(/\s+/)){assert.ok($('[id]').toArray().some(el=>$(el).attr('id')===id),page.route+' missing heading target '+id);}
  assert.ok(!/^(Know the Team\. Know the Work\.|Explore the Brands Behind the Materials|Choose the specified system|More about siding services)$/im.test($('main h2').toArray().map(el=>$(el).text()).join('\n')),page.route+' generic heading returned');
  checked++;
 }
}
console.log('Reviewed service hierarchy, subordinate manufacturer headings, estimate placement and accessible heading targets passed on '+checked+' pages.');
