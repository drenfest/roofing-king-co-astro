import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { htmlFiles } from './html-attributes.mjs';
import { indexingBlock, indexingHeaders, isPublicPath, publicRobots, protectedRobots, readBuildPolicy, robotsTxt, siteEnvironment } from './indexing-policy.mjs';
import manifest from '../migration/route-manifest.json' with { type: 'json' };

const records = new Map(manifest.routes.map(route => [route.path, route]));

export function assertIndexingMeta(html, expected, label) {
  const $ = load(html);
  const tags = $('meta[name]').filter((_, el) => /^(?:robots|googlebot(?:-.*)?|bingbot)$/i.test($(el).attr('name') || ''));
  assert.equal(tags.length, 1, `${label}: one authoritative robots directive; no conflicting bot overrides`);
  assert.equal(tags.attr('name'), 'robots', label);
  assert.equal(tags.attr('content'), expected, `${label}: incorrect indexing policy`);
}

export function assertApachePolicy(text, environment) {
  const htaccess = text.replaceAll('\r\n', '\n');
  assert.equal(htaccess.match(indexingBlock)?.[0], indexingHeaders(environment), 'Apache indexing policy must match the selected environment');
  assert.doesNotMatch(htaccess, /Header\s+(?:always\s+)?(?:set|add|append|merge)\s+X-Robots-Tag[^\n]*(?:noindex|none)/i, 'Only the HUD child configuration may set noindex');
}

export async function checkBuiltIndexing(root, expectedEnvironment) {
  const policy = await readBuildPolicy(root);
  assert.equal(policy.environment, siteEnvironment(expectedEnvironment), 'Build environment must match the requested release type');
  const expectedSitemap = new Set();
  let indexable = 0, protectedCount = 0;
  for (const filename of await htmlFiles(root)) {
    const html = await fs.readFile(filename, 'utf8');
    const $ = load(html);
    const relative = path.relative(root, filename).split(path.sep).join('/');
    const pathname = '/' + relative.replace(/(?:^|\/)index\.html$/, '/').replace(/^\//, '');
    const redirect = $('meta[http-equiv]').toArray().some(el => /refresh/i.test($(el).attr('http-equiv') || ''));
    const eligible = isPublicPath(pathname);
    assertIndexingMeta(html, eligible ? publicRobots : protectedRobots, pathname);
    if (eligible) indexable++; else protectedCount++;
    const canonical = $('link[rel=canonical]').attr('href');
    if (records.has(pathname) && !redirect) {
      assert.equal(canonical, new URL(records.get(pathname).canonicalPath, policy.canonicalOrigin).href, pathname + ': preserve the approved www canonical');
    }
    if (eligible && !redirect && records.has(pathname) && canonical && $('main').length) {
      const url = new URL(canonical);
      if (url.origin === policy.canonicalOrigin && url.pathname === pathname && !url.search && !url.hash) expectedSitemap.add(url.href);
    }
  }
  for (const pathname of ['/', '/siding/', '/columbus-oh/roofing/']) {
    await fs.access(path.join(root, pathname.slice(1), 'index.html'));
  }
  const xml = load(await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8'), { xmlMode: true });
  const urls = xml('urlset>url>loc').map((_, el) => xml(el).text()).get();
  assert.deepEqual(urls, [...expectedSitemap].sort(), 'Only eligible, self-canonical public pages belong in the sitemap');
  assert.equal(await fs.readFile(path.join(root, 'robots.txt'), 'utf8'), robotsTxt(policy.environment));
  assertApachePolicy(await fs.readFile(path.join(root, '.htaccess'), 'utf8'), policy.environment);
  const hud = await fs.readFile(path.join(root, 'hud/index.php'), 'utf8');
  assert.match(hud, /header\('X-Robots-Tag: noindex, nofollow, noarchive'\)/, 'HUD must retain its PHP noindex response header');
  assert.match(hud, /<meta name="robots" content="noindex,nofollow,noarchive">/, 'HUD must retain its protected HTML metadata');
  assert.match(hud, /if \(!\$authenticated\) hudFail\(401,/, 'HUD data must still require authentication');
  assert.match(await fs.readFile(path.join(root, 'hud/.htaccess'), 'utf8'), /X-Robots-Tag "noindex, nofollow, noarchive"/);
  for (const filename of ['hud/config.json', 'hud/data.json', 'hud/dashboard.json', 'hud/reporting-oauth.json']) {
    await assert.rejects(fs.access(path.join(root, filename)), /ENOENT/, 'Private data or credentials must never ship');
  }
  assert.ok(indexable > 0 && urls.length > 0);
  return { environment: policy.environment, indexableHtml: indexable, protectedHtml: protectedCount, sitemapUrls: urls.length, canonicalOrigin: policy.canonicalOrigin, hudProtected: true };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argument = name => { const at = process.argv.indexOf(name); return at < 0 ? undefined : process.argv[at + 1]; };
  const root = argument('--root') || 'dist';
  const environment = argument('--environment') || 'production';
  console.log(JSON.stringify(await checkBuiltIndexing(root, environment)));
}
