# .github/workflows

verify.yml installs pinned dependencies and runs the complete URL-preservation build on pushes and pull requests.

## Files

- `verify.yml`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

deploy-cloudways.yml verifies and packages dist on main pushes/manual dispatch, deploys over pinned application SSH, and smoke-tests the review site. GitHub billing is resolved. Deployment run 39519928064 successfully verified and deployed main; public smoke checks passed.

The deployment writes public release.json containing only GITHUB_SHA, then validates that exact live commit and every canonical sitemap page against the CI build, including structured data/components, sitemap, essential assets and review protections.
