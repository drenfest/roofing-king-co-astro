<script>
  import { downloadDashboardExport } from './export-dashboard.js';

  let { data } = $props();

  const periodOrder = ['Week', 'Month', 'Quarter'];
  const tooltipEventTabs = [['code_change', 'Changes'], ['deployment', 'Deployments'], ['google_crawl', 'Crawls']];
  let periodType = $state('Week');
  let selectedPeriodStart = $state('');
  let search = $state('');
  let selectedPage = $state('');
  let selectedQuery = $state('');
  let tooltipEventTab = $state('code_change');
  let pageSort = $state('impressions');
  let pageSortDirection = $state('desc');
  let querySort = $state('impressions');
  let querySortDirection = $state('desc');
  let exportMenuOpen = $state(false);
  let exporting = $state('');

  const allRows = $derived(data.rows || []);
  const periods = $derived.by(() => {
    const unique = new Map();
    for (const row of allRows) {
      if (row.periodType !== periodType) continue;
      if (!unique.has(row.periodStart)) {
        unique.set(row.periodStart, {
          start: row.periodStart,
          end: row.periodEnd,
          label: row.periodLabel,
          dataThrough: row.dataThrough,
          complete: row.complete
        });
      }
    }
    const ordered = [...unique.values()].sort((left, right) => left.start.localeCompare(right.start));
    if (periodType !== 'Week') return ordered;
    const cutoff = sixMonthCutoff(data.report.dataThrough);
    return ordered.filter((period) => !cutoff || period.end >= cutoff);
  });

  const activePeriod = $derived(periods.find((period) => period.start === selectedPeriodStart) || periods.at(-1));
  const activePeriodIndex = $derived(periods.findIndex((period) => period.start === activePeriod?.start));
  const previousPeriod = $derived(activePeriodIndex > 0 ? periods[activePeriodIndex - 1] : null);
  const activeRows = $derived(activePeriod ? allRows.filter((row) => row.periodType === periodType && row.periodStart === activePeriod.start) : []);
  const previousRows = $derived(previousPeriod ? allRows.filter((row) => row.periodType === periodType && row.periodStart === previousPeriod.start) : []);

  const currentPages = $derived(pageMetrics(activeRows));
  const previousPages = $derived(pageMetrics(previousRows));
  const previousPageMap = $derived(new Map(previousPages.map((page) => [page.url, page])));
  const site = $derived(siteMetrics(currentPages));
  const previousSite = $derived(siteMetrics(previousPages));
  const siteQueryCount = $derived(new Set(activeRows.filter((row) => row.query).map((row) => `${row.page}|${row.query}`)).size);
  const previousSiteQueryCount = $derived(new Set(previousRows.filter((row) => row.query).map((row) => `${row.page}|${row.query}`)).size);

  const pageRows = $derived.by(() => {
    const needle = search.trim().toLowerCase();
    return currentPages
      .map((page) => ({ ...page, previous: previousPageMap.get(page.url) || null }))
      .filter((page) => !needle || page.url.toLowerCase().includes(needle) || activeRows.some((row) => row.page === page.url && row.query.toLowerCase().includes(needle)))
      .sort((left, right) => {
        if (pageSort === 'change') {
          return compareValues(
            delta(left.impressions, left.previous?.impressions),
            delta(right.impressions, right.previous?.impressions),
            pageSortDirection
          );
        }
        const fields = { url: 'url', clicks: 'clicks', impressions: 'impressions', ctr: 'ctr', position: 'position', queries: 'queryCount' };
        return compareValues(left[fields[pageSort]], right[fields[pageSort]], pageSortDirection);
      });
  });

  const queryRows = $derived.by(() => {
    const needle = search.trim().toLowerCase();
    return activeRows
      .filter((row) => row.query)
      .filter((row) => !selectedPage || row.page === selectedPage)
      .filter((row) => !needle || row.query.toLowerCase().includes(needle) || row.page.toLowerCase().includes(needle))
      .sort((left, right) => {
        const fields = {
          query: 'query',
          page: 'page',
          clicks: 'queryClicks',
          impressions: 'queryImpressions',
          ctr: 'queryCtr',
          position: 'queryPosition'
        };
        return compareValues(left[fields[querySort]], right[fields[querySort]], querySortDirection);
      })
      .slice(0, 100);
  });

  const pageStatus = $derived(selectedPage ? data.observability?.page_summaries?.[canonicalPage(selectedPage)] || null : null);
  const pageEvents = $derived(selectedPage ? pageStatus?.events || [] : data.observability?.events || []);
  const trend = $derived(periods.map((period) => {
    const rows = allRows.filter((row) => row.periodType === periodType && row.periodStart === period.start);
    return { ...period, ...trendMetrics(rows) };
  }));

  const maxTrendImpressions = $derived(Math.max(1, ...trend.map((period) => period.impressions)));
  const maxTrendClicks = $derived(Math.max(1, ...trend.map((period) => period.clicks)));
  const maxTrendCtr = $derived(Math.max(0.000001, ...trend.map((period) => period.ctr)));
  const maxTrendQueries = $derived(Math.max(1, ...trend.map((period) => period.queryCount)));
  const maxTrendPositionStrength = $derived(Math.max(0.000001, ...trend.map((period) => positionStrength(period.position))));

  function setPeriodType(nextType) {
    periodType = nextType;
    selectedPeriodStart = '';
    selectedPage = '';
    selectedQuery = '';
  }

  function selectPage(url) {
    const periodStart = activePeriod?.start || selectedPeriodStart;
    selectedPage = selectedPage === url ? '' : url;
    selectedQuery = '';
    if (periodStart && periods.some((period) => period.start === periodStart)) selectedPeriodStart = periodStart;
  }

  function selectQuery(row) {
    selectedPage = row.page;
    selectedQuery = selectedQuery === row.query ? '' : row.query;
  }

  function showSitewide() {
    selectedPage = '';
    selectedQuery = '';
  }

  function sixMonthCutoff(dateText) {
    const [year, month, day] = String(dateText || '').split('-').map(Number);
    if (!year || !month || !day) return '';
    const target = new Date(Date.UTC(year, month - 7, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    return target.toISOString().slice(0, 10);
  }

  function exportPayload() {
    const windowEnd = data.report.dataThrough;
    const windowStart = sixMonthCutoff(windowEnd);
    const inWindow = (start, end = start) => (!windowStart || end >= windowStart) && (!windowEnd || start <= windowEnd);
    const eventInWindow = (event) => [event.timestamp, event.last_crawl_time, event.observed_at]
      .filter(Boolean)
      .some((value) => inWindow(String(value).slice(0, 10)));

    return {
      schema_version: 1,
      exported_at: new Date().toISOString(),
      data_through: data.report.dataThrough,
      source_file: data.report.name,
      export_window: { months: 6, start: windowStart, end: windowEnd },
      period_type: periodType,
      view: {
        label: selectedPage && selectedQuery ? `${selectedQuery} on ${shortPage(selectedPage)}` : selectedPage ? shortPage(selectedPage) : 'Sitewide',
        page: selectedPage,
        query: selectedQuery,
        search
      },
      current_period: activePeriod,
      previous_period: previousPeriod,
      sitewide_summary: { current: site, previous: previousSite },
      view_summary: { current: trendMetrics(activeRows), previous: trendMetrics(previousRows) },
      trend: trend.filter((item) => inWindow(item.start, item.end)),
      pages: pageRows,
      queries: queryRows,
      history: allRows.filter((item) => inWindow(item.periodStart, item.periodEnd)),
      events: pageEvents.filter(eventInWindow)
    };
  }

  async function exportDashboard(format) {
    exportMenuOpen = false;
    exporting = format;
    try {
      await downloadDashboardExport(format, exportPayload());
    } finally {
      exporting = '';
    }
  }

  function setPageSort(column, reset = false) {
    if (!reset && pageSort === column) {
      pageSortDirection = pageSortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }
    pageSort = column;
    pageSortDirection = column === 'url' || column === 'position' ? 'asc' : 'desc';
  }

  function setQuerySort(column) {
    if (querySort === column) {
      querySortDirection = querySortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }
    querySort = column;
    querySortDirection = column === 'query' || column === 'page' || column === 'position' ? 'asc' : 'desc';
  }

  function compareValues(left, right, direction) {
    const multiplier = direction === 'asc' ? 1 : -1;
    if (typeof left === 'string' || typeof right === 'string') {
      return String(left || '').localeCompare(String(right || '')) * multiplier;
    }
    return (Number(left || 0) - Number(right || 0)) * multiplier;
  }

  function sortArrow(activeColumn, column, direction) {
    if (activeColumn !== column) return '↕';
    return direction === 'asc' ? '↑' : '↓';
  }

  function ariaSort(activeColumn, column, direction) {
    if (activeColumn !== column) return 'none';
    return direction === 'asc' ? 'ascending' : 'descending';
  }

  function pageMetrics(rows) {
    const pages = new Map();
    for (const row of rows) {
      if (!pages.has(row.page)) {
        pages.set(row.page, {
          url: row.page,
          clicks: row.pageClicks,
          impressions: row.pageImpressions,
          ctr: row.pageCtr,
          position: row.pagePosition,
          queryCount: 0
        });
      }
      if (row.query) pages.get(row.page).queryCount += 1;
    }
    return [...pages.values()];
  }

  function siteMetrics(pages) {
    const clicks = pages.reduce((sum, page) => sum + page.clicks, 0);
    const impressions = pages.reduce((sum, page) => sum + page.impressions, 0);
    const weightedPosition = pages.reduce((sum, page) => sum + (page.position * page.impressions), 0);
    return {
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : 0,
      position: impressions ? weightedPosition / impressions : 0,
      pages: pages.length
    };
  }

  function trendMetrics(rows) {
    if (selectedPage && selectedQuery) {
      const row = rows.find((item) => item.page === selectedPage && item.query === selectedQuery);
      return row ? {
        clicks: row.queryClicks,
        impressions: row.queryImpressions,
        ctr: row.queryCtr,
        position: row.queryPosition,
        pages: 1,
        queryCount: 1
      } : { clicks: 0, impressions: 0, ctr: 0, position: 0, pages: 0, queryCount: 0 };
    }
    if (selectedPage) {
      const selectedRows = rows.filter((item) => item.page === selectedPage);
      return { ...siteMetrics(pageMetrics(selectedRows)), queryCount: new Set(selectedRows.filter((item) => item.query).map((item) => item.query)).size };
    }
    return { ...siteMetrics(pageMetrics(rows)), queryCount: new Set(rows.filter((item) => item.query).map((item) => `${item.page}|${item.query}`)).size };
  }

  function eventsForPeriod(period) {
    return pageEvents.filter((event) => {
      const date = String(event.timestamp || '').slice(0, 10);
      return date >= period.start && date <= period.end;
    });
  }

  function markerEventsForPeriod(period) {
    const seenCommits = new Set();
    const priority = { code_change: 0, deployment: 1, google_crawl: 2 };
    return [...eventsForPeriod(period)]
      .sort((left, right) => (priority[left.event_type] ?? 3) - (priority[right.event_type] ?? 3))
      .filter((event) => {
        if (event.event_type !== 'code_change' || !event.commit_sha) return true;
        if (seenCommits.has(event.commit_sha)) return false;
        seenCommits.add(event.commit_sha);
        return true;
      })
      .slice(0, 4);
  }

  function eventLabel(type) {
    return ({ code_change: 'CODE CHANGE', deployment: 'DEPLOYED', google_crawl: 'GOOGLE CRAWLED', manual_note: 'NOTE' })[type] || type;
  }

  function eventTitle(event) {
    const ids = changeIdsForEvent(event).join(', ');
    return [eventLabel(event.event_type), formatDateTime(event.timestamp), ids, event.title, event.summary].filter(Boolean).join(' · ');
  }

  function changeIdsForEvent(event) {
    if (!event) return [];
    const pageIds = selectedPage ? event.metadata?.change_ids_by_url?.[canonicalPage(selectedPage)] : null;
    return pageIds || event.change_ids || (event.change_id ? [event.change_id] : []);
  }

  function sourceFilesForEvent(event) {
    if (!event) return [];
    const pageFiles = selectedPage ? event.metadata?.source_files_by_url?.[canonicalPage(selectedPage)] : null;
    return pageFiles || event.source_files || [];
  }

  function eventTitleForPage(event) {
    const pageTitle = selectedPage ? event.metadata?.title_by_url?.[canonicalPage(selectedPage)] : null;
    return pageTitle || event.title || eventLabel(event.event_type);
  }

  function eventSummaryForPage(event) {
    const pageSummary = selectedPage ? event.metadata?.summary_by_url?.[canonicalPage(selectedPage)] : null;
    return pageSummary || event.summary || '';
  }

  function shortCommit(event) {
    return event.commit_sha ? event.commit_sha.slice(0, 7) : '';
  }

  function formatDateTime(value) {
    if (!value) return 'Unknown';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value} (time not recorded)`;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    }).format(new Date(value));
  }

  function canonicalPage(value) {
    try {
      const url = new URL(value);
      if (url.pathname !== '/' && !url.pathname.endsWith('/')) url.pathname += '/';
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      return value;
    }
  }

  function trendHeading() {
    if (selectedPage && selectedQuery) return `${selectedQuery} on ${shortPage(selectedPage)}`;
    if (selectedPage) return shortPage(selectedPage);
    return `${periodType} visibility`;
  }

  function chartX(index) {
    if (trend.length <= 1) return 500;
    return 38 + (index / (trend.length - 1)) * 924;
  }

  function chartY(value, maximum) {
    return 202 - (Number(value || 0) / Math.max(0.000001, maximum)) * 170;
  }

  function linePoints(field, maximum) {
    return trend.map((period, index) => `${chartX(index)},${chartY(period[field], maximum)}`).join(' ');
  }

  function positionChartY(value) {
    return chartY(positionStrength(value), maxTrendPositionStrength);
  }

  function positionStrength(value) {
    return Number(value) > 0 ? 1 / Number(value) : 0;
  }

  function positionLinePoints() {
    return trend
      .map((period, index) => period.position > 0 ? `${chartX(index)},${positionChartY(period.position)}` : '')
      .filter(Boolean)
      .join(' ');
  }

  function periodAriaLabel(period) {
    const events = eventsForPeriod(period).map((event) => `${eventLabel(event.event_type)} ${changeIdsForEvent(event).join(' ')}`.trim());
    return [
      period.label,
      `${period.impressions} impressions`,
      `${period.clicks} clicks`,
      `${formatPercent(period.ctr)} click-through rate`,
      `average position ${formatPosition(period.position)}`,
      `${period.queryCount || 0} queries`,
      ...events
    ].join(', ');
  }

  function openTrendTooltip(period) {
    tooltipEventTab = tooltipEventTabs.find(([type]) => eventsForPeriod(period).some((event) => event.event_type === type))?.[0] || 'code_change';
  }

  function delta(current, previous) {
    return Number(current || 0) - Number(previous || 0);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function formatPercent(value) {
    return `${(Number(value || 0) * 100).toFixed(1)}%`;
  }

  function formatPosition(value) {
    return Number(value || 0).toFixed(1);
  }

  function formatDelta(value, digits = 0, inverse = false) {
    const numeric = Number(value || 0);
    const good = inverse ? numeric < 0 : numeric > 0;
    return {
      text: `${numeric > 0 ? '+' : ''}${numeric.toFixed(digits)}`,
      className: numeric === 0 ? 'neutral' : good ? 'positive' : 'negative'
    };
  }

  function shortPage(url) {
    try {
      const parsed = new URL(url);
      return parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/$/, '');
    } catch {
      return url;
    }
  }
</script>

<svelte:head>
  <title>Roof King HUD | Search Performance</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main class="dashboard-shell">
  <nav class="hud-nav" aria-label="HUD identity">
    <a class="hud-brand" href="#overview" aria-label="Roof King HUD overview"><span class="hud-mark" aria-hidden="true">⌖</span><span>ROOF KING <b>HUD</b></span></a>
    <span class="hud-channel"><i aria-hidden="true"></i> SEARCH TELEMETRY <span>/ 01</span></span>
  </nav>
  {#if data.error}
    <section class="empty-state">
      <p class="eyebrow">Roof King HUD / Search Console</p>
      <h1>No comparison data yet</h1>
      <p>{data.error}</p>
    </section>
  {:else}
    <header class="hero" id="overview">
      <div>
        <p class="eyebrow">Your search command center</p>
        <h1>Eyes on the <span>next level.</span></h1>
        <p class="hero-copy">Your pages. Your progress. Your next move. Track search performance across weeks, months, and quarters.</p>
      </div>
      <div class="source-card">
        <span>Saved report / data through</span>
        <strong>{data.report.dataThrough}</strong>
        <small>{formatNumber(data.report.rowCount)} page-query rows · begins {data.report.firstPeriodStart}</small>
        <small class="snapshot-note">Snapshot · updates when a new report is published.</small>
      </div>
    </header>

    <section class="control-bar" aria-label="HUD controls">
      <div class="segmented">
        {#each periodOrder as type}
          <button class:active={periodType === type} type="button" onclick={() => setPeriodType(type)}>{type}</button>
        {/each}
      </div>
      <label>
        <span>Current period</span>
        <select bind:value={selectedPeriodStart} onchange={(event) => event.currentTarget.blur()}>
          <option value="">Latest available</option>
          {#each [...periods].reverse() as period}
            <option value={period.start}>{period.label}{period.complete ? '' : ' · partial'}</option>
          {/each}
        </select>
      </label>
      <label class="search-control">
        <span>Find a page or query</span>
        <input bind:value={search} type="search" placeholder="Try roof repair, /roofing/, gutters…" />
      </label>
    </section>

    <section class="period-heading">
      <div>
        <p class="eyebrow">Current view</p>
        <h2>{activePeriod?.label}</h2>
      </div>
      <div class="period-context">
        <span class:partial={!activePeriod?.complete}>{activePeriod?.complete ? 'Complete period' : `Partial · through ${activePeriod?.dataThrough}`}</span>
        <span>vs {previousPeriod?.label || 'no prior period'}</span>
        <button class:active={!selectedPage && !selectedQuery} type="button" onclick={showSitewide} disabled={!selectedPage && !selectedQuery}>Sitewide</button>
        <button
          class="export-trigger"
          type="button"
          aria-label="Export HUD"
          aria-expanded={exportMenuOpen}
          onclick={() => exportMenuOpen = !exportMenuOpen}
        >
          {exporting ? `Preparing ${exporting.toUpperCase()}…` : 'Export'} <span aria-hidden="true">▾</span>
        </button>
      </div>
    </section>

    <section class="kpi-grid">
      {#if exportMenuOpen}
        <div class="export-menu" role="menu" aria-label="Export format">
          <button type="button" onclick={() => exportDashboard('csv')} disabled={Boolean(exporting)}>CSV <small>Spreadsheet-ready data</small></button>
          <button type="button" onclick={() => exportDashboard('pdf')} disabled={Boolean(exporting)}>PDF <small>Formatted performance report</small></button>
          <button type="button" onclick={() => exportDashboard('json')} disabled={Boolean(exporting)}>JSON <small>Complete structured view</small></button>
        </div>
      {/if}
      <article>
        <span>Clicks</span>
        <strong>{formatNumber(site.clicks)}</strong>
        {@render MetricDelta(delta(site.clicks, previousSite.clicks), 0, false, ' vs prior')}
      </article>
      <article>
        <span>Impressions</span>
        <strong>{formatNumber(site.impressions)}</strong>
        {@render MetricDelta(delta(site.impressions, previousSite.impressions), 0, false, ' vs prior')}
      </article>
      <article>
        <span>Click-through rate</span>
        <strong>{formatPercent(site.ctr)}</strong>
        {@render MetricDelta((site.ctr - previousSite.ctr) * 100, 1, false, ' points')}
      </article>
      <article>
        <span>Average position</span>
        <strong>{formatPosition(site.position)}</strong>
        {@render MetricDelta(site.position - previousSite.position, 1, true, ' vs prior')}
      </article>
      <article>
        <span>Visible pages</span>
        <strong>{formatNumber(site.pages)}</strong>
        {@render MetricDelta(delta(site.pages, previousSite.pages), 0, false, ' vs prior')}
      </article>
      <article>
        <span>Total queries</span>
        <strong>{formatNumber(siteQueryCount)}</strong>
        {@render MetricDelta(delta(siteQueryCount, previousSiteQueryCount), 0, false, ' vs prior')}
      </article>
    </section>

    <section class="panel trend-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Trend</p>
          <h2>{trendHeading()}</h2>
          {#if periodType === 'Week'}<p>Rolling six-month weekly view.</p>{/if}
          {#if selectedQuery}<p>Query-level Search Console performance with the selected page’s context events.</p>{/if}
        </div>
        <div class="legend">
          <span><i></i> Impressions</span><span><i class="clicks"></i> Clicks</span><span><i class="ctr"></i> CTR</span><span><i class="position"></i> Avg. position · better ↑</span><span><i class="queries"></i> Queries</span>
          {#if selectedPage}<span><i class="change-marker"></i> Commit</span><span><i class="deploy-marker"></i> Deploy</span><span><i class="crawl-marker"></i> Crawl</span>{/if}
        </div>
      </div>
      <div class="trend-chart-scroll">
        <div class="trend-chart">
          <svg class="trend-lines" viewBox="0 0 1000 240" preserveAspectRatio="none" role="img" aria-label={`${trendHeading()} impressions, clicks, click-through rate, average position, and query count line graph`}>
            <line class="grid-line" x1="38" y1="32" x2="962" y2="32"></line>
            <line class="grid-line" x1="38" y1="74.5" x2="962" y2="74.5"></line>
            <line class="grid-line" x1="38" y1="117" x2="962" y2="117"></line>
            <line class="grid-line" x1="38" y1="159.5" x2="962" y2="159.5"></line>
            <line class="grid-line baseline" x1="38" y1="202" x2="962" y2="202"></line>
            {#each trend as period, index}
              {#if eventsForPeriod(period).length}
                <line class="event-boundary" x1={chartX(index)} y1="24" x2={chartX(index)} y2="202"></line>
              {/if}
            {/each}
            <polyline class="series-line impressions" points={linePoints('impressions', maxTrendImpressions)}></polyline>
            <polyline class="series-line clicks" points={linePoints('clicks', maxTrendClicks)}></polyline>
            <polyline class="series-line ctr" points={linePoints('ctr', maxTrendCtr)}></polyline>
            <polyline class="series-line position" points={positionLinePoints()}></polyline>
            <polyline class="series-line queries" points={linePoints('queryCount', maxTrendQueries)}></polyline>
            {#each trend as period, index}
              <circle class="series-point impressions" class:active={period.start === activePeriod?.start} cx={chartX(index)} cy={chartY(period.impressions, maxTrendImpressions)} r="5"></circle>
              <circle class="series-point clicks" class:active={period.start === activePeriod?.start} cx={chartX(index)} cy={chartY(period.clicks, maxTrendClicks)} r="4"></circle>
              <circle class="series-point ctr" class:active={period.start === activePeriod?.start} cx={chartX(index)} cy={chartY(period.ctr, maxTrendCtr)} r="4"></circle>
              {#if period.position > 0}<circle class="series-point position" class:active={period.start === activePeriod?.start} cx={chartX(index)} cy={positionChartY(period.position)} r="4"></circle>{/if}
              <circle class="series-point queries" class:active={period.start === activePeriod?.start} cx={chartX(index)} cy={chartY(period.queryCount, maxTrendQueries)} r="4"></circle>
            {/each}
          </svg>
          {#each trend as period, index}
            <div
              class="trend-period"
              role="group"
              aria-label={`${period.label} graph point`}
              class:active={period.start === activePeriod?.start}
              class:partial={!period.complete}
              class:edge-left={index < 2}
              class:edge-right={index > trend.length - 3}
              style={`left:${(index / trend.length) * 100}%;width:${100 / trend.length}%`}
              onmouseenter={() => openTrendTooltip(period)}
            >
              <button
                type="button"
                class="trend-hit"
                onclick={() => selectedPeriodStart = period.start}
                onfocus={() => openTrendTooltip(period)}
                aria-label={periodAriaLabel(period)}
                aria-haspopup="dialog"
              >
                {#if eventsForPeriod(period).length}
                  <span class="event-markers" aria-label={`${eventsForPeriod(period).length} events`}>
                    {#each markerEventsForPeriod(period) as event}
                      {#if event.event_type === 'code_change' && event.commit_sha}
                        <span class="commit-marker" title={`Commit ${shortCommit(event)} · ${eventTitleForPage(event)}`}><i class="event-marker code_change"></i><code>{shortCommit(event)}</code></span>
                      {:else}
                        <i class={`event-marker ${event.event_type}`} title={eventTitleForPage(event)}></i>
                      {/if}
                    {/each}
                  </span>
                {/if}
                <small>{periodType === 'Week' ? period.start.slice(5) : period.label.replace('Month ', '').replace('Quarter ', '')}</small>
              </button>
              <div class="trend-tooltip" role="dialog" aria-label={`${period.label} metrics and events`}>
                <strong>{period.label}{period.complete ? '' : ' · partial'}</strong>
                <div class="tooltip-metrics">
                  <span><b>{formatNumber(period.impressions)}</b> impressions</span>
                  <span><b>{formatNumber(period.clicks)}</b> clicks</span>
                  <span><b>{formatPercent(period.ctr)}</b> CTR</span>
                  <span><b>{formatPosition(period.position)}</b> avg. position</span>
                  <span><b>{formatNumber(period.queryCount || 0)}</b> queries</span>
                </div>
                <div class="tooltip-tabs" role="tablist" aria-label="Event types">
                  {#each tooltipEventTabs as [type, label]}
                    {@const eventCount = eventsForPeriod(period).filter((event) => event.event_type === type).length}
                    <button type="button" role="tab" aria-selected={tooltipEventTab === type} class:active={tooltipEventTab === type} onclick={() => tooltipEventTab = type}>{label}<span>{eventCount}</span></button>
                  {/each}
                </div>
                <div class="tooltip-events" role="tabpanel">
                  {#if eventsForPeriod(period).filter((event) => event.event_type === tooltipEventTab).length}
                    {#each eventsForPeriod(period).filter((event) => event.event_type === tooltipEventTab) as event}
                      <article class="tooltip-event">
                        <span><i class={`event-marker ${event.event_type}`}></i><b>{eventLabel(event.event_type)}</b> · {formatDateTime(event.timestamp)}{changeIdsForEvent(event).length ? ` · ${changeIdsForEvent(event).join(', ')}` : ''}</span>
                        {#if event.event_type === 'google_crawl'}
                          <div class="crawl-page-highlight">
                            <span>Page crawled</span>
                            <strong>{shortPage(event.urls?.[0] || selectedPage)}</strong>
                          </div>
                          <em class="last-crawl-time"><b>Last crawl</b> · {formatDateTime(event.last_crawl_time || event.timestamp)}</em>
                        {/if}
                        <strong>{eventTitleForPage(event)}</strong>
                        {#if eventSummaryForPage(event)}<p>{eventSummaryForPage(event)}</p>{/if}
                        {#if event.event_type === 'code_change' && event.commit_sha}<em>Commit <code>{shortCommit(event)}</code>{sourceFilesForEvent(event).length ? ` · ${sourceFilesForEvent(event).join(' · ')}` : ''}</em>{/if}
                        {#if event.event_type === 'deployment'}<em>{event.metadata?.confirmation || (event.confirmed ? 'CONFIRMED DEPLOYMENT' : 'INFERRED DEPLOYMENT')} · {event.source}</em>{/if}
                        {#if event.event_type === 'google_crawl'}<em>Detected during {formatDateTime(event.observed_at)} inspection · {event.metadata?.verdict || 'verdict unavailable'} · {event.metadata?.page_fetch_state || 'fetch state unavailable'}</em>{/if}
                      </article>
                    {/each}
                  {:else}
                    <p>No {tooltipEventTabs.find(([type]) => type === tooltipEventTab)?.[1].toLowerCase()} in this period.</p>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-heading table-heading">
        <div>
          <p class="eyebrow">Page comparison</p>
          <h2>Landing page performance</h2>
          <p>Click a page to isolate its queries below.</p>
        </div>
        <label>
          <span>Sort pages</span>
          <select value={pageSort} onchange={(event) => setPageSort(event.currentTarget.value, true)}>
            <option value="impressions">Most impressions</option>
            <option value="clicks">Most clicks</option>
            <option value="position">Best position</option>
            <option value="change">Largest impression gain</option>
          </select>
        </label>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th aria-sort={ariaSort(pageSort, 'url', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'url'} type="button" onclick={() => setPageSort('url')}>Page <span>{sortArrow(pageSort, 'url', pageSortDirection)}</span></button></th>
              <th aria-sort={ariaSort(pageSort, 'clicks', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'clicks'} type="button" onclick={() => setPageSort('clicks')}>Clicks <span>{sortArrow(pageSort, 'clicks', pageSortDirection)}</span></button></th>
              <th aria-sort={ariaSort(pageSort, 'impressions', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'impressions'} type="button" onclick={() => setPageSort('impressions')}>Impressions <span>{sortArrow(pageSort, 'impressions', pageSortDirection)}</span></button></th>
              <th aria-sort={ariaSort(pageSort, 'ctr', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'ctr'} type="button" onclick={() => setPageSort('ctr')}>CTR <span>{sortArrow(pageSort, 'ctr', pageSortDirection)}</span></button></th>
              <th aria-sort={ariaSort(pageSort, 'position', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'position'} type="button" onclick={() => setPageSort('position')}>Position <span>{sortArrow(pageSort, 'position', pageSortDirection)}</span></button></th>
              <th aria-sort={ariaSort(pageSort, 'queries', pageSortDirection)}><button class="sort-button" class:active={pageSort === 'queries'} type="button" onclick={() => setPageSort('queries')}>Queries <span>{sortArrow(pageSort, 'queries', pageSortDirection)}</span></button></th>
            </tr>
          </thead>
          <tbody>
            {#each pageRows as page}
              <tr class:selected={selectedPage === page.url} onclick={() => selectPage(page.url)}>
                <td><button class="page-link" type="button" title={page.url}>{shortPage(page.url)}</button></td>
                <td>{formatNumber(page.clicks)} {@render Delta(delta(page.clicks, page.previous?.clicks))}</td>
                <td>{formatNumber(page.impressions)} {@render Delta(delta(page.impressions, page.previous?.impressions))}</td>
                <td>{formatPercent(page.ctr)} {@render Delta((page.ctr - (page.previous?.ctr || 0)) * 100, 1, false, 'pt')}</td>
                <td>{formatPosition(page.position)} {@render Delta(page.position - (page.previous?.position || 0), 1, true)}</td>
                <td>{formatNumber(page.queryCount)} {@render Delta(delta(page.queryCount, page.previous?.queryCount))}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if !pageRows.length}<p class="no-results">No pages match that search.</p>{/if}
    </section>

    <section class="panel">
      <div class="panel-heading table-heading">
        <div>
          <p class="eyebrow">Query detail</p>
          <h2>{selectedPage ? shortPage(selectedPage) : 'Top disclosed queries'}</h2>
          <p>{selectedPage ? 'Showing only queries for the selected page.' : 'Select a page above to narrow this list.'}</p>
        </div>
        {#if selectedPage}<button class="clear-button" type="button" onclick={showSitewide}>Show all pages</button>{/if}
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th aria-sort={ariaSort(querySort, 'query', querySortDirection)}><button class="sort-button" class:active={querySort === 'query'} type="button" onclick={() => setQuerySort('query')}>Query <span>{sortArrow(querySort, 'query', querySortDirection)}</span></button></th>
              <th aria-sort={ariaSort(querySort, 'page', querySortDirection)}><button class="sort-button" class:active={querySort === 'page'} type="button" onclick={() => setQuerySort('page')}>Page <span>{sortArrow(querySort, 'page', querySortDirection)}</span></button></th>
              <th aria-sort={ariaSort(querySort, 'clicks', querySortDirection)}><button class="sort-button" class:active={querySort === 'clicks'} type="button" onclick={() => setQuerySort('clicks')}>Clicks <span>{sortArrow(querySort, 'clicks', querySortDirection)}</span></button></th>
              <th aria-sort={ariaSort(querySort, 'impressions', querySortDirection)}><button class="sort-button" class:active={querySort === 'impressions'} type="button" onclick={() => setQuerySort('impressions')}>Impressions <span>{sortArrow(querySort, 'impressions', querySortDirection)}</span></button></th>
              <th aria-sort={ariaSort(querySort, 'ctr', querySortDirection)}><button class="sort-button" class:active={querySort === 'ctr'} type="button" onclick={() => setQuerySort('ctr')}>CTR <span>{sortArrow(querySort, 'ctr', querySortDirection)}</span></button></th>
              <th aria-sort={ariaSort(querySort, 'position', querySortDirection)}><button class="sort-button" class:active={querySort === 'position'} type="button" onclick={() => setQuerySort('position')}>Position <span>{sortArrow(querySort, 'position', querySortDirection)}</span></button></th>
            </tr>
          </thead>
          <tbody>
            {#each queryRows as row}
              <tr class:selected={selectedQuery === row.query && selectedPage === row.page} onclick={() => selectQuery(row)}>
                <td class="query-cell">{row.query}</td>
                <td title={row.page}>{shortPage(row.page)}</td>
                <td>{formatNumber(row.queryClicks)}</td>
                <td>{formatNumber(row.queryImpressions)}</td>
                <td>{formatPercent(row.queryCtr)}</td>
                <td>{formatPosition(row.queryPosition)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if !queryRows.length}<p class="no-results">No disclosed queries match the current filters.</p>{/if}
      {#if queryRows.length === 100}<p class="table-note">Showing the top 100 matching queries by impressions.</p>{/if}
    </section>

    <footer>
      <p>Source: {data.report.name}. Query rows can exclude anonymized, low-volume searches. Partial periods are labeled and may not be directly comparable with complete periods. URL Inspection reports the version in Google’s index; crawl timing is context, not proof of ranking causation.</p>
    </footer>
  {/if}
</main>

{#snippet Delta(value, digits = 0, inverse = false, suffix = '')}
  {@const item = formatDelta(value, digits, inverse)}
  <small class={`delta ${item.className}`}>{item.text}{suffix}</small>
{/snippet}

{#snippet MetricDelta(value, digits = 0, inverse = false, suffix = '')}
  {@const item = formatDelta(value, digits, inverse)}
  <small class={item.className}>{item.text}{suffix}</small>
{/snippet}

<style>
  :global(body) { margin: 0; background: #071016; color: #eaf0ef; }
  :global(header.site-header), :global(footer.site-footer), :global(.tawk-min-container) { display: none !important; }
  :global(body) { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .dashboard-shell { min-height: 100vh; padding: 2rem clamp(1rem, 3vw, 3rem) 4rem; background: radial-gradient(circle at 9% 3%, rgba(55, 216, 172, .12), transparent 26rem), radial-gradient(circle at 90% 12%, rgba(79, 140, 255, .12), transparent 32rem), #071016; }
  .dashboard-shell > * { max-width: 1480px; margin-inline: auto; }
  .hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: end; padding: 2.1rem; border: 1px solid #26353d; border-radius: 26px; background: linear-gradient(145deg, rgba(16, 31, 39, .95), rgba(10, 21, 27, .96)); box-shadow: 0 24px 80px rgba(0, 0, 0, .24); }
  h1, h2, p { margin-top: 0; }
  h1, h2, .dashboard-shell strong { color: #f4f8f7; }
  h1 { max-width: 780px; margin-bottom: .65rem; font-size: clamp(2.4rem, 5vw, 5.4rem); line-height: .97; letter-spacing: -.055em; }
  h2 { margin-bottom: .3rem; font-size: clamp(1.45rem, 2.3vw, 2.15rem); letter-spacing: -.035em; }
  .eyebrow { margin-bottom: .65rem; color: #5ee1b5; font: 700 .72rem/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .13em; text-transform: uppercase; }
  .hero-copy { max-width: 680px; margin-bottom: 0; color: #9fb0b7; font-size: 1.05rem; line-height: 1.6; }
  .source-card { min-width: 230px; padding: 1.15rem 1.3rem; border: 1px solid #304049; border-radius: 18px; background: rgba(255, 255, 255, .035); } .source-card span, .source-card small { display: block; color: #8fa1a9; } .source-card strong { display: block; margin: .18rem 0 .55rem; color: #fff; font-size: 1.55rem; }
  .control-bar { position: sticky; top: .75rem; z-index: 5; display: grid; grid-template-columns: auto minmax(190px, .5fr) minmax(260px, 1fr); gap: 1rem; align-items: end; margin-top: 1rem; padding: .85rem; border: 1px solid #26353d; border-radius: 18px; background: rgba(8, 19, 25, .92); box-shadow: 0 12px 35px rgba(0,0,0,.3); backdrop-filter: blur(18px); }
  .segmented { display: flex; padding: .25rem; border: 1px solid #2c3b43; border-radius: 12px; background: #0c181e; } .segmented button { flex: 1; border: 0; border-radius: 9px; padding: .68rem 1rem; color: #91a1a8; background: transparent; cursor: pointer; } .segmented button.active { color: #071511; background: #5ee1b5; }
  label span { display: block; margin: 0 0 .35rem .15rem; color: #84969e; font-size: .73rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
  select, input { width: 100%; box-sizing: border-box; border: 1px solid #40535d; border-radius: 11px; padding: .72rem .8rem; color: #f4f8f7; background: #0c181e; font: inherit; }
  select { color-scheme: dark; cursor: pointer; }
  select option { color: #f4f8f7; background: #13242c; }
  select:focus, select:focus-visible, select:active { border-color: #5ee1b5; color: #f4f8f7; background-color: #0c181e; outline: 3px solid rgba(94, 225, 181, .18); outline-offset: 1px; }
  input:focus { border-color: #5ee1b5; outline: 3px solid rgba(94, 225, 181, .18); outline-offset: 1px; }
  input::placeholder { color: #7f929a; }
  .period-heading { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-top: 2.2rem; } .period-context { position: relative; z-index: 30; display: flex; gap: .55rem; flex-wrap: wrap; } .period-context span, .period-context button { padding: .38rem .7rem; border: 1px solid #2d3e46; border-radius: 999px; color: #9eafb6; background: transparent; font: inherit; font-size: .78rem; } .period-context button { cursor: pointer; } .period-context button:hover:not(:disabled), .period-context button:focus-visible { border-color: #5ee1b5; color: #5ee1b5; outline: none; } .period-context button.active { border-color: rgba(94, 225, 181, .32); color: #5ee1b5; background: rgba(94, 225, 181, .08); cursor: default; } .period-context .partial { border-color: rgba(244, 180, 66, .35); color: #f4b442; background: rgba(244, 180, 66, .08); }
  .period-context .export-trigger { position: relative; z-index: 40; border-color: #3b5c55; color: #5ee1b5; background: rgba(94, 225, 181, .08); }
  .period-context .export-trigger span { padding: 0; border: 0; color: #82a69c; background: transparent; }
  .export-menu { position: absolute; top: .25rem; right: 0; z-index: 50; display: grid; width: 230px; padding: .4rem; border: 1px solid #344850; border-radius: 13px; background: #09171d; box-shadow: 0 16px 40px rgba(0, 0, 0, .48); }
  .export-menu button { display: grid; gap: .12rem; border: 0; border-radius: 9px; padding: .65rem .7rem; color: #eef7f4; background: transparent; font: inherit; font-size: .78rem; text-align: left; cursor: pointer; }
  .export-menu button:hover:not(:disabled), .export-menu button:focus-visible { color: #071511; background: #5ee1b5; outline: none; }
  .export-menu button small { color: #7f929a; font-size: .66rem; }
  .export-menu button:hover:not(:disabled) small, .export-menu button:focus-visible small { color: #17352b; }
  .kpi-grid { position: relative; z-index: 1; }
  .kpi-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .8rem; margin-top: .8rem; } .kpi-grid article { padding: 1.15rem; border: 1px solid #25353c; border-radius: 17px; background: linear-gradient(160deg, rgba(20, 36, 43, .82), rgba(10, 22, 28, .9)); } .kpi-grid span { color: #8b9da5; font-size: .8rem; } .kpi-grid strong { display: block; margin: .3rem 0 .25rem; color: #f4f8f7; font-size: clamp(1.55rem, 2.4vw, 2.4rem); letter-spacing: -.045em; } .kpi-grid small { font-size: .78rem; }
  .positive { color: #5ee1b5 !important; } .negative { color: #ff7f87 !important; } .neutral { color: #8b9da5 !important; }
  .panel { margin-top: 1rem; padding: 1.3rem; border: 1px solid #25353c; border-radius: 20px; background: rgba(12, 25, 31, .88); } .panel-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: start; margin-bottom: 1rem; } .panel-heading p:not(.eyebrow) { margin-bottom: 0; color: #84969e; }
  .legend { display: flex; gap: .85rem; flex-wrap: wrap; justify-content: flex-end; color: #8fa1a9; font-size: .78rem; } .legend i { display: inline-block; width: 9px; height: 9px; margin-right: .32rem; border-radius: 2px; background: #4f8cff; } .legend i.clicks { border-radius: 50%; background: #5ee1b5; } .legend i.ctr { border-radius: 50%; background: #f4b442; } .legend i.position { border-radius: 50%; background: #c58cff; } .legend i.queries { border-radius: 50%; background: #ff7f87; }
  .trend-chart-scroll { overflow-x: auto; overflow-y: hidden; padding: .25rem 0 .5rem; }
  .trend-chart { position: relative; min-width: 760px; height: 280px; isolation: isolate; }
  .trend-lines { position: absolute; inset: 0; width: 100%; height: 240px; overflow: visible; }
  .grid-line { stroke: rgba(143, 161, 169, .12); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .grid-line.baseline { stroke: rgba(143, 161, 169, .28); }
  .event-boundary { stroke: rgba(244, 180, 66, .33); stroke-width: 1; stroke-dasharray: 4 5; vector-effect: non-scaling-stroke; }
  .series-line { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; vector-effect: non-scaling-stroke; }
  .series-line.impressions { stroke: #4f8cff; }
  .series-line.clicks { stroke: #5ee1b5; stroke-width: 2; }
  .series-line.ctr { stroke: #f4b442; stroke-width: 2; stroke-dasharray: 7 5; }
  .series-line.position { stroke: #c58cff; stroke-width: 2; }
  .series-line.queries { stroke: #ff7f87; stroke-width: 2; stroke-dasharray: 2 5; }
  .series-point { stroke: #071016; stroke-width: 2; vector-effect: non-scaling-stroke; }
  .series-point.impressions { fill: #4f8cff; }
  .series-point.clicks { fill: #5ee1b5; }
  .series-point.ctr { fill: #f4b442; }
  .series-point.position { fill: #c58cff; }
  .series-point.queries { fill: #ff7f87; }
  .series-point.active { stroke: #f4f8f7; stroke-width: 3; }
  .trend-period { position: absolute; inset-block: 0; z-index: 2; }
  .trend-period:hover, .trend-period:focus-within { z-index: 10; }
  .trend-hit { position: absolute; inset: 0; width: 100%; border: 0; border-radius: 8px; padding: 0; color: #6f828a; background: transparent; cursor: crosshair; }
  .trend-hit::after { content: ""; position: absolute; top: 24px; bottom: 38px; left: 50%; width: 1px; background: transparent; }
  .trend-period:hover .trend-hit::after, .trend-period:focus-within .trend-hit::after, .trend-period.active .trend-hit::after { background: rgba(244, 248, 247, .25); }
  .trend-hit:focus-visible { outline: 2px solid #5ee1b5; outline-offset: -2px; }
  .trend-hit > small { position: absolute; right: 0; bottom: 4px; left: 0; font-size: .68rem; }
  .trend-period.active .trend-hit > small { color: #5ee1b5; }
  .trend-period.partial .trend-hit > small { color: #f4b442; }
  .trend-tooltip { position: absolute; top: 28px; left: 50%; z-index: 8; display: none; width: min(420px, 78vw); max-height: 220px; overflow-y: auto; overscroll-behavior: contain; padding: .85rem; border: 1px solid #41555e; border-radius: 12px; color: #dce6e5; background: rgba(5, 15, 20, .98); box-shadow: 0 18px 48px rgba(0, 0, 0, .48); text-align: left; transform: translateX(-50%); scrollbar-color: #41555e #0c181e; scrollbar-width: thin; }
  .trend-period:hover .trend-tooltip, .trend-period:focus-within .trend-tooltip { display: block; }
  .trend-period.edge-left .trend-tooltip { left: 0; transform: none; }
  .trend-period.edge-right .trend-tooltip { right: 0; left: auto; transform: none; }
  .trend-tooltip > strong { display: block; margin-bottom: .55rem; color: #fff; font-size: .9rem; }
  .tooltip-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .3rem .8rem; color: #8fa1a9; font-size: .74rem; }
  .tooltip-metrics b { color: #eef7f4; }
  .tooltip-tabs { display: flex; gap: .25rem; margin-top: .7rem; padding-top: .65rem; border-top: 1px solid #2b3d45; }
  .tooltip-tabs button { display: inline-flex; gap: .35rem; align-items: center; border: 1px solid #30444a; border-radius: 999px; padding: .35rem .55rem; color: #91a1a8; background: #0c181e; font-size: .68rem; cursor: pointer; }
  .tooltip-tabs button span { min-width: 1.15rem; padding: .05rem .25rem; border-radius: 999px; color: #bdcacd; background: rgba(255,255,255,.08); text-align: center; }
  .tooltip-tabs button.active { border-color: #5ee1b5; color: #071511; background: #5ee1b5; }
  .tooltip-tabs button.active span { color: #071511; background: rgba(7,16,22,.12); }
  .tooltip-events { display: grid; gap: .55rem; margin-top: .7rem; padding-top: .65rem; border-top: 1px solid #2b3d45; }
  .tooltip-events > p { margin: 0; color: #81949b; font-size: .74rem; }
  .tooltip-event { display: grid; gap: .24rem; color: #aebcc0; font-size: .72rem; line-height: 1.4; }
  .tooltip-event > span { display: flex; gap: .3rem; align-items: center; color: #dce6e5; }
  .tooltip-event > strong { color: #eef7f4; font-size: .76rem; }
  .tooltip-event > p { margin: 0; color: #aebcc0; }
  .tooltip-event em { color: #81949b; font-style: normal; overflow-wrap: anywhere; }
  .crawl-page-highlight { display: grid; gap: .12rem; margin: .2rem 0; padding: .55rem .65rem; border: 1px solid rgba(94, 225, 181, .4); border-radius: 9px; background: rgba(94, 225, 181, .08); }
  .crawl-page-highlight span { color: #74a797; font-size: .62rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .crawl-page-highlight strong { color: #72edc4; font: 700 .76rem/1.35 ui-monospace, SFMono-Regular, Consolas, monospace; overflow-wrap: anywhere; }
  .tooltip-event .last-crawl-time { color: #b6c6c4; }
  .tooltip-event .last-crawl-time b { color: #72edc4; }
  .tooltip-event code, .commit-marker code { color: #c8d0ff; font: 600 .68rem/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
  .table-heading label { min-width: 205px; } .table-wrap { overflow: auto; max-height: 620px; border: 1px solid #23343b; border-radius: 14px; } table { width: 100%; border-collapse: collapse; font-size: .86rem; } th { position: sticky; top: 0; z-index: 1; padding: 0; color: #7f929a; background: #101f26; text-align: right; font-size: .7rem; letter-spacing: .06em; text-transform: uppercase; } th:first-child, td:first-child, .query-cell { text-align: left; } td { padding: .68rem .8rem; border-top: 1px solid rgba(49, 68, 77, .55); color: #cbd6d8; text-align: right; white-space: nowrap; } tbody tr { cursor: pointer; } tbody tr:hover, tbody tr.selected { background: rgba(94, 225, 181, .06); } .sort-button { width: 100%; display: inline-flex; gap: .35rem; justify-content: flex-end; align-items: center; border: 0; padding: .78rem .8rem; color: #84969e; background: transparent; font: inherit; font-weight: 700; letter-spacing: inherit; text-transform: inherit; cursor: pointer; } th:first-child .sort-button { justify-content: flex-start; } .sort-button span { color: #53666f; font-size: .85rem; } .sort-button:hover, .sort-button:focus-visible, .sort-button.active { color: #f4f8f7; background: rgba(94, 225, 181, .07); outline: none; } .sort-button.active span { color: #5ee1b5; } .page-link { max-width: min(48vw, 620px); overflow: hidden; border: 0; padding: 0; color: #eaf0ef; background: transparent; text-align: left; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; } .query-cell { max-width: 520px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .delta { margin-left: .35rem; font-size: .7rem; }
  .clear-button { border: 1px solid #35504b; border-radius: 999px; padding: .6rem .85rem; color: #5ee1b5; background: rgba(94,225,181,.06); cursor: pointer; } .no-results, .table-note { margin: .9rem 0 0; color: #7f929a; font-size: .82rem; }
  footer { margin-top: 1.2rem; color: #6f828a; font-size: .78rem; line-height: 1.55; } .empty-state { max-width: 720px; margin-top: 10vh; padding: 2rem; border: 1px solid #25353c; border-radius: 20px; background: #0c191f; }
  .event-markers { position: absolute; top: 8px; right: 0; left: 0; z-index: 3; display: flex; justify-content: center; gap: 3px; pointer-events: none; }
  .event-marker { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #8b9da5; box-shadow: 0 0 0 2px #101f26; }
  .commit-marker { display: inline-flex; gap: .25rem; align-items: center; border: 1px solid rgba(168, 181, 255, .38); border-radius: 999px; padding: .2rem .35rem; background: rgba(7, 16, 22, .92); box-shadow: 0 4px 12px rgba(0, 0, 0, .35); }
  .commit-marker .event-marker { flex: 0 0 auto; box-shadow: none; }
  .event-marker.code_change, .legend .change-marker { border-radius: 2px; background: #a8b5ff; }
  .event-marker.deployment, .legend .deploy-marker { background: #f4b442; }
  .event-marker.google_crawl, .legend .crawl-marker { background: #5ee1b5; }
  @media (max-width: 980px) { .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .control-bar { grid-template-columns: 1fr 1fr; } .search-control { grid-column: 1 / -1; } }
  @media (max-width: 680px) { .dashboard-shell { padding: 1rem .7rem 3rem; } .hero { grid-template-columns: 1fr; padding: 1.3rem; } .source-card { min-width: 0; } .control-bar { position: static; grid-template-columns: 1fr; } .search-control { grid-column: auto; } .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .period-heading, .panel-heading { align-items: stretch; flex-direction: column; } .trend-chart { min-width: 680px; height: 270px; } }
  /* HUD chrome keeps the existing metric and chart semantics. */
  :global(html) { scroll-behavior: smooth; color-scheme: dark; }
  :global(body) { background: #080d16; }
  :global(*:focus-visible) { outline: 2px solid #74e5ee; outline-offset: 4px; }
  .dashboard-shell { background: radial-gradient(ellipse at 75% 0, #10263d80, transparent 52rem), linear-gradient(#6bbfde06 1px, transparent 1px), linear-gradient(90deg, #6bbfde06 1px, transparent 1px), #080d16; background-size: auto, 48px 48px, 48px 48px, auto; }
  .hud-nav { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0 .2rem 1.5rem; font: 600 .76rem/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .12em; }
  .hud-brand { display: inline-flex; align-items: center; gap: .8rem; color: #c2d0e3; text-decoration: none; }
  .hud-brand b { color: #83edf4; margin-left: .6rem; padding-left: .8rem; border-left: 1px solid #385269; }
  .hud-mark { display: grid; place-items: center; width: 2.3rem; height: 2.3rem; color: #83edf4; border: 1px solid #477988; font-size: 1.9rem; box-shadow: inset 0 0 18px #74e5ee12; }
  .hud-channel { display: flex; align-items: center; gap: .65rem; color: #9bb5cb; font-size: .65rem; }
  .hud-channel i { width: .4rem; height: .4rem; border-radius: 50%; background: #74e5ee; box-shadow: 0 0 10px #74e5ee70; }
  .hud-channel > span { color: #6c8aa3; }
  .hero { position: relative; overflow: hidden; border-radius: 4px; border-color: #365266; background: linear-gradient(115deg, #122536ed, #0c1523f5 72%); box-shadow: 0 12px 40px #0003, inset 3px 0 #74e5ee; padding: 2.3rem; }
  .hero::after { content: ''; position: absolute; right: 0; top: 0; width: 72px; height: 4px; background: #74e5ee; }
  h1 { font-size: clamp(2.4rem, 4.8vw, 4.7rem); line-height: 1.04; letter-spacing: -.05em; max-width: 780px; }
  h1 span { color: #83edf4; }
  h2 { letter-spacing: -.025em; }
  .eyebrow { color: #83edf4; font-size: .68rem; letter-spacing: .16em; }
  .hero-copy { max-width: 570px; color: #a8bed0; font-size: .98rem; }
  .source-card { border-radius: 3px; border-color: #375369; background: #080f1bbf; max-width: 300px; }
  .source-card > span { font: 600 .65rem/1.5 ui-monospace, monospace; letter-spacing: .07em; text-transform: uppercase; color: #a2bdd0; }
  .source-card strong { font-family: ui-monospace, monospace; font-size: 1.65rem; font-weight: 500; letter-spacing: -.06em; }
  .source-card .snapshot-note { margin-top: .6rem; padding-top: .6rem; border-top: 1px solid #263d50; color: #b4c7d6; font-size: .7rem; line-height: 1.5; }
  .control-bar { border-radius: 4px; border-color: #30495f; background: #0b1624ed; }
  .segmented, select, input { border-radius: 3px; background: #0a1421; }
  .segmented button { border-radius: 2px; font: 600 .76rem/1.4 ui-monospace, monospace; }
  .segmented button.active { color: #061820; background: #83edf4; box-shadow: 0 0 18px #83edf415; }
  .period-context > span, .period-context > button { border-radius: 3px; }
  .kpi-grid article { position: relative; border-radius: 4px; border-color: #30495d; background: linear-gradient(140deg, #132539ed, #0b1522); border-top: 2px solid #5485ad; }
  .kpi-grid article:nth-of-type(1) { border-top-color: #5ee1b5; }
  .kpi-grid article:nth-of-type(2) { border-top-color: #4f8cff; }
  .kpi-grid article:nth-of-type(3) { border-top-color: #f4b442; }
  .kpi-grid article:nth-of-type(4) { border-top-color: #c58cff; }
  .kpi-grid article:nth-of-type(6) { border-top-color: #ff7f87; }
  .kpi-grid article > span { font: 500 .65rem/1.5 ui-monospace, monospace; letter-spacing: .04em; text-transform: uppercase; color: #a9bfd2; }
  .kpi-grid strong { font-family: ui-monospace, monospace; font-weight: 500; letter-spacing: -.055em; }
  .panel { border-radius: 4px; border-color: #30495d; background: #0d1928f0; }
  .panel-heading { padding-bottom: 1rem; border-bottom: 1px solid #2b4054; }
  .legend, .table-note, footer { color: #a2b5c8; }
  th { background: #122439; }
  label span, .sort-button { color: #a4bcd0; }
  .export-menu { border-radius: 4px; }
  @media (max-width: 1000px) { .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .hero { grid-template-columns: 1fr; } .source-card { max-width: none; } }
  @media (max-width: 680px) { .hud-nav { padding-bottom: 1rem; gap: .5rem; } .hud-channel { font-size: .53rem; letter-spacing: .02em; } .hud-channel > span { display: none; } .hud-brand { font-size: .65rem; gap: .5rem; } .hud-brand b { margin-left: .3rem; padding-left: .4rem; } .hero { padding: 1.5rem; } .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .kpi-grid article { padding: 1rem .8rem; } }
  @media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; } }
</style>
