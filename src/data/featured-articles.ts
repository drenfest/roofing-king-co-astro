import articles from './featured-articles.json';
const groups:Record<string,string[]>={
 roofing:['roofing','replacement','repair'],repair:['repair','roofing'],replacement:['replacement','roofing'],
 materials:['roofing','metal','gaf'],metal:['metal','roofing'],gaf:['gaf','roofing'],certification:['gaf','roofing'],
 'roofing-local':['roofing','replacement','repair'],'roof-cost':['cost','replacement','repair'],calculator:['cost','replacement'],
 'commercial-storm':['storm','hail','wind'],storm:['storm','hail','wind'],hail:['hail','storm'],wind:['wind','storm'],claims:['claims','storm'],
 siding:['siding','storm'], 'siding-cost':['siding','storm'],'siding-replacement':['siding','storm'],'siding-types':['siding','storm'],
 'commercial-siding':['siding','storm'],gutters:['gutters','guards','ice'],'gutter-cost':['gutters','guards'],
 'gutter-guards':['guards','gutters'],guards:['guards','gutters'],seamless:['gutters','guards'],'seamless-gutters':['gutters','guards'],
 commercial:['storm','roofing'],'commercial-repair':['storm','repair'],'commercial-replacement':['replacement','roofing'],
 'commercial-types':['roofing','metal'],'commercial-gutters':['gutters','guards'],
 insulation:['ice','winter'],'attic-insulation':['ice','winter'],'ice-dam':['ice','winter'],ice:['ice','winter'],
};
export function featuredArticles(family:string,city?:string,path=''){
 const isLocal=family==='local';
 const topics=groups[family]||(/ice-dam/.test(path)?['ice','winter']:[]);
 const ranked=articles.map((article,index)=>({article,index,score:isLocal?
   (article.city===city?100:article.city?0:30)+(article.topics.includes('siding')?8:article.topics.includes('storm')?6:article.topics.includes('roofing')?4:0):
   Math.max(0,...article.topics.map(t=>topics.includes(t)?30-topics.indexOf(t)*5:0))
 })).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index);
 const selected=ranked.slice(0,4).map(x=>x.article);
 if(isLocal){
  const pool=ranked.filter(x=>!x.article.city||x.article.city===city);
  const distinct:typeof selected=[];
  for(const topic of ['roofing','siding','storm','gutters']){
   const choice=pool.find(x=>x.article.topics.includes(topic)&&!distinct.includes(x.article));
   if(choice)distinct.push(choice.article);
  }
  for(const x of pool)if(distinct.length<4&&!distinct.includes(x.article))distinct.push(x.article);
  selected.splice(0,selected.length,...distinct.slice(0,4));
 }
 return {items:selected,title:isLocal?`Home exterior guides for ${city} homeowners`:
   `${/siding/.test(family)?'Siding and storm damage':/gutter/.test(family)?'Gutter and drainage':/ice|insulation/.test(family)||/ice-dam/.test(path)?'Ice dam and winter roofing':/storm|hail|wind|claims/.test(family)?'Storm damage':'Roofing'} articles`,
   description:isLocal?'Explore roofing, storm preparation and exterior maintenance advice before planning your project.':'Explore advice from the Roof King blog to help plan your project and understand related repairs.'};
}
