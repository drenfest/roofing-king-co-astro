# src/scripts

Browser behavior. This layer will shrink as native Astro/Svelte components replace the imported behavior.

## Files

- No direct content files.

## Subdirectories

- `compatibility/` - read its ai-context.md.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

motion.ts progressively animates below-fold top-level sections once using IntersectionObserver and the Web Animations API. Content is visible by default; hero/LCP and initial deep-link content are excluded. Animations stop on pagehide or a motion-preference change. No navigation interception, animation dependency or continuous scroll handler.

service-area-map.ts lazily initializes Leaflet only near the viewport, with city polygon selection, existing service links, reset, ResizeObserver and reduced-motion support. Wheel zoom is off; one-finger map dragging is off on touch devices to preserve page scrolling.


The Leaflet attribution and popup links declare titles. The active city link updates its title with the selected community and resets it with the coverage overview. Leaflet tile imagery retains its decorative alt attributes.

The shared service-area map emits service-area-selected with the selected community ID (or all on reset), allowing the Service Areas directory to filter its cards without changing homepage behavior.
