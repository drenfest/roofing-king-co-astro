# Interactive GAF product catalog

The GAF types page uses ProductGrid.astro for server-rendered product text, warranty/specification disclosures and manufacturer links. Each verified product mounts an independent ProductOptions.svelte island when visible. Selecting a swatch updates only that card's main image, selected color text and pressed state. Space and Enter work; without JavaScript swatches link directly to their color image. Native details panels work without hydration.

## Verified source data

On October 17, 2026, the public GAF product pages supplied 73 color variants for 11 products. The compact evidence snapshot is `migration/sources/gaf-product-catalog.json`; it records each exact product URL, color identity, source image URL, nominal specifications, manufacturer-listed warranty labels and document links. Raw third-party scripts are never executed or included in the build.

`src/data/product-catalog.json` binds these facts to local optimized media. Page items reference stable productId values, so editing a display title cannot accidentally change its photos or warranty record. Every product has five nominal specification fields, its own warranty labels and source links. Warranty duration/system eligibility is not inferred from Roof King's certification. The UI links to full GAF terms and explains that eligibility and coverage depend on the product and installed system. Color choices are manufacturer reference options, not confirmed Ohio stock; the UI asks visitors to confirm local availability and a physical sample.

The eleven verified products are Timberline HDZ, UHDZ, NS, AS II, HDZ RS, Camelot II, Woodland, Grand Sequoia, Grand Sequoia RS, Grand Sequoia AS and Royal Sovereign. GAF's current UHDZ URL resolves to the UHDZ with UltraMat product page; the linked source records this resolution. Imported descriptive copy remains intact and still needs editorial review against the current catalog.

## Earlier entries

Grand Canyon's previous US URL resolves to the general shingles catalog. The HDZ RS+ URL resolves to HDZ RS. A redirect does not establish discontinuation or prove that the newer product's images/specifications apply to the old label. Those two entries retain their original descriptions in a secondary earlier-catalog section, with availability/warranty/specification confirmation and a contact link. They have no fabricated swatches or borrowed product images. Confirm the exact products and approved assets before making them selectable.

## Media and maintenance

`npm run optimize:products` is an explicit authoring command that downloads the image URLs in the committed evidence snapshot and regenerates local WebP images, swatches and the catalog manifest. Normal builds are offline with respect to GAF. Update the evidence deliberately when changing product facts; do not guess image URLs or apply colors across product lines. There is no price, cart, stock indicator, checkout or purchase action.

`npm run check:products` verifies the exact product/color evidence mapping, every variant file, server-rendered default images, non-JS links, warranty/specification panels and retention of the two unresolved entries. The existing service checks preserve all thirteen original descriptions and contextual links.

Primary references are linked per product in the snapshot and the UI. Warranty terms: https://www.gaf.com/en-us/resources/warranties/residential.

Browser verification covered pointer and Space-key color selection, actual main image URL changes, selected state, independence between cards, both disclosure panels and a 390px mobile layout without horizontal overflow. All local verification passes with zero Astro/Svelte diagnostics.

## Performance comparisons (2026-10-17)

All eleven current products now expose ASTM D7158 Class H and ASTM D3161 Class F wind test classes, ANSI/UL 790 Class A fire classification, and each product’s published impact class from its GAF Specifications ItemList. N/A is shown as “No class listed,” never treated as a failed test. Package labeling and installation qualifications remain visible. These are test classifications, not promised storm survival or wind-warranty speeds.

No product-specific service-life figure is listed in the cited specification tables. The lifespan badge therefore says “Varies”; expanded specs explain climate, ventilation, installation and maintenance, and explicitly distinguish warranty duration from service life. Do not convert a Lifetime or 25-year warranty into expected lifespan. Badge values and notes are stored in the source evidence and preserved by media regeneration.

Wind speed reference: GAF Advanced Protection (https://www.gaf.com/en-us/resources/roofing-technology/advanced-protection), checked 2026-10-17, associates ASTM D7158 Class H with 150 mph and ASTM D3161 Class F with 110 mph under controlled laboratory conditions. Show the Class H comparison speed on the badge, retain both distinct tests in specifications, and do not present either as a guaranteed in-service storm speed or warranty limit.

Practical badge references (2026-10-17): GAF class-4-shingles source specifies Class 3: 1.75-inch steel ball from 17 feet; Class 4: 2-inch steel ball from 20 feet. These are not safe hailstone diameters. ANSI’s UL 790 standard abstract describes Class A/B/C as severe/moderate/light exterior fire exposures and lists flame and burning-brand methods; no invented temperature or hourly rating is shown. GAF “How Often Should You Replace Your Roof?” (August 24, 2026) supplies a general 20–25-year residential roof replacement range. This supersedes the Varies badge only as clearly labeled general roof guidance; no product-specific lifespan estimate is asserted. All sources are linked from the corresponding specs and disclosures.

## Companion products — Timberline HDZ (2026-10-17)

product-companions.json contains five system candidates with benefit rationale, placement and selection limits: Pro-Start, Deck-Armor, StormGuard, Cobra SnowCountry Advanced with intake, and TimberTex. Primary links are stored per record. Mapping is explicitly limited to HDZ; review starter sizing, assembly and cap suitability before extending to designer or other shingles. Benefits address failure mechanisms, not a quantified extension of shingle life. No accessory stock or installation inclusion is asserted. LayerLock is identified as built-in technology, not a purchasable add-on. SureNail is Owens Corning Duration integrated nailing-zone technology (https://www.owenscorning.com/en-us/roofing/surenail), not an accessory for GAF shingles. Warranty eligibility remains separate from actual service life.
