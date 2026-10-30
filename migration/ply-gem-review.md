# Ply Gem Performance Collection review

Local review only. Not committed, pushed or deployed.

## Implemented

The preserved Ply Gem collection now displays five actual Performance Collection families, each with an individual native detail page, menu entry, manufacturer catalog hero, color controls, eight specification rows, warranty documents and relevant companion components. Variform remains a separate collection and is linked contextually; its products were not duplicated or renamed as Ply Gem Performance products.

- [cedar-dimensions](http://127.0.0.1:4321/products/siding/vinyl/ply-gem/cedar-dimensions/) — 20 published family color references.
- [dimensions](http://127.0.0.1:4321/products/siding/vinyl/ply-gem/dimensions/) — 24 published family color references.
- [progressions](http://127.0.0.1:4321/products/siding/vinyl/ply-gem/progressions/) — 20 published family color references.
- [performance-board-batten](http://127.0.0.1:4321/products/siding/vinyl/ply-gem/performance-board-batten/) — 17 published family color references.
- [transformations](http://127.0.0.1:4321/products/siding/vinyl/ply-gem/transformations/) — 10 published family color references.

Cedar Dimensions is rigid polypropylene, as explicitly stated in its section of the manufacturer warranty. The four other families are vinyl. Nominal thicknesses, profiles, panel lengths and profile heights are backed by the current manufacturer specification guide and product catalog. No unqualified wind-speed promise, stocked inventory, price or warranty lifespan was added.

## Images and color previews

The catalog’s larger original photographs were extracted from the PDF rather than enlarging the 400-pixel website thumbnails. Each product has a distinct original manufacturer photo and a distinct sample-home color study. Selecting a color changes siding only; the study is clearly labeled as illustrative, and exact panel/profile availability and physical samples remain qualified. Manufacturer profile photographs are linked from the specification documents.

30 new responsive WebP files total 1,918,824 bytes (1.92 MB across the added library). Each derivative stays below 260 KB and within the original dimensions, with EXIF/XMP/IPTC metadata removed. Existing optimized sample-home photos and masks are reused. Raw PDFs and extracted images remain outside public and Git. Exact source document pages and per-file dimensions/bytes are in ply-gem-image-optimization.json.

## Verification

Full npm run verify passed, protecting the existing GAF catalog, all 361 preserved routes, the extended 96-product companion inventory, navigation, HTML attributes, schemas and sitemap. Twelve desktop/mobile checks covered this collection and its five details: visible siding color changes, isolated preview IDs, no overflow, decoded images, warranty/specification/companion controls and no-JavaScript fallback. The sitemap now has 327 canonical public URLs.

## Primary sources

- [Ply Gem Performance Collection](https://www.plygem.com/siding/ply-gem-performance/)
- [Cedar Dimensions](https://www.plygem.com/siding/collections/cedar-dimensions/)
- [Dimensions](https://www.plygem.com/siding/collections/dimensions/)
- [Progressions](https://www.plygem.com/siding/collections/progressions/)
- [Performance Board + Batten](https://www.plygem.com/siding/collections/performance-board-batten/)
- [Transformations](https://www.plygem.com/siding/collections/transformations/)

The linked manufacturer catalog, 2026 specification guide and warranty document are recorded for each product in sources/ply-gem-products.json.
