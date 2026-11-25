import { robotsTxt } from '../../scripts/indexing-policy.mjs';
export function GET() {
  return new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain' } });
}
