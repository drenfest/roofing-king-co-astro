# scripts

author-service-landings.mjs writes explicit native routes and service-editorial.json from the authored family briefs and reviewed route/city mapping. It runs only as an explicit authoring step, never during a normal build. Original source HTML remains evidence. optimize-service-media.mjs includes authored editorial images, caches existing variants and preserves earlier dimensions. build-service-review.mjs requires successful desktop/mobile browser results for every service URL and creates the noindex review index plus migration/service-polish-review.json. check-services.mjs preserves reference/catalog checks and verifies the complete 84-page authored composition, route links, source badges, disabled forms and image dimensions. Normal builds require no source database or network access. Run npm run verify before pushing.

## Files

- `audit-component-reuse.mjs`
- `author-service-landings.mjs`
- `build-service-review.mjs`
- `check-built-routes.mjs`
- `check-content.mjs`
- `check-homepage.mjs`
- `check-products.mjs`
- `check-services.mjs`
- `component-audit-template.html`
- `import-wordpress.mjs`
- `optimize-home-media.mjs`
- `optimize-product-media.mjs`
- `optimize-service-media.mjs`
- `sync-product-navigation.mjs`
- `thewebguy-logo.txt`
- `transfer-service-content.mjs`
- `write-context-maps.mjs`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
