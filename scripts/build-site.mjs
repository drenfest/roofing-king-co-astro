import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { siteEnvironment } from './indexing-policy.mjs';

const environment = process.argv[2];
if (!environment) throw new Error('Choose an explicit build environment: production or staging');
siteEnvironment(environment);
const root = fileURLToPath(new URL('../', import.meta.url));
const requested = process.argv.indexOf('--out-dir');
const output = path.resolve(root, requested >= 0 ? process.argv[requested + 1] : environment === 'production' ? 'dist' : 'tmp/staging-site');
if (output !== path.join(root, 'dist') && !output.startsWith(path.join(root, 'tmp') + path.sep)) throw new Error('Build output must be dist or a directory inside this checkout\'s tmp folder');
const env = { ...process.env, SITE_ENVIRONMENT: environment, SITE_BUILD_OUTPUT: output };
function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run(['scripts/test-indexing-policy.mjs']);
run(['node_modules/astro/bin/astro.mjs', 'build']);
run(['scripts/build-hud.mjs']);
run(['scripts/check-indexing.mjs', '--root', output, '--environment', environment]);
