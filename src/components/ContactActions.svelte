<script lang="ts">
  import contact from '../data/project-contact.json';
  import site from '../data/site.json';
  let { showIntro=true }: {showIntro?:boolean} = $props();
</script>
<div class="rk-contact-actions" data-contact-actions>
  {#if showIntro}<h3>{contact.title}</h3><p>{contact.description}</p>{/if}
  <div class="rk-contact-actions-links">
    <a class="rk-button rk-button-primary" href={contact.bookingUrl} title="Book a Roof King inspection" target="_blank" rel="noopener noreferrer">{contact.bookingLabel}<span aria-hidden="true">→</span></a>
    <a class="rk-button rk-button-outline" href={site.phoneHref} title={`Call Roof King at ${site.phone}`}>Call {site.phone}</a>
  </div>
</div>
