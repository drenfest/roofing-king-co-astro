import fs from 'node:fs/promises';import sharp from 'sharp';import {createHash} from 'node:crypto';
const nav=JSON.parse(await fs.readFile('src/data/navigation.json'));const services={...JSON.parse(await fs.readFile('src/data/service-heroes.json')),...JSON.parse(await fs.readFile('src/data/roofing-heroes.json'))};
const metadata={...JSON.parse(await fs.readFile('src/data/home-media.json')),...JSON.parse(await fs.readFile('src/data/service-media.json')),...JSON.parse(await fs.readFile('src/data/service-hero-media.json')),...JSON.parse(await fs.readFile('src/data/roofing-hero-media.json'))};
const details=JSON.parse(await fs.readFile('src/data/product-details.json'));const catalog=JSON.parse(await fs.readFile('src/data/product-catalog.json'));const selections=JSON.parse(await fs.readFile('src/data/navigation-photo-selections.json'));const extra=JSON.parse(await fs.readFile('migration/navigation-extra-images.json')).images;
function walk(items){return items.flatMap(i=>[i.href,...walk(i.children)])}const routes=[...new Set(walk(nav.items))];
const tileSize=192,columns=Math.ceil(Math.sqrt(routes.length)),rows=Math.ceil(routes.length/columns);const composite=[],items={},pictures={},hashes=new Set();
for(let index=0;index<routes.length;index++){
 const route=routes[index],selection=selections[route];let src,illustrative=false,fit='cover',hero=false;
 if(selection?.sourceHero){src=services[selection.sourceHero]?.image.src;illustrative=true;hero=true;}
 else if(selection?.sourceImage){src=selection.sourceImage;illustrative=!!selection.illustrative;fit=selection.fit||fit;}
 else if(selection?.extra){src=extra[selection.extra].src;illustrative=true;}
 else if(services[route]){src=services[route].image.src;illustrative=services[route].generated;hero=true;}
 else if(details[route]){const product=catalog[details[route].key];src=product.colors.find(c=>c.id===product.defaultColorId).image.src;}
 else throw Error('Missing explicit menu image: '+route);
 if(!src)throw Error('Unresolved image: '+route);
 const original=src;src=metadata[src]?.variants.find(v=>v.width>=480)?.src||src;
 const thumb=fit==='contain'?await sharp({create:{width:tileSize,height:tileSize,channels:4,background:'#fffdf8'}}).composite([{input:await sharp('public'+src).resize(tileSize-40,Math.round(tileSize/3),{fit:'inside'}).toBuffer(),gravity:'centre'}]).png().toBuffer():await sharp('public'+src).resize(tileSize,tileSize,{fit:'cover',position:hero?'right':'centre'}).png().toBuffer();
 const fingerprint=createHash('sha256').update(await sharp(thumb).resize(64,64).removeAlpha().raw().toBuffer()).digest('hex');if(hashes.has(fingerprint))throw Error('Duplicate menu picture content: '+route);hashes.add(fingerprint);
 const column=index%columns,row=Math.floor(index/columns);composite.push({input:thumb,left:column*tileSize,top:row*tileSize});items[route]={column,row,illustrative};pictures[route]={sourceImage:original,thumbnailSource:src,fit,illustrative,fingerprint};
}
const raw=await sharp({create:{width:columns*tileSize,height:rows*tileSize,channels:3,background:'#fffdf8'}}).composite(composite).png().toBuffer();
let output;let quality;
for(const candidate of [76,70,64,58,52]){output=await sharp(raw).webp({quality:candidate,effort:6,smartSubsample:true}).toBuffer();quality=candidate;console.log(`Atlas quality ${candidate}: ${Math.round(output.length/1024)}KB`);if(output.length<=700000)break;}
if(output.length>900000)throw Error('Menu atlas exceeds transfer budget');
const hash=createHash('sha256').update(output).digest('hex').slice(0,12);const src=`/media/navigation/menu-thumbnails-${hash}.webp`;await fs.mkdir('public/media/navigation',{recursive:true});await fs.writeFile('public'+src,output);
await fs.writeFile('src/data/navigation-atlas.json',JSON.stringify({src,width:columns*tileSize,height:rows*tileSize,tileSize,columns,rows,bytes:output.length,quality,items},null,2)+'\n');await fs.writeFile('src/data/navigation-images.json',JSON.stringify(pictures,null,2)+'\n');console.log(`${routes.length} distinct menu images in one ${Math.round(output.length/1024)}KB WebP atlas (${columns}×${rows}, ${tileSize}px tiles, quality ${quality}).`);
