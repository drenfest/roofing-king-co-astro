# Workflows: validation and authorized review deployment

Checkout v7.0.1 and setup-node v7.1.0 use the Node 24 action runtime in both workflows. Keep action runtimes supported as well as the build runtime.

verify.yml installs pinned dependencies with Node 24 and runs the grouped verification flows on non-main pushes, pull requests or manual workflow_dispatch. Main pushes are fully verified once by deploy-cloudways.yml, avoiding duplicate builds. It cancels superseded verification runs, retains a downloadable verification log for 14 days and publishes a run summary. Local verification is optional for all contributors. Release monitoring uses compact status/conclusion and the run URL through deployment completion; do not read full successful logs. Resolve failed checks and verify the deployed revision before reporting an authorized release as live. Failed-step excerpts are for targeted fixes. The package script is the authoritative complete gate, including current context/schema/content/media/route checks.

deploy-cloudways.yml runs on main pushes or explicit dispatch, uses the cloudways-review environment, verifies the build, packages dist and performs the authorized review-app deployment/smoke check. A documentation-only main push can still trigger deployment. A green build does not prove the correct revision reached the server; inspect the workflow, release.json and actual public pages/assets.

Read migration/cloudways-deployment.md for target, pinned SSH identity, backup/recovery and smoke-test requirements. Do not put secret values in workflow files or maps. Do not infer permission to push/deploy or change production DNS/indexing, test email or account access from a local content or documentation task. Preserve review crawl restrictions and disconnected custom forms until separately requested implementations are verified.

<!-- directory-inventory:start -->
## Directory inventory

Parent guidance: [.github](../ai-context.md).

### Direct files

- [deploy-cloudways.yml](deploy-cloudways.yml)
- [verify.yml](verify.yml)

### Child directories

None.

Refresh only the generated blocks with `npm run docs:context`. Keep purpose, rules and component guidance outside those blocks; the updater preserves them. GitHub Actions runs `npm run check:contexts` to detect missing/stale maps or broken links; local verification is optional.
<!-- directory-inventory:end -->

Both workflows show eight named flows from verification-groups.mjs. Source/types and build are prerequisites; later flows run their independent checks with two workers, retain per-check logs and publish immediate detailed error annotations. Every verify:steps check must belong to exactly one flow. A failed flow blocks deployment; remaining diagnostic flows can complete. GitHub artifacts hold full logs, while the publisher command receives concise error details.
