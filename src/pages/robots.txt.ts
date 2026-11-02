import site from '../data/site.json';
export function GET() {
  // Crawlers need access to read the noindex HTTP header and page metadata.
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
