<script lang="ts">
  import { onMount } from 'svelte';
  import navigation from '../data/navigation.json';
  import site from '../data/site.json';
  type Item = { label: string; href: string; classes: string; children: Item[] };
  let enhanced = $state(false);
  let mobileOpen = $state(false);
  let desktop = $state(true);
  let active = $state<string | null>(null);
  let openedByHover = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let header: HTMLElement;
  let menuButton: HTMLButtonElement;
  function cancelClose() { clearTimeout(closeTimer); closeTimer = undefined; }
  const close = () => { cancelClose(); mobileOpen = false; active = null; openedByHover = false; };
  function leaveHeader(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || !desktop) return;
    cancelClose();
    closeTimer = setTimeout(() => {
      // The whole header and its absolute-positioned panels form one hover area.
      // Preserve a submenu while a keyboard user is still working inside it.
      if (!header.querySelector('.rk-submenu') || !header.querySelector(`#native-submenu-${active}`)?.contains(document.activeElement)) {
        active = null; openedByHover = false;
      }
    }, 180);
  }
  $effect(() => {
    document.body.classList.toggle('rk-nav-open', mobileOpen && !desktop);
    return () => document.body.classList.remove('rk-nav-open');
  });
  function escape(event: KeyboardEvent) {
    if (event.key === 'Tab' && mobileOpen && !desktop) {
      const items = [menuButton, ...header.querySelectorAll<HTMLElement>('nav a, nav button')].filter(e => e.getClientRects().length && !e.closest('[inert]'));
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key !== 'Escape' || (!active && !header?.contains(document.activeElement))) return;
    const button = mobileOpen ? menuButton : active ? header.querySelector<HTMLButtonElement>(`[data-submenu="${active}"]`) : menuButton;
    close(); button?.focus();
  }
  onMount(() => {
    enhanced = true;
    const outside = (event: PointerEvent) => { if (!header.contains(event.target as Node)) close(); };
    document.addEventListener('pointerdown', outside);
    const mq = matchMedia('(min-width: 1061px)');
    desktop = mq.matches;
    const resize = () => { desktop = mq.matches; close(); };
    mq.addEventListener('change', resize);
    return () => { cancelClose(); document.removeEventListener('pointerdown', outside); mq.removeEventListener('change', resize); };
  });
</script>

{#snippet children(items: Item[], depth: number)}
  {#each items as item}
    <li class={`rk-menu-item rk-menu-depth-${depth} ${item.classes}`}>
      <div class="rk-menu-row"><a class={`rk-menu-link rk-menu-link-depth-${depth}`} href={item.href} onclick={close}>{item.label}</a></div>
      {#if item.children.length}<ul class={`sub-menu rk-submenu rk-submenu-depth-${depth}`}>{@render children(item.children, depth + 1)}</ul>{/if}
    </li>
  {/each}
{/snippet}

<svelte:window onkeydown={escape} />
<header role="banner" class:rk-native-enhanced={enhanced} class="rk-site-header rk-native-header" bind:this={header}
  onpointerenter={cancelClose} onpointerleave={leaveHeader}
  onfocusout={(event) => { if (event.relatedTarget && !header.contains(event.relatedTarget as Node)) close(); }}>
  <div class="rk-header-inner">
    <a class="rk-logo" href="/" aria-label={site.name}><img src="/media/wordpress/2b1fb60b5770-logo.png" alt={site.name} width="154" height="106" /></a>
    <button class="rk-nav-toggle" class:is-active={mobileOpen} type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="native-primary-nav" bind:this={menuButton} onclick={() => { mobileOpen = !mobileOpen; active = null; }}><span></span><span></span><span></span></button>
    <nav id="native-primary-nav" class="rk-primary-nav" class:is-open={mobileOpen} aria-label="Primary" inert={enhanced && !desktop && !mobileOpen}>
      <ul class="rk-nav-list">
        {#each navigation.items as item, i}
          <li class={`rk-menu-item rk-menu-depth-0 ${item.classes}`} class:is-submenu-open={active === String(i)}
            onpointerenter={(event) => { if (event.pointerType === 'mouse' && desktop) { cancelClose(); active = String(i); openedByHover = true; } }}>
            <div class="rk-menu-row"><a class="rk-menu-link rk-menu-link-depth-0" href={item.href} onclick={close}>{item.label}</a>
              {#if item.children.length}<button class="rk-submenu-toggle" type="button" aria-expanded={active === String(i)} aria-controls={`native-submenu-${i}`} aria-label={`Toggle ${item.label} submenu`} data-submenu={String(i)} onclick={(event) => { if (event.detail && openedByHover) { openedByHover = false; return; } active = active === String(i) ? null : String(i); }}><span aria-hidden="true"></span></button>{/if}
            </div>
            {#if item.children.length}<ul id={`native-submenu-${i}`} class="sub-menu rk-submenu rk-submenu-depth-0" inert={enhanced && active !== String(i)}>{@render children(item.children, 1)}</ul>{/if}
          </li>
        {/each}
      </ul>
      <div class="rk-mobile-nav-actions"><a class="rk-phone" href={site.phoneHref}>{site.phone}</a><a class="rk-button rk-button-primary" href="#quote-form" data-quote-open onclick={close}>Get a Free Quote</a></div>
    </nav>
    <div class="rk-header-actions"><a class="rk-phone" href={site.phoneHref}>{site.phone}</a><a class="rk-button rk-button-primary" href="#quote-form" data-quote-open>Get a Free Quote</a></div>
  </div>
</header>
