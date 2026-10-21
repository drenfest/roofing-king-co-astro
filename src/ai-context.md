# src

Astro site source. Pages use shared layouts and content collections; Svelte is used for browser interactions.

## Files

- `content.config.ts`

## Subdirectories

- `components/` - read its ai-context.md.
- `content/` - read its ai-context.md.
- `data/` - read its ai-context.md.
- `layouts/` - read its ai-context.md.
- `pages/` - read its _ai-context.md.
- `scripts/` - read its ai-context.md.
- `styles/` - read its ai-context.md.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.


middleware.ts completes required HTML image/link attributes in Astro dev and prerender responses, using the server-only scripts/html-attributes.mjs helper. Interactive components set their own dynamic attributes.


The shared middleware now also resolves retired internal blog links to their approved canonical URLs while preserving query strings and fragments. External hosts are left unchanged. The same server-only helper runs across final output HTML, including copied public pages.


Blog article routes use ArticleLayout with shared PageHero, Breadcrumbs, BlogNavigation, ContentSection, FAQSection and new ArticleSection/ArticleChecklist/ArticleImage adapters. Legacy article HTML/CSS is excluded from the catchall and SiteLayout.

middleware.ts also compiles the server-rendered component output into one linked Schema.org graph using scripts/structured-data.mjs. Canonical aliases and error/review pages do not claim the identity of their canonical target. The same compiler runs after the static build; it adds no browser runtime.
