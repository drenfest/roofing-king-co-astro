<script lang="ts">
  let { before, after }: { before: {src:string;alt:string;width?:number;height?:number}; after: {src:string;alt:string} } = $props();
  let position = $state(50);
</script>
<figure class="rk-home-comparison rk-before-after-compare" style={`--rk-before-after-position: ${position}%`}>
  <img class="rk-before-after-image rk-before-after-before" src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" decoding="async" />
  <div class="rk-before-after-after-wrap"><img class="rk-before-after-image rk-before-after-after" src={after.src} alt={after.alt} width={before.width} height={before.height} loading="lazy" decoding="async" /></div>
  <span class="rk-before-after-divider" aria-hidden="true"><span class="rk-before-after-handle">
    <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12 7-5 5 5 5m16-10 5 5-5 5"/><path class="rk-comparison-grip" d="M18 6v12m4-12v12"/>
    </svg>
  </span></span>
  <span class="rk-before-after-label is-before">Before</span><span class="rk-before-after-label is-after">After</span>
  <input class="rk-before-after-range" type="range" min="0" max="100" bind:value={position} aria-label="Drag to compare before and after images" aria-valuetext={`${position}% before image; ${100-position}% after image`} />
</figure>

<style>
  .rk-before-after-after-wrap { clip-path:inset(0 0 0 var(--rk-before-after-position,50%)); }
  .rk-before-after-label.is-before { left:.85rem;right:auto; }
  .rk-before-after-label.is-after { right:.85rem;left:auto; }
  .rk-before-after-divider {
    width:2px;
    background:#fff;
    box-shadow:0 0 0 1px #24232126,0 0 15px #24232133;
  }
  .rk-before-after-handle {
    display:grid;
    grid-template-columns:1fr;
    width:56px;
    height:56px;
    box-sizing:border-box;
    border:1px solid #fff;
    border-radius:50%;
    color:#bd5006;
    background:#fff;
    box-shadow:0 0 0 5px #ffffff2e,0 4px 16px #24232140;
    transition:box-shadow .18s ease,transform .18s ease;
  }
  .rk-before-after-handle::before,.rk-before-after-handle::after { content:none; }
  .rk-before-after-handle svg { display:block;width:38px;height:24px; }
  .rk-comparison-grip { stroke:#afa69a;stroke-width:1.5; }
  .rk-home-comparison:hover .rk-before-after-handle {
    box-shadow:0 0 0 7px #ffffff38,0 5px 20px #24232152;
    transform:translate(-50%,-50%) scale(1.04);
  }
  .rk-home-comparison:has(.rk-before-after-range:focus-visible) .rk-before-after-handle {
    outline:3px solid #e26a13;
    outline-offset:5px;
  }
  @media(prefers-reduced-motion:reduce){.rk-before-after-handle{transition:none;}}
</style>
