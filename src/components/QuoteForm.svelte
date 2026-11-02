<script lang="ts">
  import ContactActions from './ContactActions.svelte';
  let completed = $state(false);
  let { id, compact=false, showActions=true }: { id: string; compact?:boolean; showActions?:boolean } = $props();
  const projects = ['Roofing', 'Commercial Services', 'Siding', 'Storm Damage', 'Gutters', 'Windows', 'Decks', 'Attic Insulation', 'Ice Dams'];
</script>
<form class="rk-quote-form" method="dialog" data-form-mode="preview" data-contact-options={showActions ? "included" : "beside-form"} aria-describedby={`${id}-status`} onsubmit={event => { event.preventDefault(); completed = true; }}>
  <p id={`${id}-status`} class="rk-form-status" role="status">{completed ? "Preview complete. No request has been sent." : "Form preview: explore the fields below. Requests are not sent from this preview."}</p>
  <div class="rk-form-grid">
    <label for={`${id}-name`}><span>Full name</span><input id={`${id}-name`} type="text" name="name" autocomplete="name" placeholder="Full name" required /></label>
    <label for={`${id}-email`}><span>Email address</span><input id={`${id}-email`} type="email" name="email" autocomplete="email" placeholder="Email address" required /></label>
    <label for={`${id}-phone`}><span>Phone number</span><input id={`${id}-phone`} type="tel" name="phone" autocomplete="tel" placeholder="Phone number" required /></label>
    <label for={`${id}-address`}><span>Full address</span><input id={`${id}-address`} type="text" name="address" autocomplete="street-address" placeholder="Full address" required /></label>
    <label for={`${id}-project`}><span>Project type</span><select id={`${id}-project`} name="project" required><option value="">Project type</option>{#each projects as project}<option>{project}</option>{/each}</select></label>
    <label for={`${id}-appointment`}><span>Request appointment?</span><select id={`${id}-appointment`} name="appointment"><option>No</option><option>Yes</option></select></label>
  </div>
  <label for={`${id}-message`}><span>Project description</span><textarea id={`${id}-message`} name="message" rows={compact?3:4} placeholder="Tell us about your project"></textarea></label>
  <label class="rk-consent-field" for={`${id}-consent`}><input id={`${id}-consent`} type="checkbox" name="sms_consent" value="1" /><span>By checking this box, I consent to receive marketing text messages from Roof King &amp; Restoration at the phone number provided. Frequency may vary. Message and data rates may apply. Text HELP for assistance, reply STOP to opt out. I also consent to receive non-marketing text messages about order updates, appointment reminders, and project communication. I understand that this authorization is not required as a condition of doing business with Roof King &amp; Restoration, and I agree to the <a title="Terms of Use" href="/terms/">Terms of Use</a> and <a title="Privacy Policy" href="/privacy-policy/">Privacy Policy</a>.</span></label>
  <button class="rk-button rk-button-primary" type="submit">Preview request</button>
</form>
{#if showActions}<ContactActions showIntro={false}/>{/if}

<style>
 form{min-width:0;box-shadow:none;}
 .rk-form-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
 input,select,textarea{box-sizing:border-box;min-width:0;}
 .rk-form-status{color:#242321;background:#eee8de;padding:.75rem;margin:0 0 1rem;font-size:.8rem;line-height:1.5;}
 .rk-consent-field{grid-template-columns:18px minmax(0,1fr);font-size:.7rem;line-height:1.5;font-weight:400;}
 .rk-consent-field input{width:18px;height:18px;min-height:18px;padding:0;}
 @media(max-width:600px){.rk-form-grid{grid-template-columns:minmax(0,1fr);}}
</style>
