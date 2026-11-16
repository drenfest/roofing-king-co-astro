# Dashboard authentication boundary

index.php is the only public entry point. access.php owns exact-email authorization, session expiry and OAuth state/nonce checks. Composer dependencies deploy to a revision-specific private runtime outside public_html; only index.php, access.php and the local Apache rules are copied into dist/hud. Never copy composer files, vendor, tests, config or report snapshots into dist. Google credentials are separate from the local Search Console reporting credentials. Changing allowed accounts requires explicit authorization. Keep cookies Secure/HttpOnly/SameSite=Lax, state and PKCE, ID-token signature/audience/issuer/expiry checks, no-store responses and POST/CSRF logout. GitHub runs security-tests.php and the HTTP integration check through check:hud.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [dashboard](../ai-context.md).

### Direct files

- [.htaccess](.htaccess)
- [access.php](access.php)
- [composer.json](composer.json)
- [composer.lock](composer.lock)
- [index.php](index.php)
- [security-tests.php](security-tests.php)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->
