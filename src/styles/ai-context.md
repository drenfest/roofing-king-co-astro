# src/styles: shared visual and motion contracts

Use the approved ivory, charcoal and orange palette, Playfair Display for headings and Inter for paragraphs/navigation/buttons. Older green/blue/royal token names can be compatibility aliases to the neutral palette; do not restore green surfaces. Preserve authentic manufacturer/review logo colors and meaningful performance badges.

- base.css owns base document/theme conventions; navigation.css owns the shared header/mega-menu/mobile menu.
- home.css and home-interactions.css contain shared homepage/editorial patterns also used by native pages. component-refinements.css is the final shared finish layer; its modal rules override earlier layouts and must retain readable ivory/charcoal contact choices.
- service-landing.css and service-editorial.css own service selectors, leaf rows, slanted sections, contextual brands and reviewed topic/media layouts.
- products.css owns product collections, details, samples, controls, tabs and responsive specification tables.
- articles.css owns the structured article and hub reading layouts. Reuse it rather than styling imported prose separately per article.
- motion.css and SiteMotion provide subtle interaction feedback and native cross-document transitions. Use the existing motion variables and honor prefers-reduced-motion. Do not animate slider dragging or hide content until observation/hydration.
- migration.css and compatibility styling remain for preserved legacy consumers; do not import them into a native page family.

Use sentence-case headings with actual H2/H3 nesting. Keep accents simple and buttons consistent, with no unnecessary metallic gradients or raised effects. Retain diagonal backgrounds and readable contrast. Check mobile overflow, full-width dropdown rows, carousel touch swiping, modal scrolling, image crops and focused controls when extending a shared rule.

Pale ContactActions cards require an explicit charcoal heading that overrides dark service-section heading rules. Keep the surrounding estimate heading light; check both computed colors on service and location pages.

product-comparison.css owns shared specification filters, candidate selection and comparison tables. Keep table overflow inside the focusable region (never the whole page), use visible selected/focus states and restrained orange accents. Filters stay hidden until their lightweight Svelte enhancement mounts; unfiltered SSR cards and default comparisons must remain readable without JavaScript.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [src](../ai-context.md).

### Direct files

- [about.css](about.css)
- [articles.css](articles.css)
- [base.css](base.css)
- [careers.css](careers.css)
- [component-refinements.css](component-refinements.css)
- [contact.css](contact.css)
- [customer-service.css](customer-service.css)
- [faq.css](faq.css)
- [home-interactions.css](home-interactions.css)
- [home.css](home.css)
- [migration.css](migration.css)
- [motion.css](motion.css)
- [navigation.css](navigation.css)
- [offers.css](offers.css)
- [product-comparison.css](product-comparison.css)
- [products.css](products.css)
- [projects.css](projects.css)
- [reviews.css](reviews.css)
- [service-area-map.css](service-area-map.css)
- [service-areas.css](service-areas.css)
- [service-editorial.css](service-editorial.css)
- [service-hero.css](service-hero.css)
- [service-landing.css](service-landing.css)
- [services.css](services.css)
- [warranty.css](warranty.css)
- [wordpress-compatibility.css](wordpress-compatibility.css)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
