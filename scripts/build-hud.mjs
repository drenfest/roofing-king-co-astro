import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// No Google credentials or analytics snapshots are read during builds.
const out = path.resolve(process.env.SITE_BUILD_OUTPUT || 'dist', 'hud');
await build({ configFile: false, root: path.resolve('dashboard/client'), base: '/hud/', plugins: [svelte()],
  build: { outDir: out, emptyOutDir: true, manifest: true,
    rollupOptions: { input: path.resolve('dashboard/client/main.js') } } });
const manifest = JSON.parse(await fs.readFile(path.join(out, '.vite/manifest.json'), 'utf8'));
const entry = Object.values(manifest).find(item => item.isEntry);
const assets = Buffer.from(JSON.stringify({ file: entry.file, css: entry.css || [] })).toString('base64');
const access = (await fs.readFile('dashboard/server/access.php', 'utf8')).replace(/^<\?php\s*declare\(strict_types=1\);\s*/, '');
const revision = process.env.GITHUB_SHA || 'development';
if (!/^(?:[a-f0-9]{40}|development)$/.test(revision)) throw new Error('Invalid runtime revision');
for (const name of ['index.php', '.htaccess']) {
  const source = await fs.readFile(`dashboard/server/${name}`, 'utf8');
  await fs.writeFile(path.join(out, name), source.replace("require __DIR__ . '/access.php';", access).replaceAll('@HUD_RUNTIME@', revision).replaceAll('@HUD_ASSETS@', assets));
}
await fs.copyFile('dashboard/client/shell.css', path.join(out, 'shell.css'));
await fs.rm(path.join(out, '.vite'), { recursive: true });
