# src/layouts

DocumentLayout.astro owns the native homepage HTML head, metadata and preview indexing policy. SiteLayout.astro remains the legacy imported-page shell for other routes. Both preserve canonical URLs and noindex until production approval.

## Files

- `DocumentLayout.astro`
- `SiteLayout.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
