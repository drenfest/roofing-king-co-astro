# src/pages/decks

Native Astro routing for this URL branch. Read src/pages/_ai-context.md first. Keep native routes separate from the legacy catchall, preserve explicit permalinks and use the existing layout/data for the page family. This map starts with an underscore so Astro does not publish it as a route.

<!-- route-imports:start -->
## Actual route dependencies

- `accessories.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `installations.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `refinishing.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `repairs.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `replacements.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.

This index is derived from current imports. Resolve the entry point before editing data; a physical directory alone does not define the content owner.
<!-- route-imports:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/pages](../_ai-context.md).

### Direct files

- [accessories.astro](accessories.astro)
- [installations.astro](installations.astro)
- [refinishing.astro](refinishing.astro)
- [repairs.astro](repairs.astro)
- [replacements.astro](replacements.astro)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
