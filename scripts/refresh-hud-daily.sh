#!/usr/bin/env bash
# Private Cloudways cron entry point. Configuration and output never enter public_html.
set -euo pipefail
umask 077
app_root=$(realpath -- "$1")
[[ -f "$app_root/private_html/astro-deploy/app-id" && "$(cat "$app_root/private_html/astro-deploy/app-id")" == 6519803 ]] || { echo 'Wrong application' >&2; exit 1; }
private="$app_root/private_html/roof-king-hud"
export TZ=America/Chicago
if [[ "${2:-}" != --now && "$(date +%H)" != 06 ]]; then exit 0; fi
mkdir -p "$private/logs" "$private/work"
exec 9>"$private/refresh.lock"
flock -n 9 || exit 0
day=$(date +%F)
if [[ "${2:-}" != --now && -f "$private/last-refresh-date" && "$(cat "$private/last-refresh-date")" == "$day" ]]; then exit 0; fi
revision=$(cat "$app_root/private_html/astro-deploy/current-commit")
[[ "$revision" =~ ^[a-f0-9]{40}$ ]] || { echo 'Invalid deployed revision' >&2; exit 1; }
runtime="$private/runtimes/$revision"
work=$(mktemp -d "$private/work/refresh-XXXXXXXX")
cleanup() { [[ "$work" == "$private/work/refresh-"* && -d "$work" ]] && rm -rf -- "$work"; }
trap cleanup EXIT
status="$private/refresh-status.json"
export HUD_STATUS_PATH="$status"
export HUD_RUN_DATE="$day"
export HUD_REPORT_PATH="$private/data/dashboard.json"
write_status() {
  HUD_RUN_RESULT="$1" /usr/bin/node --input-type=module -e '
    import fs from "node:fs";
    let report = null;
    try { report = JSON.parse(fs.readFileSync(process.env.HUD_REPORT_PATH)).report; } catch {}
    const destination = process.env.HUD_STATUS_PATH;
    const data = {status:process.env.HUD_RUN_RESULT,attemptedAt:new Date().toISOString(),reportRefreshedAt:report?.refreshedAt||null,dataThrough:report?.dataThrough||null};
    fs.writeFileSync(destination+".uploading",JSON.stringify(data)+"\n",{mode:0o600});
    fs.renameSync(destination+".uploading",destination);
  '
}
write_status running
# Rebuild the retained history so Google's revisions to recent dates are included.
if /usr/bin/node "$runtime/refresh-hud-data.mjs" --config "$private/reporting-oauth.json" --date "$day" --lag-days 0 --include-fresh --output "$work/search-console-page-query-comparisons-$day.csv" --publish "$private/data/dashboard.json" >"$private/logs/refresh-latest.log" 2>&1; then
  printf '%s\n' "$day" > "$private/last-refresh-date"
  write_status success
  printf 'Search Console HUD refreshed successfully for %s\n' "$day"
  # Crawl observations are independent of finalized performance rows. Preserve
  # the last crawl snapshot if Google rejects an inspection; never retry a block.
  if ! /usr/bin/node "$runtime/refresh-hud-crawls.mjs" "$private" >"$private/logs/crawl-latest.log" 2>&1; then
    echo 'Crawl refresh failed; prior crawl dates preserved. See private logs/crawl-latest.log.' >&2
    exit 1
  fi
else
  write_status failed
  echo 'Search Console refresh failed; last good report preserved. See private logs/refresh-latest.log.' >&2
  exit 1
fi
