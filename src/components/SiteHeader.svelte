<script lang="ts">
  import { onMount, tick } from 'svelte';
  import MegaMenu from './MegaMenu.svelte';
  import MenuPreview from './MenuPreview.svelte';
  import '../styles/navigation.css';
  import navigation from '../data/navigation.json';
  import site from '../data/site.json';
  let {quoteHref='#quote-form',quoteModal=true}:{quoteHref?:string;quoteModal?:boolean}=$props();
  type Item = { label: string; href: string; classes: string; children: Item[] };
  let enhanced = $state(false);
  let mobileOpen = $state(false);
  let desktop = $state(true);
  let active = $state<string | null>(null);
  let branches=$state<Record<string,boolean>>({});
  const mobilePreview=$derived.by(()=>{
    if(active===null)return null;
    let item=navigation.items[Number(active)],prefix=active;
    while(item){
      const index=item.children.findIndex((_,i)=>branches[`${prefix}-${i}`]);
      if(index<0)break;
      prefix+=`-${index}`;item=item.children[index];
    }
    return {item,key:prefix};
  });
  function toggleBranch(key:string){
    const opening=!branches[key];
    const parent=key.slice(0,key.lastIndexOf('-'));
    const next={...branches};
    for(const existing of Object.keys(next)){
      if(existing.startsWith(key+'-') || (existing.startsWith(parent+'-')&&existing!==key))delete next[existing];
    }
    next[key]=opening;branches=next;
  }
  let openedByHover = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let header: HTMLElement;
  let menuButton: HTMLButtonElement;
  function cancelClose() { clearTimeout(closeTimer); closeTimer = undefined; }
  const close = () => { cancelClose(); mobileOpen = false; active = null; branches={}; openedByHover = false; };
  async function enterMenu(event:KeyboardEvent,index:number){
    if(!desktop || event.key!=='ArrowDown')return;
    event.preventDefault();active=String(index);await tick();
    header.querySelector<HTMLAnchorElement>(`#native-submenu-${index} .rk-mega-row>a`)?.focus();
  }
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
    header.addEventListener('pointerenter', cancelClose);
    header.addEventListener('pointerleave', leaveHeader);
    const mq = matchMedia('(min-width: 1061px)');
    desktop = mq.matches;
    const resize = () => { desktop = mq.matches; close(); };
    mq.addEventListener('change', resize);
    return () => { cancelClose(); header.removeEventListener('pointerenter', cancelClose); header.removeEventListener('pointerleave', leaveHeader); document.removeEventListener('pointerdown', outside); mq.removeEventListener('change', resize); };
  });
</script>

{#snippet children(items: Item[], depth: number, prefix:string)}
  {#if enhanced&&!desktop&&mobilePreview?.key===prefix}<li class="rk-mobile-preview"><MenuPreview item={mobilePreview.item} onNavigate={close}/></li>{/if}
  {#each items as item,index}
    {@const key=`${prefix}-${index}`}
    <li class={`rk-menu-item rk-menu-depth-${depth} ${item.classes}`} class:is-submenu-open={branches[key]}>
      <div class="rk-menu-row"><a class={`rk-menu-link rk-menu-link-depth-${depth}`} href={item.href} onclick={close}>{item.label}</a>
        {#if item.children.length}<button class="rk-submenu-toggle rk-nested-toggle" type="button" aria-label={`Toggle ${item.label} submenu`} aria-expanded={!!branches[key]} aria-controls={`mobile-branch-${key}`} onclick={()=>toggleBranch(key)}><span aria-hidden="true"></span></button>{/if}
      </div>
      {#if item.children.length}<ul id={`mobile-branch-${key}`} class={`sub-menu rk-submenu rk-submenu-depth-${depth}`} hidden={enhanced&&!branches[key]} inert={enhanced&&!branches[key]}>{@render children(item.children, depth + 1,key)}</ul>{/if}
    </li>
  {/each}
{/snippet}

<svelte:window onkeydown={escape} />
<header class:rk-native-enhanced={enhanced} class="rk-site-header rk-native-header" bind:this={header}
  onfocusout={(event) => { if (event.relatedTarget && !header.contains(event.relatedTarget as Node)) close(); }}>
  <div class="rk-header-inner">
    <a class="rk-logo" href="/" aria-label={site.name}><img src="/media/wordpress/2b1fb60b5770-logo.png" alt={site.name} width="154" height="106" /></a>
    <button class="rk-nav-toggle" class:is-active={mobileOpen} type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="native-primary-nav" bind:this={menuButton} onclick={() => { mobileOpen = !mobileOpen; active = null; }}><span class="rk-nav-toggle-label">{mobileOpen ? 'Close' : 'Menu'}</span><span class="rk-nav-toggle-lines" aria-hidden="true"><i></i><i></i><i></i></span></button>
    <nav id="native-primary-nav" class="rk-primary-nav" class:is-open={mobileOpen} aria-label="Primary" inert={enhanced && !desktop && !mobileOpen}>
      <ul class="rk-nav-list">
        {#each navigation.items as item, i}
          <li class={`rk-menu-item rk-menu-depth-0 ${item.classes}`} class:is-submenu-open={active === String(i)}
            onpointerenter={(event) => { if (event.pointerType === 'mouse' && desktop) { cancelClose(); active = String(i); openedByHover = true; } }}>
            <div class="rk-menu-row"><a class="rk-menu-link rk-menu-link-depth-0" href={item.href} onclick={close}>{item.label}</a>
              {#if item.children.length}<button class="rk-submenu-toggle" type="button" aria-expanded={active === String(i)} aria-controls={desktop?`native-submenu-${i}`:`native-mobile-submenu-${i}`} aria-label={`Toggle ${item.label} submenu`} data-submenu={String(i)} onkeydown={event=>enterMenu(event,i)} onclick={(event) => { if (event.detail && openedByHover) { openedByHover = false; return; } active = active === String(i) ? null : String(i); }}><span aria-hidden="true"></span></button>{/if}
            </div>
            {#if item.children.length}
              <div id={`native-submenu-${i}`} class="rk-native-mega-host" inert={!enhanced||!desktop||active!==String(i)}><MegaMenu root={item} onNavigate={close} visible={enhanced&&desktop&&active===String(i)}/></div>
              <ul id={`native-mobile-submenu-${i}`} class="sub-menu rk-submenu rk-submenu-depth-0 rk-mobile-tree" inert={enhanced&&(desktop||active!==String(i))} hidden={enhanced&&!desktop&&active!==String(i)}>{@render children(item.children, 1,String(i))}</ul>
            {/if}
          </li>
        {/each}
      </ul>
      <div class="rk-mobile-nav-actions"><a class="rk-phone" href={site.phoneHref}>{site.phone}</a><a class="rk-button rk-button-primary" href={quoteHref} data-quote-open={quoteModal?true:undefined} onclick={close}>Get a Free Quote</a></div>
    </nav>
    <a class="rk-header-mobile-call" href={site.phoneHref} aria-label={`Call Roof King at ${site.phone}`}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 3 3 5-2 2a14 14 0 0 0 6 6l2-2 5 3-1 4C11 22 2 13 3 4l4-1Z"/></svg></a>
    <div class="rk-header-actions"><a class="rk-phone" href={site.phoneHref}>{site.phone}</a><a class="rk-button rk-button-primary" href={quoteHref} data-quote-open={quoteModal?true:undefined}>Get a Free Quote</a></div>
  </div>
</header>
