import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import sharp from 'sharp';
const urlMap=JSON.parse(await fs.readFile('src/data/blog-url-map.json','utf8'));
const base='src/content/pages/blog';
const files=(await fs.readdir(base,{recursive:true})).filter(f=>f.endsWith('index.md'));
const pages=await Promise.all(files.map(async f=>{const raw=await fs.readFile(path.join(base,f),'utf8');return {raw,data:YAML.parse(raw.split('---')[1])};}));
const summaries={
 'replacing-your-roof-in-columbus-why-hiring-experts-is-the-best-choice':['roofing','Replacement planning, installation quality and the roof details that protect a Columbus home.'],
 'replace-your-home-siding-in-columbus-with-expert-help':['siding','How siding replacement addresses worn panels, exterior protection and the appearance of your home.'],
 'the-importance-of-gutters-for-your-columbus-home':['gutters','How gutters and downspouts carry roof runoff away from siding, landscaping and the foundation.'],
 'the-5-step-roofing-process':['roofing','What happens during a roof replacement, from inspection and preparation to installation and cleanup.'],
 'should-i-go-with-gaf-shingles-for-my-roof-replacement':['roofing,gaf','An introduction to GAF shingle choices, installation and manufacturer warranty considerations.'],
 'how-to-know-if-you-need-a-roof-repair-or-roof-replacement':['roofing,repair,replacement','How roof age, recurring leaks and the extent of damage affect the repair-or-replace decision.'],
 'how-to-spot-roof-damage-this-storm-season':['roofing,storm','Signs of storm damage to shingles and roof details, and when to arrange an inspection.'],
 'post-storm-roof-inspection-checklist-what-to-do-before-calling-insurance':['storm,claims','What to document after a storm and how an inspection helps establish the condition of your roof.'],
 'why-gutter-guard-installation-in-columbus-oh-is-a-good-idea':['gutters,guards','How gutter guards help manage debris, with maintenance and drainage considerations for Columbus homes.'],
 'storm-ready-roofing-protecting-your-home-from-fall-winter-storms':['roofing,storm,winter','Roof maintenance and preparation for wind, precipitation and changing winter conditions.'],
 'from-hail-to-high-winds-how-to-spot-hidden-roof-damage-after-ohios-late-summer':['storm,hail,wind','Lifted shingles, granule loss and other damage to look for after hail and high winds.'],
 'columbus-roofs-face-wind-gusts-over-40-mph-during-fall-stormsenough-to-lift':['storm,wind','How strong winds affect shingles and exposed roof layers, with inspection considerations after a storm.'],
 'winter-roofing-services-in-columbus-oh-what-homeowners-should-know':['roofing,winter','How cold weather affects roof inspections, repairs and replacement planning in Columbus.'],
 'prevent-roof-damage-this-winter-with-ice-dam-removal-in-columbus-oh':['ice,winter','How ice dams affect roof drainage and why removal and attic conditions need careful attention.'],
 'best-roofing-contractors-dublin-oh-what-homeowners-should-know-before-hiring-a':['roofing','What Dublin homeowners should review when choosing a roofing contractor and discussing installation.'],
 'signs-you-need-roof-repair-in-dublin-oh':['roofing,repair','Leaks, missing shingles and other warning signs that a Dublin roof needs professional attention.'],
 'how-much-does-roof-repair-cost-in-dublin-oh':['repair,cost','The damage, materials and access conditions that influence a roof repair estimate in Dublin.'],
 'how-long-does-a-roof-last-in-dublin-oh':['roofing,metal','How roofing material, ventilation, weather exposure and maintenance affect roof service life.'],
 'how-much-does-a-roof-replacement-cost-in-dublin-oh':['replacement,cost','How roof size, pitch, materials, tear-off and decking repairs affect replacement pricing in Dublin.'],
};
await fs.mkdir('public/media/articles',{recursive:true});
const articles=[];
for(const [slug,[topics,description]] of Object.entries(summaries)){
 const matches=pages.filter(p=>p.data.category==='Article'&&p.data.permalink.endsWith('/'+slug+'/'));
 const page=matches.find(p=>!p.data.permalink.includes('/p.'))||matches[0];
 if(!page)throw Error('Missing article '+slug);
 const source=page.raw.match(/rk-blog-hero-image: url\('([^']+)/)?.[1]||page.raw.match(/<img[^>]+src="([^"]+)/)?.[1];
 if(!source?.startsWith('/media/'))throw Error('Missing article image '+slug);
 const input='public'+source, meta=await sharp(input).metadata();
 const widths=[400,720].filter(w=>w<=meta.width);if(!widths.length)widths.push(meta.width);
 const variants=[];
 for(const width of widths){const output=`/media/articles/${slug}-${width}.webp`;await sharp(input).rotate().resize({width,height:Math.round(width*2/3),fit:"cover",withoutEnlargement:true}).webp({quality:68}).toFile('public'+output);variants.push({src:output,width});}
 articles.push({href:urlMap[page.data.permalink]||page.data.permalink,title:page.data.title,description,topics:topics.split(','),city:/columbus/i.test(slug)?'Columbus':/dublin/i.test(slug)?'Dublin':null,image:{src:variants.at(-1).src,alt:page.data.title,width:variants.at(-1).width,height:Math.round(variants.at(-1).width*2/3),variants},sourceImage:source});
}
await fs.writeFile('src/data/featured-articles.json',JSON.stringify(articles,null,2)+'\n');
console.log(`${articles.length} existing articles indexed with optimized WebP thumbnails; no new articles or URLs created.`);
