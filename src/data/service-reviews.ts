import reviews from './featured-reviews.json' with {type:'json'};

import {isExternalReviewSource} from './review-source-policy.ts';
const externalReviews=reviews.items.filter(review=>isExternalReviewSource(review.source));

/** Prefer recent exact-service feedback. Keep a clearly labeled company-review fallback. */
export function reviewSelectionForService(family:string){
 const topic=family==='commercial-gutters'?'commercial-gutters':family==='commercial-siding'?'commercial-siding':/^siding/.test(family)?'siding':/^commercial/.test(family)?'commercial':
  /^deck/.test(family)?'decking':/^guards|gutter-guards/.test(family)?'guards':/^gutter|seamless/.test(family)?'gutters':
  ['ice','ice-dam'].includes(family)?'ice':['hail','wind','claims','storm','metal','repair','replacement'].includes(family)?family:
  /roof|repair|replacement|materials|gaf|certification|calculator/.test(family)?'roofing':family;
 const newest=(items:typeof reviews.items)=>[...items].sort((a,b)=>('publishedOn' in b?b.publishedOn||'':'').localeCompare('publishedOn' in a?a.publishedOn||'':''));
 const exact=newest(externalReviews.filter(review=>review.services.includes(topic)));
 const related=topic==='commercial-siding'?'siding':topic==='commercial-gutters'||topic==='guards'?'gutters':topic==='commercial'||topic==='metal'?'roofing':topic==='hail'?'storm':undefined;
 const pool=exact.length?exact:related?newest(externalReviews.filter(review=>review.services.includes(related))):[];
 const selected=(pool.length?pool:newest(externalReviews)).slice(0,3);
 return {ids:selected.map(review=>review.id),exact:exact.length>0,topic};
}
export function reviewIdsForService(family:string):string[]{return reviewSelectionForService(family).ids;}

