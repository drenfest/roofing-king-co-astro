# Public asset sources

Assets here are copied into the static build. Never put credentials, source exports, private downloads or original client photographs with camera/GPS metadata here. Context/agent entry documents are source-only: scripts/context-output.mjs removes them from dist; they must not become customer-visible pages or downloads.

Use meaningful source identity and a registered responsive asset family. src/data/media.ts resolves shared image dimensions/srcsets; product/menu/gallery/map families also have explicit registries. Do not infer a project city or job ownership from the folder or filename. All rendered img elements need alt attributes and linked assets need meaningful title attributes.

Optimized public derivatives are the deployable deliverable. Keep original downloads/extracted PDF photographs under private authoring storage, preserve provenance/hashes, avoid enlargement, strip EXIF/GPS and report final bytes. See public/media/ai-context.md for the current family budgets/tools. Maps use the local GeoJSON and public/maps guidance.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [repository](../ai-context.md).

### Direct files

Asset files: 4 ((no extension): 1, .html: 3). Use the media registries and file search for individual derivative names.

### Child directories

- [maps/](maps/ai-context.md)
- [media/](media/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
