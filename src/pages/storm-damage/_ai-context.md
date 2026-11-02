# src/pages/storm-damage

Native Astro routing for this URL branch. Read src/pages/_ai-context.md first. Keep native routes separate from the legacy catchall, preserve explicit permalinks and use the existing layout/data for the page family. This map starts with an underscore so Astro does not publish it as a route.

<!-- route-imports:start -->
## Actual route dependencies

- `commercial.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `hail.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `insurance-claims.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `residential.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.
- `wind.astro`: `src/layouts/PolishedServicePage.astro`, `src/data/service-editorial.json`.

This index is derived from current imports. Resolve the entry point before editing data; a physical directory alone does not define the content owner.
<!-- route-imports:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/pages](../_ai-context.md).

### Direct files

- [commercial.astro](commercial.astro)
- [hail.astro](hail.astro)
- [insurance-claims.astro](insurance-claims.astro)
- [residential.astro](residential.astro)
- [wind.astro](wind.astro)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
