import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {chooseBlogTerm} from './blog-url-policy.mjs';
import {htmlFiles,canonicalBlogLink} from './html-attributes.mjs';
const hubs=JSON.parse(await fs.readFile('src/data/blog-hubs.json','utf8'));
const archives=JSON.parse(await fs.readFile('src/data/blog-archives.json','utf8'));
const routes=JSON.parse(await fs.readFile('src/data/blog-routes.json','utf8'));
const map=JSON.parse(await fs.readFile('src/data/blog-url-map.json','utf8'));
const redirects=JSON.parse(await fs.readFile('migration/route-redirects.json','utf8'));
const apache=await fs.readFile('public/.htaccess','utf8');
const apacheRules=apache.split('\n').map(line=>line.trim().match(/^RewriteRule (\S+) (\S+) \[R=301,L,NE\]$/)).filter(Boolean);
assert.deepEqual(chooseBlogTerm(['Roof Repair','Roofing'],['Dublin, OH']),{kind:'category',name:'Roof Repair',slug:'roof-repair'});
assert.deepEqual(chooseBlogTerm([],['Wind Damage','Columbus, OH']),{kind:'tag',name:'Wind Damage',slug:'wind-damage'});
assert.equal(chooseBlogTerm(['Uncategorized'],['First tag','Second tag']).slug,'first-tag');assert.equal(chooseBlogTerm([],[]),null);
assert.equal(new Set(routes.posts.map(p=>p.canonicalPath)).size,21);
for(const post of routes.posts){
 assert.ok(!post.canonicalPath.includes('/p.'));
 assert.deepEqual(post.term,chooseBlogTerm(post.categories,post.tags));
 const $=cheerio.load(await fs.readFile('dist'+post.canonicalPath+'index.html','utf8'));
 assert.equal($('link[rel=canonical]').length,1);assert.equal($('link[rel=canonical]').attr('href'),'https://www.roofkingco.com'+post.canonicalPath);
 assert.equal($('meta[property="og:url"]').attr('content'),'https://www.roofkingco.com'+post.canonicalPath);
 assert.equal($('h1').length,1);assert.equal($('h1').text(),post.title);assert.equal($('[data-component=BlogNavigation]').length,1);
 assert.equal($('meta[http-equiv=refresh]').length,0);assert.ok($('main').text().length>1500);
 const taxonomy=$('[data-article-taxonomy]');assert.equal(taxonomy.length,post.categories.length+post.tags.length>0?1:0,'No empty taxonomy section: '+post.canonicalPath);
 for(const [label,names,collections]of [['Categories',post.categories,hubs.categories.groups],['Topics',post.tags,hubs.topics.groups]]){
  const links=taxonomy.find(`ul[aria-label="${label} for this article"] a`);
  assert.deepEqual(links.toArray().map(a=>$(a).text()),names,'All assigned terms: '+post.canonicalPath);
  for(const link of links.toArray()){
   const group=collections.find(g=>g.label===$(link).text());assert.equal($(link).attr('href'),group.href);
   assert.ok($(link).attr('title'));assert.ok(archives[group.href].items.some(p=>p.href===post.canonicalPath),'Linked collection contains this article: '+group.href);
  }
 }

 for(const alias of post.aliases){
  assert.equal(map[alias],post.canonicalPath);assert.equal(redirects[alias],post.canonicalPath);assert.ok(!map[post.canonicalPath],'No redirect chain');
  const fallback=cheerio.load(await fs.readFile('dist'+alias+'index.html','utf8'));assert.ok(fallback('meta[http-equiv=refresh]').attr('content').endsWith('url='+post.canonicalPath));
  assert.ok(apacheRules.some(rule=>new RegExp(rule[1]).test(alias.slice(1))&&rule[2]===post.canonicalPath),'Apache 301 '+alias);
 }
}
for(const file of await htmlFiles('dist')){
 const $=cheerio.load(await fs.readFile(file,'utf8'));
 for(const link of $('a[href],area[href]').toArray())assert.equal($(link).attr('href'),canonicalBlogLink($(link).attr('href')),file+' has an outdated internal article link');
}
const [old,target]=Object.entries(map)[0];assert.equal(canonicalBlogLink(old+'?utm_source=test#details'),target+'?utm_source=test#details');
assert.equal(canonicalBlogLink('https://www.roofkingco.com'+old),'https://www.roofkingco.com'+target);
assert.equal(canonicalBlogLink('https://example.com'+old),'https://example.com'+old);
assert.equal(canonicalBlogLink('//example.com'+old),'//example.com'+old);
console.log(`21 single-canonical articles, ${Object.keys(map).length} direct redirects, category/tag fallback policy, query/hash preservation and all rendered internal article links passed.`);
