import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

// Explicit offline authoring tool. Normal builds use the committed library and derivatives.
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const inventory=await read('migration/client-gallery-inventory.json');
const library=await read('src/data/project-gallery.json');
const media=await read('src/data/gallery-media.json');
await fs.mkdir('public/media/client-gallery',{recursive:true});
const items=[];let totalBytes=0;
for(const record of inventory.records.filter(r=>r.disposition==='gallery')){
 const input=record.sourcePath;
 const meta=await sharp(input).rotate().metadata();
 const width=record.width,height=record.height;
 const widths=[...new Set([320,480,800,1280,Math.min(width,1280)].filter(w=>w<=width))].sort((a,b)=>a-b);
 const slug=record.caption.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const hash=crypto.createHash('sha256').update(record.sha256).digest('hex').slice(0,10);
 const variants=[];
 for(const targetWidth of widths){
  let buffer,quality=86,renderWidth=targetWidth;
  do{
   buffer=await sharp(input).rotate().resize({width:renderWidth,withoutEnlargement:true}).webp({quality}).toBuffer();
   if(buffer.length<=180000)break;
   if(quality>70)quality-=4;else{renderWidth=Math.floor(renderWidth*.85);quality=82;}
  }while(renderWidth>=160);
  if(buffer.length>180000)throw Error(`Image exceeds budget: ${record.filename} at ${targetWidth}px`);
  const result=await sharp(buffer).metadata();
  if(result.width<=(variants.at(-1)?.width||0))continue;
  const src=`/media/client-gallery/${slug}-${hash}-${result.width}.webp`;
  await fs.writeFile('public'+src,buffer);
  variants.push({src,width:result.width,bytes:buffer.length,quality});totalBytes+=buffer.length;
 }
 const src=variants.at(-1).src;
 media[src]={width,height,variants:variants.map(({src,width})=>({src,width}))};
 record.optimization={width,height,variants,totalBytes:variants.reduce((n,v)=>n+v.bytes,0),metadataRemoved:true,sourceFormat:meta.format};
 items.push({id:record.galleryId,src,tags:record.tags,category:record.category,caption:record.caption,alt:record.alt,...(record.context?{context:record.context}:{}),source:'Riley shared photo collection',sourceLabel:record.sourceLabel,kind:record.kind,contain:record.contain,sort:record.sort,sourceIds:inventory.records.filter(r=>r.galleryId===record.galleryId).map(r=>r.driveId)});
}
const retained=library.items.filter(item=>!item.id.startsWith('riley-')&&!items.some(n=>n.id===item.id)).map(item=>({...item,kind:item.kind||'existing',sourceLabel:item.sourceLabel||'Existing site photo',sort:item.sort??20}));
const lead=[18,16,3,21,20,17,27,0,6,8,19,5,10,11,9,1,22,23,14,28].map(i=>i===3?'photo-25':`riley-${String(i).padStart(2,'0')}`);
library.items=[...items,...retained].sort((a,b)=>a.sort-b.sort||(a.sort===0?lead.indexOf(a.id)-lead.indexOf(b.id):0));
library.description='Roof King photos, exterior details and clearly labeled material and inspection references. Browse by service or search the subjects shown.';
for(const option of [{label:'Metal roofing',value:'metal'},{label:'Painting',value:'painting'},{label:'Team & company',value:'company'},{label:'Other references',value:'other-references'}])if(!library.filters.some(f=>f.value===option.value))library.filters.push(option);
const used=new Set(library.items.map(i=>i.src));for(const key of Object.keys(media))if(!used.has(key))delete media[key];
inventory.summary={imageFiles:98,uniquePhotographs:items.length,duplicateFiles:inventory.records.filter(r=>r.disposition==='duplicate').length,nonPhotographicFiles:inventory.records.filter(r=>r.disposition==='non-photographic').length,retainedExistingPhotos:retained.length,totalGalleryPhotos:library.items.length,newVariantFiles:inventory.records.flatMap(r=>r.optimization?.variants||[]).length,sourceBytes:inventory.records.filter(r=>r.disposition==='gallery').reduce((n,r)=>n+r.sourceBytes,0),optimizedBytes:totalBytes,largestVariantBytes:Math.max(...inventory.records.flatMap(r=>(r.optimization?.variants||[]).map(v=>v.bytes))),lowResolutionPhotos:items.filter(i=>media[i.src].width<800).length};
await fs.writeFile('src/data/project-gallery.json',JSON.stringify(library,null,2)+'\n');
await fs.writeFile('src/data/gallery-media.json',JSON.stringify(media,null,2)+'\n');
await fs.writeFile('migration/client-gallery-inventory.json',JSON.stringify(inventory,null,2)+'\n');
// Remove only stale files in this dedicated generated-asset directory.
const outputs=new Set(inventory.records.flatMap(r=>(r.optimization?.variants||[]).map(v=>v.src.split('/').at(-1))));
for(const name of await fs.readdir('public/media/client-gallery'))if(name.endsWith('.webp')&&!outputs.has(name))await fs.unlink('public/media/client-gallery/'+name);
console.log(inventory.summary);
