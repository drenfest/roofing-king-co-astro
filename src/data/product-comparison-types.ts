export type ComparisonValue={value:string;note?:string;sourceUrl:string;comparisonKey?:string};
export type ComparisonEntry={id:string;title:string;brand:string;href:string;group:string;image:{src:string;srcset:string;width:number;height:number;alt:string};sourceUrl:string;specs:Record<string,ComparisonValue>;facets:Record<string,string[]>};
export type SpecificationFilter={key:string;label:string;options:string[]};
export type ComparisonField={key:string;label:string};
export type ProductComparisonModel={current:ComparisonEntry;alternatives:ComparisonEntry[];fields:ComparisonField[];filters:SpecificationFilter[];initialIds:string[];groupLabel:string};
export type CatalogFilterModel={entries:Pick<ComparisonEntry,'id'|'facets'>[];filters:SpecificationFilter[]};
