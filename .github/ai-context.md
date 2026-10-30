# Repository automation

Read the root handbook before changing workflows. CI verifies the source and preserved URL contract; release workflows are external actions with a separate recovery/live-verification boundary. Keep dependency versions pinned, secret values in encrypted environment storage and normal builds independent of private authoring inputs.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [repository](../ai-context.md).

### Direct files

No direct source files.

### Child directories

- [workflows/](workflows/ai-context.md)

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. Run `npm run check:contexts` to detect missing/stale maps or broken links.
<!-- directory-inventory:end -->
