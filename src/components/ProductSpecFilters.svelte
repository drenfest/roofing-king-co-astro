<script lang="ts">
 import type {SpecificationFilter} from '../data/product-comparison-types';
 let {filters,selected,onchange,id,enhanced=false}:{filters:SpecificationFilter[];selected:Record<string,string>;onchange:(next:Record<string,string>)=>void;id:string;enhanced?:boolean}=$props();
</script>
{#snippet control(filter:SpecificationFilter)}
 <label for={`${id}-${filter.key}`}><span>{filter.label}</span><select id={`${id}-${filter.key}`} aria-label={filter.label} value={selected[filter.key]||''} onchange={event=>onchange({...selected,[filter.key]:event.currentTarget.value})}><option value="">All {filter.label.toLowerCase()}</option>{#each filter.options as option}<option value={option}>{option}</option>{/each}</select></label>
{/snippet}
<div class="rk-spec-filter-controls" hidden={!enhanced}>
 <div class="rk-spec-filter-primary">{#each filters.slice(0,3) as filter}{@render control(filter)}{/each}<button type="button" class="rk-spec-reset" onclick={()=>onchange({})}>Reset filters</button></div>
 {#if filters.length>3}<details class="rk-spec-more"><summary>More specifications <span aria-hidden="true">+</span></summary><div class="rk-spec-filter-grid">{#each filters.slice(3) as filter}{@render control(filter)}{/each}</div></details>{/if}
</div>
