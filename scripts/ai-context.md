# scripts

author-service-landings.mjs writes explicit native routes and service-editorial.json from the authored family briefs and reviewed route/city mapping. It runs only as an explicit authoring step, never during a normal build. Original source HTML remains evidence. optimize-service-media.mjs includes authored editorial images, caches existing variants and preserves earlier dimensions. build-service-review.mjs requires successful desktop/mobile browser results for every service URL and creates the noindex review index plus migration/service-polish-review.json. check-services.mjs preserves reference/catalog checks and verifies the complete 84-page authored composition, route links, source badges, disabled forms and image dimensions. Normal builds require no source database or network access. Run npm run verify before pushing.

## Files

- `audit-component-reuse.mjs`
- `author-service-landings.mjs`
- `build-service-review.mjs`
- `check-built-routes.mjs`
- `check-content.mjs`
- `check-homepage.mjs`
- `check-products.mjs`
- `check-services.mjs`
- `component-audit-template.html`
- `import-wordpress.mjs`
- `optimize-home-media.mjs`
- `optimize-product-media.mjs`
- `optimize-service-media.mjs`
- `sync-product-navigation.mjs`
- `thewebguy-logo.txt`
- `transfer-service-content.mjs`
- `write-context-maps.mjs`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## PDF transfer and review tools

extract-service-pdf.py extracts the 83 publishable entries with PDF page/font evidence; editorial notes are retained separately. apply-service-pdf.mjs explicitly adapts rejected terminology and reconciles identity, then writes service-copy.json, service-editorial.json and the audit. author-service-landings.mjs reapplies that overlay after family defaults. check-service-pdf.mjs independently compares every original block and link destination against built HTML using the recorded changes; npm run verify includes it. review-service-pages.mjs optionally uses Playwright (PLAYWRIGHT_MODULE and CHROME_PATH environment variables) to inspect all 84 pages at desktop/mobile, test tabs/FAQ, decode images and record screenshots under tmp/service-review. build-service-review.mjs creates the notes/export review index from those results. No authoring/network/PDF tooling runs during an ordinary build.

apply-service-pdf.mjs now applies service-overrides.json after source normalization. check-service-pdf.mjs checks the complete reviewed override text for those routes and original PDF text for the others, preserving original contextual destinations. Never mutate the original source extraction to hide a client-directed content revision.

deploy-cloudways.sh validates the target app marker, stages static output in private_html/astro-deploy, preserves old public files privately and restores them on a file-switch failure. check-cloudways-review.mjs checks public review URLs, noindex, static output and actual 404 status.

optimize-roofing-heroes.mjs copies original generated PNGs into the project output directory, creates four WebP sizes per roofing hero, enforces a 300KB per-variant maximum, writes hero/media data and records byte counts in the provenance manifest. It is an explicit asset-preparation task, never part of ordinary builds.

check-roofing-heroes.mjs runs in npm run verify to protect all 41 unique hero mappings, responsive/eager markup, public image budgets, illustrative labels and the noindex review gallery. It reads only committed optimized assets and never requires original PNGs or generation credentials.

build-roofing-hero-review.mjs writes the noindex public gallery from the hero manifest and recomputes size totals; visual inspection status is recorded separately and must never be inferred from generation success.

check-service-reviews.mjs runs in verify for the explicit ten-page batches. It checks real heading progression, fewer top-level headings than the captured prior outlines, subordinate manufacturer headings, deliberate estimate placement and valid accessible heading targets. Future review batches register through migration/service-review-batch-NN.json.


optimize-product-collections.mjs prepares five generated material scenes into three responsive WebP sizes and writes product-collection-media.json. Source PNGs remain outside public under output/imagegen/product-collections. Ordinary builds need only committed optimized assets. check-products.mjs also protects all native product heroes, unique collection photos, dimensions, image budgets, source copy, links and heading levels.


optimize-service-heroes.mjs prepares the 43 supplementary custom heroes, caps full size at 1600px, exports four responsive WebP sizes with an enforced 300KB maximum, and keeps source PNGs under output/imagegen/service-heroes. --complete requires every planned source. check-services.mjs protects all 84 unique custom heroes and checks every ServicePaths preview against the destination page hero, position, lazy loading and illustrative label.


build-menu-atlas.mjs resolves every unique navigation URL, rejects missing or duplicate normalized picture content, prepares 192px cells and exports one content-hashed WebP atlas within its transfer budget. It writes both full image provenance and the compact runtime cell map. Normal builds use committed output and never require source PNGs or generation.

build-coverage-map.mjs explicitly refreshes Census TIGERweb city/state geometry and the overview from the reviewed community inventory. It writes provenance to migration/coverage-map-sources.json. Ordinary builds work offline and never query mapping services.

optimize-gallery.mjs creates 480/800/up-to-1280px WebP variants without enlarging original photos. check-gallery.mjs protects photo quality/budgets, all service-family selections, four-photo SSR groups, menu removal and the single approved redirect. This check is included in npm run verify.


polish-location-hubs.mjs authors the 24 comprehensive location hubs from location-profiles.json, preserving all existing local descendants and using global service fallbacks. check-location-hubs.mjs verifies city headings, service priority, links and scrolling. build-featured-articles.mjs indexes curated existing published posts and writes 400/720px WebP thumbnails without enlargement; normal builds do not run it. check-featured-articles.mjs checks route destinations, thumbnail budgets and coverage gaps. Both checks are part of verify.


html-attributes.mjs provides the server-only rendered-HTML completion helper and required-html-attributes Astro build integration. It preserves existing alt/title values, supplies the inspected legacy logo alternative and derives missing link titles from labels/content/destination. Unknown images without alt fail the build. src/middleware.ts also runs this helper during dev/prerender; the final build pass covers copied public HTML. check-html-attributes.mjs audits every final HTML file and tests preservation of decorative alt and explicit titles. Keep it in verify.


build-blog-hubs.mjs explicitly builds the two resource indexes from existing published taxonomy archives, writes navigation hub destinations and optimizes any remaining article thumbnail. Normal builds read committed blog-hubs.json. check-blog-hubs.mjs verifies all 19 collections, counts, source articles, menu links and attributes; it runs in verify. Refresh the menu atlas after adding or changing menu destinations.


build-blog-hubs.mjs also writes the deduplicated 21-post blog index, all ten topic archives and article-media responsive metadata. It selects distinct relevant thumbnails for the collections within each hub. check-blog-hubs verifies all three resource indexes and ten tag archives reuse existing components and preserve published membership.


check-blog-hubs.mjs now checks all nine category and ten topic hubs and every indexed article’s aside links to All articles, Categories and Topics. Article source sidebars remain unchanged in Markdown evidence; native rendering replaces them with shared navigation.


Blog is now a top-level primary menu item, before About, per the latest client request. Categories and Topics remain its children with all archive destinations. It is removed from About. The blog authoring/check scripts resolve the top-level branch; the existing menu atlas remains valid because destination URLs did not change.


migrate-blog-urls.mjs explicitly authors the client-approved blog canonical registry, source canonical metadata, additional manifest targets, direct redirects and Apache rules from original WordPress categories/tags. It retains source bodies and original paths as evidence. blog-url-policy.mjs defines deterministic category-first/tag-fallback behavior. check-blog-urls.mjs verifies every article, redirect, canonical/OG URL, required sidebar and rendered internal link. check-content permits blog-canonical manifest entries to reference their existing source file when its canonicalPath matches. PDF link checks follow approved blog canonical changes without editing the source PDF evidence.


build-blog-hubs.mjs resolves archived post membership by slug even when the archive already links to a new canonical article URL. It now exposes nine category and twelve topic collections. check-blog-urls checks that article-specific aside chips exactly match original category/tag arrays and that every linked collection contains that article; no empty taxonomy sections are rendered.


build-blog-articles.mjs is explicit authoring: compiles 21 posts, recovers original list boundaries/order from .post-content, retains reviewed heading levels and approved wording, drops stray code fences, optimizes original images, promotes first image to hero, and writes component/source audit. check-native-articles.mjs verifies source text/links, grouped lists, native components, shared FAQ count, headings and responsive images; included in verify.


build-blog-hubs extracts author from original .rk-blog-meta byline and persists date/author on article index/archive records. check-blog-hubs verifies filter controls and exact byline/time metadata on every article card.


optimize-company-media.mjs explicitly authors WebP variants of the original company photos and company-media.json. Normal builds only read these outputs.


check-gallery now includes /past-projects/ as a second complete-library gallery destination, preserving the shared SSR grouping, responsive image budgets and original /gallery/ redirect checks.


check-built-routes rejects duplicate destinations in primary navigation data and reintroduction of Our Story. Every unique prior menu destination is retained; desktop/mobile rendering is tested for unique visible content links.


check-warranty-page.mjs validates the System Plus route, qualified 50-year wording, explicit absence of installation-error coverage, official source links, semantic comparison, shared FAQs and disabled quote form. It is included in verify.


optimize-company-media.mjs now includes the original careers team photo alongside the About roof and community photos, with responsive variants at or below original dimensions.

check-offers-pages.mjs validates all eleven preserved offer paths, native presentation, hub membership, official manufacturer documents, qualified payment copy and disconnected forms. It also protects the native About-menu destinations and their removal of retired gallery links. check:offers is included in verify.

structured-data.mjs compiles one linked graph from actual rendered components in Astro middleware and astro:build:done. Authored facts are retained, entity IDs normalized, FAQs merged per page, lists/galleries/products/maps/navigation derived from visible or user-accessible content. check-structured-data.mjs audits every canonical output, references, serialization safety, article facts, exact FAQ text and idempotency. npm run check:schema is part of verify. It is independent of external validators/network at build time.

sitemap.mjs creates dist/sitemap.xml after the final HTML integrations, using actual self-canonical content pages and production site URLs. check-sitemap.mjs verifies exact membership, unique canonical URLs, exclusions and the robots declaration; no network or fabricated lastmod dates are required.

check-cloudways-review.mjs confirms release.json against the expected commit, then checks all canonical sitemap pages against local built headings, canonical URLs, linked graphs and component markers with six concurrent public requests. It also checks sitemap, essential assets, disabled forms, robots and 404 behavior.
