# src: native source system

Astro handles static composition and Svelte handles interactive islands. Start with the root handbook, then read the maps for pages, layouts, components, data and styles. Keep copy/facts in the correct data owner and rendering logic in shared components; do not build a parallel per-page design system.

src/middleware.ts runs the same attribute and schema completion logic used by static build integrations. src/content.config.ts only loads **/index.md from src/content/pages. Metadata records are independent of which native layout renders a URL. The directory named pages is special: its context maps start with an underscore so Astro does not create documentation routes.

Normal rendering uses local committed data/assets. Client-side props must not contain secrets, source export paths, private Drive IDs or original downloads. Preserve readable SSR content and the existing load/visible hydration boundaries. Keep native and retained legacy compatibility code separate.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [repository](../ai-context.md).

### Direct files

- [content.config.ts](content.config.ts)
- [middleware.ts](middleware.ts)

### Child directories

- [components/](components/ai-context.md)
- [content/](content/ai-context.md)
- [data/](data/ai-context.md)
- [layouts/](layouts/ai-context.md)
- [pages/](pages/_ai-context.md)
- [scripts/](scripts/ai-context.md)
- [styles/](styles/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
