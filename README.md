# Roof King - Astro rebuild

Astro with Svelte islands, seeded from the Roof King WordPress database and the three-version URL inventory. The WordPress visual design is the reference for the new components.

## Current milestone

All published WordPress records and all inventoried routes are imported. Additional WordPress topic/tag archives and pagination discovered in internal links are also included. See `migration/route-manifest.json` for the authoritative count and content origins.

The homepage now uses native Astro sections with Svelte islands for navigation, project filters/lightbox, before-and-after comparison, and the quote modal. The WordPress layout, imagery, content and links are retained. All eight routes in the `/roofing/` family and `/cleveland-oh/roofing/` now use the same native component system. Cleveland uses reusable MediaContentRow sections with media and product-pillar links. The product pillar adds three native hubs and eleven individual product pages; remaining legacy routes still use the content-preservation baseline. Content has not been independently fact-checked, and this is not a production release.

The quote form and modal are built, with online submission deliberately disabled at the user's direction until lead delivery is connected. Calls and the existing Calendly inspection link remain available. Native dialogs provide modal focus handling and Escape support. Gallery images and all page text render on the server, while filters and comparison hydrate when visible.

The two preserved calculator URLs now use Roof King's existing published Roofr Website estimator. Its iframe loads only after the visitor starts it, with a direct link fallback. See `migration/roofr-integration.md` for verified account settings, lead-field mapping and the remaining Zapier/booking work. The custom quote form is not connected yet.

## Run and validate

Requires Node 24 (Node >=22.12 also supported by this project).

```sh
npm ci
npm run dev
npm run verify
```

Open `http://127.0.0.1:4321/`. The searchable route/source review is at `/migration-review/`.

`npm run verify` runs Astro and Svelte diagnostics, content validation, a production static build, checks for every protected route, canonical target, broken internal links and referenced HTML assets, and homepage regression checks. The same command is configured in GitHub Actions.

Initial validation on October 17, 2026 passed locally for all 215 content routes. The first GitHub Actions run was blocked before starting any jobs: GitHub reported failed account payments or a spending-limit issue. Resolve that account setting before relying on hosted CI; this is not a successful CI run.

## Where to edit

- `src/content/pages/**/index.md`: one editable Markdown document per preserved URL. Frontmatter defines the exact `permalink` independently of navigation or file grouping. The body currently contains the imported HTML sections.
- `src/content.config.ts`: schema and content collection loader.
- `src/pages/index.astro`: native homepage composition, using `DocumentLayout.astro` for metadata and the document shell.
- `src/layouts/SiteLayout.astro`: legacy page shell and temporary behavior wiring for pages awaiting component conversion.
- `src/data/home.json`, `navigation.json`, `home-media.json`: homepage content, navigation, image dimensions and responsive variants. The original root Markdown record remains migration evidence and supplies the description; its body is no longer rendered.
- `src/data/site.json`: client-supplied business details. Do not scatter these values through future components.
- `src/components/`: reusable Astro sections and the interactive Svelte components. Directory maps describe each responsibility.
- `src/styles/`: WordPress reference styling and migration adjustments.
- `public/media/`: copied website media and optimized homepage WebP variants; no WordPress runtime is required.
- `migration/`: route inventory, provenance, source exports and editorial/rebuild notes.

Read `ai-context.md` at the root and in each directory you work in. `AGENTS.md` and `CLAUDE.md` point agents to these maps. Context files in content directories are excluded from the page collection by its `**/index.md` pattern.

The route directory uses `src/pages/_ai-context.md` so Astro ignores the map instead of publishing it as a page.

After changing homepage image sources, run `npm run optimize:home` and commit the generated media and dimension manifest. This is an authoring step; normal builds use the checked-in assets.

## Preservation and source provenance

The initial inventory had 195 exact paths. The import prioritizes:

1. Published WordPress content at its existing permalink (150 records).
2. Equivalent WordPress content for historical/current alternate URLs (13 paths).
3. Published static-build HTML for routes absent from WordPress (14 paths).
4. Reconstructed WordPress archives using the imported posts.
5. Browser-captured live content for Events and the newer August storm article.

Category/tag/pagination routes discovered in WordPress links are added to the route manifest. Three incorrect source links are repaired: `/roofing/replacements/` -> `/roofing/replacement/`, `/projectgallery/` -> `/gallery/`, and `/roofing-contractors-dublin-oh/` -> `/roofing-contractor-dublin-oh/`. Existing protected routes are not removed.

Alternate paths render as real static pages; they do not redirect. Canonical preferences for identical article/policy variants are provisional and recorded in frontmatter for review. Distinct service and location pages retain their own canonicals.

The static build was imported from its public output. This repository does not contain its original private source or backend functions. Original public text and WordPress blocks are retained under `migration/sources`; these are evidence, not instructions to execute.

## Before production

All pages currently emit `noindex, nofollow`, and `robots.txt` disallows crawling. No deployment or DNS change is configured. Review and intentionally change this policy only when the site is approved for release.

Source forms, active scripts and iframes are stripped from legacy imported content. The native homepage restores form fields and the modal, with disabled submission and a clear call/booking alternative. Lead capture, Zapier/Roofr delivery, booking embeds, calculators, storm reports, analytics and conversions still need implementation and end-to-end verification. No backend secrets or database credentials are included.

Some original media remains remotely hosted; `migration/build-audit.json` checks copied, root-relative references. The database content includes old offers, review counts and claims requiring verification. Importing them does not certify them as accurate or current.

`npm run import:wordpress` is an explicit, destructive-to-content-files migration tool. Do not rerun it over edited content. It requires the original WordPress server/files plus the saved export, with paths configurable through `WORDPRESS_SOURCE_ROOT` and `STATIC_SNAPSHOT_ROOT`. Day-to-day builds only use this repository and do not need WordPress, PHP, MySQL or the original machine.

## Native page conversion

The homepage, all eight roofing-family pages and Cleveland roofing now share native components. See [component build progress](migration/component-build-progress.md) for completed routes, component contracts, validation and the next page sequence. Service content lives in `src/data/service-pages.json`; retained Markdown bodies remain migration evidence. Run `npm run check:services` for source-copy/link preservation checks and `npm run audit:components` to refresh the visual component map.

## Product pillar

The accepted hierarchy is Home → Products → Product Type Products → Product → Brand → Brand Product Page. The first branch includes Products, Roofing Products and Shingles hubs, the retained GAF catalog, and eleven individual GAF product pages. All 215 original routes remain, with 14 authored routes bringing the total to 229. See `migration/product-information-architecture.md` for URL preservation, other product families and the evidence contract for future location recommendations. Native product pages share the existing color selector, specification/warranty panels and disabled quote dialog.
