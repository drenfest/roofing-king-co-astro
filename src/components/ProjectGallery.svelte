<script lang="ts">
  import {onMount,tick} from 'svelte';
  type Photo={context?:Record<string,{caption:string}>;category?:string;caption?:string;src:string;alt:string;tags:string[];width?:number;height?:number;thumbnail:string;srcset:string;kind?:string;sourceLabel?:string;contain?:boolean;displayWidth?:number;displayHeight?:number};
  let {id='project-gallery',eyebrow,title,titleEmphasis='',description,filters=[],items,compact=false,fullGalleryHref='/#projects',tone='brand'}:{id?:string;eyebrow:string;title:string;titleEmphasis?:string;description:string;filters?:{label:string;value:string}[];items:Photo[];compact?:boolean;fullGalleryHref?:string;tone?:'paper'|'brand'}=$props();
  const emphasis=$derived(titleEmphasis&&title.endsWith(titleEmphasis)?titleEmphasis:'');
  let filter=$state('all');let index=$state(0);let page=$state(0);let pageSize=$state(4);let enhanced=$state(false);let opened=$state(false);
  let dialog:HTMLDialogElement;let gridHost:HTMLDivElement;let lastTrigger:HTMLAnchorElement|null=null;
  let search=$state('');let imageType=$state('all');
  const imageTypes=[{value:'all',label:'All image types'},{value:'supplied',label:'Supplied photos'},{value:'existing',label:'Existing site photos'},{value:'inspection',label:'Inspection references'},{value:'materials',label:'Material references'},{value:'company',label:'Team & company'},{value:'other',label:'Other references'}];
  function matchesType(item:Photo,value:string){return value==='all'||(value==='materials'?['reference','manufacturer','third-party'].includes(item.kind||''):value==='company'?item.tags.includes('company'):item.kind===value);}
  const availableTypes=$derived(imageTypes.filter(type=>type.value==='all'||items.some(item=>matchesType(item,type.value))));
  let visible=$derived(items.filter(item=>(filter==='all'||item.tags.includes(filter))&&matchesType(item,imageType)&&search.trim().toLowerCase().split(/\s+/).every(term=>[item.caption,item.alt,...item.tags.map(tag=>tag.replaceAll('-',' '))].join(' ').toLowerCase().includes(term))));
  let pageCount=$derived(Math.max(1,Math.ceil(visible.length/pageSize)));
  let groups=$derived(Array.from({length:pageCount},(_,i)=>visible.slice(i*pageSize,(i+1)*pageSize)));
  let photo=$derived(visible[index]);
  const activeTopic=$derived(filter!=='all'?filter:compact?filters[0]?.value||'all':'all');
  function categoryFor(item:Photo){return activeTopic==='all'?item.category||'Exterior details':filters.find(option=>option.value===activeTopic)?.label||item.category;}
  function captionFor(item:Photo){return item.context?.[activeTopic]?.caption||item.caption||item.alt;}
  let touchX=0,touchY=0,swiped=false;
  function setFilter(value:string){filter=value;page=0;index=0;if(gridHost)gridHost.style.minHeight='';}
  function resetPage(){page=0;index=0;if(gridHost)gridHost.style.minHeight='';}
  async function changePage(delta:number){
    const next=Math.max(0,Math.min(pageCount-1,page+delta));if(next===page)return;
    gridHost.style.minHeight=gridHost.getBoundingClientRect().height+'px';page=next;await tick();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gridHost.animate([{opacity:.25,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
  }
  function open(event:MouseEvent,i:number){event.preventDefault();if(swiped){swiped=false;return;}lastTrigger=event.currentTarget as HTMLAnchorElement;index=i;opened=true;dialog.showModal();document.body.classList.add('rk-lightbox-open');}
  function close(){dialog.close();}
  function restore(){opened=false;document.body.classList.remove('rk-lightbox-open');lastTrigger?.focus();}
  function move(delta:number){index=(index+delta+visible.length)%visible.length;}
  function keyboard(event:KeyboardEvent){if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}
  function touchStart(event:TouchEvent){touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;swiped=false;}
  function touchEnd(event:TouchEvent){const dx=event.changedTouches[0].clientX-touchX,dy=event.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){swiped=true;void changePage(dx<0?1:-1);}}
  onMount(()=>{
    const query=matchMedia('(max-width:760px)');
    const resize=()=>{const first=page*pageSize;pageSize=query.matches?2:4;page=Math.min(Math.floor(first/pageSize),Math.max(0,Math.ceil(visible.length/pageSize)-1));gridHost.style.minHeight='';};resize();
    const fromHash=()=>{if(id!=='projects')return;if(location.hash==='#projects'){setFilter('all');return;}const category=location.hash.replace(/^#projects-?/,'');if(location.hash.startsWith('#projects')&&filters.some(f=>f.value===category))setFilter(category);};fromHash();
    enhanced=true;query.addEventListener('change',resize);window.addEventListener('hashchange',fromHash);
    return()=>{query.removeEventListener('change',resize);window.removeEventListener('hashchange',fromHash);document.body.classList.remove('rk-lightbox-open');};
  });
</script>
<section {id} class="rk-home-section rk-home-gallery rk-project-gallery-block rk-editorial-gallery" class:rk-gallery-compact={compact} class:rk-gallery-brand={tone==='brand'} aria-label={eyebrow} aria-roledescription="carousel" data-gallery-topic={compact?filters[0]?.value||'all':'all'}>
  {#if id==='projects'}{#each filters.filter(f=>f.value!=='all') as option}<span id={'projects-'+option.value} class="rk-gallery-anchor" aria-hidden="true"></span>{/each}{/if}
  <div class="rk-section-inner">
    <header class="rk-gallery-editorial-heading"><p class="rk-home-eyebrow">{eyebrow}</p><h2>{emphasis?title.slice(0,-emphasis.length):title}{#if emphasis}<em>{emphasis}</em>{/if}</h2><p class="rk-gallery-description">{description}</p></header>
    {#if filters.length>1}<div class="rk-gallery-toolbar"><div class="rk-gallery-filters" role="group" aria-label="Filter gallery by service">{#each filters as option}<button type="button" class:is-active={filter===option.value} aria-pressed={filter===option.value} disabled={!enhanced} onclick={()=>setFilter(option.value)}>{option.label}</button>{/each}</div></div>{/if}
    <div class="rk-gallery-search-tools"><label>Find a photo<input type="search" bind:value={search} oninput={resetPage} disabled={!enhanced} placeholder="Try shingles, skylights or team"/></label><label>Image type<select bind:value={imageType} onchange={resetPage} disabled={!enhanced}>{#each availableTypes as type}<option value={type.value}>{type.label}</option>{/each}</select></label>{#if search||imageType!=='all'}<button type="button" class="rk-gallery-clear" onclick={()=>{search='';imageType='all';resetPage();}}>Clear search</button>{/if}</div>
    <div class="rk-gallery-pages" bind:this={gridHost} role="group" aria-label="Gallery photo groups. Swipe or use the group controls to browse." ontouchstart={touchStart} ontouchend={touchEnd}>
      {#each groups as group,pageIndex}
        <div class="rk-project-gallery-masonry rk-gallery-page" hidden={pageIndex!==page} role="group" aria-roledescription="slide" aria-label={'Photo group '+(pageIndex+1)+' of '+pageCount}>
          {#each group as item,i (item.src)}<a title={"Enlarge: "+item.alt} class="rk-gallery-lightbox-link rk-project-gallery-item" href={item.src} onclick={event=>open(event,pageIndex*pageSize+i)} aria-label={'Enlarge: '+item.alt} data-photo-kind={item.kind}><figure><div class="rk-gallery-photo" class:rk-gallery-contained={item.contain}><img src={item.thumbnail} srcset={item.srcset||undefined} sizes={item.displayWidth&&item.displayWidth<480?item.displayWidth+'px':'(max-width:760px) calc(100vw - 2.5rem), 48vw'} alt={item.alt} width={item.width} height={item.height} style:max-width={item.displayWidth?item.displayWidth+'px':undefined} loading="lazy" decoding="async"/></div><figcaption><span class="rk-gallery-category">{categoryFor(item)}</span><span class="rk-gallery-caption">{captionFor(item)}<svg viewBox="0 0 32 24" width="30" height="24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 12h26M20 4l8 8-8 8"/></svg></span><span class="rk-gallery-source">{item.sourceLabel||'Existing site photo'}{#if item.displayWidth&&item.displayWidth<800} · Small original{/if}</span></figcaption></figure></a>{/each}
        </div>
      {/each}
    </div>
    {#if visible.length===0}<p class="rk-gallery-empty" role="status">No photos match these filters. Try another service, image type or search.</p>{/if}
    <noscript><details class="rk-gallery-fallback"><summary>Browse all {items.length} photos</summary><ul>{#each items as item}<li><a title={item.caption||item.alt} href={item.src}>{item.caption||item.alt}</a></li>{/each}</ul></details></noscript>
    <div class="rk-gallery-editorial-footer"><p aria-live="polite" aria-atomic="true">{visible.length} photos{#if pageCount>1} · Group {page+1} of {pageCount}{/if}</p>
      {#if enhanced&&pageCount>1}<div class="rk-gallery-pagination" role="group" aria-label="Browse photo groups"><button type="button" onclick={()=>changePage(-1)} disabled={page===0} aria-label="Previous photo group">←</button><span aria-hidden="true">{page+1} / {pageCount}</span><button type="button" onclick={()=>changePage(1)} disabled={page===pageCount-1} aria-label="Next photo group">→</button></div>{/if}
      {#if id!=='projects'}<a title="Explore the full project gallery" class="rk-gallery-full-link" href={fullGalleryHref}>Explore the full gallery <span aria-hidden="true">→</span></a>{/if}
    </div>
  </div>
</section>
<dialog class="rk-native-lightbox" bind:this={dialog} aria-label="Gallery image" onclose={restore} onkeydown={keyboard} onclick={event=>{if(event.target===dialog)close();}}><button class="rk-lightbox-close" type="button" aria-label="Close gallery" onclick={close}>×</button><button class="rk-lightbox-prev" type="button" aria-label="Previous gallery image" onclick={()=>move(-1)}>‹</button><figure class="rk-lightbox-figure">{#if opened&&photo}<img src={photo.src} alt={photo.alt} width={photo.displayWidth||photo.width} height={photo.displayHeight||photo.height} style:max-width={photo.displayWidth?'min(100%, '+photo.displayWidth+'px)':undefined}/><figcaption aria-live="polite">{photo.alt}<span class="rk-lightbox-source">{photo.sourceLabel||'Existing site photo'} · {index+1} of {visible.length}</span></figcaption>{/if}</figure><button class="rk-lightbox-next" type="button" aria-label="Next gallery image" onclick={()=>move(1)}>›</button></dialog>

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

.rk-editorial-gallery .rk-project-gallery-masonry{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:row;grid-auto-rows:auto;gap:1.6rem 1.3rem;max-width:none;margin:0;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){display:block;grid-column:span 7;grid-row:auto;height:auto;min-width:0;overflow:visible;background:none;border:0;border-radius:0;clip-path:none;box-shadow:none;color:var(--rk-charcoal);text-decoration:none;will-change:auto;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+2){grid-column:span 5;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+3){grid-column:span 4;}
.rk-editorial-gallery .rk-project-gallery-item:nth-child(4n+4){grid-column:span 8;}
.rk-project-gallery-item figure{margin:0;}
.rk-gallery-photo{display:flex;align-items:center;justify-content:center;height:clamp(190px,22vw,310px);overflow:hidden;background:var(--rk-paper-soft);}
.rk-editorial-gallery .rk-project-gallery-item img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform var(--rk-motion-panel) var(--rk-motion-ease);}
.rk-editorial-gallery .rk-project-gallery-item:hover img{transform:scale(1.025);filter:none;}
.rk-editorial-gallery .rk-gallery-contained img{object-fit:contain;}
.rk-editorial-gallery .rk-project-gallery-item:hover .rk-gallery-contained img{transform:none;}
.rk-gallery-source{display:block;margin-top:.5rem;font-size:.74rem;line-height:1.5;color:var(--rk-muted);}
.rk-lightbox-source{display:block;margin-top:.4rem;font-size:.8rem;color:#d7d1c8;}
.rk-gallery-search-tools{display:flex;flex-wrap:wrap;align-items:end;gap:1rem 1.5rem;margin:0 0 1.5rem;}
.rk-gallery-search-tools label{display:grid;gap:.4rem;font-size:.72rem;font-weight:600;letter-spacing:.025em;}
.rk-gallery-search-tools label:first-child{flex:1;max-width:29rem;min-width:12rem;}
.rk-gallery-search-tools input,.rk-gallery-search-tools select{width:100%;min-height:44px;padding:.6rem .8rem;border:1px solid var(--rk-line);border-radius:0;background:var(--rk-paper);color:var(--rk-charcoal);font:inherit;font-size:.85rem;font-weight:400;}
.rk-gallery-search-tools input:focus-visible,.rk-gallery-search-tools select:focus-visible{outline:2px solid var(--rk-orange);outline-offset:3px;}
.rk-gallery-clear{min-height:44px;border:0;background:none;color:var(--rk-charcoal);font-size:.8rem;text-decoration:underline;text-underline-offset:.3em;cursor:pointer;}
.rk-gallery-empty{padding:2rem 0;color:var(--rk-muted);}
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
@media(max-width:1060px){.rk-gallery-editorial-heading{grid-template-columns:1fr;gap:1.3rem;}.rk-gallery-editorial-heading .rk-gallery-description{max-width:50ch;}.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){grid-column:span 6;}.rk-gallery-photo{height:clamp(190px,25vw,280px);}}
@media(max-width:760px){section.rk-editorial-gallery>.rk-section-inner{width:calc(100% - 2.5rem);}.rk-gallery-editorial-heading h2{font-size:clamp(2.65rem,10vw,4.7rem);}.rk-gallery-editorial-heading .rk-gallery-description{font-size:.95rem;}.rk-editorial-gallery .rk-gallery-filters{gap:.1rem 1rem;}.rk-editorial-gallery .rk-gallery-filters button{gap:.4rem;font-size:.78rem;}.rk-editorial-gallery .rk-project-gallery-masonry{grid-template-columns:minmax(0,1fr);gap:1.7rem;}.rk-editorial-gallery .rk-project-gallery-item:nth-child(n){grid-column:auto;}.rk-gallery-photo{height:auto;aspect-ratio:4/3;}.rk-gallery-caption{font-size:1.25rem;}.rk-gallery-editorial-footer{align-items:flex-start;flex-direction:column;}.rk-gallery-full-link{align-self:flex-end;}}
.rk-gallery-page[hidden]{display:none!important;}
.rk-gallery-pages{touch-action:pan-y pinch-zoom;}
.rk-gallery-anchor{position:absolute;top:0;scroll-margin-top:8rem;}
section.rk-editorial-gallery{position:relative;scroll-margin-top:7rem;}
.rk-gallery-pagination{display:flex;align-items:center;gap:.75rem;}
.rk-gallery-pagination button{display:grid;place-items:center;min-width:44px;min-height:44px;background:none;border:1px solid var(--rk-line);color:var(--rk-charcoal);font-size:1.3rem;cursor:pointer;}
.rk-gallery-pagination button:disabled{opacity:.3;cursor:default;}
.rk-gallery-pagination span{font-size:.8rem;color:var(--rk-muted);min-width:3.5rem;text-align:center;}
.rk-editorial-gallery .rk-project-gallery-item:last-child:nth-child(odd){grid-column:span 6;}
.rk-gallery-fallback{margin-top:1rem;}
.rk-gallery-compact .rk-gallery-editorial-heading h2{font-size:clamp(2rem,3.6vw,3.5rem);letter-spacing:-.025em;}
.rk-gallery-compact .rk-gallery-editorial-heading{grid-template-columns:1.4fr 1fr;}
.rk-gallery-compact .rk-gallery-photo{height:clamp(190px,20vw,280px);}
@media(max-width:760px){.rk-editorial-gallery .rk-gallery-page:first-child .rk-project-gallery-item:nth-child(n+3){display:none;}.rk-gallery-editorial-footer{flex-direction:row;flex-wrap:wrap;align-items:center;}.rk-gallery-compact .rk-gallery-editorial-heading{grid-template-columns:1fr;}.rk-gallery-compact .rk-gallery-photo{height:auto;}.rk-gallery-compact .rk-gallery-full-link{width:100%;}.rk-editorial-gallery .rk-gallery-filters{flex-wrap:nowrap;overflow:auto;gap:1.3rem;max-width:100%;}.rk-editorial-gallery .rk-gallery-filters button{white-space:nowrap;}.rk-gallery-toolbar{min-width:0;}}
.rk-editorial-gallery .rk-project-gallery-item:only-child:last-child{grid-column:1/-1;}
@media(max-width:760px){.rk-editorial-gallery .rk-project-gallery-item:last-child:nth-child(odd){grid-column:auto;}}
/* Brand tone: logo orange with the shared diagonal section edge and white type. */
section.rk-editorial-gallery.rk-gallery-brand{background:var(--rk-orange);color:#fff;clip-path:polygon(0 22px,100% 0,100% calc(100% - 22px),0 100%);padding-block:clamp(4.5rem,7vw,7rem);}
.rk-gallery-brand .rk-gallery-editorial-heading .rk-home-eyebrow,.rk-gallery-brand .rk-gallery-editorial-heading h2,.rk-gallery-brand .rk-gallery-editorial-heading .rk-gallery-description,.rk-gallery-brand .rk-gallery-filters button,.rk-gallery-brand .rk-gallery-filters button.is-active,.rk-gallery-brand .rk-project-gallery-item:nth-child(n),.rk-gallery-brand .rk-gallery-category,.rk-gallery-brand .rk-gallery-source,.rk-gallery-brand .rk-gallery-search-tools label,.rk-gallery-brand .rk-gallery-clear,.rk-gallery-brand .rk-gallery-empty,.rk-gallery-brand .rk-gallery-editorial-footer p,.rk-gallery-brand .rk-gallery-pagination button,.rk-gallery-brand .rk-gallery-pagination span{color:#fff;}
.rk-gallery-brand .rk-gallery-editorial-heading .rk-home-eyebrow::before,.rk-gallery-brand .rk-gallery-filters button.is-active::before{background:#fff;}
.rk-gallery-brand .rk-gallery-filters button:not(.is-active){opacity:.88;}
.rk-gallery-brand .rk-gallery-filters button:hover{color:#fff;opacity:1;text-decoration:underline;text-underline-offset:.35em;}
.rk-gallery-brand .rk-gallery-toolbar,.rk-gallery-brand .rk-gallery-editorial-footer{border-top-color:rgba(255,255,255,.5);}
.rk-gallery-brand .rk-gallery-search-tools input,.rk-gallery-brand .rk-gallery-search-tools select{border-color:#fff;background:#fff;color:#8a3800;}
.rk-gallery-brand .rk-gallery-search-tools input::placeholder{color:#a85a24;}
.rk-gallery-brand .rk-gallery-search-tools input:focus-visible,.rk-gallery-brand .rk-gallery-search-tools select:focus-visible,.rk-gallery-brand a:focus-visible,.rk-gallery-brand button:focus-visible{outline:2px solid #fff;outline-offset:3px;}
.rk-gallery-brand .rk-gallery-photo{background:rgba(255,255,255,.18);}
.rk-gallery-brand .rk-gallery-pagination button{border-color:rgba(255,255,255,.7);}
.rk-gallery-brand .rk-gallery-full-link{background:#fff;color:#8a3800;}
.rk-gallery-brand .rk-gallery-full-link span{color:var(--rk-orange);}
.rk-gallery-brand .rk-gallery-full-link:hover{background:var(--rk-paper);}
@media(max-width:600px){section.rk-editorial-gallery.rk-gallery-brand{clip-path:polygon(0 12px,100% 0,100% calc(100% - 12px),0 100%);padding-block:3.5rem;}}
/* The editorial gallery retains its original asymmetrical photographs and generous heading. */
section.rk-editorial-gallery .rk-gallery-editorial-heading h2{font-size:clamp(2.5rem,5.6vw,5rem)!important;line-height:1.08!important;}
section.rk-editorial-gallery.rk-gallery-compact .rk-gallery-editorial-heading h2{font-size:clamp(2.25rem,3.6vw,3.5rem)!important;}
@media(max-width:760px){section.rk-editorial-gallery .rk-gallery-editorial-heading h2,section.rk-editorial-gallery.rk-gallery-compact .rk-gallery-editorial-heading h2{font-size:clamp(2rem,7.5vw,3rem)!important;}}
</style>
