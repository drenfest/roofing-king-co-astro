import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// No Google credentials or analytics snapshots are read during builds.
const out = path.resolve('dist/hud');
await build({ configFile: false, root: path.resolve('dashboard/client'), base: '/hud/', plugins: [svelte()],
  build: { outDir: out, emptyOutDir: true, manifest: true,
    rollupOptions: { input: path.resolve('dashboard/client/main.js') } } });
const manifest = JSON.parse(await fs.readFile(path.join(out, '.vite/manifest.json'), 'utf8'));
const entry = Object.values(manifest).find(item => item.isEntry);
await fs.writeFile(path.join(out, 'assets.json'), JSON.stringify({ file: entry.file, css: entry.css || [] }));
const revision = process.env.GITHUB_SHA || 'development';
if (!/^(?:[a-f0-9]{40}|development)$/.test(revision)) throw new Error('Invalid runtime revision');
for (const name of ['index.php', 'access.php', '.htaccess']) {
  const source = await fs.readFile(`dashboard/server/${name}`, 'utf8');
  await fs.writeFile(path.join(out, name), source.replaceAll('@HUD_RUNTIME@', revision));
}
await fs.copyFile('dashboard/client/shell.css', path.join(out, 'shell.css'));
await fs.rm(path.join(out, '.vite'), { recursive: true });
