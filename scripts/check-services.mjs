import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
const placements=JSON.parse(await fs.readFile('src/data/site-structure.json','utf8')).pages;
const clean=s=>s.replace(/\s+/g,' ').trim();
for(const [path,data] of Object.entries(pages)){
  const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
  assert.equal($('[data-service-build="astro-components"]').length,1,path);
  assert.equal($('main').length,1,'Single main landmark on '+path);
  assert.equal($('h1').length,1);
  assert.equal(clean($('.rk-home-hero h1').text()),placements[path]?.hero?.title || data.hero.title);
  assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
  assert.equal($('meta[name=robots]').attr('content'),'noindex, nofollow');
  assert.equal($('.rk-quote-form button[type=submit]:disabled').length,2);
  assert.equal($('.rk-quote-form[method=dialog]').length,2);
  assert.equal($('dialog.rk-native-quote-dialog').length,1,'One modal host per page');
  const ids=$('[id]').map((i,e)=>$(e).attr('id')).get();assert.equal(ids.length,new Set(ids).size);
  assert.equal($('main').text().includes('<div class='),false);
  assert.equal($('[data-rk-modal-open],[data-rk-gallery]').length,0,'No legacy interaction hooks');
  for(const img of $('main img').toArray())assert.ok($(img).attr('width')&&$(img).attr('height'),'Sized image '+$(img).attr('src'));
  for(const css of $('link[rel=stylesheet]').map((i,e)=>$(e).attr('href')).get().filter(s=>s.startsWith('/'))){const text=await fs.readFile('dist'+css,'utf8');assert.ok(!text.includes('.rk-migration-banner'),'Legacy migration CSS must not load');}
  const source=await fs.readFile(data.sourceFile,'utf8');const before=cheerio.load(source.split('---').slice(2).join('---'));
  const rendered=clean($('main').text());
  // Compare all substantive paragraphs and headings, not a self-generated fixture.
  before('.rk-page-section:not(.rk-page-final-cta) p,.rk-page-section:not(.rk-page-final-cta) h2,.rk-page-section:not(.rk-page-final-cta) h3,.rk-page-section summary').each((i,e)=>{
    const original=clean(before(e).text());const content=/^h[2-4]$/.test(e.tagName)?(placements[path]?.headings?.[original]||original):original;if(content)assert.ok(rendered.includes(content),'Lost source content on '+path+': '+content.slice(0,100));
  });
  const requiredLinks=before('.rk-page-section:not(.rk-page-final-cta) a[href^="/"]').filter((i,e)=>!before(e).closest('.rk-page-service-cta').length).map((i,e)=>before(e).attr('href')).get();
  for(const href of requiredLinks)assert.ok($(`main a[href="${href}"]`).length,'Lost contextual link '+href);
  if(path==='/cleveland-oh/roofing/'){assert.equal($('[data-component=ServiceGuide]').length,1);assert.equal($('.rk-service-guide-topic').length,4);assert.equal($('main pre,main code').length,0,'Imported markup must not display as source code');}
  const gallery=data.sections.find(s=>s.type==='gallery');assert.equal($('.rk-project-gallery-item').length,gallery.items.length);
  const faq=data.sections.find(s=>s.type==='faq');assert.equal($('.rk-service-faq details').length,faq?.items.length||0);
}
console.log('Native service content, contextual links, media, FAQ, landmarks and disabled delivery passed for '+Object.keys(pages).length+' pages.');
