<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  let {children, total}:{children?:Snippet;total:number}=$props();
  let root:HTMLDivElement;
  let ready=$state(false);
  let selected=$state('all');
  let count=$state(total);
  const filters=[{id:'all',label:'All reviews'},{id:'roofing',label:'Roof installation & cleanup'},{id:'siding',label:'Siding'},{id:'gutters',label:'Gutters'},{id:'decking',label:'Decks'},{id:'ice',label:'Snow & ice'},{id:'communication',label:'Communication'},{id:'storm',label:'Storm & insurance'}];
  function filter(id:string){
    selected=id;count=0;
    for(const entry of root.querySelectorAll<HTMLElement>('[data-review-topics]')){
      entry.hidden=id!=='all'&&!entry.dataset.reviewTopics?.split(' ').includes(id);
      if(!entry.hidden)count++;
    }
  }
  onMount(()=>{ready=true;});
</script>
<div class="rk-review-collection" bind:this={root}>
  <div class="rk-review-filters" role="group" aria-label="Browse reviews by topic">
    {#each filters as option}<button type="button" disabled={!ready} aria-pressed={selected===option.id} onclick={()=>filter(option.id)}>{option.label}</button>{/each}
  </div>
  <p class="rk-review-result-count" aria-live="polite" aria-atomic="true">{count} selected customer {count===1?'review':'reviews'}{selected==='all'?'':` about ${filters.find(item=>item.id===selected)?.label.toLowerCase()}`}</p>
  <div class="rk-review-collection-grid">{@render children?.()}</div>
</div>
