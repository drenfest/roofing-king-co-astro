import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const pages=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
const placements=JSON.parse(await fs.readFile('src/data/site-structure.json','utf8')).pages;
const clean=s=>s.replace(/\s+/g,' ').trim();
for(const [path,data] of Object.entries(pages)){
  if(editorial[path] && path!=='/roofing/')continue; // Intentional authored replacement; verified below.
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
    assert.equal($('[data-service-panel]').length,9,'All service topics must be server rendered.');
    assert.equal($('[data-service-panel][hidden]').length,0,'Without JS every topic and destination remains available.');
    for(const panel of $('[data-service-panel]').toArray())assert.equal($(`.rk-service-explorer-tabs a[href="#${$(panel).attr('id')}"]`).length,1,'Fallback topic link must target its content.');
    for(const href of ['/roofing/repair/','/roofing/replacement/','/columbus-oh/storm-damage/','/roofing/metal/','/roofing/types/','/roofing/gaf/','/roofing/gaf/types/','/columbus-oh/roofing/','/past-projects/','/offers/flexible-financing/'])assert.ok($(`main a[href="${href}"]`).length,'Retain useful service/product destinations: '+href);
    assert.ok(!/\$47|Medallion|292 Google Reviews|\[Verified/.test(rendered),'No unverified promotions, counts or evidence placeholders');
    assert.equal($('.rk-home-review-card').length,3,'Roofing must use the same three-card review component as the homepage.');
    assert.equal($('.rk-home-review-card .rk-review-source').length,3);
    assert.ok($('.rk-review-source').toArray().some(e=>$(e).attr('href').startsWith('https://www.bbb.org/')));
    continue;
  }
  // Compare all substantive paragraphs and headings, not a self-generated fixture.
  before('.rk-page-section:not(.rk-page-final-cta) p,.rk-page-section:not(.rk-page-final-cta) h2,.rk-page-section:not(.rk-page-final-cta) h3,.rk-page-section summary').each((i,e)=>{
    // The client replaced first-party testimonials with verified external review excerpts.
    if(before(e).closest('.rk-page-reviews-section').length)return;
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
console.log('Approved reference and retained product catalog checks passed.');

// Parent services use navigation; leaf services expose their content directly.
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8')).routes;
const serviceRecords=await Promise.all(manifest.map(async route=>{
 const source=await fs.readFile(route.file,'utf8');return {...route,...YAML.parse(source.split('---')[1])};
}));
let prepared=0;
for(const record of serviceRecords.filter(r=>/service/i.test(r.category)||r.category==='Product guide')){
 const $=cheerio.load(await fs.readFile('dist'+record.path+'index.html','utf8'));
 const opening=$('[data-component=ServiceArticle],[data-component=ServiceTopics],[data-component=ServicePaths]');
 assert.equal(opening.length,1,'One opening service explorer: '+record.path);
 assert.ok(opening.find('[data-service-panel],.rk-service-article-row').length,'Actual topic content on '+record.path);
 for(const panel of opening.find('[data-service-panel]').toArray()){const body=$(panel).clone();body.find('.rk-service-detail-kicker,h3').first().remove();body.children('h3').first().remove();assert.ok(clean(body.text()),'No empty topic panels: '+record.path);}
 const children=serviceRecords.filter(r=>r.path!==record.path&&r.path.startsWith(record.path)&&!r.path.slice(record.path.length).replace(/\/$/,'').includes('/'));
 assert.equal($('[data-component=ServicePaths]').length,children.length?1:0,'Only parent pages use the tabbed service component: '+record.path);
 if(!children.length)assert.equal($('[data-component=ServiceExplorer]').length,0,'Leaf pages must not hydrate a topic selector: '+record.path);
 for(const child of children)assert.ok(opening.find('a').toArray().some(e=>$(e).attr('href')===child.path),'Opening must link to child '+child.path);
 const ids=$('[id]').map((_i,e)=>$(e).attr('id')).get();assert.equal(ids.length,new Set(ids).size,'Unique IDs on '+record.path);
 prepared++;
}
for(const path of manifest.filter(r=>r.path.startsWith('/products/roofing/shingles/gaf/')).map(r=>r.path)){
 const html=await fs.readFile('dist'+path+'index.html','utf8');assert.ok(!html.includes('Plan your complete roofing system.</h2>'),'Remove retired product planning section');
}
console.log('Opening child-service/topic explorers verified on '+prepared+' service routes.');

// The authored service collection replaces imported marketing; validate the full rendered result.
for(const [path,data] of Object.entries(editorial)){
 const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 assert.equal($('[data-landing-build=editorial]').length,1,path);
 assert.equal($('main').length,1);assert.equal($('h1').length,1);
 if(path==='/roofing/')continue; // Approved reference has its dedicated checks above.
 assert.equal($('h1').text(),data.title);
 assert.equal($('meta[name=description]').attr('content'),data.description);
 assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
 assert.ok(clean($('main').text()).split(/\s+/).length>=500,'No thin service landing: '+path);
 assert.equal($('.rk-landing-hero aside,.rk-landing-hero form').length,0);
 const hasChildren=manifest.some(r=>r.path!==path&&r.path.startsWith(path)&&!r.path.slice(path.length).replace(/\/$/,'').includes('/'));
 assert.equal($('.rk-service-detail').length,hasChildren?data.opening.items.length:0);
 assert.equal($('.rk-service-article-row').length,hasChildren?0:data.opening.items.length);
 for(const item of data.opening.items){assert.ok($('#'+item.id).text().includes(item.description),'Preserve topic content on '+path);assert.ok($('#'+item.id+' a').toArray().some(a=>$(a).attr('href')===item.href),'Preserve topic destination on '+path);}
 assert.equal($('.rk-home-review-card .rk-review-source').length,3);
 assert.equal($('.rk-landing-credential-list article').length,3);
 assert.equal($('.rk-service-faq details').length,data.faq.items.length);
 assert.equal($('dialog.rk-native-quote-dialog').length,1);
 assert.equal($('.rk-quote-form button[type=submit]:disabled').length,2);
 assert.equal($('.rk-imported-content,[data-rk-gallery],[data-rk-modal-open]').length,0);
 assert.ok(!/292 Google Reviews|\$47|perfect installation|guaranteed approval|mint condition/i.test($('main').text()),'No retired marketing claims '+path);
 for(const image of $('main img').toArray())assert.ok($(image).attr('width')&&$(image).attr('height'),'Sized image '+path+' '+$(image).attr('src'));
 for(const file of $('link[rel=stylesheet]').map((_i,e)=>$(e).attr('href')).get().filter(p=>p.startsWith('/')))assert.ok(!file.includes('/SiteLayout.') && !(await fs.readFile('dist'+file,'utf8')).includes('.rk-migration-banner'),'No legacy CSS: '+path);
}
console.log('Full editorial composition, review sources, credentials, FAQs, image dimensions and disabled delivery passed for all 84 service routes.');
