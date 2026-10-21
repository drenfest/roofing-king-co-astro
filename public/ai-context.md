# Public assets

Files here are served verbatim. Media imports live under media/wordpress and media/static-build; optimized GAF samples in media/products have exact product/color provenance in migration/sources/gaf-product-catalog.json. Keep credentials and source exports out. New media should have useful filenames and verified provenance. Generated Astro assets are outside this directory.

## Service illustrations and review index

media/service-illustrations/ holds nine generated conceptual WebP illustrations; media/services/ holds their responsive derivatives alongside existing site media. Provenance and prompts are recorded in migration/service-illustration-provenance.json. Do not present generated images as customer jobs or exact installation instructions. service-page-review.html is a noindex review interface for all 84 services with browser-local notes and JSON export; regenerate with scripts/build-service-review.mjs after browser QA.

.htaccess sets static index.html, the 404 document, disabled directory listing and review noindex headers. PHP and internal context files are denied.

media/roofing-heroes/ holds only optimized WebP hero variants. The 41 generated scenes are illustrative, not verified Roof King projects or branded product samples. Original PNGs stay under output/imagegen/roofing-heroes outside the web root. roofing-hero-review.html is the noindex visual review gallery.
