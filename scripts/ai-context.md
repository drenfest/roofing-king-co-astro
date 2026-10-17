# scripts

transfer-service-content.mjs is an explicit one-time authoring tool that overwrites the roofing-family records from retained source; do not rerun after editorial edits without a migration plan. optimize-service-media.mjs generates additional dimensions/variants. check-services.mjs compares native output with preserved source copy/links and validates structure/media/forms. audit-component-reuse.mjs generates the complete source-based component audit using component-audit-template.html and the embedded brand asset thewebguy-logo.txt. Run npm run audit:components to regenerate. Build/import tools. import-wordpress.mjs is an explicit overwrite migration. check-content.mjs checks metadata/content; check-built-routes.mjs validates output and links. check-homepage.mjs verifies native homepage HTML, dimensions, accessibility labels and disabled form delivery.

## Files

- `audit-component-reuse.mjs`
- `check-built-routes.mjs`
- `check-content.mjs`
- `check-homepage.mjs`
- `check-services.mjs`
- `component-audit-template.html`
- `import-wordpress.mjs`
- `optimize-home-media.mjs`
- `optimize-service-media.mjs`
- `thewebguy-logo.txt`
- `transfer-service-content.mjs`
- `write-context-maps.mjs`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
