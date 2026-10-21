import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const articles=JSON.parse(await fs.readFile('src/data/featured-articles.json','utf8'));
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8')).routes;
const paths=new Set(manifest.map(r=>r.path));
// Route manifest uses permalink on older records.
for(const r of manifest)paths.add(r.permalink);
assert.equal(new Set(articles.map(a=>a.href)).size,articles.length);
for(const a of articles){
 assert.ok(paths.has(a.href),a.href);
 assert.ok(a.description.length>60&&a.description.length<210);
 for(const v of a.image.variants){assert.ok(v.width<=a.image.width);assert.ok((await fs.stat('public'+v.src)).size<120000,'Thumbnail budget: '+v.src);}
}
const missing=[];let count=0;
for(const [path,data] of Object.entries(editorial)){
 const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 const section=$('[data-component=FeaturedArticles]');
 if(!section.length){missing.push({path,family:data.family,reason:'No relevant published articles available in the existing blog.'});continue;}
 count++;
 const cards=section.find('.rk-articles-grid article');assert.ok(cards.length>=2&&cards.length<=4,path);
 for(const a of section.find('.rk-article-link').toArray())assert.ok(articles.some(x=>x.href===$(a).attr('href')));
 assert.equal(section.find('img[loading=lazy][width][height]').length,cards.length);
 if(data.family==='local')assert.ok(section.find('h2').text().includes(data.city));
}
await fs.writeFile('migration/featured-article-review.json',JSON.stringify({articleCount:articles.length,pagesWithFeaturedArticles:count,unfilledServices:missing,note:'Existing articles only. Empty service categories are not padded with unrelated posts. Add dedicated articles during the ten-page content reviews.'},null,2)+'\n');
console.log(`${count} service/location pages feature existing relevant articles; ${missing.length} pages recorded as article coverage gaps.`);
