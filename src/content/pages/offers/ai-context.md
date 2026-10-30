# src/content/pages/offers

This directory retains a route/source record. Read the ownership block below before deciding where to edit visible content. Do not assume that changing index.md changes a native page. Follow the root, content and page-family maps.

<!-- route-context:start -->
## Route ownership

- Record permalink: `/offers/`.
- Canonical target: `/offers/`.
- Manifest paths using this record: `/offers/`.
- Content family: Offer / warranty information.
- Renderer: `src/layouts/OfferLayout.astro`.
- Edit visible content in: `src/data/offer-pages.ts; src/data/warranty-page.ts`.
- Recorded source: `wordpress`; sourcePath: `/offers/`.

Use the existing offer route or dedicated warranty entry point. Copy must describe actual terms; visitors can call for current details. Do not invent prices, approval or coverage.

Paths above are repository-relative, not relative to this deeply nested directory. Metadata is validated by src/content.config.ts and the route/URL checks.
<!-- route-context:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/content/pages](../ai-context.md).

### Direct files

- [index.md](index.md)

### Child directories

- [3-year-financing/](3-year-financing/ai-context.md)
- [5-year-financing/](5-year-financing/ai-context.md)
- [5-year-workmanship-warranty/](5-year-workmanship-warranty/ai-context.md)
- [christmas-lights-install/](christmas-lights-install/ai-context.md)
- [flexible-financing/](flexible-financing/ai-context.md)
- [gaf-golden-pledge/](gaf-golden-pledge/ai-context.md)
- [gaf-silver-pledge/](gaf-silver-pledge/ai-context.md)
- [gaf-system-plus/](gaf-system-plus/ai-context.md)
- [medallion-bank-financing/](medallion-bank-financing/ai-context.md)
- [payments/](payments/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
