<script lang="ts">
  type Route = { path: string; source: string; words: number; canonicalPath: string };
  let { routes }: { routes: Route[] } = $props();
  let query = $state('');
  let filtered = $derived(routes.filter(route => `${route.path} ${route.source}`.toLowerCase().includes(query.toLowerCase())));
</script>

<section class="rk-review-dashboard">
  <h1>Content migration review</h1>
  <p>All {routes.length} preserved paths. Content is imported for review; component and editorial work is still pending.</p>
  <label for="route-search">Find a route or content source</label>
  <input id="route-search" type="search" bind:value={query} placeholder="Search roofing, blog, archive..." />
  <p aria-live="polite">{filtered.length} routes shown</p>
  <div class="rk-review-table">
    <table>
      <thead><tr><th scope="col">Path</th><th scope="col">Source</th><th scope="col">Words</th><th scope="col">Canonical path</th></tr></thead>
      <tbody>{#each filtered as route}<tr><td><a href={route.path}>{route.path}</a></td><td>{route.source}</td><td>{route.words}</td><td>{route.canonicalPath}</td></tr>{/each}</tbody>
    </table>
  </div>
</section>
