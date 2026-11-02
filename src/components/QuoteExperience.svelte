<script lang="ts">
  import { onMount } from 'svelte';
  import QuoteForm from './QuoteForm.svelte';
  import contact from '../data/project-contact.json';
  // Preview fields are shared by inline and dialog layouts; delivery is not configured.
  let { showInlineForm = true, inlineHeading = true, inlineActions = true }: {modalDescription?:string;showRating?:boolean;showInlineForm?:boolean;inlineHeading?:boolean;inlineActions?:boolean} = $props();
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
{#if showInlineForm}<div id="quote-form" class="rk-quote-card">{#if inlineHeading}<h3>{contact.title}</h3><p>{contact.description}</p>{/if}<p class="rk-quote-card-label">Your project</p><h3 class="rk-quote-card-title">Tell us what you have in mind</h3><QuoteForm id="inline-quote" showActions={inlineActions}/></div>{/if}
<dialog class="rk-native-quote-dialog" bind:this={dialog} aria-labelledby="quote-dialog-title" onclose={restore} onclick={event => { if (event.target === dialog) close(); }}>
  <div class="rk-modal-panel">
    <button class="rk-modal-close" type="button" aria-label="Close quote form" onclick={close}>×</button>
    <div class="rk-modal-intro"><p class="rk-home-eyebrow">Roof King &amp; Restoration</p><h2 id="quote-dialog-title">Get a free quote</h2><p>{contact.description}</p></div>
    <div><QuoteForm id="modal-quote" compact/></div>
  </div>
</dialog>

<style>
 .rk-quote-card{min-width:0;padding:clamp(1.25rem,3vw,2rem);background:#fcfaf5;color:#242321;border-top:3px solid #fe6600;border-radius:3px;}
 :global(body .rk-home-final-cta #quote-form .rk-quote-card-label){margin:0 0 .5rem;color:#ad4300;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;}
 :global(body .rk-home-final-cta #quote-form .rk-quote-card-title){margin:0 0 1.25rem;color:#242321;font-size:clamp(1.25rem,2vw,1.55rem);line-height:1.25;}
 :global(body .rk-home-final-cta #quote-form .rk-quote-form){padding:0;clip-path:none;border:0;border-radius:0;background:transparent;box-shadow:none;}
 :global(body .rk-quote-card .rk-quote-form label){font-weight:500;color:#34312d;}
 :global(body .rk-quote-card .rk-quote-form :is(input,select,textarea)){border-radius:2px;background:#fff;font-size:.88rem;}
 :global(body .rk-home-final-cta #quote-form .rk-form-grid){gap:1rem;margin-bottom:1rem;}
 :global(body .rk-home-final-cta #quote-form .rk-form-grid label){margin:0;gap:.4rem;}
 :global(body .rk-home-final-cta #quote-form .rk-quote-form label > span){line-height:1.45;}
 :global(body .rk-home-final-cta #quote-form .rk-quote-form textarea){min-height:88px;height:88px;}
 :global(body .rk-quote-card .rk-contact-actions){padding:1.25rem 0 0;border:0;border-top:1px solid #d9d1c4;margin-top:1.25rem;background:transparent;}
 :global(body .rk-landing-estimate .rk-quote-strip-inner){align-items:center;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(2rem,5vw,4.5rem);}
 :global(body .rk-landing-estimate .rk-estimate-contact){display:flex;align-items:center;flex-wrap:wrap;gap:1.5rem;margin-top:1.75rem;}
 @media(max-width:800px){:global(body .rk-landing-estimate .rk-quote-strip-inner){grid-template-columns:minmax(0,1fr);gap:2rem;}}
 :global(body .rk-native-quote-dialog){width:min(1040px,calc(100% - 2rem));}
 :global(body .rk-native-quote-dialog .rk-modal-panel){display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:2rem;padding:2rem;}
 :global(body .rk-native-quote-dialog .rk-modal-panel > div){min-width:0;}
 @media(max-width:800px){:global(body .rk-native-quote-dialog .rk-modal-panel){grid-template-columns:minmax(0,1fr);gap:1rem;padding:1.25rem;}}
</style>
