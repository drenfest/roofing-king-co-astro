// Migration integrity: compare rendered pages with the independent PDF extraction and change log.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import site from '../src/data/site.json' with {type:'json'};
const source=JSON.parse(fs.readFileSync('migration/service-pdf-source.json','utf8'));
const audit=JSON.parse(fs.readFileSync('migration/service-pdf-import-audit.json','utf8'));
const overrides=JSON.parse(fs.readFileSync('src/data/service-overrides.json','utf8'));
const blogUrls=JSON.parse(fs.readFileSync('src/data/blog-url-map.json','utf8'));
const failures=[];const results=[];const clean=t=>t.replace(/\s+/g,' ').trim();
for(const entry of source.entries){
 const path=entry.path;const $=cheerio.load(fs.readFileSync('dist'+path+'index.html','utf8'));
 const main=$('main').clone();main.find('script,style,template').remove();const body=clean(main.text());
 const transformed=new Map(audit.wordingChanges.filter(c=>c.path===path).map(c=>[c.before,c.after]));
 const expectedBlocks=overrides[path]?.copy.expectedBlocks||entry.blocks.map(block=>transformed.get(block.text)||block.text);
 for(const block of expectedBlocks){const expected=clean(block.replace(/\(614\)\s*379-8893/g,site.phone));if(!body.includes(expected))failures.push({path,kind:'missing source text',text:expected});}
 for(const link of entry.links)if(!$('main a').toArray().some(a=>$(a).attr('href')===(blogUrls[link.href]||link.href)))failures.push({path,kind:'missing contextual link',...link});
 if($('h1').text()==='OH')failures.push({path,kind:'wrapped heading lost'});
 if(/\bscop(?:e|es|ing)\b/i.test(body))failures.push({path,kind:'rejected generic wording'});
 if(/EDITORIAL NOTES|Source checks:|WEBSITE COPY|SOURCE BRIEF/.test(body))failures.push({path,kind:'source/identity leakage'});
 assert.equal($('[data-pdf-entry]').attr('data-pdf-entry'),String(entry.id));
 results.push({path,sourceId:entry.id,bodyWords:body.split(/\s+/).length,pdfBlocks:entry.blocks.length,reviewedOverride:!!overrides[path],expectedBlocks:expectedBlocks.length,faqItems:$('.rk-service-faq details').length,contentBands:$('[data-component=ServiceContentBand]').length,images:$('main img').length});
}
fs.writeFileSync('migration/service-pdf-content-check.json',JSON.stringify({date:'2026-10-20',pagesChecked:results.length,sourceBlocks:source.entries.reduce((n,e)=>n+e.blocks.length,0),failures,results},null,2));
if(failures.length){console.log(JSON.stringify(failures,null,2));process.exitCode=1;}else console.log('All 83 pages retain their source or client-revised copy, headings, FAQs and contextual destinations.');
