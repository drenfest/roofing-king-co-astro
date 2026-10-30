<script lang="ts">
 import {onMount} from 'svelte';
 import ProductSpecFilters from './ProductSpecFilters.svelte';
 import type {CatalogFilterModel} from '../data/product-comparison-types';
 import {matchingCatalogIds} from '../data/product-filtering';
 let {model,id}:{model:CatalogFilterModel;id:string}=$props();
 let root:HTMLDivElement;
 let enhanced=$state(false);
 let selected=$state<Record<string,string>>({});
 let matching=$derived(matchingCatalogIds(model,selected));
 onMount(()=>{enhanced=true;return()=>{root.closest('[data-component="ProductGrid"]')?.querySelectorAll<HTMLElement>('.rk-product-card[data-product],.rk-product-earlier').forEach(card=>card.hidden=false);};});
 $effect(()=>{
  if(!enhanced||!root)return;
  const ids=new Set(matching),section=root.closest('[data-component="ProductGrid"]');
  section?.querySelectorAll<HTMLElement>('.rk-product-card[data-product]').forEach(card=>card.hidden=!ids.has(card.dataset.product||''));
  const earlier=section?.querySelector<HTMLElement>('.rk-product-earlier');if(earlier)earlier.hidden=Object.values(selected).some(Boolean);
 });
</script>
<div class="rk-catalog-filters" data-catalog-filters bind:this={root}>
 <ProductSpecFilters filters={model.filters} {selected} {id} {enhanced} onchange={next=>selected=next}/>
 <p class="rk-spec-result-count" role="status" aria-live="polite">{matching.length} of {model.entries.length} products{Object.values(selected).some(Boolean)?' match your specifications':''}</p>
 {#if enhanced&&!matching.length}<div class="rk-spec-empty"><h3>No products match these specifications</h3><p>Try fewer filters to see more of this collection.</p><button type="button" class="rk-button rk-button-secondary" onclick={()=>selected={}}>Clear filters</button></div>{/if}
</div>
