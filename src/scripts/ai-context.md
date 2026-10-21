# src/scripts

Browser behavior. This layer will shrink as native Astro/Svelte components replace the imported behavior.

## Files

- No direct content files.

## Subdirectories

- `compatibility/` - read its ai-context.md.

## Change checks

Preserve explicit content permalinks and source attribution. Update this map when directory responsibilities change. Run `npm run verify` from the repository root after changes.

motion.ts progressively animates below-fold top-level sections once using IntersectionObserver and the Web Animations API. Content is visible by default; hero/LCP and initial deep-link content are excluded. Animations stop on pagehide or a motion-preference change. No navigation interception, animation dependency or continuous scroll handler.
