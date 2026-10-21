# src/layouts

PolishedServicePage composes 83 rebuilt service/location/cost/calculator routes from service-editorial.json using only native Astro sections and Svelte islands. Parent service pages use ServicePaths tabs; leaf pages use ServiceArticle with visible content rows and no selector island. Every rebuilt page has relevant service content, independent review links, credentials, contextual products/brands, installation copy, estimate details, related links, FAQs and disconnected quote forms. Non-roofing credentials use exterior wording. ServiceLanding retains the approved /roofing/ reference. ServicePage remains for the existing GAF product catalog. Explicit native entry points prevent SiteLayout and WordPress compatibility styles from entering polished pages. DocumentLayout owns canonical metadata, preview noindex and shared business schema; polished pages add Service schema. ProductLayout remains independent. SiteLayout serves remaining legacy categories only.

## Files

- `DocumentLayout.astro`
- `PolishedServicePage.astro`
- `ProductLayout.astro`
- `ServiceLanding.astro`
- `ServicePage.astro`
- `SiteLayout.astro`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## Full service composition

PolishedServicePage.astro consumes service-editorial.json and service-copy.json for the 83 supplied pages. It retains complete source-led content, parent child-service tabs or static leaf prose, verified review sources, credentials, alternating media bands, contextual brands, estimate/financing, FAQs and the disconnected quote experience. One estimate/cost/records source section moves to the green planning band without dropping its text. /roofing/ continues through ServiceLanding.astro unchanged. Calculators retain click-to-load Roofr; no form delivery is enabled.

DocumentLayout and SiteLayout both include SiteMotion. Navigation uses browser-native cross-document crossfades, preserving full document loads and fresh island initialization.

ServiceLanding and relevant roofing, siding, gutter, window, commercial and location families in PolishedServicePage show StormDamageCallout after the opening content. Dedicated storm pages and unrelated services avoid a redundant promotion.

ServiceLanding supplies Residential Roofing and PolishedServicePage supplies data.serviceType to LandingHero.serviceName so every service hero has a descriptive Read More About link. The paused ten-page heading/hierarchy review remains separate.

ServiceLanding and PolishedServicePage select generated roofing hero assets by route from roofing-heroes.json, including OG images. Every LandingHero uses the full-bleed photographic layout; other service pages retain their existing image source. No URL or body-copy migration is involved.

DocumentLayout and SiteLayout request variable Inter 400–900 and Playfair Display 600–900 with display=swap and existing Google font preconnects. Both native and preserved legacy routes share this pairing.

The client’s latest hero reference uses warm ivory fading into photography, dark sentence-case headings and inline inspection actions. PageHero and LandingHero share this presentation. Both document shells request true Playfair Display italics as well as upright weights.

PolishedServicePage reads optional per-route reviewPresentation, uses explicit copy.budgetSectionId before the legacy estimate-title heuristic, and nests brand strips at the reviewed material section as H3s. Defaults preserve pages outside the current ten-page review batch; /roofing/ remains separate.


ProductLayout now resolves a responsive hero image through product-presentation.ts and renders ProductHero before breadcrumbs. productKey selects genuine manufacturer samples for individual shingles; optional logo appears in the hero. Preserve canonical and Product/Breadcrumb schemas, disconnected quote experience and all existing paths.


PolishedServicePage resolves both service-heroes.json and roofing-heroes.json, so all native service pages use individual generated hero scenes. Their imagery remains explicitly illustrative. The approved roofing reference and all source copy remain intact; shared ServicePaths previews resolve the exact same destination asset.

QuoteExperience now fixes the modal title to Get a free quote; service layouts pass only the contextual description and rating preference.

PolishedServicePage passes the original permalink to ServiceContentBand so reviewed photo galleries resolve by page and section without modifying copy or other pages.

PolishedServicePage renders a ServiceGallery matched to data.family. ServiceLanding replaces its old two-photo showcase with the roofing selection while preserving #roofing-work. The retained GAF catalog uses asphalt-only roofing photos. Each service gallery links to its matching filter in the homepage gallery.


Location hubs explicitly render ServicePaths even without URL children, showing all 11 service groups. Other leaf services retain ServiceArticle. City-specific reviewPresentation titles apply to gallery, brands, credentials, financing and reviews. All service layouts mount FeaturedArticles, which renders only when relevant existing posts are available; it is static and retains published destinations.


BlogLayout composes existing DocumentLayout, SiteHeader, PageHero, Breadcrumbs, CardSection slots and SiteFooter. Breadcrumbs appear after the hero and use the same services.css rules as other native pages. /blog/, both resource hubs and all ten /tag/* archives use this shell. Topic archives add a linked Topics ancestor to the breadcrumb trail.


BlogLayout now places BlogNavigation beside its shared CardSection content instead of a horizontal resource tab row. SiteLayout accepts optional blogAside for legacy articles without an existing sidebar; imported article sidebars retain their content and their Categories/Topics heading links now resolve to the new hubs.


All 19 category/tag collection hubs use BlogLayout.isArchive for their linked Categories/Topics breadcrumb ancestor. Legacy Article records now always get one shared BlogNavigation aside; the catchall renders the original HTML article without its old sidebar and converts nested main elements to divs. This avoids Markdown code-block navigation and duplicate asides while retaining article copy. Two broken imported service links are corrected at render time.


ArticleLayout is the sole native article shell, reusing shared hero, breadcrumbs, aside, prose, FAQ and booking components. The catchall no longer renders Article records; category-prefixed routes and the one unassigned flat article select compiled data. SiteLayout no longer accepts legacy blogAside.


ArticleLayout now ends with the same full-width QuoteSection/QuoteExperience used on the homepage, outside the reading/sidebar grid. It replaces the compact ServiceAudienceBanner and its article-only styles. Header quote actions open the shared modal; form submission remains disabled during review.

OfferLayout composes shared PageHero, Breadcrumbs, ContentSection, MediaContentRow, ArticleChecklist, FAQSection, ResourceLinks and QuoteSection for nine financing/warranty/seasonal pages. It preserves URLs, disabled forms and native no-JS content.

Existing authored Service, Product, BlogPosting and BreadcrumbList scripts feed the shared structured-data compiler. The final document has one graph, not duplicate per-layout/per-component entities. WebSite, business and canonical page IDs are stable and linked. Keep source schema facts in the layouts/components; the compiler normalizes and enriches them from rendered content.
