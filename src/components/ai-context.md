# src/components

LandingHero, ServicePaths, ProjectShowcase, ProcessSteps and ServiceIcon are static sections for editorial service landings, styled in service-landing.css. QuoteExperience accepts optional showRating (default true); the rewritten roofing landing disables that aggregate block. BrandStrip accepts an ordered brandIds selection plus page-specific headings, resolves logo/name/dimensions from brand-library.json and links through brand-pages.json. Empty selections hide the strip, unknown IDs fail the build, and any selection wraps into a responsive grid with intrinsic logo proportions. Homepage keeps its mixed selection; roofing uses GAF; material hubs select only relevant brands. ProductHubPage supports material/category cards with brand imagery and dedicated brand overviews. ResourceLinks renders optional SVG icon tiles or ordinary CTA links. MediaContentRow supports linkPlacement=media to position tiles beneath its photograph, with explicit per-link icon keys. MediaContentRow renders independent alternating service-topic rows with media, captions, preserved anchors and internal links; Cleveland uses four rows. ProductEnergy renders verified per-color/per-plant solar reflectance, emittance, SRI and CRRC IDs from product-energy.json in shared specifications; pending aged values remain pending. ProductHubPage and ProductDetailPage render the product pillar. AccessoryBenefitDiagram renders labeled conceptual SVG roof locations with product-specific captions; companion photos are locally optimized with source URLs in product-companions.json. ProductCompanions renders source-backed system pairings from product-companions.json with explicit productId eligibility; presently verified for Timberline HDZ only. ProductCard is shared between catalog and detail pages; detail CSS places the single color-selector island beside the photo. ProductTabs.svelte enhances static Astro panels with keyboard-accessible tabs; ProductWarranty and ProductSpecifications share content between catalog disclosures and full-width detail tabs. Companion products occupy a dedicated eligible tab. Product specs include qualification notes; ProductOptions renders matching wind/impact/fire/lifespan badges on each photograph. Native badge disclosures use shared product-explanations.ts definitions and distinct SVG icons/colors; one explanation opens per product at a time. Breadcrumbs emits matching logical BreadcrumbList schema; it does not derive hierarchy from URL directories. PageHero, TrustStrip, BrandStrip, CardSection, CoverageSection, ComparisonSection and QuoteSection now serve homepage and native service routes. ProductGrid renders verified product records and earlier catalog entries; ProductOptions.svelte independently selects genuine color images with keyboard and non-JS fallback links. Warranty/specification details stay in Astro/native HTML. ContentSection uses typed RichContent nodes for prose and linked/unlinked cards; FAQSection uses native details; Breadcrumbs uses explicit URLs. QuoteExperience accepts page-specific modalTitle/modalDescription; delivery remains disabled. Native homepage sections: HomeHero, HomeTrust, HomeServices, HomeCardSection, HomeConfidence and HomeWorkmanship are Astro. HomeImage renders pre-sized responsive media. SectionHeading is shared. SiteHeader, ProjectGallery, BeforeAfter and QuoteExperience are Svelte islands; QuoteForm is used inline and in the native dialog. RouteReview powers the inventory. RoofrEstimator loads the verified public Roofr iframe on visitor activation, with a direct-link fallback. Keep static content in Astro, and use client hydration only for interaction.

## Files

- `AccessoryBenefitDiagram.astro`
- `BeforeAfter.svelte`
- `BrandStrip.astro`
- `Breadcrumbs.astro`
- `CardSection.astro`
- `ComparisonSection.astro`
- `ContentSection.astro`
- `CoverageSection.astro`
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
- `RichContent.astro`
- `RoofrEstimator.svelte`
- `RouteReview.svelte`
- `SectionHeading.astro`
- `ServiceIcon.astro`
- `ServicePaths.astro`
- `SiteFooter.astro`
- `SiteHeader.svelte`
- `TrustStrip.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
