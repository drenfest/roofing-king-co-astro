import type {RichNode} from './section-types';
export type ArticleBlock={kind:'image';image:{src:string;alt:string}}|{kind:'prose';nodes:RichNode[]}|{kind:'checklist';items:RichNode[][]};
export type ArticleSectionData={id:string;title:string;kind:'section';blocks:ArticleBlock[]}|{id:string;title:string;kind:'faq';preamble:RichNode[];items:{question:string;answer:RichNode[]}[]};
export type BlogArticleData={path:string;title:string;description:string;sourceFile:string;source:string;hero:{src:string;alt:string;generated:boolean};author:string|null;publishedAt:string|null;readingMinutes:number;lead:ArticleBlock[];sections:ArticleSectionData[]};
