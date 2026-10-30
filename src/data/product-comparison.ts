import {productLibrary} from './product-library';
import details from './product-details.json';
import supplementalSpecs from './product-comparison-specs.json';
import type {ProductPresentation} from './product-types';
import type {ComparisonEntry,ComparisonField,SpecificationFilter,ProductComparisonModel,CatalogFilterModel} from './product-comparison-types';

const groupLabels:Record<string,string>={shingles:'roofing shingles',lap:'lap and beaded siding',shake:'shake and shingle siding',vertical:'vertical and panel siding',trim:'siding trim',soffit:'soffit panels',gutters:'gutter protection',decking:'deck boards',railing:'deck railing',fascia:'deck fascia',fasteners:'deck fasteners',lighting:'deck lighting',drainage:'under-deck drainage'};
const labels:Record<string,string>={brand:'Brand',material:'Material',profile:'Profile',thickness:'Thickness',wind:'Wind test classification',impact:'Impact class',fire:'Fire classification',texture:'Surface / finish',dimensions:'Nominal dimensions',bundles:'Bundles per roofing square',colors:'Catalog color references',warranty:'Manufacturer warranty',application:'Application',design:'Protection design'};
Object.assign(labels,{'defect-warranty':'Product-defect coverage','wind-warranty':'Wind coverage','algae-warranty':'Algae coverage'});
const comparisonFields:Record<string,string[]>={shingles:['material','impact','wind','fire','dimensions','exposure','bundles','colors','defect-warranty','wind-warranty','algae-warranty'],lap:['material','profile','thickness','texture','colors','warranty'],shake:['material','profile','thickness','texture','colors','warranty'],vertical:['material','profile','thickness','texture','colors','warranty'],trim:['material','profile','thickness','texture','colors','warranty'],gutters:['material','application','design','warranty']};
const fieldOrder=['material','profile','thickness','impact','wind','fire','texture','dimensions','exposure','bundles','colors','warranty','application'];
const normalizeKey=(label:string)=>label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function specKey(label:string,value:string){
 const key=normalizeKey(label);
 if(['panel-profiles','profile'].includes(key))return 'profile';
 if(['nominal-thickness','panel-dimension'].includes(key)&&/0?\.0\d/.test(value))return 'thickness';
 if(['nominal-dimensions','dimensions'].includes(key))return 'dimensions';
 if(['bundles-per-square','bundles-per-roofing-square'].includes(key))return 'bundles';
 if(key==='wind-resistance')return 'wind';
 if(key==='impact-resistance')return 'impact';
 if(key==='fire-classification')return 'fire';
 if(['surface-finish','surface-texture','surface','textures'].includes(key))return 'texture';
 if(['warranty','manufacturer-coverage'].includes(key))return 'warranty';
 return key;
}
function profileGroup(p:ProductPresentation){
 const path=p.detailPath||'/products/roofing/shingles/gaf/';
 if(path.includes('/roofing/'))return 'shingles';
 if(path.includes('/gutters/'))return 'gutters';
 if(path.includes('/siding/')){
  const profile=p.specs.filter(s=>/profile/i.test(s.label)).map(s=>s.value).join(' ');
  if(/soffit/i.test(profile)||/soffit/.test(p.id))return 'soffit';
  if(/trim|fascia/i.test(profile)||/trim-fascia|trim-batten/.test(p.id))return 'trim';
  if(/shake|shingle|round-cut/i.test(profile)||/shake|shingle/.test(p.id))return 'shake';
  if(/batten|vertical|panel/i.test(profile))return 'vertical';
  return 'lap';
 }
 if(p.categoryLabel==='Deck railing')return 'railing';
 if(p.id==='trex-fascia')return 'fascia';
 if(p.id==='trex-hideaway-fasteners')return 'fasteners';
 if(p.id==='trex-deck-lighting')return 'lighting';
 if(p.id==='trex-rainescape')return 'drainage';
 if(path.includes('/decking/'))return 'decking';
 throw Error('Assign a product comparison group: '+p.id);
}
function facetValues(key:string,value:string){
 if(/^Not published/i.test(value))return [];
 if(key==='wind'){
  const classes=[...value.matchAll(/ASTM\s+(D\d+)\s+Class\s+([A-Z])/gi)].map(m=>`ASTM ${m[1].toUpperCase()} Class ${m[2].toUpperCase()}`);
  if(classes.length)return [...new Set(classes)];
 }
 if(key==='impact'){
  if(/Class\s*3\s*or\s*(?:Class\s*)?4/i.test(value))return ['Package-dependent class'];
  const match=value.match(/Class\s*([1-4])/i);if(match)return ['Class '+match[1]];
  if(/not listed|no class listed/i.test(value))return ['No class listed'];
 }
 if(key==='fire'){const match=value.match(/Class\s*([ABC])/i);if(match)return ['Class '+match[1].toUpperCase()];}
 if(key==='thickness'){
  const sizes=[...new Set(value.match(/0?\.\d+/g))];
  if(sizes.length===1&&!/[–—/]|\bto\b/i.test(value))return [Number(sizes[0]).toFixed(3)+' in.'];
 }
 if(key==='material'){
  if(/fiberglass/i.test(value)&&/asphalt/i.test(value))return ['Fiberglass asphalt'];
  if(/polypropylene/i.test(value))return ['Polypropylene'];
  if(/vinyl/i.test(value))return ['Vinyl'];
  if(/fiber cement/i.test(value))return ['Fiber cement'];
  if(/engineered wood/i.test(value))return ['Engineered wood'];
 }
 if(key==='profile'){
  const options:string[]=[];
  if(/dutch/i.test(value))options.push('Dutch lap');
  if(/clapboard|horizontal|lap siding|traditional lap/i.test(value))options.push('Horizontal lap');
  if(/board.?and.?batten|board.?batten|batten/i.test(value))options.push('Board and batten');
  if(/vertical|panels?/i.test(value))options.push('Panels / vertical');
  if(/shake/i.test(value))options.push('Shake');
  if(/shingle/i.test(value))options.push('Shingle');
  if(/beaded/i.test(value))options.push('Beaded');
  if(options.length)return options;
 }
 return [value.trim()];
}
const detailById=new Map(Object.entries(details).map(([href,d])=>[productLibrary[d.key].id,{href,title:d.title}]));
const fieldLabels=new Map<string,string>(Object.entries(labels));
const entries:ComparisonEntry[]=Object.values(productLibrary).map(product=>{
 const detail=detailById.get(product.id);if(!detail)throw Error('Missing comparison destination: '+product.id);
 const specs:ComparisonEntry['specs']={};const facets:ComparisonEntry['facets']={brand:[product.brand||'GAF']};
 for(const spec of product.specs){const key=specKey(spec.label,spec.value);specs[key]={value:spec.value,...(spec.note?{note:spec.note}:{}),sourceUrl:spec.sourceUrl||product.sourceUrl};facets[key]=facetValues(key,spec.value);if(!fieldLabels.has(key))fieldLabels.set(key,spec.label);}
 for(const [key,spec] of Object.entries((supplementalSpecs.products as Record<string,Record<string,ComparisonEntry['specs'][string]>>)[product.id]||{})){specs[key]=spec;facets[key]=facetValues(key,spec.value);}
 if(profileGroup(product)==='gutters'){specs.design=specs['system-detail']||specs.profile;facets.design=facetValues('design',specs.design.value);}
 if(!specs.warranty&&product.warrantyLabels.length){specs.warranty={value:product.warrantyLabels.join(' · '),...(product.warrantyNote?{note:product.warrantyNote}:{}),sourceUrl:product.warrantyUrl||product.sourceUrl};facets.warranty=[specs.warranty.value];}
 if(profileGroup(product)==='shingles'){
  // Named algae/wind programs are not manufacturing-defect terms. Keep these
  // separate for both the comparison and collection filters.
  delete specs.warranty;delete facets.warranty;delete specs['limited-wind-coverage'];delete facets['limited-wind-coverage'];
 }else if(specs.warranty&&/lifetime/i.test(specs.warranty.value)){
  specs.warranty.note=[specs.warranty.note,'Lifetime is defined by the manufacturer’s eligibility and transfer terms, not a fixed number of years or an estimated service life.'].filter(Boolean).join(' ');
 }
 specs.colors={value:String(product.colors.length),note:'Color references in this catalog; profile and regional availability can vary.',sourceUrl:product.sourceUrl};facets.colors=[String(product.colors.length)];
 const color=product.colors.find(c=>c.id===product.defaultColorId)||product.colors[0];const image=product.hero||{...color.image,alt:detail.title+' manufacturer color sample'};
 return {id:product.id,...detail,brand:product.brand||'GAF',group:profileGroup(product),image:{src:image.src,srcset:image.srcset,width:image.width,height:image.height,alt:image.alt},sourceUrl:product.sourceUrl,specs,facets};
});
export const comparisonEntries=entries;
function fieldsFor(products:ComparisonEntry[]):ComparisonField[]{
 const keys=[...new Set(products.flatMap(p=>Object.keys(p.specs)))];
 return keys.sort((a,b)=>{const ai=fieldOrder.indexOf(a),bi=fieldOrder.indexOf(b);return (ai<0?100:ai)-(bi<0?100:bi)||a.localeCompare(b);}).map(key=>({key,label:fieldLabels.get(key)||key}));
}
function filtersFor(products:ComparisonEntry[]):SpecificationFilter[]{
 const keys=['brand',...fieldsFor(products).map(f=>f.key)];return keys.map(key=>({key,label:fieldLabels.get(key)||key,options:[...new Set(products.flatMap(p=>p.facets[key]||[]))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))})).filter(filter=>filter.options.length>1&&new Set(products.map(p=>JSON.stringify(p.facets[filter.key]||[]))).size>1);
}
function score(current:ComparisonEntry,alternative:ComparisonEntry){
 return Object.entries(current.facets).reduce((total,[key,values])=>total+(key!=='brand'&&values.some(v=>alternative.facets[key]?.includes(v))?(['material','profile'].includes(key)?4:1):0),0);
}
export function productComparison(productId:string):ProductComparisonModel|null {
 const current=entries.find(p=>p.id===productId);if(!current)throw Error('Missing comparison product: '+productId);
 const alternatives=entries.filter(p=>p.group===current.group&&p.brand!==current.brand).sort((a,b)=>score(current,b)-score(current,a)||a.title.localeCompare(b.title));
 if(!alternatives.length)return null;
 const initialIds:string[]=[];const brands=new Set<string>();for(const p of alternatives)if(!brands.has(p.brand)&&initialIds.length<3){initialIds.push(p.id);brands.add(p.brand);}for(const p of alternatives)if(initialIds.length<3&&!initialIds.includes(p.id))initialIds.push(p.id);
 const ordered=[...alternatives.filter(p=>initialIds.includes(p.id)),...alternatives.filter(p=>!initialIds.includes(p.id))];
 const fields=(comparisonFields[current.group]||fieldsFor([current,...alternatives]).map(f=>f.key)).map(key=>({key,label:fieldLabels.get(key)||key}));
 for(const p of [current,...alternatives])for(const field of fields)if(!p.specs[field.key]?.value.trim()||!p.specs[field.key].sourceUrl)throw Error(`Incomplete comparison: ${p.id} / ${field.key}`);
 const comparable=(p:ComparisonEntry)=>({...p,specs:Object.fromEntries(fields.map(field=>[field.key,p.specs[field.key]])),facets:Object.fromEntries(Object.entries(p.facets).filter(([key])=>key==='brand'||fields.some(field=>field.key===key)))});
 return {current:comparable(current),alternatives:ordered.map(comparable),initialIds,groupLabel:groupLabels[current.group],fields,filters:filtersFor(alternatives).filter(filter=>filter.key==='brand'||fields.some(field=>field.key===filter.key))};
}
export function catalogFilters(productIds:string[]):CatalogFilterModel {
 const selected=entries.filter(p=>productIds.includes(p.id));return {entries:selected.map(p=>({id:p.id,facets:p.facets})),filters:filtersFor(selected)};
}
