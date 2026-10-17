# src/layouts

ServiceLanding composes the editorial /roofing/ page from roofing-landing.json, preserving shared header/footer, canonical metadata and disabled quote experience. ProductLayout owns the native product shell and forwards page-specific schema. ServicePage.astro renders the ordered service section union on the native shell without raw imported HTML. DocumentLayout.astro owns the native homepage and service HTML head, metadata and preview indexing policy. SiteLayout.astro remains the legacy imported-page shell for other routes. Both preserve canonical URLs and noindex until production approval.

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
