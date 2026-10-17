import fs from 'node:fs/promises';
import { parse } from 'yaml';
import * as cheerio from 'cheerio';
const inventory=JSON.parse(await fs.readFile('migration/url-inventory.json','utf8'));
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8'));
const seen=new Set();const failures=[];
for(const record of manifest.routes){
 if(seen.has(record.path))failures.push('Duplicate path '+record.path);seen.add(record.path);
 const raw=await fs.readFile(record.file,'utf8');
 const match=raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!match)throw Error('Invalid frontmatter '+record.file);
 const data=parse(match[1]),content=match[2];
 if(data.permalink!==record.path)failures.push('Permalink mismatch '+record.path);
 if(!data.title||!content.trim())failures.push('Empty content '+record.path);
 const $=cheerio.load(content);if($('h1').length!==1)failures.push('Expected one H1 '+record.path);
 if($('form,script,iframe').length)failures.push('Unreviewed active embed '+record.path);
 if(/https?:\/\/(localhost|127\.0\.0\.1)/i.test(content))failures.push('Source host leaked '+record.path);
 if(!manifest.routes.some(r=>r.path===data.canonicalPath))failures.push('Unknown canonical '+record.path);
}
for(const record of inventory.rows)if(!seen.has(record.path))failures.push('Missing protected path '+record.path);
if(failures.length)throw Error(failures.join('\n'));
console.log(`Validated ${seen.size} preserved paths and their imported content.`);
