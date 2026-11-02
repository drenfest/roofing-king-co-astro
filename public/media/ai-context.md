# Public media families

Read public/ai-context.md before adding assets. This tree holds published derivatives; private originals, authoring inputs and credentials stay elsewhere. Keep every image connected to source metadata and its owning registry/tool. Context files throughout this tree are removed from dist.

| Family / use | Owner and checks |
| --- | --- |
| Imported wordpress/static-build media | Retained source references; register optimized variants for new placements instead of stretching tiny originals |
| Homepage/company/service/hero derivatives | Matching *-media.json and *-heroes.json registries; optimize with the actual family tool, then verify dimensions, image priority and honest caption |
| Client gallery | project-gallery.json, gallery-media.json, migration/client-gallery-inventory.json and prepare-client-gallery.mjs; account for all source dispositions, no enlargement, no camera metadata, <=180 KB per derivative |
| Reviewed service detail photos | service-section-galleries.json and service-review-media.json; match each of three photos to the opposing heading/paragraph; detail derivatives <=110 KB |
| Service comparisons | service-comparisons.json, service-comparison-media.json and prepare-service-comparisons.mjs; 360/640/800px square states, <=160 KB per file, aligned geometry and visible illustrative captions |
| Product/manufacturer/system images | Product library + family optimization reports; actual materials/colors/brands, <=260 KB where the manufacturer/system checks require it; retain original product-photo links for color studies |
| Product color masks | Source-recorded geometry only; no remote raster/API requests at runtime or private source XML in public; keep instance IDs unique |
| Material collection imagery | product-collection-media.json and optimize-product-collections.mjs; distinct relevant photographs, existing <=190 KB budget |
| Menu atlas | navigation-photo-selections.json -> build-menu-atlas.mjs -> navigation-atlas.json / navigation-images.json; unique destination cells, one delayed request, <=750 KB atlas |
| Logos/badges/illustrations | Preserve authentic proportions/colors and source identity; use existing code-native icon/diagram systems when a diagram is the right asset |

Use actual checks as the final budget contract; do not apply one family threshold blindly to every file. A phone's display density can select a larger responsive variant. Measure per-file and total output bytes before claiming optimization complete. Re-encode from the original source, not a previously downscaled thumbnail. Keep responsive lazy loading for below-fold media and eager/high priority only for the intended hero.

Real before/after pairs must represent the same documented subject with usable alignment. Otherwise create an explicitly illustrative pair, keep the same geometry/camera, and preserve the visible disclosure and matching schema. Never silently alter supplied photography and call the altered result a completed job.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [public](../ai-context.md).

### Direct files

No direct asset files.

### Child directories

- [accessories/](accessories/ai-context.md)
- [articles/](articles/ai-context.md)
- [attic-details/](attic-details/ai-context.md)
- [brands/](brands/ai-context.md)
- [client-gallery/](client-gallery/ai-context.md)
- [client-photography/](client-photography/ai-context.md)
- [company/](company/ai-context.md)
- [deck-details/](deck-details/ai-context.md)
- [gallery/](gallery/ai-context.md)
- [gutter-details/](gutter-details/ai-context.md)
- [home/](home/ai-context.md)
- [manufacturer-products/](manufacturer-products/ai-context.md)
- [navigation/](navigation/ai-context.md)
- [product-collections/](product-collections/ai-context.md)
- [products/](products/ai-context.md)
- [review-platforms/](review-platforms/ai-context.md)
- [roofing-heroes/](roofing-heroes/ai-context.md)
- [section-details/](section-details/ai-context.md)
- [service-comparisons/](service-comparisons/ai-context.md)
- [service-heroes/](service-heroes/ai-context.md)
- [service-illustrations/](service-illustrations/ai-context.md)
- [service-review-01/](service-review-01/ai-context.md)
- [service-review-02/](service-review-02/ai-context.md)
- [service-review-03/](service-review-03/ai-context.md)
- [service-review-04/](service-review-04/ai-context.md)
- [service-review-05/](service-review-05/ai-context.md)
- [services/](services/ai-context.md)
- [siding-guide/](siding-guide/ai-context.md)
- [static-build/](static-build/ai-context.md)
- [weather/](weather/ai-context.md)
- [wordpress/](wordpress/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
