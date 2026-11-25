import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import htmlAttributes from './scripts/html-attributes.mjs';
import internalLinks from './scripts/internal-links.mjs';
import structuredData from './scripts/structured-data.mjs';
import sitemap from './scripts/sitemap.mjs';
import contextOutput from './scripts/context-output.mjs';
import indexingPolicy from './scripts/indexing-policy.mjs';
import redirects from './migration/route-redirects.json' with {type:'json'};

export default defineConfig({
  site: 'https://www.roofkingco.com',
  output: 'static',
  trailingSlash: 'always',
  outDir: process.env.SITE_BUILD_OUTPUT || undefined,
  redirects,
  integrations: [svelte(),internalLinks(),htmlAttributes(),structuredData(),indexingPolicy(),sitemap(),contextOutput()],
});
