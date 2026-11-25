import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import site from '../src/data/site.json' with { type: 'json' };
import { htmlFiles } from './html-attributes.mjs';

export const publicRobots = 'index, follow';
export const protectedRobots = 'noindex, nofollow';
export const indexingBlock = /# BEGIN INDEXING POLICY\n[\s\S]*?# END INDEXING POLICY/;

// Profiles identify release artifacts; only the authenticated HUD retains noindex.
export function siteEnvironment(value = process.env.SITE_ENVIRONMENT) {
  if (value === undefined) return 'staging';
  if (!['production', 'staging'].includes(value)) throw new Error('SITE_ENVIRONMENT must be production or staging');
  return value;
}

export function isPublicPath(pathname) {
  return !/^\/hud(?:\/|$)/i.test(pathname);
}

export function robotsForPath(pathname, environment = siteEnvironment()) {
  siteEnvironment(environment);
  return isPublicPath(pathname) ? publicRobots : protectedRobots;
}

export function robotsTxt(environment = siteEnvironment()) {
  siteEnvironment(environment);
  return `User-agent: *\nAllow: /\nDisallow: /hud/\n\nSitemap: ${site.url}/sitemap.xml\n`;
}

export function indexingHeaders(environment) {
  siteEnvironment(environment);
  // The HUD additionally enforces noindex/no-store in its own PHP response and
  // child .htaccess. Its authentication boundary is independent of this block.
  return `# BEGIN INDEXING POLICY\n# Build environment: ${environment}\n# No site-wide indexing restrictions. HUD policy lives in hud/.htaccess and PHP.\n# END INDEXING POLICY`;
}

export function applyPageIndexing(html, pathname, environment) {
  const $ = load(html);
  const directives = robotsForPath(pathname, environment);
  const robots = $('meta[name]').filter((_, el) => /^(?:robots|googlebot(?:-.*)?|bingbot)$/i.test($(el).attr('name') || ''));
  if (robots.length === 1 && robots.attr('name') === 'robots' && robots.attr('content') === directives) return html;
  robots.remove();
  $('head').append($('<meta>').attr({ name: 'robots', content: directives }));
  return $.html();
}

export async function readBuildPolicy(root = 'dist') {
  const policy = JSON.parse(await fs.readFile(path.join(root, 'build-policy.json'), 'utf8'));
  siteEnvironment(policy.environment);
  if (policy.canonicalOrigin !== site.url) throw new Error('Unexpected canonical origin in build policy');
  return policy;
}

export default function indexingPolicy() {
  const environment = siteEnvironment();
  return { name: 'environment-indexing-policy', hooks: { 'astro:build:done': async ({ dir, logger }) => {
    const root = fileURLToPath(dir);
    for (const file of await htmlFiles(root)) {
      const relative = path.relative(root, file).split(path.sep).join('/');
      const pathname = '/' + relative.replace(/(?:^|\/)index\.html$/, '/').replace(/^\//, '');
      const original = await fs.readFile(file, 'utf8');
      const updated = applyPageIndexing(original, pathname, environment);
      if (original !== updated) await fs.writeFile(file, updated);
    }
    const htaccessPath = path.join(root, '.htaccess');
    const htaccess = (await fs.readFile(htaccessPath, 'utf8')).replaceAll('\r\n', '\n');
    if (!indexingBlock.test(htaccess)) throw new Error('Missing fail-closed indexing policy block in Apache template');
    await fs.writeFile(htaccessPath, htaccess.replace(indexingBlock, indexingHeaders(environment)));
    await fs.writeFile(path.join(root, 'build-policy.json'), JSON.stringify({ environment, canonicalOrigin: site.url }) + '\n');
    logger.info(`Applied ${environment} indexing policy; only the authenticated HUD retains noindex.`);
  } } };
}
