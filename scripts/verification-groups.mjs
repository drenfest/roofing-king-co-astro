export const verificationGroups = [
 {id:'foundation',name:'Source & types',checks:['check:release-tools','check:contexts','check']},
 {id:'build',name:'Build site',checks:['build']},
 {id:'routes-contact',name:'Routes & contact',checks:['check:routes','check:homepage','check:html-attributes','check:internal-links','check:context-output']},
 {id:'services',name:'Services & locations',checks:['check:services','check:copy-corrections','check:siding-review','check:service-copy','check:service-reviews','check:locations','check:comparisons','check:articles','check:warranty','check:offers']},
 {id:'products',name:'Products & comparisons',checks:['check:products','check:manufacturer-products','check:product-comparisons','check:product-systems','check:ply-gem','check:commercial-products']},
 {id:'photography',name:'Photography & galleries',checks:['check:heroes','check:service-photos','check:photography','check:gallery']},
 {id:'blog',name:'Blog & navigation',checks:['check:blog-hubs','check:blog-urls','check:native-articles']},
 {id:'seo',name:'Schema & sitemap',checks:['check:schema','check:sitemap']},
];
export function validateGroups(checks){
 const assigned=verificationGroups.flatMap(g=>g.checks);
 if(assigned.length!==new Set(assigned).size||assigned.length!==checks.length||checks.some(c=>!assigned.includes(c)))throw Error('Every verification check must belong to exactly one named flow. Update verification-groups.mjs with verify:steps.');
}
export function failureExcerpt(output){
 const lines=output.replace(/\u001b\[[0-9;]*m/g,'').split(/\r?\n/);
 let at=lines.findIndex(l=>/AssertionError|(?:^|\s)Error:|error ts\(|SyntaxError|TypeError|ERR_ASSERTION/.test(l));
 if(at<0)at=Math.max(0,lines.length-12);
 return lines.slice(Math.max(0,at-2),at+18).join('\n').trim().slice(0,2600);
}
