<script lang="ts">
  import { onMount } from 'svelte';
  import { explainProductBadge } from '../data/product-explanations';
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
    {#if failed}<p class="rk-product-image-error" role="status">This image could not load. <a title={`Open ${title} in ${color.name}`} href={color.image.src}>Open the color sample</a>.</p>{/if}
    <figcaption class="rk-product-badges" aria-label={`${title} performance at a glance`}>
      {#each product.badges as badge}
        {@const explanation = explainProductBadge(badge)}
        <details class="rk-product-badge-disclosure" name={`product-badge-${product.id}`} data-kind={badge.label.toLowerCase()}>
          <summary class="rk-product-badge" aria-label={`Explain ${badge.label}: ${badge.value}`}>
            <svg class="rk-product-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              {#if badge.label==='Wind'}
                <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2 2 0 1 0-2-2M4 16h9a3 3 0 1 1-3 3"/>
              {:else if badge.label==='Fire'}
                <path d="M13 2c1 6-5 6-3 11 2-1 3-3 3-5 4 3 6 6 5 9a6 6 0 0 1-12-1c0-4 3-7 7-14Z"/>
              {:else if badge.label==='Impact'}
                <path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m9 12 2 2 4-5"/>
              {:else}
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              {/if}
            </svg>
            <span>{badge.label} <span aria-hidden="true">ⓘ</span></span><strong>{badge.value}</strong>{#if badge.detail}<small>{badge.detail}</small>{/if}
          </summary>
          <div class="rk-product-badge-explanation">
            <strong>{explanation.title}</strong><p>{explanation.body}</p>
            <p>{product.specs.find(spec=>spec.label===badge.specLabel)?.note}</p>
            <a title={`Source and test details for ${title}`} href={explanation.sourceUrl || product.sourceUrl} target="_blank" rel="noopener noreferrer">Source &amp; test details ↗</a>
            {#if enhanced}<button type="button" onclick={event=>event.currentTarget.closest('details')?.removeAttribute('open')}>Close explanation</button>{/if}
          </div>
        </details>
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
