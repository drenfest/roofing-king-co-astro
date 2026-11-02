import {execFileSync} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
import assert from 'node:assert/strict';

// Shared publisher command: no model-specific scheduler or account notifications.
const cli=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const gh=args=>JSON.parse(cli('gh',args));
const watchOnly=process.argv.includes('--watch-only');
async function main(){
 const commit=cli('git',['rev-parse','HEAD']);
 if(!watchOnly){
  assert.equal(cli('git',['branch','--show-current']),'main','Switch to main before publishing.');
  assert.equal(cli('git',['status','--porcelain','--untracked-files=no']),'','Commit tracked changes before publishing. This command does not stage or commit files.');
  console.log('Pushing committed main revision '+commit.slice(0,8));cli('git',['push','origin','main']);
 }
 console.log('Watching committed revision '+commit.slice(0,8));
 const repo=cli('gh',['repo','view','--json','nameWithOwner','--jq','.nameWithOwner']);
 let run;const discoveryDeadline=Date.now()+120000;
 while(!run&&Date.now()<discoveryDeadline){
  const runs=gh(['run','list','--workflow','deploy-cloudways.yml','--commit',commit,'--limit','5','--json','databaseId,status,conclusion,url']);run=runs[0];if(!run)await pause(5000);
 }
 assert.ok(run,'GitHub did not create a deployment run within two minutes. Check workflow permissions and push triggers.');
 console.log('GitHub: '+run.url);
 const seenSteps=new Set(),seenAnnotations=new Set(),checkUrls=new Map();const deadline=Date.now()+45*60000;
 while(Date.now()<deadline){
  const state=gh(['run','view',String(run.databaseId),'--json','status,conclusion,jobs,url']);
  for(const job of state.jobs||[]){
   for(const step of job.steps||[]){if(step.status==='in_progress'&&!seenSteps.has(step.name)){seenSteps.add(step.name);console.log('FLOW: '+step.name);}}
   if(job.databaseId){
    if(!checkUrls.has(job.databaseId)){const detail=gh(['api',`repos/${repo}/actions/jobs/${job.databaseId}`]);checkUrls.set(job.databaseId,detail.check_run_url);}
    const url=checkUrls.get(job.databaseId);
    if(url){
     const annotations=gh(['api',url+'/annotations?per_page=100']);
     const failures=annotations.filter(a=>a.annotation_level==='failure'&&!seenAnnotations.has(a.title+'\n'+a.message));
     if(failures.length){
      for(const failure of failures){seenAnnotations.add(failure.title+'\n'+failure.message);console.error('\u0007\nDEPLOYMENT BLOCKED — '+(failure.title||job.name));if(failure.path)console.error('File: '+failure.path+(failure.start_line?':'+failure.start_line:''));console.error(failure.message.slice(0,3000));}
      console.error('Run: '+state.url+'\nNothing from this revision is confirmed live. Fix the failed check, commit, then run npm run go-live again.');process.exitCode=1;return;
     }
    }
   }
  }
  if(state.status==='completed'){
   if(state.conclusion!=='success'){
    const failed=(state.jobs||[]).flatMap(j=>(j.steps||[]).filter(s=>s.conclusion==='failure').map(s=>j.name+' / '+s.name));
    console.error('\u0007\nDEPLOYMENT '+state.conclusion.toUpperCase()+': '+failed.join(', '));
    const excerpt=cli('gh',['run','view',String(run.databaseId),'--log-failed']).split(/\r?\n/).filter(l=>/AssertionError|Error:|error ts\(|SyntaxError|TypeError|VERIFICATION_RESULT|at file:/.test(l)).slice(0,18).join('\n');
    if(excerpt)console.error(excerpt.slice(0,5000));console.error(state.url);process.exitCode=1;return;
   }
   const base='https://wordpress-1269393-6519803.cloudwaysapps.com';
   const response=await fetch(base+'/release.json?release='+commit,{signal:AbortSignal.timeout(20000),cache:'no-store'});assert.equal(response.status,200,'Published release marker must respond.');assert.equal((await response.json()).commit,commit,'Live release marker does not match the deployed commit.');
   const page=await fetch(base+'/?release='+commit,{signal:AbortSignal.timeout(20000),cache:'no-store'});assert.equal(page.status,200,'Published homepage must respond.');await page.body?.cancel();
   console.log('LIVE '+commit.slice(0,8)+' — GitHub checks, Cloudways deployment and public revision verification passed.\n'+base+'\n'+state.url);return;
  }
  await pause(15000);
 }
 throw Error('Deployment monitoring exceeded 45 minutes. Check '+run.url+'; this command has not confirmed publication.');
}
main().catch(error=>{console.error('\u0007\nRELEASE MONITOR FAILED: '+(error.stderr?.toString().trim()||error.message));process.exitCode=1;});
