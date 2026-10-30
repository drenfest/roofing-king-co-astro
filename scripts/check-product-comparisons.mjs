import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {createServer} from 'vite';
import {load} from 'cheerio';
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try{
 const {comparisonEntries:entries,productComparison,catalogFilters}=await server.ssrLoadModule('/src/data/product-comparison.ts');
 const {matchesSpecifications,matchingCatalogIds,specificationDiffers,standardizedSpecification}=await server.ssrLoadModule('/src/data/product-filtering.ts');
 assert.equal(entries.length,96);let charts=0,cells=0,maxBytes=0,maxGzip=0;const unpublished=new Set();
 for(const p of entries){
  const model=productComparison(p.id),$=load(await fs.readFile('dist'+p.href+'index.html','utf8'));
  assert.equal($('#product-comparison').length,model?1:0,p.id);
  if(!model)continue;charts++;
  if(p.group==='shingles'){
   assert.ok(!model.fields.some(f=>f.key==='warranty'),'No mixed-benefit warranty row');
   for(const key of ['defect-warranty','wind-warranty','algae-warranty']){
    assert.ok(model.fields.some(f=>f.key===key));assert.match(p.specs[key].value,/years|lifetime|Not included/i);assert.ok(p.specs[key].note);
   }
   assert.ok(!model.filters.some(f=>f.key==='warranty'||f.key==='limited-wind-coverage'));
  }
  assert.ok(model.alternatives.every(a=>a.brand!==p.brand&&a.group===p.group));
  assert.equal(model.initialIds.length,Math.min(3,model.alternatives.length));
  assert.ok(model.initialIds.every(id=>model.alternatives.some(a=>a.id===id)));
  const body=JSON.stringify(model);maxBytes=Math.max(maxBytes,Buffer.byteLength(body));maxGzip=Math.max(maxGzip,gzipSync(body).length);
  for(const product of [p,...model.alternatives])for(const field of model.fields){
   const spec=product.specs[field.key];assert.ok(spec?.value.trim(),product.id+'/'+field.key);assert.match(spec.sourceUrl,/^https:\/\//);assert.doesNotMatch(spec.value,/^(?:N\/A|TBD|Unknown|Not listed in this record|—|-)?$/i);
   if(/^Not published/.test(spec.value))unpublished.add(product.id+'/'+field.key);cells++;
  }
  assert.equal($('#product-comparison tbody tr').length,model.fields.length);
  assert.equal($('#product-comparison tbody td').length,model.fields.length*(1+model.initialIds.length));
  assert.equal($('#product-comparison .rk-spec-unlisted').length,0,'No generic missing-data placeholders');
  assert.ok($('#product-comparison td a.rk-comparison-source').length);
  for(const f of model.filters)for(const option of f.options){const matches=model.alternatives.filter(a=>matchesSpecifications(a,{[f.key]:option}));assert.ok(matches.length>0);}
  for(const img of $('#product-comparison img').toArray()){assert.ok($(img).attr('alt'));assert.ok($(img).attr('width'));assert.equal($(img).attr('loading'),'lazy');}
  const graph=$('script[type="application/ld+json"]').toArray().flatMap(e=>{const s=JSON.parse($(e).text());return s['@graph']||[s];});assert.ok(graph.some(n=>n['@type']==='Table'));assert.ok(graph.some(n=>n['@type']==='Product'));
 }
 assert.equal(charts,72);assert.deepEqual([...unpublished],['norandex-home-accents/thickness']);
 assert.ok(maxBytes<80000);assert.ok(maxGzip<14000);
 const find=id=>entries.find(p=>p.id===id);
 assert.equal(specificationDiffers([find('timberline-hdz'),find('iko-cambridge')],'impact'),false,'Equivalent Class 3 ratings hide despite different explanations');
 assert.equal(specificationDiffers([find('timberline-hdz'),find('timberline-as-ii')],'impact'),true);
 assert.equal(specificationDiffers([find('iko-armourshake'),find('timberline-as-ii')],'impact'),true,'Conditional Class 3/4 remains distinct from Class 4');
 assert.equal(standardizedSpecification('wind','ASTM D3161 Class F / ASTM D7158 Class H'),standardizedSpecification('wind','ASTM D7158 Class H: 150 mph; ASTM D3161 Class F: 110 mph'));
 assert.equal(standardizedSpecification('exposure','5 5/8 inches'),standardizedSpecification('exposure','5⅝"'));
 assert.equal(standardizedSpecification('dimensions','13 1/4" x 39 3/8"'),standardizedSpecification('dimensions','13¼ × 39⅜ inches'));
 assert.equal(standardizedSpecification('thickness','0.046 in.'),standardizedSpecification('thickness','.046"'));
 assert.equal(specificationDiffers([{specs:{warranty:{value:'Limited lifetime',note:'Initial 10 years',sourceUrl:'https://example.com'}}},{specs:{warranty:{value:'Limited lifetime',note:'Initial 15 years',sourceUrl:'https://example.com'}}}],'warranty'),true,'Different benefit conditions remain visible');
 assert.match(find('iko-cambridge').specs['defect-warranty'].value,/first 10 years/);assert.match(find('iko-dynasty').specs['defect-warranty'].value,/first 15 years/);
 assert.match(find('owens-trudefinition-duration').specs['wind-warranty'].value,/160 mph/);assert.match(find('owens-oakridge').specs['wind-warranty'].value,/110.*130/);
 assert.match(find('royal-sovereign').specs['defect-warranty'].value,/25 years/);assert.match(find('royal-sovereign').specs['wind-warranty'].value,/5 years/);
 assert.equal(find('plygem-performance-board-batten').group,'vertical');assert.equal(find('hardie-hardie-shingle-siding').group,'shake');
 assert.ok(!matchesSpecifications(find('iko-armourshake'),{impact:'Class 4'}),'Package-dependent class is not an unconditional Class 4 claim');
 assert.ok(matchesSpecifications(find('norandex-great-barrier'),{thickness:'0.046 in.'}));
 const shingles=catalogFilters(entries.filter(p=>p.group==='shingles').map(p=>p.id));
 assert.equal(matchingCatalogIds(shingles,{brand:'IKO',material:'Vinyl'}).length,0);assert.equal(matchingCatalogIds(shingles,{}).length,24);
 assert.ok(matchingCatalogIds(shingles,{brand:'Owens Corning',impact:'Class 4'}).length>0);
 const gaf=load(await fs.readFile('dist/roofing/gaf/types/index.html','utf8'));assert.equal(gaf('[data-component="ProductGrid"] .rk-product-card[data-product]').length,11);assert.equal(gaf('[data-legacy-product]').length,2);assert.equal(gaf('[data-catalog-filters]').length,1);assert.equal(gaf('h2').toArray().filter(h=>gaf(h).text()==='Compare GAF Roofing Shingles').length,0);
 console.log(JSON.stringify({products:entries.length,comparisonPages:charts,validatedSourceCells:cells,maxModelBytes:maxBytes,maxGzipBytes:maxGzip,unpublished:[...unpublished]},null,2));
}finally{await server.close();}

