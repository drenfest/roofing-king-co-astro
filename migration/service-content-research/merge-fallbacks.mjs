import fs from 'node:fs';
const base='migration/service-content-research/';let data=JSON.parse(fs.readFileSync(base+'competitor-pages.json'));for(const [u,v]of Object.entries(data))if(v.method==='web cached page')data[u]={ok:false};
for(const name of fs.readdirSync(base).filter(x=>/^fallback-\d+\.txt$/.test(x))){
 const raw=fs.readFileSync(base+name,'utf8');
 const starts=[...raw.matchAll(/Source: open\(\{"ref_id":"([^"]+)"/g)];
 for(let k=0;k<starts.length;k++){const part=raw.slice(starts[k].index,starts[k+1]?.index??raw.length);
  const m=part.match(/Source: open\(\{"ref_id":"([^"]+)"/);if(!m)continue;
  let body=part.replace(/L(\d+):/g,'\nL$1:').split('\n').filter(x=>/^L\d+:/.test(x)).map(x=>x.replace(/^L\d+: ?/,'').replace(/cite[^]*/g,'')).join('\n');
  let start=body.indexOf('\n# ');if(start>=0)body=body.slice(start+1);
  if(body.length>500&&!body.includes('Failed to fetch'))data[m[1]]={ok:true,method:'web cached page',retrieved:'2026-10-18',headings:body.split('\n').filter(x=>/^#{1,3} /.test(x)).map(x=>x.replace(/^#+ /,'')),text:body,characters:body.length};
 }
}
fs.writeFileSync(base+'competitor-pages.json',JSON.stringify(data,null,2));console.log(JSON.stringify(Object.entries(data).filter(([u,x])=>!x.ok).map(([url])=>url),null,2));
