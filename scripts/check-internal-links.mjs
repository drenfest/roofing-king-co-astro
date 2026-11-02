import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import plan from '../src/data/internal-link-plan.json' with {type:'json'};
import {applyInternalLinks} from './internal-links.mjs';

const local=process.argv.includes('--local');
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8'));
const paths=new Set(manifest.routes.map(r=>r.path));
const ids=new Set();let count=0;const entries=Object.entries(plan.pages);let index=0;
async function check(){while(index<entries.length){
 const [pathname,records]=entries[index++];assert.ok(paths.has(pathname),'Source route exists: '+pathname);
 let html;if(local){const response=await fetch('http://127.0.0.1:4321'+pathname);assert.equal(response.status,200,pathname);html=await response.text();}else html=await fs.readFile('dist'+pathname+'index.html','utf8');
 const $=load(html);
 for(const record of records){
  assert.ok(!ids.has(record.id),'Unique link instruction '+record.id);ids.add(record.id);
  assert.ok(paths.has(record.destination.split('#')[0]),'Destination route exists: '+record.destination);
  const anchor=$('[data-internal-link-id]').filter((_i,n)=>$(n).attr('data-internal-link-id')===record.id);
  assert.equal(anchor.length,1,pathname+' '+record.id+' applied once');assert.equal(anchor[0].name,'a');
  assert.equal(anchor.attr('href'),record.destination,record.id+' destination');assert.ok(anchor.attr('title')?.trim(),record.id+' title');
  assert.equal(anchor.find('a').length,0,record.id+' no nested anchors');
  if(record.action==='retarget_image_link'){assert.equal(anchor.find('img').length,1,record.id+' retained image');assert.equal(anchor.find('img').attr('alt'),record.image_alt,record.id+' retained alt');}
  if(record.action==='wrap_existing_text'||record.action==='insert_new_link')assert.equal(anchor.text().replace(/\s+/g,' ').trim(),record.text_to_wrap,record.id+' exact anchor text');
  if(pathname.startsWith('/reviews/')&&record.action==='insert_new_link')assert.equal(anchor.closest('blockquote').length,0,record.id+' outside customer quotation');
  if(record.section.component==='ContentSection'&&record.action==='insert_new_link'&&/^After /.test(record.placement))assert.equal(anchor.closest('.rk-article-section').attr('id'),$(record.section.selector).closest('.rk-article-section').attr('id'),record.id+' after the complete article topic');
  count++;
 }
 assert.equal(applyInternalLinks(html,{pathname,strict:true}).changed,false,pathname+' repeated rendering is idempotent');
}}
await Promise.all([check(),check(),check(),check()]);
assert.equal(count,268);assert.equal(entries.length,176);
console.log(`Internal link instructions passed: ${count} links across ${entries.length} pages; destinations, titles, exact text, gallery images and idempotence.`);
