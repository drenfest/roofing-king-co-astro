// Local authoring only: source captures -> existing product pages and registries.
import fs from 'node:fs/promises';
import {load} from 'cheerio';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const write=async(file,data)=>fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
const source=await read('migration/mule-hide-commercial-sources.json');
const checkedAt=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(source.checkedAt));
const previous=await read('src/data/commercial-products.json');
const details=await read('src/data/product-details.json'),hubs=await read('src/data/product-pillar.json');
const manifest=await read('migration/route-manifest.json'),structure=await read('src/data/site-structure.json');
const heroes=await read('src/data/product-hub-heroes.json'),selections=await read('src/data/navigation-photo-selections.json');
const brand=await read('src/data/brand-library.json');
const root='/products/roofing/commercial/',brandPath=root+'mule-hide/';
const slug=text=>text.replace(/([a-z\d])([A-Z])/g,'$1-$2').toLowerCase().replace(/[^a-z\d]+/g,'-').replace(/^-|-$/g,'');
const p=text=>({tag:'p',children:[{text}]});
// Keep the original technical text in the source capture; never advertise PVC.
const visible=text=>text.split(/(?<=[.!?])\s+/).filter(s=>!(/PVC|\bscop(?:e|es|ing)\b/i.test(s))).join(' ').trim();
const byUrl=new Map(source.records.map(r=>[r.url,r]));
const assetByUrl=new Map(source.assets.map(a=>[a.url,a]));
const categoryInfo={
  TPO:['tpo-membranes','TPO Membranes'],EPDM:['epdm-membranes','EPDM Membranes'],EdgeMetal:['edge-metal','Metal Roof Edges'],
  FastenersTermination:['fasteners-termination','Fasteners and Termination'],CoverBoardsInsulation:['cover-boards-insulation','Cover Boards and Insulation'],
  UnderlaymentsVaporBarriers:['underlayments-vapor-barriers','Underlayments and Vapor Barriers'],Adhesives:['adhesives','Adhesives'],
  Sealants:['sealants','Sealants'],Flashings:['flashings','Flashings'],SinglePlyAccessories:['single-ply-accessories','Single-Ply Accessories'],
  Related:['related-components','Related Components']
};
const fixed={StandardTPO:{id:'mule-hide-standard-tpo',slug:'tpo'},StandardEPDM:{id:'mule-hide-standard-epdm',slug:'epdm'},TPOCoatedMetal:{id:'mule-hide-tpo-coated-metal',slug:'tpo-coated-metal'}};
for(const r of source.records){r.id=fixed[r.key]?.id||'mule-hide-'+slug(r.key);r.path=brandPath+(fixed[r.key]?.slug||slug(r.key))+'/';}
const crumbs=[{label:'Home',href:'/'},{label:'Products',href:'/products/'},{label:'Roofing Products',href:'/products/roofing/'},{label:'Commercial Roofing',href:root},{label:'Mule-Hide',href:brandPath}];
const catalog={},media={},companionSets={},memberships={};
async function addRecord(path,title,description,category,body){
  const file=`src/content/pages${path}index.md`;
  const meta={title,permalink:path,description,canonicalPath:path,category,source:'authored-commercial-products',sourcePath:'migration/mule-hide-commercial-sources.json',wordpressId:null,reviewStatus:'authored-needs-review',notes:['Manufacturer-sourced commercial product information. REVIEW REQUIRED. Existing URLs preserved.'],priority:'product-pillar'};
  await fs.mkdir(file.slice(0,file.lastIndexOf('/')),{recursive:true});
  // Existing records are retained; only their authored product description is refreshed.
  const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  await fs.writeFile(file,'---\n'+Object.entries(meta).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')+'\n---\n\n<article><h1>'+escape(title)+'</h1><p>'+escape(body)+'</p></article>\n');
  if(!manifest.routes.some(r=>r.path===path))manifest.routes.push({path,file,source:meta.source,wordpressId:null,canonicalPath:path,notes:meta.notes,words:body.split(/\s+/).length});
}
for(const r of source.records){
  const asset=assetByUrl.get(r.assetUrl),largest=asset.variants.at(-1),thumb=asset.variants[0];
  const image={src:largest.src,srcset:asset.variants.map(v=>`${v.src} ${v.width}w`).join(', '),width:largest.width,height:largest.height};
  media[image.src]={width:image.width,height:image.height,variants:asset.variants.map(v=>({src:v.src,width:v.width}))};
  const title='Mule-Hide '+r.title;
  let prose=r.description.map(visible).filter(Boolean);
  if(!prose.length){const $=load(await fs.readFile('tmp/mule-hide-crawl/'+r.key+'.html','utf8'));const fallback=visible($('h1').first().parent().parent().children('.prose').text().replace(/\s+/g,' ').trim());if(fallback)prose=[fallback];}
  const systems=r.systems.filter(s=>!/PVC/i.test(s));
  if(!prose.length)prose=[`${title} is a manufacturer-listed commercial roofing product. Review its product data and application instructions for the selected assembly.`];
  const description=`${title}: manufacturer product information, available options, specifications and installation resources for commercial roofing.`;
  const features=r.features.map(visible).filter(Boolean),colors=r.colorReferences.filter(c=>!(/PVC/i.test(c.name))).map(c=>({...c,name:c.name.trim()}));
  const specs=[{label:'Product family',value:r.title,sourceUrl:r.url},...(systems.length?[{label:'Manufacturer-listed systems',value:systems.join(', '),sourceUrl:r.url}]:[])];
  for(const [label,pattern]of [['Thickness / gauge',/\bmil\b|gauge|thickness/i],['Dimensions',/\bwidth|\blength|\bsheets?\b|\brolls?\b/i]]){
    const values=features.filter(f=>pattern.test(f)&&!/warranty/i.test(f));if(values.length)specs.push({label,value:values.join(' · '),sourceUrl:r.url});
  }
  if(colors.length)specs.push({label:'Manufacturer color references',value:colors.map(c=>c.name).join(', '),sourceUrl:r.url});
  const documents=r.documents.filter(d=>!(/PVC/i.test(d.label+' '+d.url)));
  const warrantyFeatures=features.filter(f=>/warranty/i.test(f));
  const warrantyDocument=documents.find(d=>/warrant/i.test(d.label));
  const original=previous[r.id];
  const html=load(await fs.readFile('tmp/mule-hide-crawl/'+r.key+'.html','utf8'));
  const faqs=html('#faqs .accordion-item').map((i,e)=>({question:visible(html(e).find('button').first().text().replace(/\s+/g,' ').trim()),answer:visible(html(e).find('.accordion-body').text().replace(/\s+/g,' ').trim())})).get().filter(f=>f.question&&f.answer);
  catalog[r.id]={id:r.id,brand:'Mule-Hide',detailPath:r.path,sourceUrl:r.url,checkedAt,projectType:'commercial',logo:brand['mule-hide'].image,
    comparisonGroup:r.categories.includes('TPO')?'tpo':r.categories.includes('EPDM')?'epdm':r.categories.includes('EdgeMetal')?'edge-metal':'commercial-accessories',
    categoryLabel:'Commercial '+(categoryInfo[r.categories[0]]?.[1]||'Roof Components'),optionLabel:'Product view',defaultColorId:'manufacturer-product-view',
    colors:[{id:'manufacturer-product-view',name:'Manufacturer product view',sourceImageUrl:r.imageUrl,image,swatch:thumb.src,availabilityNote:'Manufacturer product photograph; reference colors and product options are listed separately below.'}],
    previewMode:'palette',previewAlt:title+' manufacturer product photograph',hero:{...image,alt:title+' manufacturer product photograph',caption:'Mule-Hide manufacturer product photograph'},
    thumbnail:{src:thumb.src,width:thumb.width,height:thumb.height},badges:[],specs,
    warrantyLabels:warrantyFeatures.length?warrantyFeatures:['Coverage, if available, is governed by the applicable product and installed-system warranty documents.'],
    warrantyNote:'A published maximum term is conditional on the selected assembly and eligibility requirements. It is not automatic project coverage or a prediction of service life.',
    warrantyUrl:warrantyDocument?.url||r.url+'#documents',documents:[{label:r.title+' manufacturer product page',url:r.url},...documents],
    specificationsIntro:'Manufacturer-listed features, product options and documents apply to this exact product. The installation specification determines the selected assembly and compatible components.',
    manufacturerData:{features,colors,faqs,optionColumns:r.optionColumns,options:r.options.filter(row=>!row.some(cell=>/PVC/i.test(cell)))},
    care:original?.care||{title:'Product Care and Installation',intro:'Follow the written instructions for this product and the installed roof assembly.',items:[{title:'Retain Product Records',body:'Keep the product name, selected item numbers, application instructions and applicable warranty with the building maintenance records.'},{title:'Protect the Installed Assembly',body:'Coordinate equipment access and later work with the roof contractor. Repairs and alterations must use materials and preparation approved for the existing system.'},{title:'Inspect Connections and Drainage',body:'Arrange inspections at the intervals stated in the applicable roof maintenance instructions, and report damage at seams, edges, penetrations and drainage points.'}],footnote:'These general maintenance steps do not replace product-specific instructions or warranty requirements.',links:[{label:'Manufacturer application and care resources',url:r.url}]}
  };
  // Retain existing curated numeric specifications for the original three products.
  if(original)catalog[r.id].specs=[...original.specs,...specs.filter(s=>!original.specs.some(old=>old.label===s.label))];
  const primary=r.categories.find(c=>categoryInfo[c])||'Related';
  const categoryPath=brandPath+categoryInfo[primary][0]+'/';
  const breadcrumbs=[...crumbs,{label:categoryInfo[primary][1],href:categoryPath},{label:title}];
  details[r.path]={key:r.id,title,description,body:[...prose.map(p),{tag:'p',children:[{text:'Explore '},{tag:'a',href:'/commercial-roofing/',children:[{text:'commercial roofing services'}]},{text:' and discuss the selected products with Roof King.'}]}],breadcrumbs};
  structure.pages[r.path]={breadcrumbs};
  await addRecord(r.path,title,description,'Product detail',prose.join(' '));
  for(const category of (r.categories.length?r.categories:['Related'])){(memberships[category]||=[]).push(r);}
}
// Product-specific manufacturer links first; reverse links retain their direction in notes.
for(const r of source.records){
  const direct=r.related.map(url=>byUrl.get(url)).filter(Boolean);
  const incoming=source.records.filter(other=>other.related.includes(r.url));
  let candidates=[...new Map([...direct,...incoming].filter(x=>x.id!==r.id).map(x=>[x.id,x])).values()];
  let relation='The manufacturer lists these products alongside this product. Related products may include alternative coverings as well as accessories; they are not an approved kit.';
  if(!candidates.length&&r.systems.some(s=>/TPO|EPDM/i.test(s))){
    const systems=r.systems.filter(s=>/TPO|EPDM/i.test(s));
    candidates=source.records.filter(other=>other.id!==r.id&&other.systems.some(s=>systems.includes(s))&&other.categories.some(c=>['Adhesives','Flashings','Sealants','FastenersTermination','CoverBoardsInsulation'].includes(c))).slice(0,6);
    relation='These supporting products share a manufacturer-listed roof-system family. Their exact use and compatibility depend on the product application instructions and selected assembly.';
  }
  if(!candidates.length)continue;
  companionSets[r.id]={brand:'Mule-Hide',intro:relation,notes:'Select the membrane, insulation, attachment, adhesives, flashings and perimeter details from the applicable manufacturer specification. A related-product link does not confirm compatibility for every attachment method, substrate or project.',items:candidates.map(other=>({id:other.id,name:'Mule-Hide '+other.title,diagram:'commercial',location:other.categories.map(c=>categoryInfo[c]?.[1]).filter(Boolean).join(' / ')||'Commercial roof assembly',benefit:visible(other.description.join(' '))||'Review the manufacturer product information for the role and application of this component.',selection:direct.includes(other)?'Manufacturer-listed related product. Follow its application instructions for the selected system.':incoming.includes(other)?'This product is listed as related on the linked manufacturer product page. Confirm the intended combination in the installation specification.':'Manufacturer-listed for the same roof-system family; confirm substrate, attachment and application compatibility.',sourceUrl:direct.includes(other)?r.url:other.url,relatedProduct:other.id}))};
}
const usedHeroes=new Set();const collectionCards=[];
for(const [key,items]of Object.entries(memberships)){
  if(!categoryInfo[key])throw Error('Unknown product category '+key);
  const [part,label]=categoryInfo[key],path=brandPath+part+'/';
  const selected=items.find(r=>!usedHeroes.has(catalog[r.id].hero.src))||items[0];usedHeroes.add(catalog[selected.id].hero.src);
  const breadcrumbs=[...crumbs,{label}];
  const description=`Explore ${items.length} Mule-Hide ${label.toLowerCase()} products with manufacturer data, images and application resources.`;
  hubs[path]={title:'Mule-Hide '+label,description,heading:'Mule-Hide '+label,eyebrow:'Commercial roofing product library',copy:description,breadcrumbs,logo:brand['mule-hide'].image,cards:[],catalogTitle:label,catalogIntro:'Product photographs, color references and manufacturer item options are product-specific. Confirm the selected combination and availability with Roof King.',catalogItems:items.map(r=>({productId:r.id,title:'Mule-Hide '+r.title,body:details[r.path].body.slice(0,1)})),secondaryTitle:'Commercial Roofing',secondary:[],relatedLinks:[{label:'All Mule-Hide products',href:brandPath},{label:'Commercial roofing services',href:'/commercial-roofing/'}],reference:{label:'Mule-Hide manufacturer category',href:source.categories.find(c=>c.key===key)?.url||'https://www.mulehide.com/Products'}};
  heroes[path]=catalog[selected.id].hero;selections[path]={sourceImage:catalog[selected.id].hero.src};structure.pages[path]={breadcrumbs};
  collectionCards.push({title:label,description,href:path,action:'Explore '+label,product:selected.id});
  await addRecord(path,'Mule-Hide '+label,description,'Product collection',description);
}
Object.assign(hubs[brandPath],{cards:collectionCards,catalogItems:[],copy:'Explore Mule-Hide TPO and EPDM membranes, metal roof-edge products and supporting components. Each product page includes manufacturer data, product imagery, reference colors where published, item options, source documents and related components.'});
manifest.count=manifest.routes.length;
for(const [file,data]of Object.entries({'src/data/commercial-products.json':catalog,'src/data/commercial-product-companions.json':companionSets,'src/data/commercial-product-media.json':media,'src/data/product-details.json':details,'src/data/product-pillar.json':hubs,'src/data/product-hub-heroes.json':heroes,'src/data/navigation-photo-selections.json':selections,'src/data/site-structure.json':structure,'migration/route-manifest.json':manifest}))await write(file,data);
await write('migration/mule-hide-catalog-summary.json',{checkedAt:source.checkedAt,products:Object.keys(catalog).length,collections:collectionCards.length,companionSets:Object.keys(companionSets).length,companionLinks:Object.values(companionSets).reduce((n,s)=>n+s.items.length,0),sourceDocuments:source.records.reduce((n,r)=>n+r.documents.length,0),optionRows:Object.values(catalog).reduce((n,p)=>n+p.manufacturerData.options.length,0),images:source.assets.length,variants:source.assets.flatMap(a=>a.variants).length,imageBytes:source.totalBytes,records:source.records.map(r=>({key:r.key,id:r.id,path:r.path,categories:r.categories,sourceUrl:r.url,related:r.related})),publication:'Local review; not published'});
console.log(JSON.stringify({products:Object.keys(catalog).length,collections:collectionCards.length,companionSets:Object.keys(companionSets).length,companionLinks:Object.values(companionSets).reduce((n,s)=>n+s.items.length,0),routes:manifest.count}));
