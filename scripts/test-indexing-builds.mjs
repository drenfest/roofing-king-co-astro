import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
import { checkBuiltIndexing } from './check-indexing.mjs';

await fs.mkdir('tmp', { recursive: true });
const directory = await fs.mkdtemp('tmp/indexing-builds-');
const results = [];
for (const environment of ['production', 'staging']) {
  const out = path.join(directory, environment);
  console.log(`Building and checking ${environment}; full log: ${directory}/${environment}.log`);
  const result = spawnSync(process.execPath, ['scripts/build-site.mjs', environment, '--out-dir', out], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  await fs.writeFile(path.join(directory, environment + '.log'), (result.stdout || '') + (result.stderr || ''));
  if (result.error || result.status !== 0) throw new Error(`${environment} build failed: ${result.error?.message || ((result.stdout || '') + (result.stderr || '')).slice(-5000)}`);
  const summary = (result.stdout || '').split(/\r?\n/).reverse().find(line => line.startsWith('{"environment":'));
  assert.ok(summary, 'The build must run its final indexing regression guard');
  results.push(JSON.parse(summary));
  console.log(summary);
}
await assert.rejects(checkBuiltIndexing(path.join(directory, 'staging'), 'production'), /Build environment must match/, 'A staging artifact must not pass the production gate');
for (const pathname of ['/', '/siding/', '/columbus-oh/roofing/']) {
  const views = [];
  for (const environment of ['production', 'staging']) {
    const $ = load(await fs.readFile(path.join(directory, environment, pathname.slice(1), 'index.html'), 'utf8'));
    views.push({ canonical: $('link[rel=canonical]').attr('href'), heading: $('h1').text(), forms: $('form').toArray().map(el => ({ method: $(el).attr('method'), action: $(el).attr('action'), mode: $(el).attr('data-form-mode') })), phones: $('a[href^="tel:"]').map((_, el) => $(el).attr('href')).get() });
  }
  assert.deepEqual(views[0], views[1], pathname + ': indexing profiles must not change lead delivery, phone configuration or canonicals');
}
await fs.writeFile(path.join(directory, 'results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results, stagingRejectedAsProduction: true, representativeLeadConfigurationUnchanged: true }, null, 2));
console.log(`Both builds passed. Artifacts and evidence retained at ${directory}`);
