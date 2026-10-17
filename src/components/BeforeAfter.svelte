<script lang="ts">
  let { before, after }: { before: {src:string;alt:string;width?:number;height?:number}; after: {src:string;alt:string} } = $props();
  let position = $state(50);
</script>
<figure class="rk-home-comparison rk-before-after-compare" style={`--rk-before-after-position: ${position}%`}>
  <img class="rk-before-after-image rk-before-after-before" src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" decoding="async" />
  <div class="rk-before-after-after-wrap"><img class="rk-before-after-image rk-before-after-after" src={after.src} alt={after.alt} width={before.width} height={before.height} loading="lazy" decoding="async" /></div>
  <span class="rk-before-after-divider" aria-hidden="true"><span class="rk-before-after-handle"></span></span>
  <span class="rk-before-after-label is-before">Before</span><span class="rk-before-after-label is-after">After</span>
  <input class="rk-before-after-range" type="range" min="0" max="100" bind:value={position} aria-label="Drag to compare before and after images" aria-valuetext={`${position}% after image visible`} />
</figure>
