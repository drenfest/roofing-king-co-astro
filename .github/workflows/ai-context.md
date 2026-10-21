# .github/workflows

verify.yml installs pinned dependencies and runs the complete URL-preservation build on pushes and pull requests.

## Files

- `verify.yml`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

deploy-cloudways.yml verifies and packages dist on main pushes/manual dispatch, deploys over pinned application SSH, and smoke-tests the review site. Account billing currently blocks hosted jobs; do not claim automatic deployment works until a hosted run succeeds.
