<script lang="ts">
  import pictures from '../data/navigation-images.json';
  import {fade} from 'svelte/transition';
  let displayed=$state<typeof pictures.home|null>(null);
  let {item,onNavigate}:{item:{label:string;href:string};onNavigate:()=>void}=$props();
  const image=$derived.by(()=>{
    const path=item.href.toLowerCase();
    const key=path.includes('commercial')?'commercial':path.includes('storm')||path.includes('hail')||path.includes('wind-damage')?'storm':path.includes('siding')||path.includes('variform')||path.includes('hardie')||path.includes('smartside')?'siding':path.includes('gutter')?'gutters':path.includes('window')?'windows':path.includes('deck')||path.includes('trex')?'decks':path.includes('insulation')?'insulation':'home';
    return (pictures as Record<string,typeof pictures.home>)[item.href]||pictures[key];
  });
  $effect(()=>{
    const next=image;
    let cancelled=false;
    const preload=new Image();
    preload.sizes='(max-width: 1060px) 90vw, (max-width: 1240px) 180px, 300px';
    preload.srcset=next.srcset;preload.src=next.src;
    preload.decode().then(()=>{if(!cancelled)displayed=next;}).catch(()=>{if(!cancelled)displayed=next;});
    return ()=>{cancelled=true;};
  });
  function fadeDuration(){return matchMedia('(prefers-reduced-motion: reduce)').matches?0:200;}
</script>

<a class="rk-menu-preview" href={item.href} onclick={onNavigate} data-menu-image-path={item.href}>
  <div class="rk-menu-preview-photo">
    {#if displayed}{#key displayed.src}<img src={displayed.src} srcset={displayed.srcset} sizes="(max-width: 1060px) 90vw, (max-width: 1240px) 180px, 300px" width={displayed.width} height={displayed.height} alt="" decoding="async" in:fade={{duration:fadeDuration()}} out:fade={{duration:fadeDuration()}} />{/key}{/if}
    {#if displayed?.illustrative}<span class="rk-menu-preview-credit">Illustrative image</span>{/if}
  </div>
  <span class="rk-menu-preview-caption"><span>{item.label}</span><span aria-hidden="true">↗</span></span>
</a>
