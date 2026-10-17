# Native component conversion

## First service batch

The homepage and all eight roofing-family routes render native Astro components with Svelte islands for interaction. All other source URLs remain preserved. Native implementation does not imply client visual approval or fact-checking of imported business claims.

The eight service records now live in `src/data/service-pages.json`. Their original Markdown remains migration evidence, while title, description and canonical metadata continue to come from the content collection. Do not edit the old bodies expecting the native page to change. `scripts/transfer-service-content.mjs` is an explicit overwrite authoring tool, not part of normal builds.

Completed URLs: `/roofing/`, `/roofing/repair/`, `/roofing/replacement/`, `/roofing/types/`, `/roofing/metal/`, `/roofing/gaf/`, `/roofing/gaf/types/`, `/roofing/gaf/master-elite/`.

## What each page taught us

- **Roofing:** linked service cards and non-linked feature cards need different rendering. The quote card uses the authoritative phone number. The gallery and before/after behavior can reuse the existing Svelte islands.
- **Repair:** copy must support multiple headings, paragraphs, lists and inline contextual links without accepting arbitrary HTML. `RichContent` renders a typed node tree; `ContentSection` supplies prose, feature and service-grid variants.
- **Replacement:** a page needs an ordered list of sections, including repeated feature groups. Ten FAQs use native `details`, preserving answers without JavaScript. Roofing-only brand selection and page-specific gallery filters remain in the page data.
- **GAF types:** thirteen product descriptions now use a scan-friendly `ProductGrid`, preserving their text while giving the catalog a heading and each product its own card. The generic inherited hero heading is replaced with the existing page title to identify the shingle catalog clearly. Product availability, warranty and certification claims remain unverified.
- **Types, metal, GAF and Master Elite:** existing rich-text prose, lists and contextual links fit the shared content component. The Master Elite source mentions a visualizer; no unverified tool integration was restored.
- **Shared UI:** hero, certifications, brands, offer/review cards, coverage, comparison and quote sections now accept data rather than importing homepage content internally. Homepage wrappers use the same implementations. The quote modal accepts the page's title and description; there is one modal host per page.
- **Page entry points:** native service routes have separate Astro entry points. The legacy catchall excludes them, preventing its compatibility CSS and behavior from loading on native pages.
- **Images:** one media helper merges committed homepage and service dimensions/variants. Additional source photos have optimized WebP variants; full-size gallery links remain available.

## Validation

`npm run verify` checks all 215 URLs, canonicals, links/assets, Astro/Svelte diagnostics, homepage behavior contracts and native service transfer. Service checks compare substantive paragraphs, headings, FAQ questions and contextual links against the preserved source, and check image sizing, unique IDs, landmarks and disabled forms.

Browser checks covered roofing desktop layout, quote modal open/close, gallery hydration/filtering/lightbox/navigation, replacement FAQ expansion, roof repair at 390px with mobile navigation, and the 13-card GAF catalog on desktop/mobile with no horizontal overflow. The five additional roofing routes were also checked for native rendering and page identity. No lead was submitted. Editorial verification and client visual approval remain pending.

## Continue in this order

1. Storm damage family, then siding/gutters and the remaining services.
2. City hubs and service-city pages, reusing proven sections while preserving useful local content.

For each URL, inspect the actual section/content needs, extend the smallest useful component, migrate its data, verify content/links and interactions, then update the component audit. Do not mark untouched routes as native just because their future template exists. Retain all protected URLs and canonical preferences.

Zapier delivery remains deferred; Jared Lane is the confirmed lead owner. Submission stays disabled until delivery is verified.

## Cleveland roofing — 2026-10-17

Converted `/cleveland-oh/roofing/` to ServicePage, preserving its permalink, canonical, source copy and contextual links. Imported HTML that previously appeared as code now renders through native components. ServiceGuide introduces typed introduction/topics with stable anchors and a responsive section navigation; its four topics retain repair, replacement, materials/brands and contact copy. Hero, trust strip, breadcrumbs, brands, offers, project gallery/lightbox, comparison slider, coverage, reviews and disabled quote experience reuse existing components.

There are now nine native service records. Transfer authoring accepts explicit permalink arguments and merges only those records; the original eight were not reimported. Editing retained Markdown bodies does not change native page sections. The inherited Columbus financing reference and broad business claims remain flagged for review; shared Ohio project imagery is not asserted to depict Cleveland jobs. No product polishing in this batch. Continue with the next service/location URL selected by the user, using this component pattern where content fits.

### Cleveland layout revision

The sidebar ServiceGuide was rejected by the user and removed. Cleveland now has an introductory ContentSection followed by four independent MediaContentRow sections (repair, replacement, types/brands and contact). Each has an image, meaningful internal links and the original stable topic anchor; alternating layout stacks on mobile. Existing source wording/links remain, with an added paragraph explaining energy metrics and linking to product-specific specifications. Shared Ohio photos are not relabeled as Cleveland work.

## Selectable brand strip — 2026-10-17

BrandSection now uses `brandIds` in place of embedded logo items. The shared library includes all nine brand/product-line names found on the site, with authentic sized logos. Home and Products show the full mix; material groups select relevant names. Roofing currently names GAF in the inspected sources, including the live metal page. Ply Gem, Alu-Rex and LeafFilter have internal overviews, with T-Rex correctly linked to Alu-Rex. See brand-inventory.md for evidence. Logos preserve intrinsic proportions, and original certification marks remain in TrustStrip.

## Columbus page focus — 2026-10-17

`/roofing/` targets “Columbus, OH Roofing Company” through its title, H1 and company-oriented introduction. `/columbus-oh/roofing/` targets “Columbus Ohio Roofing Services” through its title, H1, service-oriented introduction and repair/replacement headings. Reciprocal contextual links distinguish the company overview from local service guidance; the native location-menu label says Columbus Roofing Services. Both existing URLs retain their own canonical. The local page remains on its imported layout pending component migration; HTML indentation was normalized so its breadcrumbs and content render as HTML rather than Markdown code blocks. This establishes an editorial distinction, not a claim of measured ranking changes.
