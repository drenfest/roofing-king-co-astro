/** Explicit import only. Future content edits happen in src/content/pages, not the DB. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async p=>JSON.parse((await fs.readFile(path.join(root,p),'utf8')).replace(/^\uFEFF/,''));
const site=await read('src/data/site.json');
const wordpress=await read('migration/sources/wordpress-content.json');
const inventory=await read('migration/url-inventory.json');
const sourceRoot=process.env.WORDPRESS_SOURCE_ROOT||'S:/projects/xampp/htdocs/roofingkingco';
const staticRoot=process.env.STATIC_SNAPSHOT_ROOT||'S:/projects/xampp/htdocs/roofking-jared-review/site';
const sourceBase='http://localhost/roofingkingco';
const records=wordpress.records;
const toPath=url=>new URL(url).pathname.replace(/^\/roofingkingco/,'')||'/';
const byPath=new Map(records.map(r=>[toPath(r.url),r]));
const cleanBody=html=>{
 const $=cheerio.load(html,null,false);
 $('script,style,iframe,object,embed,link[rel="stylesheet"],input,select,textarea,button[type="submit"]').remove();
 $('form').replaceWith(`<div class="rk-migration-contact"><h2>Talk with Roof King</h2><p>Discuss your project with the team.</p><a class="rk-button rk-button-primary" href="${site.phoneHref}">Call ${site.phone}</a></div>`);
 $('[data-rk-modal-open]').each((i,e)=>{$(e).removeAttr('data-rk-modal-open').removeAttr('aria-controls').attr('href','/contact-us/');});
 $('a[href="#quote-form"],a[href="#rk-quote-modal"]').attr('href','/contact-us/');
 $('[href],[src],[srcset],[style],[data-src],[data-original]').each((i,e)=>{
  for(const a of ['href','src','srcset','style','data-src','data-original']){
   const value=$(e).attr(a);if(!value)continue;
   let next=value.replace(/https?:\/\/localhost\/roofingkingco/g,'').replace(/https?:\/\/wordpress-1269393-6519803\.cloudwaysapps\.com/g,'').replace(/https?:\/\/(?:www\.)?roof-kingco\.com/g,'').replace(/https?:\/\/(?:www\.)?roofkingco\.com(?=\/)/g,'');
   next=next.replace(/\/wp-content\/uploads\/roofkingco-imports\//g,'/media/wordpress/').replace(/\/assets\//g,'/media/static-build/assets/');
   next=next.replace(/^tel:\+?1?6143798893$/i,site.phoneHref);
   const corrections={'/roofing/replacements/':'/roofing/replacement/','/projectgallery/':'/gallery/','/roofing-contractors-dublin-oh/':'/roofing-contractor-dublin-oh/'};
   if(a==='href'&&corrections[next])next=corrections[next];
   $(e).attr(a,next);
  }
 });
 return $.html().replace(/\(614\) (?:379-8893|490-0123)/g,site.phone).replaceAll('Columbus, OH 43085','Columbus, OH 43229').replace(/<!--(?:.|\n)*?-->/g,'');
};
const normaliseHeadings=(body,title)=>{
 const $=cheerio.load(body,null,false);const headings=$('h1');
 if(!headings.length)$.root().prepend('<h1 class="rk-migration-title"></h1>'),$('h1').first().text(title);
 headings.slice(1).each((i,e)=>{$(e).replaceWith('<h2>'+$(e).html()+'</h2>');});
 return $.html();
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const oldTheme=path.join(sourceRoot,'wp-content/themes/roofkingco');
await fs.mkdir(path.join(root,'public/media'),{recursive:true});
await fs.cp(path.join(sourceRoot,'wp-content/uploads/roofkingco-imports'),path.join(root,'public/media/wordpress'),{recursive:true});
await fs.cp(path.join(staticRoot,'assets'),path.join(root,'public/media/static-build/assets'),{recursive:true});
await fs.mkdir(path.join(root,'src/styles'),{recursive:true});
let css=await fs.readFile(path.join(oldTheme,'src/styles/main.css'),'utf8');
css=css.replace(/https?:\/\/localhost\/roofingkingco\/wp-content\/uploads\/roofkingco-imports\//g,'/media/wordpress/').replaceAll('/wp-content/uploads/roofkingco-imports/','/media/wordpress/');
await fs.writeFile(path.join(root,'src/styles/wordpress-compatibility.css'),css);
await fs.mkdir(path.join(root,'src/scripts/compatibility'),{recursive:true});
for(const file of ['navigation.js','gallery.js','before-after.js','reveal.js'])await fs.copyFile(path.join(oldTheme,'src/components',file),path.join(root,'src/scripts/compatibility',file));
const rendered=new Map();let shell;
for(let i=0;i<records.length;i+=4){
 await Promise.all(records.slice(i,i+4).map(async record=>{
  const p=toPath(record.url);const r=await fetch(sourceBase+p,{signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw Error('WordPress export failed: '+p+' '+r.status);
  const raw=await r.text();const $=cheerio.load(raw);
  if(!shell){shell={header:cleanBody($('header.rk-site-header').prop('outerHTML')||''),footer:cleanBody($('footer').first().prop('outerHTML')||'')};}
  const main=$('main#content').html();if(!main)throw Error('Missing WordPress main content: '+p);
  rendered.set(p,cleanBody(main));
 }));
}
await fs.writeFile(path.join(root,'migration/sources/wordpress-rendered.json'),JSON.stringify(Object.fromEntries(rendered),null,2));
await fs.mkdir(path.join(root,'src/data'),{recursive:true});
await fs.writeFile(path.join(root,'src/data/imported-shell.json'),JSON.stringify(shell,null,2));
const simpleAliases={'/about/':'/about-us/','/contact/':'/contact-us/','/privacy/':'/privacy-policy-2/','/privacy-policy/':'/privacy-policy-2/'};
const out=[];
const extraRoutes=new Set();
for(const html of [...rendered.values(),shell.header,shell.footer]){
 const $=cheerio.load(html);$('a[href]').each((i,e)=>{const p=$(e).attr('href');if(/^\/(category|tag)\/[^/]+\/$/.test(p)||/^\/blog\/page\/\d+\/$/.test(p))extraRoutes.add(p);});
}
for(const p of extraRoutes)if(!inventory.rows.some(r=>r.path===p))inventory.rows.push({path:p,title:'',category:'Archive'});
for(const route of inventory.rows){
 const p=route.path;let record=byPath.get(p),body='',source='wordpress',sourcePath=p,notes=[];
 let kind=route.category||'page';
 if(!record&&simpleAliases[p]){sourcePath=simpleAliases[p];record=byPath.get(sourcePath);source='wordpress-alternate-route';notes.push('Alternate path retained as a 200 response; canonical points to the preferred content URL.');}
 if(!record&&p.startsWith('/blog/')&&!/^\/blog\/[ac]\./.test(p)){
  const slug=p.split('/').filter(Boolean).at(-1);
  record=records.find(r=>r.type==='post'&&toPath(r.url).split('/').filter(Boolean).at(-1)===slug);
  if(record){sourcePath=toPath(record.url);source='wordpress-alternate-route';notes.push('Both historical and current article paths retained.');}
 }
 let title=record?.title||route.title||p;
 if(record)body=rendered.get(sourcePath)||'';
 else if(route.hyphenatedStatus===200){
  const file=path.join(staticRoot,p.replace(/^\//,''),'index.html');
  const raw=await fs.readFile(file,'utf8');const $=cheerio.load(raw);
  title=$('h1').first().text().trim()||title;body=cleanBody($('main').html()||'');source='published-static-build';notes.push('Imported published HTML, not the original source repository. Verify claims and rebuild components.');
 }else if(/^\/(category|tag)\//.test(p)||/^\/blog\/page\/\d+\/$/.test(p)){
  source='reconstructed-wordpress-archive';kind='Archive';
  const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  let matches=[];
  if(p.startsWith('/blog/page/')){
   const page=Number(p.split('/')[3]);title='Roof King Blog - Page '+page;
   matches=records.filter(r=>r.type==='post').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice((page-1)*10,page*10);
  }else{
   const [taxonomy,slug]=p.split('/').filter(Boolean);const field=taxonomy==='category'?'categories':'tags';
   matches=records.filter(r=>r.type==='post'&&r[field].some(label=>slugify(label)===slug));
   title=(matches.flatMap(r=>r[field]).find(label=>slugify(label)===slug)||slug.replaceAll('-',' '))+' Articles';
  }
  body='<section class="rk-migration-archive"><h1>'+esc(title)+'</h1><ul>'+matches.map(r=>'<li><a href="'+toPath(r.url)+'">'+esc(r.title)+'</a></li>').join('')+'</ul></section>';
  notes.push('Additional WordPress taxonomy/pagination path discovered in rendered internal links. Recreated from published post terms.');
 }else if(/^\/blog\/[ac]\./.test(p)){
  source='reconstructed-wordpress-archive';kind='Archive';
  const author=p.startsWith('/blog/a.');const topic=p.split('/').filter(Boolean).at(-1).slice(2).replaceAll('-',' ');
  title=author?'Articles by '+(topic==='jared l'?'Jared L.':'Roof King & Restoration'):topic.replace(/\b\w/g,c=>c.toUpperCase())+' Articles';
  const tokens=topic.split(' ').filter(t=>t.length>3);
  const matches=records.filter(r=>r.type==='post'&&(author||tokens.some(t=>(r.title+' '+r.categories.join(' ')+' '+r.tags.join(' ')).toLowerCase().includes(t))));
  body='<section class="rk-migration-archive"><h1>'+esc(title)+'</h1><ul>'+matches.map(r=>'<li><a href="'+toPath(r.url)+'">'+esc(r.title)+'</a></li>').join('')+'</ul></section>';
  notes.push('Archive recreated from imported published posts. Author attribution/topic mapping requires editorial verification.');
 }else {
  const extraPath=path.join(root,'migration/sources/additional',p.replace(/^\//,'')+'index.html');
  body=await fs.readFile(extraPath,'utf8');body=cleanBody(body);source='live-browser-capture';
  const $=cheerio.load(body);title=$('h1').first().text().trim()||title;
 }
 body=normaliseHeadings(body,title);
 const plain=cheerio.load(body).text().replace(/\s+/g,' ').trim();
 const description=record?.description||plain.slice(0,157);
 let canonicalPath=p;
 if(['/privacy/','/privacy-policy-2/'].includes(p))canonicalPath='/privacy-policy/';
 if(p==='/about/')canonicalPath='/about-us/';if(p==='/contact/')canonicalPath='/contact-us/';
 if(p.startsWith('/blog/p.')){const slug=p.split('/').filter(Boolean).at(-1);const clean='/blog/'+slug+'/';if(inventory.rows.some(r=>r.path===clean))canonicalPath=clean;}
 const meta={title,permalink:p,description,canonicalPath,category:kind,source,sourcePath,wordpressId:record?.id||null,reviewStatus:'imported-needs-review',notes,priority:p==='/'||p==='/roofing/'?'first-component-rebuild':'preserve-and-improve'};
 const destination=path.join(root,'src/content/pages',p==='/'?'index.md':p.replace(/^\//,'')+'index.md');
 await fs.mkdir(path.dirname(destination),{recursive:true});
 const front=Object.entries(meta).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n');
 await fs.writeFile(destination,'---\n'+front+'\n---\n\n'+body+'\n');
 out.push({path:p,file:path.relative(root,destination).replaceAll('\\','/'),source,wordpressId:meta.wordpressId,canonicalPath,notes,words:plain.split(' ').length});
}
await fs.writeFile(path.join(root,'migration/route-manifest.json'),JSON.stringify({generatedAt:new Date().toISOString(),count:out.length,routes:out},null,2));
console.log('Imported',out.length,'routes. Sources:',out.reduce((o,r)=>(o[r.source]=(o[r.source]||0)+1,o),{}));
