import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as cheerio from 'cheerio';
import blogUrls from '../src/data/blog-url-map.json' with {type:'json'};
export function canonicalBlogLink(href){
 if(!href||!href.startsWith('/')&&!/^https?:\/\/(?:www\.)?roofkingco\.com(?:\/|$)/i.test(href))return href;
 let url;try{url=new URL(href,'https://www.roofkingco.com');}catch{return href;}
 if(!['www.roofkingco.com','roofkingco.com'].includes(url.hostname))return href;
 const canonical=blogUrls[url.pathname.endsWith('/')?url.pathname:url.pathname+'/'];
 if(!canonical)return href;
 return (href.startsWith('/')?'':url.origin)+canonical+url.search+url.hash;
}

const logo='/media/wordpress/c10174a8f44b-8b736098-7b60-4aa7-85cc-27b1b719327f.png';
const clean=value=>(value||'').replace(/[↗→↓↑←]/g,'').replace(/\s+/g,' ').trim();
function destinationLabel(href){
 if(href.startsWith('tel:'))return 'Call '+href.slice(4);
 if(href.startsWith('mailto:'))return 'Email '+href.slice(7);
 if(href==='/')return 'Roof King & Restoration home';
 if(href.startsWith('#'))return 'Jump to '+clean(href.slice(1).replace(/[-_]/g,' '));
 try{const url=new URL(href,'https://www.roofkingco.com');return clean(decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1)||url.hostname).replace(/[-_]/g,' '));}catch{return 'Open linked content';}
}
export function completeHtmlAttributes(html){
 const $=cheerio.load(html);let images=0,links=0,urls=0;
 for(const el of $('img:not([alt])').toArray()){
  const img=$(el);
  if(img.attr('src')!==logo)throw new Error('Supply a descriptive alt attribute for image: '+img.attr('src'));
  img.attr('alt','Roof King & Restoration logo');images++;
 }
 for(const el of $('a,area').toArray()){
  const link=$(el);const href=link.attr('href'),canonical=canonicalBlogLink(href);
  if(canonical!==href){link.attr('href',canonical);urls++;}
  if(clean(link.attr('title')))continue;
  const copy=link.clone();copy.find('[aria-hidden="true"],script,style').remove();
  const labelledBy=clean(link.attr('aria-labelledby')).split(' ').filter(Boolean).map(id=>$('[id]').filter((_i,node)=>$(node).attr('id')===id).text()).join(' ');
  let title=clean(link.attr('aria-label'))||clean(link.attr('alt'))||clean(labelledBy)||clean(copy.text())||clean(link.find('img[alt]').first().attr('alt'))||destinationLabel(link.attr('href')||'');
  if(/^(read more|learn more|read article|view details|explore|source|open)$/i.test(title)){
   const context=clean(link.closest('article,figure,li').find('h2,h3,h4,figcaption').first().text());
   if(context)title+=': '+context;
  }
  link.attr('title',title);links++;
 }
 return {html:$.html(),images,links,urls};
}
export async function htmlFiles(root){return (await fs.readdir(root,{recursive:true})).filter(file=>file.endsWith('.html')).map(file=>path.join(root,file));}
export default function htmlAttributes(){return {name:'required-html-attributes',hooks:{'astro:build:done':async({dir,logger})=>{
 const files=await htmlFiles(fileURLToPath(dir));let images=0,links=0;
 for(const file of files){const original=await fs.readFile(file,'utf8');const result=completeHtmlAttributes(original);images+=result.images;links+=result.links;if(result.images||result.links||result.urls)await fs.writeFile(file,result.html);}
 logger.info(`Required attributes: ${files.length} HTML pages; completed ${images} image alternatives and ${links} link titles.`);
}}};}
