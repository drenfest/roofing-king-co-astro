# Dashboard browser interface

App.svelte and export-dashboard.js preserve the existing weekly, monthly and quarterly page/query analysis, event timeline and CSV/JSON/PDF exports. main.js fetches data only from the session-protected PHP endpoint. Never import a private report into the bundle. Keep missing/anonymized query data distinct from zero, retain snapshot dates and partial-period labels, and never invent historical events or crawl results.

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
