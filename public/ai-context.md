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

media/weather contains optimized responsive orange-lightning decorative backgrounds, including a separate mobile crop. Original generated PNG and full prompt provenance are outside public in output/imagegen/weather and migration/storm-banner-image.json.

media/siding-guide contains illustrative material-profile and window-trim images at 480/800/1200px in WebP. Originals remain outside public; migration/siding-guide-images.json records prompts, edits and file sizes.

media/gutter-details contains four illustrative close-up photographs with three responsive WebP sizes each. Source PNGs stay under output/imagegen/gutter-details; full prompts and byte counts are in migration/gutter-detail-images.json.

maps/ohio-service-areas.geojson holds simplified Census 2026 municipal boundaries and one OpenStreetMap-derived Lewis Center point. Tiles are requested directly only as the coverage section enters view, with visible OSM attribution and normal browser caching. No tile scraping or build-time tile downloads.

media/gallery/ contains responsive WebP gallery photographs, including optimized enlarged views. Gallery source records are preserved outside public. .htaccess permanently redirects the retired /gallery/ URL to /#projects; other protected paths keep their content.


media/articles/hub-christmas-lights-600.webp is an optimized crop of the existing published seasonal article image used on the Topics hub. Menu atlas now contains 122 unique destinations, including the new Categories and Topics hubs; older hashes remain for cached pages.


The BLOG REDIRECTS block in .htaccess contains explicit permanent 301 rules from all retired article aliases to category/tag canonical destinations. Astro redirects provide static preview fallbacks; Apache performs the actual 301 on Cloudways. Keep both maps synchronized via scripts/migrate-blog-urls.mjs.


The current menu atlas includes 124 distinct destinations, including Insurance Claims and Gutter Guards. Previous atlas files are retained for cached pages.


media/articles/body contains responsive WebP renditions of original blog photos with intrinsic sizes and no enlargement. Each original first photo is used as its article hero; remaining original photos render inline. Existing generated service hero fallback remains only for posts without an original image.


media/company holds original About roof and community-photo WebP variants without enlargement.


media/company includes optimized original careers-team WebP variants in addition to existing About/community photos, without enlargement.


media/service-review-01 contains 30 optimized WebP derivatives of ten illustrative siding/gutter detail scenes, at 480/800/1200px and <=110 KB per file. Source originals stay in output/imagegen/service-review-01; captions do not claim customer project provenance.


media/service-review-02 contains 36 WebP derivatives of twelve illustrative roof-detail scenes, plus two optimized copies of an existing genuine GAF Timberline HDZ Barkwood product image. Variants stay <=110 KB; the most detailed scenes cap at 1000px instead of 1200px. Do not present generic sample images as branded GAF products.


media/service-review-03 has 42 WebP derivatives of fourteen illustrative commercial/storm scenes. Every variant is <=110 KB with no enlargement. An ambiguous scupper generation was rejected and excluded from public assets; an internal roof-drain detail replaces it. Provenance is recorded under migration.


media/client-photography contains optimized responsive versions of fourteen inspected supplied sources; no camera originals, EXIF or GPS are published. media/service-review-04 contains six derivatives of two attic illustrations. roofing-heroes/dublin-replacement-client-* replaces one generated hero with four real-photo crops; remaining generated heroes retain their disclosures. Sources and limits are recorded in migration/client-photography-review.json.


media/service-review-05 contains nine landscape WebP derivatives of four inspected client-supplied originals, plus three derivatives of the existing ice-dam illustration. All are <=110 KB, with no enlargement or camera metadata. No new image generation. Source records and exact topic placements are in migration/service-review-05-photo-provenance.json and client-photography-review.json.


media/client-gallery/ contains 265 optimized responsive WebP variants for 77 unique supplied photographs (180 KB per-file limit). Original HEIF/JPEG/reference files remain outside public. Small sources are never upscaled; image metadata is stripped. Exact file/alias/graphic dispositions and byte totals are in migration/client-gallery-inventory.json.
