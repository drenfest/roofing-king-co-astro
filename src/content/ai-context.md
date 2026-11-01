# src/content: retained route metadata and provenance

src/content.config.ts loads only src/content/pages/**/index.md. Context documents are not collection entries. Each index record retains a title, exact permalink, description, canonicalPath, category, source/sourcePath, nullable wordpressId, reviewStatus, notes and priority.

The metadata record is not necessarily the visible copy owner. Native service, product, article, hub and company pages read shared data/compositions instead of rendering the imported body. Residual legacy routes can still render that body. Read the generated ownership block in the leaf map before editing.

Keep source origin and canonical/redirect history intact. Adding a native renderer also requires the manifest, appropriate data/hierarchy and catchall exclusion; do not delete the retained record merely because it is not directly rendered. Context updater inventories are derived; manual instructions and special constraints belong outside their generated blocks.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

No direct source files.

### Child directories

- [pages/](pages/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
