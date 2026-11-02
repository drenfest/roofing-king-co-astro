import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verificationGroups,validateGroups,failureExcerpt} from './verification-groups.mjs';
const groups=verificationGroups.flatMap(g=>g.checks);validateGroups(JSON.parse(fs.readFileSync('package.json','utf8')).scripts['verify:steps'].split('&&').map(c=>c.trim().replace('npm run ','')));validateGroups(groups);assert.throws(()=>validateGroups([...groups,'check:unassigned']),/exactly one/);
const detail=failureExcerpt('noise\nnode:internal/modules/run_main:107\nAssertionError: Missing source block /roofing/\nactual: 0\nexpected: 1\nat file:///repo/scripts/check-services.mjs:161:9');
assert.ok(detail.includes('/roofing/'));assert.ok(detail.includes('check-services.mjs:161'));assert.ok(detail.includes('actual: 0'));assert.ok(detail.includes('expected: 1'));assert.ok(failureExcerpt('x'.repeat(10000)).length<=2600);
console.log('Release tools: all checks assigned once; bounded descriptive errors preserve page, file and expected/actual context.');
