# Product information architecture

## Accepted hierarchy

Universal pattern: Home → Products → Product Type Products → Product → Brand → Brand Product Page.

For roofing shingles: Home → Products → Roofing Products → Shingles → GAF → Individual GAF shingle page.

The product type is the broader family (Roofing Products, Decking Products, Siding Products, etc.). The next level is the material/product form (Shingles, Metal Roofing, Composite Decking, etc.), followed by manufacturer and individual product/line. Use the same explicit hierarchy when verified catalogs are built for other families. Do not place product records under cities or installation services.

The native product pillar now includes `/products/`, `/products/roofing/`, `/products/roofing/shingles/` and eleven individual pages under `/products/roofing/shingles/gaf/{product-id}/`. The existing `/roofing/gaf/types/` page serves the GAF catalog node and retains its canonical and 200 response. No duplicate GAF catalog is created at a competing URL. Logical breadcrumbs and BreadcrumbList data express the accepted hierarchy independently of the inherited URL.

Existing `/roofing/types/` is a material guide in the product pillar. GAF installation and Master Elite certification remain service/provider information, not manufacturers' product categories. Concise breadcrumb labels replace repeated city-specific SEO page titles. `site-structure.json` records the explicit placements and limited heading edits; retained source bodies remain evidence. The header separates Products from Services, and the footer's previous Products column is correctly labeled Services.

## Content roles

- **Services:** inspection, repair, replacement, installation scope, process and conversion. Link to product research rather than repeating whole catalogs.
- **Products:** brands, materials, product variants, genuine color samples, manufacturer specifications, warranty terms and documentation. One product record supplies catalog cards and individual pages.
- **Locations:** local service context, relevant project proof, local constraints and short, reasoned product recommendations that link to the shared product record.

## Location recommendations

Location-specific recommendations are planned, not fabricated during this structural change. A recommendation should reference a stable product ID and include the relevant factors, a specific rationale, local evidence, manufacturer performance sources, verification date and editorial status. Useful factors include wind/hail exposure, shade/moisture, roof design and ventilation, local requirements, aesthetics, budget and actual regional product availability. An address or city name alone cannot establish the right product for a property.

Do not copy the product catalog into every city page or swap city names into generic recommendations. Do not infer hail coverage from an impact rating or system warranty eligibility from a contractor certification. The current verified catalog contains colors, nominal dimensions and manufacturer-listed warranty labels; additional performance facts must be sourced before recommending a particular product for a hazard. No location recommendation engine or unverified regional availability claim was added.

## Other product families already discussed

The existing content also discusses metal roofing; siding materials and brands including James Hardie, LP SmartSide and Variform; composite decking/Trex, railings and lighting; gutters and guards; windows; and attic insulation. Most of this is mixed with service copy. Audit and separate actual product information before creating catalogs for those families. The first product pillar currently publishes the verified roofing/shingle catalog, not invented catalogs for the other services.

## Preservation and validation

All 215 original routes remain. Fourteen authored product-pillar routes bring the current content route count to 229. The collection explicitly marks new content as authored-needs-review. Normal builds use committed data; they do not fetch a database or manufacturer API. Individual product pages share ProductCard/ProductOptions with the catalog and retain genuine image/color mappings. No cart, price or checkout is introduced.

Validation covers all route/asset/canonical contracts, the three hubs, eleven individual records, exact breadcrumb trails and schema, the original GAF canonical, and catalog links to all product records. Existing source-preservation checks allow only the explicit editorial heading mappings in `site-structure.json`; paragraphs and contextual links remain checked.

## References

- [Google breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb): represent a typical user path rather than mechanically mirroring URLs.
- [GAF shingle selection guide](https://www.gaf.com/en-us/plan-design/design-your-roof/how-to-choose-roof-shingles): product choice factors and manufacturer qualifications.
- Per-product source URLs and image provenance: `migration/sources/gaf-product-catalog.json`.

## Siding and decking brand branches — 2026-10-17

User approved internal destinations for the manufacturer logos. Added ten authored URLs: siding and decking category hubs, vinyl/engineered-wood/fiber-cement/composite material hubs, and Variform/LP SmartSide/James Hardie/Trex brand pages. Current route total is 239: 215 original paths plus 24 authored product-pillar routes. Brand pages are overviews with current primary manufacturer references, material/design/installation considerations and internal service links; they do not assert stock, price, warranty duration or a populated individual-product catalog. Canonicals remain self-referential. BrandStrip uses brand-pages.json so the same logo destination applies throughout native pages. GAF certification marks link to existing GAF service/certification pages.
