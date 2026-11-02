# scripts: authoring, validation and release tools

Normal builds use committed source/data/assets. Authoring, imports, downloads, regeneration and deployment are separate operations. Inspect inputs and side effects before running a script; do not execute an authoring command merely because its name sounds relevant. Preserve unrelated working-tree changes and source evidence.

`check-service-photo-pairs.mjs` accepts both the original editorial batches and source-led `*-content-review-YYYY-MM-DD.json` records containing `pages[].photoReview`. A source-led record must include a source SHA-256 and exact reviewed image/heading/topic assignments matching the runtime gallery. It does not advance the original ten-page batch count. All routes still receive the same three-photo, topic coverage, intrinsic dimension, lazy responsive loading and 110 KB per-variant checks.

## Safe daily commands

`internal-links.mjs` performs approved page-specific link enrichment using `src/data/internal-link-plan.json`. It is shared by dev middleware and a static build integration, runs before attribute/schema completion, and uses idempotent instruction IDs. Match exact paragraph context first; preserve text and inline formatting, never nest anchors, and retain image elements for image-link retargets. Missing/ambiguous placements fail the build rather than silently moving links. `check:internal-links` validates generated HTML; `node scripts/check-internal-links.mjs --local` is an optional targeted local diagnostic. Proposal provenance and preservation evidence are recorded in `migration/internal-links-review-2026-11-01.json`.

- npm ci installs the pinned dependencies. CI uses Node 24; package.json records the supported minimum.
- npm run dev serves source changes. npm run build creates dist. npm run preview serves the existing dist; editing source without rebuilding will not update that preview.
- npm run docs:context runs write-context-maps.mjs. It preserves manual guidance and refreshes only delimited inventories/route ownership. --check is read-only. Do not restore the old generator that replaced whole maps with obsolete descriptions.
- npm run check:contexts checks directory coverage, generated blocks, map links, route ownership and the underscore rule for Astro page maps. npm run check:context-output also verifies context files are absent from dist.
- npm run verify is the release gate. Its package.json sequence is authoritative; do not replace it with a stale copied list. GitHub Actions runs the full sequence on pushes and pull requests. Running it or focused checks locally is optional; an authorized push must not be blocked by local verification or missing local test tools.
- check-content.mjs validates retained route metadata; check-built-routes.mjs protects URLs, canonicals, links and referenced assets. Existing regression baselines are intentional, not an invitation to remove assertions when adding a feature.
- check-product-comparisons.mjs checks all 96 product mappings, complete sourced cells across the 72 cross-brand pages, valid same-use alternatives, truthful rating filters, SSR tables/schema and bounded per-page payloads. A missing comparison value fails the build adapter; add a verified supplemental fact rather than suppressing the check or inventing a number.

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

Mule-Hide authoring: crawl-mulehide-catalog.mjs (also reached through import-mulehide-commercial.mjs) discovers the TPO, EPDM and edge-metal ranges plus seven supporting component categories, follows manufacturer related-product references, and records every exclusion. Raw HTML/images stay in tmp; the committed source capture records product text, features, colors, documents, SKU tables, hashes and image variants. author-mulehide-catalog.mjs updates the existing product library, collections, detail pages, source records, media and product-specific related-component sets without removing routes. Then sync product navigation, rebuild the menu atlas and refresh context maps. Commercial detail pages stay in their collections and companion links rather than flooding the menu. Preserve the distinction between client-confirmed metal roofing and documented perimeter metal. Exclude PVC offerings; shared-system or manufacturer-related links never establish a preapproved kit. check-commercial-products.mjs validates source completeness and rendered output in CI; --source-only checks local authoring data and assets without a build.

## Shared build integrations

- html-attributes.mjs and src/middleware.ts enforce complete link/image attributes consistently in development and builds. Author correct markup first.
- structured-data.mjs derives one linked graph from visible rendered components. Preserve canonical product/companion IDs, CollectionPage vs ItemPage classification, exact FAQs, source-specific materials/colors/documents and visible illustration disclosures. Extend the compiler and check-structured-data.mjs together. Do not invent offers, ratings, stock, jobs, actions or dates.
- sitemap.mjs writes canonical public URLs and filters aliases, redirects, internal review/error pages. It is not a reason to rename source routes.
- context-output.mjs removes source-only context/entry documents from dist. Context files under src/pages must still use _ai-context.md to prevent route generation in the first place.

## Verification by change

The following checks describe CI coverage and optional debugging choices, not a mandatory local/model checklist. Use GitHub status only for routine handoff; never load the full verification output into model context. Retrieve a bounded failed-step excerpt only when troubleshooting.

Use the existing product/manufacturer/system/Ply Gem checks for catalog work; service-copy/reviews/heroes/photos/comparisons checks for service work; photography/gallery checks for images; location checks for city hubs; article/blog-hub/URL checks for publishing structure; offers/warranty checks for their pages; and attribute/schema/sitemap checks for every cross-site structural change. A real browser review is useful for layout or interaction changes, including mobile, keyboard/touch and no-JavaScript fallbacks where applicable, but is optional and must not become a local push prerequisite. Automated CI checks do not prove visual quality. Keep byte reports for new media.

Do not broaden a test merely to hide a regression. A newly requested standalone section can be excluded explicitly from an older body-heading baseline while all previously reviewed headings remain protected. Verify the behavior the user asked for, not just that a class or data field exists.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [repository](../ai-context.md).

### Direct files

- [apply-product-parents.mjs](apply-product-parents.mjs)
- [apply-service-pdf.mjs](apply-service-pdf.mjs)
- [audit-component-reuse.mjs](audit-component-reuse.mjs)
- [author-mulehide-catalog.mjs](author-mulehide-catalog.mjs)
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
- [check-commercial-products.mjs](check-commercial-products.mjs)
- [check-content.mjs](check-content.mjs)
- [check-context-maps.mjs](check-context-maps.mjs)
- [check-copy-corrections.mjs](check-copy-corrections.mjs)
- [check-featured-articles.mjs](check-featured-articles.mjs)
- [check-gallery.mjs](check-gallery.mjs)
- [check-homepage.mjs](check-homepage.mjs)
- [check-html-attributes.mjs](check-html-attributes.mjs)
- [check-internal-links.mjs](check-internal-links.mjs)
- [check-location-hubs.mjs](check-location-hubs.mjs)
- [check-manufacturer-products.mjs](check-manufacturer-products.mjs)
- [check-native-articles.mjs](check-native-articles.mjs)
- [check-offers-pages.mjs](check-offers-pages.mjs)
- [check-ply-gem-products.mjs](check-ply-gem-products.mjs)
- [check-product-comparisons.mjs](check-product-comparisons.mjs)
- [check-product-systems.mjs](check-product-systems.mjs)
- [check-products.mjs](check-products.mjs)
- [check-release-tools.mjs](check-release-tools.mjs)
- [check-roofing-heroes.mjs](check-roofing-heroes.mjs)
- [check-service-comparisons.mjs](check-service-comparisons.mjs)
- [check-service-pdf.mjs](check-service-pdf.mjs)
- [check-service-photo-pairs.mjs](check-service-photo-pairs.mjs)
- [check-service-reviews.mjs](check-service-reviews.mjs)
- [check-services.mjs](check-services.mjs)
- [check-siding-content-review.mjs](check-siding-content-review.mjs)
- [check-sitemap.mjs](check-sitemap.mjs)
- [check-structured-data.mjs](check-structured-data.mjs)
- [check-warranty-page.mjs](check-warranty-page.mjs)
- [component-audit-template.html](component-audit-template.html)
- [contact-checks.mjs](contact-checks.mjs)
- [context-output.mjs](context-output.mjs)
- [crawl-mulehide-catalog.mjs](crawl-mulehide-catalog.mjs)
- [deploy-cloudways.sh](deploy-cloudways.sh)
- [extract-service-pdf.py](extract-service-pdf.py)
- [go-live.mjs](go-live.mjs)
- [group-trex-collections.mjs](group-trex-collections.mjs)
- [html-attributes.mjs](html-attributes.mjs)
- [import-mulehide-commercial.mjs](import-mulehide-commercial.mjs)
- [import-wordpress.mjs](import-wordpress.mjs)
- [internal-links.mjs](internal-links.mjs)
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
- [verification-groups.mjs](verification-groups.mjs)
- [verify.mjs](verify.mjs)
- [write-context-maps.mjs](write-context-maps.mjs)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->

check:siding-review is part of the GitHub-owned verify gate. It protects the five reviewed selectors, real material comparison, seven FAQs, retained horizontal material component and source-matched customer reviews. The client-confirmed $47 financing offer is permitted; do not classify that approved offer as an unverified claim.

verify.mjs runs the ordered verify:steps manifest in GitHub. Source/type/build failures stop dependent work; after a successful build, checks continue independently and emit one VERIFICATION_RESULT summary of all failing check names. Deployment remains blocked on any failure. Models should consume that compact result and bounded error excerpts, not successful logs.

For an authorized go-live request, commit the approved changes and run `npm run go-live`. This pushes committed main and stays attached to the matching GitHub release; it reports the active flow, immediately surfaces failure annotations with check/file/page details, exits nonzero on failure, and confirms the public release marker before reporting LIVE. Use `npm run deploy:watch` to attach after an existing push. Keep following the command until it returns; fix a reported failure, commit, and run it again. Do not replace this with a push-only handoff or a chat-specific scheduled monitor.
