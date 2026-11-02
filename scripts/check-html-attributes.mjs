import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {htmlFiles,completeHtmlAttributes} from './html-attributes.mjs';
import site from '../src/data/site.json' with {type:'json'};
const approvedPhone=site.phoneHref.slice(4).replace(/\D/g,'').replace(/^1(?=\d{10}$)/,'');
const files=await htmlFiles('dist');let images=0,links=0;
for(const file of files){
 const $=cheerio.load(await fs.readFile(file,'utf8'));
 assert.equal($('img:not([alt])').length,0,file+' missing image alt');
 for(const el of $('a,area').toArray())assert.ok($(el).attr('title')?.trim(),file+' missing link title: '+$(el).attr('href'));
 for(const el of $('a[href^="tel:"]').toArray())assert.equal($(el).attr('href'),site.phoneHref,file+' inconsistent click-to-call number');
 const visible=$('body').clone();visible.find('script,style,template').remove();
 for(const match of visible.text().matchAll(/\(\d{3}\)\s*\d{3}[-. ]\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}/g))assert.equal(match[0].replace(/\D/g,''),approvedPhone,file+' inconsistent displayed phone number');
 images+=$('img').length;links+=$('a,area').length;
}
const sample=cheerio.load(completeHtmlAttributes('<img alt="" src="decorative.webp"><a href="/siding/" title="Existing title">Siding</a><a href="/roofing/" aria-label="Explore roofing"><svg aria-hidden="true"></svg></a><area href="/gutters/" alt="Gutters">').html);
// Retained HTML imports must use native components, never visible Markdown code blocks.
const retained=JSON.parse(await fs.readFile('src/data/retained-pages.json','utf8'));
for(const page of Object.values(retained)){
 const $=cheerio.load(await fs.readFile('dist'+page.path+'index.html','utf8'));
 assert.equal($('main[data-retained-kind]').length,1,page.path+' native page owner');
 assert.equal($('h1').length,1,page.path+' one main heading');
 const visible=$('main').clone();visible.find('script,style,template').remove();
 assert.ok(!/<(?:h[1-6]|div|svg|path|section|ul|li)\b[^>]*>/i.test(visible.text()),page.path+' exposes raw HTML');
 assert.ok(!/Loading[.…]/.test(visible.text()),page.path+' unresolved legacy loading widget');
 if(page.kind==='legal'){
  const original=cheerio.load(await fs.readFile(page.sourceFile,'utf8'));original('script,style,svg').remove();
  const normalized=visible.text().replace(/\s+/g,' ').trim();
  for(const block of original('.rk-page-copy-section').find('p,li,h2,h3,h4').toArray()){
   const expected=original(block).text().replace(/\s+/g,' ').trim();
   if(expected)assert.ok(normalized.includes(expected),page.path+' preserves legal text: '+expected.slice(0,100));
  }
 }
 if(page.kind==='project'){
  assert.ok(!visible.text().includes('Roof King Blog'),page.path+' project-specific identity');
  assert.ok($('#related-projects a[href^="/past-projects/project/"]').length>=3,page.path+' server-rendered related projects');
 }
}
assert.equal(sample('img').attr('alt'),'');assert.equal(sample('a').first().attr('title'),'Existing title');assert.equal(sample('a').last().attr('title'),'Explore roofing');assert.equal(sample('area').attr('title'),'Gutters');
console.log(`${files.length} HTML pages checked: all ${images} images have alt attributes and all ${links} links have nonempty title attributes.`);
