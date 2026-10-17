export type ProductColor = {
  id:string;name:string;sourceImageUrl:string;
  image:{src:string;srcset:string;width:number;height:number};
  swatch:string;
};
export type ProductPresentation = {
  id:string;sourceUrl:string;checkedAt:string;defaultColorId:string;
  colors:ProductColor[];
  specs:{label:string;value:string}[];
  warrantyLabels:string[];
  documents:{label:string;url:string}[];
};
