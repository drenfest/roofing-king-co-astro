# Roof King Search Console HUD

The private dashboard is served at `https://roofkingco.com/hud/` by the existing Cloudways application. The marketing site remains Astro. The Svelte report interface comes from the established TheWebGuy dashboard and supports Week, Month and Quarter comparisons, page/query selection, trend charts and CSV/JSON/PDF exports. Data is a dated snapshot; it is not presented as a live feed.

## Authentication and storage

Use the dedicated `roof-king-hud` Google Cloud project and a web OAuth client. The exact authorized callback is `https://roofkingco.com/hud/index.php?action=callback`. Sign-in requests only `openid email profile`. Google sign-in grants no Gmail, Search Console or other Google-data access. The server validates verified email and exact allowlist membership on each protected request. Sessions expire after eight hours; removing an email from the private allowlist revokes its existing sessions on the next request.

Private application storage is `private_html/roof-king-hud`, outside the public web root:

- `config.json`: `clientId`, `clientSecret`, `allowedEmails` (array of exact lowercase Google-account addresses). Restrict ownership to the application user and mode 600. Do not commit credentials or the real configuration.
- `data/dashboard.json`: report snapshot. Restrict directory to mode 750 and file to 640; preserve during deployments.
- `runtimes/<commit>/vendor`: pinned Composer dependencies installed by GitHub, transferred over pinned SSH and referenced by that release's PHP entry point. Old runtimes support rollback.

The authorized account list is managed privately; there is no public registration or invitation email. OpenAI accounts are not involved. No MFA settings are changed.

## Refreshing the report

`npm run hud:refresh -- --config <private-Google-config-path> --start-date YYYY-MM-DD --end-date YYYY-MM-DD` reads only `sc-domain:roofkingco.com`. The config format has `clientId`, `clientSecret` and `refreshToken`. Manual local runs can use the existing reporting configuration under the operator's home directory. The daily server job uses a separate, explicitly authorized credential with only `https://www.googleapis.com/auth/webmasters.readonly`, stored as private `reporting-oauth.json` with `requireReadonlyScope: true` and mode 600. It has no Gmail or Analytics permissions and is separate from client dashboard sign-in.

Outputs are ignored files under `output/hud-reporting`: the comparison CSV and `dashboard.json`. The normal build does not read them. Upload the JSON over the pinned application SSH connection to a temporary private data filename, then atomically rename it to `data/dashboard.json` and apply mode 640. Never upload the CSV, report JSON or OAuth tokens into `public_html`, GitHub artifacts or a public static bundle.

The API's finalized web-search rows are aggregated by page and page/query for each period. Query disclosure differs from page totals; missing query rows are unavailable, not zero. Partial periods retain their labels. A report's data-through date is not proof Google crawled a changed page. Optional `output/hud-reporting/observability.json` can supply independently verified events and page summaries; no code/deployment/crawl event is fabricated when that file is absent.

## Daily Cloudways cron

### Page crawl dates and commit markers

The authenticated data response adds private `data/crawl-observations.json` and the deployed runtime's `code-events.json` to the report. The daily job inspects reported Roof King URLs using Google's read-only URL Inspection API, waits 500 ms between calls, caps each run at 1,000 URLs and caches inspections for 24 hours. A rejected request stops collection with no retry and preserves the prior crawl file. Google may return no last-crawl date; the HUD displays Unavailable rather than substituting inspection or refresh time. This reads Google's index record; it does not request indexing or crawl the website.

`node <runtime>/refresh-hud-crawls.mjs <private-HUD-directory>` refreshes crawl observations independently of performance rows. Keep the JSON private, mode 640. The job retains the latest known observation per URL; it does not reconstruct a full crawl history.

The release packages six months of Git source history privately. Route ownership maps associate commits with page records, native routes, renderers and primary data files. Shared-file associations are explicitly qualified in tooltips and do not imply a confirmed page change or deployment. Selecting a page shows the latest crawl as a solid line and commits grouped by Central calendar day as dotted lines; hover or keyboard focus reveals commit titles and source files.

The application user's native server crontab runs the refresh at **6:00 a.m. America/Chicago daily**, independently of the operator's computer. The server uses UTC: cron invokes at 11:00 and 12:00 UTC, and `refresh-hud-daily.sh` accepts only the invocation whose Chicago local hour is 06. This follows daylight saving time without running the pull twice. A lock and last-success date prevent overlapping or duplicate scheduled pulls. The installer preserves other crontab entries and a private backup of the previous crontab.

The deployed wrapper at `private_html/roof-king-hud/refresh-hud-daily.sh` reads the current deployed revision and runs that revision's private collector modules. GitHub packages these modules alongside the private Composer runtime; they never enter public_html. Ordinary site releases update the collector and preserve credentials, the cron entry and saved reports.

The collector fetches a rolling 15-month window of finalized web-search data with a two-day lag, including Google's revisions to recent dates. The data-through label uses the latest returned page date. Each run builds in a unique private work directory, validates a nonempty Roof King report, rejects older reports and atomically replaces `data/dashboard.json` only after success. A failure leaves the previous report intact; existing independently verified event annotations are preserved. Temporary CSVs and work files are removed after each run.

Private health files are `refresh-status.json` (running/success/failed, attempt time and last report dates), `last-refresh-date`, `logs/refresh-latest.log` and `logs/cron.log`. No report or credential is attached to notifications or made public. The dashboard displays the scheduled refresh time and last successful report timestamp.

After the verified runtime and dedicated credential are installed, copy `scripts/install-hud-cron.sh` to the private HUD folder and run `bash <app-root>/private_html/roof-king-hud/install-hud-cron.sh <verified-app-root>` on the server to install this job. For an immediate operational refresh, run `bash <app-root>/private_html/roof-king-hud/refresh-hud-daily.sh <app-root> --now`. This bypasses the time/date guard but still takes the lock and preserves the last good report on failure. Check the private status file and report metadata before claiming a successful pull.

## Release and recovery

The regular `npm run go-live` flow builds the site plus HUD assets, runs PHP authorization and forged-token tests and anonymous HTTP checks, transfers the private runtime, deploys the public files and checks the live access boundary. Anonymous users receive only the sign-in page; the data endpoint returns 401. Private files and dependency paths must return 403/404. The public report is absent from marketing navigation and sitemap.

The public-file rollback process in cloudways-deployment.md restores its matching revision-specific authentication runtime. Do not delete private configuration or data during a static rollback. Google OAuth approval and a successful allowed-account sign-in must be verified separately from a green build.
