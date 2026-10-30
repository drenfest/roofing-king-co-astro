<script lang="ts">
  import { onMount } from 'svelte';
  import ContactActions from './ContactActions.svelte';
  import contact from '../data/project-contact.json';
  // Keep caller props compatible while the submission form is replaced by available contact paths.
  let { showInlineForm = true, inlineHeading = true }: {modalDescription?:string;showRating?:boolean;showInlineForm?:boolean;inlineHeading?:boolean} = $props();
  let dialog: HTMLDialogElement;
  let trigger: HTMLElement | null = null;
  function close() { dialog.close(); }
  function restore() {
    document.body.classList.remove('rk-modal-open');
    // The mobile-menu quote link becomes hidden when its menu closes.
    const visible=trigger?.getClientRects().length&&getComputedStyle(trigger).visibility==='visible'&&!trigger.closest('[inert]');
    const target=visible?trigger:document.querySelector<HTMLButtonElement>('.rk-nav-toggle');
    target?.focus();
  }
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
{#if showInlineForm}<div id="quote-form"><ContactActions showIntro={inlineHeading}/></div>{/if}
<dialog class="rk-native-quote-dialog" bind:this={dialog} aria-labelledby="quote-dialog-title" onclose={restore} onclick={event => { if (event.target === dialog) close(); }}>
  <div class="rk-modal-panel">
    <button class="rk-modal-close" type="button" aria-label="Close project contact options" onclick={close}>×</button>
    <div class="rk-modal-intro"><p class="rk-home-eyebrow">Roof King &amp; Restoration</p><h2 id="quote-dialog-title">{contact.title}</h2><p>{contact.description}</p></div>
    <ContactActions showIntro={false}/>
  </div>
</dialog>
