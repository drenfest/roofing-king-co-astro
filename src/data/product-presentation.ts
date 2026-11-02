import {productLibrary} from './product-library';
import productDetails from './product-details.json';
import {photo} from './media';
import collectionMedia from './product-collection-media.json';
import hubHeroes from './product-hub-heroes.json';
export type ProductHeroImage={src:string;alt:string;width?:number;height?:number;srcset?:string;caption:string;sample?:boolean};
const imagery={
 roofing:{src:'/media/client-gallery/dormers-valleys-and-intersecting-roofs-6ed0a88fdc-924.webp',alt:'Aerial view of a stone-and-brick home with shingle roof valleys and dormers',caption:'Supplied photo: Dormers, valleys and intersecting roofs'},
 siding:{src:'/media/wordpress/ebed488d4b1b-hero-siding.jpg',alt:'Horizontal siding and exterior trim on a home',caption:'Siding design inspiration'},
 decking:{src:'/media/wordpress/13b26cd9aae3-hero-decks.jpg',alt:'An outdoor deck with seating and railings',caption:'Deck and railing design inspiration'},
 gutters:{src:'/media/wordpress/b6b3120916a9-hero-gutters.jpg',alt:'A gutter and downspout along the roof edge',caption:'Roof-edge and gutter details'}
};
export function productFamily(path:string){return path.includes('/siding/')?'siding':path.includes('/decking/')?'decking':path.includes('/gutters/')?'gutters':'roofing';}
export function productHeroImage(path:string,productKey?:string):ProductHeroImage{
 const detailKey=(productDetails as Record<string,{key:string}>)[path]?.key;
 const product=productLibrary[productKey||detailKey||'']||Object.values(productLibrary).find(product=>product.detailPath===path);
 if(product?.hero)return product.hero;
 const hubHero=(hubHeroes as Record<string,ProductHeroImage>)[path];
 if(hubHero)return hubHero;
 const brandProduct=Object.values(productLibrary).find(p=>p.detailPath?.slice(0,p.detailPath.slice(0,-1).lastIndexOf('/')+1)===path&&p.hero);
 if(brandProduct?.hero)return brandProduct.hero;
 if(product){const color=product.colors.find(c=>c.id===product.defaultColorId)!;return {...color.image,alt:`${productKey} in ${color.name}`,caption:`${color.name} · Manufacturer color sample`,sample:true};}
 const concept=path.includes('/engineered-wood/')?'engineered-wood-siding':path.includes('/fiber-cement/')?'fiber-cement-siding':path.includes('/vinyl/')&&!path.includes('/ply-gem/')?'vinyl-siding':path.includes('/alu-rex/')?'perforated-gutter-guard':path.includes('/leaffilter/')?'fine-mesh-gutter-guard':null;
 if(concept){const record=collectionMedia[concept];const label=concept.replaceAll('-',' ');return {src:record.variants[1].src,srcset:record.variants.map(v=>`${v.src} ${v.width}w`).join(', '),width:record.width,height:record.height,alt:`${label} scene`,caption:''};}
 const image=imagery[productFamily(path)];const resolved=photo(image);return {...resolved,src:resolved.thumbnail,caption:image.caption};
}
export function productService(path:string){if(path==='/products/')return {href:'/#services',label:'Our exterior services'};if(path.includes('/roofing/commercial/'))return {href:'/commercial-roofing/',label:'Commercial roofing installation'};const family=productFamily(path);return {href:family==='decking'?'/decks/':`/${family}/`,label:family==='decking'?'Deck installation':family==='siding'?'Siding installation':family==='gutters'?'Gutter installation':'Roofing installation'};}
