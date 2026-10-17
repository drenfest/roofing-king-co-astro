export type ImageData = { src: string; alt: string };
export type HeadingData = { eyebrow: string; title: string; description?: string };
export type RichNode = { text: string; tag?: never; href?: never; children?: never } | {
  tag: 'p'|'div'|'span'|'article'|'h2'|'h3'|'h4'|'a'|'ul'|'ol'|'li'|'strong'|'b'|'em'|'i'|'br';
  text?: never; href?: string; role?:'eyebrow'; children: RichNode[];
};
export type BrandSection = HeadingData & { items: ImageData[] };
export type CardSectionData = HeadingData & { items: {title:string;description:string;href?:string;image?:ImageData|null}[] };
export type ContentSectionData = { type:'content'; variant:'services'|'features'|'prose'; body:RichNode[]; cards:{title:string;body:RichNode[];href?:string}[] };
export type GallerySection = HeadingData & { type:'gallery'; filters:{label:string;value:string}[];items:(ImageData & {tags:string[]})[] };
export type MediaContentRowData = {type:'media-row';id:string;title:string;eyebrow:string;body:RichNode[];image:ImageData;caption?:string;reverse?:boolean;links:{label:string;href:string}[]};
export type ServiceSection = ContentSectionData | MediaContentRowData |
  (BrandSection & {type:'brands'}) |
  (CardSectionData & {type:'cards';kind:'offers'|'reviews'}) |
  GallerySection |
  (HeadingData & {type:'products';items:{productId:string;title:string;body:RichNode[]}[]}) |
  (HeadingData & {type:'comparison';before:ImageData;after:ImageData}) |
  (HeadingData & {type:'coverage';image:ImageData}) |
  (HeadingData & {type:'quote'}) |
  (HeadingData & {type:'faq';items:{question:string;answer:RichNode[]}[]});
export type ServicePageData = {
  sourceFile:string;contentReview:string;
  hero:HeadingData & {image:string;booking:HeadingData;bookingUrl:string;bookingLabel:string};
  breadcrumbs:{label:string;href?:string}[];
  sections:ServiceSection[];
};
