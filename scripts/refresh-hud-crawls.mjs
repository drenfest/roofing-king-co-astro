import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refreshReportingAccessToken } from './hud-reporting-auth.mjs';

export async function collectCrawls({ report, previous = {}, accessToken, request = fetch, pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), now = new Date().toISOString(), limit = 1000 }) {
  const pages = new Map(Object.entries(previous.pages || {}));
  const urls = [...new Set(report.rows.map((row) => row.page))].filter((value) => {
    try { const url = new URL(value); return ['roofkingco.com', 'www.roofkingco.com'].includes(url.hostname) && url.protocol === 'https:'; } catch { return false; }
  }).sort((a, b) => (pages.get(a)?.observed_at || '').localeCompare(pages.get(b)?.observed_at || ''));
  let inspected = 0;
  for (const url of urls) {
    if (inspected >= limit) break;
    if (Date.parse(now) - Date.parse(pages.get(url)?.observed_at) < 24 * 60 * 60 * 1000) continue;
    await pause(500);
    const response = await request('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST', signal: AbortSignal.timeout(30000),
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: 'sc-domain:roofkingco.com', languageCode: 'en-US' })
    });
    if (!response.ok) throw new Error(`URL inspection stopped (${response.status}); previous crawl snapshot preserved`);
    const result = (await response.json()).inspectionResult?.indexStatusResult;
    if (!result) throw new Error('URL inspection result missing; previous crawl snapshot preserved');
    pages.set(url, { observed_at: now, last_crawl_time: Number.isFinite(Date.parse(result.lastCrawlTime)) ? result.lastCrawlTime : null,
      verdict: result.verdict || '', page_fetch_state: result.pageFetchState || '' });
    inspected++;
  }
  const events = [...pages.entries()].filter(([, item]) => item.last_crawl_time).map(([url, item]) => ({
    event_id: `crawl:${url}:${item.last_crawl_time}`, event_type: 'google_crawl', timestamp: item.last_crawl_time,
    last_crawl_time: item.last_crawl_time, observed_at: item.observed_at, urls: [url], title: 'Google crawl recorded',
    source: 'Search Console URL Inspection', metadata: { verdict: item.verdict, page_fetch_state: item.page_fetch_state }
  }));
  return { refreshed_at: now, inspected, pages: Object.fromEntries(pages), events };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [privateDirectory] = process.argv.slice(2);
  if (!privateDirectory) throw new Error('Pass the private HUD directory');
  const config = JSON.parse(await fs.readFile(path.join(privateDirectory, 'reporting-oauth.json'), 'utf8'));
  const report = JSON.parse(await fs.readFile(path.join(privateDirectory, 'data/dashboard.json'), 'utf8'));
  const destination = path.join(privateDirectory, 'data/crawl-observations.json');
  const previous = await fs.readFile(destination, 'utf8').then(JSON.parse).catch((error) => { if (error.code === 'ENOENT') return {}; throw error; });
  const result = await collectCrawls({ report, previous, accessToken: await refreshReportingAccessToken(config) });
  const temporary = `${destination}.${process.pid}.uploading`;
  try {
    await fs.writeFile(temporary, JSON.stringify(result), { mode: 0o640, flag: 'wx' });
    await fs.rename(temporary, destination);
  } finally { await fs.rm(temporary, { force: true }); }
  console.log(`Crawl snapshot refreshed: ${result.inspected} inspections, ${result.events.length} recorded crawl dates.`);
}
