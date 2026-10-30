# src/pages/offers

Native Astro routing for this URL branch. Read src/pages/_ai-context.md first. Keep native routes separate from the legacy catchall, preserve explicit permalinks and use the existing layout/data for the page family. This map starts with an underscore so Astro does not publish it as a route.

<!-- route-imports:start -->
## Actual route dependencies

- `[offer].astro`: `src/layouts/OfferLayout.astro`, `src/data/offer-pages`.
- `gaf-system-plus.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/CardSection.astro`, `src/components/MediaContentRow.astro`, `src/components/WarrantyComparison.astro`.
- `index.astro`: `src/layouts/DocumentLayout.astro`, `src/components/SiteHeader.svelte`, `src/components/SiteFooter.astro`, `src/components/PageHero.astro`, `src/components/Breadcrumbs.astro`, `src/components/CardSection.astro`, `src/components/QuoteSection.astro`, `src/data/offer-pages`.

This index is derived from current imports. Resolve the entry point before editing data; a physical directory alone does not define the content owner.
<!-- route-imports:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/pages](../_ai-context.md).

### Direct files

- [[offer].astro](%5Boffer%5D.astro)
- [gaf-system-plus.astro](gaf-system-plus.astro)
- [index.astro](index.astro)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
