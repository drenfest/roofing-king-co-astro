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
  assert.equal(clean($('.rk-home-hero h1,.rk-landing-hero h1').text()),placements[path]?.hero?.title || data.hero.title);
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
  if(path==='/roofing/' || path==='/commercial-roofing/'){
    assert.equal($('[data-component=ServiceAudienceBanner]').length,1);
    assert.equal($('[data-component=ServiceAudienceBanner] a').attr('href'),path==='/roofing/'?'/commercial-roofing/':'/roofing/');
    assert.ok(!/^\d{2}\s*\//m.test($('.rk-service-detail-kicker').text()),'Explorer topics must not be numbered.');
    if(path==='/commercial-roofing/')assert.equal($('[data-service-panel]').length,4);
  }
  if(path==='/roofing/'){
    // This page is an intentional editorial replacement, not a verbatim migration.
    assert.equal($('[data-landing-build=editorial]').length,1);
    assert.equal($('#roofing-services-title').text(),'Residential Roofing Services Near Columbus, OH');
    assert.equal($('.rk-landing-decision').length,0,'The service landing must not become a symptom checklist.');
    assert.equal($('.rk-landing-hero aside,.rk-landing-hero form').length,0);
    assert.equal($('.rk-landing-hero a[href="#estimate"]').length,1);
    assert.equal($('#estimate #quote-form').length,1);
    assert.equal($('.rk-service-faq details').length,6);
    assert.equal($('[data-component=ServiceExplorer]').length,1);
    assert.equal($('[data-service-panel]').length,8,'All service topics must be server rendered.');
    assert.equal($('[data-service-panel][hidden]').length,0,'Without JS every topic and destination remains available.');
    for(const panel of $('[data-service-panel]').toArray())assert.equal($(`.rk-service-explorer-tabs a[href="#${$(panel).attr('id')}"]`).length,1,'Fallback topic link must target its content.');
    for(const href of ['/roofing/repair/','/roofing/replacement/','/columbus-oh/storm-damage/','/roofing/metal/','/roofing/types/','/roofing/gaf/','/roofing/gaf/types/','/columbus-oh/roofing/','/past-projects/','/offers/flexible-financing/'])assert.ok($(`main a[href="${href}"]`).length,'Retain useful service/product destinations: '+href);
    assert.ok(!/\$47|Medallion|292 Google Reviews|\[Verified/.test(rendered),'No unverified promotions, counts or evidence placeholders');
    assert.equal($('.rk-landing-review blockquote').length,1);
    assert.ok($('.rk-landing-review figcaption a').attr('href').startsWith('https://www.bbb.org/'));
    continue;
  }
  // Compare all substantive paragraphs and headings, not a self-generated fixture.
  before('.rk-page-section:not(.rk-page-final-cta) p,.rk-page-section:not(.rk-page-final-cta) h2,.rk-page-section:not(.rk-page-final-cta) h3,.rk-page-section summary').each((i,e)=>{
    // The commercial explorer now summarizes each linked detail page instead of its old teaser cards.
    if(path==='/commercial-roofing/' && e.tagName==='p' && before(e).closest('.rk-page-service-card').length)return;
    const original=clean(before(e).text());const content=/^h[2-4]$/.test(e.tagName)?(placements[path]?.headings?.[original]||original):original;if(content)assert.ok(rendered.includes(content),'Lost source content on '+path+': '+content.slice(0,100));
  });
  const requiredLinks=before('.rk-page-section:not(.rk-page-final-cta) a[href^="/"]').filter((i,e)=>!before(e).closest('.rk-page-service-cta').length).map((i,e)=>before(e).attr('href')).get();
  for(const href of requiredLinks)assert.ok($(`main a[href="${href}"]`).length,'Lost contextual link '+href);
  if(path==='/cleveland-oh/roofing/'){assert.equal($('[data-component=ServiceGuide]').length,0);assert.equal($('[data-component=MediaContentRow]').length,4);assert.equal($('.rk-media-content-row img').length,4);assert.ok($('a[href="/products/roofing/"]').length);assert.ok($('a[href="/roofing/gaf/types/"]').length);assert.equal($('main pre,main code').length,0,'Imported markup must not display as source code');}
  const gallery=data.sections.find(s=>s.type==='gallery');assert.equal($('.rk-project-gallery-item').length,gallery.items.length);
  const faq=data.sections.find(s=>s.type==='faq');assert.equal($('.rk-service-faq details').length,faq?.items.length||0);
}
console.log('Native service content, contextual links, media, FAQ, landmarks and disabled delivery passed for '+Object.keys(pages).length+' pages.');
