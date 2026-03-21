#!/usr/bin/env node
/**
 * Build IT Service Desk Manager Dashboard from sample ITSM dashboards.
 * Merges panels for: team workload, SLA compliance, MTTR trends, agent performance, backlog aging.
 *
 * Run: node build-manager-dashboard.js
 * Output: IT-Service-Desk-Manager-Dashboard.json
 */

const fs = require('fs');
const path = require('path');

const SAMPLES = path.join(__dirname, 'sample-itsm-dashboard-jsons');
const INC_DASH = 'Incident Dashboard-1774077411211.json';
const INC_SLA = 'Incident SLA Performance-1774077412441.json';
const CLOSED = 'Closed Incidents Metrics-1774077408285.json';
const AGING = 'Aging Incident Analysis-1774077399771.json';
const AGED_BACKLOG = 'Incident Aged Backlog Analysis-1774077410356.json';

function load(name) {
  const p = path.join(SAMPLES, name);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function addRow(panels, y, title) {
  panels.push({
    collapsed: false,
    gridPos: { h: 1, w: 24, x: 0, y },
    id: 9000 + y,
    panels: [],
    title,
    type: 'row',
  });
  return y + 1;
}

function placePanel(p, baseY, w, h, x) {
  const copy = JSON.parse(JSON.stringify(p));
  copy.gridPos = { h: h || copy.gridPos?.h || 4, w: w || copy.gridPos?.w || 6, x: x ?? 0, y: baseY };
  copy.id = (copy.id || 0) + 1000;
  return copy;
}

function main() {
  const inc = load(INC_DASH);
  const sla = load(INC_SLA);
  const closed = load(CLOSED);
  const aging = load(AGING);
  const backlog = load(AGED_BACKLOG);

  const panels = [];
  let y = 0;

  // Row 1: Hero KPIs
  y = addRow(panels, y, 'Hero KPIs — Team Overview');
  const incPanels = inc.panels.filter((p) => p.type !== 'row');
  const openStat = incPanels.find((p) => p.title === 'Open');
  const unassignedStat = incPanels.find((p) => p.title === 'Unassigned');
  const overdueStat = incPanels.find((p) => p.title === 'Overdue');
  const avgAgeStat = incPanels.find((p) => p.title === 'Avg open incidents age');
  const closedPanels = closed.panels.filter((p) => p.type !== 'row');
  const slaMetStat = closedPanels.find((p) => p.title === 'SLA Met Incidents (%)');
  const reopenedStat = closedPanels.find((p) => p.title === 'Re-open Incidents (%)');

  if (openStat) panels.push(placePanel(openStat, y, 4, 3, 0));
  if (unassignedStat) panels.push(placePanel(unassignedStat, y, 4, 3, 4));
  if (overdueStat) panels.push(placePanel(overdueStat, y, 4, 3, 8));
  if (slaMetStat) panels.push(placePanel(slaMetStat, y, 4, 3, 12));
  if (avgAgeStat) panels.push(placePanel(avgAgeStat, y, 4, 3, 16));
  if (reopenedStat) panels.push(placePanel(reopenedStat, y, 4, 3, 20));
  y += 4;

  // Row 2: SLA at Risk
  y = addRow(panels, y, 'SLA at Risk — Open Backlog');
  const backlogStats = backlog.panels.filter((p) => p.type === 'stat' && ['Already missed', 'Close to target', 'Ongoing', 'Stopped clock'].some(t => p.title?.toLowerCase().includes(t.toLowerCase())));
  let sx = 0;
  for (const s of backlogStats.slice(0, 4)) {
    panels.push(placePanel(s, y, 6, 6, sx));
    sx += 6;
  }
  y += 7;

  // Row 3: SLA Performance
  y = addRow(panels, y, 'SLA Compliance — Response & Resolution');
  const slaBars = sla.panels.filter((p) => p.type === 'bmc-ade-bar' && (p.title?.includes('Response') || p.title?.includes('Resolution')));
  if (slaBars[0]) panels.push(placePanel(slaBars[0], y, 12, 9, 0));
  if (slaBars[1]) panels.push(placePanel(slaBars[1], y, 12, 9, 12));
  y += 10;

  // Row 4: MTTR
  y = addRow(panels, y, 'MTTR — Mean Time To Resolve');
  const mttrStat = closedPanels.find((p) => p.title?.includes('MTTR'));
  const mttrTrend = closedPanels.find((p) => p.title === 'MTTR Trend');
  const mttrByGroup = closedPanels.find((p) => p.title?.includes('MTTR by support'));
  if (mttrStat) panels.push(placePanel(mttrStat, y, 6, 4, 0));
  if (mttrTrend) panels.push(placePanel(mttrTrend, y, 18, 8, 6));
  y += 9;
  if (mttrByGroup) panels.push(placePanel(mttrByGroup, y, 24, 10, 0));
  y += 11;

  // Row 5: Team Workload
  y = addRow(panels, y, 'Team Workload — Incidents by Group');
  const incByGroup = incPanels.find((p) => p.title?.includes('Incidents status by assigned group') || p.title?.includes('Incidents by'));
  const incTrend = incPanels.find((p) => p.title === 'Incident trend');
  const agingBars = aging.panels.filter((p) => p.type === 'bmc-ade-bar' && p.title?.toLowerCase().includes('assigned group'));
  if (incByGroup) panels.push(placePanel(incByGroup, y, 12, 8, 0));
  if (incTrend) panels.push(placePanel(incTrend, y, 12, 8, 12));
  y += 9;
  if (agingBars[0]) panels.push(placePanel(agingBars[0], y, 24, 9, 0));
  y += 10;

  // Row 6: Agent Performance (custom panels - use MTTR by group as proxy; add Assignee-based later)
  y = addRow(panels, y, 'Agent Performance');
  // Closed per agent - clone MTTR by group but change query to Assignee
  const mttrBar = closedPanels.find((p) => p.type === 'bmc-ade-bar' && p.title?.includes('MTTR by support'));
  if (mttrBar) {
    const agentClosed = JSON.parse(JSON.stringify(mttrBar));
    agentClosed.id = 601;
    agentClosed.title = 'Incidents closed per agent (Assignee)';
    agentClosed.gridPos = { h: 9, w: 12, x: 0, y };
    if (agentClosed.targets?.[0]?.sourceQuery?.rawQuery) {
      agentClosed.targets[0].sourceQuery.rawQuery = `SELECT
(CASE WHEN \`HPD:Help Desk\`.\`Assignee\` IS NOT NULL THEN \`HPD:Help Desk\`.\`Assignee\` ELSE 'Unassigned' END) AS Assignee,
COUNT(1) AS closed_count
FROM \`HPD:Help Desk\`
WHERE (\`HPD:Help Desk\`.\`Company\` In ($company)) and (\`HPD:Help Desk\`.\`Assigned Group\` In ($AssignedGroup)) and \`HPD:Help Desk\`.\`Status\`= 'Closed'
and (\`HPD:Help Desk\`.\`Closed Date\` >= $__from/1000 and \`HPD:Help Desk\`.\`Closed Date\` <= $__to/1000)
GROUP BY Assignee
ORDER BY closed_count desc
Limit 10`;
    }
    if (agentClosed.options?.chartConfig) {
      agentClosed.options.chartConfig.barDataField = 'Assignee';
      agentClosed.options.chartConfig.categoryAxisField = 'Assignee';
      agentClosed.options.chartConfig.valueAxisField = 'closed_count';
    }
    panels.push(agentClosed);
  }
  const mttrAgent = closedPanels.find((p) => p.type === 'bmc-ade-bar' && p.title?.includes('MTTR by support'));
  if (mttrAgent) {
    const agentMttr = JSON.parse(JSON.stringify(mttrAgent));
    agentMttr.id = 602;
    agentMttr.title = 'MTTR by agent (Assignee)';
    agentMttr.gridPos = { h: 9, w: 12, x: 12, y };
    if (agentMttr.targets?.[0]?.sourceQuery?.rawQuery) {
      agentMttr.targets[0].sourceQuery.rawQuery = `SELECT
(CASE WHEN \`HPD:Help Desk\`.\`Assignee\` IS NOT NULL THEN \`HPD:Help Desk\`.\`Assignee\` ELSE 'Unassigned' END) AS Assignee,
AVG(CASE WHEN \`HPD:Help Desk\`.\`Status\` in ('Resolved','Closed') THEN DateDiff('dd',\`HPD:Help Desk\`.\`Submit Date\`,\`HPD:Help Desk\`.\`Last Resolved Date\`) ELSE 0 END) AS CF1
FROM \`HPD:Help Desk\`
WHERE (\`HPD:Help Desk\`.\`Company\` In ($company)) and (\`HPD:Help Desk\`.\`Assigned Group\` In ($AssignedGroup)) and \`HPD:Help Desk\`.\`Status\`= 'Closed'
and (\`HPD:Help Desk\`.\`Closed Date\` >= $__from/1000 and \`HPD:Help Desk\`.\`Closed Date\` <= $__to/1000)
GROUP BY Assignee
ORDER BY CF1 desc
Limit 10`;
    }
    if (agentMttr.options?.chartConfig) {
      agentMttr.options.chartConfig.barDataField = 'Assignee';
      agentMttr.options.chartConfig.categoryAxisField = 'Assignee';
      agentMttr.options.chartConfig.valueAxisField = 'CF1';
    }
    panels.push(agentMttr);
  }
  y += 10;

  // Row 7: Backlog Aging
  y = addRow(panels, y, 'Backlog Aging');
  const backlogAgingBars = backlog.panels.filter((p) => p.type === 'bmc-ade-bar' && p.title?.toLowerCase().includes('aging'));
  const agingCrosstab = aging.panels.find((p) => p.type === 'bmc-ade-cross-tab' && p.title?.toLowerCase().includes('aging'));
  const agingStats = backlog.panels.filter((p) => p.type === 'stat' && (p.title?.includes('0 - 5') || p.title?.includes('6 - 15') || p.title?.includes('16 - 30') || p.title?.includes('30 days')));
  let ax = 0;
  for (const as of backlog.panels.filter((p) => p.type === 'stat' && p.title?.match(/Incidents between|More than|days/)).slice(0, 4)) {
    panels.push(placePanel(as, y, 6, 4, ax));
    ax += 6;
  }
  y += 5;
  if (backlogAgingBars[0]) panels.push(placePanel(backlogAgingBars[0], y, 12, 9, 0));
  if (agingCrosstab) panels.push(placePanel(agingCrosstab, y, 12, 9, 12));
  y += 10;

  // Variables
  const templating = {
    list: inc.templating?.list?.filter((v) => ['company', 'AssignedGroup', 'priority'].includes(v.name)) || [],
  };
  if (templating.list.length === 0) {
    templating.list = [
      { allValue: '', current: { selected: false, text: 'All', value: '$__all' }, datasource: 'BMC Helix', definition: 'remedy,{"sql": "SELECT DISTINCT `HPD:Help Desk`.`Company` FROM `HPD:Help Desk` WHERE (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000) LIMIT 1000"}', hide: 0, includeAll: true, label: 'Company', multi: false, name: 'company', options: [], query: 'remedy,{"sql": "SELECT DISTINCT `HPD:Help Desk`.`Company` FROM `HPD:Help Desk` WHERE (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000) LIMIT 1000"}', refresh: 2, regex: '', skipUrlSync: false, sort: 0, type: 'query' },
      { allValue: '', current: { selected: false, text: 'All', value: '$__all' }, datasource: 'BMC Helix', definition: 'remedy,{"sql": "SELECT `HPD:Help Desk`.`Assigned Group` FROM `HPD:Help Desk` where (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000)"}', hide: 0, includeAll: true, label: 'Assigned group', multi: false, name: 'AssignedGroup', options: [], query: 'remedy,{"sql": "SELECT `HPD:Help Desk`.`Assigned Group` FROM `HPD:Help Desk` where (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000)"}', refresh: 2, regex: '', skipUrlSync: false, sort: 0, type: 'query' },
      { allValue: '', current: { selected: false, text: 'All', value: '$__all' }, datasource: 'BMC Helix', definition: 'remedy,{"sql": "SELECT DISTINCT `HPD:Help Desk`.`Priority` FROM `HPD:Help Desk` where (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000) LIMIT 1000"}', hide: 0, includeAll: true, label: 'Priority', multi: false, name: 'priority', options: [], query: 'remedy,{"sql": "SELECT DISTINCT `HPD:Help Desk`.`Priority` FROM `HPD:Help Desk` where (`HPD:Help Desk`.`Submit Date` >= $__from/1000 and `HPD:Help Desk`.`Submit Date` <= $__to/1000) LIMIT 1000"}', refresh: 2, regex: '', skipUrlSync: false, sort: 0, type: 'query' },
    ];
  }
  // Add SLA variables
  const slaVars = sla.templating?.list?.filter((v) => ['AssignedSupportCompany', 'AssignedSupportOrg'].includes(v.name)) || [];
  for (const v of slaVars) templating.list.push(v);

  // Add Service (for MTTR/Closed Metrics), Company alias (Aged Backlog uses $Company), Impact
  const baseCompany = templating.list.find((v) => v.name === 'company');
  if (baseCompany) {
    const co = JSON.parse(JSON.stringify(baseCompany));
    co.name = 'Company';
    co.label = 'Company';
    templating.list.push(co);
  }
  const closedVars = closed.templating?.list?.find((v) => v.name === 'Service');
  if (closedVars) templating.list.push(JSON.parse(JSON.stringify(closedVars)));
  const impactVar = backlog.templating?.list?.find((v) => v.name === 'Impact');
  if (impactVar) templating.list.push(JSON.parse(JSON.stringify(impactVar)));

  const dash = {
    __elements: {},
    __inputs: [],
    annotations: inc.annotations,
    editable: true,
    fiscalYearStartMonth: 0,
    graphTooltip: 2,
    id: null,
    links: [],
    liveNow: false,
    panels,
    refresh: '1m',
    schemaVersion: 39,
    style: 'dark',
    tags: ['Manager', 'Service Desk', 'Demo'],
    templating,
    time: { from: 'now-30d', to: 'now' },
    timepicker: { hidden: false, refresh_intervals: ['5s', '10s', '30s', '1m', '5m', '15m', '30m', '1h', '2h', '1d'] },
    timezone: '',
    title: 'IT Service Desk Manager Dashboard',
    uid: 'IT_Service_Desk_Manager',
    version: 1,
    weekStart: '',
  };

  const outPath = path.join(__dirname, 'IT-Service-Desk-Manager-Dashboard.json');
  fs.writeFileSync(outPath, JSON.stringify(dash, null, 2), 'utf8');
  console.log('Written:', outPath);
  console.log('Panels:', panels.length);
}

main();
