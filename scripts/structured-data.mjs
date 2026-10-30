import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import site from '../src/data/site.json' with {type:'json'};
import navigation from '../src/data/navigation.json' with {type:'json'};
import coverage from '../src/data/coverage-map.json' with {type:'json'};
import blogRoutes from '../src/data/blog-routes.json' with {type:'json'};
import productHubs from '../src/data/product-pillar.json' with {type:'json'};
import {htmlFiles} from './html-attributes.mjs';

const origin=site.url;
const absolute=(value,base=origin)=>new URL(value,base).href;
const clean=value=>(value||'').replace(/\s+/g,' ').trim();
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const reference=id=>({'@id':id});
const types=node=>Array.isArray(node['@type'])?node['@type']:[node['@type']];
export const serializeSchema=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
export const schemaPathname=(file,root='dist')=>'/'+path.relative(root,file).replaceAll('\\','/').replace(/(?:^|\/)index\.html$/,'/').replace(/^\//,'');

/** Compile one linked graph from the components actually rendered on this page.
 * Runs only on the server/build. No schema library or extra JavaScript reaches the browser.
 * Existing authored Service/Product/BlogPosting records remain the source of truth.
 */
export function completeStructuredData(html,{pathname}={}){
 const $=load(html);
 const canonical=$('link[rel=canonical]').attr('href');
 if(!canonical || !$('main').length || $('meta[http-equiv]').toArray().some(el=>/refresh/i.test($(el).attr('http-equiv')||'')))return {html,graph:null};
 const url=new URL(canonical,origin);url.hash='';url.search='';
 if(url.origin!==origin)return {html,graph:null};
 // Aliases and internal review/error pages must not redefine their canonical page.
 if(pathname && pathname!==url.pathname){
  const changed=$('script[type="application/ld+json"]').length>0;
  $('script[type="application/ld+json"]').remove();return {html:changed?$.html():html,graph:null,changed};
 }
 const pageUrl=url.href,pageId=pageUrl+'#webpage',businessId=origin+'/#business',websiteId=origin+'/#website';
 const nodes=new Map();
 function add(node){const id=node['@id'];if(!id)throw new Error('Schema entity needs an ID');nodes.set(id,{...nodes.get(id),...node});return reference(id);}
 const main=$('main').first();
 const text=element=>{const copy=$(element).clone();copy.find('script,style,[aria-hidden=true],dialog').remove();return clean(copy.text());};
 const name=clean(main.find('h1').first().text())||clean($('title').text());
 const description=clean($('meta[name=description]').attr('content'));
 const business={'@type':'RoofingContractor','@id':businessId,name:site.name,url:origin,telephone:site.phoneHref.replace('tel:',''),address:{'@type':'PostalAddress',...site.address},areaServed:{'@type':'State',name:'Ohio'},logo:{'@type':'ImageObject',url:absolute('/media/wordpress/2b1fb60b5770-logo.png')},sameAs:navigation.socials.map(item=>item.href),contactPoint:{'@type':'ContactPoint',telephone:site.phoneHref.replace('tel:',''),contactType:'customer service',url:absolute('/contact-us/')}};
 const officeMap=main.find('.rk-contact-map iframe').attr('src');if(officeMap)business.hasMap=officeMap;
 add(business);add({'@type':'WebSite','@id':websiteId,url:origin+'/',name:site.name,inLanguage:'en-US',publisher:reference(businessId)});
 let pageType='WebPage';
 if(url.pathname==='/about-us/')pageType='AboutPage';
 else if(url.pathname==='/contact-us/'||url.pathname==='/customer-service/')pageType='ContactPage';
 else if(url.pathname==='/faq/')pageType='FAQPage';
 else if(url.pathname==='/past-projects/'||url.pathname.startsWith('/past-projects/project/'))pageType='ImageGallery';
 else if(/^\/(?:category|tag)\//.test(url.pathname)||['/blog/','/blog/categories/','/blog/topics/','/offers/','/service-areas/','/reviews/'].includes(url.pathname)||main.find('[data-service-family=local],.rk-product-hub-cards,.rk-service-product-grid').length)pageType='CollectionPage';
 const page={'@type':pageType,'@id':pageId,url:pageUrl,name,description,inLanguage:'en-US',isPartOf:reference(websiteId),publisher:reference(businessId)};
 if(['AboutPage','ContactPage'].includes(pageType))page.about=reference(businessId);
 const parts=[];
 function part(node){const ref=add(node);if(!parts.some(item=>item['@id']===ref['@id']))parts.push(ref);return ref;}
 const old=[];
 $('script[type="application/ld+json"]').each((_i,el)=>{const parsed=JSON.parse($(el).text());old.push(...(parsed['@graph']||[parsed]));});
 // Retain authored facts while normalizing identifiers and relationships.
 for(const original of old){
  const type=types(original).find(type=>['Service','Product','BlogPosting','BreadcrumbList'].includes(type));
  if(!type)continue;
  // A collection's product cards and companion entities are not its main product.
  const primaryId=pageUrl+({Service:'#service',Product:'#product',BlogPosting:'#article',BreadcrumbList:'#breadcrumb'}[type]);
  if(original['@id']&&original['@id']!==primaryId)continue;
  if(type==='Product'&&!main.find('article.rk-product-card-detail').length)continue;
  const node={...original};delete node['@context'];
  node['@id']=pageUrl+({Service:'#service',Product:'#product',BlogPosting:'#article',BreadcrumbList:'#breadcrumb'}[type]);
  if(type==='BreadcrumbList'){page.breadcrumb=add(node);continue;}
  node.url=pageUrl;node.mainEntityOfPage=reference(pageId);
  if(type==='Service')node.provider=reference(businessId);
  if(type==='BlogPosting'){
   node.isPartOf=reference(absolute('/blog/')+'#blog');node.publisher=reference(businessId);
   const post=blogRoutes.posts.find(post=>post.canonicalPath===url.pathname);
   if(post){if(post.categories.length)node.articleSection=post.categories;if(post.tags.length)node.keywords=post.tags;}
   add({'@type':'Blog','@id':absolute('/blog/')+'#blog',url:absolute('/blog/'),name:'Roof King blog',publisher:reference(businessId),inLanguage:'en-US'});
  }
  if(type==='Product')page['@type']='ItemPage';
  page.mainEntity=add(node);
 }
 // The approved roofing reference predates the other service-layout schemas.
 if(url.pathname==='/roofing/' && !page.mainEntity)page.mainEntity=add({'@type':'Service','@id':pageUrl+'#service',name,description,url:pageUrl,serviceType:'Residential roofing',provider:reference(businessId),areaServed:{'@type':'City',name:'Columbus, Ohio'},mainEntityOfPage:reference(pageId)});

 function imageFor(element){
  const img=$(element);const source=img.attr('src');if(!source||source.startsWith('data:'))return null;
  const variants=(img.attr('srcset')||'').split(',').map(item=>item.trim().split(/\s+/)).filter(item=>/^\d+w$/.test(item[1]||''));
  const best=variants.sort((a,b)=>Number.parseInt(b[1])-Number.parseInt(a[1]))[0]?.[0]||source;
  const contentUrl=absolute(best,pageUrl),id=contentUrl+'#image';
  const node={'@type':'ImageObject','@id':id,contentUrl,url:contentUrl};
  const alt=clean(img.attr('alt'));if(alt)node.description=alt;
  const caption=clean(img.closest('figure').find('figcaption').first().text());if(caption)node.caption=caption;
  const comparison=img.closest('[data-service-comparison]');
  if(comparison.length){node.caption=text(comparison.find('.rk-comparison-caption'));node.creativeWorkStatus='Illustrative example';}
  const width=Number.parseInt(variants.sort((a,b)=>Number.parseInt(b[1])-Number.parseInt(a[1]))[0]?.[1]||img.attr('width'));
  const intrinsicWidth=Number(img.attr('width')),intrinsicHeight=Number(img.attr('height'));
  if(width>0&&intrinsicWidth>0&&intrinsicHeight>0){node.width={'@type':'QuantitativeValue',value:width,unitText:'px'};node.height={'@type':'QuantitativeValue',value:Math.round(width*intrinsicHeight/intrinsicWidth),unitText:'px'};}
  const extension=new URL(contentUrl).pathname.split('.').at(-1)?.toLowerCase();
  const format={webp:'image/webp',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',svg:'image/svg+xml',avif:'image/avif'}[extension];if(format)node.encodingFormat=format;
  return add(node);
 }
 const hero=main.find('.rk-hero-background,.rk-service-hero-background,.rk-editorial-hero>img,.rk-product-hero img').first();
 if(hero.length)page.primaryImageOfPage=imageFor(hero);
 main.find('img[alt]').each((_i,el)=>{
  if(!clean($(el).attr('alt'))||$(el).closest('dialog,.rk-home-brand-mark,.rk-home-badge-images,.rk-review-profile-logo,.rk-review-card').length)return;
  imageFor(el);
 });

 // A single FAQ entity per document, even when several shared sections are rendered.
 const questions=new Map();
 main.find('[data-component=FAQSection] details').each((_i,el)=>{
  const summary=$(el).children('summary').first();const question=text(summary);const answer=text($(el).children('div').first());
  if(!question||!answer)return;
  const key=question+'\n'+answer;
  questions.set(key,{'@type':'Question','@id':pageUrl+'#question-'+hash(key),name:question,acceptedAnswer:{'@type':'Answer',text:answer}});
 });
 if(questions.size){
  if(pageType==='FAQPage')page.mainEntity=[...questions.values()];
  else part({'@type':'FAQPage','@id':pageUrl+'#faq',isPartOf:reference(pageId),mainEntity:[...questions.values()]});
 }

 function itemList(id,label,items){
  const unique=[...new Map(items.filter(item=>item.url&&item.name).map(item=>[item.url,item])).values()];
  if(!unique.length)return;
  const entries=unique.map((item,index)=>({
   '@type':'ListItem',position:index+1,name:item.name,url:item.url,
   item:{'@type':item.type||'WebPage','@id':item.url+(item.type==='BlogPosting'?'#article':item.type==='Product'?'#product':'#webpage'),url:item.url,name:item.name,
    ...(item.type==='BlogPosting'?{headline:item.name}:{}),
    ...(item.description?{description:item.description}:{}),
    ...(item.image?{image:item.image}:{}),
    ...(item.date?{datePublished:item.date}:{}),
    ...(item.author?{author:{'@type':item.author.includes('Roof King')?'Organization':'Person',name:item.author}}:{})
   }
  }));
  const ref=add({'@type':'ItemList','@id':pageUrl+'#'+id,name:label,numberOfItems:unique.length,itemListOrder:'https://schema.org/ItemListUnordered',itemListElement:entries});
  part({'@type':'WebPageElement','@id':pageUrl+'#'+id+'-section',name:label,mainEntity:ref});
  if(pageType==='CollectionPage' && !page.mainEntity)page.mainEntity=ref;
  return ref;
 }
 main.find('[data-component=CardSection],[data-component=FeaturedArticles]').each((index,el)=>{
  // Customer review excerpts are deliberately not marked up as self-serving Review entities.
  if($(el).hasClass('rk-home-reviews'))return;
  const items=[];
  $(el).find('article').each((_i,card)=>{
   const anchor=$(card).find('a[href]').first(),href=anchor.attr('href');if(!href?.startsWith('/'))return;
   const heading=$(card).find('h3').first();if(!heading.length)return;
   const type=blogRoutes.posts.some(post=>post.canonicalPath===href)?'BlogPosting':/^\/(?:category|tag)\//.test(href)?'CollectionPage':'WebPage';
   const author=clean($(card).find('.rk-blog-card-meta span').first().text()).replace(/^By /,'');
   items.push({url:absolute(href),name:text(heading),description:text($(card).find('p').last()),type,image:$(card).find('img').length?imageFor($(card).find('img').first()):null,date:$(card).find('time').attr('datetime'),author});
  });
  itemList($(el).attr('id')||'content-list-'+index,text($(el).find('h2').first()),items);
 });
 main.find('[data-component=ServicePaths]').each((index,el)=>{
  const items=[];$(el).find('[data-service-panel]').each((_i,panel)=>{
   const anchor=$(panel).find('a.rk-button').first();if(!anchor.attr('href'))return;
   items.push({name:text($(panel).find('h3').first()),url:absolute(anchor.attr('href')),description:text($(panel).children('p').first())});
  });
  itemList('service-directory-'+index,text($(el).find('h2').first()),items);
 });
 if(main.find('[data-area-directory]').length)itemList('locations','Ohio service communities',main.find('[data-area-card]').toArray().map(el=>({name:text($(el).find('h3').first()),url:absolute($(el).find('a[href]').first().attr('href'))})));
 main.find('.rk-home-services-grid,.rk-product-hub-cards').each((index,el)=>{
  const items=$(el).find('a:has(h3)').toArray().map(card=>({name:text($(card).find('h3').first()),url:absolute($(card).attr('href')),description:text($(card).find('p').first()),...(productHubs[$(card).attr('href')]?{type:'CollectionPage'}:{})}));
  itemList('service-product-collection-'+index,text($(el).closest('section').find('h2').first()),items);
 });
 const products=[];
 main.find('article[data-product]').each((_i,el)=>{
  const card=$(el),href=card.find('.rk-product-detail-link').attr('href')||pageUrl;
  const productUrl=absolute(href),id=productUrl+'#product';
  const product={'@type':card.attr('data-companion-type')||'Product','@id':id,name:text(card.find('.rk-product-card-title').first()),url:productUrl,brand:{'@type':'Brand',name:card.attr('data-product-brand')||'GAF'}};
  const image=card.find('.rk-product-photo img').first();if(card.attr('data-product-image'))product.image=absolute(card.attr('data-product-image'));else if(image.length)product.image=imageFor(image);
  const copy=text(card.find('.rk-product-card-copy').first());if(copy)product.description=copy;
  const specs=card.find('dl>div').toArray().map(el=>{const value=$(el).find('dd').first().clone();value.find('small,a').remove();return {'@type':'PropertyValue',name:text($(el).find('dt').first()),value:clean(value.text())};}).filter(spec=>spec.name&&spec.value);
  // Detail specifications are outside ProductCard, but still part of this product's visible tab.
  if(productUrl===pageUrl)main.find('#specifications dl>div').each((_i,el)=>{const value=$(el).find('dd').first().clone();value.find('small,a').remove();specs.push({'@type':'PropertyValue',name:text($(el).find('dt').first()),value:clean(value.text())});});
  if(specs.length)product.additionalProperty=specs;
  const material=specs.find(spec=>spec.name.toLowerCase()==='material');if(material)product.material=material.value;
  const colors=[...new Set(card.find('.rk-product-swatches a[title]').toArray().map(el=>clean($(el).attr('title'))).filter(Boolean))];if(colors.length)product.color=colors;
  const category=text(card.find('.rk-product-card-heading .rk-home-eyebrow').first());if(category)product.category=category;
  if(productUrl===pageUrl){
   const parent=main.find('[data-product-parent] a[href]').first();
   if(parent.length)product.isAccessoryOrSparePartFor=reference(absolute(parent.attr('href'))+'#product');
  }
  add(product);products.push({name:product.name,url:productUrl,type:'Product',image:product.image,description:product.description});
 });
 if(products.length&&!main.find('article.rk-product-card-detail').length)itemList('product-catalog',text(main.find('[data-component=ProductGrid] h2').first())||'Manufacturer products',products);
 const companionProducts=[];
 main.find('[data-companion]').each((_i,el)=>{
  const card=$(el),href=card.find('a.rk-companion-internal[href]').attr('href'),id=href?absolute(href)+'#product':pageUrl+'#companion-'+card.attr('data-companion');
  const product={'@type':card.attr('data-companion-type')||'Product','@id':id,...(href?{url:absolute(href)}:{}),name:text(card.children('h3,h4').first()),description:text(card.children('p').not('.rk-home-eyebrow,.rk-companion-location').first()),...(card.attr('data-companion-type')?card.attr('data-companion-type')==='Product'&&card.attr('data-companion-brand')?{brand:{'@type':'Brand',name:card.attr('data-companion-brand')}}:{}:{brand:{'@type':'Brand',name:'GAF'}})};
  const image=card.find('.rk-accessory-photo img').first();if(image.length)product.image=imageFor(image);
  if(product['@type']==='Product'&&page.mainEntity&&types(nodes.get(page.mainEntity['@id'])||{}).includes('Product'))product[card.attr('data-companion-type')?'isRelatedTo':'isAccessoryOrSparePartFor']=page.mainEntity;
  companionProducts.push(add(product));
 });
 if(companionProducts.length)part({'@type':'WebPageElement','@id':pageUrl+'#companion-products-section',name:'Companion products and system components',about:companionProducts});

 // Model meaningful rendered sections, not decorative cards or interactive controls.
 main.find('[data-component=ServiceContentBand],[data-component=ServiceArticle],.rk-product-information,.rk-landing-credentials').each((index,el)=>{
  const section=$(el),heading=section.find('h2').first(),label=text(heading);if(!label)return;
  const key=section.attr('id')||heading.attr('id')||'content-section-'+index;
  const intro=text(section.find('p').not('.rk-home-eyebrow,.rk-service-detail-kicker').first());
  part({'@type':'WebPageElement','@id':pageUrl+'#section-'+key,name:label,isPartOf:reference(pageId),...(intro?{description:intro}:{}),...(page.mainEntity?{about:page.mainEntity}:{})});
 });
 main.find('.rk-before-after-block').each((_i,el)=>{
  const section=$(el),images=section.find('.rk-before-after-image').toArray().map(imageFor).filter(Boolean);
  part({'@type':'WebPageElement','@id':pageUrl+'#before-after-comparison',name:text(section.find('h2').first()),description:text(section.find('.rk-comparison-caption'))||text(section.find('.rk-home-before-copy>p').not('.rk-home-eyebrow').first()),isPartOf:reference(pageId),image:images,...(page.mainEntity?{about:page.mainEntity}:{})});
 });
 main.find('table').each((index,el)=>{
  const table=$(el),section=table.closest('section'),label=text(table.children('caption'))||text(section.find('h2,h3').first())||name+' table';
  part({'@type':'Table','@id':pageUrl+'#table-'+index,name:label,isPartOf:reference(pageId),...(page.mainEntity?{about:page.mainEntity}:{})});
 });
 const documents=new Map();main.find('a.rk-product-document[href]').each((_i,el)=>{
  const anchor=$(el),href=absolute(anchor.attr('href'));if(!/\.pdf(?:[?#]|$)/i.test(href))return;
  documents.set(href,{'@type':'DigitalDocument','@id':href+'#document',url:href,name:text(anchor).replace(/\s*\(PDF\)\s*↗?$/i,''),encodingFormat:'application/pdf'});
 });
 for(const document of documents.values())add(document);
 if(documents.size){const product=nodes.get(pageUrl+'#product');if(product)product.subjectOf=[...documents.keys()].map(href=>reference(href+'#document'));else page.mentions=[...documents.keys()].map(href=>reference(href+'#document'));}

 main.find('.rk-project-gallery-block').each((index,el)=>{
  const images=[];$(el).find('.rk-project-gallery-item img').each((_i,img)=>{const image=imageFor(img);if(image&&!images.some(item=>item['@id']===image['@id']))images.push(image);});
  if(!images.length)return;
  const gallery={'@type':'ImageGallery','@id':pageUrl+'#gallery-'+index,name:text($(el).find('h2').first()),isPartOf:reference(pageId),image:images};
  const ref=part(gallery);if(pageType==='ImageGallery')page.mainEntity=ref;
 });
 if(url.pathname.startsWith('/past-projects/project/')){
  const images=main.find('img.img-responsive').toArray().filter(img=>!$(img).closest('.rk-home-badge-images,.rk-home-brand-mark').length).map(imageFor).filter(Boolean);
  if(images.length){const unique=[...new Map(images.map(image=>[image['@id'],image])).values()];page.mainEntity=part({'@type':'ImageGallery','@id':pageUrl+'#project-images',name,isPartOf:reference(pageId),image:unique});if(!page.primaryImageOfPage)page.primaryImageOfPage=unique[0];}
 }
 main.find('[data-service-area-map]').each((index,_el)=>part({'@type':'Map','@id':pageUrl+'#coverage-map-'+index,name:'Ohio service-area city boundaries',description:'City boundaries and the Lewis Center community marker for Roof King service areas.',spatialCoverage:coverage.areas.map(area=>({'@type':area.kind==='city'?'City':'Place',name:area.name+', Ohio'}))}));
 const brandItems=main.find('[data-brand-id]').toArray().map(el=>({'@type':'Brand','@id':absolute($(el).attr('href'))+'#brand',name:clean($(el).attr('aria-label')).replace(/^Explore /,''),url:absolute($(el).attr('href'))}));
 for(const brand of brandItems)add(brand);
 if(brandItems.length)page.mentions=[...(page.mentions||[]),...new Map(brandItems.map(brand=>[brand['@id'],reference(brand['@id'])])).values()];
 if(url.pathname==='/blog/'){
  const blog=add({'@type':'Blog','@id':pageUrl+'#blog',name:'Roof King blog',url:pageUrl,publisher:reference(businessId),inLanguage:'en-US'});
  page.about=blog;
 }
 const topLinks=$('header .rk-menu-link-depth-0').toArray().map(el=>({'@type':'SiteNavigationElement',name:text(el),url:absolute($(el).attr('href'))}));
 if(topLinks.length)part({'@type':'SiteNavigationElement','@id':pageUrl+'#navigation',name:'Primary navigation',hasPart:topLinks});
 main.find('[data-component=BlogNavigation]').each((_i,el)=>{
  const links=new Map();$(el).find('a[href]').each((_i,anchor)=>{const copy=$(anchor).clone();copy.find('span,svg').remove();links.set($(anchor).attr('href'),{'@type':'SiteNavigationElement',name:clean(copy.text()),url:absolute($(anchor).attr('href'))});});
  if(links.size)part({'@type':'SiteNavigationElement','@id':pageUrl+'#blog-navigation',name:'Blog categories and topics',hasPart:[...links.values()]});
 });
 if(parts.length)page.hasPart=parts;
 add(page);
 const graph={'@context':'https://schema.org','@graph':[...nodes.values()]};
 $('script[type="application/ld+json"]').remove();
 $('head').append(`<script type="application/ld+json" data-site-schema>${serializeSchema(graph)}</script>`);
 return {html:$.html(),graph};
}

export default function structuredData(){return {name:'site-structured-data',hooks:{'astro:build:done':async({dir,logger})=>{
 let count=0;
 const root=fileURLToPath(dir);
 for(const file of await htmlFiles(root)){const html=await fs.readFile(file,'utf8');const result=completeStructuredData(html,{pathname:schemaPathname(file,root)});if(result.graph||result.changed)await fs.writeFile(file,result.html);if(result.graph)count++;}
 logger.info(`Linked Schema.org graphs compiled for ${count} content pages.`);
}}};}
