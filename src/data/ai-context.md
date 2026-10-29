# src/data

service-hierarchy.ts checks the preserved route manifest for direct child URLs; use ServicePaths only on parent pages and ServiceArticle on leaves. service-families.json contains 39 authored service briefs. service-editorial.json is the committed per-route composition for 84 service/location/cost/calculator URLs; /roofing/ remains the approved independent reference in roofing-landing.json. Generate explicit routes and editorial data through scripts/author-service-landings.mjs after deliberately editing its route mapping, city context or the family briefs. Each route selects its own metadata, child links, topics, relevant brand IDs, curated images, estimate items and FAQs. Do not infer project locations or label stock/site imagery as a verified local job. Old source HTML and service-pages.json remain migration evidence; only the GAF catalog continues using its migrated service record. service-opening.ts remains a transitional adapter for that legacy architecture. media.ts merges local responsive image dimensions. Business identity lives in site.json, verified reviews in featured-reviews.json, Roofr public configuration in roofr.json. Product records and hierarchy remain separate from local service pages. Credentials, product availability, warranty terms and final production release need client verification; custom form delivery stays disabled.

## Files

- `brand-library.json`
- `brand-pages.json`
- `featured-reviews.json`
- `home-media.json`
- `home.json`
- `imported-shell.json`
- `media.ts`
- `navigation.json`
- `page-structure.ts`
- `product-catalog.json`
- `product-companions.json`
- `product-details.json`
- `product-energy.json`
- `product-explanations.ts`
- `product-pillar.json`
- `product-types.ts`
- `review-platforms.json`
- `roofing-landing.json`
- `roofr.json`
- `section-types.ts`
- `service-editorial.json`
- `service-families.json`
- `service-hierarchy.ts`
- `service-media.json`
- `service-opening.ts`
- `service-pages.json`
- `site-structure.json`
- `site.json`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## Full service copy

service-copy.json contains the 83 PDF-derived page records: source IDs/pages/hash, rich lead, content bands, closing copy, internal links and complete expected text. service-editorial.json supplies metadata, hero, parent/leaf openings, brands and FAQs. /roofing/ stays in roofing-landing.json. Rich paragraphs use section-types.ts RichNode, including inline anchors. service-media.json includes responsive variants for nine generated illustrations. Regenerate deliberately with scripts/apply-service-pdf.mjs; ordinary builds do not require the PDF or Python. Original copy and adaptations remain in migration evidence.

service-overrides.json stores explicit client-directed revisions after the PDF transfer, with dated primary sources, complete page fields and independent expected content blocks. The Master Elite route now leads with homeowner benefits and verified GAF warranty choices. These overrides are reapplied by apply-service-pdf.mjs and must survive regeneration.

The homepage inspection heading uses roof and siding (client correction); the verified booking URL retains its existing Calendly event slug.

Storm Damage appears in Services directly below Commercial Roofing, with hail, wind, documentation and commercial children; retain these destinations when editing menus. The homepage lists storm damage second and mentions restoration in the hero.

reviews-page.json contains the independent review profile destinations, topic mapping and three additional short BBB/Birdeye excerpts verified October 20, 2026. Existing featured-reviews.json remains the three-card sitewide selection. Keep exact excerpts, source provenance and dates; never infer stars or combine platform totals. No self-serving review/aggregate schema is generated.

roofing-heroes.json maps 41 roofing-related routes to individual illustrative generated hero images. roofing-hero-media.json supplies responsive dimensions/srcsets via media.ts. These presentation maps override source hero imagery without rewriting service-editorial.json or its PDF content. Rebuild assets with scripts/optimize-roofing-heroes.mjs after generation; provenance/prompts live in migration/roofing-hero-images.json.

Blog is a direct child of About, with its complete Categories and Topics branches. The redundant Blog leaf under Resources was consolidated into that branch; all previous destination URLs remain available.

Homepage hero titleEmphasis identifies the italic final phrase; note supplies the short helper line. Existing booking URL, review count and rating are retained.

home.json services.items image records select existing site photography for all eight homepage service cards, including visibly damaged shingles for storm damage. These are illustrative service images, not claims of specific completed jobs.

The homepage gallery has titleEmphasis, photo category and caption fields. Captions/alt text describe inspected source images without invented job locations or damage causes. All ten original images remain; ordering leads with exterior, overhead and preparation details.

Batch 01 client-directed revisions are persisted in service-overrides.json and applied to service-editorial.json/service-copy.json. reviewPresentation selects route-specific trust/product/finance titles and a batch marker; copy.budgetSectionId explicitly selects the estimate section. Optional section eyebrow and card IDs preserve topic context and old section anchors while grouping detail under H3 headings.


navigation-images.json is a compact menu-only image registry extracted from existing optimized service photos, illustrative roofing heroes and genuine GAF color samples. MenuPreview resolves exact route images first, then service/category fallbacks. Keep responsive WebP sources, intrinsic dimensions and illustrative labels; do not import full editorial or product records into the header client bundle.


product-presentation.ts resolves category imagery, explicit material concepts and genuine default-color shingle samples, with contextual installation destinations. product-collection-media.json records five optimized material scenes at 480/800/1200px. The generated scenes are visibly labeled illustrative and never replace manufacturer samples or logos. Product-pillar headings now name the actual material or manufacturer; comparison copy and destinations are preserved.


service-hero.ts resolves a tab destination hero using the same priority as service layouts: roofing-heroes.json first, then editorial hero imagery, then the retained legacy service record. Missing destinations fail the build instead of silently displaying an unrelated image. No image or content records are copied into the Svelte tab island.


service-heroes.json and service-hero-media.json add 43 individual illustrative service heroes for all remaining non-roofing/location pages. media.ts merges these responsive assets alongside the existing 41 roofing heroes. The complete native service inventory now has a distinct hero per route; service-hero.ts and PolishedServicePage use both maps with the roofing map taking precedence. Prompts and asset budgets live in migration/service-hero-images.json.


navigation-photo-selections.json curates topic/product/brand source choices; native service destinations resolve their actual custom hero automatically when building the menu atlas. navigation-images.json records the complete 121-image provenance/fingerprints. navigation-atlas.json is the small runtime cell map and content-hashed WebP URL. Repeated links to the same destination share its cell; different destinations cannot share picture content.

Homepage card headings use sentence case, preserving Ohio/Dublin names and supplied offer terms. The unused process data is retained as source evidence; its numbered block is no longer rendered.

product-pillar.json guidance=siding selects SidingProductGuide for /products/siding/. Other hubs retain the shared guidance grid. The siding hub’s redundant generic secondary cards are removed.

gutter-detail-media.json registers responsive 480/800/1200px WebP card photos in media.ts. Optional ServiceCopySection card image/caption fields enrich the gutter systems section without changing its original paragraphs, headings or links. Keep the card media in service-copy.json and its matching service-overrides.json source.

service-section-galleries.json is a page-and-section-specific presentation map for three-photo media galleries. Only the gutters example is populated. Leave service copy unchanged and add further entries during each ten-page review, following migration/service-section-photo-review.json.

The ice-dam roofing hero now points to version 2, showing a roof-level ice ridge and backed-up meltwater. Its four responsive variants retain the roofing hero map contract. The menu atlas is rebuilt whenever a mapped hero changes.

The ice-dam opening uses illustration="ice-dam" and three mechanism-specific H3 topics. Its client-directed copy and source-check expectations persist in service-overrides.json, with university extension and NWS evidence.

coverage-map.json stores a simplified Ohio/city SVG overview, the explicit 25-community inventory and configurable tile URL. Detailed boundaries live in public/maps/ohio-service-areas.geojson. Do not invent service coverage from nearby municipal polygons; Lewis Center is a point because it is unincorporated.

project-gallery.json is the canonical gallery library: inspected existing-site photographs with corrected topics, contextual captions and no invented job/customer/damage claims. gallery-media.json contains optimized variants; project-gallery.ts resolves each native service family. Legacy source galleries remain migration evidence. Low-resolution 270px thumbnails are excluded. The old home.json gallery remains historical input, not runtime gallery data.


location-profiles.json supplies sourced individual context for the 24 full-service location hubs. scripts/polish-location-hubs.mjs persists the authored hub text and city-specific headings in editorial/copy/overrides. Prefer existing local descendants and Dublin aliases, then main service URLs; no new city/service pages. ServicePathsData.scrollableTabs enables the long desktop list. featured-articles.json records existing published article destinations, concise summaries, topics/cities and optimized thumbnails; featured-articles.ts selects relevant posts by service, favoring matching cities for location hubs. Empty blog topics are never filled with unrelated posts.


blog-hubs.json contains the two curated resource indexes, sourced from the existing nine category and ten topic archives. Counts and article links come from published archives; thumbnails reuse optimized article assets. Rebuild explicitly with scripts/build-blog-hubs.mjs after taxonomy changes. Navigation Categories/Topics now point to /blog/categories/ and /blog/topics/ and have distinct atlas photos.


blog-index.json includes all 21 unique existing article destinations, concise excerpts, published dates where present and optimized thumbnail records. blog-archives.json maps all ten preserved /tag/* archives to their actual article membership. article-media.json registers those thumbnails for responsive HomeImage rendering. build-blog-hubs.mjs refreshes these authored indexes; no new articles or publication dates are invented.


blog-archives.json now contains all 19 category/topic collection hubs with kind identifying the appropriate parent breadcrumb/sidebar branch. No category/tag URL or article membership changed.


Blog is now a top-level primary menu item, before About, per the latest client request. Categories and Topics remain its children with all archive destinations. It is removed from About. The blog authoring/check scripts resolve the top-level branch; the existing menu atlas remains valid because destination URLs did not change.


blog-routes.json persists one category/tag canonical and original source file per article; blog-url-map.json maps every retired alias directly to it. First assigned category wins, otherwise first assigned tag in original exported order. featured articles, hub/index cards and authored service links use canonical paths. One captured article has no assigned taxonomy and retains its already-clean URL. Normal builds do not infer or reorder terms.


All original assigned article topics now have collection hubs, including Insurance Claims and Gutter Guards. blog-hubs.json, blog-archives.json and navigation include these two previously unexposed assignments; original article category/tag assignments are unchanged. BlogNavigation resolves the canonical article from blog-routes.json to show every assigned category/tag, not just its primary canonical term.


blog-articles.json stores 21 full native articles, source metadata, original first-image heroes, semantic checklist groups and FAQ data. blog-article-media.json registers optimized responsive original images with no enlargement. blog-article-types.ts defines typed prose, checklist and image blocks. These files are explicitly authored by build-blog-articles.mjs, not normal builds.


blog-index and archive items now persist source author alongside original publication date. Unknown author/date remain null; collection cards have no fabricated publication metadata.


company-media.json registers original About roof and existing community-event photos as responsive WebP variants. media.ts includes these records; no enlargement or generated team portrait is used.


faq-page.ts defines seven topic groups and 28 questions. Most answers are referenced from service-editorial by exact question text, with a build failure if a selected source disappears; only clearer question labels are overridden. Four getting-started answers use the current service coverage, booking URL and contact page. Existing source answers, links and coverage limitations remain intact.


navigation.json is deduplicated globally by destination (124 distinct entries). About is flattened; /about-us/ remains the top-level About link. Commercial Storm Damage remains under Commercial Roofing. Existing atlas coverage is unchanged because no unique destination was removed.


warranty-page.ts holds the official GAF comparison/sample document URLs, checkedAt date and five System Plus FAQs. Manufacturing-defect remedies are distinct from installation-error coverage. The qualifying 50-year period includes ownership/building restrictions; registration, transfer and exclusions follow the official sample.


company-media.json now also registers responsive WebP variants of the existing original careers team photo. The original 750x500 image is never enlarged. No generated staff imagery is used.

service-area-directory.ts derives local service descendants from the preserved route manifest and editorial labels, including the existing flat Dublin service URLs. Mansfield is explicitly identified as having no location hub.

offer-pages.ts holds distinct financing, warranty and seasonal content plus official source links. Published repayment lengths are discussion options rather than guaranteed approvals or current rate quotes. The client confirmed the 47-dollar promotion; visitors call for APR, financed amount, fees, repayment period and eligibility details. No missing loan values are invented. Existing gallery photos use the responsive media registry. home.json offer cards are aligned with the new payment planning copy.

The Offers branch is labeled Offers & Financing and appears first in the About dropdown on both desktop and mobile. Footer navigation uses the same label; /offers/ and its child destinations are unchanged.


service-section-galleries.json maps the ten Batch 01 media sections to three photo/topic pairs each. service-review-media.json registers 480/800/1200 WebP variants from public/media/service-review-01 plus reused siding-guide assets. Changes to reviewed copy are mirrored in service-overrides.json for authoring stability.


Batch 02 adds ten roofing routes to reviewed presentation and service-section-galleries. The two calculators have distinct start/result versus comparison purposes. All reviewed source paragraphs and links remain; editorial overrides persist title/hero/heading/FAQ/quote changes and explicit estimate IDs. service-review-media registers twelve new illustrative detail scenes plus a genuine optimized GAF Timberline HDZ sample.


Batch 03 adds ten commercial/storm routes to reviewed presentation and section galleries. Every original section paragraph and contextual link remains. Related drainage/assembly and documentation paragraphs are grouped under H3/H4 while old section IDs remain anchors. Commercial presentation sets materialsTitle explicitly; brandless pages do not invent manufacturer relationships. Fourteen new illustrative detail scenes have 42 optimized responsive derivatives in service-review-media.


Batch 04 adds ten reviewed routes with three photo/topic rows apiece. Original section paragraphs remain, with ice safety/window-style content grouped beneath opening headings and attic moisture beneath the estimate. service-review-media includes fourteen supplied-photo sources and two attic illustrations. roofing-heroes and roofing-hero-media register one client-photo replacement hero with generated:false and explicit source provenance. Prior commercial opening changes are photos/captions only.


Batch 05 reviews ten existing Cincinnati/Cleveland/Dayton routes, including Cleveland roofing/cost-of-replacement. Hubs retain eleven-service selectors and local profiles; planning paragraphs move into estimate subtopics with original IDs. City-service pages have distinct connection, winter-history, documentation and estimate purposes. service-review-media registers nine source-backed landscape photo derivatives and three derivatives of the existing ice illustration. All source paragraphs and contextual links remain; other page data is unchanged.


project-gallery.json now contains 103 photos, including all 77 unique supplied photographs, with kind/sourceLabel, subject tags, sourceIds, contain and sort metadata. gallery-media.json registers 265 new WebP variants. project-gallery.ts selects topic-matched service photos, uses a separate painting topic, excludes company-only/unrelated references from local galleries and exposes actual derivative display dimensions. Private Drive IDs stay in server-side authoring data; browser props include captions/tags/type, not sourceIds or original files.
