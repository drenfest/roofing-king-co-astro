import reviews from './featured-reviews.json' with {type:'json'};

/** Match the work described by the customer, never an unrelated keyword or generic praise. */
export function reviewIdsForService(family:string):string[]{
 if(family==='local')return reviews.items.slice(0,3).map(review=>review.id);
 const topic=/^siding|commercial-siding/.test(family)?'siding':/^commercial/.test(family)?'commercial':
  /^deck/.test(family)?'decking':/^guards|gutter-guards/.test(family)?'guards':/^gutter|seamless/.test(family)?'gutters':
  family==='storm'?'storm':['hail','wind','claims'].includes(family)?family:
  /roof|repair|replacement|materials|gaf|certification|calculator/.test(family)?'roofing':family;
 return reviews.items.filter(review=>review.services.includes(topic)).sort((a,b)=>Number(b.services.includes(family))-Number(a.services.includes(family))).slice(0,3).map(review=>review.id);
}
