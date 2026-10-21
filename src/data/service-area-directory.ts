import coverage from './coverage-map.json';
import editorial from './service-editorial.json';
import manifest from '../../migration/route-manifest.json';

export type LocationServiceLink={href:string;label:string;children:LocationServiceLink[]};
const pages=editorial as Record<string,{breadcrumbs:{label:string;href?:string}[]}>;
const labels:Record<string,string>={
 '/roofing-contractor-dublin-oh/':'Roofing', '/roof-repair-dublin-oh/':'Roof repair',
 '/emergency-roof-repair-dublin-oh/':'Emergency roof repair', '/roof-replacement-dublin-oh/':'Roof replacement',
 '/gaf-roofing-dublin-oh/':'GAF roofing', '/metal-roofing-dublin-oh/':'Metal roofing',
 '/hail-damage-roof-repair-dublin-oh/':'Hail damage repair', '/storm-damage-roof-repair-dublin-oh/':'Storm damage repair',
 '/gutter-installation-dublin-oh/':'Gutter installation'
};
export const serviceAreaDirectory=coverage.areas.map(area=>{
 const hasHub=area.href!=='/service-areas/' && manifest.routes.some(route=>route.path===area.href);
 const paths=hasHub?manifest.routes.map(route=>route.path).filter(path=>
  path!==area.href && (path.startsWith(area.href)||(area.id==='dublin' && path in labels))
 ):[];
 function branch(parent:string):LocationServiceLink[]{
  return paths.filter(path=>{
   const ancestors=paths.filter(candidate=>candidate!==path && path.startsWith(candidate));
   const nearest=ancestors.sort((a,b)=>b.length-a.length)[0]??area.href;
   return nearest===parent;
  }).map(href=>({href,label:labels[href]??pages[href]?.breadcrumbs.at(-1)?.label??href.split('/').filter(Boolean).at(-1)!.replaceAll('-',' '),children:branch(href)}));
 }
 return {...area,hasHub,services:hasHub?branch(area.href):[]};
});
