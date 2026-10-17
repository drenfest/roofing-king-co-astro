# Roofr website integration

Verified October 17, 2026 through the signed-in Roof King & Restoration account. This document contains configuration observations, not customer records or credentials.

## Confirmed configuration

- Zapier is already connected. An existing lead-related token is present; no token was created, copied into this repository, rotated or deleted. The token's presence does not verify a working website automation.
- A published Instant Estimator named **Website** already exists (estimator 14507). Its public share/embed URL is in `src/data/roofr.json`.
- Its default job owner is currently **Jared Lane**, and its public point of contact is **Roof King & Restoration**. The user confirmed Jared Lane as the lead owner for the new website.
- The Website estimator's scheduling link is blank. The website already links to the existing Calendly roof/deck inspection booking page. A request for an appointment must not be presented as a confirmed booking.
- Existing Roofr automations include SMS and email actions. No automation was enabled, disabled, edited or tested during discovery.
- Roofr's Integrations screen shows Gmail and Google Calendar as available to connect. Do not connect an incidental developer account as the company's inbox/calendar.

## Implemented in the site

Both `/roof-calculator/` and `/roofing-calculator/` retain their existing page content, URL and canonical and now include `RoofrEstimator.svelte`. It loads the official iframe only after the visitor starts the estimator. A direct share link works without JavaScript and provides an embed fallback. No price calculation is duplicated in the site's JavaScript.

The native homepage quote form remains disconnected and disabled. No test customer or job has been created. No live Roofr configuration was changed.

## Quote form delivery to finish

Recommended path, subject to inspection of the existing Zapier setup:

1. Website form submits to a same-origin server endpoint with validation and abuse protection.
2. The endpoint sends the normalized lead to the existing or dedicated Zapier intake. Webhook URLs and Roofr credentials stay in server deployment secrets, not browser bundles, public JSON, Markdown, or GitHub workflow logs.
3. Zapier creates or matches the customer and creates the Roofr job, using verified workflow/stage and owner mappings. Check the current connector's matching actions before defining duplicate handling.
4. Return an honest receipt state only after a durable, verified intake. A webhook receipt alone must not claim that a job was created or an appointment booked. Monitor/retry downstream failures.

The published Zapier **Create Job and Customer** action requires first name, last name, street address, city, state/province, postal code and country. The homepage currently has full name and full address fields, so these need structured collection/normalization before connection. Do not silently guess name or address components.

Map phone, email, project type, project description and appointment request. Preserve optional SMS consent with timestamp and policy/version evidence independently of the quote request. Verify where those values can be stored; do not assume arbitrary Roofr custom fields are supported.

For attribution, capture landing page and submitted page, referrer, UTM source/medium/campaign/content/term and a submission ID. Establish the matching Roofr source/note fields through the connector. The estimator's unique Website link identifies that estimator; cross-origin iframe completion tracking and UTM propagation are not yet verified. An iframe load is not a conversion.

## Remaining decisions and acceptance checks

- The user deferred Zapier configuration. Inspect the correct Roof King Zapier account and website lead automation when that work resumes.
- Keep Jared Lane as the confirmed lead owner; confirm workflow/stage and non-roofing service routing. Do not infer that all storm inquiries belong in an insurance workflow.
- Confirm the business booking calendar and populate the estimator's blank scheduling link if desired.
- Use explicit test contacts and inspect notification behavior before creating test jobs; live automations can send messages.
- Verify one submission creates the intended customer/job, attribution and consent survive, errors retain entered data, repeat clicks do not duplicate leads, and a confirmed receipt corresponds to the real downstream outcome.
- Keep indexing blocked and custom form submission disabled until the delivery path passes these checks.

## Primary references

- [Roofr Instant Estimator marketing and source tracking](https://academy.roofr.com/lesson-videos/marketing-your-instant-estimator)
- [Roofr actions in Zapier](https://zapier.com/apps/roofr/integrations/zapier-forms)
- [Roofr's estimator and calendar links](https://roofr.com/estimator)
