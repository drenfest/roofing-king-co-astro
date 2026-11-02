import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('migration/roofing-hero-images.json','utf8'));
const destination='public/media/roofing-heroes';
const originals='output/imagegen/roofing-heroes';
await fs.mkdir(destination,{recursive:true});await fs.mkdir(originals,{recursive:true});
const heroes={};const media={};
for(const page of manifest.pages){
 if(page.status!=='generated'||!page.generatedFile)throw Error('Missing generated hero: '+page.route);
 const original=path.join(originals,page.slug+'.png');
 try{await fs.access(original);}catch{await fs.copyFile(page.generatedFile,original);}
 page.originalFile=original.replaceAll('\\','/');
 const metadata=await sharp(original).metadata();
 const fullWidth=Math.min(metadata.width,1920);
 const widths=[...new Set([640,960,1280,fullWidth].filter(w=>w<=fullWidth))].sort((a,b)=>a-b);
 const variants=[];
 for(const width of widths){
  const file=path.join(destination,`${page.slug}-${width}.webp`);
  await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:width<=960?72:76,effort:6,smartSubsample:true}).toFile(file);
  let stat=await fs.stat(file);
  if(stat.size>240000){await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:66,effort:6}).toFile(file);stat=await fs.stat(file);}
  if(stat.size>300000)throw Error('Hero exceeds image budget: '+file);
  variants.push({src:'/'+file.replace(/^public[\\/]/,'').replaceAll('\\','/'),width,bytes:stat.size});
 }
 const full=variants.at(-1);
 const image={src:full.src,alt:`${page.service.toLowerCase()} scene`,width:fullWidth,height:Math.round(metadata.height*fullWidth/metadata.width)};
 heroes[page.route]={image,generated:true,objectPosition:page.objectPosition};
 media[image.src]={width:image.width,height:image.height,variants:variants.map(({src,width})=>({src,width}))};
 page.assets=variants;page.originalBytes=(await fs.stat(original)).size;
}
await fs.writeFile('src/data/roofing-heroes.json',JSON.stringify(heroes,null,2)+'\n');
await fs.writeFile('src/data/roofing-hero-media.json',JSON.stringify(media,null,2)+'\n');
manifest.metrics={images:manifest.pages.length,variants:Object.values(media).reduce((n,m)=>n+m.variants.length,0),originalBytes:manifest.pages.reduce((n,p)=>n+p.originalBytes,0),optimizedBytes:manifest.pages.reduce((n,p)=>n+p.assets.reduce((sum,a)=>sum+a.bytes,0),0),largestVariantBytes:Math.max(...manifest.pages.flatMap(p=>p.assets.map(a=>a.bytes)))};
await fs.writeFile('migration/roofing-hero-images.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Optimized ${Object.keys(heroes).length} unique roofing heroes; ${Object.values(media).reduce((n,m)=>n+m.variants.length,0)} WebP variants. Originals remain outside public assets.`);
