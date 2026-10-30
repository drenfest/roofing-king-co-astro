# October 30 copy corrections and product care

Source: the user-supplied Roof-King-Copy-Corrections.pdf (five pages), reviewed visually and extracted locally. The PDF contains approved replacement copy plus placement notes; editorial notes are not customer-facing copy. Repository fetch and fast-forward pull confirmed main was already current at 7c18c497ab9572928be7651e12e24360d5390fb1, with no tracked local changes before implementation.

## Implemented changes

- Lineage: exact deck lifespan/care replacement, H2 with four H3 topics, product-specific specifications introduction, corrected four badges and three Trex reference links. Seven colors and the 50-year limited residential warranty remain specific to this product.
- Dublin and Columbus roof repair: all twelve supplied heading replacements in the runtime copy and retained authoring overrides, with matching photo-topic metadata. Existing H1s, section IDs, prose and destinations are preserved.
- Captions: concise supplied-photo and Trex manufacturer credits. Roof repair illustrations and comparisons retain explicit illustration labels, including in schema.
- Shared contact areas: remove unavailable inputs, disabled submit buttons and coming-soon text. Replace with the supplied booking/phone copy and real links, preserving #quote-form compatibility anchors, dialog focus/Escape behavior and no-JavaScript links. Custom submission is not enabled. Launching a future submission form still requires implemented delivery and a verified received submission.
- Follow-up user request: material/component-specific care for all 96 product detail pages and their shared collection disclosures. Thirteen profiles distinguish shingles, vinyl, polypropylene, fiber cement, engineered wood, composite decking, PVC decking, railing, fascia, fasteners, lighting, drainage and gutter protection. No universal lifespan or warranty duration is invented. GAF roof-energy measurements render only on GAF products.

## Ownership

ProductSpecifications uses product-care.ts and product-care.json; exact collection overrides stay in the product's care and specificationsIntro fields. project-contact.json and ContactActions own current shared contact copy/actions. Service authoring overrides preserve the two revised heading sets. check-copy-corrections.mjs protects the supplied replacements, family coverage and contact behavior; existing tests now assert actual booking/phone paths instead of requiring disabled forms.

## Manufacturer references reviewed

- https://www.trex.com/products/decking/lineage/
- https://www.trex.com/customer-support/trex-owners/care-and-cleaning/
- https://www.trex.com/customer-support/trex-owners/downloads/
- https://www.trex.com/customer-support/trex-owners/warranty/
- https://www.trex.com/deck-ideas/clean-and-maintain-railing/
- https://trexrainescape.com/frequently-asked-questions/
- https://www.plygem.com/siding/resources/care-maintenance/
- https://www.jameshardie.com/blog/siding-durability/tips-for-cleaning-your-siding/
- https://www.lpcorp.com/project-resources/blog/7-tips-for-care-maintenance-of-lp-smartside-siding
- https://www.leaffilter.com/blog/home-exteriors/roofing-gutters/doesnt-debris-just-sit-on-top-of-leaffilter/
- https://marketing.alu-rex.com/hubfs/39830866/resources/installations/Installation_Guide_GutterClean_MX300-EN.pdf

- https://www.gaf.com/en-us/blog/your-home/annual-maintenance-and-roofing-tips-for-every-homeowner-28429b44-d47c-401d-9ff6-adc36bb0f093

## Verification

Completed npm run verify, followed by a fresh type/content check, rebuild and focused copy/contact/homepage/schema checks after the final modal focus and typography adjustments. All 364 preserved paths, 330 schema/sitemap pages, 96 product detail pages and 466 context maps passed. The existing ReviewCollection Svelte warning remains; there are no errors.

Browser review passed six representative pages at 1440px and 390px: Lineage, Dublin roof repair, Columbus roof repair, Contact, Cedar Dimensions and glass railing. It verified care-panel visibility, no horizontal overflow, no unavailable form inputs, Escape behavior and focus restoration (visible quote trigger on desktop, menu toggle on mobile). A no-JavaScript check retained care content and phone/booking links. Screenshots and browser results are in tmp/pdf-copy-corrections.

All 330 canonical pages were checked for main-content forms: none remain. The 250 pages with shared contact areas have the prescribed two actions. The supplied Calendly destination returned HTTP 200 and rendered the existing inspection calendar. Telephone links match tel:+16143798893. No booking, call, test submission, publication or account change was performed. git diff --check passed. The implementation remains local.
