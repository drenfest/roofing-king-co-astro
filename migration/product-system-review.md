# Product systems and catalog follow-up

Status: local review; not committed, pushed or deployed.

## What changed

- Every one of the 91 authored product detail pages now has a companion-products panel. The original Timberline HDZ system remains detailed; the other GAF products receive qualified system options appropriate to their field-shingle selection.
- Owens Corning and IKO roofing components, siding trim/starting/opening/eave components, Trex deck accessories, Alu-Rex drainage connections and LeafFilter integral parts have separate content. Generic wall/gutter components are not labeled as GAF products or presented as invented stocked SKUs.
- Trex now has 17 additional product-family pages: 13 railing configurations plus fascia, Hideaway fastening, DeckLighting and RainEscape. Original six decking families remain. The collection and primary menu link to all products.
- LeafFilter now has a complete gutter-protection product page and a revised brand collection with genuine system photography. Its micromesh, uPVC frame and internal hangers are explained as parts of one system, not fabricated alternative guard models.
- Related native product pages are linked where they exist. Manufacturer references accompany system components, compatibility notes and warranty information.
- Component styling retains the established ivory/charcoal/orange palette. Mobile product-panel controls span the available width. All previous URLs and GAF color data remain.

## Image optimization

93 additional responsive WebP variants total 2,770,350 bytes (2.77 MB for the complete added asset library, not a single-page download). Each file is below 260 KB, retains bounded original dimensions and has camera/author metadata stripped. Inline location diagrams add no image downloads. The separate, cached navigation sprite covers 212 destinations in 657,820 bytes, retaining one request for menu imagery. Exact source dimensions and per-file byte totals are recorded in product-system-media.json. Originals remain outside public and Git.

New accessory pages use manufacturer product/configuration views. Their linked manufacturer resources provide exact finish, dimension and kit choices; no color options, prices, stock status or certification claims have been invented. Trex Refuge PVC does not inherit the composite-board fastening recommendation.

## Review links

- [Trex collection](http://127.0.0.1:4321/products/decking/composite/trex/)
- [LeafFilter collection](http://127.0.0.1:4321/products/gutters/guards/leaffilter/)
- [LeafFilter product and integral parts](http://127.0.0.1:4321/products/gutters/guards/leaffilter/gutter-protection/#roof-system)
- [Owens Corning companion components](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/trudefinition-duration/#roof-system)
- [Trex companion products](http://127.0.0.1:4321/products/decking/composite/trex/transcend/#roof-system)

## Verification

182 desktop/mobile companion route checks passed across all 91 product details, including images, disclosures, panel navigation, overflow and no-JavaScript fallbacks. Eight additional final checks cover both revised collections, the LeafFilter detail and the Trex fastening detail at desktop/mobile widths. Full npm run verify passed. A final source clarification for Trex Select T-Rail was followed by a fresh build and product-system, HTML-attribute and schema checks, all passing. Existing ReviewCollection.svelte initial-state warning remains unrelated.

## Main primary sources

- [Owens Corning roofing components](https://www.owenscorning.com/en-us/roofing/components)
- [IKO roofing system](https://www.iko.com/na/the-iko-system/)
- [Trex railing](https://www.trex.com/products/railing/)
- [Trex product families](https://www.trex.com/products/)
- [LeafFilter system](https://www.leafhome.com/gutter-systems/leaffilter)

Additional item-level manufacturer and installation-resource URLs are retained in product-system-companions.json, product-accessories.json and sources/product-system-expansion.json.
