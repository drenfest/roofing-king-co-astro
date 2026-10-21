// Optional visual QA runner. Supply PLAYWRIGHT_MODULE when using a bundled runtime.
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const editorial=JSON.parse(await fs.readFile('src/data/service-editorial.json','utf8'));
const filter=process.env.REVIEW_PATHS?.split(',');
const routes=Object.entries(editorial).filter(([path])=>!filter||filter.includes(path));
const output='tmp/service-review/full-copy';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];let next=0;
const jobs=routes.flatMap(([path,data])=>['desktop','mobile'].map(mode=>({path,data,mode})));
async function worker(){const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
 while(next<jobs.length){const {path,data,mode}=jobs[next++];const width=mode==='desktop'?1440:390;const height=mode==='desktop'?1000:844;const errors=[];
  await page.setViewportSize({width,height});const errorHandler=e=>errors.push(String(e));page.on('pageerror',errorHandler);
  try{
   const response=await page.goto('http://127.0.0.1:4321'+path,{waitUntil:'load',timeout:30000});
   await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,3500))]));
   const parent=await page.locator('[data-component=ServicePaths]').count();
   if(parent){await page.locator('[data-component=ServiceExplorer].is-enhanced').waitFor({timeout:6000});
    const tabs=page.locator('.rk-service-explorer-tabs a');if(await tabs.count()>1){if(mode==='mobile')await page.locator('.rk-service-explorer-mobile select').selectOption({index:1});else await tabs.nth(1).click();}
   }
   const faq=page.locator('.rk-service-faq details').first();await faq.locator('summary').click();const faqWorked=await faq.getAttribute('open')!==null&&await faq.locator('div').innerText()!=='';await faq.locator('summary').click();
   await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);});
   const measurements=await page.evaluate(()=>({width:innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),visiblePanels:[...document.querySelectorAll('[data-service-panel]')].filter(e=>!e.hidden).length,brokenImages:[...document.querySelectorAll('main img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),disabledForms:document.querySelectorAll('.rk-quote-form button[type=submit]:disabled').length}));
   const filename=path==='/'?'home':path.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','--');
   await page.screenshot({path:`${output}/${filename}-${mode}.jpg`,fullPage:true,type:'jpeg',quality:65,animations:'disabled'});
   const record={path,mode,...measurements,status:response.status(),hasChildren:!!parent,faqWorked,errors,screenshot:`${output}/${filename}-${mode}.jpg`};results.push(record);
   await fs.writeFile('tmp/service-review/'+(filter?'pilot-results.json':'browser-results.json'),JSON.stringify(results,null,2));
   if(record.status!==200||record.scrollWidth>width+1||record.brokenImages.length||record.disabledForms!==2||!faqWorked||errors.length||record.visiblePanels!==(parent?1:0))console.log(JSON.stringify({failure:record}));
   else console.log(`PASS ${mode} ${path}`);
  }catch(error){results.push({path,mode,error:String(error)});console.log(`FAIL ${mode} ${path} ${String(error)}`);}finally{page.off('pageerror',errorHandler);}
 }
 await context.close();
}
await Promise.all(Array.from({length:4},worker));await browser.close();
await fs.writeFile('tmp/service-review/'+(filter?'pilot-results.json':'browser-results.json'),JSON.stringify(results,null,2));
console.log(`Reviewed ${results.length} desktop/mobile pages.`);
