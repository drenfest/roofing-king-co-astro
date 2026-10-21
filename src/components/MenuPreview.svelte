<script module lang="ts">
  let atlasReady:Promise<void>|undefined;
</script>
<script lang="ts">
  import atlas from '../data/navigation-atlas.json';
  import {fade} from 'svelte/transition';
  let {item,onNavigate}:{item:{label:string;href:string};onNavigate:()=>void}=$props();
  let loaded=$state(false);
  const image=$derived.by(()=>{
    const record=(atlas.items as Record<string,{column:number;row:number;illustrative:boolean}>)[item.href];
    if(!record)throw new Error('Missing menu atlas image: '+item.href);
    return record;
  });
  $effect(()=>{
    let cancelled=false;
    atlasReady??=(async()=>{const preload=new Image();preload.decoding='async';preload.src=atlas.src;await preload.decode();})();
    atlasReady.then(()=>{if(!cancelled)loaded=true;}).catch(()=>{atlasReady=undefined;});
    return ()=>{cancelled=true;};
  });
  function fadeDuration(){return matchMedia('(prefers-reduced-motion: reduce)').matches?0:180;}
</script>

<a class="rk-menu-preview" href={item.href} onclick={onNavigate} data-menu-image-path={item.href}>
  <div class="rk-menu-preview-photo" aria-busy={!loaded}>
    {#if loaded}{#key item.href}<div class="rk-menu-atlas-tile" aria-hidden="true" data-atlas-cell={`${image.column}-${image.row}`} style={`background-image:url(${atlas.src});background-size:${atlas.columns*100}% ${atlas.rows*100}%;background-position:${image.column/Math.max(1,atlas.columns-1)*100}% ${image.row/Math.max(1,atlas.rows-1)*100}%`} in:fade={{duration:fadeDuration()}} out:fade={{duration:fadeDuration()}}></div>{/key}{/if}
    {#if loaded&&image.illustrative}<span class="rk-menu-preview-credit">Illustrative image</span>{/if}
  </div>
  <span class="rk-menu-preview-caption"><span>{item.label}</span><span aria-hidden="true">↗</span></span>
</a>
