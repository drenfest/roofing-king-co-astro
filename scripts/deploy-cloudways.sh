#!/usr/bin/env bash
# Executed on the Cloudways application over SSH. No credentials belong here.
set -euo pipefail
umask 022
app_root=$(realpath -- "$1")
release_id=$2
[[ "$release_id" =~ ^[a-f0-9]{40}$ ]] || { echo "Invalid release commit" >&2; exit 1; }
[[ -d "$app_root/public_html" && ! -L "$app_root/public_html" ]] || { echo "Unexpected web root" >&2; exit 1; }
[[ "$(cat "$app_root/private_html/astro-deploy/app-id")" == "6519803" ]] || { echo "Wrong Cloudways application" >&2; exit 1; }
work="$app_root/private_html/astro-deploy"
exec 9>"$work/deploy.lock"
flock -w 300 9
archive="$work/incoming/$release_id.tar.gz"
release="$work/releases/$release_id"
[[ -f "$archive" && ! -e "$release" ]] || { echo "Missing archive or existing release" >&2; exit 1; }
mkdir -p "$work/releases" "$work/backups"
chmod 700 "$work" "$work/backups"
# Reject archive paths that could escape the release directory.
while IFS= read -r entry; do
  [[ "$entry" != /* && "$entry" != ../* && "$entry" != */../* ]] || { echo "Unsafe archive member" >&2; exit 1; }
done < <(tar -tzf "$archive")
mkdir "$release"
tar -xzf "$archive" -C "$release" --no-same-owner
[[ -f "$release/index.html" && -f "$release/404.html" && -f "$release/robots.txt" ]] || { echo "Incomplete static build" >&2; exit 1; }
grep -q 'Disallow: /' "$release/robots.txt" || { echo "Review indexing protection missing" >&2; exit 1; }
[[ ! -e "$release/wp-config.php" && ! -d "$release/node_modules" && ! -d "$release/src" ]] || { echo "Unexpected runtime or source files" >&2; exit 1; }
[[ -z "$(find "$release" -type l -print -quit)" ]] || { echo "Unexpected symlink in build" >&2; exit 1; }
find "$release" -type d -exec chmod 755 {} +
find "$release" -type f -exec chmod 644 {} +
# Preserve the ACME challenge directory used for certificate renewal.
if [[ -d "$app_root/public_html/.well-known" ]]; then cp -a "$app_root/public_html/.well-known" "$release/"; fi
stamp=$(date -u +%Y%m%dT%H%M%SZ)
previous="$work/backups/web-root-$stamp"
mkdir "$previous"
shopt -s dotglob nullglob
phase=archiving
rollback() {
  status=$?
  if [[ $status -ne 0 ]]; then
    if [[ "$phase" == installing ]]; then
      failed="$work/releases/failed-$release_id-$stamp"
      mkdir -p "$failed"
      current=("$app_root/public_html/"*)
      if (( ${#current[@]} )); then mv -- "${current[@]}" "$failed/"; fi
    fi
    saved=("$previous/"*)
    if (( ${#saved[@]} )); then mv -- "${saved[@]}" "$app_root/public_html/"; fi
    echo "Deployment failed; previous files restored" >&2
  fi
}
trap rollback EXIT
current=("$app_root/public_html/"*)
if (( ${#current[@]} )); then mv -- "${current[@]}" "$previous/"; fi
phase=installing
incoming=("$release/"*)
mv -- "${incoming[@]}" "$app_root/public_html/"
phase=done
trap - EXIT
printf '%s\n' "$release_id" > "$work/current-commit"
printf '%s\n' "$previous" > "$work/previous-web-root"
printf 'Deployed %s; previous web root retained at %s\n' "$release_id" "$previous"
