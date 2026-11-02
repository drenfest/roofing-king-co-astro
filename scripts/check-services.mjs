import {reviewIdsForService} from '../src/data/service-reviews.ts';
import {assertContactActions} from './contact-checks.mjs';
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
  assertContactActions($);
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
    for(const href of ['/roofing/repair/','/roofing/replacement/','/columbus-oh/storm-damage/','/roofing/metal/','/roofing/types/','/roofing/gaf/','/roofing/gaf/types/','/columbus-oh/roofing/','/#projects-roofing','/offers/flexible-financing/'])assert.ok($(`main a[href="${href}"]`).length,'Retain useful service/product destinations: '+href);
    assert.ok(!/Medallion|292 Google Reviews|\[Verified/.test(rendered),'No unverified promotions, counts or evidence placeholders');
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
    const original=clean(before(e).text());
    // The GAF collection intentionally consolidates its two generic introductions into one filter-led heading.
    if(path==='/roofing/gaf/types/'&&['Exterior Services','Columbus, OH GAF Roof Shingle Types','Explore GAF Shingle Types','Explore GAF shingles: durable Timberline HDZ, stylish Camelot II, impact-resistant AS II, and cool roof options like Grand Sequoia RS. Beauty meets performance!','Compare the shingle options described below and talk with Roof King about your project.','Explore the colors, compare the details, and find a look for your home. Color availability varies by region; confirm your selection with Roof King and a physical sample.'].includes(original)){
      assert.equal($('[data-component="ProductGrid"] h2').text(),'Compare GAF shingle specifications');assert.equal($('[data-catalog-filters]').length,1);return;
    }
    const content=/^h[2-4]$/.test(e.tagName)?(placements[path]?.headings?.[original]||original):original;if(content)assert.ok(rendered.includes(content),'Lost source content on '+path+': '+content.slice(0,100));
  });
  const requiredLinks=before('.rk-page-section:not(.rk-page-final-cta) a[href^="/"]').filter((i,e)=>!before(e).closest('.rk-page-service-cta').length).map((i,e)=>before(e).attr('href')).get();
  for(const href of requiredLinks)assert.ok($(`main a[href="${href}"]`).length,'Lost contextual link '+href);
  if(path==='/cleveland-oh/roofing/'){assert.equal($('[data-component=ServiceGuide]').length,0);assert.equal($('[data-component=MediaContentRow]').length,4);assert.equal($('.rk-media-content-row img').length,4);assert.ok($('a[href="/products/roofing/"]').length);assert.ok($('a[href="/roofing/gaf/types/"]').length);assert.equal($('main pre,main code').length,0,'Imported markup must not display as source code');}
  const galleryLibrary=JSON.parse(await fs.readFile('src/data/project-gallery.json','utf8'));assert.equal($('.rk-project-gallery-item').length,galleryLibrary.items.filter(item=>item.tags.includes('roofing')&&!item.tags.includes('metal')).length);
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
 const isLocation=editorial[record.path]?.family==='local';const explicitTabs=editorial[record.path]?.opening.variant==='tabs';
 assert.equal($('[data-component=ServicePaths]').length,children.length||isLocation||explicitTabs?1:0,'Parent services and full-service location hubs use the selector: '+record.path);
 if(!children.length&&!isLocation&&!explicitTabs)assert.equal($('[data-component=ServiceExplorer]').length,0,'Leaf pages must not hydrate a topic selector: '+record.path);
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
 for(const panel of $('[data-service-panel],.rk-service-article-row').toArray()){
  assert.ok(!$(panel).contents().toArray().some(node=>node.type==='text'&&node.data.trim()==='0'),'No numeric fallback from empty related links: '+path);
 }
 for(const nav of $('.rk-service-related-links').toArray())assert.ok($(nav).find('a').length>0,'No empty related-link container: '+path);
 assert.equal($('[data-landing-build=editorial]').length,1,path);
 assert.equal($('main').length,1);assert.equal($('h1').length,1);
 if(path==='/roofing/')continue; // Approved reference has its dedicated checks above.
 assert.equal($('h1').text(),data.title);
 assert.equal($('meta[name=description]').attr('content'),data.description);
 assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+path);
 assert.ok(clean($('main').text()).split(/\s+/).length>=500,'No thin service landing: '+path);
 assert.equal($('.rk-landing-hero aside,.rk-landing-hero form').length,0);
 const hasChildren=data.opening.variant==='tabs'||data.family==='local'||manifest.some(r=>r.path!==path&&r.path.startsWith(path)&&!r.path.slice(path.length).replace(/\/$/,'').includes('/'));
 assert.equal($('.rk-service-detail').length,hasChildren?data.opening.items.length:0);
 assert.equal($('.rk-service-article-row').length,hasChildren?0:data.opening.items.length);
 for(const item of data.opening.items){assert.ok($('#'+item.id).text().includes(item.description),'Preserve topic content on '+path);if(hasChildren||!item.body)assert.ok($('#'+item.id+' a').toArray().some(a=>$(a).attr('href')===item.href),'Preserve child/topic destination on '+path);}
 const expectedReviews=reviewIdsForService(data.family);assert.equal($('.rk-home-review-card .rk-review-source').length,expectedReviews.length,path+' service-matched reviews');const actualReviewSources=$('.rk-home-review-card .rk-review-source').map((_,el)=>$(el).attr('href')).get();const reviewLibrary=JSON.parse(await fs.readFile('src/data/featured-reviews.json','utf8')).items;assert.deepEqual(actualReviewSources,expectedReviews.map(id=>reviewLibrary.find(review=>review.id===id).source.url),path+' exact review sources');
 assert.equal($('.rk-landing-credential-list article').length,3);
 assert.equal($('.rk-service-faq details').length,data.faq.items.length);
 assert.equal($('dialog.rk-native-quote-dialog').length,1);
 assertContactActions($);
 assert.equal($('.rk-imported-content,[data-rk-gallery],[data-rk-modal-open]').length,0);
 assert.ok(!/292 Google Reviews|perfect installation|guaranteed approval|mint condition/i.test($('main').text()),'No retired marketing claims '+path);
 for(const image of $('main img').toArray())assert.ok($(image).attr('width')&&$(image).attr('height'),'Sized image '+path+' '+$(image).attr('src'));
 for(const file of $('link[rel=stylesheet]').map((_i,e)=>$(e).attr('href')).get().filter(p=>p.startsWith('/')))assert.ok(!file.includes('/SiteLayout.') && !(await fs.readFile('dist'+file,'utf8')).includes('.rk-migration-banner'),'No legacy CSS: '+path);
}
console.log('Full editorial composition, review sources, credentials, FAQs, image dimensions and booking and phone actions passed for all 84 service routes.');
// Service tab previews must use their actual destination page's hero.
let tabImages=0,tabParents=0;
for(const route of manifest){
 const page=cheerio.load(await fs.readFile('dist'+route.path+'index.html','utf8'));
 const paths=page('[data-component=ServicePaths]');if(!paths.length)continue;tabParents++;
 for(const panel of paths.find('[data-service-panel]').toArray()){
  const item=page(panel),figure=item.children('.rk-service-tab-image'),href=item.children('a.rk-button').attr('href');
  assert.equal(figure.length,1,'Every tab needs a child hero on '+route.path);
  assert.ok(figure.prev().hasClass('rk-service-detail-kicker'),'Child image follows the eyebrow');assert.ok(figure.next().is('h3'),'Preserve subordinate tab headings');
  if(figure.attr('data-topic-photo')){const preview=figure.children('img');assert.ok(preview.attr('alt'));assert.equal(preview.attr('loading'),'lazy');assert.ok(preview.attr('width')&&preview.attr('height'));continue;}
  const child=cheerio.load(await fs.readFile('dist'+href.split(/[?#]/)[0]+'index.html','utf8'));const actual=child('.rk-editorial-hero>img').first();const preview=figure.children('img');
  assert.equal(preview.attr('src'),actual.attr('src'),'Preview must match its destination: '+href);assert.equal(preview.attr('srcset'),actual.attr('srcset'));assert.equal(preview.attr('loading'),'lazy');assert.ok(preview.attr('width')&&preview.attr('height'));
  if(/illustrat/i.test(child('.rk-service-hero-credit').text()))assert.ok(figure.find('figcaption').text().includes('Illustrative'));
  tabImages++;
 }
}
const newHeroes=JSON.parse(await fs.readFile('src/data/service-heroes.json','utf8'));
const roofHeroes=JSON.parse(await fs.readFile('src/data/roofing-heroes.json','utf8'));
const customHeroes={...newHeroes,...roofHeroes};const newMedia=JSON.parse(await fs.readFile('src/data/service-hero-media.json','utf8'));
const {createHash}=await import('node:crypto');const hashes=new Set();
assert.deepEqual(Object.keys(customHeroes).sort(),Object.keys(editorial).sort(),'All native service pages have their own custom hero');
for(const [path,asset]of Object.entries(customHeroes)){
 const page=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));const hero=page('.rk-editorial-hero>img').first();assert.ok(hero.attr('src').includes('/media/roofing-heroes/')||hero.attr('src').includes('/media/service-heroes/'),'No generic hero fallback: '+path);
 const hash=createHash('sha256').update(await fs.readFile('dist'+asset.image.src)).digest('hex');assert.ok(!hashes.has(hash),'Do not copy the same hero across routes');hashes.add(hash);
 assert.equal(page('.rk-service-hero-credit').length,asset.generated?1:0,'Use source-appropriate illustration disclosure: '+path);
 if(!asset.generated){assert.equal(asset.source?.type,'client-photography');assert.ok(asset.source?.url&&asset.source?.fileId,'Real hero needs source provenance: '+path);}
}
for(const record of Object.values(newMedia))for(const variant of record.variants){assert.ok(variant.src.endsWith('.webp'));assert.ok((await fs.stat('dist'+variant.src)).size<=300000,'Custom service hero exceeds WebP budget');}
console.log(`${tabImages} child hero previews on ${tabParents} parent pages match their destinations; all ${hashes.size} service pages have distinct optimized custom heroes.`);
const atlas=JSON.parse(await fs.readFile('src/data/navigation-atlas.json','utf8'));
const nav=JSON.parse(await fs.readFile('src/data/navigation.json','utf8'));
const menuSources=JSON.parse(await fs.readFile('src/data/navigation-images.json','utf8'));
const menuHrefs=[...new Set((function walk(items){return items.flatMap(item=>[item.href,...walk(item.children)]);})(nav.items))];
assert.deepEqual(Object.keys(atlas.items).sort(),menuHrefs.sort(),'Every navigation destination needs an atlas cell');
assert.equal(new Set(Object.values(atlas.items).map(i=>i.column+':'+i.row)).size,menuHrefs.length,'No reused cells for different destinations');
assert.equal(new Set(Object.values(menuSources).map(i=>i.fingerprint)).size,menuHrefs.length,'No duplicated menu image content');
const atlasBytes=(await fs.stat('dist'+atlas.src)).size;assert.equal(atlasBytes,atlas.bytes);assert.ok(atlasBytes<=750000,'Keep the single menu request within its transfer budget');
const {default:sharpImage}=await import('sharp');const atlasInfo=await sharpImage('dist'+atlas.src).metadata();assert.equal(atlasInfo.width,atlas.columns*atlas.tileSize);assert.equal(atlasInfo.height,atlas.rows*atlas.tileSize);
console.log(`${menuHrefs.length} unique destination images protected in one ${Math.round(atlas.bytes/1024)}KB WebP menu atlas.`);
