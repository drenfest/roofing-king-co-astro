import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

// Run build-dependent checks independently so GitHub reports all failures in one run.
// The package manifest remains the single ordered source of check names.
const manifest=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=manifest.scripts['verify:steps'].split('&&').map(command=>{
 const match=command.trim().match(/^npm run ([\w:-]+)$/);
 if(!match||!manifest.scripts[match[1]])throw Error('Invalid verification step: '+command);
 return match[1];
});
const results=[];
for(const check of checks){
 const result=spawnSync(process.execPath,[process.env.npm_execpath,'run',check],{stdio:'inherit',env:process.env});
 const passed=result.status===0&&!result.error;
 results.push({check,passed});
 if(!passed&&['check:contexts','check','build'].includes(check))break;
}
if(process.env.GITHUB_STEP_SUMMARY){
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\n## Verification checks\n\n'+results.map(result=>`- ${result.passed?'PASS':'FAIL'}: ${result.check}`).join('\n')+'\n');
}
const failures=results.filter(result=>!result.passed);
console.log('\nVERIFICATION_RESULT '+JSON.stringify({passed:results.length-failures.length,failed:failures.map(result=>result.check),notRun:checks.length-results.length}));
if(failures.length)process.exitCode=1;
