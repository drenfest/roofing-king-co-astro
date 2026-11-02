# Cloudways review deployment

Client authorized replacing the WordPress review app on 2026-10-20. Production DNS, indexing and custom lead delivery remain unchanged.

## Target

- App: Roof King Co, app 6519803, server 1269393.
- URL: https://wordpress-1269393-6519803.cloudwaysapps.com/
- Host: 167.71.165.18; existing application SSH user: rking.
- Verified application directory: `/home/1269393.cloudwaysapps.com/gsqzkaftjc`.
- Public directory: `public_html`. Private deployment storage: `private_html/astro-deploy`.
- Pinned ED25519 fingerprint: `SHA256:NWZwKwlwPGa/KHcxdG9TnTeVCj5pX65QGgAhcsbpqh0`.

## Recovery

Cloudways completed an on-demand files/database backup at 2026-10-21 00:00:12 UTC. Each deployment also retains the previous public files in private deployment storage. No WordPress backup is deleted. The existing database is retained for rollback and is not used by Astro.

The script restores previous files if the file switch fails. For a completed deployment, inspect the private `previous-web-root` record, preserve the current public files in another private backup, and restore the recorded files into the stable public directory. Cloudways Backup and Restore can restore the complete original application. Purge application cache after restoration.

## Automation

Repository: drenfest/roofing-king-co-astro. Deploy branch: main. Workflow: `.github/workflows/deploy-cloudways.yml`. Environment: cloudways-review. The client explicitly approved the dedicated application deployment key and encrypted GitHub environment storage.

The workflow verifies the complete site, packages only dist, uploads through pinned SSH, retains previous files, and checks public review URLs. It requires no database credential or full-account API token. Configuration names are documented in the workflow; secret values stay outside the repository.

The client resolved GitHub billing. Automatic deployment run 39519928064 completed successfully for commit d5c6e77 on main, including verification, pinned SSH upload and the public smoke check. The initial locally verified deployment was followed by this confirmed GitHub-hosted update.

## Review settings

The site retains noindex/nofollow in HTTP headers and page metadata, and disabled custom quote submission. On 2026-11-01 the client authorized allowing tool crawling: robots.txt permits all user agents, including ChatGPT and Claude, so crawlers can fetch content and read noindex directives. Deployment checks require crawl access and retain the noindex header and homepage metadata guards. Phone, booking and click-to-load Roofr behavior remain available. No production hostname or DNS change is performed.

SFTP is chrooted to the application root. Upload destinations use relative private_html paths; SSH commands use the verified absolute application path. The temporary hostname remains unchanged at the client’s request.

## Completion checks

All 244 protected public URLs returned HTTP 200 with matching page headings, canonicals and review noindex metadata. See cloudways-review-check.json. Unknown URLs return 404. The original WordPress web files are retained in private_html/astro-deploy/backups/web-root-20261021T001217Z; the Cloudways files/database recovery point remains available. No WordPress runtime remains in public_html.

The public release.json marker identifies the deployed Git commit. The deployment smoke test now checks every canonical sitemap page against the verified build, plus current schema/components, sitemap, essential assets, review crawl restrictions and 404 behavior.
