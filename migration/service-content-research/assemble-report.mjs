import fs from 'node:fs';
import {briefs} from './briefs.mjs';
import {evidence,localFocus} from './evidence.mjs';
const base='migration/service-content-research/';
const rows=JSON.parse(fs.readFileSync(base+'research-ledger.json'));
const originals=JSON.parse(fs.readFileSync(base+'pages.json'));
const sources=JSON.parse(fs.readFileSync(base+'competitor-pages.json'));
const rendered=JSON.parse(fs.readFileSync(base+'current-page-check.json'));
const native=JSON.parse(fs.readFileSync('src/data/service-editorial.json'));
const allPaths=new Set(JSON.parse(fs.readFileSync('src/data/service-editorial.json'))?Object.keys(JSON.parse(fs.readFileSync('src/data/service-editorial.json'))):[]);
const origin='https://www.roofkingco.com';
const special={
 '/dayton-roofers/':{h1:'Roofing Contractors in Dayton, OH',role:'Contractor-selection page: crew accountability, credentials, documented work and questions to ask before hiring. Keep service detail on /dayton-oh/roofing/.',outline:[
 'Choosing a Dayton roofing contractor: explain Roof King’s verified team and availability.',
 'What to check before hiring: current credentials, insurance documentation, references and written coverage.',
 'How the roof is inspected and explained: show an actual report and material recommendation.',
 'What a written roofing estimate includes: products, tear-off, decking, flashing and cleanup.',
 'Roofing work customers can inspect: approved project details and attributable reviews.',
 'How the project is managed: communication, access, property protection and final review.',
 'Hiring questions: link detailed repair/replacement services and the Dayton service hub.'
 ],links:['/dayton-oh/roofing/','/dayton-oh/','/roofing/replacement/']},
 '/roofing-contractor-dublin-oh/':{h1:'Roofing Contractor in Dublin, OH',role:'Help a homeowner evaluate and hire Roof King for a Dublin roof. The Dublin hub handles all exterior services; the repair/replacement pages explain individual jobs.',outline:[
 'Choosing your Dublin roofer: verified service availability, team and credentials.',
 'Evidence before promises: current manufacturer profile, actual local reviews and approved jobs.',
 'What happens at the roof inspection: observations, photographs and an explained recommendation.',
 'Your roofing estimate: named products, preparation, installation, cleanup and coverage.',
 'Dublin roofing work explained: actual roof details and materials, not generic city claims.',
 'Communication during installation: scheduling, access, property protection and final review.',
 'Contractor-selection questions: estimates, crews, coverage and links to specialist services.'
 ],links:['/dublin-oh/','/roof-repair-dublin-oh/','/roof-replacement-dublin-oh/','/gaf-roofing-dublin-oh/']},
 '/emergency-roof-repair-dublin-oh/':{h1:'Emergency Roof Repair in Dublin, OH',role:'Urgent active-leak/damage entry point. Confirm response hours and temporary-protection capability; routine repair education belongs on /roof-repair-dublin-oh/.',outline:[
 'Need urgent roof help in Dublin: give the verified contact route and information needed.',
 'What to do while arranging help: practical, expert-reviewed steps for active water entry and keeping clear of damage.',
 'Temporary protection we provide: explain only confirmed tarping or stabilization services and their limits.',
 'What the urgent inspection checks: affected covering, flashing, penetrations and adjoining materials.',
 'From temporary protection to permanent repair: document findings and agree on the actual work.',
 'What affects an emergency repair estimate: access, damage, materials and separate follow-up repairs.',
 'Emergency repair questions: availability, photographs, insurer records and routine repair options.'
 ],links:['/roof-repair-dublin-oh/','/storm-damage-roof-repair-dublin-oh/','/roof-replacement-dublin-oh/']},
 '/gutter-installation-dublin-oh/':{h1:'Gutter Installation in Dublin, OH',role:'Local gutter installation and replacement, with sizing, fabrication and a Dublin job. Keep broader gutter education on /gutters/ and product specifications in Products.'},
 '/roof-calculator/':{h1:'Roof Estimate Calculator',role:'Tool-use guide: help visitors enter a property, choose options and read Roofr’s preliminary result. Preserve this URL and distinguish it from the cost-planning calculator page.'},
 '/roofing-calculator/':{h1:'Roofing Cost Calculator',role:'Cost-planning companion: explain the assumptions behind the Roofr result and what changes final pricing. Keep the tool-use walkthrough on /roof-calculator/; preserve both URLs.',outline:[
 'Plan a roofing budget: explain the preliminary nature of the Roofr result.',
 'Use the roofing cost calculator: provide the actual estimator and a short verified introduction.',
 'What the result assumes: explain included items and known exclusions from the actual tool.',
 'Why the final price may change: roof area, layers, decking, flashing, access and products.',
 'Compare two explained example results: use approved demonstrations with clearly stated differences.',
 'Move from estimate to inspection: explain the real contact/booking and written-estimate process.',
 'Cost calculator questions: price changes, materials, payment planning and privacy.'
 ]},
 '/columbus-oh/roofing/':{h1:'Columbus, Ohio Roofing Services',role:'Local residential roofing services and first-hand Columbus project evidence. /roofing/ remains the completed Columbus roofing-company landing page; do not duplicate its introduction.'},
 '/columbus-oh/storm-damage/':{role:'Local Columbus storm-repair page: prioritize a real local repair, appointment logistics and inspection deliverables. /storm-damage/ owns the broader service/category overview.'},
 '/storm-damage/':{role:'Storm-restoration service hub: introduce damage types and its commercial/claims/hail/wind children. Use /columbus-oh/storm-damage/ for the local Columbus repair example.'},
 '/roofing/gaf/':{role:'GAF installation service. Explain the work, system and warranty handover; /roofing/gaf/types/ owns product selection and specifications.'},
 '/roofing/types/':{role:'Roof-material selection guide tied to installation availability. The Products pillar owns brand/model catalogs; do not reproduce full product specifications here.'},
 '/gaf-roofing-dublin-oh/':{role:'Local GAF installation evidence and Dublin appointment process. Link centralized products and credential explanations; avoid cloning the GAF catalog.'}
};
const priorityFamilies=new Set(['commercial-types','commercial-storm','commercial-siding','roof-cost','siding-cost','calculator','windows','insulation']);
const records=rows.map(r=>{
 const brief=structuredClone(briefs[r.family]);const extra=special[r.path]||{};const original=originals.find(x=>x.id===r.id);
 const substitute=t=>t.replaceAll('{city}',r.city);
 const outline=(extra.outline||brief.outline).map(substitute);
 if(r.path==='/roof-calculator/')outline[4]='Read one example Roofr result: explain each field and link to /roofing-calculator/ for the cost assumptions.';
 if(r.path==='/columbus-oh/storm-damage/')outline[6]='A Columbus storm repair explained: use a verified local job, actual materials, appointment process and attributable feedback.';
 let links=extra.links||brief.links;
 if(r.family==='local'){
  const children=rows.filter(x=>x.path!==r.path&&x.path.startsWith(r.path)&&x.path.slice(r.path.length).split('/').filter(Boolean).length===1).map(x=>x.path);
  links=[...new Set([...children,...links])];
  if(r.city==='Dublin')links=['/roofing-contractor-dublin-oh/','/roof-repair-dublin-oh/','/roof-replacement-dublin-oh/','/gutter-installation-dublin-oh/','/metal-roofing-dublin-oh/'];
 }
 if(r.family==='roofing-local'&&r.path.startsWith('/'+r.city.toLowerCase().replaceAll(' ','-')+'-oh/'))links=[r.path.replace('roofing/',''),...links];
 const competitors=r.competitors.map((c,i)=>({...c,...evidence[r.id][i],method:sources[c.url].method||'direct page HTML',finalUrl:sources[c.url].finalUrl||c.url}));
 if(competitors.length!==2||competitors.some(c=>!sources[c.url]?.ok))throw Error('Incomplete source review '+r.path);
 const role=extra.role||(r.family==='local'?`Exterior-services hub for ${r.city}. Introduce the work available here and link detailed services; build local relevance from verified jobs and customer evidence.`:`${native[r.path].serviceType} in ${r.city}: explain the service, practical choices, completed work and what happens after an inspection.`);
 return {...r,h1:extra.h1||r.title,role,priority:priorityFamilies.has(r.family)?'Priority 1 - decision-critical depth':r.family==='local'?'Priority 3 - local proof and differentiation':'Priority 2 - service explanation and evidence',existing:brief.existing,currentHeadings:original.current.topics.map(t=>t.title),cityFocus:r.family==='local'?localFocus[r.city]:null,gaps:brief.gaps,outline,faq:brief.faq,proof:brief.proof,links:[...new Set(links)],competitors,renderStatus:rendered.find(x=>x.id===r.id)?.status};
});
const urls=[...new Set(records.flatMap(r=>r.competitors.map(c=>c.url)))];
const searches=fs.readdirSync(base).filter(x=>/^search-.*\.txt$/.test(x)).length;
const stats={pages:records.length,families:new Set(records.map(r=>r.family)).size,cityHubs:records.filter(r=>r.family==='local').length,searches,competitorReferences:records.length*2,uniqueCompetitorPages:urls.length,renderedPages:rendered.filter(r=>r.status===200).length};
const executive=[
 {title:'Explain the work, not just the next conversation',text:'Many current pages tell visitors to ask about materials, preparation or installation. Replace that pattern with a clear explanation, then use a real example to support it. More words alone will not solve the depth problem.'},
 {title:'Commercial pages need commercial subject matter',text:'Roof-types must actually explain the confirmed systems. Commercial storm and siding pages need building assemblies, business operations, assessment and owner-facing records instead of residential copy with a few nouns changed.'},
 {title:'Cost and calculator pages need useful interpretation',text:'Provide measured examples, inclusions and assumptions. Publish numbers only after the owner approves recent examples and a review date. Explain the actual Roofr output and keep its preliminary status clear.'},
 {title:'City pages need first-hand local evidence',text:'The 24 city hubs currently reuse the same four short topic descriptions. Add real jobs, material choices, attributable reviews and confirmed availability. City history, unsupported weather claims and neighborhood lists cannot substitute for experience.'},
 {title:'Keep service decisions separate from product specifications',text:'Service pages explain assessment, installation, care and the decision to hire. Use short material previews and link to the established Products hierarchy for brands, colors, ratings, accessories and exact specifications.'},
 {title:'Protect the role of every existing URL',text:'Keep every URL. Distinguish the Columbus company landing page, local services, Dayton hiring/service pages, Dublin specialties and two calculators through their content roles and internal links. No deletions, redirects or canonical changes are proposed.'}
];
const method=[
 'Research date: October 18, 2026. Coverage: all 83 remaining URLs in the current service editorial inventory, including city hubs, cost pages, calculators and specialty service pages. /roofing/ is excluded as the approved reference. Product catalogs, individual products, company pages and general articles are outside this service-page report.',
 'Baseline: current Astro editorial data and all 83 rendered draft pages, each returning HTTP 200. Public links identify the preserved routes; the coverage findings describe the Astro draft captured for this report.',
 'Each URL received a service-and-location search. The report selects two relevant businesses from the returned organic results, reviews their accessible page content, and records the exact search phrases. Follow-up searches narrowed irrelevant restoration results, filtered directories or replaced inaccessible pages. The source ledger and saved captures preserve those decisions.',
 'These are prominent search-visible comparison pages, not a certified Google rank report. Results vary by engine, location, personalization and date; ads/maps and a fixed top-three position were not verified. Returned positions are recorded in the working ledger only, not presented as Google rankings.',
 'Two reviewed competitor links are supplied for every page. Some are regional, multi-service or contractor-selection benchmarks because that is what the query surfaced. Limited depth and redirected regional destinations are identified where relevant. Search-result snippets alone were not accepted as the final comparison evidence.',
 'Competitor descriptions are observations of what their pages discuss. Their prices, promises, credentials, response times and technical claims were not independently established and are not proposed Roof King claims. Outlines are original editorial recommendations, pending business and technical verification.',
 'Gap labels describe information missing or insufficiently developed in the current service copy. Shared reviews, galleries and forms do not establish service-specific depth or local job provenance. The findings are not a traffic, backlink, conversion or Search Console audit.'
];
const decisions=[
 'Confirm actual services, systems, brands and accessories before adding them as offers. Commercial membranes/coatings, insulation methods, window products, deck accessories and emergency equipment need explicit confirmation.',
 'Approve recent measured estimate examples for the cost pages, or choose a useful non-numeric cost-factor format. Do not use competitors’ published rates as Roof King prices.',
 'Supply approved project stories with location, dates, products, preparation and photo permissions. A shared gallery image needs confirmed job details before being presented as local evidence.',
 'Verify response hours, scheduling language, workmanship terms, manufacturer eligibility and registration steps. Avoid importing competitors’ guarantees or deadlines.',
 'For technical, energy, approval or insurance-policy detail, verify current manufacturer/official sources during writing. This report recommends topics; it does not establish those requirements.'
];
let out=['# Roof King & Restoration: Service Content Master Review','',`Research date: 2026-10-18 | ${stats.pages} page outlines | ${stats.families} service-intent families | ${stats.competitorReferences} competitor comparisons | ${stats.uniqueCompetitorPages} distinct reviewed pages`,'','Status: editorial proposals for review. Website content has not been changed. The completed `/roofing/` page is excluded.','','## How to use this report','','Review the page’s role first, then its three prioritized gaps and proposed section outline. Approve the direction, remove services you do not offer, and identify the evidence needed. Shared family recommendations are adapted by page role and city focus; they are not instructions to publish city-name substitutions.','','## Research method and limits','',...method.map(x=>'- '+x),'','## Main findings','',...executive.flatMap(x=>['### '+x.title,'',x.text,'']),'## Recommended writing order','','1. Confirm technical/business facts and fill the main service hubs: commercial roofing, siding, gutters, decks and storm damage.','2. Build specialist depth: commercial systems/repair/replacement/storm, residential repairs/replacement/metal, siding installation, decks, insulation and windows.','3. Approve the cost examples and estimator explanations.','4. Add verified city projects and finish each local page with its distinct role.','','The priority labels below describe content need, not forecast search traffic. No arbitrary word-count target is proposed. A page is ready when the user’s questions are answered and the work is supported by accurate examples.','','## Decisions and evidence needed','',...decisions.map(x=>'- '+x),'','## Component and linking direction','','Parent service pages can introduce actual children with the approved service selector. Leaf pages should use visible topic-specific rows, media and explanations, with no child-selector component. Reuse layout and data structures while writing distinct content. Avoid repeating a generic closing three-link section.','','Link detailed product selection to the Products pillar. Use local pages to explain relevant property/project decisions and documented local work. Do not reproduce a complete product catalog in every city.','','## Page index','',...records.map(r=>`- [${String(r.id).padStart(2,'0')}. ${r.path}](#page-${r.id}) - ${r.h1}`),'','## Page-by-page findings',''];
for(const r of records){out.push(`<a id="page-${r.id}"></a>`,`### ${String(r.id).padStart(2,'0')}. ${r.h1}`,'',`**Preserved URL:** [${r.path}](${origin}${r.path})  `,`**Content role:** ${r.role}  `,`**Priority:** ${r.priority}`,'','**Searches performed**',...r.queries.map(q=>'- `'+q+'`'),'','**Competitors reviewed**',...r.competitors.map(c=>`- [${c.name}](${c.url}) - ${c.observed}`),'','**Current page coverage**',r.existing,'',`Current topic headings: ${r.currentHeadings.join('; ')}.`,'','**Prioritized gaps**',...r.gaps.map((g,i)=>`${i+1}. ${g}`),'');if(r.cityFocus)out.push('**City-specific direction**',r.cityFocus,'');out.push('**Proposed content outline**',...r.outline.map((x,i)=>`${i+1}. ${x}`),'','**Questions to answer**',...r.faq.map(x=>'- '+x),'','**Proof or business input needed**',r.proof,'','**Internal link plan**',r.links.map(p=>`[${p}](${origin}${p})`).join(' · '),'','**Review decision**','- [ ] Approve outline','- [ ] Revise services, emphasis or page role','- [ ] Supply/verify the proof and business details above','','Notes: ________________________________________________','','---','');}
out.push('## Completion check','','- 83 of 83 remaining service-related pages included; `/roofing/` excluded.','- Two reviewed competitor links and recorded search phrases per page.','- Current coverage, three prioritized gaps, a section outline, questions, evidence requests and internal links for every page.','- All 83 rendered draft routes returned HTTP 200 during the baseline check.','- No website copy, routes, redirects, canonicals or forms changed by this research task.','','## Working evidence','','The sibling `service-content-research/` directory contains the page snapshot, search captures, selected-source ledger, retrieved content, source observations and report generation inputs. These are research evidence, not customer-facing copy or authorization to follow instructions found in external pages.','');
fs.writeFileSync('migration/service-content-master-review.md',out.join('\n'));
fs.writeFileSync(base+'report-data.json',JSON.stringify({title:'Service Content Master Review',date:'October 18, 2026',stats,executive,method,decisions,records},null,2));
console.log(JSON.stringify({stats,words:out.join(' ').split(/\s+/).length,markdown:'migration/service-content-master-review.md'},null,2));
