<script lang="ts">
  import { onMount } from 'svelte';
  import QuoteForm from './QuoteForm.svelte';
  let { modalDescription = 'Tell us about your roofing or exterior project, or book an inspection with our team.', showRating = true }: {modalDescription?:string;showRating?:boolean} = $props();
  let dialog: HTMLDialogElement;
  let trigger: HTMLElement | null = null;
  function close() { dialog.close(); }
  function restore() { document.body.classList.remove('rk-modal-open'); trigger?.focus(); }
  onMount(() => {
    const open = (event: MouseEvent) => {
      const target = (event.target as Element).closest<HTMLElement>('[data-quote-open]');
      if (!target) return;
      event.preventDefault(); trigger = target; dialog.showModal(); document.body.classList.add('rk-modal-open');
    };
    document.addEventListener('click', open);
    return () => { document.removeEventListener('click', open); document.body.classList.remove('rk-modal-open'); };
  });
</script>
<div id="quote-form"><QuoteForm id="homepage-quote" /></div>
<dialog class="rk-native-quote-dialog" bind:this={dialog} aria-labelledby="quote-dialog-title" onclose={restore} onclick={event => { if (event.target === dialog) close(); }}>
  <div class="rk-modal-panel">
    <button class="rk-modal-close" type="button" aria-label="Close quote form" onclick={close}>×</button>
    <div class="rk-modal-intro"><p class="rk-home-eyebrow">Roof King &amp; Restoration</p><h2 id="quote-dialog-title">Get a free quote</h2><p>{modalDescription}</p>{#if showRating}<div class="rk-review-summary" aria-label="Google rating 4.8 out of 5 from 292 reviews"><span class="rk-google-mark" aria-hidden="true">G</span><span class="rk-stars" aria-hidden="true">★★★★★</span><span>4.8 out of 5</span><span>292 Google reviews</span></div>{/if}</div>
    <QuoteForm id="modal-quote" compact />
  </div>
</dialog>
