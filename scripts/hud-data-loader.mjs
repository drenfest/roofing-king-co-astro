import { promises as fs } from 'node:fs';
import path from 'node:path';

const reportPattern = /^search-console-page-query-comparisons-\d{4}-\d{2}-\d{2}\.csv$/;

export async function load(reportDirectory = path.resolve('output/hud-reporting')) {
  const [entries, observability] = await Promise.all([
    fs.readdir(reportDirectory, { withFileTypes: true }).catch(() => []),
    readJson(path.join(reportDirectory, 'observability.json'), null)
  ]);
  const reports = entries
    .filter((entry) => entry.isFile() && reportPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left));

  if (!reports.length) {
    return {
      report: null,
      rows: [],
      observability,
      error: 'No Search Console comparison CSV was found. Generate the comparison report first.'
    };
  }

  const reportName = reports[0];
  const reportPath = path.join(reportDirectory, reportName);
  const source = await fs.readFile(reportPath, 'utf8');
  const parsed = parseCsv(source.replace(/^\uFEFF/, ''));
  const [headers = [], ...records] = parsed;
  const index = Object.fromEntries(headers.map((header, columnIndex) => [header, columnIndex]));

  const rows = records
    .filter((record) => record[index.Page])
    .map((record) => ({
      periodType: record[index['Period Type']],
      periodLabel: record[index['Period Label']],
      periodStart: record[index['Period Start']],
      periodEnd: record[index['Period End']],
      dataThrough: record[index['Data Through']],
      complete: record[index['Complete Period']] === 'Yes',
      page: record[index.Page],
      pageClicks: toNumber(record[index['Page Clicks']]),
      pageImpressions: toNumber(record[index['Page Impressions']]),
      pageCtr: toNumber(record[index['Page CTR']]),
      pagePosition: toNumber(record[index['Page Average Position']]),
      query: record[index.Query] || '',
      queryClicks: toNumber(record[index['Query Clicks']]),
      queryImpressions: toNumber(record[index['Query Impressions']]),
      queryCtr: toNumber(record[index['Query CTR']]),
      queryPosition: toNumber(record[index['Query Average Position']])
    }));

  const weekStarts = rows
    .filter((row) => row.periodType === 'Week')
    .map((row) => row.periodStart)
    .filter(Boolean)
    .sort();
  const periodStarts = rows.map((row) => row.periodStart).filter(Boolean).sort();
  const dataThrough = rows.map((row) => row.dataThrough).filter(Boolean).sort();

  return {
    report: {
      name: reportName,
      rowCount: rows.length,
      firstPeriodStart: weekStarts[0] || periodStarts[0] || null,
      dataThrough: dataThrough.at(-1) || null
    },
    rows,
    observability,
    error: null
  };
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''));
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows;
}
