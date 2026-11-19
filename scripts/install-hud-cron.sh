#!/usr/bin/env bash
# Install only this application's managed job; preserve all unrelated crontab entries.
set -euo pipefail
umask 077
app_root=$(realpath -- "$1")
[[ "$app_root" =~ ^/[a-zA-Z0-9_./-]+$ && "$(cat "$app_root/private_html/astro-deploy/app-id")" == 6519803 ]] || { echo 'Wrong application' >&2; exit 1; }
[[ "$(date +%z)" == +0000 ]] || { echo 'Installer expects the Cloudways server timezone to be UTC' >&2; exit 1; }
private="$app_root/private_html/roof-king-hud"
[[ -f "$private/reporting-oauth.json" && -f "$private/refresh-hud-daily.sh" ]] || { echo 'Install reporting credentials and verified runtime first' >&2; exit 1; }
mkdir -p "$private/logs"
before=$(mktemp "$private/crontab-before-XXXXXXXX")
after=$(mktemp "$private/crontab-install-XXXXXXXX")
trap 'rm -f -- "$after" "$before.err"' EXIT
if ! LC_ALL=C crontab -l >"$before" 2>"$before.err"; then
  grep -q '^no crontab for ' "$before.err" || { echo 'Could not read existing crontab; no changes made' >&2; exit 1; }
fi
awk '
  $0 == "# BEGIN ROOF KING HUD DAILY" { if (managed) exit 2; managed=1; next }
  $0 == "# END ROOF KING HUD DAILY" { if (!managed) exit 2; managed=0; next }
  !managed { print }
  END { if (managed) exit 2 }
' "$before" > "$after"
{
  printf '\n# BEGIN ROOF KING HUD DAILY\n'
  printf '# Two UTC hours plus the Chicago-time guard keep the refresh at 6 a.m. across DST.\n'
  printf '0 11,12 * * * /bin/bash %s/refresh-hud-daily.sh %s >> %s/logs/cron.log 2>&1\n' "$private" "$app_root" "$private"
  printf '# END ROOF KING HUD DAILY\n'
} >> "$after"
crontab "$after"
echo 'Installed Roof King HUD daily refresh at 6:00 a.m. America/Chicago; prior crontab retained privately.'
crontab -l
