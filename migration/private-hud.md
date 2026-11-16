# Roof King Search Console HUD

The private dashboard is served at `https://www.roofkingco.com/hud/` by the existing Cloudways application. The marketing site remains Astro. The Svelte report interface comes from the established TheWebGuy dashboard and supports Week, Month and Quarter comparisons, page/query selection, trend charts and CSV/JSON/PDF exports. Data is a dated snapshot; it is not presented as a live feed.

## Authentication and storage

Use the dedicated `roof-king-hud` Google Cloud project and a web OAuth client. The exact authorized callback is `https://www.roofkingco.com/hud/index.php?action=callback`. Sign-in requests only `openid email profile`. Google sign-in grants no Gmail, Search Console or other Google-data access. The server validates verified email and exact allowlist membership on each protected request. Sessions expire after eight hours; removing an email from the private allowlist revokes its existing sessions on the next request.

Private application storage is `private_html/roof-king-hud`, outside the public web root:

- `config.json`: `clientId`, `clientSecret`, `allowedEmails` (array of exact lowercase Google-account addresses). Restrict ownership to the application user and mode 600. Do not commit credentials or the real configuration.
- `data/dashboard.json`: report snapshot. Restrict directory to mode 750 and file to 640; preserve during deployments.
- `runtimes/<commit>/vendor`: pinned Composer dependencies installed by GitHub, transferred over pinned SSH and referenced by that release's PHP entry point. Old runtimes support rollback.

The authorized account list is managed privately; there is no public registration or invitation email. OpenAI accounts are not involved. No MFA settings are changed.

## Refreshing the report

`npm run hud:refresh -- --config <private-Google-config-path> --start-date YYYY-MM-DD --end-date YYYY-MM-DD` uses existing read-only Search Console access to `sc-domain:roofkingco.com`. The config format has `clientId`, `clientSecret` and `refreshToken`; credentials stay on the operator's computer. The default path uses the existing reporting configuration under the operator's home directory. Only the Roof King property is queried.

Outputs are ignored files under `output/hud-reporting`: the comparison CSV and `dashboard.json`. The normal build does not read them. Upload the JSON over the pinned application SSH connection to a temporary private data filename, then atomically rename it to `data/dashboard.json` and apply mode 640. Never upload the CSV, report JSON or OAuth tokens into `public_html`, GitHub artifacts or a public static bundle.

The API's finalized web-search rows are aggregated by page and page/query for each period. Query disclosure differs from page totals; missing query rows are unavailable, not zero. Partial periods retain their labels. A report's data-through date is not proof Google crawled a changed page. Optional `output/hud-reporting/observability.json` can supply independently verified events and page summaries; no code/deployment/crawl event is fabricated when that file is absent.

No recurring refresh job is configured by this change. Refreshing data is a separate operator action. New site releases preserve the private snapshot and configuration.

## Release and recovery

The regular `npm run go-live` flow builds the site plus HUD assets, runs PHP authorization and forged-token tests and anonymous HTTP checks, transfers the private runtime, deploys the public files and checks the live access boundary. Anonymous users receive only the sign-in page; the data endpoint returns 401. Private files and dependency paths must return 403/404. The public report is absent from marketing navigation and sitemap.

The public-file rollback process in cloudways-deployment.md restores its matching revision-specific authentication runtime. Do not delete private configuration or data during a static rollback. Google OAuth approval and a successful allowed-account sign-in must be verified separately from a green build.
