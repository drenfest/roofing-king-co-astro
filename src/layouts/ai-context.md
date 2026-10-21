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
