import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { load } from 'cheerio';

// Optional local integration test against an existing Apache installation.
// It binds loopback only and never loads PHP or sends a lead/external request.
const argument = name => { const at = process.argv.indexOf(name); return at < 0 ? undefined : process.argv[at + 1]; };
const builds = path.resolve(argument('--builds') || '');
const apache = path.resolve(argument('--apache') || 'S:/projects/xampp/apache/bin/httpd.exe');
await fs.access(apache);
const apacheRoot = path.resolve(path.dirname(apache), '..');
const quote = value => '"' + value.replaceAll('\\', '/') + '"';
const summaries = [];
for (const environment of ['production', 'staging']) {
  const root = path.join(builds, environment);
  await fs.access(path.join(root, 'build-policy.json'));
  const port = await new Promise((resolve, reject) => {
    const server = net.createServer(); server.on('error', reject);
    server.listen(0, '127.0.0.1', () => { const value = server.address().port; server.close(() => resolve(value)); });
  });
  const config = path.join(builds, environment + '-apache.conf');
  const errorLog = path.join(builds, environment + '-apache-error.log');
  const lines = [
    `ServerRoot ${quote(apacheRoot)}`, `Listen 127.0.0.1:${port}`, `ServerName 127.0.0.1:${port}`,
    `PidFile ${quote(path.join(builds, environment + '-apache.pid'))}`, `ErrorLog ${quote(errorLog)}`, 'LogLevel warn',
    'ServerTokens Prod', 'ServerSignature Off',
    ...['authz_core', 'authz_host', 'headers', 'rewrite', 'mime', 'dir'].map(name => `LoadModule ${name}_module modules/mod_${name}.so`),
    'TypesConfig conf/mime.types', `DocumentRoot ${quote(root)}`, '<Directory />', '  Require all denied', '</Directory>',
    `<Directory ${quote(root)}>`, '  AllowOverride All', '  Require all granted', '</Directory>',
    // The fixture tests real Apache metadata/header behavior. It must never
    // expose PHP source or pretend to implement the private production backend.
    '<LocationMatch "^/hud(?:/|$)">', '  Require all denied', '</LocationMatch>'
  ];
  await fs.writeFile(config, lines.join('\n') + '\n');
  const syntax = spawnSync(apache, ['-f', config, '-t'], { encoding: 'utf8', windowsHide: true });
  assert.equal(syntax.status, 0, syntax.stdout + syntax.stderr);
  const child = spawn(apache, ['-X', '-f', config], { stdio: 'ignore', windowsHide: true });
  try {
    const origin = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      try { const response = await fetch(origin, { signal: AbortSignal.timeout(1000) }); await response.body?.cancel(); ready = true; break; }
      catch { await new Promise(resolve => setTimeout(resolve, 100)); }
    }
    assert.ok(ready, 'Isolated Apache did not start: ' + await fs.readFile(errorLog, 'utf8').catch(() => 'No error log'));
    const checked = [];
    for (const route of ['/', '/siding/', '/columbus-oh/roofing/', '/service-page-review.html', '/404.html']) {
      const response = await fetch(origin + route, { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, 200, route);
      const $ = load(await response.text());
      assert.equal($('meta[name=robots]').attr('content'), 'index, follow', route);
      assert.equal(response.headers.get('x-robots-tag'), null, route + ': only HUD may send noindex headers');
      checked.push({ route, status: response.status, robots: $('meta[name=robots]').attr('content'), xRobotsTag: response.headers.get('x-robots-tag') });
    }
    const missing = await fetch(origin + '/not-a-real-roof-king-page/', { signal: AbortSignal.timeout(5000) });
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get('x-robots-tag'), null);
    const alias = await fetch(origin + '/gallery/', { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    assert.equal(alias.status, 301);
    assert.equal(new URL(alias.headers.get('location'), origin).hash, '#projects');
    const hud = await fetch(origin + '/hud/', { signal: AbortSignal.timeout(5000) });
    assert.equal(hud.status, 403, 'The PHP-disabled fixture must deny HUD access rather than expose source');
    await hud.body?.cancel();
    summaries.push({ environment, apacheSyntax: 'passed', checked, missingStatus: 404, retainedGalleryRedirect: 301, fixtureHudStatus: 403, phpExecution: 'disabled in local fixture' });
  } finally {
    if (child.exitCode === null) { const exited = new Promise(resolve => child.once('exit', resolve)); child.kill(); await exited; }
  }
}
await fs.writeFile(path.join(builds, 'http-results.json'), JSON.stringify(summaries, null, 2));
console.log(`Real loopback Apache checks passed for both builds: public/staging headers, metadata, HUD fixture denial, 404s and retained redirects. Evidence: ${builds}`);
