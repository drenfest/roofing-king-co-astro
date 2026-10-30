# scripts: authoring, validation and release tools

Normal builds use committed source/data/assets. Authoring, imports, downloads, regeneration and deployment are separate operations. Inspect inputs and side effects before running a script; do not execute an authoring command merely because its name sounds relevant. Preserve unrelated working-tree changes and source evidence.

## Safe daily commands

- npm ci installs the pinned dependencies. CI uses Node 24; package.json records the supported minimum.
- npm run dev serves source changes. npm run build creates dist. npm run preview serves the existing dist; editing source without rebuilding will not update that preview.
- npm run docs:context runs write-context-maps.mjs. It preserves manual guidance and refreshes only delimited inventories/route ownership. --check is read-only. Do not restore the old generator that replaced whole maps with obsolete descriptions.
- npm run check:contexts checks directory coverage, generated blocks, map links, route ownership and the underscore rule for Astro page maps. npm run check:context-output also verifies context files are absent from dist.
- npm run verify is the release gate. Its package.json sequence is authoritative; do not replace it with a stale copied list. Choose focused checks during development, then run the full sequence before a requested push/release.
- check-content.mjs validates retained route metadata; check-built-routes.mjs protects URLs, canonicals, links and referenced assets. Existing regression baselines are intentional, not an invitation to remove assertions when adding a feature.

## Authoring workflows

| Work | Tools / important boundaries |
| --- | --- |
| Service prose/presentation | author-service-landings.mjs and apply-service-pdf.mjs can rewrite many routes and apply family defaults/source copy. Inspect reviewed overrides and ten-page batch records first; update the actual adapter/input if a change must survive regeneration. Do not reset reviewed pages to generic defaults. |
| Review evidence | review-service-pages.mjs, build-service-review.mjs, build-roofing-hero-review.mjs and the migration batch records preserve topic/media verification. Reports are evidence, not substitute customer copy. |
| Manufacturer media | prepare-manufacturer-media.mjs --refresh re-encodes/downloads recorded assets; it is not an automatic manufacturer-catalog discovery tool. prepare-product-color-previews.mjs handles recorded sample-house masks. |
| Trex / LeafFilter accessory authoring | author-product-systems.mjs reads the source expansion record and can rewrite catalogs, details, hubs, hierarchy and manifest entries. Preserve source-specific materials and terms. |
| Ply Gem authoring | author-ply-gem-products.mjs reads actual source records and cached/extracted catalog photos. It can rewrite collection/detail data and content metadata; do not rerun it for an unrelated copy tweak. Cedar Dimensions is polypropylene, not vinyl. |
| Product hierarchy / menu | After relevant catalog authoring: group-trex-collections.mjs when Trex needs regrouping, apply-product-parents.mjs, sync-product-navigation.mjs, build-menu-atlas.mjs, then npm run docs:context. The navigation sync also applies parents. Keep category membership, primary product parents and preserved URLs distinct. |
| Client gallery | prepare-client-gallery.mjs uses the private source inventory/originals, encodes bounded WebPs and records all original file dispositions. Original downloads are not required in CI. |
| Before/after | prepare-service-comparisons.mjs splits the selected aligned source sheets and records optimization; author-service-comparisons.mjs assigns the service families/route-specific titles and disclosures. Never replace illustrative captions with project claims. |
| Other image families | optimize-home-media.mjs, optimize-service-media.mjs, optimize-roofing-heroes.mjs, optimize-service-heroes.mjs, optimize-product-media.mjs, optimize-product-collections.mjs and optimize-company-media.mjs have different registries/budgets; inspect the right family before running one. |
| Articles / hubs | build-blog-articles.mjs, build-blog-hubs.mjs and build-featured-articles.mjs write committed structured content. URL migration is separate: migrate-blog-urls.mjs and blog-url-policy.mjs must preserve aliases and category/tag fallback policy. |
| Location content / maps | polish-location-hubs.mjs and build-coverage-map.mjs are explicit authoring operations. Do not manufacture new location+service URLs or turn a community marker into an incorporated-city boundary. |
| Original import | import-wordpress.mjs and transfer-service-content.mjs are migration tools, not daily content updates. They can overwrite edited content and require external historical inputs. Never run them over reviewed work without a deliberate migration task. |
| Live deployment | deploy-cloudways.sh and check-cloudways-review.mjs are external operations. Follow the workflow/deployment runbook; do not execute them during a local content/docs task. |

Product authors must not overwrite existing context guidance. Refresh inventories after adding routes; do not hand-copy old boilerplate into every new directory. Explicit media refresh flags may download originals; ordinary builds must not require these flags or fetch vendors.

## Shared build integrations

- html-attributes.mjs and src/middleware.ts enforce complete link/image attributes consistently in development and builds. Author correct markup first.
- structured-data.mjs derives one linked graph from visible rendered components. Preserve canonical product/companion IDs, CollectionPage vs ItemPage classification, exact FAQs, source-specific materials/colors/documents and visible illustration disclosures. Extend the compiler and check-structured-data.mjs together. Do not invent offers, ratings, stock, jobs, actions or dates.
- sitemap.mjs writes canonical public URLs and filters aliases, redirects, internal review/error pages. It is not a reason to rename source routes.
- context-output.mjs removes source-only context/entry documents from dist. Context files under src/pages must still use _ai-context.md to prevent route generation in the first place.

## Verification by change

Use the existing product/manufacturer/system/Ply Gem checks for catalog work; service-copy/reviews/heroes/photos/comparisons checks for service work; photography/gallery checks for images; location checks for city hubs; article/blog-hub/URL checks for publishing structure; offers/warranty checks for their pages; and attribute/schema/sitemap checks for every cross-site structural change. Run a real browser check for changed layout or interaction, including mobile, keyboard/touch and no-JavaScript fallbacks where applicable. Keep byte reports for new media.

Do not broaden a test merely to hide a regression. A newly requested standalone section can be excluded explicitly from an older body-heading baseline while all previously reviewed headings remain protected. Verify the behavior the user asked for, not just that a class or data field exists.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [repository](../ai-context.md).

### Direct files

- [apply-product-parents.mjs](apply-product-parents.mjs)
- [apply-service-pdf.mjs](apply-service-pdf.mjs)
- [audit-component-reuse.mjs](audit-component-reuse.mjs)
- [author-ply-gem-products.mjs](author-ply-gem-products.mjs)
- [author-product-systems.mjs](author-product-systems.mjs)
- [author-service-comparisons.mjs](author-service-comparisons.mjs)
- [author-service-landings.mjs](author-service-landings.mjs)
- [blog-url-policy.mjs](blog-url-policy.mjs)
- [build-blog-articles.mjs](build-blog-articles.mjs)
- [build-blog-hubs.mjs](build-blog-hubs.mjs)
- [build-coverage-map.mjs](build-coverage-map.mjs)
- [build-featured-articles.mjs](build-featured-articles.mjs)
- [build-menu-atlas.mjs](build-menu-atlas.mjs)
- [build-roofing-hero-review.mjs](build-roofing-hero-review.mjs)
- [build-service-review.mjs](build-service-review.mjs)
- [check-blog-hubs.mjs](check-blog-hubs.mjs)
- [check-blog-urls.mjs](check-blog-urls.mjs)
- [check-built-routes.mjs](check-built-routes.mjs)
- [check-client-photography.mjs](check-client-photography.mjs)
- [check-cloudways-review.mjs](check-cloudways-review.mjs)
- [check-content.mjs](check-content.mjs)
- [check-context-maps.mjs](check-context-maps.mjs)
- [check-featured-articles.mjs](check-featured-articles.mjs)
- [check-gallery.mjs](check-gallery.mjs)
- [check-homepage.mjs](check-homepage.mjs)
- [check-html-attributes.mjs](check-html-attributes.mjs)
- [check-location-hubs.mjs](check-location-hubs.mjs)
- [check-manufacturer-products.mjs](check-manufacturer-products.mjs)
- [check-native-articles.mjs](check-native-articles.mjs)
- [check-offers-pages.mjs](check-offers-pages.mjs)
- [check-ply-gem-products.mjs](check-ply-gem-products.mjs)
- [check-product-systems.mjs](check-product-systems.mjs)
- [check-products.mjs](check-products.mjs)
- [check-roofing-heroes.mjs](check-roofing-heroes.mjs)
- [check-service-comparisons.mjs](check-service-comparisons.mjs)
- [check-service-pdf.mjs](check-service-pdf.mjs)
- [check-service-photo-pairs.mjs](check-service-photo-pairs.mjs)
- [check-service-reviews.mjs](check-service-reviews.mjs)
- [check-services.mjs](check-services.mjs)
- [check-sitemap.mjs](check-sitemap.mjs)
- [check-structured-data.mjs](check-structured-data.mjs)
- [check-warranty-page.mjs](check-warranty-page.mjs)
- [component-audit-template.html](component-audit-template.html)
- [context-output.mjs](context-output.mjs)
- [deploy-cloudways.sh](deploy-cloudways.sh)
- [extract-service-pdf.py](extract-service-pdf.py)
- [group-trex-collections.mjs](group-trex-collections.mjs)
- [html-attributes.mjs](html-attributes.mjs)
- [import-wordpress.mjs](import-wordpress.mjs)
- [migrate-blog-urls.mjs](migrate-blog-urls.mjs)
- [optimize-company-media.mjs](optimize-company-media.mjs)
- [optimize-gallery.mjs](optimize-gallery.mjs)
- [optimize-home-media.mjs](optimize-home-media.mjs)
- [optimize-product-collections.mjs](optimize-product-collections.mjs)
- [optimize-product-media.mjs](optimize-product-media.mjs)
- [optimize-roofing-heroes.mjs](optimize-roofing-heroes.mjs)
- [optimize-service-heroes.mjs](optimize-service-heroes.mjs)
- [optimize-service-media.mjs](optimize-service-media.mjs)
- [polish-location-hubs.mjs](polish-location-hubs.mjs)
- [prepare-client-gallery.mjs](prepare-client-gallery.mjs)
- [prepare-companion-system-media.mjs](prepare-companion-system-media.mjs)
- [prepare-manufacturer-media.mjs](prepare-manufacturer-media.mjs)
- [prepare-product-color-previews.mjs](prepare-product-color-previews.mjs)
- [prepare-service-comparisons.mjs](prepare-service-comparisons.mjs)
- [review-service-pages.mjs](review-service-pages.mjs)
- [sitemap.mjs](sitemap.mjs)
- [structured-data.mjs](structured-data.mjs)
- [sync-product-navigation.mjs](sync-product-navigation.mjs)
- [thewebguy-logo.txt](thewebguy-logo.txt)
- [transfer-service-content.mjs](transfer-service-content.mjs)
- [write-context-maps.mjs](write-context-maps.mjs)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
