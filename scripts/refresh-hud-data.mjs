import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { load } from './hud-data-loader.mjs';
import { refreshReportingAccessToken } from './hud-reporting-auth.mjs';
import { publishHudReport } from './hud-refresh-publication.mjs';

const args = parseArgs(process.argv.slice(2));
const runDate = args.date || todayLocal();
const lagDays = Number(args.lagDays || 2);
let endDate = args.endDate || shiftDate(runDate, -lagDays);
const historyStart = parseDate(endDate);
historyStart.setUTCDate(1);
historyStart.setUTCMonth(historyStart.getUTCMonth() - 15);
const startDate = args.startDate || iso(historyStart);
const configPath = path.resolve(args.config || path.join(
  os.homedir(),
  '.codex',
  'automations',
  'daily-search-console-seo-report',
  'search-console.local.json'
));
const outputPath = path.resolve(args.output || `output/hud-reporting/search-console-page-query-comparisons-${runDate}.csv`);
const publishPath = args.publish ? path.resolve(args.publish) : null;
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const property = 'sc-domain:roofkingco.com';
const searchType = String(config.searchType || 'web').toLowerCase();
const accessToken = await refreshReportingAccessToken(config);

const pageRows = [];
const pageQueryRows = [];
for (const range of monthRanges(startDate, endDate)) {
  pageRows.push(...await fetchRows({
    accessToken,
    property,
    searchType,
    startDate: range.start,
    endDate: range.end,
    dimensions: ['date', 'page'],
    aggregationType: 'byPage'
  }));
  pageQueryRows.push(...await fetchRows({
    accessToken,
    property,
    searchType,
    startDate: range.start,
    endDate: range.end,
    dimensions: ['date', 'page', 'query'],
    aggregationType: 'byPage'
  }));
}

if (!pageRows.length) throw new Error('Search Console returned no page data; last report preserved');
let latestAvailable = '';
for (const row of pageRows) if (row.keys?.[0] > latestAvailable) latestAvailable = row.keys[0];
if (latestAvailable < endDate) endDate = latestAvailable;

const pageAggregates = new Map();
const queryAggregates = new Map();
for (const row of pageRows) {
  const [date, page] = row.keys || [];
  for (const period of periodsForDate(date)) {
    addMetric(pageAggregates, [period.type, period.start, page], row);
  }
}
for (const row of pageQueryRows) {
  const [date, page, query] = row.keys || [];
  for (const period of periodsForDate(date)) {
    addMetric(queryAggregates, [period.type, period.start, page, query], row);
  }
}

const queriesByPeriodPage = new Map();
for (const [key, metric] of queryAggregates) {
  const [periodType, periodStart, page, query] = JSON.parse(key);
  const groupKey = JSON.stringify([periodType, periodStart, page]);
  if (!queriesByPeriodPage.has(groupKey)) queriesByPeriodPage.set(groupKey, []);
  queriesByPeriodPage.get(groupKey).push({ query, metric });
}

const typeOrder = new Map([['Week', 0], ['Month', 1], ['Quarter', 2]]);
const sortedPages = [...pageAggregates.entries()].sort((a, b) => {
  const [aType, aStart, aPage] = JSON.parse(a[0]);
  const [bType, bStart, bPage] = JSON.parse(b[0]);
  return typeOrder.get(aType) - typeOrder.get(bType)
    || aStart.localeCompare(bStart)
    || b[1].impressions - a[1].impressions
    || aPage.localeCompare(bPage);
});

const outputRows = [[
  'Period Type',
  'Period Label',
  'Period Start',
  'Period End',
  'Data Through',
  'Complete Period',
  'Page',
  'Page Clicks',
  'Page Impressions',
  'Page CTR',
  'Page Average Position',
  'Query',
  'Query Clicks',
  'Query Impressions',
  'Query CTR',
  'Query Average Position',
  'Search Type'
]];

let pagesWithoutQueries = 0;
for (const [key, pageMetric] of sortedPages) {
  const [periodType, periodStart, page] = JSON.parse(key);
  const period = periodFromStart(periodType, periodStart);
  const groupKey = JSON.stringify([periodType, periodStart, page]);
  const queries = queriesByPeriodPage.get(groupKey) || [];
  queries.sort((a, b) => b.metric.impressions - a.metric.impressions || a.query.localeCompare(b.query));
  if (!queries.length) pagesWithoutQueries += 1;
  const rows = queries.length ? queries : [{ query: '', metric: emptyMetric() }];
  for (const { query, metric } of rows) {
    outputRows.push([
      periodType,
      period.label,
      period.start,
      period.end,
      period.end < endDate ? period.end : endDate,
      period.start >= startDate && period.end <= endDate ? 'Yes' : 'No',
      page,
      pageMetric.clicks,
      pageMetric.impressions,
      decimal(pageMetric.clicks / pageMetric.impressions),
      decimal(pageMetric.positionWeighted / pageMetric.impressions),
      query,
      query ? metric.clicks : '',
      query ? metric.impressions : '',
      query ? decimal(metric.clicks / metric.impressions) : '',
      query ? decimal(metric.positionWeighted / metric.impressions) : '',
      searchType
    ]);
  }
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `\uFEFF${outputRows.map((row) => row.map(csvValue).join(',')).join('\n')}\n`, 'utf8');
const data = await load(path.dirname(outputPath));
if (data.error || !data.rows.length) throw new Error(data.error || 'No Roof King data returned');
data.report.refreshedAt = new Date().toISOString();
data.report.property = property;
const serialized = JSON.stringify(data);
await fs.writeFile(path.join(path.dirname(outputPath), 'dashboard.json'), serialized, { mode: 0o640 });
if (publishPath) await publishHudReport(data, publishPath);

console.log(JSON.stringify({
  outputPath,
  property,
  startDate,
  endDate,
  dailyPageRows: pageRows.length,
  dailyPageQueryRows: pageQueryRows.length,
  periodPageRows: pageAggregates.size,
  periodPageQueryRows: queryAggregates.size,
  pagesWithoutDisclosedQueries: pagesWithoutQueries,
  outputDataRows: outputRows.length - 1
}, null, 2));

async function fetchRows({ accessToken: token, property: site, searchType: type, startDate: start, endDate: end, dimensions, aggregationType }) {
  const rows = [];
  const rowLimit = 25000;
  for (let startRow = 0; ; startRow += rowLimit) {
    const body = { startDate: start, endDate: end, dimensions, type, rowLimit, startRow, aggregationType, dataState: 'final' };
    await new Promise(resolve => setTimeout(resolve, 200));
    const response = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: 'POST',
      signal: AbortSignal.timeout(30000),
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Search Console query failed (${response.status}) for ${dimensions.join(', ')}: ${payload.error?.message || response.statusText}`);
    }
    const batch = payload.rows || [];
    rows.push(...batch);
    if (batch.length < rowLimit) break;
  }
  return rows;
}

function addMetric(map, keyParts, row) {
  const key = JSON.stringify(keyParts);
  const metric = map.get(key) || emptyMetric();
  const impressions = asNumber(row.impressions);
  metric.clicks += asNumber(row.clicks);
  metric.impressions += impressions;
  metric.positionWeighted += asNumber(row.position) * impressions;
  map.set(key, metric);
}

function emptyMetric() {
  return { clicks: 0, impressions: 0, positionWeighted: 0 };
}

function periodsForDate(isoDate) {
  const date = parseDate(isoDate);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = addDays(date, mondayOffset);
  const monthStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const quarterMonth = Math.floor(date.getUTCMonth() / 3) * 3;
  const quarterStart = new Date(Date.UTC(date.getUTCFullYear(), quarterMonth, 1));
  return [
    { type: 'Week', start: iso(weekStart) },
    { type: 'Month', start: iso(monthStart) },
    { type: 'Quarter', start: iso(quarterStart) }
  ];
}

function periodFromStart(type, start) {
  const startDateObject = parseDate(start);
  if (type === 'Week') return { type, label: `Week of ${start}`, start, end: iso(addDays(startDateObject, 6)) };
  if (type === 'Month') {
    const end = new Date(Date.UTC(startDateObject.getUTCFullYear(), startDateObject.getUTCMonth() + 1, 0));
    return { type, label: start.slice(0, 7), start, end: iso(end) };
  }
  const quarter = Math.floor(startDateObject.getUTCMonth() / 3) + 1;
  const end = new Date(Date.UTC(startDateObject.getUTCFullYear(), startDateObject.getUTCMonth() + 3, 0));
  return { type, label: `${startDateObject.getUTCFullYear()} Q${quarter}`, start, end: iso(end) };
}

function monthRanges(start, end) {
  const ranges = [];
  let cursor = parseDate(start);
  const finalDate = parseDate(end);
  while (cursor <= finalDate) {
    const monthEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
    ranges.push({ start: iso(cursor), end: iso(monthEnd < finalDate ? monthEnd : finalDate) });
    cursor = addDays(monthEnd, 1);
  }
  return ranges;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--config') parsed.config = argv[index + 1];
    if (argv[index] === '--date') parsed.date = argv[index + 1];
    if (argv[index] === '--start-date') parsed.startDate = argv[index + 1];
    if (argv[index] === '--end-date') parsed.endDate = argv[index + 1];
    if (argv[index] === '--lag-days') parsed.lagDays = argv[index + 1];
    if (argv[index] === '--output') parsed.output = argv[index + 1];
    if (argv[index] === '--publish') parsed.publish = argv[index + 1];
  }
  return parsed;
}

function required(value, name) {
  if (!value) throw new Error(`Missing ${name} in ${configPath}`);
  return value;
}

function asNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function decimal(value) {
  return Number(Number(value).toFixed(6));
}

function csvValue(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function parseDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(isoDate, deltaDays) {
  return iso(addDays(parseDate(isoDate), deltaDays));
}

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
