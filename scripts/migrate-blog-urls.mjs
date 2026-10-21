import fs from 'node:fs/promises';
import YAML from 'yaml';
import {chooseBlogTerm} from './blog-url-policy.mjs';
const save=(file,data)=>fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8'));
const original=manifest.routes.filter(r=>r.source!=='blog-canonical');
const source=JSON.parse(await fs.readFile('migration/sources/wordpress-content.json','utf8')).records.filter(p=>p.type==='post');
const pages=await Promise.all(original.map(async route=>{const raw=await fs.readFile(route.file,'utf8');return {route,raw,data:YAML.parse(raw.split('---')[1])};}));
const articles=pages.filter(p=>p.data.category==='Article');
const slug=href=>href.split('/').filter(Boolean).at(-1);
const grouped=new Map();for(const page of articles){const key=slug(page.route.path);grouped.set(key,[...(grouped.get(key)||[]),page]);}
const aliases={},posts=[],newRoutes=[];const targets=new Set();
for(const [key,variants]of grouped){
 const preferred=variants.find(p=>!p.route.path.includes('/p.'))||variants[0];
 const record=source.find(p=>slug(new URL(p.sourceUrl||p.url).pathname)===key);
 const term=chooseBlogTerm(record?.categories,record?.tags);
 const canonicalPath=term?`/blog/${term.slug}/${key}/`:preferred.route.path;
 if(targets.has(canonicalPath))throw Error('Canonical URL collision '+canonicalPath);targets.add(canonicalPath);
 for(const page of variants){
  page.route.canonicalPath=canonicalPath;
  if(page.route.path!==canonicalPath)aliases[page.route.path]=canonicalPath;
  // Keep imported article bodies and their original source paths as evidence.
  const notes=[...new Set([...page.data.notes,'Client-approved category/tag canonical URL. Historical article URLs permanently redirect to one canonical article.'])];
  const updated=page.raw.replace(/^canonicalPath:.*$/m,'canonicalPath: '+JSON.stringify(canonicalPath)).replace(/^notes:.*$/m,'notes: '+JSON.stringify(notes));
  if(updated!==page.raw)await fs.writeFile(page.route.file,updated);
 }
 posts.push({slug:key,title:preferred.data.title,canonicalPath,sourcePath:preferred.route.path,sourceFile:preferred.route.file,term,categories:record?.categories||[],tags:record?.tags||[],aliases:variants.map(p=>p.route.path).filter(p=>p!==canonicalPath)});
 if(!original.some(r=>r.path===canonicalPath))newRoutes.push({...preferred.route,path:canonicalPath,source:'blog-canonical',canonicalPath,notes:['Client-approved category/tag article URL; renders the existing source article without duplicating its content record.']});
}
const redirects=JSON.parse(await fs.readFile('migration/route-redirects.json','utf8'));
Object.assign(redirects,aliases);for(const destination of Object.values(aliases))if(aliases[destination])throw Error('Redirect chain '+destination);
manifest.routes=[...original,...newRoutes].sort((a,b)=>a.path.localeCompare(b.path));manifest.count=manifest.routes.length;
await save('migration/route-manifest.json',manifest);await save('migration/route-redirects.json',redirects);
await save('src/data/blog-url-map.json',aliases);
await save('src/data/blog-routes.json',{policy:'First assigned category; otherwise first assigned tag, in original exported order. If neither exists, retain the existing clean article URL. One canonical per article; every existing alias redirects directly.',posts});
const accessFile='public/.htaccess';let access=await fs.readFile(accessFile,'utf8');
access=access.replace(/\n  # BEGIN BLOG REDIRECTS[\s\S]*?  # END BLOG REDIRECTS\n/g,'\n');
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const rules=Object.entries(aliases).map(([from,to])=>`  RewriteRule ^${escape(from.slice(1,-1))}/?$ ${to} [R=301,L,NE]`).join('\n');
access=access.replace('  RewriteEngine On','  RewriteEngine On\n  # BEGIN BLOG REDIRECTS\n'+rules+'\n  # END BLOG REDIRECTS');await fs.writeFile(accessFile,access);
// Persist canonical destinations in authored UI data as well as the HTML link guard.
function rewrite(value){if(typeof value==='string')return aliases[value]||value;if(Array.isArray(value))return value.map(rewrite);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewrite(v)]));return value;}
for(const name of ['home','featured-articles','blog-hubs','blog-index','blog-archives','service-editorial','service-copy','service-overrides','service-pages']){
 const file=`src/data/${name}.json`;const before=JSON.parse(await fs.readFile(file,'utf8'));const after=rewrite(before);if(JSON.stringify(before)!==JSON.stringify(after))await save(file,after);
}
await save('migration/blog-url-migration.json',{reviewedAt:'2026-10-21',policy:'Category first, tag fallback, original assignment order; no inferred taxonomy.',newCanonicals:newRoutes.length,redirects:aliases,untagged:posts.filter(p=>!p.term).map(p=>p.canonicalPath)});
console.log(`${posts.length} articles: ${newRoutes.length} category/tag canonical URLs; ${Object.keys(aliases).length} direct permanent redirects; ${posts.filter(p=>!p.term).length} existing clean URL retained without assigned taxonomy.`);
