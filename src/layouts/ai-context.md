# src/layouts: page-family composition

Use the existing family rather than importing the legacy shell into a native page. Inspect the actual src/pages entry point and its dependencies; layouts do not own every copy value themselves.

| Layout | Use |
| --- | --- |
| DocumentLayout | Native document metadata/head, shared styles/motion and preview indexing policy; used by native compositions |
| ServiceLanding | Independent /roofing/ reference, driven by roofing-landing.json and shared service components |
| PolishedServicePage | Other native service/location/cost/calculator routes, with editorial identity + full service-copy data |
| ServicePage | Retained native service/catalog records, including /roofing/gaf/types/; not the default for new polished services |
| ProductLayout | Shared native product shell, ProductHero, Breadcrumbs, header/footer and quote section |
| ArticleLayout | Structured article sections, first-image hero, canonical term links, author/date, BlogNavigation, body imagery, FAQ and QuoteSection |
| BlogLayout | Shared main/category/topic/term hub shell and aside; used by BlogHub and BlogArchive |
| OfferLayout | Qualified offer/financing informational pages using offer-pages.ts; dedicated warranty composition remains separate |
| SiteLayout | Remaining preserved legacy content and compatibility wiring only |

## Service composition contract

Polished services use ServicePaths for real parent service/location selectors and ServiceArticle for leaves. They retain review sources, credentials, full source content bands, contextual manufacturer subsections, explicit estimate placement, a relevant ServiceComparison, topic-matched gallery, FeaturedArticles, FAQ and the booking/phone contact experience (#quote-form remains a compatibility anchor). The calculator family keeps Roofr click-to-load behavior. Reviewed brand headings remain H3s where nested; do not flatten all topics to H2.

ServiceLanding and PolishedServicePage use the same photographic hero design and shared motion, but /roofing/ retains its own reference data/composition. ServiceComparison resolves a selected pair through shared data; it must not imply the illustration is a local completed project. Location section headings include the actual city while disclaiming illustrative examples.

## Extending a shell

Use optional typed props or a shared component for a repeated requirement. Keep route-specific copy out of layout conditionals when a data field can express it. Preserve DocumentLayout's canonical/noindex behavior, shared font loading, SiteMotion and footer flow. Do not bundle SiteLayout/WordPress compatibility CSS into a native family just to reuse its header.

Changing a shell affects many routes. Check a previous consumer, the new case, desktop/mobile layout, SSR/no-JS behavior and the page family's regression checks. Schema and required image/link attributes are consolidated by middleware/build integrations; do not create a second independent graph or a parallel document shell.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [ArticleLayout.astro](ArticleLayout.astro)
- [BlogLayout.astro](BlogLayout.astro)
- [DocumentLayout.astro](DocumentLayout.astro)
- [OfferLayout.astro](OfferLayout.astro)
- [PolishedServicePage.astro](PolishedServicePage.astro)
- [ProductLayout.astro](ProductLayout.astro)
- [ServiceLanding.astro](ServiceLanding.astro)
- [ServicePage.astro](ServicePage.astro)
- [SiteLayout.astro](SiteLayout.astro)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
