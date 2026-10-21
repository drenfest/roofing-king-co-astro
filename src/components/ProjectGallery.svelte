<script lang="ts">
  import { onMount } from 'svelte';
  type Photo = { category?: string; caption?: string; src: string; alt: string; tags: string[]; width?: number; height?: number; thumbnail: string; srcset: string };
  let { eyebrow, title, titleEmphasis = '', description, filters, items }: { eyebrow: string; title: string; titleEmphasis?: string; description: string; filters: {label:string; value:string}[]; items: Photo[] } = $props();
  const emphasis = $derived(titleEmphasis && title.endsWith(titleEmphasis) ? titleEmphasis : '');
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

<section class="rk-home-section rk-home-gallery rk-project-gallery-block rk-editorial-gallery" aria-label={eyebrow}>
  <div class="rk-section-inner">
    <header class="rk-gallery-editorial-heading">
      <p class="rk-home-eyebrow">{eyebrow}</p>
      <h2>{emphasis ? title.slice(0,-emphasis.length) : title}{#if emphasis}<em>{emphasis}</em>{/if}</h2>
      <p class="rk-gallery-description">{description}</p>
    </header>
    <div class="rk-gallery-toolbar">
      <div class="rk-gallery-filters" role="group" aria-label="Filter project gallery">
        {#each filters as option}<button type="button" class:is-active={filter === option.value} aria-pressed={filter === option.value} disabled={!enhanced} onclick={() => { filter = option.value; index = 0; }}>{option.label}</button>{/each}
      </div>
      <svg class="rk-gallery-grid-mark" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"/></svg>
    </div>
    <p class="screen-reader-text" aria-live="polite">{visible.length} projects shown</p>
    <div class="rk-project-gallery-masonry">
      {#each visible as item, i (item.src)}
        <a class="rk-gallery-lightbox-link rk-project-gallery-item" href={item.src} onclick={event => open(event, i)} aria-label={`Enlarge: ${item.alt}`}>
          <figure>
            <div class="rk-gallery-photo"><img src={item.thumbnail} srcset={item.srcset || undefined} sizes={`(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1060px) 46vw, ${[56,40,32,64][i%4]}vw`} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" /></div>
            <figcaption>
              <span class="rk-gallery-category">{item.category || filters.find(option => option.value !== 'all' && option.value !== 'featured-projects' && item.tags.includes(option.value))?.label || 'Exterior work'}</span>
              <span class="rk-gallery-caption">{item.caption || item.alt}<svg viewBox="0 0 32 24" width="30" height="24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 12h26M20 4l8 8-8 8"/></svg></span>
            </figcaption>
          </figure>
        </a>
      {/each}
    </div>
    <div class="rk-gallery-editorial-footer"><p>Explore more of our work.</p><a class="rk-gallery-full-link" href="/gallery/">View full gallery <span aria-hidden="true">→</span></a></div>
  </div>
</section>
<dialog class="rk-native-lightbox" bind:this={dialog} aria-label="Project gallery image" onclose={restore} onkeydown={keyboard} onclick={event => { if (event.target === dialog) close(); }}>
  <button class="rk-lightbox-close" type="button" aria-label="Close gallery" onclick={close}>×</button>
  <button class="rk-lightbox-prev" type="button" aria-label="Previous gallery image" onclick={() => move(-1)}>‹</button>
  <figure class="rk-lightbox-figure">{#if opened && photo}<img src={photo.src} alt={photo.alt} /><figcaption aria-live="polite">{photo.alt} — {index + 1} of {visible.length}</figcaption>{/if}</figure>
  <button class="rk-lightbox-next" type="button" aria-label="Next gallery image" onclick={() => move(1)}>›</button>
</dialog>

<style>
section.rk-editorial-gallery{padding-block:clamp(3.5rem,6vw,6rem);background:var(--rk-paper);color:var(--rk-charcoal);clip-path:none;}
section.rk-editorial-gallery::before{display:none;}
section.rk-editorial-gallery>.rk-section-inner{width:min(100% - 8vw,1380px);max-width:1380px;}
.rk-gallery-editorial-heading{display:grid;grid-template-columns:minmax(0,2.3fr) minmax(240px,1fr);align-items:end;gap:0 2.5rem;margin-bottom:2rem;}
.rk-editorial-gallery .rk-gallery-editorial-heading .rk-home-eyebrow{display:flex;align-items:center;gap:1rem;grid-column:1/-1;margin:0 0 1.1rem;color:var(--rk-charcoal);font-size:.65rem;font-weight:650;letter-spacing:.3em;}
.rk-gallery-editorial-heading .rk-home-eyebrow::before{content:'';width:36px;height:2px;background:var(--rk-orange);}
.rk-gallery-editorial-heading h2{margin:0;max-width:none;color:var(--rk-charcoal);font-size:clamp(3.1rem,6.8vw,6.5rem);font-weight:600;line-height:1.04;letter-spacing:-.045em;text-transform:none;text-wrap:pretty;}
.rk-gallery-editorial-heading h2 em{display:block;font-weight:600;}
.rk-gallery-editorial-heading .rk-gallery-description{max-width:30ch;margin:0 0 .3rem;color:var(--rk-muted);font-size:1rem;line-height:1.65;}
.rk-gallery-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;border-top:1px solid var(--rk-line);padding-block:.65rem 1rem;}
.rk-editorial-gallery .rk-gallery-filters{display:flex;flex-wrap:wrap;justify-content:flex-start;gap:.3rem 1.8rem;margin:0;}
.rk-editorial-gallery .rk-gallery-filters button{display:inline-flex;align-items:center;gap:.65rem;min-height:44px;padding:.3rem 0;border:0;border-radius:0;background:none;color:var(--rk-muted);font-size:.85rem;font-weight:450;box-shadow:none;clip-path:none;transform:none;text-transform:none;}
.rk-editorial-gallery .rk-gallery-filters button::before{content:'';width:8px;height:8px;border-radius:50%;background:transparent;}
.rk-editorial-gallery .rk-gallery-filters button.is-active{color:var(--rk-charcoal);font-weight:750;}
.rk-editorial-gallery .rk-gallery-filters button.is-active::before{background:var(--rk-orange);}
.rk-editorial-gallery .rk-gallery-filters button:hover{color:#a84400;}
.rk-gallery-grid-mark{flex-shrink:0;color:var(--rk-muted);}
.rk-editorial-gallery .rk-project-gallery-masonry{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:row;grid-auto-rows:auto;gap:1.6rem 1.3rem;max-width:none;margin:0;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){display:block;grid-column:span 7;grid-row:auto;height:auto;min-width:0;overflow:visible;background:none;border:0;border-radius:0;clip-path:none;box-shadow:none;color:var(--rk-charcoal);text-decoration:none;will-change:auto;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+2){grid-column:span 5;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+3){grid-column:span 4;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+4){grid-column:span 8;}
.rk-project-gallery-item figure{margin:0;}
.rk-gallery-photo{height:clamp(250px,29vw,440px);overflow:hidden;background:var(--rk-paper-soft);}
.rk-editorial-gallery .rk-project-gallery-item img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform var(--rk-motion-panel) var(--rk-motion-ease);}
.rk-editorial-gallery .rk-project-gallery-item:hover img{transform:scale(1.025);filter:none;}
.rk-project-gallery-item figcaption{padding-top:1rem;}
.rk-gallery-category{display:block;margin-bottom:.2rem;color:var(--rk-muted);font-size:.6rem;font-weight:650;letter-spacing:.24em;text-transform:uppercase;}
.rk-gallery-caption{display:flex;align-items:center;justify-content:space-between;gap:1rem;font-size:clamp(1.15rem,1.9vw,1.7rem);font-weight:500;line-height:1.3;letter-spacing:-.025em;}
.rk-gallery-caption svg{flex-shrink:0;transition:translate var(--rk-motion-fast) var(--rk-motion-ease);}
.rk-project-gallery-item:hover .rk-gallery-caption svg{translate:4px 0;}
.rk-gallery-editorial-footer{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;border-top:1px solid var(--rk-line);padding-top:1.25rem;margin-top:1.7rem;}
.rk-gallery-editorial-footer p{margin:0;color:var(--rk-muted);font-size:.9rem;}
.rk-gallery-full-link{display:inline-flex;align-items:center;justify-content:space-between;gap:1.5rem;min-height:48px;padding:.85rem 1.3rem;background:var(--rk-charcoal);color:var(--rk-paper);font-size:.85rem;text-decoration:none;transition:background var(--rk-motion-fast);}
.rk-gallery-full-link span{color:#ff8c36;font-size:1.5rem;line-height:1;}
.rk-gallery-full-link:hover{background:#3e3a34;}
@media(max-width:1060px){.rk-gallery-editorial-heading{grid-template-columns:1fr;gap:1.3rem;}.rk-gallery-editorial-heading .rk-gallery-description{max-width:50ch;}.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){grid-column:span 6;}.rk-gallery-photo{height:clamp(240px,34vw,340px);}}
@media(max-width:760px){section.rk-editorial-gallery>.rk-section-inner{width:calc(100% - 2.5rem);}.rk-gallery-editorial-heading h2{font-size:clamp(2.65rem,10vw,4.7rem);}.rk-gallery-editorial-heading .rk-gallery-description{font-size:.95rem;}.rk-gallery-grid-mark{display:none;}.rk-editorial-gallery .rk-gallery-filters{gap:.1rem 1rem;}.rk-editorial-gallery .rk-gallery-filters button{gap:.4rem;font-size:.78rem;}.rk-editorial-gallery .rk-project-gallery-masonry{grid-template-columns:minmax(0,1fr);gap:1.7rem;}.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){grid-column:auto;}.rk-gallery-photo{height:auto;aspect-ratio:4/3;}.rk-gallery-caption{font-size:1.25rem;}.rk-gallery-editorial-footer{align-items:flex-start;flex-direction:column;}.rk-gallery-full-link{align-self:flex-end;}}
</style>
