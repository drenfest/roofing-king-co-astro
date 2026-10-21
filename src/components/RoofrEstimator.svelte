<script lang="ts">
  import { onMount } from 'svelte';
  import roofr from '../data/roofr.json';
  let active = $state(false);
  let enhanced = $state(false);
  onMount(() => { enhanced = true; });
</script>

<section class="roofr-estimator" id="roofr-estimator" aria-labelledby="roofr-estimator-title">
  <h2 id="roofr-estimator-title">Get your instant roof estimate</h2>
  <p>Answer a few questions about your property in Roof King's Roofr estimator. Your result is an estimated price range. A roof inspection identifies the materials, tear-off, decking repairs and installation needed for your written estimate.</p>
  {#if active}
    <iframe src={roofr.estimatorUrl} title="Roof King instant roof estimate" width="800" height="700" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    <p>If the estimator does not load, <a title="Open the roofing estimator in a new tab" href={roofr.estimatorUrl} target="_blank" rel="noopener noreferrer">open it in a new tab</a>.</p>
  {:else}
    <p>The estimator is provided by Roofr and loads when you choose to start.</p>
    <button class="rk-button rk-button-primary" type="button" disabled={!enhanced} onclick={() => active = true}>Start my roof estimate</button>
    <p><a title="Open the roofing estimator in a new tab" href={roofr.estimatorUrl} target="_blank" rel="noopener noreferrer">Open the estimator in a new tab</a></p>
  {/if}
</section>

<style>
  .roofr-estimator { width: min(100% - 2rem, 1000px); margin: 3rem auto; padding: clamp(1rem, 3vw, 2rem); background: #fffaf0; border: 1px solid #d9d1c4; border-top: 4px solid #fe6600; border-radius: 18px 4px 18px 4px; }
  h2 { margin-top: 0; color: #242321; font-size: clamp(1.6rem, 4vw, 2.4rem); line-height: 1.15; }
  p { color: #34312d; }
  iframe { display: block; width: 100%; height: min(80dvh, 850px); min-height: 600px; margin-top: 1.5rem; border: 0; background: white; }
  button:disabled { opacity: .6; }
  button:focus-visible, a:focus-visible { outline: 3px solid #b44500; outline-offset: 4px; }
  @media (max-width: 600px) { iframe { min-height: 700px; } }
</style>
