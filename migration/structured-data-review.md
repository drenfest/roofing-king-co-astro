# Schema.org implementation

Implemented October 21, 2026. Structured data runs on the server and during the static build. No schema library, fetch or extra application script is shipped to visitors.

## Entity and component coverage

| Content / shared component | Structured data |
| --- | --- |
| Site identity, header/footer contact details | One `RoofingContractor`, verified `PostalAddress`, `ContactPoint`, logo, existing social profiles and Ohio service area |
| Every canonical content page | `WebSite` and linked `WebPage`, with appropriate `AboutPage`, `ContactPage`, `CollectionPage`, `ItemPage`, `FAQPage` or `ImageGallery` specialization |
| Shared Breadcrumbs | Existing `BreadcrumbList`, normalized to a stable page ID |
| Approved roofing reference and other native services | `Service` linked to the business and the canonical page; retain authored service type and city |
| FAQSection, including article FAQs and the grouped FAQ hub | One FAQ entity per document; exact rendered questions and answers; identical question/answer pairs deduplicated within the document |
| ArticleLayout | Existing `BlogPosting`, original author/date when available, publisher, hero image, original categories/topics and linked Blog |
| CardSection, BlogHub, BlogArchive, FeaturedArticles | `ItemList` with actual card membership and display positions; article entities carry displayed dates/authors rather than invented metadata |
| HomeServices, ServicePaths, product hub cards and location directory | Lists of the actual service/product/location destinations available in the component |
| ProductDetailPage, ProductCard and ProductSpecifications | `Product`, GAF brand, actual sample image and visible specifications as `PropertyValue`; no invented price, stock or review score |
| ProductCompanions | Named GAF accessory products, real manufacturer photos and relationship to the main product when available |
| ProjectGallery and relevant content photos | `ImageGallery` and `ImageObject`, responsive image URLs and actual descriptions/captions |
| BrandStrip | Displayed manufacturer `Brand` entities, linked to their existing product-library pages |
| ServiceAreaMap | `Map` with the 25 actual communities as geographic coverage, distinguishing Lewis Center from incorporated cities |
| Contact office map | Business `hasMap` points to the visible office map |
| SiteHeader and BlogNavigation | `SiteNavigationElement` for actual primary links and blog resource navigation |

Item lists describe the displayed content, not rankings. A `WebPageElement` connects each list to its page without using an invalid `hasPart` relationship directly to an `ItemList`.

## Canonical identity

The build emits one consolidated JSON-LD graph per canonical content page. Business and website IDs are stable across the site; page, article, service, product, breadcrumb, FAQ and image IDs are linked rather than duplicated.

Canonical aliases, redirects, the 404 and internal migration review do not redefine the homepage or another canonical page. Existing URLs, canonical links, redirects and review indexing restrictions remain unchanged.

Authored Service, Product, BlogPosting and BreadcrumbList scripts remain source inputs. The compiler retains their facts and replaces the output with the unified graph. It is idempotent and shared by Astro middleware and the final static-build integration.

## Deliberate exclusions

- No self-serving `Review` or `AggregateRating` for Roof King customer excerpts. Original review excerpts and independent source links remain visible.
- No financing `LoanOrCredit`, product-price `Offer`, APR, stock status or repayment amount invented from promotional text. The client-confirmed $47 promotion remains visible with its call-for-details action.
- No `JobPosting` without actual vacancies, `SearchAction` without a site search endpoint, or submission action for a disconnected form.
- Ordinary lists, decorative backgrounds, buttons, estimate forms and brand imagery are not mislabeled as HowTo instructions, services, products or transactions.
- No invented opening hours, office coordinates, employees, awards, image licensing rights or article modification dates.

Schema.org validity and eligibility for a particular search feature are separate. FAQ markup describes actual content; it does not promise Google FAQ rich results for a contractor site.

## Validation

- `npm run check:schema`: every canonical build page has one graph; IDs and local references resolve; business facts match site.json; FAQs match actual answers; hubs match card membership; article dates/authors match source records; products have real specifications without fictitious offers; map coverage uses the actual inventory.
- Compiler idempotency is checked against the entire build. Inline serialization escapes script-closing characters.
- Product validation reads consolidated graph nodes while retaining all original product and breadcrumb assertions.
- The official current Schema.org JSON-LD vocabulary was downloaded for a separate local audit of types, property names, type inheritance, property domains and object ranges. That audit is offline after the vocabulary download and is not a CI/build dependency.
- Normal route, content, component, HTML-attribute and disconnected-form checks remain part of `npm run verify`.

## Primary references

- [Schema.org WebPage](https://schema.org/WebPage)
- [Schema.org ItemList](https://schema.org/ItemList)
- [Schema.org Service](https://schema.org/Service)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)
- [Schema.org ImageGallery](https://schema.org/ImageGallery)
- [Schema.org SiteNavigationElement](https://schema.org/SiteNavigationElement)
- [Official current vocabulary](https://schema.org/version/latest/schemaorg-current-https.jsonld)
- [Google local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google review snippet eligibility](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Google FAQ and HowTo search changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
