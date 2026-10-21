import fs from 'node:fs/promises';
import YAML from 'yaml';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
const urlMap=JSON.parse(await fs.readFile('src/data/blog-url-map.json','utf8'));
const canonical=href=>urlMap[href]||href;
const nav=JSON.parse(await fs.readFile('src/data/navigation.json','utf8'));
const featured=JSON.parse(await fs.readFile('src/data/featured-articles.json','utf8'));
const files=(await fs.readdir('src/content/pages',{recursive:true})).filter(f=>f.endsWith('index.md'));
const pages=await Promise.all(files.map(async f=>{const raw=await fs.readFile('src/content/pages/'+f,'utf8');return {raw,data:YAML.parse(raw.split('---')[1])};}));
const descriptions={
 Roofing:'Roofing materials, installation and maintenance advice to help protect your home.',
 'Roof Replacement':'Plan a new roof, understand installation and compare the factors that affect replacement costs.',
 'Storm Damage':'Recognize hail and wind damage, plan an inspection and prepare repair documentation.',
 Seasonal:'Prepare your roof and exterior for changing weather and seasonal projects.',
 'Roof Repair':'Understand leak warning signs, damaged shingles and the choice between repair and replacement.',
 Gutters:'Explore drainage, gutter maintenance and guards that help keep roof runoff moving.',
 Siding:'Learn about replacing worn siding and protecting the walls behind your home’s exterior.',
 'GAF Roofing':'Explore GAF shingles and the installation choices that go into a new roofing system.',
 'Ice Dam Removal':'Understand winter ice buildup, drainage problems and roof-edge leak prevention.',
 'Columbus, OH':'Roofing, siding, gutter and storm advice written for Columbus homeowners.',
 'Dublin, OH':'Dublin roofing guides covering repairs, replacement, service life and contractor selection.',
 'Roof Inspection':'Learn what damage to look for and how a roof inspection informs the next repair step.',
 'Hiring Tips':'Know what to discuss with a roofing contractor before choosing your installation team.',
 'Winter Roofing':'Cold-weather repairs, winter preparation and ice-dam considerations for Ohio homes.',
 'GAF Shingles':'Read about GAF shingle choices when planning your roof replacement.',
 'Wind Damage':'Understand lifted shingles, exposed roof layers and inspections after strong winds.',
 'Cost Guides':'Learn which materials, roof details and repair conditions affect a roofing estimate.',
 'Hail Damage':'Identify signs of hail damage and understand when to request a closer inspection.',
 'Christmas Lights':'Read about planning seasonal exterior lighting and arranging installation.',
 'Insurance Claims':'Roof inspections, storm documentation and questions to prepare before discussing an insurance claim.',
 'Gutter Guards':'Learn about debris protection, gutter guard installation and ongoing gutter maintenance.'
};
const blog=nav.items.find(i=>i.label==='Blog');
const hubs={};const slug=url=>url.split('/').filter(Boolean).at(-1);
for(const kind of ['categories','topics']){
 const branch=blog.children.find(i=>i.label.toLowerCase()===kind);branch.href=`/blog/${kind}/`;
 const groups=[];
 for(const item of branch.children){
  const archive=pages.find(p=>p.data.permalink===item.href);if(!archive)throw Error('Missing archive '+item.href);
  const $=cheerio.load(archive.raw.split('---').slice(2).join('---'));
  const urls=[...new Set($('li>a[href]').toArray().map(a=>$(a).attr('href')))];
  const posts=urls.map(href=>{
   const post=pages.find(p=>p.data.category==='Article'&&!p.data.permalink.includes('/p.')&&slug(p.data.permalink)===slug(href))||pages.find(p=>p.data.category==='Article'&&slug(p.data.permalink)===slug(href));
   if(!post)throw Error('Missing published article '+href);
   const record=featured.find(p=>slug(p.href)===slug(href));
   return {href:canonical(post.data.permalink),title:post.data.title,description:record?.description||post.data.description,raw:post.raw,image:record?.image};
  });
  if(!posts.length)throw Error('Empty menu archive '+item.href);
  const first=posts[0];let image=first.image;
  if(!image){
   const source=first.raw.match(/rk-blog-hero-image: url\('([^']+)/)?.[1]||first.raw.match(/<img[^>]+src="([^"]+)/)?.[1];
   if(!source)throw Error('Missing topic image '+item.label);
   const src=`/media/articles/hub-${slug(item.href)}-600.webp`;
   const info=await sharp('public'+source).resize({width:600,height:400,fit:'cover',withoutEnlargement:true}).webp({quality:75}).toFile('public'+src);
   image={src,alt:first.title,width:info.width,height:info.height,variants:[{src,width:info.width}]};
  }
  groups.push({label:item.label,href:item.href,description:descriptions[item.label],count:posts.length,image,candidateImages:posts.map(p=>p.image).filter(Boolean).concat(image),articles:posts.slice(0,2).map(({href,title})=>({href,title}))});
 }
 // Give each collection its own relevant thumbnail, reserving scarce choices first.
 const owner=new Map(),assigned=new Map();
 const imageKey=image=>featured.find(p=>p.image.src===image.src)?.sourceImage||image.src;
 function assign(index,seen=new Set()){
  for(const image of groups[index].candidateImages){
   const key=imageKey(image);if(seen.has(key))continue;seen.add(key);
   if(!owner.has(key)||assign(owner.get(key),seen)){owner.set(key,index);assigned.set(index,image);return true;}
  }return false;
 }
 for(const index of groups.map((_g,i)=>i).sort((a,b)=>groups[a].candidateImages.length-groups[b].candidateImages.length))if(!assign(index))throw Error('Need another relevant collection thumbnail: '+groups[index].label);
 groups.forEach((group,index)=>{group.image=assigned.get(index);delete group.candidateImages;});
 hubs[kind]={path:branch.href,title:kind==='categories'?'Blog categories':'Blog topics',description:kind==='categories'?'Find roofing, siding, gutter and storm-damage articles organized by service.':'Browse Roof King articles by location, project questions and seasonal concerns.',groups};
}
await fs.writeFile('src/data/navigation.json',JSON.stringify(nav,null,2)+'\n');
await fs.writeFile('src/data/blog-hubs.json',JSON.stringify(hubs,null,2)+'\n');
const uniquePosts=new Map();
for(const post of pages.filter(p=>p.data.category==='Article')){
 const key=slug(post.data.permalink),current=uniquePosts.get(key);
 if(!current||current.data.permalink.includes('/p.'))uniquePosts.set(key,post);
}
const indexArticles=[];
for(const [key,post]of uniquePosts){
 const record=featured.find(p=>slug(p.href)===key);
 let image=record?.image;
 if(!image&&/christmas/.test(key))image=hubs.topics.groups.find(g=>g.label==='Christmas Lights').image;
 if(!image)image=featured.find(p=>p.topics.includes('wind')).image;
 const $=cheerio.load(post.raw.split('---').slice(2).join('---'));
 const author=$('.rk-blog-meta span').first().text().replace(/^By\s+/i,'').trim()||null;
 const date=post.raw.match(/<time[^>]+datetime="([^"]+)"/)?.[1]||null;
 indexArticles.push({href:canonical(post.data.permalink),title:post.data.title,description:record?.description||(/christmas/.test(key)?'Planning seasonal lighting, installation timing and exterior access before the holiday season.':'What to check, photograph and discuss with a contractor after strong winds affect your roof.'),image,date,author});
}
indexArticles.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.title.localeCompare(b.title));
await fs.writeFile('src/data/blog-index.json',JSON.stringify(indexArticles,null,2)+'\n');
const archives={};
for(const group of [...hubs.categories.groups,...hubs.topics.groups]){
 const source=pages.find(p=>p.data.permalink===group.href);const $=cheerio.load(source.raw.split('---').slice(2).join('---'));
 const keys=new Set($('li>a[href]').toArray().map(a=>slug($(a).attr('href'))));
 const items=indexArticles.filter(a=>keys.has(slug(a.href)));
 if(items.length!==group.count)throw Error('Archive articles did not resolve: '+group.href);
 archives[group.href]={kind:group.href.startsWith('/tag/')?'topics':'categories',title:group.label+' articles',description:group.description,label:group.label,items};
}
await fs.writeFile('src/data/blog-archives.json',JSON.stringify(archives,null,2)+'\n');
await fs.writeFile('src/data/article-media.json',JSON.stringify(Object.fromEntries(indexArticles.map(a=>[a.image.src,{width:a.image.width,height:a.image.height,variants:a.image.variants}])),null,2)+'\n');
console.log(`Built 2 hubs from ${hubs.categories.groups.length} category archives and ${hubs.topics.groups.length} assigned-topic archives.`);
