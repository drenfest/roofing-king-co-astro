// Public deployment checks only. No credentials or Cloudways API tokens.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
const base='https://wordpress-1269393-6519803.cloudwaysapps.com';
const expected=process.env.REVIEW_EXPECTED_COMMIT||process.env.GITHUB_SHA;
const query=expected?`?release=${expected}`:'';
async function get(path){
 const response=await fetch(base+path+query,{cache:'no-store',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,path);return response;
}
const release=await(await get('/release.json')).json();
assert.match(release.commit,/^[a-f0-9]{40}$/);
if(expected)assert.equal(release.commit,expected,'Cloudways must serve this exact commit');
const localSitemap=load(await fs.readFile('dist/sitemap.xml','utf8'),{xmlMode:true});
const urls=localSitemap('loc').map((_i,el)=>localSitemap(el).text()).get();
let cursor=0,checked=0;
await Promise.all(Array.from({length:6},async()=>{
 while(cursor<urls.length){
  const canonical=urls[cursor++],path=new URL(canonical).pathname;
  const local=load(await fs.readFile(`dist${path}index.html`,'utf8'));
  const remote=load(await(await get(path)).text());
  assert.equal(remote('link[rel=canonical]').attr('href'),canonical,path);
  assert.equal(remote('main h1').first().text(),local('main h1').first().text(),path+' heading');
  assert.match(remote('meta[name=robots]').attr('content')||'',/noindex/i,path+' review protection');
  assert.deepEqual(JSON.parse(remote('script[data-site-schema]').text()),JSON.parse(local('script[data-site-schema]').text()),path+' current structured data and content');
  const components='[data-landing-build=editorial],[data-component=OfferPage],[data-component=NativeArticle],[data-component=ServicePaths]';
  assert.equal(remote(components).length,local(components).length,path+' current components');
  assert.equal(remote('#quote-form button[type=submit]:not([disabled])').length,0,path+' disconnected forms');
  checked++;
 }
}));
const remoteSitemap=load(await(await get('/sitemap.xml')).text(),{xmlMode:true});assert.deepEqual(remoteSitemap('loc').map((_i,el)=>remoteSitemap(el).text()).get(),urls);
const robots=await(await get('/robots.txt')).text();assert.match(robots,/Disallow: \//);assert.match(robots,/Sitemap: https:\/\/www\.roofkingco\.com\/sitemap\.xml/);
const home=load(await fs.readFile('dist/index.html','utf8'));
const assets=[home('link[rel=stylesheet]').first().attr('href'),home('script[type=module][src]').first().attr('src'),home('header img').first().attr('src')].filter(Boolean);
for(const asset of [...new Set(assets)])await get(asset);
const review=await(await get('/service-page-review.html')).text();assert.match(review,/noindex/i);
const missing=await fetch(base+'/this-page-does-not-exist-review-check/'+query,{signal:AbortSignal.timeout(30000)});assert.equal(missing.status,404);
console.log(`Live commit ${release.commit}: all ${checked} canonical pages match the verified build; sitemap, schema, components, assets, review protections and 404 behavior passed.`);
