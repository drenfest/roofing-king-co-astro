<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProductPresentation } from '../data/product-types';
  let { product, title }: {product:ProductPresentation;title:string} = $props();
  let selected = $state<string | undefined>();
  let enhanced = $state(false);
  let failed = $state(false);
  let color = $derived(product.colors.find(item=>item.id===selected) || product.colors.find(item=>item.id===product.defaultColorId) || product.colors[0]);
  function choose(event:MouseEvent, id:string) {
    if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    event.preventDefault();selected=id;failed=false;
  }
  onMount(()=>{enhanced=true;});
</script>

<div class="rk-product-options" data-product-options={product.id}>
  <figure class="rk-product-photo">
    {#key color.id}
      <img src={color.image.src} srcset={color.image.srcset} sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 30vw" width={color.image.width} height={color.image.height} alt={`${title} in ${color.name}`} loading="lazy" decoding="async" onerror={()=>{failed=true;}} />
    {/key}
    {#if failed}<p class="rk-product-image-error" role="status">This image could not load. <a href={color.image.src}>Open the color sample</a>.</p>{/if}
    <figcaption class="rk-product-badges" aria-label={`${title} performance at a glance`}>
      {#each product.badges as badge}
        <span class="rk-product-badge"><span>{badge.label}</span><strong>{badge.value}</strong></span>
      {/each}
    </figcaption>
  </figure>
  <div class="rk-product-color-caption" aria-live="polite"><span>Shown in</span> <strong>{color.name}</strong></div>
  <div class="rk-product-swatches" role="group" aria-label={`${title} colors`}>
    {#each product.colors as option (option.id)}
      <a href={option.image.src} role={enhanced?'button':undefined} aria-pressed={enhanced?color.id===option.id:undefined} aria-label={`${title}: ${option.name}`} title={option.name} class:is-selected={color.id===option.id} onclick={event=>choose(event,option.id)} onkeydown={event=>{if(event.key===' '&&enhanced){event.preventDefault();selected=option.id;failed=false;}}}>
        <img src={option.swatch} alt="" width="80" height="64" loading="lazy" decoding="async" />
        <span class="rk-product-swatch-check" aria-hidden="true">✓</span>
      </a>
    {/each}
  </div>
</div>
