# IT Service Desk Manager Dashboard — Build Plan

**Purpose:** Demo-ready Grafana dashboard for IT Service Desk Managers  
**Target:** Petronas demo / BMC Helix ITSM  
**Data Source:** BMC Helix (HPD:Help Desk, SLM:Measurement)  
**Last Updated:** 2025-03-21

---

## 1. Executive Summary

This plan consolidates panels from sample ITSM dashboards into a single **IT Service Desk Manager Dashboard**. The dashboard answers: *"What does a manager need to see about team workload, SLA, MTTR, agent performance, and backlog?"*

---

## 2. User-Requested KPIs

| KPI | Description | Source Dashboard |
|-----|-------------|------------------|
| **Team workload** | Open per group, assignments, queue depth | Incident Dashboard, Aging Incident Analysis |
| **SLA compliance %** | % Met vs Missed (Response + Resolution) | Incident SLA Performance, Closed Incidents Metrics |
| **MTTR trends** | Mean Time To Resolve over time | Closed Incidents Metrics, Major Incident Analysis |
| **Agent performance** | Incidents closed per agent, MTTR per agent | Custom (HPD:Help Desk by Assignee) |
| **Backlog aging** | Aging buckets (0–5, 6–15, 16–30, 30+ days) | Incident Aged Backlog, Aging Incident Analysis |

---

## 3. Additional KPIs Proposed

| KPI | Rationale |
|-----|-----------|
| **Unassigned / Overdue** | Operational health; immediate action items |
| **SLA at risk** | Already Missed + Close to Target counts |
| **Incident trend** | Created, Open, Closed over time |
| **Reopened incidents %** | Quality indicator (Closed Incidents Metrics) |
| **Response SLA vs Resolution SLA** | Separate bars by priority |
| **Incidents by assigned group** | Workload distribution |
| **Open incident aging by priority** | Critical backlog visibility |
| **MTTR by support group** | Which groups resolve fastest |

---

## 4. Dashboard Layout

### Row 1: Hero KPIs
| Panel | Type | Metric |
|-------|------|--------|
| Open Incidents | stat | Count (Status < Resolved) |
| Unassigned | stat | Assignee IS NULL |
| Overdue | stat | SLM Status > Service Target Warning |
| SLA Compliance % | stat | % Within Service Target |
| Avg Backlog Age (days) | stat | AVG(DATEDIFF(Submit, Today)) |
| Reopened % | stat | % with Re-Opened Date |

### Row 2: SLA at Risk
| Panel | Type | Metric |
|-------|------|--------|
| Already Missed | stat | MeasurementStatus IN (5,7) |
| Close to Target | stat | MeasurementStatus = 9 |
| Ongoing | stat | Not Missed/Close/Stopped |
| Stopped Clock | stat | MeasurementStatus = 2 |

### Row 3: SLA Performance
| Panel | Type | Source |
|-------|------|--------|
| Response SLA by Priority | bmc-ade-bar | Met vs Missed (Incident SLA Performance) |
| Resolution SLA by Priority | bmc-ade-bar | Met vs Missed (Incident SLA Performance) |

### Row 4: MTTR
| Panel | Type | Source |
|-------|------|--------|
| MTTR (days) | stat | Closed Incidents Metrics |
| MTTR Trend | timeseries | Closed Incidents Metrics |
| MTTR by Support Group | bmc-ade-bar | Closed Incidents Metrics |

### Row 5: Team Workload
| Panel | Type | Source |
|-------|------|--------|
| Incidents by Assigned Group | bmc-ade-bar | Open vs Resolved (Incident Dashboard) |
| Incident Trend | timeseries | Created, Open, Resolved, Closed, Critical |
| Top 10 Groups (Open) | bmc-ade-bar | Aging Incident Analysis |

### Row 6: Agent Performance
| Panel | Type | Metric |
|-------|------|--------|
| Incidents Closed per Agent | bmc-ade-bar | COUNT closed, GROUP BY Assignee |
| MTTR by Agent | bmc-ade-bar | AVG(MTTR) per Assignee |
| Open per Agent | bmc-ade-bar | COUNT open per Assignee |

### Row 7: Backlog Aging
| Panel | Type | Source |
|-------|------|--------|
| Aging buckets (0–5, 6–15, 16–30, 30+) | stat × 4 | Incident Aged Backlog |
| Open incident aging by Priority | bmc-ade-bar | Incident Aged Backlog |
| Aging × Priority Cross-Tab | bmc-ade-cross-tab | Aging Incident Analysis |

---

## 5. Variables (Templating)

| Variable | Type | Query |
|----------|------|-------|
| company | query | SELECT DISTINCT Company FROM HPD:Help Desk |
| AssignedGroup | query | SELECT Assigned Group FROM HPD:Help Desk |
| priority | query | SELECT DISTINCT Priority FROM HPD:Help Desk |
| AssignedSupportCompany | query | For SLA views |
| AssignedSupportOrg | query | Cascading from Company |

---

## 6. Sample References

| Panel | Reference File |
|-------|----------------|
| Open, Unassigned, Overdue, Avg age | Incident Dashboard |
| Incident trend | Incident Dashboard (id 16) |
| Incidents by Assigned Group | Incident Dashboard (id 29) |
| Response / Resolution SLA bars | Incident SLA Performance (id 10, 12) |
| MTTR stat, MTTR trend | Closed Incidents Metrics (id 2, 10) |
| MTTR by support group | Closed Incidents Metrics (id 11) |
| Aging buckets, SLA at risk | Incident Aged Backlog Analysis |
| Open incident aging by Priority | Incident Aged Backlog (id 113) |
| Aging × Priority cross-tab | Aging Incident Analysis (id 10) |
| Reopened % | Closed Incidents Metrics (id 8) |

---

## 7. File Structure

```
petronas-demo-prep/dashboard/
├── IT-SERVICE-DESK-MANAGER-DASHBOARD-PLAN.md  # This file
├── IT-Service-Desk-Manager-Dashboard.json     # Output JSON
└── build-manager-dashboard.js                 # Merge script (optional)
```
