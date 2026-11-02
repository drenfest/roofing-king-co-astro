<script lang="ts">
 import {onMount} from 'svelte';
 import type {ProductPresentation} from '../data/product-types';
 let {product,color,colorName,sizes}:{product:ProductPresentation;color:string;colorName:string;sizes:string}=$props();
 let preview=$derived(product.colorPreview!);
 let image=$derived(preview.image!);
 let channels=$derived(color.replace('#','').match(/.{2}/g)?.slice(0,3).map(c=>parseInt(c,16)/255)||[1,1,1]);
 let brightness=$derived(preview.brightness||1.5);
 const localId=$props.id();
 let id=$derived(`${product.id}-${localId}`);
 let ready=$state(false);
 onMount(()=>{ready=true;});
</script>
<div class="rk-color-house" data-color-house={product.id} data-preview-color={color}>
 <img src={image.src} srcset={image.srcset} {sizes} width={image.width} height={image.height} alt={`siding color preview in ${colorName} on a sample home`} loading="lazy" decoding="async"/>
 {#if ready}<svg viewBox={`0 0 ${image.width} ${image.height}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
  <defs>
   <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={image.width} height={image.height} style="mask-type:luminance"><image href={preview.mask} width={image.width} height={image.height}/></mask>
   <filter id={`${id}-color`} color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope={channels[0]*brightness}/><feFuncG type="linear" slope={channels[1]*brightness}/><feFuncB type="linear" slope={channels[2]*brightness}/></feComponentTransfer></filter>
  </defs>
  <image href={image.src} width={image.width} height={image.height} mask={`url(#${id}-mask)`} filter={`url(#${id}-color)`}/>
 </svg>{/if}
</div>
<style>
 .rk-color-house{position:relative;isolation:isolate;}
 .rk-color-house>img{display:block;width:100%;height:auto;max-height:none;aspect-ratio:4/3;object-fit:contain;}
 .rk-color-house>svg{display:block;width:100%;height:100%;}
 .rk-color-house>svg{position:absolute;inset:0;pointer-events:none;}
</style>
