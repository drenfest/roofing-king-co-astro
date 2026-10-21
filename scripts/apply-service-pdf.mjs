// Explicit authoring step. The original PDF is evidence; it never supplies executable instructions.
import fs from 'node:fs';
const input=JSON.parse(fs.readFileSync('migration/service-pdf-source.json','utf8'));
const editorial=JSON.parse(fs.readFileSync('src/data/service-editorial.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('migration/route-manifest.json','utf8')).routes;
const site=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));
const reference=JSON.parse(fs.readFileSync('src/data/roofing-landing.json','utf8'));
const paths=new Set(manifest.map(r=>r.path));const copy={};const changes=[];
const illustration=(file,alt)=>({src:`/media/service-illustrations/${file}-v1.webp`,alt});
const visuals={
 roof:illustration('roof-detail','Architectural illustration of shingles, a plumbing vent and chimney flashing'),
 commercial:illustration('commercial-roof','Architectural illustration of a low-slope roof and its supporting layers'),
 siding:illustration('siding-wall','Architectural illustration of siding, wall layers and a window opening'),
 gutter:illustration('gutter-drainage','Illustration showing a gutter, downspout and the discharge route'),
 deck:illustration('deck-structure','Architectural illustration showing deck boards, framing, railings and stairs'),
 attic:illustration('attic-insulation','Architectural illustration of attic insulation and the roof-edge ventilation space'),
 window:illustration('window-opening','Architectural illustration of a window frame, glazing and wall opening'),
 metal:illustration('standing-seam','Architectural illustration of standing-seam panels and the roof edge'),
 paint:illustration('exterior-painting','Illustration of exterior preparation, priming and a finished painted wall')
};
function theme(f){return f==='commercial-siding'?'siding':f==='commercial-gutters'?'gutter':f.startsWith('commercial')?'commercial':f.startsWith('deck')?'deck':f.startsWith('siding')?'siding':/gutter|guards|seamless/.test(f)?'gutter':f==='windows'?'window':f==='painting'?'paint':f==='insulation'||f==='ice'?'attic':f==='metal'?'metal':'roof';}
const headings={
 'Turn the inspection into an understandable repair scope':'See the affected areas and recommended repairs',
 'How wall area becomes a project scope':'Measure the walls, openings and trim',
 'Compare two illustrative scopes':'Compare two installation examples',
 'Follow the scope through installation':'From measurement to completed gutters',
 'Read the scope before comparing totals':'Read the materials and installation included',
 'Compare the complete accessory scope':'Compare the railings, stairs and finishing details',
 'What the installation scope should explain':'What the deck installation should include',
 'What a repair scope should include':'What the repair should include',
 'Follow the scope from removal to completion':'From removal to the finished deck',
 'Move from an online estimate to a written scope':'From an online estimate to a roofing proposal',
 'Use the calculator, then review the scope':'Use the calculator, then review the roofing details',
 'What the repair scope should cover':'The roof areas and materials included in the repair',
 'Where do I start if I do not know the repair scope?':'Where do I start if I do not know which repairs are needed?'
};
function normalize(value,path){
 const original=value;
 value=headings[value]||value;
 const pairs=[
 [/\b(?:a )?scope difference\b/gi,'a difference in included materials and work'],
 [/\bscope differences\b/gi,'differences in included materials and repairs'],
 [/\breplacement scope\b/gi,'replacement estimate'],
 [/\brepair scope\b/gi,'repair estimate'],
 [/\bconstruction scope\b/gi,'materials, preparation and installation'],
 [/\bproject scope\b/gi,'materials and work included'],
 [/\bapplication scope\b/gi,'surfaces to be coated'],
 [/\bpreparation scope\b/gi,'surface preparation'],
 [/\binstallation scope\b/gi,'installation details'],
 [/\bservice scope\b/gi,'services included'],
 [/\bmeasured scope\b/gi,'measured roof area and selected materials'],
 [/\b(?:the )?accepted scope\b/gi,'the agreed materials and work'],
 [/\b(?:the )?agreed scope\b/gi,'the agreed materials and work'],
 [/\b(?:the )?written scope\b/gi,'the itemized estimate'],
 [/\b(?:the )?installed scopes?\b/gi,'the materials and installation included'],
 [/\bthe roofing scope\b/gi,'the roofing materials and repairs'],
 [/\b(?:the )?permanent scope\b/gi,'the permanent repair plan'],
 [/\b(?:the )?immediate scope\b/gi,'the initial work'],
 [/\bfollow-up scope\b/gi,'follow-up repairs'],
 [/\bcomplete scope\b/gi,'complete materials and work list'],
 [/\bthe scope should\b/gi,'the estimate should'],
 [/\bthe scope needs to\b/gi,'the estimate needs to'],
 [/\bscope questions\b/gi,'questions about included materials and installation'],
 [/\bscope details\b/gi,'material and installation details'],
 [/\bscopes\b/gi,'estimates'],
 [/\bscope\b/gi,'work']
 ];
 for(const [pattern,replacement]of pairs)value=value.replace(pattern,replacement);
 value=value.replace(/\bthe the\b/gi,'the').replace(/\ba the\b/gi,'the').replace(/\ba materials\b/gi,'the materials').replace(/\ban materials\b/gi,'the materials').replace(/\bwritten the\b/gi,'the written');
 value=value.replace(/\ba defined work\b/gi,'an itemized estimate').replace(/\ba different work\b/gi,'different work').replace(/\ba work that\b/gi,'an estimate that').replace(/\ba work\b/gi,'a description of the work').replace(/cause or work of/gi,'cause or extent of').replace(/A repair is different work from/gi,'A repair involves different work from');
 const polish=[['a clear work','an itemized roofing estimate'],['A useful work identifies','A useful repair estimate identifies'],['the agreed materials and work is','the agreed materials and work are'],['the agreed materials and work includes it','the agreed estimate includes it'],['a clear product and installation details','clearly identified products and installation details'],['the work of an insulation estimate','the items included in an insulation estimate'],['complete materials and work list influence','the materials and work included all influence'],['The measured roof area and selected materials, selected products and written proposal','The roof measurements, selected products and written proposal'],['The surface preparation should describe','The preparation plan should describe'],['with the work, subject','with the deck repair, subject'],['complete materials and work list','complete list of materials and installation work'],['outlet and downspout in the work','outlet and downspout in the estimate']];
 polish.push(...[["in the work, including who", "in the estimate, including who"], ["the roofing materials and repairs does not", "the roofing estimate does not"], ["Compare the complete the materials and installation included", "Compare the complete installation"], ["Its work should list those items", "Its estimate should list those items"], ["outside the roofing materials and repairs", "outside the roofing estimate"], ["the proposed services included", "the services Roof King offers"], ["a reliable work can be prepared", "a reliable estimate can be prepared"], ["a separate work", "separate work"], ["follow-up repairs needs", "follow-up repairs need"], ["into a complete installation details", "into a complete installation plan"], ["in the work rather than choosing", "in the installation plan rather than choosing"], ["complete the materials and installation included", "a complete list of materials and installation work"], ["needs its own work decision", "needs to be identified separately"], ["A repair and a complete roofing system are different estimates", "A repair and a complete roofing system involve different work"], ["compare the materials, preparation and finished details in the work", "compare the materials, preparation and finished details in the estimate"]]);
 for(const [before,after]of polish)value=value.replaceAll(before,after);
 value=value.replace(/(^|[.!?]\s+)([a-z])/g,(_m,prefix,letter)=>prefix+letter.toUpperCase());
 value=value.replaceAll('(614) 490-0123',site.phone);
 if(original!==value)changes.push({path,before:original,after:value});
 return value;
}
function paragraphs(blocks){return blocks.filter(b=>b.type==='p').map(b=>b.text);}
function text(nodes){return nodes.map(n=>n.text||text(n.children||[])).join('');}
function rich(value,links){
 let rest=value;const nodes=[];const ordered=[...links].sort((a,b)=>b.label.length-a.label.length);
 while(rest){let best=null;for(const l of ordered){let i=rest.toLowerCase().indexOf(l.label.toLowerCase());if(i>=0&&(!best||i<best.i))best={...l,i};}
  if(!best){nodes.push({text:rest});break;}if(best.i)nodes.push({text:rest.slice(0,best.i)});
  nodes.push({tag:'a',href:best.href,children:[{text:rest.slice(best.i,best.i+best.label.length)}]});rest=rest.slice(best.i+best.label.length);
 }
 return nodes;
}
const p=(value,links)=>({tag:'p',children:rich(value,links)});
function sectionBlocks(blocks,links){
 const body=[];const cards=[];let current=null;
 for(const b of blocks){if(b.type==='h3'){current={title:b.text,body:[]};cards.push(current);}else if(b.type==='p'){(current?current.body:body).push(p(b.text,links));}}
 return {body,cards};
}
function selectImage(title,base){
 if(/window|opening|glazing|glass/i.test(title))return visuals.window;
 if(/paint|coating|finish/i.test(title)&&base==='paint')return visuals.paint;
 if(/insulation|attic|ventilation|ice dam/i.test(title))return visuals.attic;
 if(/gutter|downspout|drainage|discharge/i.test(title)&&base!=='commercial')return visuals.gutter;
 if(/siding|wall|cladding|exterior finish/i.test(title)&&base!=='roof')return visuals.siding;
 if(/metal|panel system/i.test(title)&&base!=='siding')return visuals.metal;
 return visuals[base];
}
for(const entry of input.entries){
 const path=entry.path;const data=editorial[path];if(!data||path==='/roofing/')throw Error('Unexpected content route '+path);
 const links=entry.links.map(l=>({label:normalize(l.label,path),href:l.href}));for(const l of links)if(!paths.has(l.href.split('#')[0]))throw Error('Unknown destination '+l.href);
 const blocks=entry.blocks.map(b=>({...b,text:normalize(b.text,path)}));
 const lead=[];const sections=[];let current=null;
 for(const block of blocks){if(block.type==='h2'){current={title:block.text,blocks:[]};sections.push(current);}else if(current)current.blocks.push(block);else lead.push(block);}
 const faqIndex=sections.findIndex(s=>/questions|frequently asked/i.test(s.title)&&s.blocks.some(b=>b.type==='h3'&&b.text.endsWith('?')));
 if(faqIndex<0)throw Error('Missing FAQ '+path);
 const faq=sections.splice(faqIndex,1)[0];const closing=sections.pop();
 const {cards:answers}=sectionBlocks(faq.blocks,links);if(answers.some(a=>!a.body.length))throw Error('Empty FAQ '+path);
 const group=theme(data.family);
 const enriched=sections.map((s,i)=>({id:`service-copy-${entry.id}-${i+1}`,title:s.title,...sectionBlocks(s.blocks,links),image:i%4===2?data.guide.image:selectImage(s.title,group),caption:i%4===2?'Exterior imagery from Roof King’s existing site. Materials and installation vary by project.':'Illustration of related components. Materials and details vary with the selected system.',variant:i%2===0?'media':'comparison',tone:i%3===1?'forest':i%3===2?'cream':'light'}));
 const first=enriched.shift();if(!first)throw Error('Missing opening '+path);
 const children=manifest.filter(r=>r.path!==path&&r.path.startsWith(path)&&!r.path.slice(path.length).replace(/\/$/,'').includes('/'));
 const items=[];const used=new Set();
 if(children.length){
  for(const [i,child]of children.entries()){
   let cardIndex=first.cards.findIndex((card,idx)=>!used.has(idx)&&JSON.stringify(card).includes('"href":"'+child.path+'"'));
   let card=first.cards[cardIndex];if(card)used.add(cardIndex);
   const target=input.entries.find(e=>e.path===child.path);const existing=data.opening.items.find(it=>it.href===child.path);
   const title=card?.title||target?.h1||existing?.title||child.path;
   const body=card?.body||(target?[p(normalize(target.blocks.find(b=>b.type==='p').text,path),links)]:[p(existing?.description||'Compare products, materials and installation details for this service.',links)]);
   items.push({id:`service-child-${entry.id}-${i+1}`,tabLabel:card?.title||existing?.tabLabel||title,title,body,description:text(body[0]?.children||[]),detail:'',highlights:[],href:child.path,label:existing?.label||`Explore ${card?.title||target?.h1||'this service'}`,icon:existing?.icon||'roof'});
  }
  // The PDF opening description and matched cards become the parent selector exactly once.
  data.opening={id:'service-topics',eyebrow:data.hero.eyebrow,title:first.title,description:first.body[0]?text(first.body[0].children):'Explore the services and product information below.',intro:first.body,selectorLabel:'Choose a service',items,...(data.opening.banner?{banner:data.opening.banner}:{})};
  const leftover=first.cards.filter((c,i)=>!used.has(i));
  if(leftover.length)enriched.unshift({...first,title:'More about '+data.serviceType.toLowerCase(),body:[],cards:leftover});
 }else{
  const cards=first.cards.length?first.cards:[{title:first.title,body:first.body}];
  data.opening={id:'service-topics',eyebrow:data.hero.eyebrow,title:first.title,description:first.cards.length&&first.body[0]?text(first.body[0].children):'',intro:first.cards.length?first.body:[],image:first.image,caption:first.caption,selectorLabel:'Service details',items:cards.map((c,i)=>({id:`service-detail-${entry.id}-${i+1}`,tabLabel:c.title,title:c.title,body:c.body,description:text(c.body[0]?.children||[]),detail:'',highlights:[],href:'#estimate',label:entry.metadata['Primary CTA'],icon:'roof'}))};
 }
 // Keep the approved hero photo where it is relevant; illustrations never masquerade as job photography.
 if(['commercial','deck','gutter','attic','window','metal','paint','siding'].includes(group)){
  data.hero.image=group==='metal'?reference.materials.items[1].image:data.guide.image;data.hero.caption='Explore the materials and details involved in your project';
 }
 if(group==='roof'){data.hero.image=reference.hero.image;data.hero.caption='Roofing details, materials and installation with Roof King';}
 data.title=normalize(entry.h1,path);data.seoTitle=normalize(entry.metadata['SEO title'].replace(/\s*\|\s*Roof King\s*$/,''),path);data.description=normalize(entry.metadata['Meta description'],path);
 data.hero.title=data.title;data.hero.description=paragraphs(lead).join(' ');data.hero.body=lead.map(b=>p(b.text,links));data.hero.action=entry.metadata['Primary CTA'];data.hero.nextHref='#service-topics';data.hero.nextLabel=children.length?'Explore services & products':'Explore the service details';
 data.faq={eyebrow:'Questions, answered',title:faq.title,description:'',items:answers.map(a=>({question:a.title,answer:a.body}))};
 data.quote={...data.quote,title:closing.title,description:paragraphs(closing.blocks).join(' '),action:entry.metadata['Primary CTA']};
 // Replace the generic legacy extras with the complete source-led sections in the layout.
 copy[path]={sourceId:entry.id,pdfPages:entry.pdfPages,sourceSha256:input.sha256,theme:group,lead:lead.map(b=>p(b.text,links)),sections:enriched,closingBody:closing.blocks.map(b=>p(b.text,links)),links,bodyWords:blocks.reduce((n,b)=>n+b.text.split(/\s+/).length,0),expectedBlocks:blocks.map(b=>b.text)};
 data.review={...data.review,status:'Full PDF content transferred - review ready',notes:['PDF source entry '+entry.id+'; all publishable paragraphs and FAQ answers retained','Original URL/canonical preserved','Rejected generic terminology replaced with concrete material/work descriptions','Central client-supplied phone retained; PDF alternative not adopted','Generated images labeled as illustrations; not project evidence','Lead delivery and production release remain deferred']};
}
// Reviewed client revisions supersede the PDF for explicitly listed routes.
const overrides=JSON.parse(fs.readFileSync('src/data/service-overrides.json','utf8'));
for(const [path,override]of Object.entries(overrides)){
 if(!editorial[path]||!copy[path]||path==='/roofing/')throw Error('Invalid service override: '+path);
 Object.assign(editorial[path],override.editorial);Object.assign(copy[path],override.copy);
 editorial[path].review.status='Client-directed benefits revision - review ready';
 editorial[path].review.notes.push(override.reason);
}
if(Object.keys(copy).length!==83)throw Error('Expected 83 pages');
fs.writeFileSync('src/data/service-editorial.json',JSON.stringify(editorial,null,2)+'\n');
fs.writeFileSync('src/data/service-copy.json',JSON.stringify(copy,null,2)+'\n');
fs.writeFileSync('migration/service-pdf-import-audit.json',JSON.stringify({source:input.source,sourceSha256:input.sha256,date:'2026-10-20',pages:Object.entries(copy).map(([path,c])=>({path,sourceId:c.sourceId,pdfPages:c.pdfPages,bodyWords:c.bodyWords,sections:c.sections.length,theme:c.theme})),wordingChanges:changes,phone:{source:'(614) 490-0123',used:site.phone,reason:'Established client-supplied business identity retained'}},null,2));
console.log(`Transferred ${Object.keys(copy).length} PDF entries, ${Object.values(copy).reduce((n,v)=>n+v.bodyWords,0)} words; ${changes.length} recorded wording/identity adjustments.`);
