import {defineMiddleware} from 'astro:middleware';
import {completeHtmlAttributes} from '../scripts/html-attributes.mjs';
import {completeStructuredData} from '../scripts/structured-data.mjs';
import {applyInternalLinks} from '../scripts/internal-links.mjs';

// Enforce the same HTML contract in Astro dev and prerendered pages.
export const onRequest=defineMiddleware(async (context,next)=>{
 const response=await next();
 if(!response.headers.get('content-type')?.includes('text/html'))return response;
 const original=await response.text();
 const linked=applyInternalLinks(original,{pathname:context.url.pathname,strict:true});
 const result=completeHtmlAttributes(linked.html);
 const structured=completeStructuredData(result.html,{pathname:context.url.pathname});
 const headers=new Headers(response.headers);headers.delete('content-length');
 return new Response(structured.graph||structured.changed?structured.html:linked.changed||result.images||result.links||result.urls?result.html:original,{status:response.status,statusText:response.statusText,headers});
});
