# L1 Incident Management Dashboard — Build Plan

**Purpose:** Demo-ready Grafana dashboard for L1 engineers in Incident Management  
**Target:** Petronas demo / BMC Helix ITSM  
**Data Source:** BMC Helix (HPD:Help Desk, SLM:Measurement)  
**Last Updated:** 2025-03-21

---

## 1. Executive Summary

This plan consolidates the best visualizations from 50 sample ITSM dashboards into a single, demo-ready **L1 Incident Management Dashboard**. The dashboard answers: *"What does an L1 engineer need to see when they open their screen?"* and is designed to look professional and impressive for stakeholders.

---

## 2. Sample Dashboard Review — Key Findings

### 2.1 Relevant Sources Reviewed

| Dashboard | Strength | Primary Use |
|-----------|----------|-------------|
| **Incident Agent Dashboard** | Agent-centric, My Incidents, SLA by assignee | Assignee filters, my work, drill-through |
| **Incident Dashboard** | Operational KPIs, trend, by group | Unassigned, overdue, SLA breached |
| **Incident SLA Performance** | Response/Resolution SLA Met vs Missed | SLA governance |
| **Open Incident Analysis** | Categorization, services, CIs, problems | Deep dive, top N |
| **Aging Incident Analysis** | Aging buckets, assigned group by age | Backlog management |
| **Incident Aged Backlog Analysis** | SLA status (Missed, Close to Target, Ongoing) | SLA-at-risk visibility |
| **Major Incident Analysis** | MTTR, MTBF, MTTA, SLA compliance | Major incident metrics |

### 2.2 Panel Types Used in Samples

- **stat** — Single-value KPI cards (counts, percentages, averages)
- **piechart** / **donut** — Distribution (Status, Priority, SLA Status)
- **timeseries** — Trend over time (Created, Open, Closed, Critical, Reopened)
- **bmc-ade-bar** — Bar charts (horizontal/vertical, stacked)
- **bmc-ade-cross-tab** — Heatmap/crosstab (Priority × Status, Aging × Group)
- **bmc-record-details** — Incident cards with links to BMC Helix
- **text** — Row headers, section labels

### 2.3 Variable Patterns

- **Company** — `HPD:Help Desk`.`Company`
- **AssignedGroup** — `HPD:Help Desk`.`Assigned Group`
- **priority** / **Priority** — `HPD:Help Desk`.`Priority`
- **User** — Assignee (e.g. `SUBSTR(${__user.login},0,CHARINDEX('@',...))`)
- **AssignedSupportCompany**, **AssignedSupportOrg** — For SLA views

---

## 3. L1 Engineer Information Needs

L1 engineers need to:

1. **Prioritize work** — Critical/High first, SLA at-risk highlighted
2. **See their queue** — Incidents assigned to me (or my group)
3. **Track SLA** — Ongoing, Close to Target, Already Missed
4. **Manage backlog** — Aging, reassignments, overdue
5. **Understand workload** — Unassigned, Open, Major Incidents
6. **Drill through** — Click into specific incidents
7. **Trend** — Today vs yesterday, this week vs last week

---

## 4. Proposed Dashboard Layout

### Row 1: Hero KPIs (Top of Screen)

| Panel | Type | Metric | Source | Visual Notes |
|-------|------|--------|--------|--------------|
| **All Assigned To Me** | stat | Count (Status < Resolved, Assignee = $User) | Incident Agent Dashboard | Large number, green/red thresholds, link to filtered view |
| **Open Incidents** | stat | Count (Status < Resolved) | Incident Dashboard | |
| **Unassigned** | stat | Count (Assignee IS NULL) | Incident Dashboard | Red if > 0 |
| **Overdue** | stat | Count (SLM Status > Service Target Warning) | Incident Dashboard | Red threshold |
| **SLA At Risk** | stat | Count (Close to Target + Already Missed) | Incident Aged Backlog | Orange/red |
| **Major Incidents (Open)** | stat | Count (Major Incident = Yes, Status < Resolved) | Open Incident Analysis | Red if > 0 |
| **Avg Age (days)** | stat | AVG(DATEDIFF(Submit Date, Today)) | Incident Dashboard | |

### Row 2: My Work & SLA Distribution (Donuts + Cards)

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **My Assigned Incidents per Status** | piechart (donut) | Assigned, In Progress, Pending | Incident Agent Dashboard |
| **Resolution SLA Status** | piechart (donut) | Ongoing, Close to Target, Already Missed, Stopped Clock | Incident Agent Dashboard |
| **My Assigned Incidents Per Priority** | piechart (donut) | Critical, High, Medium, Low | Incident Agent Dashboard |

Each slice links to filtered Incident Details drill-through.

### Row 3: Incident Trend (Time Series)

| Panel | Type | Series | Source |
|-------|------|--------|--------|
| **Incident Trend** | timeseries | Created, Open, Critical, Resolved, Reopened, Closed | Incident Dashboard |

Date on X-axis, counts on Y-axis. Legend: right, calcs: sum.

### Row 4: Workload by Group & Service

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **Incidents by Assigned Group** | bmc-ade-bar | Open vs Resolved by group | Incident Dashboard |
| **Top 10 Support Groups with Most Open Incidents** | bmc-ade-bar | Horizontal bar, LIMIT 10 | Open Incident Analysis |

### Row 5: Priority & Status Cross-Tab + Aging

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **Open Incidents Cross-Tab — Priority × Status** | bmc-ade-cross-tab | Heatmap-style | Incident Dashboard |
| **Open Incident Aging by Priority** | bmc-ade-bar | Stacked bar: 0–5, 6–15, 16–30, 30+ days | Incident Aged Backlog |
| **Count of Open Incidents by Aging and Priority** | bmc-ade-cross-tab | Aging × Priority crosstab | Aging Incident Analysis |

### Row 6: SLA Performance (Response & Resolution)

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **Response SLA Performance by Priority** | bmc-ade-bar | Met vs Missed, stacked | Incident SLA Performance |
| **Resolution SLA Performance by Priority** | bmc-ade-bar | Met vs Missed, stacked | Incident SLA Performance |

### Row 7: Actionable Incident List

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **My Incidents — SLA View** | bmc-record-details | Incident cards (Incident #, Status, Priority, SLA) with links | Incident Agent Dashboard |

Repeat by MySLA variable; each card links to incident in BMC Helix.

### Row 8: Top Services & CIs (Optional — Collapsible)

| Panel | Type | Purpose | Source |
|-------|------|---------|--------|
| **Top 5 Services with Most Open Incidents** | bmc-ade-bar | Horizontal bar | Open Incident Analysis |
| **Top 5 CIs with Most Open Incidents** | bmc-ade-bar | Horizontal bar | Open Incident Analysis |

---

## 5. Variables (Templating)

| Variable | Type | Query / Options | Hide |
|----------|------|-----------------|------|
| **company** | query | `SELECT DISTINCT Company FROM HPD:Help Desk WHERE Status < 'Resolved' LIMIT 1000` | 0 |
| **AssignedGroup** | query | `SELECT Assigned Group FROM HPD:Help Desk WHERE Submit Date in range` | 0 |
| **priority** | query | `SELECT DISTINCT Priority FROM HPD:Help Desk WHERE Status < 'Resolved'` | 0 |
| **User** | query | From `__user.login` (assignee filter) | 2 (when not agent view) |
| **Status** | query | Open statuses | 2 |
| **SLAStatus** | custom | Ongoing, Already Missed, Close to Target, Stopped Clock | 2 |
| **MySLA** | query | Incident numbers for assignee + filters | 2 |

Use cascading: Company → AssignedGroup; optional User for agent view.

---

## 6. Design Enhancements for Demo

### 6.1 Visual Polish

1. **Color Consistency**
   - Critical: `#d4660c` or red
   - High: `#daad39` or orange
   - Medium: `#4fbeaf` or teal
   - Low: `#7b8ec6` or blue
   - SLA Met: `#89c341`
   - SLA Missed: `#f83200`

2. **Stat Panel Thresholds**
   - Unassigned: Red if > 0
   - Overdue: Red if > 0
   - SLA At Risk: Orange 1–5, Red > 5

3. **Row Headers**
   - Use `type: "row"` with clear titles, e.g.:
     - "My Work Overview"
     - "Incident Trend"
     - "Workload by Group"
     - "SLA Performance"

4. **Refresh**
   - `"5m"` or `"1m"` for live demo feel

### 6.2 Drill-Through Links

- Stat panels → Filtered Incident Details dashboard with `var-Status`, `var-Priority`, `var-SLAStatusNumber`
- Donut slices → Same drill-through with slice-specific filters
- Record cards → Direct incident URL:  
  `https://helixone-demo-smartit.onbmc.com/smartit/app/#/incident/${__data.fields.InstanceId}`

### 6.3 Time Range

- Default: `now-30d` to `now`
- Optional quick ranges: Last 7 days, Last 24 hours

---

## 7. Implementation Phases

### Phase 1: Core KPIs + My Work (1–2 days)

- [ ] Create dashboard JSON with Row 1 (Hero KPIs)
- [ ] Add Row 2 (donuts: Status, SLA, Priority)
- [ ] Wire variables: company, AssignedGroup, priority, User
- [ ] Add drill-through URLs

### Phase 2: Trends & Workload (1 day)

- [ ] Add Row 3 (Incident Trend timeseries)
- [ ] Add Row 4 (Incidents by Assigned Group, Top 10 Groups)

### Phase 3: Cross-Tabs & Aging (1 day)

- [ ] Add Row 5 (Priority × Status cross-tab, Aging by Priority, Aging × Priority cross-tab)

### Phase 4: SLA Performance + Record Cards (1 day)

- [ ] Add Row 6 (Response/Resolution SLA bars)
- [ ] Add Row 7 (bmc-record-details with MySLA repeat)
- [ ] Add MySLA variable

### Phase 5: Polish & Demo Prep (0.5 day)

- [ ] Apply color overrides, thresholds
- [ ] Set refresh interval
- [ ] Add row headers / descriptions
- [ ] Test drill-through links
- [ ] Validate with sample data

---

## 8. File Structure

```
petronas-demo-prep/dashboard/
├── sample-itsm-dashboard-jsons/     # Existing samples
├── L1-INCIDENT-MANAGEMENT-DASHBOARD-PLAN.md  # This file
└── L1-Incident-Management-Dashboard.json     # Output JSON (to be created)
```

---

## 9. Sample JSON References for Copy-Paste

When building the JSON, reference these panels from the samples:

| Panel | Reference File |
|-------|----------------|
| All Assigned To Me | Incident Agent Dashboard (panel id 361) |
| My Assigned Incidents per Status | Incident Agent Dashboard (panel id 47) |
| Resolution SLA Status | Incident Agent Dashboard (panel id 39) |
| My Assigned Incidents Per Priority | Incident Agent Dashboard (panel id 605) |
| Incident Trend | Incident Dashboard (panel id 16) |
| Incidents by Assigned Group | Incident Dashboard (panel id 29) |
| Open Incidents Cross-Tab | Incident Dashboard (panel id 28) |
| Response SLA Performance | Incident SLA Performance (panel id 10) |
| Resolution SLA Performance | Incident SLA Performance (panel id 12) |
| Incident Cards | Incident Agent Dashboard (panel id 60, bmc-record-details) |
| Aging by Priority | Incident Aged Backlog (panel id 113) |
| SLA Status (Already Missed, etc.) | Incident Aged Backlog (panels 99, 101, 105, 109) |

---

## 10. Checklist Before Demo

- [ ] All panels use correct datasource (BMC Helix)
- [ ] Variables resolve without errors
- [ ] Drill-through links open correct dashboard/view
- [ ] Incident cards link to actual incident URLs
- [ ] Time range covers demo data
- [ ] Refresh interval suits demo (e.g. 30s–1m)
- [ ] No empty states that look broken (use `noValue` where needed)
- [ ] Row order matches narrative: My Work → Trend → Workload → SLA → Action List

---

*This plan is ready for implementation. The next step is to generate the consolidated `L1-Incident-Management-Dashboard.json` by merging and adapting panels from the referenced sample dashboards.*
