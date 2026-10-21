import {defineMiddleware} from 'astro:middleware';
import {completeHtmlAttributes} from '../scripts/html-attributes.mjs';
import {completeStructuredData} from '../scripts/structured-data.mjs';

// Enforce the same HTML contract in Astro dev and prerendered pages.
export const onRequest=defineMiddleware(async (context,next)=>{
 const response=await next();
 if(!response.headers.get('content-type')?.includes('text/html'))return response;
 const original=await response.text();
 const result=completeHtmlAttributes(original);
 const structured=completeStructuredData(result.html,{pathname:context.url.pathname});
 const headers=new Headers(response.headers);headers.delete('content-length');
 return new Response(structured.graph||structured.changed?structured.html:result.images||result.links||result.urls?result.html:original,{status:response.status,statusText:response.statusText,headers});
});
