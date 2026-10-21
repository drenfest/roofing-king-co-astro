<script lang="ts">
  import pictures from '../data/navigation-images.json';
  let {item,onNavigate}:{item:{label:string;href:string};onNavigate:()=>void}=$props();
  const image=$derived.by(()=>{
    const path=item.href.toLowerCase();
    const key=path.includes('commercial')?'commercial':path.includes('storm')||path.includes('hail')||path.includes('wind-damage')?'storm':path.includes('siding')||path.includes('variform')||path.includes('hardie')||path.includes('smartside')?'siding':path.includes('gutter')?'gutters':path.includes('window')?'windows':path.includes('deck')||path.includes('trex')?'decks':path.includes('insulation')?'insulation':'home';
    return (pictures as Record<string,typeof pictures.home>)[item.href]||pictures[key];
  });
</script>

<a class="rk-menu-preview" href={item.href} onclick={onNavigate} data-menu-image-path={item.href}>
  <div class="rk-menu-preview-photo">
    {#key image.src}<img src={image.src} srcset={image.srcset} sizes="(max-width: 1060px) 90vw, (max-width: 1240px) 45vw, 300px" width={image.width} height={image.height} alt="" decoding="async" />{/key}
    {#if image.illustrative}<span class="rk-menu-preview-credit">Illustrative image</span>{/if}
  </div>
  <span class="rk-menu-preview-caption"><span>{item.label}</span><span aria-hidden="true">↗</span></span>
</a>
