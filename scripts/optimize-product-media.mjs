import fs from 'node:fs/promises';import sharp from 'sharp';
// Explicit authoring command; normal builds use committed assets and never fetch GAF.
const saved=JSON.parse(await fs.readFile('migration/sources/gaf-product-catalog.json','utf8'));
const source=Object.fromEntries(Object.entries(saved.records).map(([name,p])=>[name,{...p,colors:p.colors.map(c=>({color_id:c.id,color_name:c.name,media_url:c.sourceImageUrl}))}]));
await fs.mkdir('public/media/products',{recursive:true});
const catalog={};const queue=[];
for(const [name,data]of Object.entries(source)){
 const record={id:data.id,sourceUrl:data.sourceUrl,checkedAt:data.checkedAt,specs:data.specs,badges:data.badges,warrantyLabels:data.warrantyLabels,documents:data.documents,defaultColorId:data.defaultColorId,colors:[]};catalog[name]=record;
 for(const color of data.colors)queue.push(async()=>{const r=await fetch(color.media_url);if(!r.ok)throw Error(r.status+' '+color.media_url);const bytes=Buffer.from(await r.arrayBuffer());const metadata=await sharp(bytes).metadata();const stem='/media/products/'+data.id+'-'+color.color_id.toLowerCase();const widths=[400,800].filter(w=>w<metadata.width);widths.push(Math.min(800,metadata.width));const variants=[];for(const width of [...new Set(widths)].sort((a,b)=>a-b)){const dest=stem+'-'+width+'.webp';await sharp(bytes).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toFile('public'+dest);variants.push({src:dest,width});}const swatch=stem+'-swatch.webp';await sharp(bytes).rotate().resize(80,64,{fit:'cover'}).webp({quality:75}).toFile('public'+swatch);record.colors.push({id:color.color_id,name:color.color_name,sourceImageUrl:color.media_url,image:{src:variants.at(-1).src,width:metadata.width,height:metadata.height,srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', ')},swatch});});
}
let next=0;await Promise.all(Array.from({length:5},async()=>{while(next<queue.length)await queue[next++]();}));
for(const [name,p]of Object.entries(catalog)){const positions=source[name].colors.map(c=>c.color_id);p.colors.sort((a,b)=>positions.indexOf(a.id)-positions.indexOf(b.id));if(!p.colors.some(c=>c.id===p.defaultColorId))p.defaultColorId=p.colors[0].id;}
await fs.writeFile('src/data/product-catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log('Prepared '+Object.keys(catalog).length+' products and '+queue.length+' genuine color variants.');
