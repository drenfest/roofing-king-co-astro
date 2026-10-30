import type {CatalogFilterModel,ComparisonEntry} from './product-comparison-types';
// Equivalence is deliberately narrower than filter matching: a broad material/profile
// filter must not hide real differences in composition, dimensions or warranty terms.
export function standardizedSpecification(key:string,value:string):string|undefined{
 if(['bundles','colors'].includes(key)&&/^\d+$/.test(value.trim()))return key+':'+Number(value);
 if(key==='impact'){
  const classes=[...new Set([...value.matchAll(/Class\s*([1-4])/gi)].map(m=>m[1]))].sort();
  if(classes.length)return `impact:${classes.join(',')}:${/\bor\b|package-dependent/i.test(value)?'conditional':'listed'}`;
  if(/no class listed|not listed/i.test(value))return 'impact:unlisted';
 }
 if(key==='fire'){const m=value.match(/Class\s*([ABC])/i);if(m)return 'fire:'+m[1].toUpperCase();}
 if(key==='wind'){
  const tests=[...new Set([...value.matchAll(/ASTM\s+(D\d+)\s+Class\s+([A-Z])/gi)].map(m=>m[1].toUpperCase()+':'+m[2].toUpperCase()))].sort();
  if(tests.length)return 'wind:'+tests.join('|');
 }
 if(['exposure','dimensions','thickness'].includes(key)){
  const fractions:Record<string,string>={'¼':' 1/4','½':' 1/2','¾':' 3/4','⅛':' 1/8','⅜':' 3/8','⅝':' 5/8','⅞':' 7/8'};
  const unitText=value.replace(/[¼½¾⅛⅜⅝⅞]/g,c=>fractions[c]).replace(/\([^)]*\bmm\)/gi,'').trim();
  const parts=unitText.split(/\s*[x×]\s*/i);const sizes:number[]=[];
  for(const part of parts){
   const m=part.trim().match(/^(?:(\d+)\s+)?(\d+)\/(\d+)\s*(?:"|in\.?|inch(?:es)?)?$/i);
   const decimal=part.trim().match(/^(\d*\.?\d+)\s*(?:"|in\.?|inch(?:es)?)?$/i);
   if(m&&Number(m[3]))sizes.push(Number(m[1]||0)+Number(m[2])/Number(m[3]));else if(decimal)sizes.push(Number(decimal[1]));else return;
  }
  if(sizes.length)return key+':in:'+sizes.map(n=>n.toFixed(6)).join('x');
 }
}
export function specificationComparisonKey(entry:Pick<ComparisonEntry,'specs'>,key:string){
 const spec=entry.specs[key];if(!spec)return 'missing';
 return spec.comparisonKey||standardizedSpecification(key,spec.value)||JSON.stringify([spec.value.trim().toLowerCase().replace(/\s+/g,' '),spec.note||'']);
}
export function specificationDiffers(entries:Pick<ComparisonEntry,'specs'>[],key:string){return new Set(entries.map(entry=>specificationComparisonKey(entry,key))).size>1;}
export function matchesSpecifications(entry:Pick<ComparisonEntry,'facets'>,selected:Record<string,string>){
 return Object.entries(selected).every(([key,value])=>!value||entry.facets[key]?.includes(value));
}
export function matchingCatalogIds(model:CatalogFilterModel,selected:Record<string,string>){return model.entries.filter(entry=>matchesSpecifications(entry,selected)).map(entry=>entry.id);}
