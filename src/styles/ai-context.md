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
