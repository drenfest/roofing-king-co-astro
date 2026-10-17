# Brand inventory

Checked 2026-10-17 against the published Roof King site, WordPress staging and retained page content. This is evidence of site mentions, not confirmation of every current supplier agreement.

| Material | Names found | Evidence |
| --- | --- | --- |
| Roofing | GAF | [Roofing](https://www.roofkingco.com/roofing/), [metal roofing](https://www.roofkingco.com/roofing/metal/), WordPress roofing copy |
| Siding | James Hardie, LP SmartSide, Ply Gem; Variform by Ply Gem | [Siding](https://www.roofkingco.com/siding/), existing logo strip |
| Decking | Trex | [Decks](https://www.roofkingco.com/decks/), existing logo strip |
| Gutters | Alu-Rex, LeafFilter, T-Rex | [Commercial gutters](https://www.roofkingco.com/commercial-roofing/gutters/), [gutters](https://www.roofkingco.com/gutters/) |

The residential gutter page spells a gutter name “Trex.” The commercial gutter page says “T-Rex.” [Alu-Rex identifies T-Rex as its continuous hanger system](https://alu-rex.com/en/t-rex); it is distinct from Trex decking. The library keeps both names and links T-Rex to the Alu-Rex overview. Ply Gem and Variform remain distinct selectable records, with the parent/brand relationship explained on their pages.

No additional roofing manufacturer was identified in the inspected roofing, metal, roof-types or imported location copy. Do not infer that unrelated siding, decking or gutter manufacturers make the roofing offered by Roof King. Roofing selections currently use GAF; the homepage and Products index show all nine named brands/product lines. Other groups select their relevant records. Legacy pages will adopt these selections as they migrate to native components.

New logo assets come directly from official manufacturer sites; exact asset URLs and intrinsic dimensions are in `src/data/brand-library.json`. Original WordPress logo images retain their original media paths. Logos use intrinsic proportions with size limits. The shared component accepts ordered `brandIds`, deduplicates them and fails on unknown IDs or missing destinations.

New internal overview pages for Ply Gem, Alu-Rex and LeafFilter use the existing ProductHubPage component, with Gutter Products and Gutter Guards and Support as parent hubs. Product availability, installation scope and exact warranty terms require project confirmation. No certification or guaranteed performance is inferred from a brand mention.
