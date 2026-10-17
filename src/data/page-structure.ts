import structure from './site-structure.json';
import type { RichNode } from './section-types';
type Placement={breadcrumbs:{label:string;href?:string}[];hero?:{eyebrow?:string;title?:string;description?:string};headings?:Record<string,string>};
export const placements:Record<string,Placement>=structure.pages;
export function replaceHeadings(nodes:RichNode[], replacements:Record<string,string>={}, heading=false):RichNode[]{
  return nodes.map(node=>node.tag?{...node,children:replaceHeadings(node.children,replacements,heading||/^h[2-4]$/.test(node.tag))}:heading&&replacements[node.text.trim()]?{text:replacements[node.text.trim()]}:node);
}
