# Blog resource hubs

[hub].astro renders the client-requested /blog/categories/ and /blog/topics/ hubs from blog-hubs.json. Existing category, tag and article URLs remain unchanged. Both hubs use the native shell, breadcrumbs, optimized lazy thumbnails and static collection/article links. Keep this context file prefixed with an underscore so Astro does not expose it as a route.


index.astro renders the native main blog with BlogLayout and CardSection. Both hub routes also use BlogLayout; BlogHub only maps collection data into shared CardSection props. Photographic PageHero and styled Breadcrumbs match other native pages.


Main blog index enables CardSection.filterable. BlogHub and BlogArchive use the same filterable card composition for category/topic directory and archive pages.
