import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {htmlFiles,completeHtmlAttributes} from './html-attributes.mjs';
const files=await htmlFiles('dist');let images=0,links=0;
for(const file of files){
 const $=cheerio.load(await fs.readFile(file,'utf8'));
 assert.equal($('img:not([alt])').length,0,file+' missing image alt');
 for(const el of $('a,area').toArray())assert.ok($(el).attr('title')?.trim(),file+' missing link title: '+$(el).attr('href'));
 images+=$('img').length;links+=$('a,area').length;
}
const sample=cheerio.load(completeHtmlAttributes('<img alt="" src="decorative.webp"><a href="/siding/" title="Existing title">Siding</a><a href="/roofing/" aria-label="Explore roofing"><svg aria-hidden="true"></svg></a><area href="/gutters/" alt="Gutters">').html);
assert.equal(sample('img').attr('alt'),'');assert.equal(sample('a').first().attr('title'),'Existing title');assert.equal(sample('a').last().attr('title'),'Explore roofing');assert.equal(sample('area').attr('title'),'Gutters');
console.log(`${files.length} HTML pages checked: all ${images} images have alt attributes and all ${links} links have nonempty title attributes.`);
