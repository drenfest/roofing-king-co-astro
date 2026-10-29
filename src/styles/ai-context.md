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

service-area-map.css styles lazy Leaflet controls, restrained basemap colors, orange boundary feedback and accessible popup links. It is loaded with the map module, not the initial page styles.


service-landing.css styles related service links as flat ivory bordered grid cells, aligned orange arrows, restrained hover/focus states and single-column mobile targets. Location explorer scrolling is component-scoped in ServiceExplorer. FeaturedArticles owns its responsive four/two/one-column editorial grid, thumbnail crops and reduced-motion image feedback.


articles.css sets native long-form typography, section-level separators, metadata and responsive aside/reading layout. ArticleChecklist owns compact bullets with no per-item borders. Shared component styling supplies FAQs and hero styling.


ArticleLayout now ends with the same full-width QuoteSection/QuoteExperience used on the homepage, outside the reading/sidebar grid. It replaces the compact ServiceAudienceBanner and its article-only styles. Header quote actions open the shared modal; form submission remains disabled during review.


Article prose immediately preceding ArticleChecklist has its trailing paragraph margin removed; the adjacent list starts .4rem below the label. Other paragraph and section spacing is unchanged.


contact.css owns only native contact-page typography, two contact-method cards, office address/map and responsive diagonal office band. Shared hero, form and button styling remain reused.


about.css styles only the About hero typography, diagonal story background and service-card refinements. Credentials, carousel, reviews, coverage map and quote form retain shared styling.


projects.css styles only Past Projects hero typography and its diagonal service-link section. Shared ProjectGallery owns all gallery behavior and layout; ResourceLinks and QuoteSection remain reused.


faq.css styles the dedicated FAQ hero, diagonal topic directory, compact shared accordions and topic links. ServiceExplorer and FAQSection retain their existing behavior; no FAQ animation library or new form is introduced.


navigation.css styles rk-mega-column-label spans in place of redundant heading anchors. Removed preview-link focus/arrow hover rules since MenuPreview is now a visual rather than another copy of the selected link.


warranty.css styles only the native warranty hero, summary cards, material row, document resources and shared FAQ. WarrantyComparison owns its semantic responsive table styling. Existing optimized gallery photos are reused without new downloads or enlargement.


customer-service.css styles the support hero, existing-project help cards, diagonal call-preparation checklist and document resources. Shared FAQ, quote form and header behavior stay unchanged; form submission remains disabled.


careers.css owns Careers hero typography, experience cards, the diagonal introduction checklist and phone inquiry band. Shared FAQs and global motion remain reused. No customer quote strip is rendered in the recruiting content.

service-areas.css styles the native map/directory split, ivory location cards and recursive service disclosures. Mobile places the map above the cards; no page overflow or map trapping.

offers.css provides native offer hero sizing, flat feature cards, diagonal photo bands, a call-preparation checklist and grouped hub cards. It inherits shared motion, buttons and FAQ behavior.


The Batch 01 reading-rhythm styles also apply explicitly to Batch 02: sentence-case headings, grouped option grids, lighter manufacturer strips and narrow-screen layouts. Batch 02 charcoal sections use a light orange eyebrow for readable contrast. Unreviewed service presentation is unchanged.


The reviewed service reading-rhythm styles explicitly include Batch 03. Balanced hero wrapping and readable charcoal-section eyebrows cover Batch 02/03. Original diagonal section geometry, flat ivory/charcoal/orange palette and responsive photo rows remain.


Reviewed sentence-case typography, balanced hero wrapping, charcoal eyebrow contrast and grouped-card rhythm now explicitly include data-content-review="04". No styling is applied to unreviewed routes by this extension.


Reviewed heading case, balanced hero wrapping, dark-section eyebrow contrast and grouped-card rhythm now explicitly include data-content-review="05". No global extension to unreviewed routes.
