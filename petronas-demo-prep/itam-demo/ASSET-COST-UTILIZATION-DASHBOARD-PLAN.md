# Asset Cost & Utilization Dashboard — Build Plan

**Purpose:** Demo-ready dashboard for Management & Asset Admin — cost spend, utilization, optimization  
**Target:** Petronas ITAM demo / BMC Helix ITSM, ITAM, SAM  
**Data Source:** BMC Helix (Asset cost, license utilization, SAM metrics)  
**Last Updated:** 2025-03-21

---

## 1. Executive Summary

This plan defines the **Asset Cost & Utilization Dashboard** for the Petronas ITAM demo. The dashboard answers: *"What does management need to see about hardware and software cost spend, utilization, and optimization planning?"*

---

## 2. User-Requested KPIs (from demo plan)

| KPI | Description | Demo intent |
|-----|-------------|-------------|
| **Hardware cost spend** | Total or breakdown of hardware asset cost | Cost visibility |
| **Software cost spend** | Total or breakdown of software/license cost | Cost visibility |
| **Utilization** | % of assets/licenses in use vs. total | Efficiency view |
| **Optimization** | Underused vs overused; reharvest candidates | Planning for cost saving |

---

## 3. Additional KPIs Proposed

| KPI | Rationale |
|-----|-----------|
| **Cost by Cost Centre** | Spend attribution | Budget and chargeback |
| **Cost by Department** | Department-level view | Same |
| **Cost by Asset Type** | Laptop, printer, server, etc. | Category breakdown |
| **License utilization %** | Installed vs. entitled vs. used | SAM metric |
| **Reharvest candidates** | Unused licenses that can be reclaimed | Optimization |
| **Over-licensed** | More licenses than needed | Optimization |
| **Cost trend** | Spend over time | Trend visibility |
| **Utilization by product** | Per-software utilization | Granular SAM view |

---

## 4. Dashboard Layout

### Row 1: Hero KPIs

| Panel | Type | Metric |
|-------|------|--------|
| Total Hardware Spend | stat | Sum of hardware asset cost |
| Total Software Spend | stat | Sum of software/license cost |
| Overall Utilization % | stat | (In Use / Total) × 100 |
| Reharvest Candidates | stat | Count of unused licenses (reharvestable) |
| Over-Licensed Products | stat | Products with surplus licenses |
| Cost (MTD / YTD) | stat | Period spend |

### Row 2: Cost Breakdown

| Panel | Type | Metric |
|-------|------|--------|
| Cost by Cost Centre | bmc-ade-bar | Hardware + Software spend per Cost Centre |
| Cost by Department | bmc-ade-bar | Spend per Department |
| Cost by Asset Type | bmc-ade-bar | Laptop, Printer, Server, etc. |

### Row 3: Utilization

| Panel | Type | Metric |
|-------|------|--------|
| License Utilization by Product | bmc-ade-bar | % utilized per software product |
| Utilization Trend | timeseries | Utilization % over time |
| Hardware Utilization | bmc-ade-bar | In Use vs. In Stock vs. Retired |

### Row 4: Optimization

| Panel | Type | Metric |
|-------|------|--------|
| Reharvest Candidates (table) | table | Product, Installed, Used, Surplus, Potential savings |
| Over-Licensed (table) | table | Product, Licensed, Used, Excess |
| Cost Trend | timeseries | HW + SW spend over time |

### Row 5: Optional — Compliance / Planning

| Panel | Type | Metric |
|-------|------|--------|
| Software by Classification | bmc-ade-bar | Licensed, Freeware, SaaS, etc. |
| Expiring Licenses | table | Licenses expiring in next N months |

---

## 5. Variables (Templating)

| Variable | Type | Query / Source |
|----------|------|------------------|
| dateRange | built-in | Time range picker |
| costCentre | query | SELECT DISTINCT Cost Centre FROM Asset / License |
| department | query | SELECT DISTINCT Department FROM Asset |
| company | query | SELECT DISTINCT Company |
| assetType | query | SELECT DISTINCT Asset Type |

---

## 6. Data Source Notes

| Panel | Typical BMC Helix source | Notes |
|-------|--------------------------|-------|
| Hardware cost | Asset record cost/purchase price | CMDB or Asset Management |
| Software cost | License/entitlement cost | SAM / License records |
| Utilization | SAM metering; installed vs. used | SAM module |
| Reharvest | Unused licenses; reharvest report | SAM license optimization |
| Cost by Cost Centre | Asset/License linked to Cost Centre | CMDB relationship |

---

## 7. File Structure

```
petronas-demo-prep/dashboard/
├── ASSET-COST-UTILIZATION-DASHBOARD-PLAN.md   # This file
└── Asset-Cost-Utilization-Dashboard.json      # Output JSON (optional)
```

---

## 8. Alignment with Demo

| Demo Act | Dashboard panels to show |
|----------|---------------------------|
| Act 5: Management — cost/utilization | Row 1 (Hero), Row 2 (Cost breakdown), Row 4 (Optimization) |
| Act 8: SAM Admin — metering + reharvest | Reharvest table; utilization by product |
| Act 9: Wrap — Asset Management dashboard | Summary or cost/utilization panels |

---

## 9. Software Classification Reference (from demo plan)

For **Software by Classification** panel, align to these categories:

| Classification | Description |
|----------------|-------------|
| Licensed Product | Commercial software requiring valid license |
| Freeware | Free-to-use software |
| Shareware / Trialware | Time-limited or feature-limited |
| Open Source | Open-source licensing models |
| SaaS / Subscription | Subscription-based applications |
| Unauthorized Prohibited | Prohibited software |

**License types** (for inventory/detail): Per user, Per device, Per subscription, Enterprise agreement.

---

*See also: `petronas-itam-demo-blueprint.md`, `petronas-itam-demo-speaker-notes.md` Act 5, Act 8, and Act 9.*
