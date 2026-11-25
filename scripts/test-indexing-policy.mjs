import assert from 'node:assert/strict';
import { applyPageIndexing, indexingHeaders, protectedRobots, publicRobots, robotsForPath, robotsTxt, siteEnvironment } from './indexing-policy.mjs';
import { assertApachePolicy, assertIndexingMeta } from './check-indexing.mjs';

const inherited = process.env.SITE_ENVIRONMENT;
delete process.env.SITE_ENVIRONMENT;
assert.equal(siteEnvironment(), 'staging', 'Unconfigured builds are not production release artifacts');
if (inherited !== undefined) process.env.SITE_ENVIRONMENT = inherited;
assert.throws(() => siteEnvironment('prodution'), /production or staging/);
assert.throws(() => siteEnvironment(''), /production or staging/);
for (const pathname of ['/', '/siding/', '/columbus-oh/roofing/', '/404.html', '/service-page-review.html', '/new-unregistered-tool/']) {
  assert.equal(robotsForPath(pathname, 'production'), 'index, follow');
  assert.equal(robotsForPath(pathname, 'staging'), 'index, follow');
}
for (const pathname of ['/hud/', '/hud/index.php']) {
  assert.equal(robotsForPath(pathname, 'production'), 'noindex, nofollow');
  assert.equal(robotsForPath(pathname, 'staging'), 'noindex, nofollow');
}
const page = content => `<html><head>${content}</head><body><main>Public content</main></body></html>`;
assertIndexingMeta(page('<meta name="robots" content="index, follow">'), publicRobots, 'Valid public fixture');
for (const bad of [
  '<meta name="robots" content="noindex, nofollow">',
  '<meta name="robots" content="none">',
  '<meta name="robots" content="index, follow"><meta name="googlebot" content="noindex">',
  '<meta name="robots" content="index, follow"><meta name="robots" content="noindex">'
]) assert.throws(() => assertIndexingMeta(page(bad), publicRobots, 'Bad production fixture'));
assert.throws(() => assertIndexingMeta(page('<meta name="robots" content="index, follow">'), protectedRobots, 'HUD must retain noindex'));
const stale = page('<meta name="robots" content="noindex, nofollow"><meta name="googlebot" content="noindex">');
assertIndexingMeta(applyPageIndexing(stale, '/siding/', 'production'), publicRobots, 'Remove stale production directives');
assertIndexingMeta(applyPageIndexing(stale, '/siding/', 'staging'), publicRobots, 'Remove staging noindex too');
assertIndexingMeta(applyPageIndexing(stale, '/hud/', 'production'), protectedRobots, 'Keep HUD noindex');
assertIndexingMeta(applyPageIndexing(page('<meta http-equiv="refresh" content="0;url=/about-us/">'), '/about/', 'production'), publicRobots, 'No noindex on redirect stubs');
assertApachePolicy(indexingHeaders('production'), 'production');
assertApachePolicy(indexingHeaders('staging'), 'staging');
assert.throws(() => assertApachePolicy(indexingHeaders('production') + '\nHeader always set X-Robots-Tag "noindex"', 'production'));
assert.throws(() => assertApachePolicy(indexingHeaders('staging'), 'production'));
assert.match(robotsTxt('production'), /Disallow: \/hud\//);
assert.equal(robotsTxt('staging'), robotsTxt('production'));
console.log('Indexing regression fixtures passed: noindex only on HUD, stale/conflicting directive removal and blanket header rejection.');
