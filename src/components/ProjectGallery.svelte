<script lang="ts">
  import { onMount } from 'svelte';
  type Photo = { src: string; alt: string; tags: string[]; width?: number; height?: number; thumbnail: string; srcset: string };
  let { eyebrow, title, description, filters, items }: { eyebrow: string; title: string; description: string; filters: {label:string; value:string}[]; items: Photo[] } = $props();
  let filter = $state('all');
  let index = $state(0);
  let enhanced = $state(false);
  let opened = $state(false);
  let dialog: HTMLDialogElement;
  let lastTrigger: HTMLAnchorElement | null = null;
  let visible = $derived(items.filter(item => filter === 'all' || item.tags.includes(filter)));
  let photo = $derived(visible[index]);
  function open(event: MouseEvent, i: number) {
    event.preventDefault(); lastTrigger = event.currentTarget as HTMLAnchorElement; index = i; opened = true;
    dialog.showModal(); document.body.classList.add('rk-lightbox-open');
  }
  function close() { dialog.close(); }
  function restore() { opened = false; document.body.classList.remove('rk-lightbox-open'); lastTrigger?.focus(); }
  function move(delta: number) { index = (index + delta + visible.length) % visible.length; }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  }
  onMount(() => { enhanced = true; return () => document.body.classList.remove('rk-lightbox-open'); });
</script>

<section class="rk-home-section rk-home-gallery rk-project-gallery-block" style="--rk-gallery-crown: url('/media/wordpress/3af1e7693f5a-crown.svg')">
  <div class="rk-section-inner">
    <div class="rk-home-section-header"><p class="rk-home-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>
    <div class="rk-gallery-filters" role="group" aria-label="Filter project gallery">
      {#each filters as option}<button type="button" class:is-active={filter === option.value} aria-pressed={filter === option.value} disabled={!enhanced} onclick={() => { filter = option.value; index = 0; }}>{option.label}</button>{/each}
    </div>
    <p class="screen-reader-text" aria-live="polite">{visible.length} projects shown</p>
    <div class="rk-project-gallery-masonry">
      {#each visible as item, i (item.src)}<figure class="rk-project-gallery-item">
        <a class="rk-gallery-lightbox-link" href={item.src} onclick={event => open(event, i)} aria-label={`Enlarge: ${item.alt}`}>
          <img src={item.thumbnail} srcset={item.srcset || undefined} sizes="(max-width: 640px) 100vw, (max-width: 1060px) 50vw, 33vw" alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
        </a>
      </figure>{/each}
    </div>
    <div class="rk-home-centered-action"><a class="rk-button rk-button-primary" href="/gallery/">View Full Gallery</a></div>
  </div>
</section>
<dialog class="rk-native-lightbox" bind:this={dialog} aria-label="Project gallery image" onclose={restore} onkeydown={keyboard} onclick={event => { if (event.target === dialog) close(); }}>
  <button class="rk-lightbox-close" type="button" aria-label="Close gallery" onclick={close}>×</button>
  <button class="rk-lightbox-prev" type="button" aria-label="Previous gallery image" onclick={() => move(-1)}>‹</button>
  <figure class="rk-lightbox-figure">{#if opened && photo}<img src={photo.src} alt={photo.alt} /><figcaption aria-live="polite">{photo.alt} — {index + 1} of {visible.length}</figcaption>{/if}</figure>
  <button class="rk-lightbox-next" type="button" aria-label="Next gallery image" onclick={() => move(1)}>›</button>
</dialog>
