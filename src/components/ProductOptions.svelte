<script lang="ts">
  import { onMount } from 'svelte';
  import { explainProductBadge } from '../data/product-explanations';
  import type { ProductPresentation } from '../data/product-types';
  import ProductColorPreview from './ProductColorPreview.svelte';
  let { product, title,detail=false }: {product:ProductPresentation;title:string;detail?:boolean} = $props();
  let selected = $state<string | undefined>();
  let enhanced = $state(false);
  let failed = $state(false);
  let color = $derived(product.colors.find(item=>item.id===selected) || product.colors.find(item=>item.id===product.defaultColorId) || product.colors[0]);
  let sizes=$derived(detail?'(max-width:700px) 90vw, 45vw':'(max-width:640px) 90vw, (max-width:1000px) 45vw, 30vw');
  function choose(event:MouseEvent, id:string) {
    if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    event.preventDefault();selected=id;failed=false;
  }
  onMount(()=>{enhanced=true;});
</script>

<div class="rk-product-options" data-product-options={product.id}>
  <figure class="rk-product-photo">
    {#key product.previewMode==='palette'?product.id:color.id}
      {#if product.colorPreview?.mode==='mask'}<ProductColorPreview {product} {sizes} colorName={color.name} color={color.swatchColor||'#ffffff'}/>{:else}<img src={color.image.src} srcset={color.image.srcset} style:background-color={product.colorPreview?.mode==='alpha'?color.swatchColor:undefined} {sizes} width={color.image.width} height={color.image.height} alt={product.colorPreview?`${title} color preview in ${color.name}`:product.previewMode==='palette'?(product.previewAlt||`${title} manufacturer product photograph`):product.brand?`${title} — ${color.name} manufacturer sample`:`${title} in ${color.name}`} loading="lazy" decoding="async" onerror={()=>{failed=true;}} />{/if}
    {/key}
    {#if failed}<p class="rk-product-image-error" role="status">This image could not load. <a title={`Open ${title} in ${color.name}`} href={color.image.src}>Open the color sample</a>.</p>{/if}
    <figcaption class="rk-product-badges" aria-label={`${title} performance at a glance`}>
      {#each product.badges as badge}
        {@const explanation = product.badgeExplanations?.[badge.label]||explainProductBadge(badge)}
        <details class="rk-product-badge-disclosure" name={`product-badge-${product.id}`} data-kind={badge.label.toLowerCase()}>
          <summary class="rk-product-badge" aria-label={`Explain ${badge.label}: ${badge.value}`}>
            <svg class="rk-product-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              {#if badge.label==='Wind'}
                <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2 2 0 1 0-2-2M4 16h9a3 3 0 1 1-3 3"/>
              {:else if badge.label==='Fire'}
                <path d="M13 2c1 6-5 6-3 11 2-1 3-3 3-5 4 3 6 6 5 9a6 6 0 0 1-12-1c0-4 3-7 7-14Z"/>
              {:else if badge.label==='Impact'}
                <path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m9 12 2 2 4-5"/>
              {:else if badge.label==='Material'}
                <path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>
              {:else if badge.label==='Profile'||badge.label==='Surface'}
                <path d="M3 4h18v16H3zM3 9h18M3 14h18"/>
              {:else if badge.label==='Finish'}
                <path d="M4 3h13v6H4zM17 6h3v7h-9v8M8 17h6v4H8z"/>
              {:else if badge.label==='Colors'}
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
              {:else if badge.label==='Warranty'||badge.label==='Residential warranty'}
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
  {#if product.optionLabel!=='Product view' || product.colors.length>1}<div class="rk-product-color-caption" aria-live="polite">{#if color.swatchColor}<span class="rk-selected-color-reference" style:background-color={color.swatchColor} aria-hidden="true"></span>{/if}<span>{product.colorPreview?'Shown in':product.previewMode==='palette'?'Selected color reference':product.optionLabel?'Selected '+product.optionLabel.toLowerCase():'Shown in'}</span> <strong>{color.name}</strong></div>{/if}
  {#if product.colorPreview?.caption}<p class="rk-product-reference-note">{product.colorPreview.caption}</p>{:else if !product.colorPreview&&product.previewMode==='palette'}<p class="rk-product-reference-note">The photo shows the product style. Swatches are manufacturer color references; confirm the finish with a physical sample.</p>{/if}
  {#if color.availabilityNote}<p class="rk-product-reference-note" aria-live="polite">{color.availabilityNote}</p>{/if}
  {#if product.colors.length>1}<div class="rk-product-swatches" role="group" aria-label={`${title} ${product.optionLabel?.toLowerCase()||'colors'}`}>
    {#each product.colors as option (option.id)}
      <a href={option.swatchColor?product.sourceUrl:option.image.src} role={enhanced?'button':undefined} aria-pressed={enhanced?color.id===option.id:undefined} aria-label={`${title}: ${option.name}`} title={option.name} class:is-selected={color.id===option.id} onclick={event=>choose(event,option.id)} onkeydown={event=>{if(event.key===' '&&enhanced){event.preventDefault();selected=option.id;failed=false;}}}>
        {#if option.swatchColor}<span class="rk-manufacturer-color-swatch" style:background-color={option.swatchColor} aria-hidden="true"></span>{:else}<img src={option.swatch} alt="" width="80" height="64" loading="lazy" decoding="async" />{/if}
        <span class="rk-product-swatch-check" aria-hidden="true">✓</span>
      </a>
    {/each}
  </div>{/if}
  {#if product.colorResources?.length}<div class="rk-product-color-resources">{#each product.colorResources as resource}<p>{resource.description} <a title={resource.label} href={resource.url} target="_blank" rel="noopener noreferrer">{resource.label} ↗</a></p>{/each}</div>{/if}
</div>

<style>
 .rk-manufacturer-color-swatch{box-sizing:border-box;display:block;width:100%;height:100%;border:1px solid rgb(36 35 33 / 12%);border-radius:2px;}
 .rk-selected-color-reference{display:inline-block;width:1.65rem;height:1.65rem;vertical-align:middle;margin-right:.4rem;border:1px solid var(--rk-line);}
 .rk-product-reference-note,.rk-product-color-resources{padding:0 1.5rem .75rem;margin:0;font-size:.8rem;line-height:1.6;color:var(--rk-muted);}
 .rk-product-color-resources p{margin-top:.8rem;}
</style>
