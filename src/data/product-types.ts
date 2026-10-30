import type { RichNode } from './section-types';
export type ProductDetailData={key:string;parentProductId?:string;title:string;description:string;body:RichNode[];breadcrumbs:{label:string;href?:string}[]};
export type ProductColor = {
  id:string;name:string;sourceImageUrl:string;
  image:{src:string;srcset:string;width:number;height:number};
  swatch:string;
  swatchColor?:string;
  availabilityNote?:string;
};
export type ProductPresentation = {
  id:string;sourceUrl:string;checkedAt:string;defaultColorId:string;
  colors:ProductColor[];
  specs:{label:string;value:string;note?:string;sourceUrl?:string}[];
  badges:{label:string;value:string;detail?:string;specLabel:string}[];
  warrantyLabels:string[];
  documents:{label:string;url:string}[];
  brand?:string;detailPath?:string;categoryLabel?:string;optionLabel?:string;
  previewMode?:'photo'|'palette';previewAlt?:string;
  warrantyUrl?:string;warrantyNote?:string;
  hero?:{src:string;srcset:string;width:number;height:number;alt:string;caption:string};
  badgeExplanations?:Record<string,{title:string;body:string;sourceUrl:string}>;
  colorResources?:{label:string;url:string;description:string}[];
  colorPreview?:{mode:'alpha'|'mask';image?:ProductColor['image'];mask?:string;sourceUrl:string;caption:string;brightness?:number};
};
