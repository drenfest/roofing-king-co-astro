function safeFilename(value) {
  return String(value || 'sitewide').toLowerCase().replace(/^https?:\/\/[^/]+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sitewide';
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(' | ') : value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function percent(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}

function position(value) {
  return Number(value || 0).toFixed(1);
}

function pathFromUrl(value) {
  try {
    const path = new URL(value).pathname;
    return path === '/' ? '/' : path.replace(/\/$/, '');
  } catch {
    return value || '';
  }
}

export function dashboardToCsv(payload) {
  const headers = ['record_type', 'period', 'period_start', 'period_end', 'page', 'query', 'event_type', 'timestamp', 'last_crawl_time', 'observed_at', 'title', 'clicks', 'impressions', 'ctr', 'position', 'queries', 'commit', 'details', 'period_type', 'data_through', 'complete_period', 'page_clicks', 'page_impressions', 'page_ctr', 'page_position', 'query_clicks', 'query_impressions', 'query_ctr', 'query_position'];
  const rows = [];
  const metricRow = (recordType, period, metrics) => [recordType, period?.label, period?.start, period?.end, payload.view.page, payload.view.query, '', '', '', '', '', metrics?.clicks, metrics?.impressions, percent(metrics?.ctr), position(metrics?.position), metrics?.queryCount ?? '', '', ''];
  rows.push(['export_window', 'Last 6 months', payload.export_window?.start, payload.export_window?.end]);
  rows.push(metricRow('current_summary', payload.current_period, payload.view_summary.current));
  rows.push(metricRow('previous_summary', payload.previous_period, payload.view_summary.previous));
  for (const item of payload.trend) rows.push(['trend', item.label, item.start, item.end, payload.view.page, payload.view.query, '', '', '', '', '', item.clicks, item.impressions, percent(item.ctr), position(item.position), item.queryCount, '', item.complete ? 'complete' : `partial through ${item.dataThrough}`]);
  for (const page of payload.pages) rows.push(['page', payload.current_period?.label, payload.current_period?.start, payload.current_period?.end, pathFromUrl(page.url), '', '', '', '', '', '', page.clicks, page.impressions, percent(page.ctr), position(page.position), page.queryCount, '', '']);
  for (const query of payload.queries) rows.push(['query', payload.current_period?.label, payload.current_period?.start, payload.current_period?.end, pathFromUrl(query.page), query.query, '', '', '', '', '', query.queryClicks, query.queryImpressions, percent(query.queryCtr), position(query.queryPosition), '', '', '']);
  for (const event of payload.events) rows.push(['event', '', '', '', (event.urls || []).map(pathFromUrl), '', event.event_type, event.timestamp, event.last_crawl_time || '', event.observed_at || '', event.title, '', '', '', '', '', event.commit_sha || '', [event.summary, ...(event.source_files || [])].filter(Boolean).join(' | ')]);
  for (const item of payload.history || []) {
    rows.push([
      'historical_page_query', item.periodLabel, item.periodStart, item.periodEnd, pathFromUrl(item.page), item.query,
      '', '', '', '', '', item.queryClicks, item.queryImpressions, percent(item.queryCtr), position(item.queryPosition), '', '', '',
      item.periodType, item.dataThrough, item.complete ? 'Yes' : 'No', item.pageClicks, item.pageImpressions, percent(item.pageCtr), position(item.pagePosition),
      item.queryClicks, item.queryImpressions, percent(item.queryCtr), position(item.queryPosition)
    ]);
  }
  return [headers, ...rows].map((row) => [...row, ...Array(Math.max(0, headers.length - row.length)).fill('')].map(csvCell).join(',')).join('\r\n');
}

function pdfSafe(value) {
  return String(value ?? '')
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\x7e\xa0-\xff]/g, '?');
}

export async function createDashboardPdfBytes(payload) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const colors = { ink: rgb(.08, .13, .16), muted: rgb(.38, .46, .49), green: rgb(.12, .55, .42), pale: rgb(.91, .97, .95), line: rgb(.82, .87, .88), white: rgb(1, 1, 1) };
  let page;
  let y;

  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    page.drawText('THE WEB GUY  /  SEARCH CONSOLE', { x: margin, y, size: 8, font: bold, color: colors.green });
    page.drawLine({ start: { x: margin, y: y - 8 }, end: { x: pageWidth - margin, y: y - 8 }, thickness: .7, color: colors.line });
    y -= 28;
  };

  const ensure = (height) => { if (y - height < 48) addPage(); };
  const wrap = (value, font, size, width, maxLines = Infinity) => {
    const words = pdfSafe(value).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
      else {
        if (line) lines.push(line);
        line = word;
        if (lines.length === maxLines) break;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
      let final = lines.at(-1);
      while (final && font.widthOfTextAtSize(`${final}...`, size) > width) final = final.slice(0, -1);
      lines[lines.length - 1] = `${final}...`;
    }
    return lines.length ? lines : [''];
  };

  const heading = (text) => {
    ensure(34);
    y -= 8;
    page.drawText(pdfSafe(text), { x: margin, y, size: 14, font: bold, color: colors.ink });
    y -= 20;
  };

  const paragraph = (text, options = {}) => {
    const size = options.size || 9;
    const font = options.font || regular;
    const lines = wrap(text, font, size, options.width || contentWidth);
    ensure(lines.length * (size + 3) + 4);
    for (const line of lines) {
      page.drawText(line, { x: options.x || margin, y, size, font, color: options.color || colors.muted });
      y -= size + 3;
    }
    y -= 3;
  };

  const table = (headers, rows, widths) => {
    const drawHeader = () => {
      ensure(24);
      page.drawRectangle({ x: margin, y: y - 17, width: contentWidth, height: 20, color: colors.ink });
      let x = margin + 5;
      headers.forEach((header, index) => {
        page.drawText(pdfSafe(header), { x, y: y - 10, size: 7, font: bold, color: colors.white });
        x += widths[index];
      });
      y -= 23;
    };
    drawHeader();
    rows.forEach((row, rowIndex) => {
      const cells = row.map((value, index) => wrap(value, index === row.length - 1 && headers[index] === 'Commit' ? mono : regular, 7.2, widths[index] - 8, 3));
      const height = Math.max(...cells.map((lines) => lines.length)) * 9 + 7;
      if (y - height < 48) { addPage(); drawHeader(); }
      if (rowIndex % 2 === 0) page.drawRectangle({ x: margin, y: y - height + 3, width: contentWidth, height, color: colors.pale });
      let x = margin + 5;
      cells.forEach((lines, index) => {
        const font = headers[index] === 'Commit' ? mono : regular;
        lines.forEach((line, lineIndex) => page.drawText(line, { x, y: y - lineIndex * 9, size: 7.2, font, color: colors.ink }));
        x += widths[index];
      });
      y -= height;
    });
    y -= 5;
  };

  addPage();
  page.drawText('Search Console Performance Export', { x: margin, y, size: 22, font: bold, color: colors.ink });
  y -= 30;
  paragraph(`${payload.view.label} | ${payload.current_period?.label || 'No period'} | ${payload.period_type}`, { size: 11, font: bold, color: colors.green });
  paragraph(`Export window ${payload.export_window?.start || 'unknown'} through ${payload.export_window?.end || payload.data_through || 'unknown'} (rolling 6 months).`);
  paragraph(`Generated ${new Date(payload.exported_at).toLocaleString('en-US', { timeZone: 'America/Chicago' })} America/Chicago. Data through ${payload.data_through || 'unknown'}.`);

  heading('Summary');
  table(['View', 'Clicks', 'Impressions', 'CTR', 'Avg position', 'Queries'], [
    ['Current', payload.view_summary.current.clicks, payload.view_summary.current.impressions, percent(payload.view_summary.current.ctr), position(payload.view_summary.current.position), payload.view_summary.current.queryCount || ''],
    ['Previous', payload.view_summary.previous.clicks, payload.view_summary.previous.impressions, percent(payload.view_summary.previous.ctr), position(payload.view_summary.previous.position), payload.view_summary.previous.queryCount || '']
  ], [88, 70, 95, 72, 105, 102]);

  heading('Trend');
  table(['Period', 'Clicks', 'Impressions', 'CTR', 'Position', 'Queries'], payload.trend.map((item) => [item.label, item.clicks, item.impressions, percent(item.ctr), position(item.position), item.queryCount]), [170, 62, 92, 66, 72, 70]);

  heading(`Pages (${payload.pages.length})`);
  table(['Page', 'Clicks', 'Impressions', 'CTR', 'Position', 'Queries'], payload.pages.map((item) => [pathFromUrl(item.url), item.clicks, item.impressions, percent(item.ctr), position(item.position), item.queryCount]), [220, 55, 82, 58, 62, 55]);

  heading(`Queries (${payload.queries.length})`);
  table(['Query', 'Page', 'Clicks', 'Impressions', 'CTR', 'Position'], payload.queries.map((item) => [item.query, pathFromUrl(item.page), item.queryClicks, item.queryImpressions, percent(item.queryCtr), position(item.queryPosition)]), [175, 175, 42, 62, 42, 36]);

  heading(`Events (${payload.events.length})`);
  table(['Time', 'Type', 'Page', 'Detail', 'Commit'], payload.events.map((item) => {
    const detail = [item.title, item.summary]
      .filter((value, index, values) => value && values.indexOf(value) === index)
      .join(' - ');
    return [item.event_type === 'google_crawl' ? item.last_crawl_time || item.timestamp || '' : item.timestamp || '', item.event_type, (item.urls || []).map(pathFromUrl).join(', '), detail, item.commit_sha?.slice(0, 8) || ''];
  }), [102, 70, 135, 165, 60]);

  heading(`Historical page/query detail (${(payload.history || []).length} rows)`);
  table(
    ['Period', 'Page', 'Query', 'P clk', 'P impr', 'P pos', 'Q clk', 'Q impr', 'Q pos'],
    (payload.history || []).map((item) => [item.periodStart, pathFromUrl(item.page), item.query, item.pageClicks, item.pageImpressions, position(item.pagePosition), item.queryClicks, item.queryImpressions, position(item.queryPosition)]),
    [54, 105, 120, 34, 44, 34, 34, 44, 34]
  );

  const pages = pdf.getPages();
  pages.forEach((item, index) => {
    item.drawLine({ start: { x: margin, y: 34 }, end: { x: pageWidth - margin, y: 34 }, thickness: .6, color: colors.line });
    item.drawText(`Page ${index + 1} of ${pages.length}`, { x: pageWidth - margin - 55, y: 20, size: 7, font: regular, color: colors.muted });
  });
  return pdf.save();
}

export async function downloadDashboardExport(format, payload) {
  if (!['csv', 'pdf', 'json'].includes(format)) throw new Error('Unsupported export format');
  const content = format === 'pdf' ? await createDashboardPdfBytes(payload) : format === 'csv' ? dashboardToCsv(payload) : JSON.stringify(payload, null, 2);
  const type = { pdf: 'application/pdf', csv: 'text/csv;charset=utf-8', json: 'application/json' }[format];
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roof-king-hud-' + payload.data_through + '.' + format;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
