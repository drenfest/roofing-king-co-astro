import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {htmlFiles} from './html-attributes.mjs';
import site from '../src/data/site.json' with {type:'json'};
import manifest from '../migration/route-manifest.json' with {type:'json'};
const marketingPaths=new Set(manifest.routes.map(route=>route.path));
import { readBuildPolicy, robotsTxt } from './indexing-policy.mjs';
const policy=await readBuildPolicy();
const xml=await fs.readFile('dist/sitemap.xml','utf8');
assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
const $=load(xml,{xmlMode:true});assert.equal($('urlset').attr('xmlns'),'http://www.sitemaps.org/schemas/sitemap/0.9');
const urls=$('urlset>url>loc').map((_i,el)=>$(el).text()).get();assert.equal(urls.length,new Set(urls).size);
const expected=[];
for(const file of await htmlFiles('dist')){
 const page=load(await fs.readFile(file,'utf8'));const canonical=page('link[rel=canonical]').attr('href');
 if(/\b(?:noindex|none)\b/i.test(page('meta[name=robots]').attr('content')||''))continue;
 if(!canonical||!page('main').length||page('meta[http-equiv=refresh]').length)continue;
 const pathname='/'+path.relative('dist',file).split(path.sep).join('/').replace(/index\.html$/,'');
 const url=new URL(canonical);if(marketingPaths.has(pathname)&&url.origin===site.url&&url.pathname===pathname)expected.push(canonical);
}
assert.deepEqual(urls,[...new Set(expected)].sort());
for(const url of urls){assert.equal(new URL(url).origin,site.url);assert.equal(new URL(url).hash,'');assert.equal(new URL(url).search,'');}
if(policy.environment==='production')for(const suffix of ['/','/blog/','/category/roofing/','/tag/columbus-oh/','/roofing/','/service-areas/','/offers/payments/'])assert.ok(urls.includes(site.url+suffix));
for(const suffix of ['/gallery/','/migration-review/','/404.html','/about/','/contact/'])assert.ok(!urls.includes(site.url+suffix));
assert.equal($('lastmod,changefreq,priority').length,0,'Do not manufacture update dates or priorities.');
const robots=await fs.readFile('dist/robots.txt','utf8');assert.equal(robots,robotsTxt(policy.environment));
console.log(`sitemap.xml: ${urls.length} eligible canonical public URLs; ${policy.environment} indexing policy checked. Private, review, error and redirect pages excluded.`);
