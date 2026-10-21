# Service and menu imagery

Service tabs display each destination hero directly after the eyebrow. All 84 native service pages have their own illustrative custom scene; this update adds the remaining 43.

New hero images were created with built-in image generation. The full prompt set and saved source/variant paths are in [service-hero-images.json](service-hero-images.json). Originals remain in `output/imagegen/service-heroes/`; the public site serves only responsive WebP assets in `public/media/service-heroes/` at 640, 960, 1280 and up to 1600 pixels. All new variants are under 240 KB.

The menu uses one content-hashed WebP atlas, `public/media/navigation/menu-thumbnails-03ff3e3a7f40.webp`: 120 distinct destination thumbnails, 644,630 bytes. It loads on first menu opening, is shared across preview instances, and is cached for one year on the review server (the Apache configuration also requests immutable caching). Hover and toggle changes select a different cell without another image transfer. Desktop thumbnails render at their native size; phone previews use a compact 96px square.

The three additional seasonal/deck menu concepts also used built-in image generation. Their full prompts and saved paths are in [navigation-extra-images.json](navigation-extra-images.json). Their source PNGs remain in `output/imagegen/navigation/`; 640px authoring inputs live under `public/media/navigation/`. The menu requests the atlas, not these individual inputs.

Image provenance and unique normalized-pixel fingerprints for every menu destination are in `src/data/navigation-images.json`. Genuine manufacturer artwork and shingle color samples remain intact. Generated scenes are labeled illustrative and do not represent verified customer projects or exact named-manufacturer installations.


The ice-dam hero was edited to show a raised ice ridge on the roof with water backed up upslope, rather than only ice at the gutter. The original and revised prompts and assets are recorded in roofing-hero-images.json; the menu atlas was refreshed to match.
