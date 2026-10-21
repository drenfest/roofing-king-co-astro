# src/pages

There are 83 explicit polished service entry points backed by service-editorial.json; /roofing/ remains the approved ServiceLanding reference. Their paths are excluded from the legacy catchall, which must never import PolishedServicePage conditionally because that bundles compatibility styles into native pages. Author native entry points with scripts/author-service-landings.mjs. Both calculator pages retain the click-to-load Roofr estimator in the native layout. Product routes and the GAF catalog keep their separate presentation. All 244 protected URLs must remain at their original paths and canonical targets.

## Files

- `404.astro`
- `akron-oh.astro`
- `athens-oh.astro`
- `attic-insulation.astro`
- `aurora-oh.astro`
- `beavercreek-oh.astro`
- `centerville-oh.astro`
- `cincinnati-oh.astro`
- `cleveland-oh.astro`
- `columbus-oh.astro`
- `commercial-roofing.astro`
- `commercial-siding.astro`
- `cost-of-a-new-roof.astro`
- `dayton-oh.astro`
- `dayton-roofers.astro`
- `decks.astro`
- `delaware-oh.astro`
- `dublin-oh.astro`
- `emergency-roof-repair-dublin-oh.astro`
- `exterior-painting.astro`
- `gaf-roofing-dublin-oh.astro`
- `gahanna-oh.astro`
- `grove-city-oh.astro`
- `gutter-installation-dublin-oh.astro`
- `gutters.astro`
- `hail-damage-roof-repair-dublin-oh.astro`
- `hamilton-oh.astro`
- `hilliard-oh.astro`
- `ice-dam-removal.astro`
- `index.astro`
- `lancaster-oh.astro`
- `lewis-center-oh.astro`
- `metal-roofing-dublin-oh.astro`
- `middletown-oh.astro`
- `migration-review.astro`
- `newark-oh.astro`
- `powell-oh.astro`
- `products.astro`
- `robots.txt.ts`
- `roof-calculator.astro`
- `roof-repair-dublin-oh.astro`
- `roof-replacement-dublin-oh.astro`
- `roofing-calculator.astro`
- `roofing-contractor-dublin-oh.astro`
- `roofing.astro`
- `siding.astro`
- `storm-damage-roof-repair-dublin-oh.astro`
- `storm-damage.astro`
- `upper-arlington-oh.astro`
- `westerville-oh.astro`
- `windows.astro`
- `worthington-oh.astro`
- `zanesville-oh.astro`
- `[...path].astro`

## Subdirectories

- `cincinnati-oh/` - read its _ai-context.md.
- `cleveland-oh/` - read its _ai-context.md.
- `columbus-oh/` - read its _ai-context.md.
- `commercial-roofing/` - read its _ai-context.md.
- `dayton-oh/` - read its _ai-context.md.
- `decks/` - read its _ai-context.md.
- `delaware-oh/` - read its _ai-context.md.
- `gutters/` - read its _ai-context.md.
- `products/` - read its _ai-context.md.
- `roofing/` - read its _ai-context.md.
- `siding/` - read its _ai-context.md.
- `storm-damage/` - read its _ai-context.md.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

The homepage features StormDamageCallout directly after HomeTrust, linking the central storm hub and damage-specific resources.

reviews.astro is the native /reviews/ hub. The legacy catchall excludes only this hub; every protected /reviews/<id>/ path remains available. It composes sourced review cards, topic filters, third-party profile links, project photos, credentials, honest review submission, FAQs and disconnected quote forms.

Homepage owns the full paged gallery at #projects, with topic deep links such as #projects-siding. The legacy catchall excludes /gallery/; unrelated legacy content is retained. Astro redirects /gallery/ to /#projects as explicitly requested by the client; Cloudways uses the matching 301 rewrite.


blog/[hub].astro renders the native Categories and Topics hubs; the legacy catchall excludes those two paths. Both are added to the route manifest with authored provenance, without altering original protected URLs.


blog/index.astro now serves the native main blog. tag/[tag].astro serves all ten original topic archives with shared components. These and the two blog hubs are excluded from the legacy catchall; all original article/tag/category URLs remain protected.


The legacy catchall requests the shared BlogNavigation aside for Article records whose source lacks an existing rk-blog-sidebar. Native resource pages use the same aside through BlogLayout.


category/[category].astro and tag/[tag].astro now render all nine category and ten topic collection hubs through BlogArchive. The legacy catchall excludes all of these paths and renders legacy Article HTML with its original navigation replaced by the shared aside.


The legacy catchall emits one content page per blog-routes.json canonical, from its original article collection record. Old article aliases are emitted only by the configured Astro redirects. Additional blog-canonical manifest records intentionally reference the same original source file; no duplicate content records are created.


contact-us.astro owns the preserved /contact-us/ URL and excludes it from the legacy catchall. Shared native components provide hero/breadcrumbs/form/header/footer. Phone/address come from site.json and calendar from home.hero.bookingUrl. Original imported contact HTML remains migration evidence. No unverified hours or email are added.


about-us.astro owns the preserved About URL with shared native components. It uses existing original house and community photos, official credential links and existing sourced reviews. It adds no staff biographies or sponsorship claims.


past-projects.astro owns the preserved Past Projects URL and is excluded from the legacy catchall. Its gallery uses galleryFor(all), id projects, the same responsive two-row group paging, filters, mobile swipe and lightbox as the homepage. Services link to existing main pages; quote delivery stays disabled.


faq.astro owns the preserved /faq/ URL and is excluded from the catchall. Shared ServiceExplorer supplies desktop keyboard tabs and a mobile topic select; FAQSection supplies all native details/summary accordions. All seven groups remain readable without JavaScript, with valid topic labels and deep links.


offers/gaf-system-plus.astro owns the protected warranty route; the catchall excludes it. GAF source URLs and five FAQ answers are in warranty-page.ts. Shared native components provide hero, breadcrumbs, benefits, media, documents, FAQ and quote form.


customer-service.astro owns the protected Customer Service URL and is excluded from the catchall. It reuses PageHero, Breadcrumbs, ContentSection, ArticleChecklist, ResourceLinks, FAQSection and QuoteSection. Phone/address come from site.json; the active-leak FAQ reuses reviewed roof repair content. Original Markdown remains migration evidence.


our-careers.astro owns the preserved Careers URL and is excluded from the catchall. It reuses PageHero, Breadcrumbs, ContentSection, ArticleChecklist and FAQSection. Recruiting inquiries go to the verified company phone. QuoteExperience is modal-only here; header quote links fall back to /contact-us/#quote-form without JavaScript.

service-areas.astro owns the native coverage directory, shared map, searchable cards and recursive local-service disclosures; excluded from the catchall.

All /offers/ routes are excluded from the catchall. offers/index.astro is the native grouped hub; offers/[offer].astro renders nine authored offer pages, while gaf-system-plus.astro retains the existing detailed warranty page.

robots.txt.ts advertises the production /sitemap.xml while preserving Disallow: / for review. The sitemap is generated into dist at build completion, not maintained as a static source list.
