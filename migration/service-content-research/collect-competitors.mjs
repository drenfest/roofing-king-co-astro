import fs from 'node:fs';
import * as cheerio from 'cheerio';
const base='migration/service-content-research/';
const rows=JSON.parse(fs.readFileSync(base+'research-ledger.json'));
const urls=[...new Set(rows.flatMap(r=>r.competitors.map(c=>c.url)))];
const old=fs.existsSync(base+'competitor-pages.json')?JSON.parse(fs.readFileSync(base+'competitor-pages.json')):{};
let index=0;
async function worker(){
 while(index<urls.length){const url=urls[index++];if(old[url]?.ok)continue;
  try{
   const res=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Mozilla/5.0 (compatible; content research)'}});
   const html=await res.text();const $=cheerio.load(html);
   $('script,style,nav,header,footer,noscript,form,svg,[role=navigation]').remove();
   const root=$('main').length?$('main').first():$('body');
   const headings=root.find('h1,h2,h3').map((_,e)=>$(e).text().replace(/\s+/g,' ').trim()).get().filter(Boolean);
   const text=root.text().replace(/\s+/g,' ').trim();
   old[url]={ok:res.ok&&text.length>400,status:res.status,finalUrl:res.url,retrieved:'2026-10-18',headings,text:text.slice(0,42000),characters:text.length};
  }catch(e){old[url]={ok:false,error:String(e)};}
  fs.writeFileSync(base+'competitor-pages.json',JSON.stringify(old,null,2));
 }
}
await Promise.all(Array.from({length:10},worker));
const active=urls.map(url=>[url,old[url]]);
console.log(JSON.stringify({total:urls.length,read:active.filter(([url,x])=>x.ok).length,failed:active.filter(([u,x])=>!x.ok).map(([url,x])=>({url,status:x.status,error:x.error,characters:x.characters}))},null,2));
