# Roof King website

Static Astro with Svelte islands. Read [the system handbook](ai-context.md) and [repository instructions](AGENTS.md) before extending it. The handbook and directory maps describe the current native page families, data ownership, component contracts and release boundaries; old migration snapshots are evidence, not the current architecture.

## Run

Use the pinned package-lock.json and the Node version supported by package.json (CI uses Node 24).

```sh
npm ci
npm run dev
```

The default local address is http://127.0.0.1:4321/. npm run preview serves dist instead of watching source; run npm run build when that preview needs updated output.

## Find the right owner

- [Routes](src/pages/_ai-context.md): native entry points, metadata, canonicals and the residual legacy catchall.
- [Layouts](src/layouts/ai-context.md): service, product, article, blog hub, offer and legacy shells.
- [Components](src/components/ai-context.md): reuse/extension chooser, interaction and accessibility contracts.
- [Data](src/data/ai-context.md): exact copy, catalog, parent/collection, media, blog and navigation owners.
- [Authoring and checks](scripts/ai-context.md): safe commands, tools that overwrite records, media preparation and product/menu sequencing.
- [Styles](src/styles/ai-context.md): approved ivory/charcoal/orange system, typography and lightweight motion.
- [Assets](public/media/ai-context.md): provenance, responsive registries, optimization budgets and metadata removal.
- [Migration evidence](migration/ai-context.md): preserved URLs, source records, review batches and validation reports.
- [Automation](.github/workflows/ai-context.md): CI, review deployment and live-verification boundaries.

Retained src/content/pages/**/index.md files are metadata/provenance records; native pages often render shared data instead of their bodies. Every leaf map identifies its actual renderer and copy owner. Preserve all manifest URLs and approved alias/redirect history.

## Validate and maintain guidance

```sh
npm run docs:context
npm run check:contexts
npm run verify
```

The context updater changes only its generated inventories/route metadata, preserving manual guidance. Add component/interface decisions outside those blocks. Context files under src/pages use the ignored _ai-context.md name. Context maps in public are source-only and stripped from dist. Generated/vendor/private working directories are outside the maintained map tree.

Full verification builds the static site and checks routes, source copy, components, catalogs/companions, photos/comparisons, location/blog hubs, required attributes, schema, sitemap and context publication boundaries. Use a real desktop/mobile browser review for visual or interaction changes. See [schema coverage](migration/structured-data-review.md) and [comparison evidence](migration/service-comparison-review.md) for the latest corresponding records.

## Review release status

Custom quote areas show booking/phone actions until verified submission delivery exists; click-to-load Roofr is separate. Review noindex/nofollow and robots restrictions remain intentional. A canonical production hostname does not prove DNS cutover or lead delivery.

The main-branch workflow can deploy to the authorized Cloudways review app, including documentation-only commits. Do not push or deploy merely because local checks pass. When publication is requested, follow [the deployment runbook](migration/cloudways-deployment.md) and verify the actual deployed revision and public behavior. No credentials or original private downloads belong in public or context files.
