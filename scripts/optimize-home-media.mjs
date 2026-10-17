import fs from 'node:fs/promises';
import sharp from 'sharp';

// Explicit authoring tool: run after changing homepage media, then commit its output.
const home = JSON.parse(await fs.readFile('src/data/home.json', 'utf8'));
const sources = new Set(['/media/wordpress/2b1fb60b5770-logo.png', home.hero.image]);
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (value.src?.startsWith('/media/wordpress/')) sources.add(value.src);
  Object.values(value).forEach(collect);
}
collect(home);
await fs.mkdir('public/media/home', { recursive: true });
const media = {};
for (const src of sources) {
  const original = 'public' + src;
  const metadata = await sharp(original).metadata();
  const variants = [];
  const widths = [480, 800, 1280, 1920].filter(width => width <= metadata.width);
  for (const width of widths) {
    const dest = '/media/home/' + src.split('/').pop().replace(/\.[^.]+$/, '') + '-' + width + '.webp';
    await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile('public' + dest);
    variants.push({ src: dest, width });
  }
  media[src] = { width: metadata.width, height: metadata.height, variants };
}
await fs.writeFile('src/data/home-media.json', JSON.stringify(media, null, 2) + '\n');
console.log(`Prepared dimensions and responsive media for ${sources.size} homepage images.`);
