import fs from 'node:fs/promises';
import sharp from 'sharp';
const pages=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
const home=JSON.parse(await fs.readFile('src/data/home-media.json','utf8'));
const sources=new Set();
function collect(value){
  if(!value||typeof value!=='object')return;
  if(value.src?.startsWith('/media/wordpress/'))sources.add(value.src);
  if(typeof value.image==='string')sources.add(value.image);
  Object.values(value).forEach(collect);
}
collect(pages);
await fs.mkdir('public/media/services',{recursive:true});
const media={};
for(const src of sources){
  if(home[src])continue;
  const original='public'+src;const metadata=await sharp(original).metadata();
  const variants=[];
  for(const width of [480,800,1280,1920].filter(w=>w<=metadata.width)){
    const dest='/media/services/'+src.split('/').pop().replace(/\.[^.]+$/,'')+'-'+width+'.webp';
    await sharp(original).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile('public'+dest);
    variants.push({src:dest,width});
  }
  media[src]={width:metadata.width,height:metadata.height,variants};
}
await fs.writeFile('src/data/service-media.json',JSON.stringify(media,null,2)+'\n');
console.log(`Prepared ${Object.keys(media).length} additional service images; ${sources.size} total referenced.`);
