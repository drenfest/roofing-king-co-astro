# src/data: content and state ownership

These committed records drive native rendering. Before editing, identify the exact route entry and its layout; retained Markdown often supplies metadata/provenance only. Keep business facts in site.json, meaningful content in typed data, and factual evidence in migration. Normal rendering must not fetch external catalogs, a database or private client downloads.

## Ownership map

| Data | Responsibility |
| --- | --- |
| site.json | Verified company name, canonical URL, phone and office identity |
| home.json / roofing-landing.json | Homepage composition data / the independent reference roofing page |
| service-editorial.json | Per-route service family, city, identity, hero/opening, reviewed presentation, brands and FAQs. The /siding/ opening deliberately includes repairs, replacement, material comparison, vinyl, engineered wood, fiber cement, storm damage and commercial siding with manufacturer links and scrollable tabs. Preserve those authored panels during regeneration. service-hero.ts resolves product destinations through the same productHeroImage helper as product pages. |
| service-copy.json | Complete client/source-led service paragraphs, section/card IDs, topic grouping and explicit budgetSectionId |
| service-families.json / service-overrides.json | Authoring inputs/defaults and targeted overrides; do not regenerate all routes casually |
| service-hierarchy.ts / service-opening.ts / service-pages.json | Actual child-route resolution and retained service adapters/catalog; the old service records are not the polished copy owner |
| roofing-heroes.json / service-heroes.json / service-hero.ts | Route-specific optimized hero selections and provenance; used by heroes and child previews |
| service-section-galleries.json / service-review-media.json | Reviewed three-photo/topic pairings and their responsive assets |
| service-comparisons.json / service-comparison-media.json | Explicit before/after assignments and optimized states; keep illustrative disclosures visible |
| product-library.ts | Merge point for product-catalog.json, manufacturer-products.json, product-accessories.json, ply-gem-products.json and commercial-products.json. Commercial TPO, EPDM and edge metal retain separate comparison groups from shingles, source-specific care and authentic product views. |
| product-details.json / product-pillar.json | Native product details / collection cards and catalog membership |
| product-comparison.ts / product-comparison-specs.json / product-filtering.ts | Build-time comparison adapter, dated manufacturer-backed supplemental facts, shared AND filtering and narrow semantic equivalence for differences. Compare ratings and inch dimensions by standardized values, retaining original wording/sources. Do not use broad material/profile filter buckets as equivalence. Roofing warranties have separate defect, wind and algae rows with published total and initial non-prorated periods, conditional upgrades and applicable US document dates. Never convert lifetime coverage to an estimated lifespan. Every comparison row must be filled and sourced; preserve qualifiers and explicitly document genuinely unpublished figures. Keep test classes separate from warranty speeds, actual thickness separate from nominal sizes, and package-dependent ratings out of unconditional class filters. |
| product-types.ts / product-presentation.ts / product-hub-heroes.json | Typed presentation, family/image resolution and relevant product heroes |
| product-parents.json | One primary product parent for companion detail pages, independent of preserved URLs and other collection membership |
| trex-collections.json | Trex Decking, Railing and Deck accessories memberships; the menu stops at these categories |
| product-companions.json / product-system-companions.json / product-system-companions.ts / commercial-product-companions.json | Detailed HDZ system and shared brand/product-specific companion resolution. Commercial relationships retain manufacturer-related or explicitly shared-system evidence, canonical component pages and qualified installation notes. commercial-product-media.json registers responsive product views and thumbnails. |
| product-energy.json / product-explanations.ts | Actual performance data and badge explanations, with product-specific sources |
| site-structure.json / page-structure.ts | Breadcrumb/hierarchy and retained section placement; navigation placement does not rename a URL |
| navigation.json / imported-shell.json | Native menu data and retained legacy header/footer representation |
| navigation-photo-selections.json / navigation-atlas.json / navigation-images.json | Explicit unique menu image choices and generated one-request atlas metadata |
| brand-library.json / brand-pages.json | Proportional source logos, brand identity, material categories and existing product-library destinations. Keep service-editorial.json, service-pages.json and product-pillar.json brandIds current with all catalog brands in each represented material category; About uses home.brands. Do not leave roofing bars at GAF alone or siding bars at the original four brands. Preserve empty brand selections for services without documented manufacturers. |
| blog-articles.json / blog-article-types.ts | Structured native article bodies, photos, FAQ sections, source author/date and hero |
| blog-routes.json / blog-url-map.json | Category-first canonical article URL policy, term assignments and preserved aliases |
| blog-index.json / blog-hubs.json / blog-archives.json | Main/category/topic hubs and actual collection membership |
| featured-articles.json / featured-articles.ts | Contextual cards for relevant service families and location topics; no empty block |
| project-gallery.json / project-gallery.ts / gallery-media.json | Curated photo inventory, service tags, supplied/reference kinds, two-row page batches and responsive derivatives |
| coverage-map.json / location-profiles.json / service-area-directory.ts | Real city boundaries/community marker, focused city copy and location-service link resolution |
| reviews-page.json / featured-reviews.json / review-platforms.json | Verified review excerpts and external source/platform identity |
| offer-pages.ts / warranty-page.ts / faq-page.ts | Purpose-specific offer, qualified warranty and FAQ content |
| roofr.json | Public estimator/booking configuration; no credentials or submission secrets |
| media.ts and *-media.json | Shared intrinsic dimensions/srcsets, assembled from asset-family registries |
| section-types.ts | Shared headings, RichNode, section and service interfaces; extend deliberately |

Product lifespan/care is selected by material and component type in product-care.ts from product-care.json. Put exact collection text in the product care/specificationsIntro fields; never apply Lineage�s seven colors or 50-year warranty to other products. project-contact.json holds the approved shared booking/call copy.

## Add or extend a product

Use an existing product as the shape reference, then verify the actual manufacturer page/catalog/installation/warranty evidence. Add a stable key to the correct catalog source and a detail record, collection membership, hero, source documents, metadata record and manifest entry. Preserve the original GAF regression subset; do not delete assertions to make new records pass. Product source metadata must distinguish vinyl, polypropylene, fiber cement, engineered wood, PVC and composite correctly.

Keep colors, photographs and samples honest. Exact product photographs stay available when a local SVG color study illustrates a sample house. A family color list is not SKU inventory or a guarantee of profile availability. Keep per-instance SVG IDs unique. Do not recolor roofs, trim or windows when selecting siding colors.

For companions, set a primary relationship in product-parents.json only when appropriate. Apply parents before syncing navigation; keep links from other relevant products and retain category membership. A shared accessory gets one canonical page, not duplicate pages beneath each compatible board. Do not turn a complementary link into a guaranteed compatible kit.

Trex category grouping is an explicit authoring operation. Follow the sequence in scripts/ai-context.md before rebuilding the menu atlas. Keep old detail paths even though their breadcrumb parent is now a product.

## Add or extend a service/location

Keep presentation and prose separate. Preserve full source paragraphs, links, FAQ answers, topic IDs and the explicit estimate-section ID. Update the family authoring inputs/adapter deliberately if the change must survive reauthoring; never regenerate every reviewed page as a convenience. Use the ten-page review records to preserve the current hierarchy and photo/topic matches.

Location service tabs should cover all supported services and descendants. Prefer an existing local service destination; otherwise use the central service page. Do not create cloned city+service pages without a specific content requirement. Images and copy must not imply a local completed job without evidence.

## Add an article or gallery image

For articles, preserve or source title, author, publication date, actual terms, canonical URL, first-image hero and remaining body photos. Category is the first URL segment when assigned, otherwise the first canonical tag, with the approved fallback policy. Update archives/hubs/featured cards and redirect aliases together. Reuse structured article sections and the existing FAQ component.

For photographs, maintain source IDs privately in authoring evidence and public subject tags/captions in gallery data. Classify by what the image actually shows; a supplied reference is not automatically a Roof King project. Register all variants through the appropriate media manifest, strip private metadata and retain no-JS links. Never add an unrelated image merely to fill a gallery category.

After structural changes, run npm run docs:context and the relevant catalog/content/photo/schema checks. This is data ownership guidance, not permission to publish or rerun a destructive importer.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [article-media.json](article-media.json)
- [blog-archives.json](blog-archives.json)
- [blog-article-media.json](blog-article-media.json)
- [blog-article-types.ts](blog-article-types.ts)
- [blog-articles.json](blog-articles.json)
- [blog-hubs.json](blog-hubs.json)
- [blog-index.json](blog-index.json)
- [blog-routes.json](blog-routes.json)
- [blog-url-map.json](blog-url-map.json)
- [brand-library.json](brand-library.json)
- [brand-pages.json](brand-pages.json)
- [commercial-product-companions.json](commercial-product-companions.json)
- [commercial-product-media.json](commercial-product-media.json)
- [commercial-products.json](commercial-products.json)
- [company-media.json](company-media.json)
- [coverage-map.json](coverage-map.json)
- [faq-page.ts](faq-page.ts)
- [featured-articles.json](featured-articles.json)
- [featured-articles.ts](featured-articles.ts)
- [featured-reviews.json](featured-reviews.json)
- [gallery-media.json](gallery-media.json)
- [gutter-detail-media.json](gutter-detail-media.json)
- [home-media.json](home-media.json)
- [home.json](home.json)
- [imported-shell.json](imported-shell.json)
- [location-profiles.json](location-profiles.json)
- [manufacturer-products.json](manufacturer-products.json)
- [media.ts](media.ts)
- [navigation-atlas.json](navigation-atlas.json)
- [navigation-images.json](navigation-images.json)
- [navigation-photo-selections.json](navigation-photo-selections.json)
- [navigation.json](navigation.json)
- [offer-pages.ts](offer-pages.ts)
- [page-structure.ts](page-structure.ts)
- [ply-gem-products.json](ply-gem-products.json)
- [product-accessories.json](product-accessories.json)
- [product-care.json](product-care.json)
- [product-care.ts](product-care.ts)
- [product-catalog.json](product-catalog.json)
- [product-collection-media.json](product-collection-media.json)
- [product-companions.json](product-companions.json)
- [product-comparison-specs.json](product-comparison-specs.json)
- [product-comparison-types.ts](product-comparison-types.ts)
- [product-comparison.ts](product-comparison.ts)
- [product-details.json](product-details.json)
- [product-energy.json](product-energy.json)
- [product-explanations.ts](product-explanations.ts)
- [product-filtering.ts](product-filtering.ts)
- [product-hub-heroes.json](product-hub-heroes.json)
- [product-library.ts](product-library.ts)
- [product-parents.json](product-parents.json)
- [product-pillar.json](product-pillar.json)
- [product-presentation.ts](product-presentation.ts)
- [product-system-companions.json](product-system-companions.json)
- [product-system-companions.ts](product-system-companions.ts)
- [product-types.ts](product-types.ts)
- [project-contact.json](project-contact.json)
- [project-gallery.json](project-gallery.json)
- [project-gallery.ts](project-gallery.ts)
- [review-platforms.json](review-platforms.json)
- [review-source-policy.ts](review-source-policy.ts)
- [reviews-page.json](reviews-page.json)
- [roofing-hero-media.json](roofing-hero-media.json)
- [roofing-heroes.json](roofing-heroes.json)
- [roofing-landing.json](roofing-landing.json)
- [roofr.json](roofr.json)
- [section-types.ts](section-types.ts)
- [service-area-directory.ts](service-area-directory.ts)
- [service-comparison-media.json](service-comparison-media.json)
- [service-comparisons.json](service-comparisons.json)
- [service-copy.json](service-copy.json)
- [service-editorial.json](service-editorial.json)
- [service-families.json](service-families.json)
- [service-hero-media.json](service-hero-media.json)
- [service-hero.ts](service-hero.ts)
- [service-heroes.json](service-heroes.json)
- [service-hierarchy.ts](service-hierarchy.ts)
- [service-media.json](service-media.json)
- [service-opening.ts](service-opening.ts)
- [service-overrides.json](service-overrides.json)
- [service-pages.json](service-pages.json)
- [service-review-media.json](service-review-media.json)
- [service-reviews.ts](service-reviews.ts)
- [service-section-galleries.json](service-section-galleries.json)
- [site-structure.json](site-structure.json)
- [site.json](site.json)
- [trex-collections.json](trex-collections.json)
- [warranty-page.ts](warranty-page.ts)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->

The November 2026 siding review is implemented in service-editorial.json, service-copy.json and service-overrides.json for five pages; migration/siding-content-review-2026-11-01.json records source and decisions. featured-reviews.json services tags describe actual customer work. service-reviews.ts prioritizes the newest matching records. Every service page retains sourced feedback: where there is no exact match, related/company reviews are explicitly labeled as company experiences with the actual work named on each card. Never tag a roofing/gutter testimonial as siding or a residential job as commercial.

Customer reviews must come from external review platforms only (Google, BBB, Angi or Birdeye). Never select testimonials from roofkingco.com or internal review routes. Use review-source-policy.ts and retain clearly labeled general-company fallback where no exact-service external review exists.

The commercial roofing hub and repair page use the client-supplied November 2026 PDFs, recorded in migration/commercial-roofing-client-copy-2026-11-01.json. Their service tabs, unnumbered repair-planning disclosures, matched photo sections and six FAQs remain in service-editorial.json/service-copy.json and regeneration overrides. Keep TPO, EPDM and metal distinct; do not introduce PVC or a universal commercial warranty.

The commercial replacement and roof-types PDFs are recorded in migration/commercial-replacement-types-client-copy-2026-11-01.json. Their TPO/EPDM/metal selector uses MaterialInstallation, existing optimized product/service images and seven FAQSection entries each. Keep modified bitumen/built-up roofs as identification context; PVC is not offered. Preserve unnumbered planning cards and project-specific warranty qualifications.

The four main storm pages use ROOF-K_4.PDF (migration/storm-content-review-2026-11-01.json): 5 residential hub topics plus the retained Commercial Storm Damage tab, 5 hail tabs, 7 wind tabs and 6 insurance tabs. Keep insurance decisions with the insurer, the inspection/construction role with Roof King, verified Ohio rule links and unnumbered disclosures. No assumed adjuster attendance, deductible waiver, claim approval, 24/7 response or universal shingle protection. Class 4/wind cards use the existing sourced catalog values and actual product pictures. Keep source annotations out of customer copy. Do not apply the report’s suggested location redirects as an incidental content edit.

Keep Commercial Storm Damage as a dedicated tab in the /storm-damage/ selector, linking to /storm-damage/commercial/. It must not be reduced to an introductory inline link when rewriting residential storm topics.
