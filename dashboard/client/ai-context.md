# Dashboard browser interface

App.svelte and export-dashboard.js preserve the existing weekly, monthly and quarterly page/query analysis, event timeline and CSV/JSON/PDF exports. main.js fetches data only from the session-protected PHP endpoint. Never import a private report into the bundle. Keep missing/anonymized query data distinct from zero, retain snapshot dates and partial-period labels, and never invent historical events or crawl results.

The Pages table shows each page's latest recorded Google crawl across the snapshot's global and page-summary events, independently of the selected performance period. Crawl dates are sortable (unavailable values stay last), use America/Chicago, and are included in exports. Missing crawl evidence displays Unavailable; report refresh and inspection observation times are not crawl dates.

Selecting a page adds a solid last-crawl line and dotted daily commit lines at their dates on the time axis. Hover/focus reveals all associated commits for the Central calendar day. Source-file associations include shared renderer/data changes and are explicitly qualified; they do not prove a page changed or a deployment occurred. Crawl dates outside the window are stated separately. The axis includes recent observations beyond finalized performance data without inventing additional performance points.

A thicker orange Site went live line appears in all views for the November 16, 2026 production domain cutover recorded in migration/cloudways-deployment.md. This is a date-only milestone; do not invent a launch timestamp.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [dashboard](../ai-context.md).

### Direct files

- [App.svelte](App.svelte)
- [export-dashboard.js](export-dashboard.js)
- [main.js](main.js)
- [shell.css](shell.css)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
