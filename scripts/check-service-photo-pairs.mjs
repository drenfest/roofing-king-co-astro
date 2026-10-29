import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const nodeText=node=>node.text??(node.children||[]).map(nodeText).join('');
const galleries=await read('src/data/service-section-galleries.json');
const copy=await read('src/data/service-copy.json');
let sections=0;
for(const[route,entries]of Object.entries(galleries)){
 const $=cheerio.load(await fs.readFile('dist'+route+'index.html','utf8'));
 for(const[id,photos]of Object.entries(entries)){
  const section=$('#'+id);const pairs=section.find('[data-photo-pair]');
  assert.equal(pairs.length,3,route+' three photo rows');
  assert.equal(new Set(photos.map(p=>p.image.src)).size,3,route+' distinct images');
  const cards=copy[route].sections.find(s=>s.id===id).cards;
  assert.deepEqual(photos.flatMap(p=>p.topics).sort(),cards.map(c=>c.title).sort(),route+' covers every topic once');
  for(const[index,pair]of pairs.toArray().entries()){
   const row=$(pair);const photo=photos[index];const img=row.find('figure img');
   assert.equal(img.length,1);assert.equal(img.attr('alt'),photo.image.alt);
   assert.ok(Number(img.attr('width'))>0&&Number(img.attr('height'))>0,route+' intrinsic dimensions');
   assert.ok(img.attr('srcset'),route+' responsive images');assert.equal(img.attr('loading'),'lazy');
   assert.equal(row.find('h3').first().text(),photo.heading);assert.ok(row.find('.rk-section-photo-copy p').length>0);
   for(const topic of photo.topics){const card=cards.find(c=>c.title===topic);assert.ok(row.text().includes(topic));for(const p of card.body.filter(p=>p.tag==='p')){const plain=nodeText(p);if(plain)assert.ok(row.text().includes(plain),route+' retains paragraph');}}
   for(const candidate of img.attr('srcset').split(',').map(s=>s.trim().split(' ')[0])){
    const stat=await fs.stat('public'+candidate);assert.ok(stat.size<=110000,route+' web image budget '+candidate);
   }
  }
  sections++;
 }
}
const batches=(await fs.readdir('migration')).filter(name=>/^service-review-batch-\d+\.json$/.test(name));
const reviewed=new Set();for(const file of batches)for(const page of(await read('migration/'+file)).pages)reviewed.add(page.route);
for(const route of Object.keys(galleries))assert.ok(reviewed.has(route),'Photo rollout must stay inside reviewed page batches: '+route);
for(const route of reviewed){const c=copy[route];for(const s of c.sections.filter(s=>s.variant==='media'&&s.id!==c.budgetSectionId))assert.ok(galleries[route]?.[s.id],route+' missing photo review for rendered media section '+s.id);}
console.log(`Photo/copy pairing passed: ${sections} sections, ${sections*3} distinct-in-section photos, complete topic coverage, alt text, dimensions, responsive lazy images and 110 KB asset budget.`);
