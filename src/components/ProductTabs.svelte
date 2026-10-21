<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  let { tabs, children }: {tabs:{id:string;label:string}[];children?:Snippet}=$props();
  let root:HTMLDivElement;
  let enhanced=$state(false);
  let selected=$state('');
  function select(id:string,focus=false) {
    selected=id;
    for(const panel of root.querySelectorAll<HTMLElement>('[data-product-panel]')) {
      panel.hidden=panel.id!==id;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby','tab-'+panel.id);
      panel.tabIndex=0;
    }
    if(focus)root.querySelector<HTMLElement>('#tab-'+id)?.focus();
  }
  function keyboard(event:KeyboardEvent,index:number) {
    const direction=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:direction?(index+direction+tabs.length)%tabs.length:-1;
    if(next>=0){event.preventDefault();select(tabs[next].id,true);}
  }
  onMount(()=>{enhanced=true;const hash=location.hash.slice(1);select(tabs.some(t=>t.id===hash)?hash:tabs[0].id);});
</script>
<div class="rk-product-tabs" bind:this={root}>
  <div class="rk-product-tab-nav" role={enhanced?'tablist':undefined} aria-label="Product information">
    {#each tabs as tab,index}
      <a title={tab.label} href={`#${tab.id}`} id={`tab-${tab.id}`} role={enhanced?'tab':undefined} aria-controls={enhanced?tab.id:undefined} aria-selected={enhanced?selected===tab.id:undefined} tabindex={enhanced&&selected!==tab.id?-1:0} onclick={event=>{if(enhanced){event.preventDefault();select(tab.id);}}} onkeydown={event=>{if(enhanced)keyboard(event,index);}}>{tab.label}</a>
    {/each}
  </div>
  {@render children?.()}
</div>
