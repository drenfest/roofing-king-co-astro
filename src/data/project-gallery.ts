import library from './project-gallery.json';
import {photo,media} from './media';

const categories:Record<string,{title:string;description:string}>= {
  roofing:{title:'Roofing, from preparation to the finished roof',description:'Explore roof shapes, shingles, flashing and the layers beneath the finished roof covering.'},
  metal:{title:'Metal roof profiles, colors and details',description:'See standing seams, formed panels and the ridges and valleys that shape a metal roof.'},
  'commercial-roofing':{title:'Commercial roof surfaces and details',description:'Low-slope membranes, rooftop equipment, parapets and multi-family rooflines from our existing photo library.'},
  siding:{title:'Siding profiles, trim and exterior finishes',description:'See how horizontal siding, trim, windows and adjoining rooflines come together on an exterior.'},
  gutters:{title:'Gutters, downspouts and roof-edge details',description:'Explore the gutter runs, eave connections and downspouts visible in these exterior views.'},
  windows:{title:'Windows within the exterior',description:'Window placement, white frames and trim across a front elevation.'},
  decks:{title:'Deck boards, railings and outdoor space',description:'A closer look at wood decking, white railings and a finished seating area.'},
  insulation:{title:'Attic insulation between the joists',description:'See how insulation sits within the attic framing in this service photograph.'},
  'storm-damage':{title:'Roof exposure and repair details',description:'Weather at the roof surface, installation preparation and the roof details inspected when planning repairs.'},
  painting:{title:'Paint and exterior finish details',description:'Supplied reference photography showing paint and adjoining siding and trim.'},
  all:{title:'Roofing, siding and exterior details',description:'Explore the materials, installation details and finished exteriors in our photo library.'}
};

export function galleryTopic(family:string){
  if(family==='painting')return 'painting';
  if(family==='commercial-siding'||family.startsWith('siding'))return 'siding';
  if(/gutter|seamless|guards/.test(family))return 'gutters';
  if(family==='commercial-storm')return 'commercial-roofing';
  if(family.startsWith('commercial'))return 'commercial-roofing';
  if(family.startsWith('deck'))return 'decks';
  if(family==='windows'||family==='insulation')return family;
  if(['storm','hail','wind','claims'].includes(family))return 'storm-damage';
  if(family==='metal')return 'metal';
  if(family==='local'||family==='all')return 'all';
  return 'roofing';
}

export function galleryFor(family='all'){
  const topic=galleryTopic(family);
  let items=library.items.filter(item=>topic==='all'||item.tags.includes(topic));
  if(family==='local')items=items.filter(item=>item.kind!=='company'&&item.kind!=='other');
  if(['gaf','certification','gaf-catalog'].includes(family))items=items.filter(item=>!item.tags.includes('metal'));
  return {eyebrow:topic==='all'?library.eyebrow:(topic==='metal'?'Metal roofing':library.filters.find(f=>f.value===topic)?.label)+' photo gallery',...categories[topic],filters:topic==='all'?library.filters.filter(f=>family!=='local'||!['company','other-references'].includes(f.value)):[{label:topic==='metal'?'Metal roofing':library.filters.find(f=>f.value===topic)?.label||topic,value:topic}],items:items.map(item=>{
    const responsive=photo(item);const variants=media[item.src].variants;
    const largest=variants.at(-1)!;
    return {alt:item.alt,width:responsive.width,height:responsive.height,thumbnail:responsive.thumbnail,srcset:responsive.srcset,src:largest.src,displayWidth:largest.width,displayHeight:Math.round(largest.width*media[item.src].height/media[item.src].width),category:item.category,caption:item.caption,tags:item.tags,kind:item.kind,sourceLabel:item.sourceLabel,contain:'contain' in item?item.contain:false,context:('context' in item?item.context:undefined) as Record<string,{caption:string}>|undefined};
  }),topic,fullGalleryHref:topic==='all'?'/#projects':`/#projects-${topic==='metal'?'roofing':topic}`};
}
