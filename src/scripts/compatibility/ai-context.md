# src/scripts/compatibility: legacy-only adapters

These modules support retained WordPress-style rk-* markup and selectors. They are not the default implementation for new navigation, galleries, comparisons or entrance effects. New native pages reuse SiteHeader/MegaMenu, ProjectGallery, BeforeAfter and SiteMotion.

When fixing a retained route, inspect its exact markup and shell before changing a selector. Avoid duplicate initialization against native components and preserve keyboard/no-JavaScript fallbacks. A native conversion should remove the need for the relevant legacy wiring without changing its preserved URL.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/scripts](../ai-context.md).

### Direct files

- [before-after.js](before-after.js)
- [gallery.js](gallery.js)
- [navigation.js](navigation.js)
- [reveal.js](reveal.js)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
