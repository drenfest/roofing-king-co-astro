import profiles from './product-care.json';
import type {ProductPresentation} from './product-types';
export function productCareType(product:ProductPresentation):keyof typeof profiles {
 const path=product.detailPath||'/products/roofing/shingles/gaf/';
 if(path.includes('/roofing/'))return 'shingles';
 if(path.includes('/gutters/'))return 'gutter-protection';
 if(path.includes('/siding/')){
  const material=product.specs.find(s=>s.label==='Material')?.value.toLowerCase()||'';
  if(material.includes('polypropylene'))return 'polypropylene';
  if(path.includes('/fiber-cement/'))return 'fiber-cement';
  if(path.includes('/engineered-wood/'))return 'engineered-wood';
  return 'vinyl';
 }
 if(product.categoryLabel==='Deck railing')return 'railing';
 if(product.id==='trex-fascia')return 'fascia';
 if(product.id==='trex-hideaway-fasteners')return 'fasteners';
 if(product.id==='trex-deck-lighting')return 'lighting';
 if(product.id==='trex-rainescape')return 'drainage';
 if(product.specs.some(s=>s.label==='Material'&&s.value.includes('PVC')))return 'pvc';
 if(path.includes('/decking/'))return 'composite';
 throw new Error('Assign a product care profile for '+product.id);
}
export function productCare(product:ProductPresentation){
 return product.care||{...profiles[productCareType(product)],links:[
  {label:`${product.brand||'GAF'} product details`,url:product.sourceUrl},
  ...product.documents.filter(d=>/care|clean|install/i.test(d.label)).map(d=>({label:d.label,url:d.url})),
  ...(product.warrantyUrl?[{label:`${product.brand||'GAF'} warranty information`,url:product.warrantyUrl}]:[])
 ]};
}
export function productSpecificationsIntro(product:ProductPresentation){
 if(product.specificationsIntro)return product.specificationsIntro;
 switch(productCareType(product)){
  case 'shingles': return 'Compare the shingle construction, available colors and documented fire, wind or impact classifications. The roof system, installation and written warranty terms determine how those details apply to your home.';
  case 'vinyl': case 'polypropylene': case 'fiber-cement': case 'engineered-wood': return 'Compare panel material, profile, finish and available colors. Openings, flashing, attachment and drainage details determine how the selected siding works as part of your wall.';
  case 'composite': case 'pvc': return 'Compare the board material, surface texture and available colors. The board profile determines the support, spacing and fastening details for the deck.';
  case 'railing': return 'Compare post, rail and infill materials, finishes and connections. Check the complete railing assembly and its attachment to the supporting deck.';
  case 'gutter-protection': return 'Compare the guard material, debris-screening design and support function. The selected product must work with the gutter runs, outlets and downspouts.';
  default: return 'Compare the component material, intended function and compatible connections. Review it alongside the deck boards, framing and other parts it connects to.';
 }
}
