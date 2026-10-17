# src/components

PageHero, TrustStrip, BrandStrip, CardSection, CoverageSection, ComparisonSection and QuoteSection now serve homepage and native service routes. ProductGrid renders verified product records and earlier catalog entries; ProductOptions.svelte independently selects genuine color images with keyboard and non-JS fallback links. Warranty/specification details stay in Astro/native HTML. ContentSection uses typed RichContent nodes for prose and linked/unlinked cards; FAQSection uses native details; Breadcrumbs uses explicit URLs. QuoteExperience accepts page-specific modalTitle/modalDescription; delivery remains disabled. Native homepage sections: HomeHero, HomeTrust, HomeServices, HomeCardSection, HomeConfidence and HomeWorkmanship are Astro. HomeImage renders pre-sized responsive media. SectionHeading is shared. SiteHeader, ProjectGallery, BeforeAfter and QuoteExperience are Svelte islands; QuoteForm is used inline and in the native dialog. RouteReview powers the inventory. RoofrEstimator loads the verified public Roofr iframe on visitor activation, with a direct-link fallback. Keep static content in Astro, and use client hydration only for interaction.

## Files

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
- `PageHero.astro`
- `ProductGrid.astro`
- `ProductOptions.svelte`
- `ProjectGallery.svelte`
- `QuoteExperience.svelte`
- `QuoteForm.svelte`
- `QuoteSection.astro`
- `RichContent.astro`
- `RoofrEstimator.svelte`
- `RouteReview.svelte`
- `SectionHeading.astro`
- `SiteFooter.astro`
- `SiteHeader.svelte`
- `TrustStrip.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
