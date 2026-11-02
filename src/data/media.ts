import serviceComparisons from './service-comparison-media.json';
import company from './company-media.json';
import home from './home-media.json';
import gallery from './gallery-media.json';
import articles from './article-media.json';
import articleHeroes from './blog-article-media.json';
import services from './service-media.json';
import roofingHeroes from './roofing-hero-media.json';
import serviceHeroes from './service-hero-media.json';
import gutterDetails from './gutter-detail-media.json';
import serviceReview from './service-review-media.json';
import brands from './brand-library.json';
import commercial from './commercial-product-media.json';
import type { ImageData } from './section-types';
type Dimensions = {width:number;height:number;variants:{src:string;width:number}[]};
export const media: Record<string,Dimensions> = {...serviceComparisons,...company,...home,...services,...gallery,...articles,...articleHeroes,...roofingHeroes,...serviceHeroes,...gutterDetails,...serviceReview,...commercial,...Object.fromEntries(Object.values(brands).map(brand=>[brand.image.src,{width:brand.image.width,height:brand.image.height,variants:[]}]))};
export function photo(image:ImageData) {
  const dimensions=media[image.src];
  const variants=dimensions?.variants || [];
  return {...image,width:dimensions?.width,height:dimensions?.height,
    thumbnail:(variants.find(v=>v.width>=800)||variants.at(-1))?.src||image.src,
    srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', ')};
}
