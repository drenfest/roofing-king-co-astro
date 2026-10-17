# Roof King Rebuild Recommendations — v1

Date: October 17, 2026

## Recommendation

Continue the existing custom WordPress redesign, preserve the existing URLs, and improve the content and page hierarchy.

The goal is to retain and improve existing pages while giving the main commercial pages the strongest navigation, homepage placement, relevant internal links, and conversion opportunities. Secondary placement should mean a narrower purpose, not lower quality.

## What We Have to Work With

Both live sites, the local redesign, its database, theme files, and previous crawl reports were inspected.

| Asset | What is available |
|---|---|
| Original clone | 145 imported content records |
| Current local redesign | 150 published records: 95 pages, 20 articles, 15 projects, 10 offers, and 10 reviews |
| Jared's website | 61 pages, all returning HTTP 200 during the fresh crawl |
| Combined inventory | 195 distinct URL paths, including archives and URL variants |
| Local media | 493 files, including images and variants; not 493 distinct projects |

The custom theme already supports reusable blocks, galleries, testimonials, projects, editable menus, and centralized business information. Its ivory, dark green/teal, orange, and crown styling gives the redesign a distinct identity.

The [established website](https://www.roofkingco.com/) supplies the broader content footprint. [Jared's build](https://www.roof-kingco.com/) supplies useful newer routes and clearer navigation, but its gallery and blog remain placeholders.

Keep the existing visual direction, shorten oversized heroes, make headings and service choices clearer, and favor relevant project evidence over repeated generic sections.

## Inventory and Evidence

The searchable assessment includes every discovered route, its local behavior, proposed placement, and a rewrite brief:

- [Searchable inventory and build assessment](wp-content/themes/roofkingco/data/audits/2026-10-17/build-assessment.html)
- [Combined URL inventory](wp-content/themes/roofkingco/data/audits/2026-10-17/url-inventory.json)
- [Local WordPress inventory](wp-content/themes/roofkingco/data/audits/2026-10-17/local-inventory.json)
- [Hyphenated-domain crawl](wp-content/themes/roofkingco/data/audits/2026-10-17/hyphenated-crawl.json)
- [Browser-observed established-site paths](wp-content/themes/roofkingco/data/audits/2026-10-17/browser-observed-paths.json)

The same path across domains is combined into one inventory row. Published records, archive routes, and alternate URL forms are different concepts; the inventory records both published permalinks and observed HTTP behavior.

## Confirmed Problems

Across the 195 discovered paths:

- **32 return local HTTP 404**, including 16 blog category/author archives, newer suburb pages, Events, and the August storm article.
- **13 redirect locally.** Nine current clean blog URLs redirect to the older imported `/blog/p.NUMBER/slug/` format. About and contact variants also redirect, and both privacy variants resolve to `/privacy-policy-2/`.
- `/privacy-policy/` does not retain its exact path locally; it redirects to `/privacy-policy-2/`.
- **15 direct-200 routes lack an H1**, including several main service pages. The local `/roofing/` page also lacks its visible main hero heading.
- Local business settings and some hardcoded templates still use the old phone number, **(614) 490-0123**, and ZIP code **43085**.
- The shared local quote form sends a **GET request to the contact page**. It needs a real server-side lead-delivery implementation, validation, error handling, confirmed success, and conversion events. Form values should not travel in URL query strings.

The previous report that 145 routes passed local checks is historical evidence, not sufficient verification for the current launch.

Use the business details supplied by Jared consistently throughout settings, templates, content, and structured data:

- 6155 Huntley Rd, Unit L, Columbus, OH 43229
- (614) 379-8893

Analytics, conversion delivery, and structured data require implementation or verification. Only inactive default plugins were installed locally at the time of inspection. No test lead was submitted during this assessment.

## Recommended Page Hierarchy

These priorities are based on service intent. They should be validated against business priorities, Search Console, and actual lead/revenue data before final keyword ownership is assigned.

| Placement | Pages | Treatment |
|---|---|---|
| Primary | Roofing, roof replacement, roof repair, storm damage, commercial roofing, siding, gutters | Prominent navigation and homepage placement, strong relevant project evidence, clear scope, and tested conversion opportunities |
| Secondary | Material pages, specialized services, city pages, city/service combinations | Accessible through service and location hubs and relevant contextual links; each page addresses its own intent |
| Supporting | Articles, cost guides, project details, reviews, warranties, financing, tools | Answer specific questions or provide evidence, then link naturally to the appropriate commercial pages |

Proposed primary service paths:

- `/roofing/`
- `/roofing/replacement/`
- `/roofing/repair/`
- `/storm-damage/`
- `/commercial-roofing/`
- `/siding/`
- `/gutters/`

The homepage provides the broad brand and Columbus introduction. Service pages focus on their specific services. Contact and inspection destinations support conversion across all tiers.

Google recommends crawlable, descriptive internal links to help it discover and understand pages: [Google Search Central link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

## Improve the Existing Pages

### Roof Repair

Explain leak diagnosis, common failure points, repair options, limitations, and repair-versus-replacement decisions. Include relevant repair examples and FAQs. A repair page should not be dominated by a full-replacement pitch.

### Roof Replacement

Explain inspection, tear-off and decking decisions, materials, ventilation, installation scope, cost drivers, cleanup, and confirmed warranties. Support the page with authentic project evidence.

### City and City/Service Pages

Add verified local work, actual project photos, accurate coverage details, relevant local conditions, and useful city-specific questions. Distinguish a city overview from its roofing, storm-damage, repair, or cost pages.

For example, a Dublin repair page should provide verified local repair examples and useful local context, then link to the main repair service and relevant Dublin resources.

Do not invent neighborhood jobs, local offices, addresses, or response guarantees.

### Existing Articles

Retain each URL and replace filler with a clear answer to the original topic. Explain choices, add supporting evidence, and guide readers toward the appropriate service. Similar article titles alone are not proof that a page was penalized.

### Projects, Reviews, Offers, and Tools

Preserve individual project and review URLs. Strengthen them with verified scope, location, materials, photos, and source attribution where available.

Verify financing and warranty terms. Keep historical offer URLs useful without presenting expired offers as current.

Verify that calculators, visualizers, and reports function independently of the old hosting platform. A working URL alone does not prove that an embedded tool works.

## URL Preservation Rules

1. Treat the inventory as a route contract. Retain existing content paths and append newly discovered historical URLs.
2. Improve existing pages rather than deleting them or redirecting them into broader service pages as the default approach.
3. Serve real content with a genuine HTTP 200 at each protected path. Restore category and author routes through appropriate archive routing where applicable.
4. Change navigation placement without unnecessarily changing URLs or WordPress page parents.
5. Keep secondary pages discoverable through relevant hubs and contextual links. They should not become orphan pages.
6. Give distinct useful pages their own canonical URLs. Do not canonicalize all secondary pages to the main roofing page merely to emphasize it.
7. For identical historical URL variants of one article or policy, support the incoming routes and select the canonical using traffic and backlink evidence.
8. Review WordPress's automatic redirects where exact path preservation is required. Do not return the homepage for every missing URL.
9. Keep `roofkingco.com` as the primary domain. A move from the hyphenated domain should preserve the path to its equivalent working destination, rather than send every URL to the homepage.

Canonical URLs address duplicate or very similar versions; they are not a general mechanism for promoting a service hub: [Google Search Central canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Recommended Work Order

1. **Restore route coverage:** reconcile current and historical paths, resolve missing routes and unwanted path changes, and establish the protected URL inventory.
2. **Fix shared issues:** headings, business details, templates, lead delivery, analytics, and conversion tracking.
3. **Strengthen the main service pages:** assign clear intent, improve content and project evidence, and give these pages appropriate navigation and homepage emphasis.
4. **Rewrite supporting pages in related groups:** service details, cities, articles, projects, and resources should support the relevant commercial destinations while remaining useful themselves.
5. **Verify the launch:** check protected routes, content, canonicals, internal links, mobile layouts, assets, form delivery, and tracking before and after the production domain switch.

Track successful leads and phone clicks with landing-page and traffic-source information so attribution can be measured alongside search visibility.

Git deployment transfers theme files. WordPress pages, menus, settings, and other database content require a separate database migration.

## Coverage Limits and Current Status

The **195-route inventory is a discovered baseline**, not a guarantee that every historical URL has been found.

The established site blocked direct Node HTTP requests with Cloudflare. Its rendered HTML sitemap and blog links were inspected through the browser. The saved clone is dated June 29, 2026. All 195 discovered routes received fresh local HTTP checks, and all 61 pages in the hyphenated-domain crawl returned HTTP 200.

Before launch, reconcile the inventory with Search Console, analytics landing pages, backlink targets, and the old host's complete URL export to catch historical URLs that are not linked publicly.

This assessment created the inventory and recommendations. It did not change website content, the WordPress database, DNS, or production settings.
