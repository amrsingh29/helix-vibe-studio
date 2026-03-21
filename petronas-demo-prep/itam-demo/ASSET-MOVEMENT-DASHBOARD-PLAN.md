# Asset Movement Dashboard — Build Plan

**Purpose:** Demo-ready dashboard for Management & Stakeholders — real-time asset movement visibility  
**Target:** Petronas ITAM demo / BMC Helix ITSM, ITAM  
**Data Source:** BMC Helix (Asset Management, CMDB, transfer/movement records)  
**Last Updated:** 2025-03-21

---

## 1. Executive Summary

This plan defines the **Asset Movement Dashboard** for the Petronas ITAM demo. The dashboard answers: *"What does management need to see about stock-in, stock-out, transfers, and current asset location?"*

---

## 2. User-Requested KPIs (from demo plan)

| KPI | Description | Demo intent |
|-----|-------------|-------------|
| **Stock-in** | Count of assets added (e.g. new registration, received) | Show intake volume |
| **Stock-out** | Count of assets removed (e.g. retirement, disposal) | Show outflow volume |
| **Transfers** | Transfer events over time | Timeline of movements |
| **Current location** | Where assets are now (by site, department, user) | Location visibility |

---

## 3. Additional KPIs Proposed

| KPI | Rationale |
|-----|-----------|
| **Transfer by type** | User-to-user, dept-to-dept, location-to-location | Granular movement view |
| **Assets by location** | Count per site/OPU | Heat map or table |
| **Assets by department** | Count per department | Workload / cost attribution |
| **Movement trend** | Stock-in, stock-out, transfers over time | Trend visibility |
| **Pending transfers** | Transfers awaiting approval | Operational health |
| **Recently moved** | Last N movements (e.g. last 7 days) | Recency view |

---

## 4. Dashboard Layout

### Row 1: Hero KPIs

| Panel | Type | Metric |
|-------|------|--------|
| Stock-In (MTD) | stat | Count of assets created/received in period |
| Stock-Out (MTD) | stat | Count of assets retired/disposed in period |
| Transfers (MTD) | stat | Count of completed transfers in period |
| Pending Transfers | stat | Count of transfers awaiting approval |
| Total Assets | stat | Current asset count (active) |
| Assets Unassigned | stat | Assets with no Assigned User |

### Row 2: Transfer Timeline

| Panel | Type | Metric |
|-------|------|--------|
| Transfer Timeline | timeseries | Transfers by day/week over selected period |
| Transfers by Type | bmc-ade-bar | User-to-user, Dept-to-Dept, Location-to-Location |

### Row 3: Location View

| Panel | Type | Metric |
|-------|------|--------|
| Assets by Location | bmc-ade-bar | Count per Location (site) |
| Assets by Department | bmc-ade-bar | Count per Department |
| Assets by OPU | bmc-ade-bar | Count per OPU (if applicable) |

### Row 4: Movement Detail

| Panel | Type | Metric |
|-------|------|--------|
| Recent Movements | table | Last N movements: Asset, From, To, Date, Type |
| Movement by Asset Type | bmc-ade-bar | Laptop, Printer, etc. |

### Row 5: Optional — Heat Map (if supported)

| Panel | Type | Metric |
|-------|------|--------|
| Asset concentration by Location | heatmap or map | Geographic or logical concentration |

---

## 5. Variables (Templating)

| Variable | Type | Query / Source |
|----------|------|------------------|
| dateRange | built-in | Time range picker |
| location | query | SELECT DISTINCT Location FROM Asset |
| department | query | SELECT DISTINCT Department FROM Asset |
| assetType | query | SELECT DISTINCT Asset Type FROM Asset |
| company | query | SELECT DISTINCT Company FROM Asset |

---

## 6. Data Source Notes

| Panel | Typical BMC Helix source | Notes |
|-------|--------------------------|-------|
| Stock-In | Asset creation date; status change to "In Use" | May require custom reporting if not exposed |
| Stock-Out | Asset retirement; status change | |
| Transfers | Transfer/Movement record table | Asset Management movement history |
| Location/Dept | Asset CI attributes | CMDB or Asset record |
| Pending | Transfer request status | Approval workflow |

---

## 7. File Structure

```
petronas-demo-prep/dashboard/
├── ASSET-MOVEMENT-DASHBOARD-PLAN.md   # This file
└── Asset-Movement-Dashboard.json      # Output JSON (optional, if building Grafana/BMC ADE)
```

---

## 8. Alignment with Demo

| Demo Act | Dashboard panels to show |
|----------|---------------------------|
| Act 4: Management — movement dashboard | Row 1 (Hero), Row 2 (Timeline), Row 3 (Location) |
| Act 9: Wrap — Asset Management dashboard | Summary or same panels |

---

*See also: `petronas-itam-demo-blueprint.md`, `petronas-itam-demo-speaker-notes.md` Act 4 and Act 9.*
