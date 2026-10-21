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

## PDF transfer and review tools

extract-service-pdf.py extracts the 83 publishable entries with PDF page/font evidence; editorial notes are retained separately. apply-service-pdf.mjs explicitly adapts rejected terminology and reconciles identity, then writes service-copy.json, service-editorial.json and the audit. author-service-landings.mjs reapplies that overlay after family defaults. check-service-pdf.mjs independently compares every original block and link destination against built HTML using the recorded changes; npm run verify includes it. review-service-pages.mjs optionally uses Playwright (PLAYWRIGHT_MODULE and CHROME_PATH environment variables) to inspect all 84 pages at desktop/mobile, test tabs/FAQ, decode images and record screenshots under tmp/service-review. build-service-review.mjs creates the notes/export review index from those results. No authoring/network/PDF tooling runs during an ordinary build.

apply-service-pdf.mjs now applies service-overrides.json after source normalization. check-service-pdf.mjs checks the complete reviewed override text for those routes and original PDF text for the others, preserving original contextual destinations. Never mutate the original source extraction to hide a client-directed content revision.

deploy-cloudways.sh validates the target app marker, stages static output in private_html/astro-deploy, preserves old public files privately and restores them on a file-switch failure. check-cloudways-review.mjs checks public review URLs, noindex, static output and actual 404 status.
