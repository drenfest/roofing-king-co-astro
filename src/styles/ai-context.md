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

Editorial brand strips use fractional desktop columns instead of a fixed 230px/180px list. BrandStrip owns the shared tablet/mobile stacking and two-column phone grid. Preserve selected-brand counts, internal destinations, proportional logos and the existing motion/focus states.

service-hero.css owns the shared full-bleed LandingHero treatment: positioned responsive photo, warm ivory gradient behind dark sentence-case text, restrained orange actions, responsive copy width and mobile framing. The source image occupies the whole hero, not a square column. Keep focus, page-transition and reduced-motion rules from motion.css.

The leaf-opening mobile grid uses minmax(0,1fr), shrinkable children and safe long-heading wrapping to prevent 320px horizontal overflow. This is a responsive containment fix; service wording and heading hierarchy remain unchanged.

Client-selected type pairing: --rk-font-display uses Playfair Display; --rk-font-body uses Inter in both base.css and the legacy compatibility shell. All six heading levels use the display font. Navigation (including mega-menu overview labels), buttons, paragraphs and eyebrow labels use Inter; decorative quote glyphs and logo artwork remain graphical assets.

PageHero and LandingHero share service-hero.css and rk-editorial-hero classes. Homepage copy supports optional titleEmphasis and note; emphasis must be an exact title suffix. Mobile heroes place the full-width photo below the copy. TrustStrip uses three light certification/review columns and proportional source badges, stacking on phones. Keep generated-image credits, existing service paragraphs and booking destinations.

The client-selected site palette is ivory, charcoal and orange. Green/teal brand surfaces are replaced in both shared styles and component-local styles. Base and compatibility shells expose --rk-charcoal, --rk-charcoal-soft, --rk-paper and --rk-paper-soft; older green/blue/royal token names remain compatibility aliases to this neutral palette. Preserve authentic manufacturer/review logos, product photos and semantic performance badge colors. Retain existing diagonal layouts, typography and interaction states.

Primary actions use orange surfaces and charcoal labels for contrast; secondary actions use charcoal with ivory labels. Keep native and compatibility action rules synchronized.

The current ProjectGallery layout is component-scoped in ProjectGallery.svelte and supersedes the older dark masonry rules in home.css for that island. Its ivory background, borderless photos, captions, quiet filters and charcoal gallery link follow the latest reference; keep reduced-motion support.

Batch 01 reading refinements are scoped to data-content-review="01": sentence-case topic headings, smaller subordinate titles, responsive media/prose rows and nested ivory manufacturer strips. Other service pages retain their current heading presentation.


navigation.css gives desktop menus an independent photo panel beside all four link columns, switching to a compact image strip at smaller desktop widths. Mobile dropdowns show one wide contextual preview. Photo entrances honor reduced-motion and use existing motion timing.
