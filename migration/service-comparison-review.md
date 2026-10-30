# Service before-and-after comparisons

Local implementation; no commit, push or deployment performed in this pass.

- Coverage: all 84 service, location, cost and calculator pages, with one explicitly assigned comparison per route.
- Photography reviewed: 77 unique supplied photographs, 26 retained legacy gallery photographs, and the existing homepage comparison. No suitable aligned, documented pair was identified.
- Selected images: 20 service-specific illustrative pairs, 40 separate image states. Each pair is visibly captioned as an illustration rather than a documented Roof King project. No location, manufacturer, completed-job or insurance-evidence claim is inferred.
- Creation method: built-in image generation. Full prompts and offline selected originals are recorded in [service-comparison-sources.json](service-comparison-sources.json). No CLI or external visualization service is required at runtime.
- Final assets: public/media/service-comparisons/ (120 WebP files). Responsive widths: 360, 640 and 800 pixels, without enlargement; source metadata removed.
- Original source sheets: 63,041,465 bytes. All responsive derivatives: 10,598,644 bytes (83.2% smaller than the originals). A page requests only its assigned pair, not the full asset set.
- Largest 360px pair: 96,112 bytes. Largest 800px pair: 315,054 bytes. Browser selection also depends on display density. Individual files stay below 160,000 bytes.
- Shared components: ComparisonSection and BeforeAfter retain native keyboard/touch range interaction, client-visible hydration and lazy image loading. Direct before/after links remain available without JavaScript.
- Browser verification: 46 desktop/mobile route checks covering all 20 pair types, with keyboard minimum/maximum, arrow increments, native mobile touch swipes, image decoding, no overflow and no page errors. Screenshots and JSON are under tmp/service-comparison-review/.
- Static comparison check covers all 84 routes, complete assignments, captions, alt attributes, dimensions, responsive sources, budgets and metadata.
- Existing service prose, heading grouping, URLs, canonical paths, galleries and disconnected quote forms are preserved. The heading-review regression check excludes this newly requested standalone comparison heading while continuing to protect the previously reviewed body outline.

Full-site verification log: tmp/service-comparisons-verify.log.

Final verification: npm run verify passed; all 364 preserved static routes, 330 canonical sitemap URLs, full source-copy checks, location headings, required attributes, structured data, product catalogs and galleries passed. The known unrelated ReviewCollection initial-state warning remains; zero source-check errors.

Final browser run passed 46 desktop/mobile route checks after the caption contrast and location-title refinements. Representative endpoint screenshots confirm that moving the slider visibly changes the image. Source PNGs remain outside the public asset tree; ordinary builds require no generation service or originals.
