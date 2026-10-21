import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const input=process.argv[2]||'output/imagegen/product-collections';
const output='public/media/product-collections';
await fs.mkdir(output,{recursive:true});
const records={};
for(const name of ['vinyl-siding','engineered-wood-siding','fiber-cement-siding','perforated-gutter-guard','fine-mesh-gutter-guard']){
 const variants=[];
 for(const width of [480,800,1200]){
  const filename=`${name}-${width}.webp`;
  await sharp(path.join(input,name+'.png')).resize(width,Math.round(width/1.6),{fit:'cover'}).webp({quality:80,effort:6}).toFile(path.join(output,filename));
  variants.push({src:'/media/product-collections/'+filename,width});
 }
 records[name]={width:1200,height:750,variants};
}
await fs.writeFile('src/data/product-collection-media.json',JSON.stringify(records,null,2)+'\n');
console.log('Optimized five material scenes in three responsive WebP sizes each.');
