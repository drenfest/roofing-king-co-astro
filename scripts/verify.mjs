import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {verificationGroups,validateGroups,failureExcerpt} from './verification-groups.mjs';

const manifest=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=manifest.scripts['verify:steps'].split('&&').map(command=>{
 const match=command.trim().match(/^npm run ([\w:-]+)$/);
 if(!match||!manifest.scripts[match[1]])throw Error('Invalid verification step: '+command);
 return match[1];
});
validateGroups(checks);
const groupId=process.argv.includes('--group')?process.argv[process.argv.indexOf('--group')+1]:null;
if(groupId&&!verificationGroups.some(g=>g.id===groupId))throw Error('Unknown verification flow: '+groupId);
const groups=groupId?verificationGroups.filter(g=>g.id===groupId):verificationGroups;
const results=[];
const logDir=process.env.GITHUB_ACTIONS?path.join(process.env.RUNNER_TEMP||os.tmpdir(),'verification'):null;
if(logDir)fs.mkdirSync(logDir,{recursive:true});
const escape=s=>s.replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');
async function run(check,group){
 const start=Date.now();let tail='',launchError;
 const log=logDir?fs.createWriteStream(path.join(logDir,check.replaceAll(':','-')+'.log')):null;
 console.log('START '+group.name+' / '+check);
 const exitCode=await new Promise(resolve=>{
  const child=spawn(process.execPath,[process.env.npm_execpath,'run',check],{env:process.env,stdio:['ignore','pipe','pipe']});
  const output=chunk=>{const value=chunk.toString();tail=(tail+value).slice(-64000);log?.write(value);};
  child.stdout.on('data',output);child.stderr.on('data',output);
  child.on('error',error=>{launchError=error;resolve(1);});child.on('close',code=>resolve(code??1));
 });
 if(log)await new Promise(resolve=>log.end(resolve));
 const passed=exitCode===0&&!launchError,seconds=Math.round((Date.now()-start)/1000);
 const result={check,group:group.name,passed,seconds};results.push(result);
 console.log(`${passed?'PASS':'FAIL'} ${group.name} / ${check} (${seconds}s)`);
 if(!passed){const excerpt=failureExcerpt(launchError?launchError.message:tail);console.error(excerpt);if(process.env.GITHUB_ACTIONS)console.log(`::error title=${escape(group.name+' — '+check)}::${escape(excerpt)}`);}
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`- ${passed?'PASS':'FAIL'}: **${group.name} / ${check}** (${seconds}s)\n`);
 return passed;
}
let stopped=false;
for(const group of groups){
 const concurrency=['foundation','build'].includes(group.id)?1:2;let cursor=0,failed=false;
 await Promise.all(Array.from({length:Math.min(concurrency,group.checks.length)},async()=>{
  while(cursor<group.checks.length){if(failed&&concurrency===1)break;const passed=await run(group.checks[cursor++],group);if(!passed)failed=true;}
 }));
 if(failed&&['foundation','build'].includes(group.id)){stopped=true;break;}
}
const failed=results.filter(r=>!r.passed).map(r=>r.check),expected=groups.flatMap(g=>g.checks).length;
console.log('VERIFICATION_RESULT '+JSON.stringify({passed:results.length-failed.length,failed,notRun:expected-results.length,stopped}));
if(failed.length)process.exitCode=1;
