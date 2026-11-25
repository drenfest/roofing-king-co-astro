import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Private release metadata, never copied into the static site or its assets.
const manifest = JSON.parse(await fs.readFile('migration/route-manifest.json', 'utf8'));
const owners = new Map();
for (const route of manifest.routes) {
  const map = await fs.readFile(path.join(path.dirname(route.file), 'ai-context.md'), 'utf8').catch(() => '');
  const sources = [...map.matchAll(/(?:Renderer|Edit visible content in): `([^`]+)`/g)]
    .flatMap((match) => match[1].match(/src\/[\w./[\]-]+\.(?:astro|svelte|json|ts|js|md)/g) || []);
  const native = `src/pages${route.path === '/' ? '/index' : route.path.replace(/\/$/, '')}.astro`;
  owners.set(`https://roofkingco.com${route.path}`, new Set([route.file, native, ...sources]));
}
const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const log = git(['log', '--since=6 months ago', '--format=%x1e%H%x1f%cI%x1f%s', '--name-only', '--', 'src']);
const events = [];
for (const record of log.split('\x1e').filter(Boolean)) {
  const [header, ...lines] = record.trim().split('\n');
  const [commit, timestamp, title] = header.split('\x1f');
  const files = lines.map((line) => line.trim()).filter(Boolean);
  const byUrl = {};
  for (const [url, sources] of owners) {
    const matched = files.filter((file) => sources.has(file));
    if (matched.length) byUrl[url] = matched;
  }
  if (!Object.keys(byUrl).length) continue;
  events.push({ event_id: `git:${commit}`, event_type: 'code_change', timestamp, commit_sha: commit,
    title, summary: 'Committed changes to this page’s source or shared renderer/data. Shared-file changes may affect multiple pages; this records the commit, not a confirmed deployment.',
    urls: Object.keys(byUrl), source: 'Git history', source_files: files,
    metadata: { source_files_by_url: byUrl } });
}
await fs.mkdir('tmp/hud-runtime', { recursive: true });
await fs.writeFile('tmp/hud-runtime/code-events.json', JSON.stringify({ events }), { mode: 0o640 });
console.log(`Private HUD history: ${events.length} source commits.`);
