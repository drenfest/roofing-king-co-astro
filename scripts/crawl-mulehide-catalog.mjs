// Explicit manufacturer crawl. Builds use committed data and never fetch.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';
const origin='https://www.mulehide.com',cache='tmp/mule-hide-crawl';
const categories=['TPO','EPDM','EdgeMetal','FastenersTermination','CoverBoardsInsulation','UnderlaymentsVaporBarriers','Adhesives','Sealants','Flashings','SinglePlyAccessories'];
const clean=text=>(text||'').replace(/\s+/g,' ').trim();
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const slug=text=>text.replace(/([a-z\d])([A-Z])/g,'$1-$2').toLowerCase().replace(/[^a-z\d]+/g,'-').replace(/^-|-$/g,'');
const normalize=href=>{const url=new URL(href,origin);return url.origin===origin&&/^\/products\/p\//i.test(url.pathname)?origin+'/Products/p/'+url.pathname.split('/').at(-1):null;};
await fs.mkdir(cache,{recursive:true});
async function page(url,key){
  const file=`${cache}/${key}.html`;
  if(!process.argv.includes('--refresh')){try{return await fs.readFile(file,'utf8');}catch{}}
  const response=await fetch(url);if(!response.ok)throw Error(`Manufacturer ${response.status}: ${url}`);
  const html=await response.text();if(/captcha|access denied|verify you are human/i.test(load(html)('title').text()))throw Error('Access blocked; stop crawl.');
  await fs.writeFile(file,html);return html;
}
const categoryRecords=[],queue=new Map(),excluded=[];
function enqueue(url,category,linkedFrom){
  if(!url)return;
  if(/PVC/i.test(url)){if(!excluded.some(e=>e.url===url))excluded.push({url,reason:'PVC product explicitly excluded'});return;}
  const entry=queue.get(url)||{url,categories:[],linkedFrom:[]};
  if(category&&!entry.categories.includes(category))entry.categories.push(category);
  if(linkedFrom&&!entry.linkedFrom.includes(linkedFrom))entry.linkedFrom.push(linkedFrom);
  queue.set(url,entry);
}
for(const category of categories){
  const url=origin+'/Products/c/'+category,html=await page(url,'category-'+category),$=load(html);
  const productUrls=[...new Set($('a[href]').map((i,e)=>normalize($(e).attr('href'))).get().filter(Boolean))];
  for(const product of productUrls)enqueue(product,category);
  categoryRecords.push({key:category,url,title:clean($('h1').first().text()),sha256:hash(html),productUrls});
}
const records=[],visited=new Set();
while([...queue.keys()].some(url=>!visited.has(url))){
  if(queue.size>350)throw Error('Unexpected catalog expansion; inspect before continuing.');
  const batch=[...queue.values()].filter(e=>!visited.has(e.url)).slice(0,4);
  const outcomes=await Promise.allSettled(batch.map(async entry=>{
    visited.add(entry.url);const key=entry.url.split('/').at(-1),html=await page(entry.url,key),$=load(html),h1=$('h1').first();
    const title=clean(h1.text());if(!title)throw Error('Missing product heading: '+entry.url);
    const header=h1.parent().parent();
    const description=header.children('.prose').find('p').map((i,e)=>clean($(e).text())).get().filter(Boolean);
    const systems=header.find('h2').filter((i,e)=>clean($(e).text())==='System').next().children().map((i,e)=>clean($(e).text())).get().filter(Boolean);
    const features=$('#features li').map((i,e)=>clean($(e).text())).get().filter(Boolean);
    const colorReferences=header.find('[data-bs-title]').map((i,e)=>({name:$(e).attr('data-bs-title'),color:($(e).attr('style')||'').match(/background-color:\s*([^;]+)/)?.[1]?.trim()})).get();
    const image=$('img').toArray().find(e=>clean($(e).attr('alt'))===title),imageUrl=image?new URL($(image).attr('src'),origin).href:null;
    const related=[...new Set($('#related-products a[href]').map((i,e)=>normalize($(e).attr('href'))).get().filter(Boolean))];
    const documents=[];
    for(const e of $('#documents a[href],#details a[href],#specifications a[href]').toArray()){
      const a=$(e),url=new URL(a.attr('href'),origin).href;
      if(!/\.pdf(?:\?|$)/i.test(url)||/spanish/i.test(a.text()))continue;
      const row=a.parents('div').filter((i,e)=>$(e).hasClass('justify-between')).first();
      const label=clean(row.children().first().text())||decodeURIComponent(url.split('/').at(-1)).replace(/\.pdf.*$/i,'');
      if(!/PVC/i.test(label)&&!documents.some(d=>d.url===url))documents.push({label,url});
    }
    const options=[];for(const tr of $('#options table tbody tr').toArray()){
      const cells=$(tr).children('td,th').map((i,e)=>clean($(e).text())).get();if(cells.length)options.push(cells);
    }
    const optionColumns=$('#options table thead th').map((i,e)=>clean($(e).text())).get();
    const incompatible=/PVC/i.test(title)||(systems.length&&!systems.some(s=>/TPO|EPDM|all|metal/i.test(s))&&!entry.categories.some(c=>['EdgeMetal','CoverBoardsInsulation','FastenersTermination'].includes(c)));
    if(incompatible){excluded.push({url:entry.url,title,reason:'Outside confirmed TPO, EPDM and metal range',systems});return;}
    if(!imageUrl)throw Error('Missing authentic product image: '+entry.url);
    records.push({...entry,key,title,description,systems,features,colorReferences,imageUrl,related,documents,optionColumns,options,sha256:hash(html)});
    for(const relatedUrl of related)enqueue(relatedUrl,null,entry.url);
  }));
  for(const outcome of outcomes)if(outcome.status==='rejected')throw outcome.reason;
  console.log(`Crawled ${visited.size}/${queue.size} product pages; retained ${records.length}.`);
}
const retainedUrls=new Set(records.map(r=>r.url));for(const r of records)r.related=r.related.filter(url=>retainedUrls.has(url));
const assets=[],assetByUrl=new Map();
for(let offset=0;offset<records.length;offset+=4){
  const outcomes=await Promise.allSettled(records.slice(offset,offset+4).map(async record=>{
    let asset=assetByUrl.get(record.imageUrl);
    if(!asset){
      const key=hash(record.imageUrl).slice(0,16),rawFile=`${cache}/${key}.image`;
      let raw;try{raw=await fs.readFile(rawFile);}catch{const response=await fetch(record.imageUrl);if(!response.ok)throw Error(`Image ${response.status}: ${record.imageUrl}`);raw=Buffer.from(await response.arrayBuffer());await fs.writeFile(rawFile,raw);}
      const meta=await sharp(raw).metadata(),variants=[];
      for(const width of [...new Set([160,320,640,960].map(w=>Math.min(w,meta.width)))]){
        const file=`public/media/manufacturer-products/${slug(record.key)}-${width}.webp`;
        let encoded,quality=86;do{encoded=await sharp(raw).resize({width,withoutEnlargement:true}).webp({quality}).toBuffer();quality-=8;}while(encoded.length>=260000&&quality>=38);
        if(encoded.length>=260000)throw Error('Image budget exceeded: '+record.key);
        await fs.writeFile(file,encoded);const info=await sharp(encoded).metadata();variants.push({src:file.replace(/^public/,''),width:info.width,height:info.height,bytes:encoded.length});
      }
      asset={url:record.imageUrl,sourceSha256:hash(raw),sourceWidth:meta.width,sourceHeight:meta.height,variants};assetByUrl.set(record.imageUrl,asset);assets.push(asset);
    }
    record.assetUrl=asset.url;
  }));
  for(const outcome of outcomes)if(outcome.status==='rejected')throw outcome.reason;
  console.log(`Prepared product images ${Math.min(offset+4,records.length)}/${records.length}.`);
}
const previous=JSON.parse(await fs.readFile('migration/mule-hide-commercial-sources.json','utf8'));
const result={checkedAt:new Date().toISOString(),businessConfirmation:previous.businessConfirmation,boundary:previous.boundary,categories:categoryRecords,records:records.sort((a,b)=>a.title.localeCompare(b.title)),excluded,assets,totalBytes:assets.flatMap(a=>a.variants).reduce((n,v)=>n+v.bytes,0)};
await fs.writeFile('migration/mule-hide-commercial-sources.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({categories:categories.length,products:result.records.length,excluded:excluded.length,images:assets.length,variants:assets.flatMap(a=>a.variants).length,totalBytes:result.totalBytes}));
