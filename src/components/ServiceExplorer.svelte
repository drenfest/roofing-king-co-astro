<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  let { id, label, tabs, children }: {id:string;label:string;tabs:{id:string;label:string}[];children?:Snippet}=$props();
  let root:HTMLDivElement;
  let enhanced=$state(false);
  let desktop=$state(true);
  let selected=$state('');
  function select(value:string, focus=false){
    if(!tabs.some(tab=>tab.id===value))return;
    selected=value;
    for(const panel of root.querySelectorAll<HTMLElement>('[data-service-panel]')){
      panel.hidden=panel.id!==value;
      panel.setAttribute('role',desktop?'tabpanel':'region');
      panel.setAttribute('aria-labelledby',desktop?`${panel.id}-tab`:`${panel.id}-heading`);
      panel.tabIndex=0;
    }
    if(focus)root.querySelector<HTMLElement>(`#${value}-tab`)?.focus();
  }
  function keyboard(event:KeyboardEvent,index:number){
    const direction=event.key==='ArrowDown'?1:event.key==='ArrowUp'?-1:0;
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:direction?(index+direction+tabs.length)%tabs.length:-1;
    if(next>=0){event.preventDefault();select(tabs[next].id,true);}
  }
  onMount(()=>{
    const mq=matchMedia('(min-width:761px)');
    desktop=mq.matches;enhanced=true;
    const hash=location.hash.slice(1);
    select(tabs.some(tab=>tab.id===hash)?hash:tabs[0].id);
    const resize=()=>{desktop=mq.matches;select(selected);};
    const hashchange=()=>{const value=location.hash.slice(1);if(tabs.some(tab=>tab.id===value))select(value);};
    mq.addEventListener('change',resize);window.addEventListener('hashchange',hashchange);
    return()=>{mq.removeEventListener('change',resize);window.removeEventListener('hashchange',hashchange);};
  });
</script>

<div class="rk-service-explorer" class:is-enhanced={enhanced} bind:this={root} data-component="ServiceExplorer">
  <div class="rk-service-explorer-controls">
    <div class="rk-service-explorer-tabs" role={enhanced&&desktop?'tablist':undefined} aria-label={label} aria-orientation={enhanced&&desktop?'vertical':undefined}>
      {#each tabs as tab,index}
        <a id={`${tab.id}-tab`} href={`#${tab.id}`} role={enhanced&&desktop?'tab':undefined} aria-selected={enhanced&&desktop?selected===tab.id:undefined} aria-controls={enhanced&&desktop?tab.id:undefined} tabindex={enhanced&&selected!==tab.id?-1:0} onclick={event=>{if(enhanced){event.preventDefault();select(tab.id);}}} onkeydown={event=>{if(enhanced&&desktop)keyboard(event,index);}}>
          <span>{tab.label}</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>
        </a>
      {/each}
    </div>
    {#if enhanced}<div class="rk-service-explorer-mobile"><label for={`${id}-select`}>{label}</label><select id={`${id}-select`} value={selected} aria-controls={selected} onchange={event=>select(event.currentTarget.value)}>{#each tabs as tab}<option value={tab.id}>{tab.label}</option>{/each}</select></div>{/if}
  </div>
  <div class="rk-service-explorer-content">{@render children?.()}</div>
</div>
