# Roofing landing page revision

The user supplied a content wireframe on October 17, 2026 as directional reference and requested adaptation to the existing brand. `/roofing/` now renders ServiceLanding.astro, with copy in roofing-landing.json, rather than the ServicePage migration template. The WordPress content body and earlier service-pages.json sections remain source evidence. Its brandIds selection still controls the landing’s BrandStrip. Do not rerun the WordPress transfer to overwrite this editorial replacement.

The page keeps the “Columbus, OH Roofing Company” H1, title, canonical and URL. The Columbus location page retains its separate “Columbus Ohio Roofing Services” focus and receives a contextual link. No routes were removed or redirected.

## Adaptation

- LandingHero uses the existing forest/orange/cream palette, serif typography and a separate optimized roof photograph. Its primary action anchors to the final estimate section. Header quote actions still open the existing dialog.
- ServicePaths uses ServiceExplorer.svelte to present eight topics: repair, replacement, cost, calculator, GAF installation, Master Elite certification, metal and storm damage. Desktop has vertical tabs in one column with content in two; mobile uses a native dropdown below 761px. Each panel has context, key points and a destination link. All panels and anchor links remain in the server HTML and readable without JS. Desktop supports Up/Down/Home/End keys, roving focus and automatic activation. Materials also retain their dedicated comparison section. Commercial roofing retains a contextual link.
- The services heading is “Residential Roofing Services Near Columbus, OH.” Tab previews are summarized from their linked detail pages, with direct benefit-led copy and optional product, review and warranty links. Repair copy invites visitors to learn whether symptoms point to repair or replacement without presenting a diagnosis on the landing page. The standalone symptom checklist has been removed.
- The attributed customer review and credential sections now follow the service explorer, ahead of the material comparison. This landing introduces the company, services and products, with customer feedback and trust factors prominent in the page flow.
- ProjectShowcase uses two existing roofing-gallery images with factual visual captions. No location, completion date, product model or case-study outcome is inferred. The unverified before/after pairing and generic statewide map were omitted from this landing; gallery and service-area destinations remain.
- Credentials have visible source links. ProcessSteps adapts the existing consultation/workmanship/final-review narrative with project-scoping guidance; it adds no guaranteed timelines or inspection turnaround.
- Materials link to the product pillar, the GAF catalog and metal/type information. Brand selection remains configurable.
- Cost guidance replaces the promotional offer-card row. No lender, monthly payment or seasonal promotion is asserted. Historical offer URLs remain accessible elsewhere and are preserved.
- ReviewSection now uses the same three-card layout on the homepage and native services, including this landing. Explicit reviewIds select verified excerpts from Google (Marianna Faria), BBB (Douglas C) and Birdeye (Kenneth G.). featured-reviews.json records verification notes and original destinations; badges no longer link to first-party review pages. Google has a review-specific share URL; BBB and Birdeye have verified review-container fragments. Headings are editorial and text is labeled as excerpts. Only individually verified numeric ratings render stars. No review/aggregate rating schema is added. The root quote dialog still suppresses its existing aggregate-rating block via showRating.
- FAQs use native details. Quote delivery remains disabled as previously requested; no submission success, CRM delivery or Roofr automation is claimed.

## Evidence checked October 17, 2026

- [GAF contractor profile](https://www.gaf.com/en-us/roofing-contractors/residential/usa/oh/columbus/roof-king-restoration-llc-1129747) lists Master Elite certification and the existing client-supplied telephone. No rating/count was copied into the new landing.
- [BBB business profile](https://www.bbb.org/us/oh/columbus/profile/roofing-contractors/roof-king-restoration-0302-70125693) lists accreditation, A+ business rating and the Douglas C excerpt used with attribution and a source link. Business rating is not presented as a customer star score.
- [Published workmanship offer](https://www.roofkingco.com/offers/5-year-workmanship-warranty/) describes five-year workmanship coverage. Written terms and manufacturer coverage remain separate.
- Existing site media was visually inspected before reuse. These assets are not evidence of a verified Columbus project address. The materials images illustrate roofing finishes.

The wireframe’s telephone, alternate address, lender example and evidence placeholders were not adopted. site.json remains the business identity authority. Owner confirmation of operational details and production form delivery remain release tasks.

## Validation

Existing service checks retain verbatim migration comparisons for the other native service pages. The intentionally rewritten root has checks for one H1, preserved canonical, required contextual links, estimate target, sized images, six FAQ disclosures, one modal host and disabled forms. It rejects old payment claims, anonymous Google counts and evidence placeholders. Browser review covers desktop and narrow layouts, anchor navigation, FAQ expansion and the quote dialog.
