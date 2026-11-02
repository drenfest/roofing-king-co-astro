import {productHeroImage} from './product-presentation';
import editorial from './service-editorial.json';
import legacy from './service-pages.json';
import roofingHeroes from './roofing-heroes.json';
import serviceHeroes from './service-heroes.json';
import type {ImageData} from './section-types';

/** Resolve the same presentation image used by the destination service hero. */
export function serviceHero(path:string):{image:ImageData;generated:boolean}{
 const clean=path.split(/[?#]/)[0];
 const key=clean.endsWith('/')?clean:clean+'/';
 if(key.startsWith('/products/')){const image=productHeroImage(key);return {image,generated:/illustrat/i.test(image.caption)};}
 const asset=({...serviceHeroes,...roofingHeroes} as Record<string,{image:ImageData;generated:boolean}>)[key];
 if(asset)return {image:asset.image,generated:asset.generated};
 const page=(editorial as Record<string,{hero:{image:ImageData}} >)[key] || (legacy as Record<string,{hero:{image:string}} >)[key];
 const image=page?.hero.image;
 if(!image)throw new Error('Missing destination hero for service tab: '+path);
 return {image:typeof image==='string'?{src:image,alt:''}:image,generated:false};
}
