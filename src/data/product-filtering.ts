import type {CatalogFilterModel,ComparisonEntry} from './product-comparison-types';
export function matchesSpecifications(entry:Pick<ComparisonEntry,'facets'>,selected:Record<string,string>){
 return Object.entries(selected).every(([key,value])=>!value||entry.facets[key]?.includes(value));
}
export function matchingCatalogIds(model:CatalogFilterModel,selected:Record<string,string>){return model.entries.filter(entry=>matchesSpecifications(entry,selected)).map(entry=>entry.id);}
