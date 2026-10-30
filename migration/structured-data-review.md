# Schema.org coverage and validation

Updated October 29, 2026. Local implementation; no commit, push or deployment performed in this pass.

The shared server/build compiler emits one linked JSON-LD graph per canonical content page. It ships no additional application JavaScript and makes no runtime schema requests. Aliases, redirects, errors and internal review pages do not create duplicate canonical entities.

## Coverage

- All 330 canonical pages have linked WebSite and RoofingContractor identity, verified address/contact details and an appropriate page type. Business and website identifiers remain stable across the site.
- 96 product detail pages retain Product identity, brand, actual product photographs and visible specification values. Material and color properties match the rendered specification and swatch names; no SKU, price, stock or product variant is invented.
- Product collections now use CollectionPage with an ItemList of canonical Product entities. Reprocessing a collection no longer creates a synthetic primary product or converts it into an ItemPage. Single-product collections remain collections.
- Companion cards with internal detail links reuse that product's canonical ID. The 20 primary companion relationships match the visible parent links through isAccessoryOrSparePartFor; shared cross-links remain isRelatedTo.
- Visible manufacturer PDF links are DigitalDocument entities linked to the corresponding product where applicable. HTML pages and photographs with a misleading legacy PDF link label are not assigned PDF encoding.
- 84 service entities retain their authored service type, provider and location. Meaningful service content sections, product-information sections and credential sections use WebPageElement with their rendered heading and introduction.
- 85 before/after components include both ImageObject references. The 84 service examples retain their exact visible illustrative disclosure in schema; the homepage comparison is represented without adding an unshown provenance claim.
- Tables use Table rather than Dataset or HowTo. All 8 table entities correspond to actual rendered tables.
- Project galleries and legacy project-detail photographs use ImageGallery. ImageObject entries retain responsive image URLs, visible alternative descriptions/captions, known pixel dimensions and file encoding.
- Existing exact FAQ questions/answers, BlogPosting authors/dates/topics, article and archive lists, breadcrumbs, navigation, manufacturer brands, maps and city coverage remain linked to their actual visible content.

## Canonical page classifications

| Type | Pages |
| --- | ---: |
| WebPage | 135 |
| CollectionPage | 79 |
| ItemPage | 96 |
| ImageGallery | 16 |
| FAQPage | 1 |
| ContactPage | 2 |
| AboutPage | 1 |

Graph entity counts include the same globally identified business, manufacturer, image or product appearing in several page graphs; those are not separate real-world entities.

## Validation

- npm run verify passed: all 364 preserved static routes, 330 canonical sitemap URLs, source copy, product catalogs, companion parents, image attributes, galleries, forms and schema checks. The existing unrelated ReviewCollection initial-state warning remains; zero source-check errors.
- check:schema validates graph uniqueness, local references, canonical identity, exact FAQs, visible colors/materials/documents, comparison disclosures, collection types, table coverage, safe serialization and repeated compilation on every canonical page.
- Official vocabulary audit: 33,019 typed objects across 330 pages, 35 types and 58 properties; zero unknown terms, property-domain mismatches or typed-object range mismatches. This is an additional local vocabulary audit, not a claim about eligibility for search features. Primitive value formats and search-engine-specific policies are covered only by the targeted site checks, not by that vocabulary audit.
- Vocabulary source: https://schema.org/version/latest/schemaorg-current-https.jsonld; SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74. The downloaded reference stays under tmp and is not a build/CI dependency.
- 9 representative browser pages passed: one parseable graph, correct product/collection/page identities, actual parent relationships, PDF references, comparison images, one H1, no horizontal overflow and no page errors.
- Evidence: tmp/schema-expansion-verify.log, tmp/schema-vocabulary-report.json, tmp/schema-coverage-summary.json and tmp/schema-browser-results.json.

## Content boundaries

No invented Offer, stock status, financing terms, self-serving Review/AggregateRating, JobPosting, unsupported search action, disconnected-form submission action, opening hours, coordinates, image licensing rights or article modification dates were added. Schema describes visible content; it does not guarantee a search result feature.

## Primary references

- [Product](https://schema.org/Product) and [material](https://schema.org/material) / [color](https://schema.org/color)
- [Accessory relationships](https://schema.org/isAccessoryOrSparePartFor)
- [WebPageElement](https://schema.org/WebPageElement) and [Table](https://schema.org/Table)
- [ImageObject](https://schema.org/ImageObject) and [ImageGallery](https://schema.org/ImageGallery)
- [DigitalDocument](https://schema.org/DigitalDocument)
- [Official current vocabulary](https://schema.org/version/latest/schemaorg-current-https.jsonld)
