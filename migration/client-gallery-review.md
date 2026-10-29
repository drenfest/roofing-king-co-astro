# Supplied photography gallery review

Status: REVIEW REQUIRED — implemented and checked locally; not committed, pushed or deployed.

## Collection coverage

Riley’s root folder and nested folder were refreshed on October 29, 2026. The 104 entries contain 98 image files; the remaining entries are a folder, two system files and three documents. All 98 images were downloaded and inspected. Four HEIF originals were decoded successfully.

- 77 unique photographic images are represented in the gallery.
- 9 duplicate files or alternate crops map to their retained photograph.
- 12 diagrams, product renderings, logos and badge graphics are cataloged below rather than presented as photographs.
- 103 total gallery photographs: 77 supplied photographs, including an upgraded version of existing photo-25, plus 26 retained site photographs.

## Browsing and classification

The full collection is available in the [homepage gallery](http://127.0.0.1:4321/#projects) and [past projects](http://127.0.0.1:4321/past-projects/#projects). Service galleries select subject-matched images. Roofing, commercial roofing, siding, metal roofing, painting, windows, gutters, decks, insulation and storm-damage filters remain available; company photos and unrelated references have their own groups. Local galleries exclude company-only and unrelated references.

Each new photograph has a descriptive caption, alt text, service/subject tags, source type and source-file provenance. Search covers captions, alternatives and subject tags. Image-type filtering distinguishes supplied photographs, existing site photographs, inspection references, material references, company photos and unrelated references. Reference images are visibly labeled, including the one photograph bearing another contractor’s logo. A pictured material or damaged detail is not a claim about Roof King installation ownership, project location, warranty or damage cause.

Source files and full-resolution decoded originals remain outside the public directory. The website uses only optimized derivatives.

## Optimization

| Measure | Result |
| --- | ---: |
| Unique photographic source files | 36.37 MB |
| Largest responsive version of each supplied photograph, combined | 9.70 MB |
| Reduction for that largest-image set | 73.3% |
| All 265 responsive WebP variants | 21.52 MB |
| Largest individual WebP | 179.8 KB |
| Small originals displayed without enlargement | 27 |

Variants use up to 320/480/800/1280 px widths bounded by the source. Difficult images reduce dimensions rather than accepting very low encoding quality. EXIF, XMP and IPTC are removed. Small photographs are contained at native size in cards and lightboxes; material labels, attribution and source overlays are preserved. Existing retained gallery media keeps its previous 180 KB budget.

## Validation

- `npm run verify` passed: preserved routes, page content, gallery source coverage, image attributes, structured data, sitemap and existing integration checks. Zero errors; the existing ReviewCollection.svelte warning remains.
- The final caption refinements were rebuilt and gallery, homepage and Schema.org checks passed again.
- Private source-file IDs are excluded from public gallery HTML and hydration props.
- Browser review: 1440, 390 and 320 px; four desktop/two mobile photos per group; complete-group paging; mobile touch swipe; service and image-type filters; subject search and empty results; keyboard/lightbox navigation and Escape; no horizontal page overflow or browser errors.
- Initial supplied-gallery image requests were four on desktop and two on mobile, rather than the entire collection.
- A 275 px original rendered at 275 px in both card and lightbox.
- All 103 photo links remain available with JavaScript disabled.
- Roofing, commercial roofing, siding, windows, painting and Cleveland location gallery rendering was checked.

## Every supplied image file

Gallery entries are linked to their optimized full-size version. Duplicate rows point to the same gallery record. Non-photographic files retain a reason for exclusion.

| File | Destination / disposition | Subject tags | Source dimensions |
| --- | --- | --- | --- |
| IMG_2345.jpg | [Neighborhood rooflines from above](http://127.0.0.1:4321/media/client-gallery/neighborhood-rooflines-from-above-9519a407c8-1280.webp) — Supplied photo | roofing, aerial, shingles, neighborhood | 1290 × 842 |
| IMG_5458.HEIC | [At the building exterior](http://127.0.0.1:4321/media/client-gallery/at-the-building-exterior-5fcb2b6f32-1088.webp) — Supplied photo | commercial-roofing, company, scaffolding, truck | 3024 × 4032 |
| IMG_1106 2.jpg | [The team together outdoors](http://127.0.0.1:4321/media/client-gallery/the-team-together-outdoors-b8adcbbb28-1280.webp) — Team & company | company, team, group | 1283 × 645 |
| 4B12A4B130DCB7DF9210014A7F8135E6.JPG | [Roof preparation and shingle installation](http://127.0.0.1:4321/media/client-gallery/roof-preparation-and-shingle-installation-89b962fe5d-1088.webp) — Supplied photo | roofing, installation, underlayment, aerial | 5472 × 3648 |
| 203f10cc-567e-413f-8249-75f7a312a19e.jpeg | Roof-system illustration branded for another contractor |  | 800 × 800 |
| IMG_6917.jpg | [Rooflines at sunset](http://127.0.0.1:4321/media/client-gallery/rooflines-at-sunset-737899ca49-1280.webp) — Supplied photo | roofing, aerial, sunset, neighborhood | 1283 × 798 |
| IMG_6918.jpg | [An overhead view of the neighborhood](http://127.0.0.1:4321/media/client-gallery/an-overhead-view-of-the-neighborhood-37a5439c4c-1280.webp) — Supplied photo | roofing, aerial, shingles, neighborhood | 1283 × 762 |
| IMG_6919.jpg | [Neighborhood rooflines from above](http://127.0.0.1:4321/media/client-gallery/neighborhood-rooflines-from-above-9519a407c8-1280.webp) — Alternate crop of the same aerial photograph | roofing, aerial, shingles, neighborhood | 1283 × 825 |
| IMG_6920.jpg | [Roof shapes across adjoining homes](http://127.0.0.1:4321/media/client-gallery/roof-shapes-across-adjoining-homes-cc6371f363-1280.webp) — Supplied photo | roofing, aerial, shingles, neighborhood | 1283 × 829 |
| IMG_6921.jpg | [Brick buildings and window details](http://127.0.0.1:4321/media/client-gallery/brick-buildings-and-window-details-3ac260f803-1280.webp) — Supplied photo | commercial-roofing, windows, brick, exterior | 1283 × 905 |
| IMG_6922.jpg | [Underlayment around roof vents](http://127.0.0.1:4321/media/client-gallery/underlayment-around-roof-vents-36bea958f3-924.webp) — Supplied photo | roofing, commercial-roofing, installation, underlayment, ventilation | 1283 × 1604 |
| IMG_6923.jpg | [Low-slope seams and penetrations](http://127.0.0.1:4321/media/client-gallery/low-slope-seams-and-penetrations-c881fcf613-1280.webp) — Supplied photo | commercial-roofing, membrane, seams, penetrations, repair | 1283 × 1660 |
| IMG_6847.jpg | [The Roof King team outdoors](http://127.0.0.1:4321/media/client-gallery/the-roof-king-team-outdoors-4402f0ae40-1280.webp) — Team & company | company, team, group | 1283 × 680 |
| IMG_5811.HEIC | [A smaller member of the team](http://127.0.0.1:4321/media/client-gallery/a-smaller-member-of-the-team-24d274edd7-1170.webp) — Team & company | company, team, culture, kitten | 1170 × 1963 |
| IMG_6842 2.jpg | [The roofline at the end of the day](http://127.0.0.1:4321/media/client-gallery/the-roofline-at-the-end-of-the-day-34c18dd0ca-1009.webp) — Supplied photo | roofing, company, sunset, roofline | 1009 × 1216 |
| IMG_6841.jpg | [Together at the Roof King office](http://127.0.0.1:4321/media/client-gallery/together-at-the-roof-king-office-b4ec2fe748-924.webp) — Office group crop; use the full-resolution original | company, team, office, group | 1017 × 993 |
| IMG_6628.jpg | [A finished shingle roof from above](http://127.0.0.1:4321/media/client-gallery/a-finished-shingle-roof-from-above-7eceb28609-1088.webp) — Supplied photo | roofing, aerial, shingles, ridges, valleys | 1283 × 1131 |
| IMG_6626.jpg | [Along the ridge toward the chimney](http://127.0.0.1:4321/media/client-gallery/along-the-ridge-toward-the-chimney-978280d111-924.webp) — Supplied photo | roofing, ridge-caps, chimney, shingles | 1283 × 1414 |
| IMG_6625.jpg | [Roofing above a dark-sided exterior](http://127.0.0.1:4321/media/client-gallery/roofing-above-a-dark-sided-exterior-26a87ec404-1280.webp) — Supplied photo | roofing, siding, windows, exterior, porch | 1283 × 930 |
| IMG_6624.jpg | [Adjoining roofs and yards](http://127.0.0.1:4321/media/client-gallery/adjoining-roofs-and-yards-e9789b5abf-1280.webp) — Supplied photo | roofing, aerial, shingles, neighborhood | 1283 × 907 |
| IMG_6623.jpg | [Brick, shingles and the front elevation](http://127.0.0.1:4321/media/client-gallery/brick-shingles-and-the-front-elevation-d6c7088205-924.webp) — Supplied photo | roofing, windows, exterior, brick | 1283 × 1230 |
| IMG_6621.jpg | [Dormers, valleys and intersecting roofs](http://127.0.0.1:4321/media/client-gallery/dormers-valleys-and-intersecting-roofs-6ed0a88fdc-924.webp) — Supplied photo | roofing, aerial, shingles, dormers, valleys | 1283 × 1097 |
| IMG_6620.jpg | [An overhead roof view from Roof King](http://127.0.0.1:4321/media/client-gallery/an-overhead-roof-view-from-roof-king-463cfbe8ee-1280.webp) — Supplied photo | roofing, aerial, company, promotional | 1283 × 1257 |
| IMG_6619.jpg | [Skylights within the roof](http://127.0.0.1:4321/media/client-gallery/skylights-within-the-roof-86e473674d-924.webp) — Supplied photo | roofing, skylights, aerial, company, promotional | 1283 × 1256 |
| Roof Sunset.pdf.png | [On the roof at sunset](http://127.0.0.1:4321/media/client-gallery/on-the-roof-at-sunset-25c810bab4-1280.webp) — Export of the same sunset photograph; use the full-resolution original | roofing, company, sunset, roofline | 1545 × 2000 |
| IMG_6006.HEIC | [Together at the Roof King office](http://127.0.0.1:4321/media/client-gallery/together-at-the-roof-king-office-b4ec2fe748-924.webp) — Team & company | company, team, office, group | 3024 × 4032 |
| IMG_6299.jpg | [An interior color reference](http://127.0.0.1:4321/media/client-gallery/an-interior-color-reference-88075665c0-1207.webp) — Other reference | other-references, interior, color-reference | 1207 × 1150 |
| Picture2.jpg | [The whole roof and property](http://127.0.0.1:4321/media/client-gallery/the-whole-roof-and-property-161d011535-948.webp) — Supplied photo | roofing, aerial, shingles, property | 948 × 690 |
| IMG_0125.jpeg | [On the roof at sunset](http://127.0.0.1:4321/media/client-gallery/on-the-roof-at-sunset-25c810bab4-1280.webp) — Supplied photo | roofing, company, sunset, roofline | 3024 × 4032 |
| siding-wind-damage.jpeg | [Displaced siding and exposed housewrap](http://127.0.0.1:4321/media/client-gallery/displaced-siding-and-exposed-housewrap-f78d2e2fbd-800.webp) — Inspection reference | siding, storm-damage, inspection, housewrap, displaced-siding | 800 × 555 |
| Creased .jpeg | [Inspecting a creased shingle tab](http://127.0.0.1:4321/media/client-gallery/inspecting-a-creased-shingle-tab-272025f08f-554.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, creases | 768 × 1024 |
| Missing Layer.jpeg | [A lifted shingle layer](http://127.0.0.1:4321/media/client-gallery/a-lifted-shingle-layer-7ebe1b4cdf-554.webp) — Inspection reference | roofing, inspection, shingles, layers | 768 × 1024 |
| Wind Damage .jpeg | [Missing and lifted shingle tabs](http://127.0.0.1:4321/media/client-gallery/missing-and-lifted-shingle-tabs-878635c720-576.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, missing-tabs | 576 × 768 |
| Pull Throughs 1 .jpeg | [Shingle creases near the fasteners](http://127.0.0.1:4321/media/client-gallery/shingle-creases-near-the-fasteners-bf6f5d121d-554.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, fasteners, creases | 768 × 1024 |
| IMG_6917.jpg | [Rooflines at sunset](http://127.0.0.1:4321/media/client-gallery/rooflines-at-sunset-737899ca49-1280.webp) — Exact byte duplicate | roofing, aerial, sunset, neighborhood | 1283 × 798 |
| 8AEBC6B3-8C8A-4FD5-A407-285FBED15D36.JPG | [The team together outdoors](http://127.0.0.1:4321/media/client-gallery/the-team-together-outdoors-b8adcbbb28-1280.webp) — Alternate crop of the same team photograph | company, team, group | 1284 × 712 |
| 1-1.webp | Labeled drip-edge illustration |  | 696 × 696 |
| Roof_Drip_Edge_Flashing_312_DJFse.jpeg | Copyrighted drip-edge cross-section drawing |  | 829 × 569 |
| DeckingRotten-1.jpeg | [Deteriorated decking beside a chimney](http://127.0.0.1:4321/media/client-gallery/deteriorated-decking-beside-a-chimney-60a4a3695e-425.webp) — Inspection reference | roofing, inspection, decking, chimney, deterioration | 425 × 524 |
| bad-decking-under-shingles.jpeg | [Decking beneath the shingle layers](http://127.0.0.1:4321/media/client-gallery/decking-beneath-the-shingle-layers-b4adcb693b-500.webp) — Inspection reference | roofing, inspection, decking, deterioration | 500 × 305 |
| 126202-58b08afcecbf9_20140629123702.jpeg | [A closer look at exposed roof boards](http://127.0.0.1:4321/media/client-gallery/a-closer-look-at-exposed-roof-boards-cf289f6f1e-270.webp) — Inspection reference | roofing, inspection, decking, boards, deterioration | 270 × 480 |
| 4371-1610349831-complete-tear-off-before-roof-replacement.jpg.jpg | [Removing the old roof covering](http://127.0.0.1:4321/media/client-gallery/removing-the-old-roof-covering-f3ec0c5707-840.webp) — Third-party reference | roofing, installation, tear-off, third-party-reference | 840 × 630 |
| Tearing-Off-Old-Roofing.jpeg | [Tear-off and ground protection](http://127.0.0.1:4321/media/client-gallery/tear-off-and-ground-protection-0ff40ad226-1080.webp) — Material & service reference | roofing, installation, tear-off, tarps | 1080 × 750 |
| cobra-snowcountry_1000.webp | Isolated ridge-vent product rendering |  | 1000 × 1000 |
| timbertex-weathered-wood-carousel-image_1000.webp | [TimberTex ridge-cap appearance](http://127.0.0.1:4321/media/client-gallery/timbertex-ridge-cap-appearance-f3feba6d8b-850.webp) — Manufacturer reference | roofing, materials, ridge-caps, gaf, timbertex | 1000 × 1000 |
| seal-a-ridge-weathered-wood-carousel-image_1000.webp | [Seal-A-Ridge ridge-cap appearance](http://127.0.0.1:4321/media/client-gallery/seal-a-ridge-ridge-cap-appearance-8e80636075-850.webp) — Manufacturer reference | roofing, materials, ridge-caps, gaf, seal-a-ridge | 1000 × 1000 |
| weatherblocker_1000.webp | Isolated starter-strip product rendering |  | 1000 × 1000 |
| weatherblocker-halfsheet-install_1000.webp | [Starter-strip and shingle detail](http://127.0.0.1:4321/media/client-gallery/starter-strip-and-shingle-detail-a2fbae8d3b-1000.webp) — Manufacturer reference | roofing, materials, starter-strip, gaf, roof-edge | 1000 × 1000 |
| tile-warranties-lifetimeltd2.webp | Warranty badge graphic |  | 720 × 480 |
| tile-warranties-windproven2.webp | Warranty badge graphic |  | 720 × 480 |
| tile-warranties-stainguard2.webp | Warranty badge graphic |  | 720 × 480 |
| hdz-ww-1000x1000.webp | [Timberline HDZ on a home](http://127.0.0.1:4321/media/client-gallery/timberline-hdz-on-a-home-ba02b7bfed-1000.webp) — Manufacturer reference | roofing, materials, shingles, gaf, timberline-hdz | 1000 × 1000 |
| tlns-weatheredwood-house-hero_1000.webp | [Timberline Natural Shadow roof appearance](http://127.0.0.1:4321/media/client-gallery/timberline-natural-shadow-roof-appearance-d6ac96452f-1000.webp) — Manufacturer reference | roofing, materials, shingles, gaf, natural-shadow | 1000 × 1000 |
| weatherwatch-rolled-on-rooftop_1000.webp | [Rolling out roof-deck protection](http://127.0.0.1:4321/media/client-gallery/rolling-out-roof-deck-protection-3eec5e37f6-1000.webp) — Manufacturer reference | roofing, materials, installation, underlayment, gaf, weatherwatch | 1000 × 1000 |
| 05119450.webp | [FeltBuster underlayment installation](http://127.0.0.1:4321/media/client-gallery/feltbuster-underlayment-installation-77052954ae-1280.webp) — Manufacturer reference | roofing, materials, installation, underlayment, gaf, feltbuster | 2500 × 1663 |
| coke-logo-10.jpeg | Unrelated Coca-Cola logo |  | 570 × 426 |
| GAF-01-HDZ-Shingles.webp | [Timberline HDZ material reference](http://127.0.0.1:4321/media/client-gallery/timberline-hdz-material-reference-37d4972b23-550.webp) — Manufacturer reference | roofing, materials, shingles, gaf, timberline-hdz | 550 × 550 |
| GAF Roofing Timberline Natural Shadow Brochure Thumb.jpeg | [GAF roofing brochure reference](http://127.0.0.1:4321/media/client-gallery/gaf-roofing-brochure-reference-13c7105758-533.webp) — Manufacturer reference | roofing, materials, literature, gaf, brochure | 533 × 324 |
| CElogo.png | GAF certification badge |  | 250 × 258 |
| 1200px-GAF_logo.svg.png | GAF logo |  | 1200 × 1200 |
| State-Farm-Logo-2012-present.png | State Farm logo |  | 3840 × 2160 |
| dscf0499-1-1-862x647.jpeg | [Buckled and displaced siding courses](http://127.0.0.1:4321/media/client-gallery/buckled-and-displaced-siding-courses-02a28fc5c6-862.webp) — Inspection reference | siding, inspection, displaced-siding, buckling | 862 × 647 |
| cracked-Shingles-4.jpeg | [Cracks across shingle tabs](http://127.0.0.1:4321/media/client-gallery/cracks-across-shingle-tabs-08b00d5ae8-687.webp) — Inspection reference | roofing, inspection, shingles, cracks | 687 × 384 |
| Thermal Cracking.jpeg | [Cracks across shingle tabs](http://127.0.0.1:4321/media/client-gallery/cracks-across-shingle-tabs-08b00d5ae8-687.webp) — Exact byte duplicate | roofing, inspection, shingles, cracks | 687 × 384 |
| 1-2-1024x768.jpeg | [Inspecting a marked shingle surface](http://127.0.0.1:4321/media/client-gallery/inspecting-a-marked-shingle-surface-2ef8bbf20e-870.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, surface-marks | 1024 × 768 |
| blisters-in-shingles-002.jpeg | [Shingle surface texture up close](http://127.0.0.1:4321/media/client-gallery/shingle-surface-texture-up-close-8580b7e11b-640.webp) — Inspection reference | roofing, inspection, shingles, surface-texture | 640 × 480 |
| Paint splatter kid.jpeg | [A paint-splatter art reference](http://127.0.0.1:4321/media/client-gallery/a-paint-splatter-art-reference-c8a6b39710-800.webp) — Other reference | other-references, art, paint-splatter | 940 × 650 |
| Paint splatter.webp | [Paint splatter on siding and trim](http://127.0.0.1:4321/media/client-gallery/paint-splatter-on-siding-and-trim-8c89b5ede3-640.webp) — Material & service reference | painting, siding, inspection, paint-splatter, trim | 640 × 362 |
| mETAL ROOF 2.jpeg | [Standing-seam metal at a dormer](http://127.0.0.1:4321/media/client-gallery/standing-seam-metal-at-a-dormer-9a0149f6d9-275.webp) — Material & service reference | roofing, metal, materials, standing-seam, dormer | 275 × 183 |
| mETAL ROOF.jpeg | [Metal panels during installation](http://127.0.0.1:4321/media/client-gallery/metal-panels-during-installation-09f36df8d3-300.webp) — Material & service reference | roofing, metal, materials, installation, panels | 300 × 168 |
| Designer Shingle .jpeg | [Designer shingle roof appearance](http://127.0.0.1:4321/media/client-gallery/designer-shingle-roof-appearance-e9daf36196-500.webp) — Material & service reference | roofing, materials, designer-shingles, exterior | 500 × 500 |
| Spatter marks .jpeg | [A weathered roof surface](http://127.0.0.1:4321/media/client-gallery/a-weathered-roof-surface-373f5d8548-576.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, surface-marks | 576 × 768 |
| 1024x1024N.jpeg | [Chalk-marked shingle creases](http://127.0.0.1:4321/media/client-gallery/chalk-marked-shingle-creases-11a30052d3-554.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, creases | 768 × 1024 |
| 20 YR 3 TAB WIND.jpeg | [Lifting a three-tab shingle for inspection](http://127.0.0.1:4321/media/client-gallery/lifting-a-three-tab-shingle-for-inspection-d97d50c0a4-554.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, three-tab | 768 × 1024 |
| Pulled fastner .jpeg | [Inspecting the fastener area](http://127.0.0.1:4321/media/client-gallery/inspecting-the-fastener-area-04eda1dc6e-870.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, fasteners | 1024 × 768 |
| tile.jpeg | [Tile courses across a finished roof](http://127.0.0.1:4321/media/client-gallery/tile-courses-across-a-finished-roof-e074176e60-1280.webp) — Material & service reference | roofing, materials, tile, exterior | 1600 × 1023 |
| tile_roof.jpeg | [Placing roof tiles](http://127.0.0.1:4321/media/client-gallery/placing-roof-tiles-c226b70c55-500.webp) — Material & service reference | roofing, materials, tile, installation | 500 × 333 |
| 22, 11_33_01 AM.jpeg | [Slate across an intricate roofline](http://127.0.0.1:4321/media/client-gallery/slate-across-an-intricate-roofline-41de6b803c-960.webp) — Material & service reference | roofing, materials, slate, turret | 960 × 640 |
| Slate roof.jpeg | [Slate texture and overlapping courses](http://127.0.0.1:4321/media/client-gallery/slate-texture-and-overlapping-courses-d43ae52ab3-1280.webp) — Material & service reference | roofing, materials, slate, texture | 2119 × 1192 |
| roll.roofing.jpeg | [Roll roofing beside a shingle slope](http://127.0.0.1:4321/media/client-gallery/roll-roofing-beside-a-shingle-slope-649b13a3cb-1024.webp) — Material & service reference | roofing, commercial-roofing, materials, roll-roofing, transitions | 1024 × 768 |
| Rolled roofing.jpeg | [A low-slope roof beside solar panels](http://127.0.0.1:4321/media/client-gallery/a-low-slope-roof-beside-solar-panels-4ce419e9f2-1088.webp) — Material & service reference | roofing, commercial-roofing, materials, roll-roofing, solar-panels | 1088 × 605 |
| EPDM 2.jpeg | [Membrane roofing and parapets](http://127.0.0.1:4321/media/client-gallery/membrane-roofing-and-parapets-941f9eeb30-1024.webp) — Material & service reference | commercial-roofing, materials, epdm, membrane, parapets | 1024 × 768 |
| EPDM ROOF.jpeg | [Membrane seams and rooftop vents](http://127.0.0.1:4321/media/client-gallery/membrane-seams-and-rooftop-vents-48fa670a3c-768.webp) — Inspection reference | commercial-roofing, inspection, membrane, seams, ventilation | 768 × 1024 |
| 1024x1024.jpeg | [Three-tab shingles and roof vents](http://127.0.0.1:4321/media/client-gallery/three-tab-shingles-and-roof-vents-1ce6c021a3-652.webp) — Material & service reference | roofing, materials, three-tab, ventilation | 768 × 1024 |
| Minneapolis-wood-shake-roof-repair-contractor-1024x682.jpeg | [Weathered wood-shake roof courses](http://127.0.0.1:4321/media/client-gallery/weathered-wood-shake-roof-courses-c357e4f40b-1024.webp) — Material & service reference | roofing, materials, wood-shake, ventilation | 1024 × 682 |
| Cedar Shake.jpeg | [Cedar shake texture](http://127.0.0.1:4321/media/client-gallery/cedar-shake-texture-d94ffec705-1000.webp) — Material & service reference | roofing, materials, cedar-shake, texture | 1000 × 750 |
| Organic 3 tab.jpeg | [Curling shingle edges](http://127.0.0.1:4321/media/client-gallery/curling-shingle-edges-14c7499ecd-600.webp) — Inspection reference | roofing, inspection, shingles, curling, deterioration | 600 × 398 |
| Organic Shingles.jpeg | [Severely curled roof shingles](http://127.0.0.1:4321/media/client-gallery/severely-curled-roof-shingles-ae09af281a-448.webp) — Inspection reference | roofing, inspection, shingles, curling, deterioration | 448 × 336 |
| 3 tab.jpeg | [Three-tab shingles and roof vents](http://127.0.0.1:4321/media/client-gallery/three-tab-shingles-and-roof-vents-1ce6c021a3-652.webp) — Alternate crop of the same three-tab roof photograph | roofing, materials, three-tab, ventilation | 768 × 1024 |
| 30 year shingle.jpeg | [Architectural shingles across a roof slope](http://127.0.0.1:4321/media/client-gallery/architectural-shingles-across-a-roof-slope-df3c2ce370-870.webp) — Material & service reference | roofing, materials, architectural-shingles | 1024 × 768 |
| Wind damage 30 yr.jpeg | [Inspecting a creased shingle tab](http://127.0.0.1:4321/media/client-gallery/inspecting-a-creased-shingle-tab-272025f08f-554.webp) — Exact byte duplicate | roofing, storm-damage, inspection, shingles, creases | 768 × 1024 |
| Pull throughs.jpeg | [A lifted tab at the fastening point](http://127.0.0.1:4321/media/client-gallery/a-lifted-tab-at-the-fastening-point-ac3b585cc6-870.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, fasteners | 1024 × 768 |
| Pull throughs 2.jpeg | [A lifted tab at the fastening point](http://127.0.0.1:4321/media/client-gallery/a-lifted-tab-at-the-fastening-point-ac3b585cc6-870.webp) — 150-pixel thumbnail of the same fastener photograph | roofing, storm-damage, inspection, shingles, fasteners | 150 × 113 |
| Pulled Fastner.jpeg | [Fastener inspection beneath a shingle](http://127.0.0.1:4321/media/client-gallery/fastener-inspection-beneath-a-shingle-ed459572f5-1024.webp) — Inspection reference | roofing, storm-damage, inspection, shingles, fasteners | 1024 × 768 |
| HVAC Photo.jpeg | [An exhaust vent at the roof surface](http://127.0.0.1:4321/media/client-gallery/an-exhaust-vent-at-the-roof-surface-4be266a956-275.webp) — Material & service reference | roofing, materials, ventilation, exhaust-vent | 275 × 183 |
| HVAC Photos.jpeg | [Several roof ventilation outlets](http://127.0.0.1:4321/media/client-gallery/several-roof-ventilation-outlets-8f34254a7e-316.webp) — Material & service reference | roofing, materials, ventilation, roof-vents | 316 × 160 |
| Skylight hail damage .jpeg | [Dents around a skylight curb](http://127.0.0.1:4321/media/client-gallery/dents-around-a-skylight-curb-de541f9e8b-686.webp) — Inspection reference | roofing, storm-damage, inspection, skylights, flashing, dents | 686 × 503 |
| Skylight Photo.jpeg | [An open skylight on a tile roof](http://127.0.0.1:4321/media/client-gallery/an-open-skylight-on-a-tile-roof-bcc2556adc-275.webp) — Material & service reference | roofing, materials, skylights, tile | 275 × 183 |

## Source records

- [Root Drive folder](https://drive.google.com/drive/folders/1jQLcmgT2IXFWLtGNT7KDc1X_fV_-MgsE)
- [Nested Drive folder](https://drive.google.com/drive/folders/1ta0lTOQZsfCYLzqgvbNs0He5ALHdxRP7)
- Machine-readable provenance and file-byte report: `migration/client-gallery-inventory.json`.
- Explicit offline rebuild tool: `node scripts/prepare-client-gallery.mjs` (requires the downloaded originals).
- Required verification: `npm run verify`.

The ten-page editorial review remains at 50/83 pages. This gallery pass does not rewrite service copy or begin another batch.
