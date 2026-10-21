// Public review smoke test; no credentials or Cloudways API tokens.
import assert from 'node:assert/strict';
const base='https://wordpress-1269393-6519803.cloudwaysapps.com';
for(const path of ['/','/roofing/','/roofing/gaf/master-elite/','/commercial-roofing/repair/','/service-page-review.html']){
 const response=await fetch(base+path,{signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,path);
 const html=await response.text();assert.match(html,/noindex/i,path+' must remain a review site');
 assert.doesNotMatch(html,/wp-content\/themes|wp-includes\//i,path+' still serves WordPress');
 console.log('Review site passed: '+path);
}
const robots=await fetch(base+'/robots.txt');assert.match(await robots.text(),/Disallow: \//);
const missing=await fetch(base+'/this-page-does-not-exist-review-check/');assert.equal(missing.status,404,'Unknown URLs must return 404');
