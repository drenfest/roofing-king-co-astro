import home from './home-media.json';
import services from './service-media.json';
import brands from './brand-library.json';
import type { ImageData } from './section-types';
type Dimensions = {width:number;height:number;variants:{src:string;width:number}[]};
export const media: Record<string,Dimensions> = {...home,...services,...Object.fromEntries(Object.values(brands).map(brand=>[brand.image.src,{width:brand.image.width,height:brand.image.height,variants:[]}]))};
export function photo(image:ImageData) {
  const dimensions=media[image.src];
  const variants=dimensions?.variants || [];
  return {...image,width:dimensions?.width,height:dimensions?.height,
    thumbnail:(variants.find(v=>v.width>=800)||variants.at(-1))?.src||image.src,
    srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', ')};
}
