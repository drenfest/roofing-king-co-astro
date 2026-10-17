# scripts

sync-product-navigation.mjs synchronizes the complete Products tree into native navigation data and the temporary imported header, preserving breadcrumb hierarchy. optimize-product-media.mjs explicitly regenerates local product images from the saved GAF evidence; normal builds never fetch GAF. check-products.mjs verifies all color assets/provenance and SSR catalog behavior. transfer-service-content.mjs accepts explicit preserved permalink arguments and merges only those records into service-pages.json; no-argument behavior reimports the original eight. Do not overwrite edited records without a deliberate migration plan. optimize-service-media.mjs generates additional dimensions/variants. check-services.mjs compares native output with preserved source copy/links and validates structure/media/forms. audit-component-reuse.mjs generates the complete source-based component audit using component-audit-template.html and the embedded brand asset thewebguy-logo.txt. Run npm run audit:components to regenerate. Build/import tools. import-wordpress.mjs is an explicit overwrite migration. check-content.mjs checks metadata/content; check-built-routes.mjs validates output and links. check-homepage.mjs verifies native homepage HTML, dimensions, accessibility labels and disabled form delivery.

## Files

- `audit-component-reuse.mjs`
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
