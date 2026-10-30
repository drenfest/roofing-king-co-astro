<script lang="ts">
 import {onMount} from 'svelte';
 import ProductSpecFilters from './ProductSpecFilters.svelte';
 import type {ProductComparisonModel} from '../data/product-comparison-types';
 import {matchesSpecifications,specificationDiffers} from '../data/product-filtering';
 let {model}:{model:ProductComparisonModel}=$props();
 let enhanced=$state(false);
 let selected=$state<Record<string,string>>({});
 function startingSelection(){return [...model.initialIds];}
 let chosenIds=$state<string[]>(startingSelection());
 let limit=$state(6);
 let differencesOnly=$state(false);
 let matches=$derived(model.alternatives.filter(p=>matchesSpecifications(p,selected)));
 let chosen=$derived(matches.filter(p=>chosenIds.includes(p.id)));
 let columns=$derived([model.current,...chosen]);
 let fields=$derived(model.fields.filter(field=>!differencesOnly||specificationDiffers(columns,field.key)));
 onMount(()=>{enhanced=true;});
 function filter(next:Record<string,string>){
  selected=next;limit=6;
  const candidates=model.alternatives.filter(p=>matchesSpecifications(p,next));
  const retained=chosenIds.filter(id=>candidates.some(p=>p.id===id));
  chosenIds=retained.length?retained:candidates.slice(0,3).map(p=>p.id);
 }
 function toggle(id:string){chosenIds=chosenIds.includes(id)?chosenIds.filter(item=>item!==id):chosenIds.length<3?[...chosenIds,id]:chosenIds;}
</script>
<section id="product-comparison" class="rk-product-comparison" data-component="ProductComparison" data-comparison-product={model.current.id} aria-labelledby="product-comparison-title">
 <div class="rk-section-inner">
  <header class="rk-product-comparison-heading"><div><p class="rk-home-eyebrow">Compare the specifications</p><h2 id="product-comparison-title">Compare {model.groupLabel} from other brands</h2></div><p>See how {model.current.title} compares with other brands in our catalog. Filter the listed specifications, then choose up to three alternatives to compare side by side.</p></header>
  <ProductSpecFilters filters={model.filters} {selected} id="comparison-filter" {enhanced} onchange={filter}/>
  <div class="rk-comparison-results-heading"><p role="status" aria-live="polite">{matches.length} {matches.length===1?'alternative':'alternatives'} from other brands · {chosen.length} of 3 selected</p>{#if enhanced}<button type="button" class="rk-spec-reset" onclick={()=>chosenIds=[]}>Clear selection</button>{/if}</div>
  {#if matches.length}<div class="rk-comparison-candidates">{#each matches.slice(0,limit) as candidate}<article class:rk-comparison-candidate-selected={chosenIds.includes(candidate.id)} data-comparison-candidate={candidate.id}>
   <a class="rk-comparison-candidate-image" href={candidate.href} title={`View ${candidate.title}`}><img src={candidate.image.src} srcset={candidate.image.srcset} sizes="(max-width: 600px) calc(100vw - 4.5rem), (max-width: 900px) 40vw, 360px" width={candidate.image.width} height={candidate.image.height} alt={candidate.image.alt} loading="lazy" decoding="async"/></a>
   <p class="rk-home-eyebrow">{candidate.brand}</p><h3><a href={candidate.href} title={`View ${candidate.title}`}>{candidate.title}<span aria-hidden="true">↗</span></a></h3>
   <p class="rk-comparison-candidate-spec">{candidate.specs.material?.value||candidate.specs.impact?.value||candidate.specs.profile?.value||candidate.specs.application?.value}</p>
   {#if enhanced}<label class="rk-comparison-pick"><input type="checkbox" checked={chosenIds.includes(candidate.id)} disabled={!chosenIds.includes(candidate.id)&&chosenIds.length>=3} onchange={()=>toggle(candidate.id)} aria-label={`Compare ${candidate.title}`}/>Compare</label>{/if}
  </article>{/each}</div>{:else}<div class="rk-spec-empty"><h3>No alternatives match these specifications</h3><p>Clear a filter to broaden the comparison. Your starting product stays below.</p><button type="button" class="rk-button rk-button-secondary" onclick={()=>filter({})}>Clear filters</button></div>{/if}
  {#if enhanced&&matches.length>limit}<button type="button" class="rk-spec-load-more" onclick={()=>limit+=6}>Show more alternatives ({matches.length-limit})</button>{/if}
  <div class="rk-comparison-table-heading"><h3>Your specification comparison</h3>{#if enhanced}<label><input type="checkbox" bind:checked={differencesOnly}/>Show only differences</label>{/if}</div>
  <!-- Focusable overflow region is required for keyboard scrolling of wide specification tables. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="rk-product-comparison-scroll" role="region" aria-label="Product specification comparison table" tabindex="0">
   <table><caption>{model.current.title} and selected {model.groupLabel}</caption><thead><tr><th scope="col">Specification</th>{#each columns as product}<th scope="col" class:rk-comparison-current={product.id===model.current.id} data-comparison-column={product.id}>
    <span class="rk-comparison-column-kind">{product.id===model.current.id?'Your starting product':product.brand}</span><img src={product.image.src} srcset={product.image.srcset} sizes="150px" width={product.image.width} height={product.image.height} alt={product.image.alt} loading="lazy" decoding="async"/><a href={product.href} title={`View ${product.title}`}>{product.title}</a><span class="rk-comparison-column-brand">{product.brand}</span>
   </th>{/each}</tr></thead><tbody>{#each fields as field}<tr><th scope="row">{field.label}</th>{#each columns as product}<td class:rk-comparison-current={product.id===model.current.id}>{#if product.specs[field.key]}{@const spec=product.specs[field.key]}<span>{spec.value}</span>{#if spec.note}<small>{spec.note}</small>{/if}<a class="rk-comparison-source" href={spec.sourceUrl} title={`${product.title}: ${field.label} manufacturer source`} target="_blank" rel="noopener noreferrer">Source <span aria-hidden="true">↗</span></a>{:else}<span class="rk-spec-unlisted">Not listed in this record</span>{/if}</td>{/each}</tr>{/each}</tbody></table>
  </div>
  <p class="rk-comparison-note">“Show only differences” compares standardized ratings and inch dimensions while preserving the manufacturer wording in the full table. Test classifications and warranty promises describe different things. Warranty durations are published coverage terms, not estimates of service life; initial non-prorated periods, installation requirements and package labels matter. An unpublished value is not a failed test. Thickness alone does not measure strength across different materials. Color references reflect this catalog, with availability depending on the selected profile and region.</p>
 </div>
</section>
