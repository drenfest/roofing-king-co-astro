import fs from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const library=JSON.parse(await fs.readFile('src/data/project-gallery.json','utf8'));
const metadata={};
await fs.mkdir('public/media/gallery',{recursive:true});
for(const item of library.items){
 const input='public'+item.src;
 const dimensions=await sharp(input).metadata();
 if(dimensions.width<800)throw Error('Gallery source is too small: '+item.src);
 const hash=createHash('sha256').update(item.src).digest('hex').slice(0,12);
 const variants=[];
 for(const width of [480,800,1280]){
  const src=`/media/gallery/${hash}-${width}.webp`;let output;
  for(const quality of [78,72,66]){
   output=await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality,effort:5}).toBuffer();
   if(output.length<=160000)break;
  }
  if(output.length>180000)throw Error('Gallery variant exceeds budget: '+src);
  await fs.writeFile('public'+src,output);
  const actual=await sharp(output).metadata();
  if(!variants.some(v=>v.width===actual.width))variants.push({src,width:actual.width});
 }
 metadata[item.src]={width:dimensions.width,height:dimensions.height,variants};
}
await fs.writeFile('src/data/gallery-media.json',JSON.stringify(metadata,null,2)+'\n');
console.log(`Optimized ${library.items.length} gallery photos without enlarging source images.`);
