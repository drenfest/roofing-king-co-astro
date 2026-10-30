# src/components: choosing and extending components

Read the root handbook and the page family's data/layout maps first. This directory is the shared design system, not a place to embed page-specific business facts. Use the approved ivory/charcoal/orange tokens, Playfair Display + Inter, sentence-case headings and restrained motion. Existing components may still support legacy consumers; preserve their interfaces or provide optional defaults.

## Choose by purpose

| Need | Use | Contract to preserve |
| --- | --- | --- |
| Service or location hero | LandingHero | Edge-to-edge contextual photo, ivory fade, serviceName jump label, source body links and optimized eager hero |
| Company/blog hub hero | PageHero | Shared editorial presentation, route-specific copy/image and matching Breadcrumbs |
| Product hero | ProductHero | Actual product/material image, proportional brand logo, source-appropriate caption and real collection/overview target |
| Homepage hero | HomeHero | Homepage data and the same editorial design language; do not clone it per page |
| Service parent or location service selector | ServicePaths + ServiceExplorer | SSR panels, child-hero photo under eyebrow, H3 panel titles, keyboard/touch behavior; location lists scroll and omit empty related lists |
| Leaf service opening | ServiceArticle | Visible prose/benefit rows, topic IDs, correct H2/H3/H4 outline; no unnecessary selector |
| Source-led service body | ServiceContentBand | Full RichNode paragraphs and anchors, alternating media/comparison layouts; reviewed brand subsections use H3 |
| Three photos opposite related copy | SectionPhotoGallery via ServiceContentBand | service-section-galleries.json pairs each photo to a specific heading+paragraph; preserve caption/alt/dimensions and the review batch |
| Simple media/copy content | MediaContentRow / ContentSection | Reuse a real existing layout before adding a new card grid |
| Manufacturer logos | BrandStrip | Native scroll snapping and mobile swipe, proportional logos, no autoplay/dependency; headingLevel=3 for subordinate brand sections |
| Product collection | ProductHubPage + ProductGrid + ProductCard | Actual child/catalog entries, distinct relevant pictures, real source links and ProductOptions; no generic research-note band |
| Product detail | ProductDetailPage | Shared hero, overview and warranty/specification/companion tabs; optional primary parent link; exact catalog data |
| Product colors | ProductOptions + ProductColorPreview | Exact source color names/swatches, independent instance IDs, keyboard selection and source photograph links; an illustrative color study does not become a manufacturer photo |
| Product specifications / warranty | ProductSpecifications / ProductWarranty / ProductEnergy | Product-specific facts, source references, honest terms and readable tables; no inherited GAF claims on other brands |
| Companion systems | ProductCompanions / ProductSystemCompanions | Preserve detailed HDZ treatment and the brand/family resolver; canonical child-page links, primary parent map and relevant images/diagrams |
| Product or building diagrams | AccessoryBenefitDiagram / SystemComponentDiagram / ServiceSystemDiagram / IceDamDiagram | Code-native explanatory SVGs, accessible naming and actual subject; diagrams are not installation specifications |
| Project photographs | ProjectGallery | Filtered whole-page batches limited to two rows, keyboard lightbox, source kinds/tags, original-image links and SSR fallback |
| Service photographs | ServiceGallery / ProjectShowcase | Select actual relevant gallery topics; do not show siding-only captions under windows or unrelated work under a service |
| Before/after | ServiceComparison -> ComparisonSection -> BeforeAfter | Explicit per-route pair, matching geometry, visible provenance caption, responsive lazy images, native keyboard/touch range; optional square framing and no-JS image links |
| FAQ | FAQSection | Actual question/answer pairs, existing details UI and consolidated schema; ordinary disclosures are not FAQs |
| Article body | ArticleSection / ArticleImage / ArticleChecklist / RichContent | Preserve grouped lists and labels, first-image hero, remaining inline photos and source links; keep list spacing compact and avoid per-item rules |
| Blog cards / hubs | CardSection / FeaturedArticles / BlogHub / BlogArchive / BlogCardFilters | Thumbnail, short description, source author/date, canonical destinations and filters; omit an empty collection entirely |
| Blog navigation | BlogNavigation | Shared aside on main hubs, category/topic archives and articles; include this article's real categories/topics |
| Reviews | ReviewSection / ReviewCard / ReviewCollection | Verified excerpts, author/date/ratings and external platform references; no fabricated local reviews or aggregate score |
| Service areas | ServiceAreaMap / LocationServiceLinks / CoverageSection | Local boundary data and existing route descendants, filterable cards, nested service links, hero and keyboard fallback |
| Quote / booking | QuoteSection / QuoteExperience / QuoteForm | Shared CTA, wide desktop modal, short heading, native dialog focus/Escape; submission stays disabled until delivery is implemented |
| Estimator | RoofrEstimator | Click-to-load iframe and direct fallback; do not eagerly load external embeds |
| Header / menu image | SiteHeader / MegaMenu / MenuPreview | Desktop hover + focus, stable connected columns, nested full-width mobile rows and source menu atlas; all route links work without JS |
| Shared identity / trust | SiteFooter / Breadcrumbs / TrustStrip / CredentialsSection | Central identity, actual badges, correct destinations and heading context |
| Weather promotion | StormDamageCallout | Restrained slanted weather styling, existing local/global storm destination and relevant hail/wind/claims links |
| Motion | SiteMotion | Reduced-motion-aware feedback and native document transitions; never animate drag position or hide initial content |

HomeServices, HomeTrust, HomeConfidence, HomeWorkmanship and HomeCardSection are homepage compositions of these shared conventions. ProcessSteps, ServiceTopics and compatibility-oriented components remain for retained consumers; do not restore the removed numbered process block on new pages. RouteReview is internal review tooling, not customer navigation.

## Extension workflow

1. Search consumers of the closest component and inspect the corresponding shared type. Props often carry the content; editing the component to hard-code one page is the wrong layer.
2. Prefer an optional prop or data-driven variant with a stable default. Preserve old consumers, existing heading levels, anchors, selectors, no-JS content and hydration behavior.
3. Keep factual data in src/data with source evidence in migration. Reuse ServiceIcon and CSS tokens instead of adding a second icon or button system. Use Astro for static markup; hydrate only actual interactions.
4. Preserve current lifecycle choices: header/modal and selected detail controls need immediate availability; below-fold galleries, comparisons and collection controls generally use client:visible. Do not silently change all islands to client:load.
5. Give every img an alt attribute, every anchor a meaningful title, controls real labels and stable unique IDs. Empty arrays must render nothing; avoid rendering a numeric zero from a length expression.
6. If new visible content warrants schema, extend the DOM-based compiler in scripts/structured-data.mjs and its checks. Do not add independent duplicate JSON-LD graphs or invented rich-result facts.
7. Verify a representative existing consumer as well as the new case on desktop and mobile. For state changes, test the resulting visual behavior, focus, keyboard/touch and reduced-motion fallback, not just class names.

Register new components here with their purpose, data source, allowed variants and regression checks. Keep the generated file inventory separate from these manual contracts.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [AccessoryBenefitDiagram.astro](AccessoryBenefitDiagram.astro)
- [ArticleChecklist.astro](ArticleChecklist.astro)
- [ArticleImage.astro](ArticleImage.astro)
- [ArticleSection.astro](ArticleSection.astro)
- [BeforeAfter.svelte](BeforeAfter.svelte)
- [BlogArchive.astro](BlogArchive.astro)
- [BlogCardFilters.astro](BlogCardFilters.astro)
- [BlogHub.astro](BlogHub.astro)
- [BlogNavigation.astro](BlogNavigation.astro)
- [BrandStrip.astro](BrandStrip.astro)
- [Breadcrumbs.astro](Breadcrumbs.astro)
- [CardSection.astro](CardSection.astro)
- [ComparisonSection.astro](ComparisonSection.astro)
- [ContentSection.astro](ContentSection.astro)
- [CoverageSection.astro](CoverageSection.astro)
- [CredentialsSection.astro](CredentialsSection.astro)
- [FAQSection.astro](FAQSection.astro)
- [FeaturedArticles.astro](FeaturedArticles.astro)
- [HomeCardSection.astro](HomeCardSection.astro)
- [HomeConfidence.astro](HomeConfidence.astro)
- [HomeHero.astro](HomeHero.astro)
- [HomeImage.astro](HomeImage.astro)
- [HomeServices.astro](HomeServices.astro)
- [HomeTrust.astro](HomeTrust.astro)
- [HomeWorkmanship.astro](HomeWorkmanship.astro)
- [IceDamDiagram.astro](IceDamDiagram.astro)
- [LandingHero.astro](LandingHero.astro)
- [LocationServiceLinks.astro](LocationServiceLinks.astro)
- [MediaContentRow.astro](MediaContentRow.astro)
- [MegaMenu.svelte](MegaMenu.svelte)
- [MenuPreview.svelte](MenuPreview.svelte)
- [PageHero.astro](PageHero.astro)
- [ProcessSteps.astro](ProcessSteps.astro)
- [ProductCard.astro](ProductCard.astro)
- [ProductColorPreview.svelte](ProductColorPreview.svelte)
- [ProductCompanions.astro](ProductCompanions.astro)
- [ProductDetailPage.astro](ProductDetailPage.astro)
- [ProductEnergy.astro](ProductEnergy.astro)
- [ProductGrid.astro](ProductGrid.astro)
- [ProductHero.astro](ProductHero.astro)
- [ProductHubPage.astro](ProductHubPage.astro)
- [ProductOptions.svelte](ProductOptions.svelte)
- [ProductSpecifications.astro](ProductSpecifications.astro)
- [ProductSystemCompanions.astro](ProductSystemCompanions.astro)
- [ProductTabs.svelte](ProductTabs.svelte)
- [ProductWarranty.astro](ProductWarranty.astro)
- [ProjectGallery.svelte](ProjectGallery.svelte)
- [ProjectShowcase.astro](ProjectShowcase.astro)
- [QuoteExperience.svelte](QuoteExperience.svelte)
- [QuoteForm.svelte](QuoteForm.svelte)
- [QuoteSection.astro](QuoteSection.astro)
- [ResourceLinks.astro](ResourceLinks.astro)
- [ReviewCard.astro](ReviewCard.astro)
- [ReviewCollection.svelte](ReviewCollection.svelte)
- [ReviewSection.astro](ReviewSection.astro)
- [RichContent.astro](RichContent.astro)
- [RoofMaterialOptions.astro](RoofMaterialOptions.astro)
- [RoofrEstimator.svelte](RoofrEstimator.svelte)
- [RouteReview.svelte](RouteReview.svelte)
- [SectionHeading.astro](SectionHeading.astro)
- [SectionPhotoGallery.astro](SectionPhotoGallery.astro)
- [ServiceAreaMap.astro](ServiceAreaMap.astro)
- [ServiceArticle.astro](ServiceArticle.astro)
- [ServiceAudienceBanner.astro](ServiceAudienceBanner.astro)
- [ServiceComparison.astro](ServiceComparison.astro)
- [ServiceContentBand.astro](ServiceContentBand.astro)
- [ServiceExplorer.svelte](ServiceExplorer.svelte)
- [ServiceGallery.astro](ServiceGallery.astro)
- [ServiceIcon.astro](ServiceIcon.astro)
- [ServicePaths.astro](ServicePaths.astro)
- [ServiceSystemDiagram.astro](ServiceSystemDiagram.astro)
- [ServiceTopics.astro](ServiceTopics.astro)
- [SidingProductGuide.astro](SidingProductGuide.astro)
- [SiteFooter.astro](SiteFooter.astro)
- [SiteHeader.svelte](SiteHeader.svelte)
- [SiteMotion.astro](SiteMotion.astro)
- [StormDamageCallout.astro](StormDamageCallout.astro)
- [SystemComponentDiagram.astro](SystemComponentDiagram.astro)
- [TrustStrip.astro](TrustStrip.astro)
- [WarrantyComparison.astro](WarrantyComparison.astro)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
