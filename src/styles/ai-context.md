# src/styles

service-editorial.css styles static leaf content as responsive heading/prose rows with no tabs, selector or panel cards. It adapts the approved roofing composition for the other native service pages: responsive hero typography, contextual media rows, crown-backed FAQs and mobile layouts. service-landing.css owns shared slanted bands, tab/select explorer, credential cards, material choices, estimate and related-link layouts. Keep the actual Roof King logo crown in all decorative crown uses. Cards can be green; section backgrounds and diagonal edges must follow the approved reference. Footer content stays in ordinary document flow. Native pages must not load wordpress-compatibility.css or migration.css. Product interactions retain products.css; native header rules live in navigation.css.

## Files

- `base.css`
- `home-interactions.css`
- `home.css`
- `migration.css`
- `navigation.css`
- `products.css`
- `service-editorial.css`
- `service-landing.css`
- `services.css`
- `wordpress-compatibility.css`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

## Full copy styling

service-editorial.css now also owns rk-full-service content bands, two-column media rows, source-topic comparisons, decorative system diagrams, rich leaf openings and the full-copy estimate band. These rules are isolated from the approved /roofing/ reference. Wide layouts alternate forest/cream/light slanted bands; mobile stacks media/content with normal document flow. Do not hide source text to make rows shorter.

The optional rk-service-benefits class displays ServiceArticle items as two forest-green icon cards per row on desktop and one per row on mobile, preserving slanted corners and static readable HTML.

navigation.css owns the compact mobile masthead: three explicit columns, proportional 116px logo, 44px phone target and branded Menu/Close control. Tablet retains the quote action; desktop layout is unchanged. Native toggle span resets override the legacy base.css animation selectors.

Mobile navigation now fills the viewport width and explicitly uses a single content column at every dropdown level, overriding legacy auto-fit/two-column grids. Desktop mega-menu columns remain unchanged.

motion.css owns shared interaction timing, hover/focus feedback, tab/image/dialog entrances, progressive native disclosure interpolation and cross-document page fades. Reduced-motion disables all site animations, transitions and smooth scrolling. Badge explanations are excluded from height interpolation because their content overlays the product image.

The dedicated Storm Damage top-level menu adds one navigation label. Between 1061px and 1240px the duplicate header phone text is hidden to preserve spacing; the quote action remains and mobile retains its call button.

reviews.css styles the native review hub: slanted source/share bands, proportional platform logos, responsive review grids, topic filters and full readable excerpts. It inherits motion.css and existing card branding; no carousel or external review widget is loaded.

BrandStrip owns its compact diagonal band, horizontal scroll-snap track, three/two visible logo proportions and progressive controls. Preserve selected-brand counts, internal destinations, proportional logos, native mobile swiping and reduced-motion/focus states.

service-hero.css owns the shared full-bleed LandingHero treatment: positioned responsive photo, warm ivory gradient behind dark sentence-case text, restrained orange actions, responsive copy width and mobile framing. The source image occupies the whole hero, not a square column. Keep focus, page-transition and reduced-motion rules from motion.css.

The leaf-opening mobile grid uses minmax(0,1fr), shrinkable children and safe long-heading wrapping to prevent 320px horizontal overflow. This is a responsive containment fix; service wording and heading hierarchy remain unchanged.

Client-selected type pairing: --rk-font-display uses Playfair Display; --rk-font-body uses Inter in both base.css and the legacy compatibility shell. All six heading levels use the display font. Navigation (including mega-menu overview labels), buttons, paragraphs and eyebrow labels use Inter; decorative quote glyphs and logo artwork remain graphical assets.

PageHero and LandingHero share service-hero.css and rk-editorial-hero classes. Homepage copy supports optional titleEmphasis and note; emphasis must be an exact title suffix. Mobile heroes place the full-width photo below the copy. TrustStrip uses three light certification/review columns and proportional source badges, stacking on phones. Keep generated-image credits, existing service paragraphs and booking destinations.

The client-selected site palette is ivory, charcoal and orange. Green/teal brand surfaces are replaced in both shared styles and component-local styles. Base and compatibility shells expose --rk-charcoal, --rk-charcoal-soft, --rk-paper and --rk-paper-soft; older green/blue/royal token names remain compatibility aliases to this neutral palette. Preserve authentic manufacturer/review logos, product photos and semantic performance badge colors. Retain existing diagonal layouts, typography and interaction states.

Primary actions use orange surfaces and charcoal labels for contrast; secondary actions use charcoal with ivory labels. Keep native and compatibility action rules synchronized.

The current ProjectGallery layout is component-scoped in ProjectGallery.svelte and supersedes the older dark masonry rules in home.css for that island. Its ivory background, borderless photos, captions, quiet filters and charcoal gallery link follow the latest reference; keep reduced-motion support.

Batch 01 reading refinements are scoped to data-content-review="01": sentence-case topic headings, smaller subordinate titles, responsive media/prose rows and nested ivory manufacturer strips. Other service pages retain their current heading presentation.


navigation.css gives desktop menus an independent photo panel beside all four link columns, switching to a compact image strip at smaller desktop widths. Mobile dropdowns show one wide contextual preview. Photo entrances honor reduced-motion and use existing motion timing.


The menu uses editorial ivory surfaces, fine separators, lighter Inter links, a Playfair panel title and restrained orange branch accents. Mobile rows replace legacy raised cards and filled toggles. Desktop panels fade/translate; mobile disclosure display transitions progressively enhance modern browsers with immediate accessible hidden/inert state. No-JS navigation remains static and readable. Keep reduced-motion overrides and full-width nested mobile lists.


Product pages reuse service-hero.css through ProductHero; product-specific refinements live in products.css. Collection cards use full photographs and proportional manufacturer marks, with subordinate H3 titles. Guidance uses two columns for four items, three for three items, and one on mobile. Native product detail panels use underline tabs, quieter product surfaces and sentence-case hierarchy; semantic badge colors remain unchanged.


ServicePaths panel imagery uses rk-service-tab-image directly after the eyebrow: a responsive 2:1 crop on desktop and 16:9 on phones, intrinsic image sizing and a discreet illustrative label. Existing tab selection, panel entrance motion and reduced-motion rules remain in force.


MenuPreview atlas cells are square background layers cropped within the desktop/mobile preview frame, preserving photo proportions. Authentic manufacturer logos are pre-composited proportionally on ivory within each cell. All crossfades and existing menu motion retain reduced-motion support.


Atlas previews render at no more than 192px on desktop; mobile uses a compact 96px image alongside its destination caption, retaining full-width one-column menu links. This keeps thumbnails crisp and avoids enlarging a small sprite tile into a wide mobile banner.

component-refinements.css is the shared editorial finish imported by SiteMotion in both shells: sentence-case presentation, flat orange/charcoal buttons and restrained accents/shadows while preserving diagonal section backgrounds and genuine/semantic artwork. It also owns the wider two-column desktop quote dialog and responsive field layout.
