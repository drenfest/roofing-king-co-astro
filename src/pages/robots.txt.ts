import site from '../data/site.json';
export function GET() {
  return new Response(`User-agent: *\nDisallow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
