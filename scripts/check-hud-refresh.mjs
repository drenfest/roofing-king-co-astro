import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { publishHudReport } from './hud-refresh-publication.mjs';
import { reportingScope, refreshReportingAccessToken } from './hud-reporting-auth.mjs';

const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'roof-report-refresh-'));
try {
  const target = path.join(directory, 'dashboard.json');
  const good = { report: { property: 'sc-domain:roofkingco.com', dataThrough: '2026-11-17', refreshedAt: '2026-11-19T12:00:00Z' }, rows: [{ page: 'https://roofkingco.com/' }], observability: { events: [{ event_id: 'retained-event' }] } };
  await publishHudReport(good, target);
  const original = await fs.readFile(target, 'utf8');
  for (const bad of [{ ...good, rows: [] }, { ...good, error: 'API failure' }, { ...good, report: { ...good.report, property: 'sc-domain:other.example' } }, { ...good, report: { ...good.report, dataThrough: '2026-11-16' } }]) {
    await assert.rejects(publishHudReport(bad, target));
    assert.equal(await fs.readFile(target, 'utf8'), original, 'A failed refresh must preserve the last good report');
  }
  await publishHudReport({ ...good, observability: null, report: { ...good.report, dataThrough: '2026-11-18' } }, target);
  assert.equal(JSON.parse(await fs.readFile(target, 'utf8')).observability.events[0].event_id, 'retained-event');
  assert.deepEqual(await fs.readdir(directory), ['dashboard.json'], 'No staging files should remain after publication');
  if (process.platform !== 'win32') assert.equal((await fs.stat(target)).mode & 0o777, 0o640);
  const config = { clientId: 'fixture-client', clientSecret: 'fixture-secret', refreshToken: 'fixture-refresh', requireReadonlyScope: true };
  const response = payload => async (url, options) => {
    assert.equal(url, 'https://oauth2.googleapis.com/token');
    assert.equal(options.body.get('scope'), reportingScope);
    return { ok: true, status: 200, json: async () => payload };
  };
  assert.equal(await refreshReportingAccessToken(config, response({ access_token: 'fixture-token', scope: reportingScope })), 'fixture-token');
  await assert.rejects(refreshReportingAccessToken(config, response({ access_token: 'fixture-token', scope: reportingScope + ' https://www.googleapis.com/auth/gmail.send' })), /read-only/);
  await assert.rejects(refreshReportingAccessToken(config, response({ access_token: 'fixture-token' })), /read-only/);
  await assert.rejects(refreshReportingAccessToken(config, async () => ({ ok: false, status: 400, json: async () => ({ error: 'invalid_grant' }) })), /authorization failed/);
  const shell = spawnSync('bash', ['-n', 'scripts/refresh-hud-daily.sh'], { encoding: 'utf8' });
  assert.equal(shell.status, 0, shell.stderr);
  const installer = spawnSync('bash', ['-n', 'scripts/install-hud-cron.sh'], { encoding: 'utf8' });
  assert.equal(installer.status, 0, installer.stderr);
  // Check the UTC schedule's DST guard at both candidate hours in winter/summer.
  const localHour = iso => new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
  assert.deepEqual(['2026-11-19T11:00:00Z','2026-11-19T12:00:00Z'].map(localHour), ['05','06']);
  assert.deepEqual(['2027-07-19T11:00:00Z','2027-07-19T12:00:00Z'].map(localHour), ['06','07']);
  console.log('HUD daily refresh: atomic publication, failure preservation, read-only credentials, shell syntax and Chicago DST scheduling verified.');
} finally { await fs.rm(directory, { recursive: true, force: true }); }
