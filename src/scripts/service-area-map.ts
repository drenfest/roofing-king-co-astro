import 'leaflet/dist/leaflet.css';
import '../styles/service-area-map.css';
import type { FeatureCollection, Geometry } from 'geojson';

type Area={id:string;name:string;href:string;center:[number,number];kind:'city'|'community'};

export async function initializeServiceAreaMap(root:HTMLElement){
  const [L,response]=await Promise.all([import('leaflet'),fetch('/maps/ohio-service-areas.geojson')]);
  if(!response.ok)throw new Error('Service-area map unavailable');
  const data=await response.json() as FeatureCollection<Geometry,Area>;
  const canvas=root.querySelector<HTMLElement>('[data-map-canvas]')!;
  const fallback=canvas.querySelector('svg');
  const interactive=document.createElement('div');
  interactive.className='rk-area-map-interactive';
  interactive.setAttribute('aria-label','Interactive Ohio map. Select a community below to zoom to its boundary.');
  canvas.append(interactive);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map=L.map(interactive,{scrollWheelZoom:false,dragging:!matchMedia('(pointer: coarse)').matches,zoomAnimation:!reduced,fadeAnimation:!reduced,minZoom:6,maxZoom:15,zoomSnap:.25,attributionControl:true});
  map.attributionControl.setPrefix(false);
  L.tileLayer(root.dataset.tileUrl!,{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',updateWhenIdle:true,keepBuffer:1}).addTo(map);
  const layers=new Map<string,import('leaflet').Layer>();
  const baseStyle={color:'#d95300',weight:1.8,opacity:1,fillColor:'#ff750c',fillOpacity:.16};
  const boundary=L.geoJSON(data,{
    style:()=>baseStyle,
    pointToLayer:(_feature,point)=>L.circleMarker(point,{...baseStyle,radius:6,fillOpacity:.8}),
    onEachFeature(feature,layer){
      const area=feature.properties as Area;
      layers.set(area.id,layer);
      layer.bindTooltip(area.name,{direction:'top',sticky:true});
      const popup=document.createElement('div');
      const title=document.createElement('strong');title.textContent=area.name;
      const description=document.createElement('p');description.textContent=area.kind==='city'?'City boundary':'Unincorporated community';
      const link=document.createElement('a');link.href=area.href;link.textContent=area.name==='Mansfield'?'Explore our service areas →':`${area.name} services →`;
      popup.append(title,description,link);layer.bindPopup(popup);
      layer.on('click',()=>selectArea(area.id,false));
      layer.on('mouseover',()=>{if(layer instanceof L.Path)layer.setStyle({weight:3,fillOpacity:.28});});
      layer.on('mouseout',()=>{if(layer instanceof L.Path)layer.setStyle(styleFor(area.id));});
    }
  }).addTo(map);
  const select=root.querySelector<HTMLSelectElement>('[data-map-select]')!;
  const status=root.querySelector<HTMLElement>('[data-map-status]')!;
  const cityLink=root.querySelector<HTMLAnchorElement>('[data-map-city-link]')!;
  const overview=boundary.getBounds().pad(.12);
  let selected='all';
  function styleFor(id:string){return {...baseStyle,...(selected===id?{weight:3,fillOpacity:.35}:{}),...(id==='lewis-center'?{fillOpacity:.8}:{})};}
  function selectArea(id:string,zoom=true){
    selected=id;select.value=id;
    for(const [key,layer] of layers)if(layer instanceof L.Path)layer.setStyle(styleFor(key));
    const feature=data.features.find(f=>f.properties.id===id);
    if(!feature){
      map.closePopup();map.fitBounds(overview,{animate:!reduced});
      status.textContent='24 city boundaries and Lewis Center. Select a community to explore.';
      cityLink.href='/service-areas/';cityLink.textContent='View all service areas →';return;
    }
    const area=feature.properties;const layer=layers.get(id)!;
    status.textContent=area.kind==='city'?`${area.name} city limits highlighted in orange.`:'Lewis Center is unincorporated and shown with a community marker.';
    cityLink.href=area.href;cityLink.textContent=area.name==='Mansfield'?'Explore our service areas →':`${area.name} services →`;
    if(zoom){
      if(layer instanceof L.Polygon)map.fitBounds(layer.getBounds(),{padding:[24,24],maxZoom:12,animate:!reduced});
      else map.setView(area.center,12,{animate:!reduced});
    }
  }
  select.addEventListener('change',()=>selectArea(select.value));
  root.querySelector('[data-map-reset]')!.addEventListener('click',()=>selectArea('all'));
  map.fitBounds(overview,{animate:false});
  fallback?.remove();
  root.querySelector<HTMLElement>('.rk-area-map-controls')!.hidden=false;
  root.dataset.mapReady='true';
  status.textContent='24 city boundaries and Lewis Center. Select a community to explore.';
  const resize=new ResizeObserver(()=>map.invalidateSize({pan:false}));resize.observe(canvas);
  window.addEventListener('pagehide',()=>{resize.disconnect();map.remove();},{once:true});
}
