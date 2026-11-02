# src/components: choosing and extending components

Read the root handbook and the page family's data/layout maps first. This directory is the shared design system, not a place to embed page-specific business facts. Use the approved ivory/charcoal/orange tokens, Manrope + Inter, title-style capitalized headings and restrained motion. Existing components may still support legacy consumers; preserve their interfaces or provide optional defaults.

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
| Topic-matched photo/copy cards | SectionPhotoGallery via ServiceContentBand | Supports any positive number of unique photos, each mapped to its own copy topics exactly once. Desktop wraps into rows of three; mobile stacks one per row. ServiceContentBand supplies the charcoal slanted background and orange accents. Preserve source paragraphs, headings, anchors, captions, alt text and dimensions; do not pad rows with duplicate photos. |
| Simple media/copy content | MediaContentRow / ContentSection | Reuse a real existing layout before adding a new card grid |
| Manufacturer logos | BrandStrip | Native scroll snapping and mobile swipe, proportional logos, no autoplay/dependency; headingLevel=3 for subordinate brand sections |
| Product collection | ProductHubPage + ProductGrid + ProductCard | Actual child/catalog entries, distinct relevant pictures, real source links and ProductOptions; no generic research-note band |
| Product detail | ProductDetailPage | Shared hero, overview and warranty/specification/companion tabs; optional primary parent link; exact catalog data |
| Cross-brand comparisons | ProductComparisonSection + ProductComparison + ProductSpecFilters | Pin the current product; up to three same-use alternatives from other listed brands. Differences use product-filtering semantic keys, not prose strings: equivalent ratings hide, but conditional ratings and different warranty conditions stay distinct. Retain original cell explanations/source links. Roofing benefits split into defect, wind and algae coverage with documented timelines. Use complete sourced rows, lazy responsive pictures, keyboard-scrollable table, reset/empty states and SSR defaults. Omit when no other listed brand is comparable. ProductCatalogFilters enhances existing ProductGrid cards without replacing their color controls; no-JS cards remain visible. |
| Product colors | ProductOptions + ProductColorPreview | Exact source color names/swatches, independent instance IDs, keyboard selection and source photograph links; an illustrative color study does not become a manufacturer photo |
| Product specifications / warranty | ProductSpecifications / ProductWarranty / ProductEnergy | Product-specific facts, source references, honest terms and readable tables; material-specific care via product-care.ts, exact product overrides, and GAF-only energy ratings |
| Companion systems | ProductCompanions / ProductSystemCompanions | Preserve detailed HDZ treatment and the brand/family resolver; canonical child-page links, primary parent map and relevant images/diagrams |
| Product or building diagrams | AccessoryBenefitDiagram / SystemComponentDiagram / ServiceSystemDiagram / IceDamDiagram | Code-native explanatory SVGs, accessible naming and actual subject; diagrams are not installation specifications |
| Project photographs | ProjectGallery | Orange brand tone by default for homepage, past-projects and service galleries. Full-width stacked header: eyebrow, title, paragraph. Retain diagonal edges, white text, filtered whole-page batches limited to two rows, keyboard lightbox, source kinds/tags, original-image links and SSR fallback |
| Service photographs | ServiceGallery / ProjectShowcase | Select actual relevant gallery topics; do not show siding-only captions under windows or unrelated work under a service |
| Before/after | ServiceComparison -> ComparisonSection -> BeforeAfter | Explicit per-route pair, matching geometry, visible provenance caption, responsive lazy images, native keyboard/touch range; optional square framing and no-JS image links |
| FAQ | FAQSection | Actual question/answer pairs, existing details UI and consolidated schema; ordinary disclosures are not FAQs |
| Article body | ArticleSection / ArticleImage / ArticleChecklist / RichContent | Preserve grouped lists and labels, first-image hero, remaining inline photos and source links; keep list spacing compact and avoid per-item rules |
| Blog cards / hubs | CardSection / FeaturedArticles / BlogHub / BlogArchive / BlogCardFilters | Thumbnail, short description, source author/date, canonical destinations and filters; omit an empty collection entirely |
| Blog navigation | BlogNavigation | Shared aside on main hubs, category/topic archives and articles; include this article's real categories/topics |
| Reviews | ReviewSection / ReviewCard / ReviewCollection | Verified excerpts, author/date/ratings and external platform references; no fabricated local reviews or aggregate score |
| Service areas | ServiceAreaMap / LocationServiceLinks / CoverageSection | Local boundary data and existing route descendants, filterable cards, nested service links, hero and keyboard fallback |
| Quote / booking | QuoteSection / QuoteExperience / ContactActions | Shared CTA, wide desktop modal, short heading, native dialog focus/Escape; render real booking/phone links instead of unavailable inputs; preserve #quote-form anchors and native dialog focus/Escape |
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
- [ContactActions.svelte](ContactActions.svelte)
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
- [MaterialInstallation.astro](MaterialInstallation.astro)
- [MaterialTabs.svelte](MaterialTabs.svelte)
- [MediaContentRow.astro](MediaContentRow.astro)
- [MegaMenu.svelte](MegaMenu.svelte)
- [MenuPreview.svelte](MenuPreview.svelte)
- [PageHero.astro](PageHero.astro)
- [ProcessSteps.astro](ProcessSteps.astro)
- [ProductCard.astro](ProductCard.astro)
- [ProductCatalogFilters.svelte](ProductCatalogFilters.svelte)
- [ProductColorPreview.svelte](ProductColorPreview.svelte)
- [ProductCompanions.astro](ProductCompanions.astro)
- [ProductComparison.svelte](ProductComparison.svelte)
- [ProductComparisonSection.astro](ProductComparisonSection.astro)
- [ProductDetailPage.astro](ProductDetailPage.astro)
- [ProductEnergy.astro](ProductEnergy.astro)
- [ProductGrid.astro](ProductGrid.astro)
- [ProductHero.astro](ProductHero.astro)
- [ProductHubPage.astro](ProductHubPage.astro)
- [ProductOptions.svelte](ProductOptions.svelte)
- [ProductSpecFilters.svelte](ProductSpecFilters.svelte)
- [ProductSpecifications.astro](ProductSpecifications.astro)
- [ProductSystemCompanions.astro](ProductSystemCompanions.astro)
- [ProductTabs.svelte](ProductTabs.svelte)
- [ProductWarranty.astro](ProductWarranty.astro)
- [ProjectGallery.svelte](ProjectGallery.svelte)
- [ProjectShowcase.astro](ProjectShowcase.astro)
- [QuoteExperience.svelte](QuoteExperience.svelte)
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

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->

The homepage blog section reuses FeaturedArticles with Columbus-local selection, the same four-card layout as service pages. FeaturedArticles uses slanted section edges, an ivory/tan diagonal field, an orange leading edge and eyebrow rule, and subtly clipped photo corners across all consumers. Keep its section padding and heading typography self-contained; it must not depend on service-landing.css being loaded by the consumer.

MaterialInstallation and MaterialTabs provide the horizontal materials/installation selector. Opt in with ServiceCopySection.materialTabs, mapping each label/manufacturer/catalog link to its existing cardTitle. Preserve full card prose and anchors; unmatched cards remain visible below. Use productHeroImage for source-matched responsive previews. Active tabs use tan/orange, headings charcoal; retain keyboard arrows/Home/End and readable stacked panels without JavaScript.

On mobile, MaterialInstallation uses reduced section slants, 1rem side gutters, a full-width preview above the copy, and compact wrapping three-across material tabs with touch-sized targets. Avoid fixed-width tab tracks or desktop heading sizes that force horizontal page scrolling.

ServicePaths now accepts typed topic groups containing existing-style product/planning cards, details/summary disclosures and an accessible overflow comparison table. Keep group headings subordinate to the panel H3, reuse productHeroImage/HomeImage and retain all SSR content. Do not create a second page shell for reviewed content. HomeImage also accepts explicit width, height and srcset from product registries when no shared media entry exists.

Commercial product data uses the same ProductHubPage, ProductDetailPage and ProductCard structure. Optional manufacturerData in ProductSpecifications renders source features, honest reference colors, complete published SKU tables and product FAQs in accessible disclosures. ProductOptions receives only the data needed for its controls; technical tables and document links stay in SSR. Keep real source photographs unchanged when displaying reference swatches.

MaterialInstallation supports actual product destinations and an existing service destination where no product collection exists (for example commercial metal roofing). Product choices resolve productHeroImage; service choices resolve serviceHero, retain illustration provenance and use service-appropriate link wording. Do not invent a metal product catalog merely to supply a tab image.

ServicePaths accepts an optional item.image/item.caption for authored decision topics that are not a child-page summary; these use data-topic-photo. Actual child-service cards still resolve and validate the destination hero through data-child-hero. Keep one image under each eyebrow, lazy loading, intrinsic dimensions and explicit illustration/reference provenance. StormDamageCallout supports optional href/label so a service hub does not link to itself. FeaturedArticles supports title and preferredPaths while retaining catalog-backed cards and empty-state omission.
