# src/content/pages: route records, not a universal page editor

index.md records explicit route metadata and retained source prose. A directory's physical location does not authorize a URL change. Read the leaf map's route ownership table: it names the canonical target, actual layout/component and data files controlling visible content.

For native pages, edit the owning JSON/TypeScript data or composition and update metadata deliberately. For a residual legacy route, the retained body can still render through SiteLayout. Do not bulk-replace these bodies, rerun imports or introduce raw scripts/forms/iframes as a shortcut to a branded native component.

New records need valid frontmatter, one retained H1/body for content validation, a manifest entry and a real renderer/data owner. The renderer may intentionally use the body only as evidence; keep these two concerns explicit. Preserve original article alias records when their canonical page has moved through the approved blog URL policy.

All paths in generated ownership blocks are repository-relative. Descend through these maps to the requested URL, then return to the relevant layout/data/component maps rather than editing unused evidence and assuming the browser changed.

<!-- route-context:start -->
## Route ownership

- Record permalink: `/`.
- Canonical target: `/`.
- Manifest paths using this record: `/`.
- Content family: Homepage.
- Renderer: `src/pages/index.astro`.
- Edit visible content in: `src/data/home.json; src/data/project-gallery.json`.
- Recorded source: `wordpress`; sourcePath: `/`.

The Markdown body is retained evidence, not the homepage renderer. Edit the native composition and shared data.

Paths above are repository-relative, not relative to this deeply nested directory. Metadata is validated by src/content.config.ts and the route/URL checks.
<!-- route-context:end -->

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src/content](../ai-context.md).

### Direct files

- [index.md](index.md)

### Child directories

- [about/](about/ai-context.md)
- [about-us/](about-us/ai-context.md)
- [accessibility/](accessibility/ai-context.md)
- [akron-oh/](akron-oh/ai-context.md)
- [athens-oh/](athens-oh/ai-context.md)
- [attic-insulation/](attic-insulation/ai-context.md)
- [aurora-oh/](aurora-oh/ai-context.md)
- [beavercreek-oh/](beavercreek-oh/ai-context.md)
- [blog/](blog/ai-context.md)
- [careers/](careers/ai-context.md)
- [category/](category/ai-context.md)
- [centerville-oh/](centerville-oh/ai-context.md)
- [cincinnati-oh/](cincinnati-oh/ai-context.md)
- [cleveland-oh/](cleveland-oh/ai-context.md)
- [columbus-oh/](columbus-oh/ai-context.md)
- [columbus-ppc-company/](columbus-ppc-company/ai-context.md)
- [commercial-roofing/](commercial-roofing/ai-context.md)
- [commercial-siding/](commercial-siding/ai-context.md)
- [contact/](contact/ai-context.md)
- [contact-us/](contact-us/ai-context.md)
- [cost-of-a-new-roof/](cost-of-a-new-roof/ai-context.md)
- [customer-service/](customer-service/ai-context.md)
- [dayton-oh/](dayton-oh/ai-context.md)
- [dayton-roofers/](dayton-roofers/ai-context.md)
- [deck-visualizer/](deck-visualizer/ai-context.md)
- [decks/](decks/ai-context.md)
- [delaware-oh/](delaware-oh/ai-context.md)
- [dublin-oh/](dublin-oh/ai-context.md)
- [emergency-roof-repair-dublin-oh/](emergency-roof-repair-dublin-oh/ai-context.md)
- [events/](events/ai-context.md)
- [exterior-painting/](exterior-painting/ai-context.md)
- [faq/](faq/ai-context.md)
- [financing/](financing/ai-context.md)
- [free-inspection/](free-inspection/ai-context.md)
- [gaf-roofing-dublin-oh/](gaf-roofing-dublin-oh/ai-context.md)
- [gahanna-oh/](gahanna-oh/ai-context.md)
- [gallery/](gallery/ai-context.md)
- [grove-city-oh/](grove-city-oh/ai-context.md)
- [gutter-installation-dublin-oh/](gutter-installation-dublin-oh/ai-context.md)
- [gutters/](gutters/ai-context.md)
- [hail-damage-roof-repair-dublin-oh/](hail-damage-roof-repair-dublin-oh/ai-context.md)
- [hamilton-oh/](hamilton-oh/ai-context.md)
- [hilliard-oh/](hilliard-oh/ai-context.md)
- [ice-dam-removal/](ice-dam-removal/ai-context.md)
- [lancaster-oh/](lancaster-oh/ai-context.md)
- [lewis-center-oh/](lewis-center-oh/ai-context.md)
- [metal-roofing-dublin-oh/](metal-roofing-dublin-oh/ai-context.md)
- [middletown-oh/](middletown-oh/ai-context.md)
- [newark-oh/](newark-oh/ai-context.md)
- [offers/](offers/ai-context.md)
- [our-careers/](our-careers/ai-context.md)
- [our-team/](our-team/ai-context.md)
- [past-projects/](past-projects/ai-context.md)
- [powell-oh/](powell-oh/ai-context.md)
- [privacy/](privacy/ai-context.md)
- [privacy-policy/](privacy-policy/ai-context.md)
- [privacy-policy-2/](privacy-policy-2/ai-context.md)
- [products/](products/ai-context.md)
- [reviews/](reviews/ai-context.md)
- [roof-calculator/](roof-calculator/ai-context.md)
- [roof-repair-dublin-oh/](roof-repair-dublin-oh/ai-context.md)
- [roof-replacement-dublin-oh/](roof-replacement-dublin-oh/ai-context.md)
- [roofing/](roofing/ai-context.md)
- [roofing-calculator/](roofing-calculator/ai-context.md)
- [roofing-contractor-dublin-oh/](roofing-contractor-dublin-oh/ai-context.md)
- [service-areas/](service-areas/ai-context.md)
- [siding/](siding/ai-context.md)
- [site-map/](site-map/ai-context.md)
- [storm-damage/](storm-damage/ai-context.md)
- [storm-damage-roof-repair-dublin-oh/](storm-damage-roof-repair-dublin-oh/ai-context.md)
- [storm-report/](storm-report/ai-context.md)
- [tag/](tag/ai-context.md)
- [terms/](terms/ai-context.md)
- [upper-arlington-oh/](upper-arlington-oh/ai-context.md)
- [warranty/](warranty/ai-context.md)
- [westerville-oh/](westerville-oh/ai-context.md)
- [windows/](windows/ai-context.md)
- [worthington-oh/](worthington-oh/ai-context.md)
- [zanesville-oh/](zanesville-oh/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
