# Context map review

The documentation audit covered every maintained directory under .github, migration, public, scripts and src, plus the repository root. Generated output, dependencies, local evidence and private working directories are intentionally excluded.

- Baseline: 426 existing maps, 40 missing maps, 271 maps with obsolete guidance.
- Result: 466 context maps with shared architectural rules, explicit content ownership, directory inventories and family-specific extension workflows.
- Core guides: ai-context.md, src/components/ai-context.md, src/data/ai-context.md, src/layouts/ai-context.md, src/pages/_ai-context.md and scripts/ai-context.md.
- AGENTS.md and CLAUDE.md point to the shared handbook. The README explains setup and the supported validation path.
- The updater refreshes marked inventories and route ownership while preserving manually authored guidance. The checker validates coverage, references, Astro-safe map names and preservation of manual rules.
- Public asset maps remain source documentation. A build integration strips context documents from dist; the output check prevents accidental publication.

Run npm run docs:context after structural changes, npm run check:contexts for documentation checks and npm run verify for the complete project validation suite. Verification evidence is stored locally in tmp/context-review; source counts are not deployment evidence. No publication was requested for this documentation update.

Verification completed: npm run verify passed the full build and validation suite, including all 364 required paths, 330 canonical schema/sitemap pages and all 466 context maps. The context checker resolved 1,894 local references and 344 route ownership records. The build removed 42 source-only documents, with none left in dist. All 426 existing maps changed, and 40 maps were added. A second updater run produced zero changes. git diff --check passed. The existing ReviewCollection Svelte diagnostic remains one warning; there were no errors.
