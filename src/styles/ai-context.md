# src/styles

Editorial roofing page composition uses --rk-page-slant for full-width hero, service explorer, process, service-area and estimate transitions, plus broad diagonal backgrounds matching the homepage. Credentials retain their separately approved styling. Text/content stays level; mobile uses a smaller slant. The roofing credential container is light cream with slanted section edges; its green cards and nearby explorer/media panels use the homepage clipped-corner branding. All decorative crowns use the Roof King logo crown at /media/wordpress/3af1e7693f5a-crown.svg through --rk-logo-crown or the gallery reference. The generic inline review crown has been removed from native and legacy styles. The estimate heading above the footer stays in normal document flow; do not reintroduce sticky/pinned behavior there. service-landing.css owns the branded editorial hero, service paths, gallery, credentials, materials, process, review and estimate layouts. products.css defines responsive performance badges and specification notes, product photos, color swatches, selected/focus states and native specification/warranty panels. services.css defines native service prose, cards, FAQ and responsive layouts; shared sections retain their WordPress design. Native homepage: base.css contains shared reference design rules; home.css contains homepage section rules; home-interactions.css adds native state, focus, dialogs and mobile fixes. Legacy pages keep wordpress-compatibility.css and migration.css. The homepage must not load compatibility behavior or styles.

## Files

- `base.css`
- `home-interactions.css`
- `home.css`
- `migration.css`
- `products.css`
- `service-landing.css`
- `services.css`
- `wordpress-compatibility.css`

## Subdirectories

- None.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.
