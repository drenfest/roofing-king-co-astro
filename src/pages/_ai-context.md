# src/pages

commercial-roofing.astro renders the native commercial hub through ServicePage with a service-paths section and residential return banner; its key in service-pages.json excludes it from the legacy catchall. roofing.astro uses ServiceLanding and roofing-landing.json; the other native roofing routes continue to use ServicePage. cleveland-oh/roofing.astro renders the native Cleveland location-service page through ServicePage and MediaContentRow. products.astro and products/[...product].astro render authored product hubs and individual records. The legacy catchall excludes those paths. roofing/repair.astro, replacement.astro and the remaining roofing entry points render the other seven native roofing-family pages; the catchall excludes keys in service-pages.json to keep legacy CSS/JS out. index.astro composes the native homepage. [...path].astro generates all other preserved routes from frontmatter and excludes the root path. Both calculator paths add the click-to-load Roofr estimator after their preserved content. 404, robots and migration review are explicit routes. This map is prefixed with an underscore to prevent publication.

## Files

- `404.astro`
- `commercial-roofing.astro`
- `index.astro`
- `migration-review.astro`
- `products.astro`
- `robots.txt.ts`
- `roofing.astro`
- `[...path].astro`

## Subdirectories

- `cleveland-oh/` - read its _ai-context.md.
- `products/` - read its _ai-context.md.
- `roofing/` - read its _ai-context.md.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
