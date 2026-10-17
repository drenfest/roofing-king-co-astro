import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import * as cheerio from 'cheerio';

// Source audit only: never mutates page content, routes, navigation, or canonicals.
const manifest = JSON.parse(await fs.readFile('migration/route-manifest.json', 'utf8'));
const wordpress = JSON.parse(await fs.readFile('migration/sources/wordpress-content.json', 'utf8'));
const wpById = new Map(wordpress.records.map(r => [r.id, r]));
const catalog = [
  {id:'SiteChrome',name:'SiteChrome / document shell',selector:'*',state:'adapt',from:'DocumentLayout.astro, SiteHeader.svelte, SiteFooter.astro, QuoteExperience.svelte',engine:'Astro + Svelte navigation/modal',props:'title, description, canonical, breadcrumbs, active navigation; one modal host per page',reason:'Move every family onto the native header/footer and metadata shell. Keep route identity outside layout selection.'},
  {id:'PageHero',name:'PageHero',selector:'.rk-home-hero',state:'adapt',from:'HomeHero.astro',engine:'Astro',props:'eyebrow, h1, copy, image, CTA card, variant',reason:'Generalize the homepage hero rather than importing home.json into every page. Put the one H1 inside the hero.'},
  {id:'TrustStrip',name:'TrustStrip',selector:'.rk-home-badges',state:'adapt',from:'HomeTrust.astro',engine:'Astro',props:'certifications, rating source, rating, review count',reason:'Split certifications/review summary from the brand strip; use one verified data source.'},
  {id:'Breadcrumbs',name:'Breadcrumbs',selector:'.rk-breadcrumbs,nav[aria-label="Breadcrumb"]',state:'new',from:'WordPress roofkingco/breadcrumbs block',engine:'Astro',props:'ordered explicit label/URL entries',reason:'Preserve hierarchy without deriving public URLs from component folders.'},
  {id:'BrandStrip',name:'BrandStrip',selector:'.rk-block-trusted-brands',state:'adapt',from:'HomeTrust.astro',engine:'Astro',props:'heading, copy, brandSet, logo assets',reason:'Select relevant roofing/siding/deck manufacturers; do not repeat an unrelated brand set everywhere.'},
  {id:'ContentSections',name:'ContentSections / SplitSection',selector:'.rk-page-copy-section,.rk-page-intro-section,.rk-page-feature-section',state:'new',from:'Repeated rk-page sections in page bodies',engine:'Astro',props:'typed rich-text blocks, headings, lists, image, alignment',reason:'Reuse spacing and layout while retaining the full page-specific body. Avoid a single untyped raw-HTML mega-component.'},
  {id:'ServiceGrid',name:'ServiceGrid / ServiceCard',selector:'.rk-page-service-grid,.rk-home-services-grid',state:'adapt',from:'HomeServices.astro',engine:'Astro',props:'explicit service links, title, excerpt, image/icon',reason:'Hub navigation must point to preserved service URLs. Secondary services can use this instead of crowding the primary navigation.'},
  {id:'FeatureGrid',name:'FeatureGrid / ProcessSteps',selector:'.rk-page-feature-section,.rk-home-process-row',state:'adapt',from:'HomeWorkmanship.astro',engine:'Astro',props:'benefits or numbered steps; heading level and layout variant',reason:'Extract the process from the combined homepage component. Preserve different repair/replacement/claims sequences.'},
  {id:'OfferGrid',name:'OfferGrid / OfferCard',selector:'.rk-offers-block,.rk-home-offers',state:'adapt',from:'HomeCardSection.astro',engine:'Astro',props:'eligible offer records and explicit links',reason:'Extract a dedicated offer renderer with eligibility/expiry data; do not use blog cards for every content type.'},
  {id:'ProjectGallery',name:'ProjectGallery',selector:'.rk-project-gallery-block',state:'reuse',from:'ProjectGallery.svelte',engine:'Svelte island',props:'images, alt text, service/location tags, filters',reason:'The filtering/lightbox already works. Supply page-relevant, verified projects; preserve image links before hydration.'},
  {id:'BeforeAfter',name:'BeforeAfter',selector:'.rk-before-after-block',state:'reuse',from:'BeforeAfter.svelte',engine:'Svelte island',props:'paired before/after images, dimensions, meaningful labels',reason:'Use genuine pairs from the same job. Existing keyboard slider behavior can be shared.'},
  {id:'CoverageSection',name:'CoverageSection',selector:'.rk-coverage-map-block',state:'adapt',from:'HomeWorkmanship.astro',engine:'Astro',props:'heading, map/media, covered locations, contextual CTA',reason:'Split the coverage section from workmanship/process. A static map needs no hydrated JavaScript.'},
  {id:'Testimonials',name:'Testimonials / ReviewCard',selector:'.rk-reviews-block,.rk-home-reviews',state:'adapt',from:'HomeCardSection.astro',engine:'Astro',props:'verified review records, source links and contextual heading',reason:'Review summary, excerpt cards, and full review pages should share data without pretending every review is from the current city.'},
  {id:'QuoteCTA',name:'QuoteCTA / QuoteForm',selector:'.rk-page-final-cta,.rk-home-final-cta,.rk-migration-contact',state:'adapt',from:'QuoteForm.svelte, QuoteExperience.svelte',engine:'Astro CTA + Svelte modal/form',props:'service context, return page, public phone, booking URL, disabled delivery state',reason:'One consistent lead experience. Zapier delivery is deferred; Jared Lane is the confirmed lead owner. Do not enable submission yet.'},
  {id:'FAQSection',name:'FAQSection',selector:'.rk-page-faq-section,.rk-home-faq-stack,details',state:'adapt',from:'HomeConfidence.astro native details pattern',engine:'Astro native details',props:'question/answer groups, heading, optional anchor IDs',reason:'No Svelte needed for accessible expansion. Answers must match each service; do not generate unsupported claims.'},
  {id:'RelatedResources',name:'RelatedResources / ArticleCard',selector:'.rk-blog-related-section,.rk-home-blogs',state:'adapt',from:'HomeCardSection.astro',engine:'Astro',props:'selected article IDs, excerpts, optimized images',reason:'Replace the same global three posts with a relevant topic/location selection.'},
  {id:'DetailLayout',name:'DetailLayout primitives',selector:'.rk-blog-single',state:'new',from:'Current shared blog wrapper',engine:'Astro',props:'record header, prose slot, optional media/sidebar/next record',reason:'Share the layout primitives, then specialize ArticlePage, ProjectPage, OfferPage and ReviewPage. Remove blog labels from non-articles.'},
  {id:'ArchiveListing',name:'ArchiveListing / Pagination',selector:'.rk-migration-archive,.rk-blog-index',state:'new',from:'Reconstructed archives and blog index',engine:'Astro; optional progressive filters',props:'collection, taxonomy/author, page number, intro, cards, empty state',reason:'One listing system can preserve category/tag/author/pagination URL variants without deleting them.'},
  {id:'RoofrEstimator',name:'RoofrEstimator / ToolFrame',selector:null,state:'reuse',from:'RoofrEstimator.svelte',engine:'Svelte click-to-load island',props:'verified public URL, title, fallback link',reason:'Already connected on both calculator paths. Other tools need their own verified provider/data contract, not fake calculators.'},
  {id:'LocationDirectory',name:'LocationDirectory',selector:'.rk-page-areas-index',state:'new',from:'Service areas index',engine:'Astro',props:'explicit city records and service links',reason:'Separate geographic hubs from service pages; the existing index mixes both.'},
  {id:'SpecializedContent',name:'Specialized company / policy blocks',selector:null,state:'new',from:'Company, contact, policy, careers and events pages',engine:'Astro; forms only where needed',props:'team, vacancies, events, contact details or approved policy prose',reason:'Reuse primitives, but do not substitute global testimonials for missing staff, vacancies, event information or policy text.'},
];
const implemented={PageHero:'PageHero.astro',TrustStrip:'TrustStrip.astro',Breadcrumbs:'Breadcrumbs.astro',BrandStrip:'BrandStrip.astro',ContentSections:'ContentSection.astro + RichContent.astro',ServiceGrid:'ContentSection.astro services variant',CoverageSection:'CoverageSection.astro',QuoteCTA:'QuoteSection.astro + QuoteExperience.svelte',FAQSection:'FAQSection.astro'};
for(const item of catalog){if(implemented[item.id]){item.state='reuse';item.from=implemented[item.id];}}
catalog.push({id:'ProductGrid',name:'ProductGrid',selector:null,state:'reuse',from:'ProductGrid.astro',engine:'Astro',props:'section heading and separate product title/rich-text records',reason:'Introduced by the GAF shingle page. Retain every product description in a scan-friendly card grid.'});
const byComponent = new Map(catalog.map(c=>[c.id,c]));
const familyDefinitions = [
  ['homepage','Homepage','Existing native homepage; extract shared sections first.'],
  ['services','Services','ServicePage template with hub/detail/material/claims variants.'],
  ['cities','City landing pages','CityLandingPage with genuinely local proof and service links.'],
  ['local-services','Service + city pages','LocalServicePage; keep service-specific intent and full editorial body.'],
  ['articles','Articles','ArticlePage with dates/author, prose, TOC and related resources.'],
  ['archives','Blog and taxonomy archives','One query/listing renderer; preserve every listing URL.'],
  ['projects','Project detail pages','ProjectPage with actual job facts, materials, media and next/previous projects.'],
  ['project-hubs','Gallery and project hubs','Project gallery/listing views; map only with verified location data.'],
  ['offers','Offer detail pages','OfferPage variants for financing, warranty and seasonal promotion.'],
  ['offer-hub','Offer hub','Offer listing with eligibility and expiry handling.'],
  ['review-detail','Review detail pages','ReviewPage with quote, attribution and source.'],
  ['review-hub','Review hub','ReviewListing with source/aggregate consistency.'],
  ['conversion','Contact and inspection','ContactPage / InspectionLanding; shared disabled lead UI and booking link.'],
  ['tools','Tools','ToolLanding with provider-specific integration and honest unavailable states.'],
  ['company','Company and special pages','Small specialized compositions over shared layout primitives.'],
  ['policies','Policies','LegalPage prose layout; policy text needs business approval.'],
];
function family(r, meta) {
  if(r.path==='/')return 'homepage';
  if(meta.category==='Article')return 'articles';
  if(['Archive','Resource hub'].includes(meta.category))return 'archives';
  if(meta.category==='Local service')return /^\/(akron|athens|aurora|beavercreek|centerville|cincinnati|cleveland|columbus|dayton|delaware|dublin|gahanna|grove-city|hamilton|hilliard|lancaster|lewis-center|middletown|newark|powell|upper-arlington|westerville|worthington|zanesville)-oh\/$/.test(r.path)?'cities':'local-services';
  return ({'Service hub':'services','Service detail':'services','Core service':'services','Additional service':'services','Project':'projects','Project hub':'project-hubs','Offer / warranty':'offers','Offer hub':'offer-hub','Review':'review-detail','Review hub':'review-hub','Conversion':'conversion','Tool':'tools','Policy':'policies'})[meta.category]||'company';
}
const familyComponents = {
  homepage:['PageHero','TrustStrip','BrandStrip','ServiceGrid','OfferGrid','ProjectGallery','BeforeAfter','CoverageSection','Testimonials','RelatedResources','QuoteCTA','FeatureGrid','FAQSection'],
  services:['PageHero','Breadcrumbs','ContentSections','TrustStrip','QuoteCTA'],cities:['PageHero','Breadcrumbs','ContentSections','ServiceGrid','ProjectGallery','CoverageSection','QuoteCTA'],
  'local-services':['PageHero','Breadcrumbs','ContentSections','FAQSection','ProjectGallery','QuoteCTA'],
  articles:['DetailLayout','Breadcrumbs','ContentSections','RelatedResources','QuoteCTA'],archives:['ArchiveListing','Breadcrumbs'],projects:['DetailLayout','Breadcrumbs','ProjectGallery','QuoteCTA'],
  'project-hubs':['PageHero','Breadcrumbs','ProjectGallery','QuoteCTA'],offers:['DetailLayout','Breadcrumbs','ContentSections','QuoteCTA'],'offer-hub':['PageHero','Breadcrumbs','OfferGrid'],
  'review-detail':['DetailLayout','Breadcrumbs','Testimonials'],'review-hub':['PageHero','Breadcrumbs','Testimonials'],conversion:['PageHero','Breadcrumbs','QuoteCTA','SpecializedContent'],
  tools:['PageHero','Breadcrumbs'],company:['PageHero','Breadcrumbs','ContentSections','SpecializedContent'],policies:['Breadcrumbs','ContentSections','SpecializedContent'],
};
function specificNote(path,group) {
  if(path==='/')return 'Split HomeTrust and HomeWorkmanship before extending them. Homepage remains the visual reference; native sections already render here.';
  if(path==='/roofing/')return 'Build this first as the ServicePage pilot: repair/replacement/type links, feature content, offers, gallery and transformation. Use it to prove the shared components.';
  if(path==='/roofing/replacement/')return 'Keep repair-versus-replacement guidance, warning signs, the replacement process, cost discussion and FAQ as distinct editable sections.';
  if(path==='/roofing/repair/')return 'Keep leak/damage diagnosis, repair scenarios and repair-versus-replacement guidance; do not inherit replacement copy wholesale.';
  if(path.includes('insurance-claims'))return 'Keep a dedicated claims process and factual limits. Do not promise coverage or route all inquiries to insurance automatically.';
  if(path==='/service-areas/')return 'Fix directory data: the current area index includes service/material pages as if they were geographic locations. Use explicit city/service records.';
  if(path==='/our-team/')return 'Team body currently has only a short introduction after removing shared sections. Supply approved staff records/photos rather than inventing profiles.';
  if(path==='/our-careers/')return 'Careers body is effectively empty once shared sections are removed. Build vacancy/application states using real openings and an approved destination.';
  if(path==='/careers/')return 'Keep this path and its distinct recruitment copy. Share CareersPage primitives with /our-careers/; a content-equivalence decision is still required.';
  if(path==='/events/')return 'Only a short events stub is preserved. Build event cards and a truthful empty state; request actual event dates/details.';
  if(path==='/columbus-ppc-company/')return 'Treat as a campaign landing-page variant, sharing service components. Confirm audience, CTA and future index policy; preserve its URL now.';
  if(path==='/faq/')return 'Use grouped native details for the real roofing/siding/gutter questions. Keep full answers and usable anchors; no hydrated accordion needed.';
  if(path==='/cost-of-a-new-roof/')return 'Use cost-factor sections and a Roofr CTA. Keep editorial pricing context separate from the estimator; verify all amounts and eligibility.';
  if(path==='/deck-visualizer/')return 'Preserved body is only the title. Confirm the actual visualizer/vendor before building ToolFrame. A card that pretends to visualize a deck is not completion.';
  if(path==='/storm-report/')return 'Imported tool makes address-level NOAA-history claims, but its backend is not in this repository. Preserve explanatory copy and implement/verify the data service before claiming reports work.';
  if(['/roof-calculator/','/roofing-calculator/'].includes(path))return 'Keep both URLs. Share the already wired RoofrEstimator and a ToolLanding composition. Scheduling/quote delivery are separate; no test lead was submitted.';
  if(path==='/financing/')return 'Financing overview is not automatically identical to a particular financing offer. Reuse finance/offer cards while keeping its overview intent.';
  if(path==='/warranty/')return 'Warranty overview needs explicit coverage/terms data. Reuse warranty cards, but do not equate workmanship and manufacturer warranties.';
  if(path==='/contact-us/'||path==='/contact/')return 'Share one contact record and ContactPage. Preserve this route and current canonical. Keep Zapier deferred and Jared Lane as the confirmed lead owner.';
  if(path==='/free-inspection/')return 'Use InspectionLanding with the real booking link and inquiry form state. A request is not a confirmed appointment.';
  if(path==='/past-projects/')return 'Use project records plus optional verified map coordinates. The current generic hero says “Ready to start your project?”; make the project hub identity explicit.';
  if(group==='local-services')return 'Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.';
  if(group==='cities')return 'Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.';
  if(group==='projects')return 'Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.';
  if(group==='offers')return path.includes('warranty')||/pledge|system-plus/.test(path)?'Use WarrantyOfferPage: coverage, exclusions, eligibility, documents and CTA. Remove blog framing and verify exact manufacturer/workmanship terms.':'Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.';
  if(group==='review-detail')return 'Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.';
  if(group==='articles')return 'Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.';
  if(group==='archives')return 'Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.';
  if(group==='services')return 'Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.';
  if(group==='policies')return 'Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.';
  if(group==='project-hubs')return 'Reuse ProjectGallery filtering/lightbox; preserve actual project records and media relationships. Use a map only when location evidence supports it.';
  if(group==='review-hub')return 'Use ReviewListing and ReviewCard from verified review data. Reconcile imported platform ratings/counts before displaying an aggregate.';
  if(group==='offer-hub')return 'Use OfferListing and OfferCard from structured records. Expired offers retain useful explanatory pages rather than being silently removed.';
  return 'Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.';
}
const records=[];
for(const route of manifest.routes) {
  const raw=await fs.readFile(route.file,'utf8');
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);assert.ok(front,route.file);
  const meta=YAML.parse(front[1]);const body=raw.slice(front[0].length);const $=cheerio.load(body);
  const group=family(route,meta);const observed=catalog.filter(c=>c.selector && (c.selector==='*'||$(c.selector).length)).map(c=>c.id);
  if(['/roof-calculator/','/roofing-calculator/'].includes(route.path))observed.push('RoofrEstimator');
  const recommended=[...new Set(['SiteChrome',...(familyComponents[group]||[]),...observed])];
  if(group==='services'&&meta.category==='Service hub')recommended.push('ServiceGrid');
  if(group==='tools'&&['/roof-calculator/','/roofing-calculator/'].includes(route.path))recommended.push('RoofrEstimator');
  const headings=$('h1,h2,h3').toArray().map(e=>({level:Number(e.tagName.slice(1)),text:$(e).text().replace(/\s+/g,' ').trim()})).filter(h=>h.text);
  const wp=wpById.get(route.wordpressId);const blocks=[...new Set((wp?.blocks||[]).map(b=>b.blockName).filter(Boolean))];
  const main=$.root().clone();main.find('.rk-home-hero,.rk-home-badges,.rk-block-trusted-brands,.rk-project-gallery-block,.rk-before-after-block,.rk-coverage-map-block,.rk-reviews-block,.rk-page-final-cta,.rk-home-final-cta,.rk-blog-sidebar,.rk-blog-related-section,.rk-home-blogs,.rk-blog-menu-group,.rk-breadcrumbs,.rk-blog-hero,script,style').remove();
  const primaryText=main.text().replace(/\s+/g,' ').trim();const primaryWords=primaryText.split(/\s+/).filter(Boolean).length;
  const issues=[];
  if(route.canonicalPath!==route.path)issues.push('Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.');
  if(group!=='articles'&&$('.rk-blog-single').length)issues.push('Wrong record framing: blog label/byline/reading time on a non-article.');
  if(primaryWords<100&&!['archives','policies','homepage'].includes(group))issues.push('Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.');
  if(group==='archives'&&route.words<50)issues.push('Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.');
  if($('.rk-migration-title').length && $('.rk-home-hero').length)issues.push('Migration H1 sits outside hero; native PageHero should own the visible H1.');
  if($('main').length)issues.push('Imported body contains a nested main landmark; native composition should expose a single main.');
  if(group==='tools')issues.push('Integration needs functional verification; an available page URL does not prove the tool backend works.');
  if(route.source==='published-static-build')issues.push('Public static output only; original application/backend source is unavailable.');
  if(route.path==='/service-areas/')issues.push('Directory mixes geographic and non-geographic entries.');
  if(route.path==='/roofing/gaf/types/')recommended.push('ProductGrid');
  const componentPlan=[...new Set(recommended)].map(id=>({id,observed:observed.includes(id),action:byComponent.get(id).state}));
  records.push({...route,title:meta.title,category:meta.category,family:group,primaryWords,primaryExcerpt:primaryText.slice(0,600),headings,blocks,observed,components:componentPlan,issues,note:specificNote(route.path,group),bodyHash:crypto.createHash('sha256').update(primaryText).digest('hex'),nativeStatus:route.path==='/'?'Native homepage':observed.includes('RoofrEstimator')?'Imported page + native estimator':'Imported / reconstructed page',role:group==='homepage'?'Primary':group==='services'&&['Service hub','Core service'].includes(meta.category)?'Primary candidate':'Supporting / purpose-specific',reviewStatus:'Source audited; visual approval pending'});
}
const nativeServices=JSON.parse(await fs.readFile('src/data/service-pages.json','utf8'));
for(const record of records)if(record.path in nativeServices)record.nativeStatus='Native service components';
const aliases=records.filter(r=>r.canonicalPath!==r.path);
const families=familyDefinitions.map(([id,name,description])=>({id,name,description,count:records.filter(r=>r.family===id).length,canonicalCount:new Set(records.filter(r=>r.family===id).map(r=>r.canonicalPath)).size}));
for(const component of catalog){component.observedRoutes=records.filter(r=>r.observed.includes(component.id)).map(r=>r.path);component.recommendedRoutes=records.filter(r=>r.components.some(c=>c.id===component.id)).map(r=>r.path);component.observedCanonicalCount=new Set(records.filter(r=>r.observed.includes(component.id)).map(r=>r.canonicalPath)).size;}
const batchDefs=[
  {id:'foundation',name:'Extract the shared homepage sections',description:'Split hardcoded homepage components into prop-driven hero, trust, brand, coverage, testimonial, card and CTA sections. Create one native shell/modal host. This is a dependency, not 215 finished pages.',families:['homepage']},
  {id:'services',name:'Prove /roofing/, then migrate the service family',description:'Pilot /roofing/, /roofing/repair/ and /roofing/replacement/ first; then reuse the same service sections for roofing, siding, gutters, storm restoration, decks, windows and insulation.',families:['services']},
  {id:'locations',name:'Migrate location pages in two variants',description:'CityLandingPage for city hubs; LocalServicePage for service + location pages. Keep page-specific facts/copy. Do not change navigation or canonical decisions during templating.',families:['cities','local-services']},
  {id:'records',name:'Give each detail record its proper template',description:'Share detail layout/prose/media primitives; keep distinct article, project, offer and review presentation. Remove the inherited blog framing from non-articles.',families:['articles','projects','offers','review-detail']},
  {id:'listings',name:'Generate archives and supporting hubs',description:'Build one collection/listing engine with taxonomy, author, pagination and empty-state data. Reuse cards for offers, reviews, galleries and project hubs.',families:['archives','project-hubs','offer-hub','review-hub']},
  {id:'special',name:'Finish company, conversion, tools and policies',description:'Use the shared shell and blocks, but require actual team/vacancy/event data, approved policies and working tool providers. Zapier stays deferred; Jared Lane is the chosen lead owner.',families:['company','conversion','tools','policies']},
];
const batches=batchDefs.map(b=>({...b,routes:records.filter(r=>b.families.includes(r.family)).map(r=>r.path)}));
assert.equal(records.length,215);assert.equal(new Set(records.map(r=>r.path)).size,215);assert.equal(families.reduce((n,f)=>n+f.count,0),215);assert.equal(batches.reduce((n,b)=>n+b.routes.length,0),215);
const result={generatedAt:new Date().toISOString(),scope:'All 215 preserved source records examined; page-by-page visual approval is still pending. No live crawl, URL deletion, redirect, navigation restructuring or canonical change performed.',totalRoutes:records.length,canonicalTargets:new Set(records.map(r=>r.canonicalPath)).size,alternateRoutes:aliases.length,nonArticleBlogWrappers:records.filter(r=>r.family!=='articles'&&r.observed.includes('DetailLayout')).length,families,catalog,batches,records};
await fs.writeFile('migration/component-reuse-audit.json',JSON.stringify(result,null,2)+'\n');
const md=['# Component reuse audit','',result.scope,'','## What to build first','','1. Extract shared homepage sections into prop-driven components.','2. The initial `/roofing/`, repair and replacement pilot is implemented; use it to extend the service family.','3. Roll that system through all service pages, then the two location variants.','4. Separate article/project/offer/review templates and rebuild listings.','5. Finish purpose-specific company pages, integrations and approved policies.','','Route counts below are URLs, including aliases; they are not estimates of editorial work saved. Shared modules retain page-specific data and do not replace substantive copy.','','## Families','', '| Family | URLs | Canonical targets |','| --- | ---: | ---: |',...families.map(f=>`| ${f.name} | ${f.count} | ${f.canonicalCount} |`),'','## Shared components','', '| Component | Observed source URLs | Recommended URLs | Work needed |','| --- | ---: | ---: | --- |',...catalog.map(c=>`| ${c.name} | ${c.observedRoutes.length} | ${c.recommendedRoutes.length} | ${c.state} — ${c.from} |`),'','Counts indicate section evidence in preserved source, not completed native migrations or fresh live-site verification.','',`The audit found ${result.nonArticleBlogWrappers} non-article detail URLs using the blog wrapper. These need semantic template correction. Empty team/careers/tool bodies and the mixed service-area directory need editorial/data repair.`,'','## Component boundaries','','- `HomeTrust` → separate `TrustStrip` and `BrandStrip`.','- `HomeWorkmanship` → separate workmanship promo, process steps and coverage section.','- `HomeCardSection` → explicit offer/review/article sections over small card/grid primitives.','- `HomeHero` → `PageHero` with data/variant props; preserve the homepage hero appearance.','- `HomeImage` → general media/dimension pipeline, not a manifest limited to 28 homepage images.','- `SiteChrome` → native document/header/footer plus one quote-modal host, shared across families.','- `ProjectGallery`, `BeforeAfter`, `RoofrEstimator` → reuse existing Svelte behavior with page-specific props.','- FAQ/details, service grids, proof cards, maps and prose → Astro by default.','- Article, project, offer and review pages share layout primitives, not their meaning or metadata.','','## Data and URL contract','','Store page identity separately from rendering: permalink, canonicalPath, title, description, family, service/location IDs and ordered section data. Reference shared records by stable IDs; allow page-specific headings/copy and genuine local proof. Validate references, links, image sizes and required template fields. Collections should separate articles, projects, offers, reviews and locations so their templates cannot accidentally swap metadata.','','Retain every inventoried route and the existing canonical preferences until a separate content/SEO decision. Alternate routes may render the same underlying record without redirects. Proposed family/placement labels are recommendations; navigation is unchanged. Do not add nofollow or deindex supporting pages just to prioritize primary service pages.','','Quote delivery remains deferred, with Jared Lane confirmed as lead owner. Preserve disabled submission until the verified delivery path is built.','','## Page-by-page decisions',''];
for(const f of families){md.push(`### ${f.name} (${f.count})`,'');for(const r of records.filter(r=>r.family===f.id)){md.push(`#### ${r.path}`,'',`**${r.title}** · ${r.source} · ${r.nativeStatus}`,`- Components: ${r.components.map(c=>c.id+(c.observed?' [observed]':' [proposed]')).join(', ')}.`,`- Page-specific work: ${r.note}`,`- Source evidence: ${r.headings.length} headings; ${r.primaryWords} approximate body words after shared-section removal; WordPress blocks: ${r.blocks.join(', ')||'none / reconstructed or public output'}.`,...r.issues.map(issue=>'- Review: '+issue),'');}}
await fs.writeFile('migration/component-reuse-plan.md',md.join('\n')+'\n');
const logo=(await fs.readFile('scripts/thewebguy-logo.txt','utf8')).trim();
const template=await fs.readFile('scripts/component-audit-template.html','utf8');
await fs.writeFile('migration/component-reuse-audit.html',template.replace('__LOGO__',logo).replace('__AUDIT_DATA__',JSON.stringify(result).replace(/</g,'\\u003c')));
console.log(JSON.stringify({routes:result.totalRoutes,canonicalTargets:result.canonicalTargets,aliases:result.alternateRoutes,nonArticleBlogWrappers:result.nonArticleBlogWrappers,families:families.map(f=>[f.name,f.count]),batches:batches.map(b=>[b.id,b.routes.length])},null,2));
