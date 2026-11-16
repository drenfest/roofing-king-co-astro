import fs from 'node:fs/promises';
import sharp from 'sharp';

// Optional private original: node scripts/optimize-company-media.mjs /path/to/jared-lane-headshot.jpg
const sources=[
 {name:'careers-team',source:'public/media/wordpress/d0576090647b-hero-ourcareers.jpg'},
 {name:'about-roof',source:'public/media/wordpress/ea8a4414f826-16d19a1d-420a-4804-bd61-211868f3ae5f.jpg'},
 {name:'community',source:'public/media/wordpress/0900ce982f94-our-careers-about.jpg'},
 ...(process.argv[2]?[{name:'jared-lane',source:process.argv[2]}]:[]),
];
// Preserve private-source registrations when rerunning the original-company authoring tool.
const media=JSON.parse(await fs.readFile('src/data/company-media.json','utf8'));
await fs.mkdir('public/media/company',{recursive:true});
for(const item of sources){
 const info=await sharp(item.source).metadata();
 const widths=[480,800,1280].filter(w=>w<info.width);widths.push(info.width);
 const variants=[];
 for(const width of widths){
  const src=`/media/company/${item.name}-${width}.webp`;
  // Sharp strips camera metadata by default; do not call withMetadata().
  await sharp(item.source).resize({width,withoutEnlargement:true}).webp({quality:80}).toFile('public'+src);
  variants.push({src,width});
 }
 media[variants.at(-1).src]={width:info.width,height:info.height,variants};
}
await fs.writeFile('src/data/company-media.json',JSON.stringify(media,null,2)+'\n');
console.log('Optimized company photographs without enlargement or camera metadata.');
