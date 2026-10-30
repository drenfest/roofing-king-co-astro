# src/pages/blog

Native Astro routing for this URL branch. Read src/pages/_ai-context.md first. Keep native routes separate from the legacy catchall, preserve explicit permalinks and use the existing layout/data for the page family. This map starts with an underscore so Astro does not publish it as a route.

<!-- route-imports:start -->
## Actual route dependencies

- `[hub].astro`: `src/layouts/BlogLayout.astro`, `src/components/BlogHub.astro`, `src/data/blog-hubs.json`.
- `columbus-roof-damage-after-early-august-storms-your-first-72-hours.astro`: `src/layouts/ArticleLayout.astro`, `src/data/blog-articles.json`, `src/data/blog-article-types`.
- `index.astro`: `src/layouts/BlogLayout.astro`, `src/components/CardSection.astro`, `src/data/blog-index.json`.

This index is derived from current imports. Resolve the entry point before editing data; a physical directory alone does not define the content owner.
<!-- route-imports:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/pages](../_ai-context.md).

### Direct files

- [[hub].astro](%5Bhub%5D.astro)
- [columbus-roof-damage-after-early-august-storms-your-first-72-hours.astro](columbus-roof-damage-after-early-august-storms-your-first-72-hours.astro)
- [index.astro](index.astro)

### Child directories

- [[category]/](%5Bcategory%5D/_ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
