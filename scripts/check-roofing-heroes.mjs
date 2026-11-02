import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
const manifest=JSON.parse(await fs.readFile('migration/roofing-hero-images.json','utf8'));
const heroes=JSON.parse(await fs.readFile('src/data/roofing-heroes.json','utf8'));
const media=JSON.parse(await fs.readFile('src/data/roofing-hero-media.json','utf8'));
const photography=JSON.parse(await fs.readFile('migration/client-photography-review.json','utf8'));
assert.equal(manifest.pages.length,41);
assert.equal(Object.keys(heroes).length,manifest.pages.length);
const hashes=new Set();
for(const page of manifest.pages){
 const hero=heroes[page.route];assert.ok(hero,page.route);
 if(!hero.generated){assert.equal(hero.source?.type,'client-photography');assert.ok(photography.selected.some(photo=>photo.id===hero.source.fileId));assert.ok(photography.replacements.some(photo=>photo.route===page.route&&photo.sectionId==='hero'&&photo.replacement===hero.image.src));}
 const $=cheerio.load(await fs.readFile('dist'+page.route+'index.html','utf8'));
 const image=$('.rk-immersive-hero>.rk-service-hero-background');
 assert.equal(image.length,1,page.route);
 assert.equal(image.attr('loading'),'eager');assert.equal(image.attr('fetchpriority'),'high');
 assert.equal(image.attr('sizes'),'100vw');assert.equal(image.attr('alt'),'');
 assert.ok(image.attr('width')&&image.attr('height'));assert.equal(image.attr('srcset').split(',').length,4);
 assert.equal($('.rk-landing-hero-photo').length,0);
 assert.equal($('.rk-service-hero-credit').text(),hero.generated?(hero.caption||''):'');
 assert.ok($('meta[property="og:image"]').attr('content').endsWith(hero.image.src));
 assert.deepEqual(media[hero.image.src].variants.map(v=>v.src),page.assets.map(a=>a.src));
 for(const asset of page.assets){
  assert.ok(asset.src.startsWith('/media/roofing-heroes/')&&asset.src.endsWith('.webp'));
  const bytes=(await fs.stat('dist'+asset.src)).size;assert.equal(bytes,asset.bytes);
  assert.ok(bytes<=300000,'Image budget exceeded: '+asset.src);
  if(asset.width===640)assert.ok(bytes<=100000,'Mobile image budget exceeded: '+asset.src);
 }
 hashes.add(crypto.createHash('sha256').update(await fs.readFile('dist'+hero.image.src)).digest('hex'));
}
assert.equal(hashes.size,manifest.pages.length,'Each roofing route needs its own hero image.');
const files=await fs.readdir('dist/media/roofing-heroes');assert.ok(!files.some(f=>f.endsWith('.png')),'Do not deploy source PNGs.');
const gallery=cheerio.load(await fs.readFile('dist/roofing-hero-review.html','utf8'));
assert.equal(gallery('article').length,manifest.pages.length);assert.equal(gallery('meta[name="robots"]').attr('content'),'noindex,nofollow');
console.log('41 individual full-width roofing heroes, responsive WebP budgets, eager loading, source-appropriate labels and review gallery passed.');
