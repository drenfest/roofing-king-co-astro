# src/pages: route ownership

This directory controls Astro file-based routes. Read the root handbook, src/layouts/ai-context.md and the actual entry point before changing content. Every map here is named _ai-context.md; an unprefixed Markdown map can become an unintended public route. Never create ai-context.md anywhere under src/pages.

## Native families

- index.astro composes the homepage with DocumentLayout and shared Home/gallery/comparison/quote components.
- Explicit service and location .astro files resolve retained content metadata and service-editorial.json, then render PolishedServicePage. /roofing/ uses ServiceLanding and roofing-landing.json instead.
- roofing/gaf/types.astro retains ServicePage and service-pages.json for the catalog. It is not the template for all new product pages.
- products.astro and products/[...product].astro resolve product-pillar.json and product-details.json. Every product route also needs a content metadata record and manifest entry.
- blog/ routes, category/ and tag/ routes resolve structured articles and hub/archive data through the existing layouts. Preserve category-first article URLs and explicit old-path redirects; do not recreate timestamp segments.
- Dedicated company, reviews, service-areas, offers and warranty routes use native compositions/data helpers. Reuse their existing branded components.
- [...path].astro is the residual legacy renderer. Its exclusion list must stay synchronized with native owners so new pages do not collide, and native pages must not inherit its WordPress compatibility bundle.

## Adding or moving content

A new route needs valid src/content/pages/**/index.md metadata, a migration/route-manifest.json record, an actual renderer/data entry, intentional canonical/breadcrumb/navigation choices and correct parent/child links. Extend the appropriate native family; do not duplicate a full service page per city just to create links. A preserved URL cannot be renamed because its folder, navigation parent or product grouping changes.

Changing an existing native page usually means editing its referenced data, not the retained Markdown body. Changing a legacy body can still affect rendering. Each content-leaf map identifies the difference. Keep approved aliases/redirects and query/hash behavior intact.

Internal review/error routes remain outside canonical public schema/sitemap output. robots.txt.ts allows tool crawling; document shells and HTTP headers retain review noindex/nofollow. Changing documentation does not authorize indexing, DNS or form delivery.

<!-- route-imports:start -->
## Actual route dependencies

- `404.astro`: `src/layouts/SiteLayout.astro`.
- `[...path].astro`: `src/layouts/RetainedResourcePage.astro`, `src/data/retained-pages.json`, `src/data/retained-page-types`, `src/layouts/SiteLayout.astro`, `src/components/RoofrEstimator.svelte`, `src/data/roofr.json`, `src/data/service-pages.json`, `src/data/product-pillar.json`.
- `about-us.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/MediaContentRow.astro`, `src/components/CredentialsSection.astro`, `src/components/CardSection.astro`.
- `akron-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `athens-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `attic-insulation.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `aurora-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `beavercreek-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `centerville-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `cincinnati-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `cleveland-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `columbus-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `commercial-roofing.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `commercial-siding.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `contact-us.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/QuoteSection.astro`, `src/components/ServiceIcon.astro`, `src/data/site.json`.
- `cost-of-a-new-roof.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `customer-service.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/ContentSection.astro`, `src/components/ArticleChecklist.astro`, `src/components/ResourceLinks.astro`.
- `dayton-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `dayton-roofers.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `decks.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `delaware-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `emergency-roof-repair-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `exterior-painting.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `faq.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/ServiceExplorer.svelte`, `src/components/FAQSection.astro`, `src/components/ResourceLinks.astro`.
- `gaf-roofing-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `gahanna-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `grove-city-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `gutter-installation-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `gutters.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `hail-damage-roof-repair-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `hamilton-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `hilliard-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `ice-dam-removal.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `index.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/HomeHero.astro`, `src/components/StormDamageCallout.astro`, `src/components/HomeTrust.astro`, `src/components/HomeServices.astro`, `src/components/HomeCardSection.astro`.
- `lancaster-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `lewis-center-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `metal-roofing-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `middletown-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `migration-review.astro`: `src/components/RouteReview.svelte`, `src/layouts/SiteLayout.astro`.
- `newark-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `our-careers.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/ContentSection.astro`, `src/components/ArticleChecklist.astro`, `src/components/FAQSection.astro`.
- `past-projects.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/ProjectGallery.svelte`, `src/components/ResourceLinks.astro`, `src/components/QuoteSection.astro`.
- `powell-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `products.astro`: `src/components/ProductHubPage.astro`, `src/data/product-pillar.json`.
- `reviews.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/LandingHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/ReviewCard.astro`, `src/components/ReviewCollection.svelte`, `src/components/CredentialsSection.astro`.
- `roof-calculator.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `roof-repair-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `roof-replacement-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `roofing-calculator.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `roofing-contractor-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `roofing.astro`: `src/layouts/ServiceLanding.astro`, `src/data/service-pages.json`, `src/data/roofing-landing.json`, `src/data/section-types`.
- `service-areas.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/Breadcrumbs.astro`, `src/components/PageHero.astro`, `src/components/ServiceAreaMap.astro`, `src/components/LocationServiceLinks.astro`, `src/components/QuoteSection.astro`.
- `siding.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `storm-damage-roof-repair-dublin-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `storm-damage.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `upper-arlington-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `westerville-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `windows.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `worthington-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `zanesville-oh.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.

This index is derived from current imports. Resolve the entry point before editing data; a physical directory alone does not define the content owner.
<!-- route-imports:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [404.astro](404.astro)
- [[...path].astro](%5B...path%5D.astro)
- [about-us.astro](about-us.astro)
- [akron-oh.astro](akron-oh.astro)
- [athens-oh.astro](athens-oh.astro)
- [attic-insulation.astro](attic-insulation.astro)
- [aurora-oh.astro](aurora-oh.astro)
- [beavercreek-oh.astro](beavercreek-oh.astro)
- [centerville-oh.astro](centerville-oh.astro)
- [cincinnati-oh.astro](cincinnati-oh.astro)
- [cleveland-oh.astro](cleveland-oh.astro)
- [columbus-oh.astro](columbus-oh.astro)
- [commercial-roofing.astro](commercial-roofing.astro)
- [commercial-siding.astro](commercial-siding.astro)
- [contact-us.astro](contact-us.astro)
- [cost-of-a-new-roof.astro](cost-of-a-new-roof.astro)
- [customer-service.astro](customer-service.astro)
- [dayton-oh.astro](dayton-oh.astro)
- [dayton-roofers.astro](dayton-roofers.astro)
- [decks.astro](decks.astro)
- [delaware-oh.astro](delaware-oh.astro)
- [dublin-oh.astro](dublin-oh.astro)
- [emergency-roof-repair-dublin-oh.astro](emergency-roof-repair-dublin-oh.astro)
- [exterior-painting.astro](exterior-painting.astro)
- [faq.astro](faq.astro)
- [gaf-roofing-dublin-oh.astro](gaf-roofing-dublin-oh.astro)
- [gahanna-oh.astro](gahanna-oh.astro)
- [grove-city-oh.astro](grove-city-oh.astro)
- [gutter-installation-dublin-oh.astro](gutter-installation-dublin-oh.astro)
- [gutters.astro](gutters.astro)
- [hail-damage-roof-repair-dublin-oh.astro](hail-damage-roof-repair-dublin-oh.astro)
- [hamilton-oh.astro](hamilton-oh.astro)
- [hilliard-oh.astro](hilliard-oh.astro)
- [ice-dam-removal.astro](ice-dam-removal.astro)
- [index.astro](index.astro)
- [lancaster-oh.astro](lancaster-oh.astro)
- [lewis-center-oh.astro](lewis-center-oh.astro)
- [metal-roofing-dublin-oh.astro](metal-roofing-dublin-oh.astro)
- [middletown-oh.astro](middletown-oh.astro)
- [migration-review.astro](migration-review.astro)
- [newark-oh.astro](newark-oh.astro)
- [our-careers.astro](our-careers.astro)
- [past-projects.astro](past-projects.astro)
- [powell-oh.astro](powell-oh.astro)
- [products.astro](products.astro)
- [reviews.astro](reviews.astro)
- [robots.txt.ts](robots.txt.ts)
- [roof-calculator.astro](roof-calculator.astro)
- [roof-repair-dublin-oh.astro](roof-repair-dublin-oh.astro)
- [roof-replacement-dublin-oh.astro](roof-replacement-dublin-oh.astro)
- [roofing-calculator.astro](roofing-calculator.astro)
- [roofing-contractor-dublin-oh.astro](roofing-contractor-dublin-oh.astro)
- [roofing.astro](roofing.astro)
- [service-areas.astro](service-areas.astro)
- [siding.astro](siding.astro)
- [storm-damage-roof-repair-dublin-oh.astro](storm-damage-roof-repair-dublin-oh.astro)
- [storm-damage.astro](storm-damage.astro)
- [upper-arlington-oh.astro](upper-arlington-oh.astro)
- [westerville-oh.astro](westerville-oh.astro)
- [windows.astro](windows.astro)
- [worthington-oh.astro](worthington-oh.astro)
- [zanesville-oh.astro](zanesville-oh.astro)

### Child directories

- [blog/](blog/_ai-context.md)
- [category/](category/_ai-context.md)
- [cincinnati-oh/](cincinnati-oh/_ai-context.md)
- [cleveland-oh/](cleveland-oh/_ai-context.md)
- [columbus-oh/](columbus-oh/_ai-context.md)
- [commercial-roofing/](commercial-roofing/_ai-context.md)
- [dayton-oh/](dayton-oh/_ai-context.md)
- [decks/](decks/_ai-context.md)
- [delaware-oh/](delaware-oh/_ai-context.md)
- [gutters/](gutters/_ai-context.md)
- [offers/](offers/_ai-context.md)
- [products/](products/_ai-context.md)
- [roofing/](roofing/_ai-context.md)
- [siding/](siding/_ai-context.md)
- [storm-damage/](storm-damage/_ai-context.md)
- [tag/](tag/_ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
