# Production indexing correction — November 23, 2026

Status: implemented and tested locally; no commit, push, merge or deployment performed.

## Confirmed live defect

The apex and www versions of `/`, `/siding/` and `/columbus-oh/roofing/` all returned HTTP 200 with `noindex, nofollow` in HTML. robots.txt allowed crawling and advertised the www sitemap. No X-Robots-Tag was returned on those six responses. Both hosts specified www canonicals, but the apex did not redirect to www. HTTPS requests succeeded on both hosts. Baseline: `output/indexing-baseline-2026-11-23-ctMETq/live.json` (local evidence).

The shared layouts hardcoded review-only metadata. The Apache template also contained a blanket noindex directive, and release checks required the review restrictions. Updating robots.txt alone would not correct this.

## Prepared behavior

- `npm run build` / `build:production` explicitly select production. All non-HUD HTML becomes `index, follow`, including review, error, redirect and unregistered pages, per the subsequent instruction.
- `npm run build:staging` uses the same indexing policy. Unconfigured direct Astro builds retain a staging artifact label. Staging has no robots protection and must stay local or behind host authentication if published.
- HUD PHP authentication, private data storage, no-store/noindex headers and child Apache protections remain intact. The HUD is the sole noindex exception.
- The generated Apache configuration removes the blanket production restriction with no review/error restrictions. The sitemap includes only index-eligible self-canonical pages.
- Each build runs policy regression fixtures and a final artifact guard. A production gate rejects a staging artifact. The release script now expects an explicit production artifact; it has not been executed.
- Approved www canonicals, existing redirects, page content, lead configuration and phone links remain unchanged.

## Verification

`npm run test:indexing-builds` passed both complete builds:

| Profile | HTML with index/follow | HTML with noindex | Sitemap URLs |
| --- | ---: | ---: | ---: |
| Production | 553 | 0 | 514 |
| Staging | 553 | 0 | 514 |

The sitemap remains limited to registered self-canonical marketing URLs; aliases, review/error pages and redirect stubs are excluded independently of robots directives. The guard checks every generated HTML page, manifest canonicals, sitemap membership, robots.txt, Apache policy and packaged HUD protections. Regression fixtures reject conflicting bot directives, any non-HUD noindex in either profile and staging artifacts submitted to the production gate.

These HTML counts exclude the separate PHP HUD entry point, which retains noindex and authentication. HTTP 404 responses and redirect stubs do not become indexable merely because their HTML says index/follow.

`node scripts/test-indexing-http.mjs --builds tmp/indexing-builds-ICbM9u` passed against the existing Apache installation on isolated loopback ports. It checked public/review/error metadata and absence of noindex HTTP headers for both profiles, missing-page 404 behavior and the existing gallery redirect. PHP execution was disabled in the fixture; this test does not claim a live Google OAuth sign-in test. No form submissions, external requests, booking, calls or mail were made by the fixture.

Build logs, profile comparisons and HTTP results are retained locally under `tmp/indexing-builds-ICbM9u/`. These tests establish indexing eligibility after an approved deployment, not that Google has indexed the pages. Search Console indexed status was not checked in this correction.

`npm run check` passed Astro and Svelte diagnostics with zero errors or warnings and validated 548 preserved paths/content. Context-map validation, release-tool grouping and `git diff --check` also passed.

The optional full HUD PHP security suite could not run locally because `dashboard/server/vendor/autoload.php` is absent (Composer dependencies are not installed). No HUD authentication source was changed. The artifact guard checks its retained noindex/authentication policy; the Apache fixture denies HUD access with PHP execution disabled. These checks do not replace the full authentication suite or a live sign-in test.

## Release boundary and remaining findings

The production correction is ready for review. The confirmed live noindex defect remains until an explicitly approved release. The apex still serving HTTP 200 rather than redirecting to www is a separate canonical-host finding; this correction preserves existing host behavior. Existing preview-only quote intake and other operational-readiness checks are outside the completed indexing correction; no sending destination or integration was invented or enabled.
