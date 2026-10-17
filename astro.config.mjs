import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://www.roofkingco.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte()],
});
