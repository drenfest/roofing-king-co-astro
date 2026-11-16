import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { request } from 'node:http';

const run = spawnSync('php', ['dashboard/server/security-tests.php'], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stdout + run.stderr);
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'roof-hud-'));
let server;
try {
  await fs.mkdir(path.join(temp, 'public_html/hud'), { recursive: true });
  await fs.mkdir(path.join(temp, 'private_html/roof-king-hud/data'), { recursive: true });
  for (const file of ['index.php', 'access.php']) await fs.copyFile(`dashboard/server/${file}`, path.join(temp, 'public_html/hud', file));
  await fs.writeFile(path.join(temp, 'public_html/hud/assets.json'), JSON.stringify({ file: 'test.js', css: [] }));
  await fs.writeFile(path.join(temp, 'private_html/roof-king-hud/config.json'), JSON.stringify({ clientId: 'fixture-client', clientSecret: 'fixture-secret', allowedEmails: ['member@example.com'] }));
  await fs.writeFile(path.join(temp, 'private_html/roof-king-hud/data/dashboard.json'), '{"private_marker":"must-not-leak"}');
  server = spawn('php', ['-S', '127.0.0.1:18769', '-t', path.join(temp, 'public_html')], { stdio: 'ignore' });
  const url = 'http://127.0.0.1:18769/hud/index.php';
  let response;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { response = await fetch(url); break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert.ok(response, 'PHP integration server did not start');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Sign in with Google/);
  assert.doesNotMatch(html, /must-not-leak|fixture-secret|test\.js/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /secure/i); assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=Lax/i);
  response = await fetch(url + '?action=data');
  assert.equal(response.status, 401);
  assert.doesNotMatch(await response.text(), /must-not-leak/);
  response = await fetch(url + '?action=login', { redirect: 'manual' });
  assert.equal(response.status, 303);
  const google = new URL(response.headers.get('location'));
  assert.equal(google.origin, 'https://accounts.google.com');
  assert.equal(google.searchParams.get('scope'), 'openid email profile');
  assert.equal(google.searchParams.get('redirect_uri'), 'https://roofkingco.com/hud/index.php?action=callback');
  assert.equal(google.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(google.searchParams.get('nonce')); assert.ok(google.searchParams.get('state'));
  response = await fetch(url + '?action=callback&state=forged&code=forged');
  assert.equal(response.status, 400);
  response = await fetch(url + '?action=logout');
  assert.equal(response.status, 403);
  const canonical = await new Promise((resolve, reject) => {
    const req = request(url, { headers: { Host: 'www.roofkingco.com' } }, res => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location }));
    });
    req.on('error', reject); req.end();
  });
  assert.equal(canonical.status, 303, 'The www dashboard must use the same session host as OAuth');
  assert.equal(canonical.location, 'https://roofkingco.com/hud/');
  console.log(run.stdout.trim() + '\nHUD HTTP: anonymous data denied; identity-only OAuth; hardened cookies and cache headers.');
} finally {
  if (server && server.exitCode === null) { const exited = new Promise(resolve => server.once('exit', resolve)); server.kill(); await exited; }
  await fs.rm(temp, { recursive: true, force: true });
}
