# Product catalog expansion review

Local review build · 29 October 2026 · REVIEW REQUIRED

The additional brands supplied by Riley are integrated into the existing native product components. Odyssey Plus and Charter Oak are Alside product lines. Original GAF data remains separate: 11 products and 73 colors.

## Delivery

- 62 additional product detail pages across 10 manufacturers, with product-specific explanations, specification tables, source documents, qualified warranty panels and image-led heroes.
- Five new manufacturer hubs; the existing Variform, James Hardie, LP SmartSide, Trex and Alu-Rex hubs now have product collections. Ply Gem links to the Variform catalog without duplicating products.
- Three wood material guides: wood decking, cedar and pressure-treated lumber. These do not invent a manufacturer, SKU or warranty.
- 70 added URLs, retaining all 268 prior inventory routes. The generated sitemap contains 304 canonical public URLs.
- Complete product navigation down to each individual product, updated brand strips, a 194-destination menu atlas, breadcrumbs, title/alt attributes and manufacturer-specific Product schema. No price, inventory or installer certification is invented.

## Color previews

All 27 siding palettes have interactive house previews. Exterior Portfolio uses its published transparent photo layers. The other 21 previews use public Renoworks sample-home photographs and siding contours, rendered locally. Roofs, windows, doors, trim, landscaping and masonry remain outside the colored regions. These are explicitly labeled illustrative color studies; the sample-home profile may differ from the product. Manufacturer product photographs remain accessible separately.

Color changes use local SVG filters or native alpha layers, without vendor application scripts, remote rendering calls or a request for every color. Collection preview overlays activate with their visible product island. The original swatches and manufacturer links remain available without JavaScript.

Hardie texture samples and published finish resources remain distinct from exact color availability. LP finish choices link to the manufacturer’s current color resources. Roofing and Trex use genuine manufacturer samples/photographs rather than recolored images.

## Media optimization

| Media | Files | Bytes |
| --- | ---: | ---: |
| Manufacturer photos, samples and logos | 798 | 45,603,650 |
| Sample-home WebP previews | 63 | 5,815,780 |
| SVG siding masks | 21 | 374,282 |
| Total new catalog assets | 882 | 51,793,712 |

Every WebP derivative stays below 260,000 bytes. Sources are never enlarged; EXIF/XMP/IPTC are stripped. Responsive sizes and lazy loading are used. The total is the complete catalog asset library, not a page download. The separately cached menu atlas is 647,686 bytes. Original vendor downloads are kept outside public and Git.

Detailed asset evidence: [manufacturer optimization](product-image-optimization.json), [color preview sources and masks](product-color-preview-media.json), [selected manufacturer facts](sources/product-expansion.json). Explicit refresh tools: `scripts/prepare-manufacturer-media.mjs --refresh` and `scripts/prepare-product-color-previews.mjs --refresh`; neither runs during a normal build.

## Verification

- Full `npm run verify` passed. The [validation record](product-expansion-validation.json) binds the checked product data and components to source hashes.
- 150 desktop/mobile route checks cover the 13 new/expanded hero mappings and 62 detail pages: images, overflow, swatch keyboard interaction, badge explanations, warranty/specification tabs and no-JavaScript fallbacks.
- 27 preview cases compare rendered pixels before and after selection; the single-option product is recorded separately. Eight desktop/mobile collection checks also confirm independent card colors, unique filter IDs and no runtime preview-service requests.
- The original 11 GAF products and 73 variants retain their independent provenance and behavior checks.
- One pre-existing Svelte warning remains in ReviewCollection; there are no product diagnostics.

## Review limits

Physical color samples and regional supply still need project confirmation. Cool-roof IKO lines have regional availability limits. Trex Signature current supply is explicitly qualified. Manufacturer warranties describe limited coverage rather than expected service life. No other manufacturer inherits the GAF installer credentials.

The client has not confirmed gutter suppliers. Alu-Rex remains a qualified manufacturer-system reference; the existing LeafFilter overview is retained without a new installation or authorization claim. Source HTML and permanent manufacturer resource links support the catalog; unsuccessful brochure downloads are not represented as reviewed warranty documents.

This work remains local for review. It does not advance the separate ten-page service review cycle.

## Product review links

[Open all products](http://127.0.0.1:4321/products/) · [Alside color previews](http://127.0.0.1:4321/products/siding/vinyl/alside/#product-range)

### Owens Corning — 5 products

[Open collection](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Owens Corning Duration | [Review](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/trudefinition-duration/) | [Source](https://www.owenscorning.com/en-us/roofing/shingles/trudefinition-duration) |
| Owens Corning Duration Designer | [Review](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/trudefinition-duration-designer/) | [Source](https://www.owenscorning.com/en-us/roofing/shingles/trudefinition-duration-designer) |
| Owens Corning Duration FLEX | [Review](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/trudefinition-duration-flex/) | [Source](https://www.owenscorning.com/en-us/roofing/shingles/trudefinition-duration-flex) |
| Owens Corning Duration STORM | [Review](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/trudefinition-duration-storm/) | [Source](https://www.owenscorning.com/en-us/roofing/shingles/trudefinition-duration-storm) |
| Owens Corning Oakridge | [Review](http://127.0.0.1:4321/products/roofing/shingles/owens-corning/oakridge/) | [Source](https://www.owenscorning.com/en-us/roofing/shingles/oakridge) |

### Alside — 2 products

[Open collection](http://127.0.0.1:4321/products/siding/vinyl/alside/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Charter Oak Reinforced Premium Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/alside/charter-oak/) | [Source](https://www.alside.com/product-catalog/siding/charter-oak/) |
| Odyssey Plus Premium Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/alside/odyssey-plus/) | [Source](https://www.alside.com/product-catalog/siding/odyssey-plus/) |

### Norandex — 11 products

[Open collection](http://127.0.0.1:4321/products/siding/vinyl/norandex/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Polar Wall Plus! Insulated Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/polar-wall-plus/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/polar-wall-plus/) |
| Great Barrier Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/great-barrier/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/great-barrier/) |
| SturdiPlank Single 7" | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/sturdiplank-s7/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/sturdiplank-s7/) |
| Cedar Knolls Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/cedar-knolls/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/cedar-knolls/) |
| Sterling Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/sterling/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/sterling/) |
| Woodsman Select Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/woodsman-select/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/woodsman-select/) |
| Summit Manor Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/summit-manor/) | [Source](https://www.norandex.com/products/vinyl-siding/dutchlap-clapboard/summit-manor/) |
| Rustic Hill shakes & shingles | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/rustic-hill/) | [Source](https://www.norandex.com/products/vinyl-siding/shake-shingle/rustic-hill/) |
| Home Accents shakes & shingles | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/home-accents/) | [Source](https://www.norandex.com/products/vinyl-siding/shake-shingle/home-accents/) |
| Cambridge Beaded Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/cambridge-beaded/) | [Source](https://www.norandex.com/products/vinyl-siding/beaded/cambridge-beaded/) |
| Board & Batten Vinyl Siding | [Review](http://127.0.0.1:4321/products/siding/vinyl/norandex/board-and-batten/) | [Source](https://www.norandex.com/products/vinyl-siding/vertical/board-and-batten/) |

### Variform — 8 products

[Open collection](http://127.0.0.1:4321/products/siding/vinyl/variform/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Heritage Cedar | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/heritage-cedar/) | [Source](https://www.plygem.com/variform/siding/heritage-cedar/) |
| Vortex Extreme | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/vortex-extreme/) | [Source](https://www.plygem.com/variform/siding/vortex-extreme/) |
| Variform Board & Batten | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/variform-board-and-batten/) | [Source](https://www.plygem.com/variform/siding/variform-board-and-batten/) |
| Camden Pointe | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/camden-pointe/) | [Source](https://www.plygem.com/variform/siding/camden-pointe/) |
| American Herald | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/american-herald/) | [Source](https://www.plygem.com/variform/siding/american-herald/) |
| Ashton Heights | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/ashton-heights/) | [Source](https://www.plygem.com/variform/siding/ashton-heights/) |
| Contractor’s Choice | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/contractors-choice/) | [Source](https://www.plygem.com/variform/siding/contractors-choice/) |
| Victoria Harbor | [Review](http://127.0.0.1:4321/products/siding/vinyl/variform/victoria-harbor/) | [Source](https://www.plygem.com/variform/siding/victoria-harbor/) |

### IKO — 8 products

[Open collection](http://127.0.0.1:4321/products/roofing/shingles/iko/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Dynasty Performance Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/dynasty/) | [Source](https://www.iko.com/na/product/dynasty/) |
| Nordic Performance Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/nordic/) | [Source](https://www.iko.com/na/product/nordic/) |
| Dynasty Cool Colors Plus Performance Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/dynasty-cool-plus/) | [Source](https://www.iko.com/na/product/dynasty-cool-plus/) |
| Armourshake Designer Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/armourshake/) | [Source](https://www.iko.com/na/product/armourshake/) |
| Royal Estate Designer Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/royal-estate/) | [Source](https://www.iko.com/na/product/royal-estate/) |
| Crowne Slate Designer Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/crowne-slate-designer-shingles/) | [Source](https://www.iko.com/na/product/crowne-slate-designer-shingles/) |
| Cambridge Architectural Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/cambridge/) | [Source](https://www.iko.com/na/product/cambridge/) |
| Cambridge Cool Colors Plus Architectural Shingles | [Review](http://127.0.0.1:4321/products/roofing/shingles/iko/cambridge-cool-colors/) | [Source](https://www.iko.com/na/product/cambridge-cool-colors/) |

### Trex — 6 products

[Open collection](http://127.0.0.1:4321/products/decking/composite/trex/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Trex Signature Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/signature/) | [Source](https://www.trex.com/products/decking/signature/) |
| Trex Transcend Lineage Composite Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/lineage/) | [Source](https://www.trex.com/products/decking/lineage/) |
| Trex Transcend Composite Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/transcend/) | [Source](https://www.trex.com/products/decking/transcend/) |
| Trex Select Composite Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/select/) | [Source](https://www.trex.com/products/decking/select/) |
| Trex Enhance Composite Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/enhance/) | [Source](https://www.trex.com/products/decking/enhance/) |
| Trex Refuge PVC Decking | [Review](http://127.0.0.1:4321/products/decking/composite/trex/refuge/) | [Source](https://www.trex.com/products/decking/refuge/) |

### LP SmartSide — 6 products

[Open collection](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| LP SmartSide Shake Lap Siding | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/shakes/) | [Source](https://www.lpcorp.com/products/siding-trim/shakes) |
| LP SmartSide Lap Siding | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/lap-siding/) | [Source](https://www.lpcorp.com/products/siding-trim/lap-siding) |
| LP SmartSide Trim & Fascia | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/trim-fascia/) | [Source](https://www.lpcorp.com/products/siding-trim/trim-fascia) |
| LP SmartSide Nickel Gap Siding | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/nickel-gap/) | [Source](https://www.lpcorp.com/products/siding-trim/nickel-gap) |
| LP SmartSide Soffit | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/soffit/) | [Source](https://www.lpcorp.com/products/siding-trim/soffit) |
| LP SmartSide Panel & Vertical Siding | [Review](http://127.0.0.1:4321/products/siding/engineered-wood/lp-smartside/panel-vertical-siding/) | [Source](https://www.lpcorp.com/products/siding-trim/panel-vertical-siding) |

### James Hardie — 6 products

[Open collection](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Hardie Plank | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-plank-lap-siding/) | [Source](https://www.jameshardie.com/product-catalog/exterior-siding-products/hardie-plank-lap-siding/) |
| Hardie Panel | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-panel-siding/) | [Source](https://www.jameshardie.com/product-catalog/exterior-siding-products/hardie-panel-siding/) |
| Hardie Artisan Siding | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-artisan-siding/) | [Source](https://www.jameshardie.com/product-catalog/exterior-siding-products/hardie-artisan-siding/) |
| Hardie Shingle | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-shingle-siding/) | [Source](https://www.jameshardie.com/product-catalog/exterior-siding-products/hardie-shingle-siding/) |
| Hardie Architectural Panel | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-architectural-panel-siding/) | [Source](https://www.jameshardie.com/product-catalog/exterior-siding-products/hardie-architectural-panel-siding/) |
| Hardie Trim Batten Boards | [Review](http://127.0.0.1:4321/products/siding/fiber-cement/james-hardie/hardie-trim-batten-boards/) | [Source](https://www.jameshardie.com/product-catalog/trim-products/hardie-trim-batten-boards/) |

### Alu-Rex — 4 products

[Open collection](http://127.0.0.1:4321/products/gutters/guards/alu-rex/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| DoublePro continuous hanger | [Review](http://127.0.0.1:4321/products/gutters/guards/alu-rex/doublepro/) | [Source](https://alu-rex.com/en/doublepro) |
| T-Rex continuous hanger | [Review](http://127.0.0.1:4321/products/gutters/guards/alu-rex/t-rex/) | [Source](https://alu-rex.com/en/t-rex) |
| Gutter Clean Pro | [Review](http://127.0.0.1:4321/products/gutters/guards/alu-rex/guttercleanpro/) | [Source](https://alu-rex.com/en/guttercleanpro) |
| Gutter Clean | [Review](http://127.0.0.1:4321/products/gutters/guards/alu-rex/gutter-clean/) | [Source](https://alu-rex.com/en/gutter-clean) |

### Exterior Portfolio — 6 products

[Open collection](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/)

| Product | Review page | Manufacturer |
| --- | --- | --- |
| Exterior Portfolio Carolina Sands | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/carolina-sands-vinyl-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/carolina-sands-vinyl-siding) |
| Exterior Portfolio EP Board & Batten | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/board-batten-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/board-batten-siding) |
| Exterior Portfolio Premium Pointe | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/premium-pointe-vinyl-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/premium-pointe-vinyl-siding) |
| Exterior Portfolio Market Square | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/market-square-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/market-square-siding) |
| Exterior Portfolio Parkview | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/parkview-vinyl-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/parkview-vinyl-siding) |
| Exterior Portfolio Elm Grove | [Review](http://127.0.0.1:4321/products/siding/vinyl/exterior-portfolio/elm-grove-vinyl-siding/) | [Source](https://www.westlakeroyalbuildingproducts.com/siding-and-accessories/exterior-portfolio/elm-grove-vinyl-siding) |

## Product menu follow-up

All 73 product detail pages, including the 62 new manufacturer products, are nested beneath their brands in both native and imported navigation. Desktop and mobile browser checks opened Owens Corning Duration through the nested menu successfully. The single optimized WebP atlas now covers all 194 menu destinations; unique fingerprints and transfer-budget checks pass. Product URLs remain unchanged. This update is local and has not been published.

## Product styling follow-up

The shared individual-product layout now follows the established editorial design: Playfair headings, Inter controls and body copy, ivory and charcoal surfaces, simple orange rules, a diagonal product-information band, and restrained transitions with reduced-motion support. The overview uses a proportionate manufacturer photograph rather than a padded square; original sample imagery and all color controls remain intact. Performance disclosures use neutral brand styling rather than separate pastel colors. A booking action sits beside the copy. Warranty and specification panels use a desktop side selector and mobile wrapping controls, with page-specific H2 and subordinate panel headings.

The local build, catalog/source checks, HTML attributes and structured-data validation pass. Browser checks cover all 150 new-catalog desktop/mobile routes with no-JavaScript fallbacks. An additional original-GAF pass protects the legacy color selectors and warranty/specification/companion panels; wide energy-rating tables remain contained in their own horizontal scroller. No new image files or downloads were added for this styling pass. Local review only.
