<script lang="ts">
  import roofr from '../data/roofr.json';
  import site from '../data/site.json';
</script>

<section class="roofr-estimator" id="roofr-estimator" aria-labelledby="roofr-estimator-title">
  <div class="estimator-layout">
    <div class="estimator-intro">
      <p class="estimator-eyebrow">Roofing cost calculator</p>
      <h2 id="roofr-estimator-title">Get your instant roof estimate</h2>
      <p>Answer a few questions about your property in Roof King's Roofr estimator. Your result is an estimated price range.</p>
      <div class="estimator-note">
        <span class="note-line" aria-hidden="true"></span>
        <h3>From estimate to inspection</h3>
        <p>A roof inspection identifies the materials, tear-off, decking repairs and installation needed for your written estimate.</p>
      </div>
      <a class="estimator-phone" href={site.phoneHref} title={'Call Roof King at '+site.phone}>Questions? Call {site.phone}<span aria-hidden="true">↗</span></a>
    </div>
    <div class="estimator-tool">
      <div class="estimator-toolbar"><span>Roof replacement estimate</span><span class="provider-label">Powered by Roofr</span></div>
      <iframe src={roofr.estimatorUrl} title="Roof King instant roof estimate" width="800" height="820" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <div class="estimator-fallback"><span>Prefer a separate window?</span><a title="Open the roofing estimator in a new tab" href={roofr.estimatorUrl} target="_blank" rel="noopener noreferrer">Open calculator<span aria-hidden="true">↗</span></a></div>
    </div>
  </div>
</section>

<style>
 .roofr-estimator{width:100%;margin:clamp(2rem,5vw,4rem) auto;scroll-margin-top:1.5rem;color:#242321;}
 .estimator-layout{display:grid;grid-template-columns:minmax(250px,.75fr) minmax(0,1.75fr);background:#242321;border-top:3px solid #fe6600;}
 .estimator-intro{position:relative;padding:clamp(1.5rem,3vw,2.5rem);color:#fcfaf5;background:linear-gradient(115deg,transparent 72%,rgb(255 255 255 / 3%) 72%);}
 .estimator-eyebrow{margin:0 0 1.25rem;color:#ffad70;font-size:.68rem;line-height:1.5;letter-spacing:.12em;text-transform:uppercase;font-weight:700;}
 h2{margin:0 0 1.25rem;color:#fcfaf5;font-size:clamp(1.6rem,2.5vw,2.25rem);line-height:1.18;max-width:15ch;}
 .estimator-intro>p:not(.estimator-eyebrow){color:#e7e1d8;font-size:.95rem;line-height:1.75;margin:0;}
 .estimator-note{margin-top:2rem;padding-top:1.5rem;border-top:1px solid #514c45;}
 .note-line{display:block;width:30px;height:2px;background:#fe6600;margin-bottom:1rem;}
 h3{font-size:.95rem;line-height:1.45;color:#fcfaf5;margin:0 0 .7rem;}
 .estimator-note p{color:#cfc8be;font-size:.83rem;line-height:1.75;margin:0;}
 .estimator-phone{display:flex;gap:.75rem;justify-content:space-between;align-items:center;margin-top:2rem;padding-top:1rem;border-top:1px solid #514c45;color:#fcfaf5;font-size:.8rem;text-decoration:none;line-height:1.6;}
 .estimator-phone span{color:#ffad70;}
 .estimator-tool{min-width:0;background:#fff;border:1px solid #d9d1c4;border-top:0;}
 .estimator-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;padding:1rem 1.25rem;border-bottom:1px solid #e7e1d8;background:#f8f5ee;font-size:.75rem;font-weight:600;}
 .provider-label{color:#716a61;font-size:.68rem;font-weight:400;}
 iframe{display:block;width:100%;height:820px;border:0;background:#f7f8fa;}
 .estimator-fallback{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1rem 1.25rem;background:#f8f5ee;border-top:1px solid #e7e1d8;color:#716a61;font-size:.75rem;}
 .estimator-fallback a{display:inline-flex;align-items:center;gap:.75rem;color:#242321;text-decoration:none;border-bottom:1px solid #b44c05;padding-bottom:.2rem;font-weight:600;}
 a:hover{color:#ee6b16;}a:focus-visible{outline:3px solid #fe6600;outline-offset:4px;}
 @media(max-width:900px){.estimator-layout{grid-template-columns:minmax(0,1fr);}.estimator-intro{padding:1.5rem;}h2{max-width:24ch;}.estimator-note{margin-top:1.25rem;padding-top:1rem;}.estimator-phone{margin-top:1.25rem;}}
 @media(max-width:600px){.roofr-estimator{margin:1.5rem auto;}.estimator-intro{padding:1.25rem;}h2{font-size:1.65rem;}.estimator-toolbar,.estimator-fallback{padding:.85rem 1rem;}iframe{height:860px;}}
</style>
