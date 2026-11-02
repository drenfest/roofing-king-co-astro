import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
const source=JSON.parse(await fs.readFile('migration/client-photography-review.json','utf8'));
const registered=new Set(source.assets.map(a=>a.src));
let placements=0;
for(const row of source.replacements){
 const $=cheerio.load(await fs.readFile('dist'+row.route+'index.html','utf8'));
 const section=row.sectionId==='hero'?$('.rk-editorial-hero'):$('#'+row.sectionId);
 const matches=section.find('img').filter((_i,img)=>$(img).attr('src')===row.replacement||($(img).attr('srcset')||'').split(',').some(v=>v.trim().split(' ')[0]===row.replacement));
 assert.ok(matches.length,row.route+' client photo appears in its recorded section');
 if(row.sectionId==='hero'){assert.equal(section.find('.rk-service-hero-credit').length,0,'Real photo must not be called generated');assert.ok(source.selected.some(s=>s.id===row.sourceId));}
 else {assert.ok(registered.has(row.replacement),'Registered client photo: '+row.replacement);for(const image of matches.toArray()){assert.ok($(image).attr('alt')?.trim(),'Client detail needs a descriptive alternative');assert.ok(!/^Illustrati/i.test($(image).attr('alt')),'Real photo must not have illustrative alt text');const caption=$(image).closest('figure').find('figcaption').text();assert.ok(caption.includes('supplied')||caption.includes('Supplied'),'Photo caption retains source context');}}
 placements++;
}
for(const asset of source.assets){const path='public'+asset.src,bytes=(await fs.stat(path)).size;assert.equal(bytes,asset.bytes);assert.ok(bytes<=110000,'Client detail image transfer budget');const metadata=await sharp(path).metadata();assert.ok(!metadata.exif,'Do not expose camera EXIF or GPS');assert.equal(metadata.width,asset.width);}
console.log(`${placements} client-photo placements verified against source records; responsive detail variants <=110 KB with camera metadata removed.`);
