# src/data

service-hierarchy.ts checks the preserved route manifest for direct child URLs; use ServicePaths only on parent pages and ServiceArticle on leaves. service-families.json contains 39 authored service briefs. service-editorial.json is the committed per-route composition for 84 service/location/cost/calculator URLs; /roofing/ remains the approved independent reference in roofing-landing.json. Generate explicit routes and editorial data through scripts/author-service-landings.mjs after deliberately editing its route mapping, city context or the family briefs. Each route selects its own metadata, child links, topics, relevant brand IDs, curated images, estimate items and FAQs. Do not infer project locations or label stock/site imagery as a verified local job. Old source HTML and service-pages.json remain migration evidence; only the GAF catalog continues using its migrated service record. service-opening.ts remains a transitional adapter for that legacy architecture. media.ts merges local responsive image dimensions. Business identity lives in site.json, verified reviews in featured-reviews.json, Roofr public configuration in roofr.json. Product records and hierarchy remain separate from local service pages. Credentials, product availability, warranty terms and final production release need client verification; custom form delivery stays disabled.

## Files

- `brand-library.json`
- `brand-pages.json`
- `featured-reviews.json`
- `home-media.json`
- `home.json`
- `imported-shell.json`
- `media.ts`
- `navigation.json`
- `page-structure.ts`
- `product-catalog.json`
- `product-companions.json`
- `product-details.json`
- `product-energy.json`
- `product-explanations.ts`
- `product-pillar.json`
- `product-types.ts`
- `review-platforms.json`
- `roofing-landing.json`
- `roofr.json`
- `section-types.ts`
- `service-editorial.json`
- `service-families.json`
- `service-hierarchy.ts`
- `service-media.json`
- `service-opening.ts`
- `service-pages.json`
- `site-structure.json`
- `site.json`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## Full service copy

service-copy.json contains the 83 PDF-derived page records: source IDs/pages/hash, rich lead, content bands, closing copy, internal links and complete expected text. service-editorial.json supplies metadata, hero, parent/leaf openings, brands and FAQs. /roofing/ stays in roofing-landing.json. Rich paragraphs use section-types.ts RichNode, including inline anchors. service-media.json includes responsive variants for nine generated illustrations. Regenerate deliberately with scripts/apply-service-pdf.mjs; ordinary builds do not require the PDF or Python. Original copy and adaptations remain in migration evidence.

service-overrides.json stores explicit client-directed revisions after the PDF transfer, with dated primary sources, complete page fields and independent expected content blocks. The Master Elite route now leads with homeowner benefits and verified GAF warranty choices. These overrides are reapplied by apply-service-pdf.mjs and must survive regeneration.

The homepage inspection heading uses roof and siding (client correction); the verified booking URL retains its existing Calendly event slug.

Storm Damage appears in Services directly below Commercial Roofing, with hail, wind, documentation and commercial children; retain these destinations when editing menus. The homepage lists storm damage second and mentions restoration in the hero.

reviews-page.json contains the independent review profile destinations, topic mapping and three additional short BBB/Birdeye excerpts verified October 20, 2026. Existing featured-reviews.json remains the three-card sitewide selection. Keep exact excerpts, source provenance and dates; never infer stars or combine platform totals. No self-serving review/aggregate schema is generated.

roofing-heroes.json maps 41 roofing-related routes to individual illustrative generated hero images. roofing-hero-media.json supplies responsive dimensions/srcsets via media.ts. These presentation maps override source hero imagery without rewriting service-editorial.json or its PDF content. Rebuild assets with scripts/optimize-roofing-heroes.mjs after generation; provenance/prompts live in migration/roofing-hero-images.json.

Blog is a direct child of About, with its complete Categories and Topics branches. The redundant Blog leaf under Resources was consolidated into that branch; all previous destination URLs remain available.

Homepage hero titleEmphasis identifies the italic final phrase; note supplies the short helper line. Existing booking URL, review count and rating are retained.

home.json services.items image records select existing site photography for all eight homepage service cards, including visibly damaged shingles for storm damage. These are illustrative service images, not claims of specific completed jobs.

The homepage gallery has titleEmphasis, photo category and caption fields. Captions/alt text describe inspected source images without invented job locations or damage causes. All ten original images remain; ordering leads with exterior, overhead and preparation details.
