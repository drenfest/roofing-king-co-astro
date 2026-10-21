import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
import site from '../src/data/site.json' with {type:'json'};
import {htmlFiles} from './html-attributes.mjs';

const escapeXml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');

export async function generateSitemap(root){
 const urls=new Set();
 for(const file of await htmlFiles(root)){
  const $=load(await fs.readFile(file,'utf8'));
  if(!$('main').length||$('meta[http-equiv]').toArray().some(el=>/refresh/i.test($(el).attr('http-equiv')||'')))continue;
  const href=$('link[rel=canonical]').attr('href');if(!href)continue;
  const url=new URL(href,site.url);
  const pathname='/'+path.relative(root,file).replaceAll('\\','/').replace(/(?:^|\/)index\.html$/,'/').replace(/^\//,'');
  // Only a page's own canonical URL belongs here, never aliases or review/error files.
  if(url.origin!==site.url||url.pathname!==pathname||url.search||url.hash)continue;
  urls.add(url.href);
 }
 const sorted=[...urls].sort();
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+sorted.map(url=>`  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')+'\n</urlset>\n';
 await fs.writeFile(path.join(root,'sitemap.xml'),xml);
 return sorted;
}

export default function sitemap(){return {name:'canonical-sitemap',hooks:{'astro:build:done':async({dir,logger})=>{
 const urls=await generateSitemap(fileURLToPath(dir));logger.info(`Generated sitemap.xml with ${urls.length} canonical public URLs.`);
}}};}
