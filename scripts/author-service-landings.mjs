import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
import path from 'node:path';
const roofingReference=JSON.parse(await fs.readFile('src/data/roofing-landing.json','utf8'));
const families=JSON.parse(await fs.readFile('src/data/service-families.json','utf8'));
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8')).routes;
const source=[];
for(const route of manifest){const text=await fs.readFile(route.file,'utf8');source.push({...route,...YAML.parse(text.split('---')[1]),html:text.split('---').slice(2).join('---')});}
const extras=['/cost-of-a-new-roof/','/roof-calculator/','/roofing-calculator/'];
const selected=source.filter(p=>/service/i.test(p.category)||p.category==='Product guide'||extras.includes(p.path));
const routeFamilies={
 '/attic-insulation/':'insulation','/windows/':'windows','/exterior-painting/':'painting','/ice-dam-removal/':'ice',
 '/commercial-roofing/':'commercial','/commercial-roofing/repair/':'commercial-repair','/commercial-roofing/replacement/':'commercial-replacement','/commercial-roofing/roof-types/':'commercial-types','/commercial-roofing/gutters/':'commercial-gutters','/commercial-siding/':'commercial-siding',
 '/decks/':'decks','/decks/accessories/':'deck-accessories','/decks/installations/':'deck-install','/decks/refinishing/':'deck-refinish','/decks/repairs/':'deck-repair','/decks/replacements/':'deck-replace',
 '/gutters/':'gutters','/gutters/guards/':'guards','/gutters/seamless/':'seamless',
 '/siding/':'siding','/siding/replacement/':'siding-replacement','/siding/types/':'siding-types',
 '/storm-damage/':'storm','/storm-damage/hail/':'hail','/storm-damage/wind/':'wind','/storm-damage/commercial/':'commercial-storm','/storm-damage/insurance-claims/':'claims',
 '/roofing/':'roofing-local','/roofing/repair/':'repair','/roofing/replacement/':'replacement','/roofing/types/':'materials','/roofing/metal/':'metal','/roofing/gaf/':'gaf','/roofing/gaf/master-elite/':'certification',
 '/cost-of-a-new-roof/':'roof-cost','/roof-calculator/':'calculator','/roofing-calculator/':'calculator',
 '/emergency-roof-repair-dublin-oh/':'repair','/roof-repair-dublin-oh/':'repair','/roof-replacement-dublin-oh/':'replacement','/gaf-roofing-dublin-oh/':'gaf','/metal-roofing-dublin-oh/':'metal','/gutter-installation-dublin-oh/':'gutters','/hail-damage-roof-repair-dublin-oh/':'hail','/storm-damage-roof-repair-dublin-oh/':'storm','/roofing-contractor-dublin-oh/':'roofing-local','/dayton-roofers/':'roofing-local'
};
const context={
 Akron:'Bring roofing, siding and gutter concerns into one exterior conversation, then choose the service that fits the affected part of your home.',
 Athens:'Start with the repair or replacement you need, then coordinate roofing, siding and gutters before choosing your exterior finishes.',
 Aurora:'Compare roofing and siding options with the exterior you already have, and review drainage and storm-related repairs separately.',
 Beavercreek:'Plan the roof, siding and gutters as adjoining parts of your exterior while keeping the actual repair recommendations clear.',
 Centerville:'Explore roof work, deck projects and siding improvements from the condition of each part of your home.',
 Cincinnati:'Choose a roofing or storm restoration service, or begin a siding project with its material and installation details in view.',
 Cleveland:'Review roofing repairs, replacement materials and storm restoration with clear links to the relevant service and product information.',
 Columbus:'Our Columbus headquarters is the starting point for conversations about roofing, storm restoration and the rest of your home’s exterior.',
 Dayton:'Explore roofing and attic concerns alongside siding, gutter and storm restoration services for your property.',
 Delaware:'Begin with roof condition or reported storm damage, then explore the exterior materials and installation you want.',
 Dublin:'Choose the roofing or gutter service that matches your concern, then use the product library to compare materials separately.',
 Gahanna:'Bring your roof, siding or drainage concern to a service conversation focused on the actual condition of your property.',
 'Grove City':'Explore roof repairs, replacement materials and exterior work before planning the next installation at your home.',
 Hamilton:'Connect roof repairs, siding and gutter work with the preparation and product decisions needed for your exterior.',
 Hilliard:'Start with the affected part of your home and compare the relevant service, materials and installation details.',
 Lancaster:'Review roofing, siding and gutter work alongside any storm restoration needs before choosing the next project.',
 'Lewis Center':'Plan roofing and exterior work around the existing materials, the repairs identified and the finished appearance you prefer.',
 Middletown:'Choose repair or replacement services with the condition of your roof, siding and drainage in view.',
 Newark:'Explore roof work, siding, gutters and deck projects with a separate assessment for each part of your home.',
 Powell:'Use the service and product guides to narrow your questions before reviewing your property with the team.',
 'Upper Arlington':'Coordinate roofing and exterior improvements with the existing finishes and the preparation each installation needs.',
 Westerville:'Explore roofing and exterior choices, then confirm the actual materials and repairs in your written estimate.',
 Worthington:'Bring previous repair records and the details of the work you want so the discussion begins with your property.',
 Zanesville:'Review roofing and gutter work, siding choices and attic concerns as distinct parts of an exterior project.'
};
const overrides={
 '/storm-damage/':{title:'Columbus, OH Storm Damage Restoration Company',focus:'Explore Roof King’s storm inspection, roofing and exterior repair services. Find the service for hail, wind or ice damage, then review the documentation and work proposed for your property.'},
 '/emergency-roof-repair-dublin-oh/':{title:'Urgent Roof Repair in Dublin, OH',focus:'Report an active leak or visible roof damage and ask about inspection availability. An urgent request is not a promise of a particular arrival time; confirm scheduling directly with the team.'},
 '/dayton-roofers/':{title:'Roofing Contractors Serving Dayton, OH',focus:'Get to know the roofing team, review independent credentials and explore repair and replacement services before arranging a visit.'},
 '/roofing-contractor-dublin-oh/':{title:'Roofing Contractor in Dublin, OH',focus:'Choose your roofing contractor with the inspection approach, written estimate, independent reviews and product information in view.'},
 '/roof-calculator/':{title:'Roof Calculator: Start Your Roofing Estimate',focus:'Start with the published Roofr estimator. Review its result with the actual roof condition and your selected materials before agreeing to construction work.'},
 '/roofing-calculator/':{title:'Columbus Roofing Cost Calculator',focus:'Use the Roofr planning tool for a Columbus roofing project, then discuss tear-off, decking, flashing and product choices with our team.'},
 '/cost-of-a-new-roof/':{title:'What Goes Into the Cost of a New Roof?',focus:'Understand how preparation, material choices and actual roof conditions affect the work behind a replacement estimate.'}
};
function cityOf(p){if(p.path.includes('dublin'))return 'Dublin';if(p.path==='/dayton-roofers/')return 'Dayton';const head=p.path.split('/')[1];if(head.endsWith('-oh'))return head.slice(0,-3).split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');return 'Columbus';}
function familyOf(p){return routeFamilies[p.path] || (p.path.includes('cost-of-siding')?'siding-cost':p.path.includes('cost-of-new-gutters')?'gutter-cost':p.path.includes('cost-of-replacement')?'roof-cost':p.path.endsWith('/roofing/')?'roofing-local':p.path.endsWith('/storm-damage/')?'storm':'local');}
const key=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const openingTitles={repair:'Roof Repair Services',replacement:'Plan Your Roof Replacement',materials:'Compare Roofing Materials',gaf:'GAF Shingles, Systems & Installation',certification:'Verify Our GAF Certification',metal:'Metal Roof Styles & Installation',storm:'Storm Damage Inspection & Restoration',hail:'Hail Damage Inspection & Repairs',wind:'Wind Damage Inspection & Repairs',ice:'Ice Removal, Roof Repairs & Attic Conditions',claims:'Storm Inspection Records & Repair Estimates',siding:'Siding Replacement & Material Options','siding-replacement':'Plan Your Siding Replacement','siding-types':'Compare Siding Materials',gutters:'Gutter Installation & Protection',guards:'Gutter Protection & Support Systems',seamless:'Seamless Gutters, Outlets & Downspouts',decks:'Deck Installation, Repair & Replacement','deck-install':'Plan Your New Deck','deck-replace':'Plan Your Deck Replacement','deck-repair':'Deck Inspection & Repair Options','deck-refinish':'Deck Preparation & Refinishing','deck-accessories':'Deck Railings, Stairs & Accessories',insulation:'Attic Inspection & Insulation Planning',windows:'Window Styles & Installation Details',painting:'Exterior Surfaces, Preparation & Painting',commercial:'Commercial Roofing Services','commercial-repair':'Commercial Roof Inspection & Repair','commercial-replacement':'Plan Your Commercial Roof Replacement','commercial-types':'Compare Commercial Roofing Systems','commercial-gutters':'Commercial Gutters & Drainage','commercial-siding':'Commercial Siding Materials & Installation','commercial-storm':'Commercial Storm Inspection & Restoration',local:'Roofing & Exterior Services','roofing-local':'Residential Roofing Services','roof-cost':'Understand Your Roof Replacement Estimate',calculator:'Plan Your Roofing Estimate','siding-cost':'Understand Your Siding Replacement Estimate','gutter-cost':'Understand Your Gutter Estimate'};
const projectNames={roofing:'Roofing',commercial:'Commercial Roofing',siding:'Siding',gutters:'Gutter',decking:'Deck',insulation:'Attic Insulation',windows:'Window',painting:'Exterior Painting',mixed:'Exterior'};
const pnode=text=>({tag:'p',children:[{text}]});
function photos(p){const $=cheerio.load(p.html);const images=$('.rk-project-gallery-item img,.sec .gallery img,.sec .split img,.hero-bg').toArray().map(e=>({src:$(e).attr('src'),alt:$(e).attr('alt')||''})).filter(i=>i.src&&!/badge|logo|icon/i.test(i.src+' '+i.alt));return [...new Map(images.map(i=>[i.src,i])).values()];}
function heroPhoto(p){const $=cheerio.load(p.html);return $('.rk-home-hero').attr('style')?.match(/url\(['"]?([^'"\)]+)/)?.[1] || $('.rk-page-content').attr('style')?.match(/url\(['"]?([^'"\)]+)/)?.[1] || $('img.hero-bg').attr('src');}
const categoryRoots={roofing:'/roofing/',commercial:'/commercial-roofing/',siding:'/siding/',gutters:'/gutters/',decking:'/decks/',insulation:'/attic-insulation/',windows:'/windows/',painting:'/exterior-painting/',mixed:'/roofing/'};
const productLinks={roofing:[['Shingle styles & colors','/products/roofing/shingles/'],['GAF products & specifications','/roofing/gaf/types/']],commercial:[['Commercial roof systems','/commercial-roofing/roof-types/'],['Gutters & drainage','/commercial-roofing/gutters/']],siding:[['Compare siding materials','/products/siding/'],['Siding replacement','/siding/replacement/']],gutters:[['Gutter guards & support','/products/gutters/guards/'],['Seamless gutter installation','/gutters/seamless/']],decking:[['Explore Trex decking','/products/decking/composite/trex/'],['Stairs, rails & accessories','/decks/accessories/']],insulation:[['Attic insulation service','/attic-insulation/'],['Roofing & ice concerns','/ice-dam-removal/']],windows:[['Window installation','/windows/'],['Coordinate siding & trim','/siding/']],painting:[['Exterior painting','/exterior-painting/'],['Siding & adjoining trim','/siding/']],mixed:[['Roofing product library','/products/roofing/'],['Siding product library','/products/siding/']]};
const out={};
for(const page of selected){
 const family=familyOf(page),f=families[family];if(!f)throw Error('Missing family '+family);
 const city=cityOf(page),isLocal=page.category==='Local service',override=overrides[page.path]||{};
 const title=override.title || (family==='local'?`Roofing & Exterior Services in ${city}, OH`:isLocal?`${f.label} in ${city}, OH`:`${f.label} in Columbus, OH`);
 const focus=override.focus || (isLocal?context[city]:'') || f.guide.copy;
 const root=categoryRoots[f.product];const rootPage=source.find(p=>p.path===root);
 const image=heroPhoto(page)||heroPhoto(rootPage)||heroPhoto(source.find(p=>p.path==='/roofing/'));
 let gallery=[];
 if(['roofing','mixed'].includes(f.product))gallery=roofingReference.projects.images.map(i=>({src:i.src,alt:i.alt}));
 if(f.product==='siding')gallery=photos(source.find(p=>p.path==='/siding/')).slice(0,2);
 if(f.product==='gutters')gallery=photos(source.find(p=>p.path==='/gutters/')).slice(0,2);
 if(f.product==='commercial')gallery=['/commercial-roofing/','/commercial-roofing/repair/'].map(path=>({src:heroPhoto(source.find(p=>p.path===path)),alt:'Commercial roofing example from the existing site'}));
 if(family==='metal')gallery=[];
 const guideImage=heroPhoto(rootPage)||image;
 const children=selected.filter(p=>p.path!==page.path&&p.path.startsWith(page.path)&&!p.path.slice(page.path.length).replace(/\/$/,'').includes('/'));
 const childExtras=source.filter(p=>p.path!==page.path&&p.path.startsWith(page.path)&&!p.path.slice(page.path.length).replace(/\/$/,'').includes('/')&&!children.some(c=>c.path===p.path));
 const topics=children.concat(childExtras).map(child=>{const cf=families[familyOf(child)]||f;const catalog=child.category==='Product catalog';return {id:'service-'+key(child.path),tabLabel:catalog?'GAF Shingle Styles & Colors':cf.label,title:catalog?'Compare GAF Shingle Styles & Colors':cf.label,description:catalog?'Explore genuine shingle color images, individual products and the explanations behind published performance classifications.':cf.lead,detail:catalog?'Compare exact products in the catalog, then review physical samples and the system proposed for your roof.':cf.guide.copy,highlights:catalog?['Genuine color images','Individual product specifications','Warranty & companion product details']:cf.estimate.slice(0,3),href:child.path,label:catalog?'Explore GAF shingles':`Explore ${cf.label}`,icon:cf.product==='commercial'?'building':'roof'};});
 const leaf=f.topics.map((t,index)=>({...t,id:'topic-'+key(page.path)+'-'+index,tabLabel:t.label,label:'Explore '+(t.href.startsWith('/products/')?'products':t.label.toLowerCase()),icon:family.includes('storm')||family==='hail'||family==='wind'?'storm':f.product==='commercial'?'building':'roof',highlights:[]}));
 // A leaf topic links to a different useful destination, never to the current page itself.
 for(const item of leaf)if(item.href===page.path){item.href='#estimate';item.label='Discuss '+f.label.toLowerCase();}
 const opening={id:'service-topics',eyebrow:`${city}, Ohio · Roof King & Restoration`,title:`${openingTitles[family]} in ${city}, OH`,description:focus,selectorLabel:children.length?'Choose a service':'Choose a topic',items:topics.length?[...topics,...leaf.filter(item=>!topics.some(t=>t.href===item.href)&&!(family==='local'&&topics.some(t=>t.tabLabel===(item.tabLabel==='Roofing'?'Residential Roofing Services':item.tabLabel==='Storm restoration'?'Storm Damage Restoration':item.tabLabel))))]:leaf};
 if(page.path==='/commercial-roofing/')opening.banner={eyebrow:'For your home',title:'Looking for residential roofing?',description:'Explore roof repair, replacement and roofing products for your home.',href:'/roofing/',label:'Explore residential roofing',icon:'roof'};
 const links=productLinks[f.product].map(([label,href])=>({label,href}));
 const projectName=projectNames[f.product];
 const familyFaq=[{question:`How do I prepare for a ${projectName.toLowerCase()} project?`,answer:[pnode(focus+' Bring photographs taken safely from the ground and any previous repair or product records.')]},{question:`What belongs in a ${projectName.toLowerCase()} estimate?`,answer:[pnode(`Review ${f.estimate.join(', ').toLowerCase()}. Ask how additional repairs will be documented and approved before work proceeds.`)]},{question:'Are product and workmanship warranties the same?',answer:[pnode('No. Manufacturer terms concern the selected products. Workmanship coverage concerns installation. Ask for the written terms applicable to your project and keep both with your records.')]},{question:'How do I get started?',answer:[pnode(`Call Roof King to discuss your ${city} property or use the booking link to arrange an inspection. Confirm access, the work you want to discuss and appointment availability with our team.`)]}];
 if(['storm','hail','wind','claims','commercial-storm'].includes(family))familyFaq.splice(2,0,{question:'Can Roof King guarantee an insurance claim will be approved?',answer:[pnode('No. Roof King can document observed damage and provide a construction estimate. Your insurer determines coverage and claim decisions under your policy.')]});
 if(family==='guards')familyFaq.splice(1,0,{question:'Do gutter guards eliminate maintenance?',answer:[pnode('Follow the exact product’s cleaning and inspection instructions. Protection does not correct damaged or undersized gutters, and it does not replace an assessment of the existing drainage system.')]});
 if(family==='calculator')familyFaq.splice(1,0,{question:'Is the online result a final roofing quote?',answer:[pnode('No. Use the estimator for initial planning. Roof condition, access, products and any repairs need to be reviewed before a final written estimate.')]});
 const ancestors=source.filter(p=>p.path!=='/'&&p.path!==page.path&&page.path.startsWith(p.path)).sort((a,b)=>a.path.length-b.path.length);
 out[page.path]={family,serviceType:f.label,city,isLocal,reference:page.path==='/roofing/',title:page.path==='/roofing/'?page.title:title,description:`${f.label} in ${city}, OH. ${focus}`.slice(0,165).replace(/\s+\S*$/,'').replace(/[.,;:]?$/,'.'),sourceFile:page.file,sourceCategory:page.category,focus,
 hero:{eyebrow:`${city}, Ohio · Roof King & Restoration`,title,description:f.lead,image:{src:image,alt:`${f.label} photograph from Roof King’s existing site`},caption:'Materials, preparation and installation—planned together.',action:`Plan my ${projectName.toLowerCase()} project`,nextHref:'#service-topics',nextLabel:'Explore services & details'},
 breadcrumbs:[{label:'Home',href:'/'},...ancestors.map(p=>({label:p.path.endsWith('-oh/')?cityOf(p):families[familyOf(p)]?.label||p.title,href:p.path})),{label:isLocal&&family==='local'?city:f.label}],opening,
 products:{eyebrow:'Products & installation',title:f.product==='mixed'?'Explore Products for Your Exterior':`${f.label}: Products & Related Services`,description:'Compare the materials and installation information relevant to your project.',links},
 brandIds:({roofing:['gaf'],commercial:[],siding:['variform','lp-smartside','james-hardie','ply-gem'],gutters:['alu-rex','leaffilter'],decking:['trex'],mixed:['gaf','variform','lp-smartside','trex','james-hardie'],insulation:[],windows:[],painting:[]})[f.product],
 guide:{...f.guide,focus,image:{src:guideImage,alt:`${f.label} example from the existing Roof King image library`},links},
 projects:gallery.length?{eyebrow:'Roof King project photography',title:`${projectName} Details, Up Close`,description:'Explore images from Roof King’s existing site and discuss the materials and details relevant to your property.',images:gallery.map((i,index)=>({...i,alt:i.alt||`${f.label} project photograph`,label:index?'Installation detail':'Exterior example',caption:'Image from Roof King’s existing site; discuss the details relevant to your property.'})),href:'/past-projects/',label:'Explore project photography'}:null,
 budget:{eyebrow:'Your written estimate',title:`Included in ${projectName} Estimates`,description:`Review the ${projectName.toLowerCase()} work recommended for your property, with materials, preparation and installation identified.`,items:f.estimate},
 faq:{eyebrow:'Questions, answered',title:`Before Your ${projectName} Project`,description:`Practical information for your ${city} property.`,items:familyFaq},
 quote:{eyebrow:'Talk with Roof King',title:`Let’s Plan Your ${projectName} Project`,description:`Tell us about your ${city} property and the work you are considering. Call our team or arrange an inspection to get started.`},
 related:[...links,...(isLocal?[{label:`${city} exterior services`,href:`/${key(city)}-oh/`}]:[{label:'Find your service area',href:'/service-areas/'}]),{label:'More services from Roof King',href:'/#services'}].filter((l,i,a)=>l.href!==page.path&&source.some(p=>p.path===l.href.split('#')[0])&&a.findIndex(x=>x.href===l.href)===i),
 review:{status:page.path==='/roofing/'?'Approved reference':'Polished for client review',notes:['Original URL and canonical retained','Native Astro sections; Svelte only for interaction','Source material retained as migration evidence','No new prices, local job claims or guaranteed results','Lead delivery remains disconnected']}}
 }
await fs.writeFile('src/data/service-editorial.json',JSON.stringify(out,null,2)+'\n');
for(const [url,data] of Object.entries(out)){
 if(data.reference)continue;
 const target='src/pages'+url.slice(0,-1)+'.astro';
 await fs.mkdir(path.dirname(target),{recursive:true});
 let prefix=path.relative(path.dirname(target),'src').replaceAll('\\','/');if(!prefix.startsWith('.'))prefix='./'+prefix;
 await fs.writeFile(target,`---\nimport {getCollection} from 'astro:content';\nimport PolishedServicePage from '${prefix}/layouts/PolishedServicePage.astro';\nimport editorial from '${prefix}/data/service-editorial.json';\nconst page=(await getCollection('pages')).find(page=>page.data.permalink==='${url}')!;\n---\n<PolishedServicePage {page} data={editorial['${url}']}/>\n`);
}
console.log('Authored '+Object.keys(out).length+' service landings from '+Object.keys(families).length+' service briefs.');

// Reapply the approved source transfer after family defaults are regenerated.
await import('./apply-service-pdf.mjs');
