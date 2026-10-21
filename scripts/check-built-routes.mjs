import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
const {routes}=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8'));
const failures=[];const missingAssets=new Set();const brokenLinks=new Set();
const paths=new Set(routes.map(r=>r.path));
const redirects=JSON.parse(await fs.readFile('migration/route-redirects.json','utf8'));
const navigation=JSON.parse(await fs.readFile('src/data/navigation.json','utf8'));
const navigationLinks=[];function collect(items){for(const item of items){navigationLinks.push(item.href);collect(item.children);}}collect(navigation.items);
if(new Set(navigationLinks).size!==navigationLinks.length)failures.push('Duplicate primary menu destinations');
if(JSON.stringify(navigation.items).includes('Our Story'))failures.push('Removed Our Story menu item returned');
for(const route of routes){
 const target='dist'+route.path+'index.html';
 let html;try{html=await fs.readFile(target,'utf8');}catch{failures.push('Missing output '+target);continue;}
 const $=cheerio.load(html);
 if(redirects[route.path]){
  const refresh=$('meta[http-equiv="refresh"]').attr('content')||'';
  if(!refresh.includes(redirects[route.path]))failures.push('Invalid client-approved redirect '+route.path);
  continue;
 }
 const header=$('header.rk-native-header');
 if(header.length!==1)failures.push('Missing shared native header '+route.path);
 const headerLinks=new Set(header.find('a[href]').map((i,e)=>$(e).attr('href')).get());
 for(const href of navigationLinks)if(!headerLinks.has(href))failures.push('Missing server-rendered navigation link '+href+' on '+route.path);
 for(const button of header.find('button[aria-controls]').toArray())if(header.find(`[id="${$(button).attr('aria-controls')}"]`).length!==1)failures.push('Invalid navigation toggle target on '+route.path);
 const customerCopy=$('body').clone();customerCopy.find('script,style,template').remove();
 if(/\bscop(?:e|es|ing)\b/i.test(customerCopy.text()))failures.push('Generic scope wording in customer copy '+route.path);
 if($('h1').length!==1)failures.push('Invalid H1 '+route.path);
 if(!$('link[rel="canonical"]').attr('href')?.endsWith(route.canonicalPath))failures.push('Canonical mismatch '+route.path);
 if($('meta[http-equiv="refresh"]').length)failures.push('Unexpected redirect '+route.path);
 for(const e of $('[src],[href]').toArray()){
  const value=$(e).attr('src')||$(e).attr('href');if(!value?.startsWith('/')||value.startsWith('//'))continue;
  const pathname=value.split(/[?#]/)[0];if(!pathname)continue;
  if(/\.[a-z0-9]{2,5}$/i.test(pathname)&&!pathname.endsWith('/')){
   try{await fs.access('dist'+pathname);}catch{missingAssets.add(pathname);}
  }else if(!paths.has(pathname.endsWith('/')?pathname:pathname+'/')&&!pathname.startsWith('/migration-review'))brokenLinks.add(pathname);
 }
}
await fs.writeFile('migration/build-audit.json',JSON.stringify({pathsChecked:routes.length,missingAssets:[...missingAssets],brokenLinks:[...brokenLinks],failures},null,2));
if(failures.length||missingAssets.size||brokenLinks.size)throw Error(JSON.stringify({failures,missingAssets:[...missingAssets],brokenLinks:[...brokenLinks]},null,2));
console.log(`All ${routes.length} static paths, canonical targets, links, and HTML asset references passed.`);
