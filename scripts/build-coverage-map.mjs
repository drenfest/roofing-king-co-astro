import fs from 'node:fs';
const base='https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer';
const names=['Akron','Athens','Aurora','Beavercreek','Centerville','Cincinnati','Cleveland','Columbus','Dayton','Delaware','Dublin','Gahanna','Grove City','Hamilton','Hilliard','Lancaster','Mansfield','Middletown','Newark','Powell','Upper Arlington','Westerville','Worthington','Zanesville'];
const slug=n=>n.toLowerCase().replaceAll(' ','-');
async function query(layer,where,offset){const url=base+`/${layer}/query?`+new URLSearchParams({where,outFields:'GEOID,BASENAME,CENTLAT,CENTLON',returnGeometry:'true',outSR:'4326',maxAllowableOffset:String(offset),geometryPrecision:'5',f:'geojson'});const d=await(await fetch(url)).json();if(!d.features)throw Error(JSON.stringify(d));return d;}
const where=`STATE='39' AND BASENAME IN (${names.map(n=>`'${n}'`).join(',')})`;
const full=await query(28,where,.0006);if(full.features.length!==24)throw Error('Expected 24 city boundaries');
for(const f of full.features){const p=f.properties;f.properties={id:slug(p.BASENAME),name:p.BASENAME,href:p.BASENAME==='Mansfield'?'/service-areas/':`/${slug(p.BASENAME)}-oh/`,center:[+p.CENTLAT,+p.CENTLON],kind:'city'};}
full.features.push({type:'Feature',properties:{id:'lewis-center',name:'Lewis Center',href:'/lewis-center-oh/',center:[40.1983958,-83.0101843],kind:'community'},geometry:{type:'Point',coordinates:[-83.0101843,40.1983958]}});
full.features.sort((a,b)=>a.properties.name.localeCompare(b.properties.name));
fs.mkdirSync('public/maps',{recursive:true});fs.writeFileSync('public/maps/ohio-service-areas.geojson',JSON.stringify(full));
const simplified=await query(28,where,.003);const state=await query(80,"STATE='39'",.003);
const project=([lon,lat])=>[+(40+(lon+84.85)*126).toFixed(1),+(535-(lat-38.3)*143).toFixed(1)];
const path=g=>{const polygons=g.type==='Polygon'?[g.coordinates]:g.coordinates;return polygons.flatMap(p=>p.map(r=>r.map((c,i)=>(i?'L':'M')+project(c).join(',')).join('')+'Z')).join('');};
const overview={state:path(state.features[0].geometry),cities:simplified.features.map(f=>({id:slug(f.properties.BASENAME),path:path(f.geometry)})),areas:full.features.map(f=>({...f.properties,point:project(f.geometry.type==='Point'?f.geometry.coordinates:[f.properties.center[1],f.properties.center[0]])})),tileUrl:'https://tile.openstreetmap.org/{z}/{x}/{y}.png'};
fs.writeFileSync('src/data/coverage-map.json',JSON.stringify(overview,null,2)+'\n');
fs.writeFileSync('migration/coverage-map-sources.json',JSON.stringify({checked:'2026-10-21',citySource:base+'/28',stateSource:base+'/80',vintage:'January 1, 2026',cityGeometryToleranceDegrees:.0006,overviewGeometryToleranceDegrees:.003,inventory:'23 cities with existing location pages plus Mansfield named in homepage coverage; Lewis Center is an unincorporated community marked as a point, not an invented city polygon.',lewisCenterSource:'https://www.openstreetmap.org/node/153841272',lewisCenterStatusSource:'https://co.delaware.oh.us/wp-content/uploads/2023/05/vacate-portion-of-Third-Street-Twp-Rd-in-unincorporated-Village-of-Lewis-in-Orange-Twp.pdf',tilePolicy:'https://operations.osmfoundation.org/policies/tiles/',features:full.features.map(f=>f.properties),geojsonBytes:fs.statSync('public/maps/ohio-service-areas.geojson').size},null,2)+'\n');
console.log('Wrote map geometry:',fs.statSync('public/maps/ohio-service-areas.geojson').size,'bytes');
