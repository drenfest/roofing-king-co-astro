import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {htmlFiles} from './html-attributes.mjs';
import {completeStructuredData,serializeSchema,schemaPathname} from './structured-data.mjs';
import site from '../src/data/site.json' with {type:'json'};
const types=node=>Array.isArray(node?.['@type'])?node['@type']:[node?.['@type']];
const hasType=(node,type)=>types(node).includes(type);
const clean=value=>(value||'').replace(/\s+/g,' ').trim();
const totals={},pages=new Map();let count=0;
const forbidden=new Set(['Review','AggregateRating','JobPosting','LoanOrCredit','SearchAction','HowTo']);
const known=new Set(['RoofingContractor','PostalAddress','ContactPoint','ImageObject','WebSite','WebPage','AboutPage','ContactPage','CollectionPage','FAQPage','ImageGallery','ItemPage','Service','Product','Brand','PropertyValue','Organization','Person','BlogPosting','Blog','BreadcrumbList','ListItem','ItemList','WebPageElement','SiteNavigationElement','Question','Answer','State','City','Place','Map']);
for(const file of await htmlFiles('dist')){
 const html=await fs.readFile(file,'utf8'),$=load(html),scripts=$('script[data-site-schema]');
 const eligible=$('link[rel=canonical]').length&&new URL($('link[rel=canonical]').attr('href')).pathname===schemaPathname(file)&&$('main').length&&!$('meta[http-equiv]').toArray().some(el=>/refresh/i.test($(el).attr('http-equiv')||''));
 if(!eligible){assert.equal(scripts.length,0,file);continue;}
 assert.equal(scripts.length,1,file);assert.equal($('script[type="application/ld+json"]').length,1,file);
 const schema=JSON.parse(scripts.text()),graph=schema['@graph'];assert.equal(schema['@context'],'https://schema.org');
 const canonical=$('link[rel=canonical]').attr('href'),pageId=canonical+'#webpage';
 const nodes=new Map(graph.map(node=>[node['@id'],node]));assert.equal(nodes.size,graph.length,file);
 const page=nodes.get(pageId);assert.ok(page,file);assert.equal(page.url,canonical,file);
 assert.equal(graph.filter(node=>hasType(node,'RoofingContractor')).length,1,file);
 assert.equal(graph.filter(node=>hasType(node,'WebSite')).length,1,file);
 assert.deepEqual(nodes.get(site.url+'/#business').address,{'@type':'PostalAddress',...site.address});
 function walk(node){
  if(Array.isArray(node)){node.forEach(walk);return;}
  if(!node||typeof node!=='object')return;
  for(const type of types(node).filter(Boolean)){assert.ok(known.has(type),`${file}: unknown type ${type}`);assert.ok(!forbidden.has(type),`${file}: inappropriate type ${type}`);totals[type]=(totals[type]||0)+1;}
  if(node['@id']){const id=new URL(node['@id']);assert.equal(id.protocol,'https:',file);if(Object.keys(node).length===1&&id.href.startsWith(canonical+'#'))assert.ok(nodes.has(id.href),`${file}: unresolved local reference ${id.href}`);}
  if(hasType(node,'ItemList')){assert.equal(node.numberOfItems,node.itemListElement.length,file);assert.deepEqual(node.itemListElement.map(item=>item.position),node.itemListElement.map((_item,index)=>index+1),file);}
  if(hasType(node,'Product')){assert.equal(node.offers,undefined,file);assert.ok(node.name,file);}
  if(hasType(node,'Question')){assert.ok(node.name&&node.acceptedAnswer?.text,file);assert.equal(node.acceptedAnswer['@type'],'Answer',file);}
  for(const value of Object.values(node))walk(value);
 }
 walk(graph);
 // Reprocessing built HTML must preserve the graph; dev and static use the same compiler.
 const again=completeStructuredData(html);assert.deepEqual(again.graph,schema,`${file}: schema compiler must be idempotent`);
 const visibleQuestions=new Set();$('main [data-component=FAQSection] details').each((_i,el)=>{
  const summary=$(el).children('summary').first().text();const answer=$(el).children('div').first().text();if(clean(summary)&&clean(answer))visibleQuestions.add(clean(summary)+'\n'+clean(answer));
 });
 const faqs=graph.filter(node=>hasType(node,'FAQPage'));assert.equal(faqs.length,visibleQuestions.size?1:0,file);
 if(faqs.length){assert.equal(faqs[0].mainEntity.length,visibleQuestions.size,file);for(const q of faqs[0].mainEntity)assert.ok(visibleQuestions.has(q.name+'\n'+q.acceptedAnswer.text),file);}
 pages.set(new URL(canonical).pathname,{graph,nodes,page,$});count++;
}
assert.ok(count>=234);
for(const path of ['/blog/','/blog/categories/','/blog/topics/','/category/roofing/','/tag/columbus-oh/','/offers/','/service-areas/']){
 const {graph,page,$}=pages.get(path);assert.ok(hasType(page,'CollectionPage'),path);assert.ok(page.mainEntity,path);
 if(path.startsWith('/category/')||path.startsWith('/tag/')){const list=graph.find(node=>hasType(node,'ItemList'));assert.equal(list.numberOfItems,$('[data-blog-card]').length,path);for(const entry of list.itemListElement)assert.equal(entry.item['@type'],'BlogPosting');}
}
assert.ok(hasType(pages.get('/about-us/').page,'AboutPage'));
assert.ok(hasType(pages.get('/contact-us/').page,'ContactPage'));
assert.ok(hasType(pages.get('/past-projects/').page,'ImageGallery'));
assert.ok(pages.get('/roofing/').graph.some(node=>hasType(node,'Service')));
const directory=pages.get('/service-areas/');assert.equal(directory.graph.find(node=>hasType(node,'Map')).spatialCoverage.length,25);
const product=pages.get('/products/roofing/shingles/gaf/timberline-hdz/');assert.ok(product.graph.find(node=>hasType(node,'Product')).additionalProperty.length);
assert.ok(hasType(product.page,'ItemPage'));
const articles=JSON.parse(await fs.readFile('src/data/blog-articles.json','utf8'));
for(const [path,article]of Object.entries(articles)){
 const {graph}=pages.get(path);const node=graph.find(node=>hasType(node,'BlogPosting'));
 assert.equal(node.headline,article.title,path);
 assert.equal(node.author?.name,article.author||undefined,path);
 assert.equal(node.datePublished,article.publishedAt||undefined,path);
}
const payload=serializeSchema({'@context':'https://schema.org',name:'</script><script>alert(1)</script>\u2028'});assert.ok(!payload.includes('<'));assert.equal(JSON.parse(payload).name,'</script><script>alert(1)</script>\u2028');
await fs.mkdir('tmp/location-review',{recursive:true});await fs.writeFile('tmp/location-review/structured-data-report.json',JSON.stringify({contentPages:count,types:totals},null,2));
console.log(`${count} content pages: linked graphs, unique entities, canonical IDs, exact visible FAQs, hub membership, article facts, product specifications, service coverage, safe serialization and dev/build idempotency passed.`);
