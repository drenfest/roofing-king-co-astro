import editorial from './service-editorial.json';
import {hero} from './home.json';
import type {RichNode} from './section-types';
type Item={question:string;answer:RichNode[]};
type Group={id:string;label:string;title:string;description:string;items:Item[];links:{label:string;href:string}[]};
const sources=editorial as unknown as Record<string,{faq:{items:Item[]}}>;
function pick(path:string,question:string,label?:string):Item{
 const item=sources[path]?.faq.items.find(item=>item.question===question);
 if(!item)throw new Error(`FAQ source question missing: ${path} ${question}`);
 return {...item,question:label||item.question};
}
const paragraph=(text:string):RichNode=>({tag:'p',children:[{text}]});
const link=(text:string,href:string):RichNode=>({tag:'a',href,children:[{text}]});
export const faqGroups:Group[]=[
 {id:'faq-getting-started',label:'Inspections & getting started',title:'Inspections and getting started',description:'Where we work, what we do and how to prepare for your first conversation.',items:[
  {question:'Which areas does Roof King serve?',answer:[{tag:'p',children:[{text:'Roof King is based in Columbus and serves communities across Ohio, including the Columbus, Cleveland, Dayton, Cincinnati and Mansfield areas. Explore our '},link('service areas','/service-areas/'),{text:' or call to discuss your property location.'}]}]},
  {question:'What services can I contact Roof King about?',answer:[paragraph('We offer residential and commercial roofing, storm damage restoration, siding, gutters, windows, decks and attic insulation. Tell us about each affected area so we can discuss the work and any connections between the repairs.')]},
  {question:'What should I have ready for an inspection?',answer:[paragraph('Have the property address, a description of the issue, when you first noticed it and any previous repair information ready. Existing photos of leaks or damage can help explain what has changed. Describe what you can see from a safe location; you do not need to climb onto the roof to prepare.')]},
  {question:'How do I book an inspection?',answer:[{tag:'p',children:[{text:'Use our '},link('online booking calendar',hero.bookingUrl),{text:' to choose a time, or '},link('contact our team','/contact-us/'),{text:' to discuss your property and the work you are considering.'}]}]}
 ],links:[{label:'Contact Roof King',href:'/contact-us/'},{label:'View service areas',href:'/service-areas/'}]},
 {id:'faq-roofing',label:'Roof repairs & replacement',title:'Roof repairs and replacement',description:'Understand the assessment, repair options and the work involved in a new roof.',items:[
  pick('/roofing/repair/','What if water is coming in now?'),
  pick('/roofing/repair/','Can only part of the roof be repaired?'),
  pick('/roofing/replacement/','Can a new roof be installed over the old one?'),
  pick('/roofing/replacement/','How long will the work take?','How long does a roof replacement take?')
 ],links:[{label:'Roof repair services',href:'/roofing/repair/'},{label:'Roof replacement',href:'/roofing/replacement/'}]},
 {id:'faq-storm-damage',label:'Storm damage & insurance',title:'Storm damage and insurance documentation',description:'What to report after a storm, temporary protection and how repair estimates relate to coverage.',items:[
  pick('/storm-damage/','What if I cannot see damage from the ground?'),
  pick('/storm-damage/','Does temporary protection finish the job?'),
  pick('/storm-damage/','Can roofing and siding damage be addressed together?'),
  pick('/storm-damage/insurance-claims/','Can Roof King guarantee my roof will be covered?')
 ],links:[{label:'Storm damage services',href:'/storm-damage/'},{label:'Insurance documentation',href:'/storm-damage/insurance-claims/'}]},
 {id:'faq-siding',label:'Siding & wall repairs',title:'Siding replacement and wall repairs',description:'Partial repairs, wall leaks and the details that belong in a siding estimate.',items:[
  pick('/siding/','Is a full replacement needed for one damaged area?'),
  pick('/siding/','Does new siding fix every wall leak?'),
  pick('/siding/','What should the estimate contain?','What should a siding estimate contain?'),
  pick('/siding/replacement/','Will new siding improve insulation?')
 ],links:[{label:'Siding services',href:'/siding/'},{label:'Siding replacement',href:'/siding/replacement/'}]},
 {id:'faq-gutters',label:'Gutters & gutter guards',title:'Gutters, downspouts and gutter guards',description:'Overflow, damaged sections and what gutter protection can and cannot do.',items:[
  pick('/gutters/','Can one damaged section be replaced?','Can one damaged gutter section be replaced?'),
  pick('/gutters/','Do larger gutters automatically fix overflow?'),
  pick('/gutters/','Are gutters with guards maintenance-free?'),
  pick('/gutters/guards/','Can guards be installed on my existing gutters?')
 ],links:[{label:'Gutter services',href:'/gutters/'},{label:'Gutter guards',href:'/gutters/guards/'}]},
 {id:'faq-other-exteriors',label:'Windows, decks & insulation',title:'Windows, decks and attic insulation',description:'Planning improvements while accounting for the materials already in your home.',items:[
  pick('/windows/','Can I replace windows in stages?'),
  pick('/decks/','Can new boards go over old framing?','Can new deck boards go over old framing?'),
  pick('/attic-insulation/','Can insulation be added over existing material?')
 ],links:[{label:'Windows',href:'/windows/'},{label:'Decks',href:'/decks/'},{label:'Attic insulation',href:'/attic-insulation/'}]},
 {id:'faq-estimates',label:'Estimates, costs & coverage',title:'Estimates, costs and warranty documents',description:'Compare the actual work and keep the product and workmanship coverage clear.',items:[
  pick('/cost-of-a-new-roof/','Why do two estimates differ?','Why can two roofing estimates differ?'),
  pick('/cost-of-a-new-roof/','Does insurance determine the construction price?'),
  pick('/cost-of-a-new-roof/','Is a monthly payment the project cost?'),
  pick('/roofing/repair/','Will a repair have a warranty?'),
  pick('/roofing/replacement/','What warranty documents should I keep?')
 ],links:[{label:'Roof cost considerations',href:'/cost-of-a-new-roof/'},{label:'Written workmanship coverage',href:'/offers/5-year-workmanship-warranty/'}]}
];
