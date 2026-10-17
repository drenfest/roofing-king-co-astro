<script lang="ts">
  import { onMount } from 'svelte';
  import QuoteForm from './QuoteForm.svelte';
  let { modalTitle = 'Flexible 3-Year Financing for Your Home Projects', modalDescription = 'Take advantage of 3-year financing in Columbus for roofing, windows, and more. Affordable monthly payments make your dream project a reality.' }: {modalTitle?:string;modalDescription?:string} = $props();
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
    <div class="rk-modal-intro"><h2 id="quote-dialog-title">{modalTitle}</h2><p>{modalDescription}</p><div class="rk-review-summary" aria-label="Google rating 4.8 out of 5 from 292 reviews"><span class="rk-google-mark" aria-hidden="true">G</span><span class="rk-stars" aria-hidden="true">★★★★★</span><span>4.8 out of 5</span><span>292 Google Reviews</span></div></div>
    <QuoteForm id="modal-quote" />
  </div>
</dialog>
