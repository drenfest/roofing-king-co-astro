# Component reuse audit

All protected source records and authored product-pillar routes are included. Product navigation and logical breadcrumbs now distinguish materials from services. Page-by-page visual approval remains pending. No live crawl, URL deletion, redirect or existing canonical change performed.

## What to build first

1. Extract shared homepage sections into prop-driven components.
2. The initial `/roofing/`, repair and replacement pilot is implemented; use it to extend the service family.
3. Roll that system through all service pages, then the two location variants.
4. Separate article/project/offer/review templates and rebuild listings.
5. Finish purpose-specific company pages, integrations and approved policies.

Route counts below are URLs, including aliases; they are not estimates of editorial work saved. Shared modules retain page-specific data and do not replace substantive copy.

## Families

| Family | URLs | Canonical targets |
| --- | ---: | ---: |
| Product hubs, guides and records | 16 | 16 |
| Homepage | 1 | 1 |
| Services | 33 | 33 |
| City landing pages | 24 | 24 |
| Service + city pages | 23 | 23 |
| Articles | 30 | 21 |
| Blog and taxonomy archives | 37 | 37 |
| Project detail pages | 15 | 15 |
| Gallery and project hubs | 2 | 2 |
| Offer detail pages | 10 | 10 |
| Offer hub | 1 | 1 |
| Review detail pages | 10 | 10 |
| Review hub | 1 | 1 |
| Contact and inspection | 3 | 2 |
| Tools | 4 | 4 |
| Company and special pages | 14 | 13 |
| Policies | 5 | 3 |

## Shared components

| Component | Observed source URLs | Recommended URLs | Work needed |
| --- | ---: | ---: | --- |
| SiteChrome / document shell | 229 | 229 | adapt — DocumentLayout.astro, SiteHeader.svelte, SiteFooter.astro, QuoteExperience.svelte |
| PageHero | 95 | 112 | reuse — PageHero.astro |
| TrustStrip | 95 | 96 | reuse — TrustStrip.astro |
| Breadcrumbs | 108 | 228 | reuse — Breadcrumbs.astro |
| BrandStrip | 86 | 86 | reuse — BrandStrip.astro |
| ContentSections / SplitSection | 85 | 155 | reuse — ContentSection.astro + RichContent.astro |
| ServiceGrid / ServiceCard | 9 | 33 | reuse — ContentSection.astro services variant |
| FeatureGrid / ProcessSteps | 15 | 15 | adapt — HomeWorkmanship.astro |
| OfferGrid / OfferCard | 52 | 52 | adapt — HomeCardSection.astro |
| ProjectGallery | 85 | 108 | reuse — ProjectGallery.svelte |
| BeforeAfter | 28 | 28 | reuse — BeforeAfter.svelte |
| CoverageSection | 90 | 98 | reuse — CoverageSection.astro |
| Testimonials / ReviewCard | 90 | 100 | adapt — HomeCardSection.astro |
| QuoteCTA / QuoteForm | 102 | 157 | reuse — QuoteSection.astro + QuoteExperience.svelte |
| FAQSection | 4 | 27 | reuse — FAQSection.astro |
| RelatedResources / ArticleCard | 65 | 66 | adapt — HomeCardSection.astro |
| DetailLayout primitives | 64 | 65 | new — Current shared blog wrapper |
| ArchiveListing / Pagination | 39 | 39 | new — Reconstructed archives and blog index |
| RoofrEstimator / ToolFrame | 2 | 2 | reuse — RoofrEstimator.svelte |
| LocationDirectory | 1 | 1 | new — Service areas index |
| Specialized company / policy blocks | 0 | 22 | new — Company, contact, policy, careers and events pages |
| ProductGrid | 0 | 1 | reuse — ProductGrid.astro + ProductOptions.svelte |

Counts indicate section evidence in preserved source, not completed native migrations or fresh live-site verification.

The audit found 35 non-article detail URLs using the blog wrapper. These need semantic template correction. Empty team/careers/tool bodies and the mixed service-area directory need editorial/data repair.

## Component boundaries

- `HomeTrust` → separate `TrustStrip` and `BrandStrip`.
- `HomeWorkmanship` → separate workmanship promo, process steps and coverage section.
- `HomeCardSection` → explicit offer/review/article sections over small card/grid primitives.
- `HomeHero` → `PageHero` with data/variant props; preserve the homepage hero appearance.
- `HomeImage` → general media/dimension pipeline, not a manifest limited to 28 homepage images.
- `SiteChrome` → native document/header/footer plus one quote-modal host, shared across families.
- `ProjectGallery`, `BeforeAfter`, `RoofrEstimator` → reuse existing Svelte behavior with page-specific props.
- FAQ/details, service grids, proof cards, maps and prose → Astro by default.
- Article, project, offer and review pages share layout primitives, not their meaning or metadata.

## Data and URL contract

Store page identity separately from rendering: permalink, canonicalPath, title, description, family, service/location IDs and ordered section data. Reference shared records by stable IDs; allow page-specific headings/copy and genuine local proof. Validate references, links, image sizes and required template fields. Collections should separate articles, projects, offers, reviews and locations so their templates cannot accidentally swap metadata.

Retain every inventoried route and the existing canonical preferences until a separate content/SEO decision. Alternate routes may render the same underlying record without redirects. Product navigation and breadcrumb placement are implemented; other family/placement labels remain recommendations. Do not add nofollow or deindex supporting pages just to prioritize primary service pages.

Quote delivery remains deferred, with Jared Lane confirmed as lead owner. Preserve disabled submission until the verified delivery path is built.

## Page-by-page decisions

### Product hubs, guides and records (16)

#### /roofing/gaf/types/

**GAF Shingles: Colors, Styles and Specifications** · wordpress · Native service components
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], PageHero [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed], ProductGrid [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 29 headings; 380 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing/types/

**Roofing Materials and Types** · wordpress · Native service components
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], PageHero [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 18 headings; 505 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /products/

**Exterior Building Products** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 6 headings; 91 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/

**Roofing Products and Materials** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 8 headings; 121 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /products/roofing/shingles/

**Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 6 headings; 98 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/timberline-hdz/

**Timberline HDZ Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 82 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/timberline-uhdz/

**Timberline UHDZ Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 56 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/timberline-ns/

**Timberline NS Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 50 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/timberline-as-ii/

**Timberline AS II Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 67 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/timberline-hdz-rs/

**Timberline HDZ RS Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 72 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/camelot-ii/

**Camelot II Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 44 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/woodland/

**Woodland Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 47 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/grand-sequoia/

**Grand Sequoia Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 47 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/grand-sequoia-rs/

**Grand Sequoia RS Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 43 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/grand-sequoia-as/

**Grand Sequoia AS Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 47 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /products/roofing/shingles/gaf/royal-sovereign/

**Royal Sovereign Roofing Shingles** · authored-product-pillar · Native product pillar
- Components: SiteChrome [observed], Breadcrumbs [proposed], ContentSections [proposed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 4 headings; 58 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

### Homepage (1)

#### /

**Home** · wordpress · Native homepage
- Components: SiteChrome [observed], PageHero [observed], TrustStrip [observed], BrandStrip [observed], ServiceGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed], RelatedResources [observed], QuoteCTA [observed], FeatureGrid [observed], FAQSection [observed].
- Page-specific work: Split HomeTrust and HomeWorkmanship before extending them. Homepage remains the visual reference; native sections already render here.
- Source evidence: 36 headings; 421 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

### Services (33)

#### /attic-insulation/

**Columbus Attic Insulation Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 22 headings; 405 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /commercial-roofing/

**Columbus, OH Commercial Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 25 headings; 409 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /commercial-roofing/gutters/

**Columbus, OH Commercial Gutter Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 19 headings; 505 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /commercial-roofing/repair/

**Columbus, OH Commercial Roof Repair Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 507 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /commercial-roofing/replacement/

**Columbus, OH Commercial Roof Replacement Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 491 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /commercial-roofing/roof-types/

**Columbus, OH Commercial Roof Types** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 482 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /commercial-siding/

**Columbus, OH Commercial Siding Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 19 headings; 525 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /decks/

**Columbus, OH Deck Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 25 headings; 470 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /decks/accessories/

**Deck Accessories in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 20 headings; 243 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /decks/installations/

**Deck Installations in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 20 headings; 251 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /decks/refinishing/

**Deck Refinishing in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 20 headings; 242 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /decks/repairs/

**Deck Repairs in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 20 headings; 243 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /decks/replacements/

**Deck Replacements in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 20 headings; 257 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /exterior-painting/

**Exterior Painting in Columbus and across Ohio** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], TrustStrip [proposed], QuoteCTA [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 16 headings; 273 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /gutters/

**Columbus, OH Gutter Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 24 headings; 398 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /gutters/guards/

**Columbus, OH Gutter Guard Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 494 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /gutters/seamless/

**Columbus, OH Seamless Gutters Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 19 headings; 505 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /ice-dam-removal/

**Columbus, OH Ice Dam Removal Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 530 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing/

**Columbus, OH Roofing Company** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Build this first as the ServicePage pilot: repair/replacement/type links, feature content, offers, gallery and transformation. Use it to prove the shared components.
- Source evidence: 26 headings; 465 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /roofing/gaf/

**Columbus, OH GAF Roof Company** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 490 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing/gaf/master-elite/

**Columbus, OH GAF Master Elite Roofer** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 21 headings; 861 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /roofing/metal/

**Columbus, OH Metal Roof Company** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 499 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing/repair/

**Columbus, OH Roof Repair Company** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Keep leak/damage diagnosis, repair scenarios and repair-versus-replacement guidance; do not inherit replacement copy wholesale.
- Source evidence: 18 headings; 536 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing/replacement/

**Columbus, OH Roof Replacement Company** · wordpress · Native service components
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], FAQSection [observed].
- Page-specific work: Keep repair-versus-replacement guidance, warning signs, the replacement process, cost discussion and FAQ as distinct editable sections.
- Source evidence: 32 headings; 1020 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /siding/

**Columbus, OH Siding Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 24 headings; 387 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /siding/replacement/

**Columbus, OH Siding Replacement Contractor** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 19 headings; 513 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /siding/types/

**Columbus, OH Siding Types** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 19 headings; 508 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /storm-damage/

**Columbus, OH Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 26 headings; 449 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /storm-damage/commercial/

**Columbus, OH Commercial Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 547 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /storm-damage/hail/

**Columbus, OH Hail Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 507 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /storm-damage/insurance-claims/

**Columbus, OH Storm Damage Insurance Claims Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Keep a dedicated claims process and factual limits. Do not promise coverage or route all inquiries to insurance automatically.
- Source evidence: 18 headings; 507 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /storm-damage/wind/

**Columbus, OH Wind Roof Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 18 headings; 516 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /windows/

**Columbus Window Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], TrustStrip [observed], QuoteCTA [observed], BrandStrip [observed], ServiceGrid [observed], FeatureGrid [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Compose the service variant from shared hero, body sections, relevant product/service links and proof. Keep this service’s explanation, process and FAQs distinct.
- Source evidence: 24 headings; 374 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

### City landing pages (24)

#### /akron-oh/

**Akron, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 428 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /athens-oh/

**Athens, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 16 headings; 433 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /aurora-oh/

**Roof & Storm Damage in Aurora, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 16 headings; 344 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /beavercreek-oh/

**Roof & Storm Damage in Beavercreek, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 16 headings; 341 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /centerville-oh/

**Roof & Storm Damage Company in Centerville, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 459 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /cincinnati-oh/

**Cincinnati, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 463 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /cleveland-oh/

**Cleveland, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 468 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /columbus-oh/

**Columbus, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 443 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /dayton-oh/

**Dayton, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 457 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /delaware-oh/

**Delaware, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 481 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /dublin-oh/

**Roof & Storm Damage Company in Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 422 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /gahanna-oh/

**Roofing and exterior work in Gahanna** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 305 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /grove-city-oh/

**Roofing and exterior work in Grove City** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 312 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /hamilton-oh/

**Hamilton, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 446 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /hilliard-oh/

**Roofing and exterior work in Hilliard** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 319 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /lancaster-oh/

**Roof & Storm Damage Company in Lancaster, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 16 headings; 343 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /lewis-center-oh/

**Roofing and exterior work in Lewis Center** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 310 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /middletown-oh/

**Roof & Storm Damage Company in Middletown, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 16 headings; 337 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /newark-oh/

**Newark, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 465 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /powell-oh/

**Roofing and exterior work in Powell** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 333 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /upper-arlington-oh/

**Roofing and exterior work in Upper Arlington** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 324 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /westerville-oh/

**Roofing and exterior work in Westerville** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 327 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /worthington-oh/

**Roofing and exterior work in Worthington** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], ServiceGrid [proposed], ProjectGallery [proposed], CoverageSection [proposed], QuoteCTA [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 8 headings; 303 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /zanesville-oh/

**Zanesville, OH Roof & Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], ServiceGrid [proposed], ProjectGallery [observed], CoverageSection [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], Testimonials [observed].
- Page-specific work: Use CityLandingPage with this city’s service links, distinct introduction, real coverage and verified local work. Shared layout must not become a city-name substitution page.
- Source evidence: 17 headings; 444 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

### Service + city pages (23)

#### /cincinnati-oh/roofing/

**Cincinnati, OH Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 531 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /cincinnati-oh/storm-damage/

**Cincinnati, OH Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 587 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /cincinnati-oh/the-cost-of-siding-replacement/

**The Cost of a Siding Replacement in Cincinnati, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 20 headings; 535 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /cleveland-oh/roofing/

**Cleveland, OH Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 524 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /cleveland-oh/roofing/cost-of-replacement/

**The Cost of a Roof Replacement in Cleveland, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 19 headings; 495 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /cleveland-oh/storm-damage/

**Cleveland, OH Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 510 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /columbus-oh/roofing/

**Columbus, OH Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 487 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /columbus-oh/storm-damage/

**Columbus Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 498 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /dayton-oh/roofing/

**Dayton, OH Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 501 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /dayton-oh/storm-damage/

**Dayton, OH Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 22 headings; 565 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /dayton-oh/the-cost-of-new-gutters/

**The Cost of New Gutters in Dayton, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 20 headings; 590 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /dayton-roofers/

**Dayton Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 474 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /delaware-oh/roofing/

**Delaware, OH Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 21 headings; 534 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /delaware-oh/storm-damage/

**Delaware, OH Storm Damage Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 22 headings; 525 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.

#### /emergency-roof-repair-dublin-oh/

**Emergency Roof Repair Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 20 headings; 1135 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /gaf-roofing-dublin-oh/

**GAF Roofing Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 30 headings; 1912 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /gutter-installation-dublin-oh/

**Gutter Installation Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 29 headings; 1673 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /hail-damage-roof-repair-dublin-oh/

**Hail Damage Roof Repair Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 28 headings; 1429 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /metal-roofing-dublin-oh/

**Metal Roofing Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 30 headings; 1882 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roof-repair-dublin-oh/

**Roof Repair Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 29 headings; 2038 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roof-replacement-dublin-oh/

**Roof Replacement Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 28 headings; 2066 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /roofing-contractor-dublin-oh/

**Roofing Contractor Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 28 headings; 1699 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /storm-damage-roof-repair-dublin-oh/

**Storm Damage Roof Repair Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], FAQSection [proposed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use LocalServicePage with this route’s specific service intent. Preserve its detailed local copy and FAQs; add only verified project/review evidence for that service and location.
- Source evidence: 20 headings; 650 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

### Articles (30)

#### /blog/best-roofing-contractors-dublin-oh-what-homeowners-should-know-before-hiring-a/

**Best Roofing Contractors Dublin OH: What Homeowners Should Know Before Hiring a Roofing Company** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 20 headings; 1004 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/columbus-roof-damage-after-early-august-storms-your-first-72-hours/

**Columbus Roof Damage After Early August Storms: Your First 72 Hours** · live-browser-capture · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [proposed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [proposed], QuoteCTA [proposed], ArchiveListing [observed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 20 headings; 1737 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/columbus-roofs-face-wind-gusts-over-40-mph-during-fall-stormsenough-to-lift/

**Columbus Roofs Face Wind Gusts Over 40 MPH During Fall Storms—Enough to Lift Shingles or Expose Underlayment** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 484 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/from-hail-to-high-winds-how-to-spot-hidden-roof-damage-after-ohios-late-summer/

**From Hail to High Winds: How to Spot Hidden Roof Damage After Ohio’s Late-Summer Storms** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 11 headings; 403 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/how-long-does-a-roof-last-in-dublin-oh/

**How Long Does a Roof Last in Dublin, OH?** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 13 headings; 700 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/how-much-does-a-roof-replacement-cost-in-dublin-oh/

**How Much Does a Roof Replacement Cost in Dublin, OH?** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 15 headings; 934 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/how-much-does-roof-repair-cost-in-dublin-oh/

**How Much Does Roof Repair Cost in Dublin, OH** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 28 headings; 1278 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250115000/replacing-your-roof-in-columbus-why-hiring-experts-is-the-best-choice/

**Replacing Your Roof in Columbus: Why Hiring Experts Is the Best Choice** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 19 headings; 369 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250115001/replace-your-home-siding-in-columbus-with-expert-help/

**Replace Your Home Siding in Columbus with Expert Help** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 19 headings; 388 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250115002/the-importance-of-gutters-for-your-columbus-home/

**The Importance of Gutters for Your Columbus Home** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 17 headings; 363 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250321000/the-5-step-roofing-process/

**The 5 Step Roofing Process** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 14 headings; 396 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250409000/should-i-go-with-gaf-shingles-for-my-roof-replacement/

**Should I Go with GAF Shingles for My Roof Replacement?** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 11 headings; 482 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250520000/how-to-know-if-you-need-a-roof-repair-or-roof-replacement/

**How to Know If You Need a Roof Repair or Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 403 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250610000/how-to-spot-roof-damage-this-storm-season/

**How to Spot Roof Damage This Storm Season** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 13 headings; 400 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250702000/post-storm-roof-inspection-checklist-what-to-do-before-calling-insurance/

**Post-Storm Roof Inspection Checklist: What to Do Before Calling Insurance** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 14 headings; 574 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250809000/why-gutter-guard-installation-in-columbus-oh-is-a-good-idea/

**Why Gutter Guard Installation in Columbus, OH is a Good Idea** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 16 headings; 529 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250901000/why-nows-the-time-to-schedule-christmas-light-installation/

**Why Now’s the Time to Schedule Christmas Light Installation** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 11 headings; 420 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.250917000/storm-ready-roofing-protecting-your-home-from-fall-winter-storms/

**Storm-Ready Roofing: Protecting Your Home from Fall & Winter Storms** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 15 headings; 381 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.251008000/from-hail-to-high-winds-how-to-spot-hidden-roof-damage-after-ohios-late-summer/

**From Hail to High Winds: How to Spot Hidden Roof Damage After Ohio’s Late-Summer Storms** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 11 headings; 403 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.251029000/columbus-roofs-face-wind-gusts-over-40-mph-during-fall-stormsenough-to-lift/

**Columbus Roofs Face Wind Gusts Over 40 MPH During Fall Storms—Enough to Lift Shingles or Expose Underlayment** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 484 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.251124000/winter-roofing-services-in-columbus-oh-what-homeowners-should-know/

**Winter Roofing Services in Columbus, OH: What Homeowners Should Know** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 454 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.251204000/prevent-roof-damage-this-winter-with-ice-dam-removal-in-columbus-oh/

**Prevent Roof Damage This Winter with Ice Dam Removal in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 467 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.260622000/best-roofing-contractors-dublin-oh-what-homeowners-should-know-before-hiring-a/

**Best Roofing Contractors Dublin OH: What Homeowners Should Know Before Hiring a Roofing Company** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 20 headings; 1004 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.260624000/signs-you-need-roof-repair-in-dublin-oh/

**Signs You Need Roof Repair in Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 27 headings; 1431 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.260624001/how-much-does-roof-repair-cost-in-dublin-oh/

**How Much Does Roof Repair Cost in Dublin, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 28 headings; 1278 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.260624002/how-long-does-a-roof-last-in-dublin-oh/

**How Long Does a Roof Last in Dublin, OH?** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 13 headings; 700 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/p.260624003/how-much-does-a-roof-replacement-cost-in-dublin-oh/

**How Much Does a Roof Replacement Cost in Dublin, OH?** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 15 headings; 934 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/prevent-roof-damage-this-winter-with-ice-dam-removal-in-columbus-oh/

**Prevent Roof Damage This Winter with Ice Dam Removal in Columbus, OH** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 467 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/signs-you-need-roof-repair-in-dublin-oh/

**Signs You Need Roof Repair in Dublin, OH** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 27 headings; 1431 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/winter-roofing-services-in-columbus-oh-what-homeowners-should-know/

**Winter Roofing Services in Columbus, OH: What Homeowners Should Know** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], RelatedResources [observed], QuoteCTA [proposed].
- Page-specific work: Share ArticlePage, prose typography, optional contents navigation and related resources. Preserve this article’s body, author/date evidence, intent and URL.
- Source evidence: 12 headings; 454 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

### Blog and taxonomy archives (37)

#### /blog/

**Blog** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 16 headings; 372 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /blog/a.jared-l/

**Articles by Jared L.** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 192 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/a.roof-king-restoration/

**Articles by Roof King & Restoration** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 194 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.decking/

**Decking Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 2 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/c.gaf-roof/

**Gaf Roof Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 166 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.gutter-replacement/

**Gutter Replacement Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 76 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.gutter-types/

**Gutter Types Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 20 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/c.gutters/

**Gutters Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 19 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/c.metal-roof/

**Metal Roof Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 166 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.roof-replacement/

**Roof Replacement Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 166 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.roofing-contractor-dublin-oh/

**Roofing Contractor Dublin Oh Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 160 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.roofing-repair/

**Roofing Repair Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 158 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.roofing/

**Roofing Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 157 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.seamless-gutters/

**Seamless Gutters Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 20 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/c.siding-replacement/

**Siding Replacement Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 59 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /blog/c.siding-types/

**Siding Types Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 11 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/c.siding/

**Siding Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 10 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /category/roofing/

**Roofing Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 157 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /category/roof-replacement/

**Roof Replacement Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 59 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /category/storm-damage/

**Storm Damage Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 69 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /category/seasonal/

**Seasonal Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 55 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /category/roof-repair/

**Roof Repair Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 29 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /category/gutters/

**Gutters Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 19 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /category/siding/

**Siding Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 10 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /category/gaf-roofing/

**GAF Roofing Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 12 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /category/ice-dam-removal/

**Ice Dam Removal Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 15 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/columbus-oh/

**Columbus, OH Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 75 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

#### /tag/dublin-oh/

**Dublin, OH Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 48 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/roof-inspection/

**Roof Inspection Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 33 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/hiring-tips/

**Hiring Tips Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 35 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/winter-roofing/

**Winter Roofing Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 32 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/gaf-shingles/

**GAF Shingles Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 28 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/wind-damage/

**Wind Damage Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 33 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/cost-guides/

**Cost Guides Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 20 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/hail-damage/

**Hail Damage Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 17 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /tag/christmas-lights/

**Christmas Lights Articles** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 11 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Sparse or empty archive; validate taxonomy membership before adding an editorial introduction.

#### /blog/page/2/

**Roof King Blog - Page 2** · reconstructed-wordpress-archive · Imported / reconstructed page
- Components: SiteChrome [observed], ArchiveListing [observed], Breadcrumbs [proposed].
- Page-specific work: Use ArchiveListing backed by the actual topic/tag/author query. Provide a real empty state and useful intro where results are sparse; retain this exact URL.
- Source evidence: 1 headings; 90 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.

### Project detail pages (15)

#### /past-projects/project/1706300/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 799 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706301/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 759 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706302/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 802 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706303/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 787 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706304/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 798 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706305/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 797 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706306/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 792 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706307/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 796 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706308/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 799 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1706309/

**Columbus GAF Roof Replacement** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 12 headings; 801 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1978031/

**Expert Roofing Project Near You on Colbrook Ct** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 15 headings; 980 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1978032/

**Expert Roofing and Siding Project Near You on Country Manor Dr** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 14 headings; 916 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1978033/

**Expert Roofing, Siding, and Gutters Project Near You on Summerfield Dr** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 15 headings; 987 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1978034/

**Expert Roofing and Gutters Project Near You on S Clayton Rd** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 15 headings; 962 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /past-projects/project/1980612/

**Expert Roofing Project Near You on Thames Ct** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ProjectGallery [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Replace the blog label/author/reading-time wrapper with project metadata. Keep job-specific overview, materials, results, photos and next/previous navigation.
- Source evidence: 16 headings; 969 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

### Gallery and project hubs (2)

#### /gallery/

**Gallery** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Reuse ProjectGallery filtering/lightbox; preserve actual project records and media relationships. Use a map only when location evidence supports it.
- Source evidence: 11 headings; 0 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews, core/html.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /past-projects/

**Ready to start your project?** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ProjectGallery [observed], QuoteCTA [observed], TrustStrip [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Use project records plus optional verified map coordinates. The current generic hero says “Ready to start your project?”; make the project hub identity explicit.
- Source evidence: 11 headings; 0 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews, core/html.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

### Offer detail pages (10)

#### /offers/3-year-financing/

**Flexible 3-Year Financing for Your Home Projects** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 12 headings; 289 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/5-year-financing/

**Affordable 5-Year Financing for Your Home Projects** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 12 headings; 314 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/5-year-workmanship-warranty/

**5-Year Workmanship Warranty You Can Count On** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use WarrantyOfferPage: coverage, exclusions, eligibility, documents and CTA. Remove blog framing and verify exact manufacturer/workmanship terms.
- Source evidence: 12 headings; 266 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/christmas-lights-install/

**Light Up Your Holidays!** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 10 headings; 105 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/flexible-financing/

**Flexible Financing with Hearth** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 11 headings; 382 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/gaf-golden-pledge/

**GAF Golden Pledge Manufacturer Warranty—Maximum Protection for Your Roof** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use WarrantyOfferPage: coverage, exclusions, eligibility, documents and CTA. Remove blog framing and verify exact manufacturer/workmanship terms.
- Source evidence: 11 headings; 263 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/gaf-silver-pledge/

**GAF Silver Pledge Manufacturer Warranty—Ultimate Roof Protection** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use WarrantyOfferPage: coverage, exclusions, eligibility, documents and CTA. Remove blog framing and verify exact manufacturer/workmanship terms.
- Source evidence: 11 headings; 286 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/gaf-system-plus/

**GAF System Plus Manufacturer Warranty—Comprehensive Roof Protection** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use WarrantyOfferPage: coverage, exclusions, eligibility, documents and CTA. Remove blog framing and verify exact manufacturer/workmanship terms.
- Source evidence: 11 headings; 264 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/medallion-bank-financing/

**Medallion Bank Financing for Home Improvements** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 12 headings; 286 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /offers/payments/

**Payments As Low As $47** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], ContentSections [proposed], QuoteCTA [proposed], RelatedResources [observed].
- Page-specific work: Use FinancingOfferPage or PromotionPage as appropriate: eligibility, terms, expiry and CTA. Remove blog framing; verify amounts and availability.
- Source evidence: 13 headings; 381 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

### Offer hub (1)

#### /offers/

**Roof King & Restoration Offers** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], OfferGrid [observed], TrustStrip [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Use OfferListing and OfferCard from structured records. Expired offers retain useful explanatory pages rather than being silently removed.
- Source evidence: 20 headings; 291 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, roofkingco/offers, roofkingco/coverage-map, roofkingco/reviews, core/html.

### Review detail pages (10)

#### /reviews/00601dee-df98-42ab-b364-4725af97794b/

**They were fast and the clean up was perfect.** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 111 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/15255848-3e71-4f13-a30e-57be026ef6f4/

**Great Job on my roof!** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 274 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/3a032dad-0290-4861-b18d-feca5bc297f2/

**New roof** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 78 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/51e9f4c9-94a3-479a-ace6-1dd092e46eda/

**Highly recommend!!** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 140 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/6ebfad42-3c98-4f58-824d-c6c7a6460c26/

**Roofing repair** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 72 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/9232a940-a207-4b8e-99e9-d6e2f30648c9/

**very professional** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 108 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/a66c9ffb-f532-4d0e-9903-53f32ff76e9c/

**Excellent job!** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 86 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/cf96867a-a03f-4d21-8bc5-712d0ab5220f/

**Deck Repair** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 91 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/de023ff3-3871-4861-8121-0023190aec17/

**New roof** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 220 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

#### /reviews/ecddc4b5-0a23-4fc7-b7d0-d13efb473217/

**Positive experience** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], DetailLayout [observed], Breadcrumbs [proposed], Testimonials [proposed], RelatedResources [observed].
- Page-specific work: Use a dedicated ReviewPage. Preserve the exact supplied quote and attribution; remove blog author/date/reading-time presentation and unrelated blog sidebar.
- Source evidence: 9 headings; 118 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Wrong record framing: blog label/byline/reading time on a non-article.
- Review: Imported body contains a nested main landmark; native composition should expose a single main.

### Review hub (1)

#### /reviews/

**Reviews** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], Testimonials [observed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], QuoteCTA [observed].
- Page-specific work: Use ReviewListing and ReviewCard from verified review data. Reconcile imported platform ratings/counts before displaying an aggregate.
- Source evidence: 21 headings; 781 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/coverage-map, roofkingco/reviews.

### Contact and inspection (3)

#### /contact-us/

**Contact Us** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], QuoteCTA [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Share one contact record and ContactPage. Preserve this route and current canonical. Keep Zapier deferred and Jared Lane as the confirmed lead owner.
- Source evidence: 10 headings; 18 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/coverage-map, roofkingco/reviews.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /contact/

**Contact Us** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], QuoteCTA [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed].
- Page-specific work: Share one contact record and ContactPage. Preserve this route and current canonical. Keep Zapier deferred and Jared Lane as the confirmed lead owner.
- Source evidence: 10 headings; 18 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/coverage-map, roofkingco/reviews.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /free-inspection/

**Book a free inspection** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], QuoteCTA [observed], SpecializedContent [proposed].
- Page-specific work: Use InspectionLanding with the real booking link and inquiry form state. A request is not a confirmed appointment.
- Source evidence: 6 headings; 258 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

### Tools (4)

#### /deck-visualizer/

**Deck Visualizer** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [proposed].
- Page-specific work: Preserved body is only the title. Confirm the actual visualizer/vendor before building ToolFrame. A card that pretends to visualize a deck is not completion.
- Source evidence: 1 headings; 2 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.
- Review: Integration needs functional verification; an available page URL does not prove the tool backend works.

#### /roof-calculator/

**Roof Calculator** · wordpress · Imported page + native estimator
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [proposed], RoofrEstimator [observed].
- Page-specific work: Keep both URLs. Share the already wired RoofrEstimator and a ToolLanding composition. Scheduling/quote delivery are separate; no test lead was submitted.
- Source evidence: 5 headings; 217 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Integration needs functional verification; an available page URL does not prove the tool backend works.

#### /roofing-calculator/

**Columbus Roofing Cost Calculator** · wordpress · Imported page + native estimator
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [proposed], RoofrEstimator [observed].
- Page-specific work: Keep both URLs. Share the already wired RoofrEstimator and a ToolLanding composition. Scheduling/quote delivery are separate; no test lead was submitted.
- Source evidence: 3 headings; 567 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Integration needs functional verification; an available page URL does not prove the tool backend works.

#### /storm-report/

**What has actually hit your address** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], QuoteCTA [observed], FAQSection [observed].
- Page-specific work: Imported tool makes address-level NOAA-history claims, but its backend is not in this repository. Preserve explanatory copy and implement/verify the data service before claiming reports work.
- Source evidence: 6 headings; 610 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Integration needs functional verification; an available page URL does not prove the tool backend works.
- Review: Public static output only; original application/backend source is unavailable.

### Company and special pages (14)

#### /about-us/

**About Us** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 13 headings; 351 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /about/

**About Us** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 13 headings; 351 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.

#### /careers/

**Roof King & Restoration Careers** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Keep this path and its distinct recruitment copy. Share CareersPage primitives with /our-careers/; a content-equivalence decision is still required.
- Source evidence: 11 headings; 83 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /columbus-ppc-company/

**Your Trusted Roofing Company in Columbus, OH** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], BeforeAfter [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Treat as a campaign landing-page variant, sharing service components. Confirm audience, CTA and future index policy; preserve its URL now.
- Source evidence: 21 headings; 381 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/before-after, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /cost-of-a-new-roof/

**What Goes Into the Cost of Replacing Your Roof?** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], OfferGrid [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Use cost-factor sections and a Roofr CTA. Keep editorial pricing context separate from the estimator; verify all amounts and eligibility.
- Source evidence: 19 headings; 594 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/offers, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.

#### /customer-service/

**Roof King & Restoration Customer Service** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 11 headings; 29 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /events/

**Roof King & Restoration Events** · live-browser-capture · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [proposed], ContentSections [proposed], SpecializedContent [proposed], ArchiveListing [observed].
- Page-specific work: Only a short events stub is preserved. Build event cards and a truthful empty state; request actual event dates/details.
- Source evidence: 2 headings; 34 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /faq/

**Frequently Asked Questions** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed], FAQSection [observed].
- Page-specific work: Use grouped native details for the real roofing/siding/gutter questions. Keep full answers and usable anchors; no hydrated accordion needed.
- Source evidence: 14 headings; 1476 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/coverage-map, roofkingco/reviews.
- Review: Migration H1 sits outside hero; native PageHero should own the visible H1.

#### /financing/

**Payment options, explained plainly** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed], QuoteCTA [observed].
- Page-specific work: Financing overview is not automatically identical to a particular financing offer. Reuse finance/offer cards while keeping its overview intent.
- Source evidence: 9 headings; 400 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /our-careers/

**Our Careers** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Careers body is effectively empty once shared sections are removed. Build vacancy/application states using real openings and an approved destination.
- Source evidence: 11 headings; 0 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews, core/html.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /our-team/

**Meet Our Team** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed], BrandStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed].
- Page-specific work: Team body currently has only a short introduction after removing shared sections. Supply approved staff records/photos rather than inventing profiles.
- Source evidence: 11 headings; 24 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/trusted-brands, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Very little purpose-specific text remains after removing shared sections; this needs content, not just a template.

#### /service-areas/

**Service Areas** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed], TrustStrip [observed], ProjectGallery [observed], CoverageSection [observed], Testimonials [observed], QuoteCTA [observed], LocationDirectory [observed].
- Page-specific work: Fix directory data: the current area index includes service/material pages as if they were geographic locations. Use explicit city/service records.
- Source evidence: 11 headings; 216 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html, roofkingco/project-gallery, roofkingco/coverage-map, roofkingco/reviews.
- Review: Directory mixes geographic and non-geographic entries.

#### /site-map/

**Site Map** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], TrustStrip [observed].
- Page-specific work: Reuse the shared shell, hero and content primitives. Give the page a purpose-specific body and avoid filling gaps with unrelated global proof sections.
- Source evidence: 2 headings; 279 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html.

#### /warranty/

**What is covered, by whom, and for how long** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], PageHero [proposed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed].
- Page-specific work: Warranty overview needs explicit coverage/terms data. Reuse warranty cards, but do not equate workmanship and manufacturer warranties.
- Source evidence: 6 headings; 405 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

### Policies (5)

#### /accessibility/

**Accessibility statement** · published-static-build · Imported / reconstructed page
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [proposed], SpecializedContent [proposed].
- Page-specific work: Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.
- Source evidence: 4 headings; 177 approximate body words after shared-section removal; WordPress blocks: none / reconstructed or public output.
- Review: Public static output only; original application/backend source is unavailable.

#### /privacy-policy-2/

**Privacy Policy** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], PageHero [observed], TrustStrip [observed].
- Page-specific work: Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.
- Source evidence: 2 headings; 1388 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.

#### /privacy-policy/

**Privacy Policy** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], PageHero [observed], TrustStrip [observed].
- Page-specific work: Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.
- Source evidence: 2 headings; 1388 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html.

#### /privacy/

**Privacy Policy** · wordpress-alternate-route · Imported / reconstructed page
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], PageHero [observed], TrustStrip [observed].
- Page-specific work: Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.
- Source evidence: 2 headings; 1388 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html.
- Review: Alternate URL: keep a 200 response; preserve recorded canonical preference pending review.

#### /terms/

**Terms and Conditions** · wordpress · Imported / reconstructed page
- Components: SiteChrome [observed], Breadcrumbs [observed], ContentSections [observed], SpecializedContent [proposed], PageHero [observed], TrustStrip [observed].
- Page-specific work: Use LegalPage with approved policy prose, version/effective date and company identity. Layout reuse does not authorize changing legal terms or canonical preferences.
- Source evidence: 8 headings; 825 approximate body words after shared-section removal; WordPress blocks: roofkingco/page-hero, roofkingco/breadcrumbs, core/html.

