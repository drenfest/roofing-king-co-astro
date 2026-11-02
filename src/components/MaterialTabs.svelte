<script lang="ts">
  import {onMount, type Snippet} from 'svelte';
  let {id,tabs,children}:{id:string;tabs:{id:string;label:string;manufacturer:string}[];children?:Snippet}=$props();
  let root:HTMLDivElement;
  let enhanced=$state(false);
  let selected=$state(tabs[0]?.id);
  function select(value:string,focus=false){
    selected=value;
    for(const panel of root.querySelectorAll<HTMLElement>('[data-material-panel]')){
      panel.hidden=panel.id!==value;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby',`${panel.id}-tab`);
      panel.tabIndex=0;
    }
    if(focus)root.querySelector<HTMLElement>(`#${value}-tab`)?.focus();
  }
  function keyboard(event:KeyboardEvent,index:number){
    const delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:delta?(index+delta+tabs.length)%tabs.length:-1;
    if(next>=0){event.preventDefault();select(tabs[next].id,true);}
  }
  onMount(()=>{enhanced=true;select(tabs.some(t=>t.id===location.hash.slice(1))?location.hash.slice(1):selected);});
</script>
<div class="rk-material-tabs" bind:this={root}>
  <nav class="rk-material-tab-list" role={enhanced?'tablist':undefined} aria-label="Choose a material">
    {#each tabs as tab,index}
      <a href={`#${tab.id}`} id={`${tab.id}-tab`} title={`Explore ${tab.label}`} role={enhanced?'tab':undefined} aria-selected={enhanced?selected===tab.id:undefined} aria-controls={enhanced?tab.id:undefined} tabindex={enhanced&&selected!==tab.id?-1:0} class:is-selected={enhanced&&selected===tab.id} onclick={event=>{if(enhanced){event.preventDefault();select(tab.id);}}} onkeydown={event=>keyboard(event,index)}><strong>{tab.label}</strong><span>{tab.manufacturer}</span></a>
    {/each}
  </nav>
  {@render children?.()}
</div>
<style>
  .rk-material-tab-list{display:flex;overflow-x:auto;scrollbar-width:thin;border-bottom:1px solid #cfc5b6;margin:1.8rem 0 2rem;}
  .rk-material-tab-list a{flex:1 0 180px;display:flex;flex-direction:column;gap:.4rem;padding:1.2rem 1rem;color:#242321;text-decoration:none;border-bottom:3px solid transparent;}
  .rk-material-tab-list a.is-selected{background:#ece2d1;border-color:#c65005;}
  .rk-material-tab-list strong{font-size:.95rem;}.rk-material-tab-list span{font-size:.8rem;color:#655342;}
  .rk-material-tab-list a:hover{background:#f0e8db;}.rk-material-tab-list a:focus-visible{outline:2px solid #b44500;outline-offset:-4px;}
  .rk-material-tabs{min-width:0;max-width:100%;}
  @media(max-width:760px){
    .rk-material-tab-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));overflow:visible;margin:1.3rem 0 1.5rem;}
    .rk-material-tab-list a{min-width:0;min-height:72px;box-sizing:border-box;padding:.85rem .6rem;gap:.35rem;justify-content:center;overflow-wrap:anywhere;}
    .rk-material-tab-list strong{font-size:.84rem;line-height:1.3;}.rk-material-tab-list span{font-size:.7rem;line-height:1.4;}
  }
</style>
