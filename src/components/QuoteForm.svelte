<script lang="ts">
  import site from '../data/site.json';
  let { id }: { id: string } = $props();
  const projects = ['Roofing', 'Commercial Services', 'Siding', 'Storm Damage', 'Gutters', 'Windows', 'Decks', 'Attic Insulation', 'Ice Dams'];
</script>
<form class="rk-quote-form" method="dialog" aria-describedby={`${id}-status`} onsubmit={event => event.preventDefault()}>
  <div class="rk-form-grid">
    <label for={`${id}-name`}><span>Full Name</span><input id={`${id}-name`} type="text" name="name" autocomplete="name" placeholder="Full Name" required /></label>
    <label for={`${id}-email`}><span>Email Address</span><input id={`${id}-email`} type="email" name="email" autocomplete="email" placeholder="Email Address" required /></label>
    <label for={`${id}-phone`}><span>Phone Number</span><input id={`${id}-phone`} type="tel" name="phone" autocomplete="tel" placeholder="Phone Number" required /></label>
    <label for={`${id}-address`}><span>Full Address</span><input id={`${id}-address`} type="text" name="address" autocomplete="street-address" placeholder="Full Address" required /></label>
    <label for={`${id}-project`}><span>Project Type</span><select id={`${id}-project`} name="project" required><option value="">Project Type</option>{#each projects as project}<option>{project}</option>{/each}</select></label>
    <label for={`${id}-appointment`}><span>Request appointment?</span><select id={`${id}-appointment`} name="appointment"><option>No</option><option>Yes</option></select></label>
  </div>
  <label for={`${id}-message`}><span>Project Description</span><textarea id={`${id}-message`} name="message" rows="4" placeholder="Project Description"></textarea></label>
  <label class="rk-consent-field" for={`${id}-consent`}><input id={`${id}-consent`} type="checkbox" name="sms_consent" value="1" /><span>By checking this box, I consent to receive marketing text messages from Roof King &amp; Restoration at the phone number provided. Frequency may vary. Message and data rates may apply. Text HELP for assistance, reply STOP to opt out. I also consent to receive non-marketing text messages about order updates, appointment reminders, and project communication. I understand that this authorization is not required as a condition of doing business with Roof King &amp; Restoration, and I agree to the <a href="/terms/">Terms of Use</a> and <a href="/privacy-policy-2/">Privacy Policy</a>.</span></label>
  <p id={`${id}-status`} class="rk-form-status">Online quote requests are coming soon. For help with your project, <a href={site.phoneHref}>call {site.phone}</a> or <a href="https://calendly.com/roofkingco-info/30-minute-roof-deck-inspection" target="_blank" rel="noopener noreferrer">book an inspection</a>.</p>
  <button class="rk-button rk-button-primary" type="submit" disabled>Get a Free Quote</button>
</form>
