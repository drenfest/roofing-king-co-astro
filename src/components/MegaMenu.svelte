<script lang="ts">
  import {tick} from 'svelte';
  type Item={label:string;href:string;children:Item[]};
  let {root,onNavigate}:{root:Item;onNavigate:()=>void}=$props();
  let first=$state(0);
  let second=$state(-1);
  let thirdIndex=$state(-1);
  let trail=$state<number[]>([]);
  const branch=$derived(root.children[first]);
  const third=$derived(branch?.children[second]);
  const fourthRoot=$derived(third?.children[thirdIndex]);
  const fourth=$derived.by(()=>{let item=fourthRoot;for(const index of trail)item=item?.children[index];return item?.children.length?item:undefined;});
  const columns=$derived([{parent:root,items:root.children},...(branch?.children.length?[{parent:branch,items:branch.children}]:[]),...(third?.children.length?[{parent:third,items:third.children}]:[]),...(fourth?[{parent:fourth,items:fourth.children}]:[])]);
  function choose(level:number,index:number){
    if(level===0){if(first!==index){first=index;second=-1;thirdIndex=-1;trail=[];}}
    else if(level===1){if(second!==index){second=index;thirdIndex=-1;trail=[];}}
    else if(level===2){if(thirdIndex!==index){thirdIndex=index;trail=[];}}
    else if(fourth?.children[index].children.length)trail=[...trail,index];
  }
  async function key(event:KeyboardEvent,level:number,index:number){
    const target=event.currentTarget as HTMLElement;
    const panel=target.closest('.rk-mega-columns')!;
    if(event.key==='ArrowRight'){
      event.preventDefault();choose(level,index);await tick();
      const next=panel.querySelectorAll<HTMLElement>('.rk-mega-column')[Math.min(level+1,3)];
      next?.querySelector<HTMLAnchorElement>('.rk-mega-row>a')?.focus();
    }else if(event.key==='ArrowLeft' && level>0){
      event.preventDefault();if(level===3&&trail.length){trail=trail.slice(0,-1);await tick();panel.querySelectorAll('.rk-mega-column')[3]?.querySelector<HTMLAnchorElement>('.rk-mega-row>a')?.focus();}
      else panel.querySelectorAll('.rk-mega-column')[level-1]?.querySelector<HTMLAnchorElement>('.rk-mega-row.is-selected>a')?.focus();
    }else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
      event.preventDefault();const links=[...target.closest('.rk-mega-column')!.querySelectorAll<HTMLAnchorElement>('.rk-mega-row>a')];
      const position=event.key==='Home'?0:event.key==='End'?links.length-1:(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;
      links[position]?.focus();
    }
  }
</script>

<div class="rk-mega-intro"><span>{root.label}</span><a href={root.href} onclick={onNavigate}>Explore all {root.label.toLowerCase()} <span aria-hidden="true">↗</span></a></div>
<div class="rk-mega-columns">
  {#each columns as column,level}
    <section class="rk-mega-column" aria-label={`${column.parent.label} choices`}>
      <div class="rk-mega-heading">
        {#if level===3&&trail.length}<button type="button" class="rk-mega-back" onclick={()=>trail=trail.slice(0,-1)} aria-label="Back to previous menu level">← Back</button>{/if}
        <a href={column.parent.href} onclick={onNavigate}>{column.parent.label} <span aria-hidden="true">↗</span></a>
      </div>
      <ul>{#each column.items as item,index}
        <li>
          <div class="rk-mega-row" class:is-selected={level===0?first===index:level===1?second===index:level===2?thirdIndex===index:false}>
            <a href={item.href} onclick={onNavigate} onpointerenter={event=>{if(event.pointerType==='mouse'&&level<3)choose(level,index);}} onkeydown={event=>key(event,level,index)}>{item.label}</a>
            {#if item.children.length}<button type="button" aria-label={`Show ${item.label} options`} aria-expanded={level===0?first===index:level===1?second===index:level===2?thirdIndex===index:false} onpointerenter={event=>{if(event.pointerType==='mouse'&&level<3)choose(level,index);}} onclick={()=>choose(level,index)} onkeydown={event=>key(event,level,index)}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>{/if}
          </div>
        </li>
      {/each}</ul>
    </section>
  {/each}
  {#if columns.length<4}<aside class="rk-mega-overview" style={`grid-column:span ${4-columns.length}`}><span>Explore</span><strong>{branch?.label || root.label}</strong><a href={branch?.href || root.href} onclick={onNavigate}>View {(branch?.label || root.label).toLowerCase()} <span aria-hidden="true">↗</span></a></aside>{/if}
</div>
