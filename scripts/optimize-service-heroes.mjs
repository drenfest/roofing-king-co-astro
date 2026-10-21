import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const file='migration/service-hero-images.json';
const manifest=JSON.parse(await fs.readFile(file,'utf8'));
const destination='public/media/service-heroes';
const originals='output/imagegen/service-heroes';
await fs.mkdir(destination,{recursive:true});await fs.mkdir(originals,{recursive:true});
const heroes={},media={};
for(const page of manifest.pages){
 let result;
 try{result=JSON.parse(await fs.readFile(`tmp/header-review/service-hero-results/${page.slug}.json`,'utf8'));}catch{if(process.argv.includes('--complete'))throw Error('Missing generated hero: '+page.route);continue;}
 const original=path.join(originals,page.slug+'.png');
 try{await fs.access(original);}catch{await fs.copyFile(result.generatedFile,original);}
 const info=await sharp(original).metadata();const fullWidth=Math.min(info.width,1600);
 const widths=[...new Set([640,960,1280,fullWidth].filter(w=>w<=fullWidth))].sort((a,b)=>a-b);const variants=[];
 for(const width of widths){
  const asset=path.join(destination,`${page.slug}-${width}.webp`);
  try{await fs.access(asset);}catch{await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:width<=960?70:75,effort:6,smartSubsample:true}).toFile(asset);}
  let stat=await fs.stat(asset);
  for(const quality of [60,52,44,36]){if(stat.size<=240000)break;await sharp(original).resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toFile(asset);stat=await fs.stat(asset);}
  if(stat.size>300000)throw Error('Hero exceeds WebP budget: '+asset);
  variants.push({src:'/'+asset.replace(/^public[\\/]/,'').replaceAll('\\','/'),width,bytes:stat.size});
 }
 const image={src:variants.at(-1).src,alt:`Illustrative ${page.service.toLowerCase()} scene`,width:fullWidth,height:Math.round(info.height*fullWidth/info.width)};
 heroes[page.route]={image,generated:true,objectPosition:page.objectPosition};
 media[image.src]={width:image.width,height:image.height,variants:variants.map(({src,width})=>({src,width}))};
 page.status='generated';page.originalFile=original.replaceAll('\\','/');page.assets=variants;page.originalBytes=(await fs.stat(original)).size;
}
await fs.writeFile('src/data/service-heroes.json',JSON.stringify(heroes,null,2)+'\n');
await fs.writeFile('src/data/service-hero-media.json',JSON.stringify(media,null,2)+'\n');
const completed=manifest.pages.filter(p=>p.assets);
manifest.metrics={images:completed.length,variants:completed.reduce((n,p)=>n+p.assets.length,0),originalBytes:completed.reduce((n,p)=>n+p.originalBytes,0),optimizedBytes:completed.reduce((n,p)=>n+p.assets.reduce((sum,a)=>sum+a.bytes,0),0),largestVariantBytes:Math.max(...completed.flatMap(p=>p.assets.map(a=>a.bytes)))};
await fs.writeFile(file,JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${completed.length}/${manifest.pages.length} service heroes as responsive WebP; originals stay outside public.`);
