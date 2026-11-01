# src/scripts: retained browser behavior

Native state belongs in the existing Svelte islands or small component-local scripts. This directory also holds compatibility modules for preserved WordPress markup. Do not initialize both native and compatibility behavior on the same menu/gallery/comparison or import legacy behavior into a new native layout.

Keep event listeners scoped, idempotent and removable where necessary. Preserve SSR links/content, keyboard and touch access, reduced motion and per-component lifecycle choices. No secrets, external authoring APIs or source exports belong in browser code.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [motion.ts](motion.ts)
- [service-area-map.ts](service-area-map.ts)

### Child directories

- [compatibility/](compatibility/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
