# Public service-area map data

The GeoJSON is a local public derivative for ServiceAreaMap. Use coverage-map.json and scripts/build-coverage-map.mjs as the authoring path; do not add an arbitrary remote map/API dependency or invent boundaries.

Preserve actual incorporated-city outlines and the separate Lewis Center community marker. Keep filtering, accessible card links and local/global service fallback destinations synchronized with the route inventory. Do not infer exact service eligibility from an invented county or radius polygon. Context documentation is stripped from dist; the actual GeoJSON remains a referenced public asset.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [public](../ai-context.md).

### Direct files

Asset files: 1 (.geojson: 1). Use the media registries and file search for individual derivative names.

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
