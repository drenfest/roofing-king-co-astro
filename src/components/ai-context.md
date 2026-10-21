# src/components

ServiceArticle presents leaf-service topics as ordinary visible content rows, preserving topic IDs and links. Polished services reuse LandingHero, ServicePaths, CredentialsSection, RoofMaterialOptions, BrandStrip, MediaContentRow, ProjectShowcase, FAQSection and QuoteExperience. LandingHero accepts optional nextHref/nextLabel; ProjectShowcase accepts optional destination href/label without changing the approved roofing reference. ServicePaths omits empty details and highlight lists. BrandStrip resolves explicitly selected brand IDs with intrinsic logo proportions. ReviewSection resolves verified third-party reviews and real platform badges; never fabricate local reviews or point badges to first-party pages. SiteHeader is shared throughout the site: four connected desktop columns, stable hover paths, keyboard controls and nested mobile toggles. Product components retain their catalog, genuine color samples, performance explanations and verified companion data. Quote forms remain disconnected and disabled. The removed product planning band must not return.

## Files

- `AccessoryBenefitDiagram.astro`
- `BeforeAfter.svelte`
- `BrandStrip.astro`
- `Breadcrumbs.astro`
- `CardSection.astro`
- `ComparisonSection.astro`
- `ContentSection.astro`
- `CoverageSection.astro`
- `CredentialsSection.astro`
- `FAQSection.astro`
- `HomeCardSection.astro`
- `HomeConfidence.astro`
- `HomeHero.astro`
- `HomeImage.astro`
- `HomeServices.astro`
- `HomeTrust.astro`
- `HomeWorkmanship.astro`
- `LandingHero.astro`
- `MediaContentRow.astro`
- `MegaMenu.svelte`
- `PageHero.astro`
- `ProcessSteps.astro`
- `ProductCard.astro`
- `ProductCompanions.astro`
- `ProductDetailPage.astro`
- `ProductEnergy.astro`
- `ProductGrid.astro`
- `ProductHubPage.astro`
- `ProductOptions.svelte`
- `ProductSpecifications.astro`
- `ProductTabs.svelte`
- `ProductWarranty.astro`
- `ProjectGallery.svelte`
- `ProjectShowcase.astro`
- `QuoteExperience.svelte`
- `QuoteForm.svelte`
- `QuoteSection.astro`
- `ResourceLinks.astro`
- `ReviewSection.astro`
- `RichContent.astro`
- `RoofMaterialOptions.astro`
- `RoofrEstimator.svelte`
- `RouteReview.svelte`
- `SectionHeading.astro`
- `ServiceArticle.astro`
- `ServiceAudienceBanner.astro`
- `ServiceExplorer.svelte`
- `ServiceIcon.astro`
- `ServicePaths.astro`
- `ServiceTopics.astro`
- `SiteFooter.astro`
- `SiteHeader.svelte`
- `TrustStrip.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## Service content interfaces

ServiceContentBand.astro renders full source sections as alternating media rows or multi-topic comparisons using RichContent. ServiceSystemDiagram.astro supplies decorative code-native system SVGs, not installation specifications. ServiceArticle.astro renders leaf opening prose and optional media without a selector. ServicePaths.astro accepts optional rich intro/item bodies for real child services; its plain-text fallback preserves the approved roofing example. LandingHero accepts optional RichNode body to retain contextual lead links. Generated art is conceptual and its captions must not imply a completed Roof King project.

ServiceArticle supports optional variant="benefits" to present static icon cards for homeowner benefits. This does not create a selector on a leaf page. Item icons use the shared ServiceIcon SVG system.

The native mobile masthead now groups a tap-to-call action and labeled Menu/Close toggle at the right edge. The hamburger uses an aria-hidden line wrapper; accessible expanded state, Escape and focus behavior remain on the real toggle button.

SiteMotion.astro installs shared CSS feedback and a small vanilla entrance observer in both document shells. All interactive elements receive feedback; tabs, product samples, galleries, disclosures and dialogs receive state entrances. New components inherit the shared contract; use --rk-motion-fast, --rk-motion-panel and --rk-motion-ease for additional states. Do not animate the before/after drag position or hide content awaiting JavaScript.

StormDamageCallout.astro is a static, responsive early-page storm inspection callout with hail, wind and insurance-documentation links. Its optional path selects an existing local storm page when one is present, otherwise the central storm hub. It inherits shared motion and adds no JavaScript.

ReviewCard.astro owns review excerpts, confirmed individual ratings, author/date and original platform badges for both CardSection and the review hub. ReviewCollection.svelte progressively filters static cards by their data-review-topics attribute. Without JS every review remains visible. Filters keep focus, announce counts and inherit shared reduced-motion behavior.

BrandStrip stacks its heading above a full-width logo grid below 1000px, with at most two columns below 760px. Single-brand selections retain their 240px maximum. Never constrain the entire multi-brand list to one logo’s width; logos retain intrinsic aspect ratios.
