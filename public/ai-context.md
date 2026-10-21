# Public assets

Files here are served verbatim. Media imports live under media/wordpress and media/static-build; optimized GAF samples in media/products have exact product/color provenance in migration/sources/gaf-product-catalog.json. Keep credentials and source exports out. New media should have useful filenames and verified provenance. Generated Astro assets are outside this directory.

## Service illustrations and review index

media/service-illustrations/ holds nine generated conceptual WebP illustrations; media/services/ holds their responsive derivatives alongside existing site media. Provenance and prompts are recorded in migration/service-illustration-provenance.json. Do not present generated images as customer jobs or exact installation instructions. service-page-review.html is a noindex review interface for all 84 services with browser-local notes and JSON export; regenerate with scripts/build-service-review.mjs after browser QA.

.htaccess sets static index.html, the 404 document, disabled directory listing and review noindex headers. PHP and internal context files are denied.

media/roofing-heroes/ holds only optimized WebP hero variants. The 41 generated scenes are illustrative, not verified Roof King projects or branded product samples. Original PNGs stay under output/imagegen/roofing-heroes outside the web root. roofing-hero-review.html is the noindex visual review gallery.

service-review-batch-01.html is the ten-page siding/gutter review index, with source/revised heading outlines, page links and project-photo requests. It is noindex and uses relative links for both review environments. Review evidence is in migration/service-review-batch-01.json and .md.


media/product-collections holds five illustrative material scenes with 480/800/1200px WebP variants. They are not named-manufacturer samples or actual Roof King installations. Prompts, source filenames and asset byte counts are recorded in migration/product-collection-images.json; originals remain outside public.


media/service-heroes contains responsive WebP versions of the 43 supplementary service hero scenes. Originals are outside public. These are illustrative scenes, not verified customer projects or exact manufacturer samples. Every native service page now resolves an individual hero and parent-tab previews use the same optimized assets.


media/navigation/menu-thumbnails-<hash>.webp contains all 121 distinct navigation thumbnails. It loads once on first menu opening and is immutable-cacheable because its filename includes a content hash. The three separate 640px source concepts are authoring inputs only; the menu never requests them individually.
