# src/layouts

SiteLayout uses the same native SiteHeader as redesigned routes and no longer initializes legacy navigation. Its quote CTA links to contact-us rather than a missing native dialog. Legacy gallery/comparison behavior remains separate. The editorial roofing process narrative was removed at the client’s request; the estimate/financing content now occupies its green slanted band, retaining the roofing-process anchor. ServiceLanding and ServicePage both render ReviewSection, matching the homepage cards and verified third-party review data. ServiceLanding composes the editorial /roofing/ page from roofing-landing.json, preserving shared header/footer, canonical metadata and disabled quote experience. ProductLayout owns the native product shell and forwards page-specific schema. ServicePage.astro supports ServicePathsData through the service-paths section type and renders the ordered service section union on the native shell without raw imported HTML. DocumentLayout.astro owns the native homepage and service HTML head, metadata and preview indexing policy. SiteLayout.astro remains the legacy imported-page shell for other routes. Both preserve canonical URLs and noindex until production approval.

## Files

- `DocumentLayout.astro`
- `ProductLayout.astro`
- `ServiceLanding.astro`
- `ServicePage.astro`
- `SiteLayout.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
