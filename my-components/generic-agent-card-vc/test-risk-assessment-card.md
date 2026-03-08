# Risk Assessment Card — Test Guide

Test data for the **6 new risk analysis section types**: statusBadge, riskMeter, impactMatrix, insightCard, checklist, diffViewer.

Two approaches, two test scenarios each (High Risk + Low Risk).

---

## Approach 1: Quick Test (Direct JSON Content — No Config Record)

Paste a single combined JSON into **Direct JSON Content**. No config record needed.

### View Designer Setup

| Property | Value |
|----------|-------|
| Card Configuration (Record Instance ID) | _(leave empty)_ |
| Direct JSON Content | Paste one of the JSON payloads below |
| Show Header | ON |
| Show Footer | ON |
| Compact Mode | OFF |
| Override Theme | `red` (for high risk) or `green` (for low risk) |

---

### Quick Test — High Risk (score 5/5, all fail)

```json
{
  "_header": {
    "title": "Risk Assessment",
    "subtitle": "CRQ000000021803 — BGP routing change on Pune Internet links",
    "icon": "warning_triangle"
  },
  "_sections": [
    {
      "type": "statusBadge",
      "statusPath": "assessment.status",
      "labelPath": "assessment.recommendation",
      "severityPath": "assessment.severity"
    },
    {
      "type": "riskMeter",
      "title": "Overall Risk Score",
      "scorePath": "overallScore",
      "maxScore": 5,
      "subScores": [
        { "label": "Documentation", "scorePath": "scores.documentation", "rationale": "No relevant implementation plan found; quality score 0.0/5" },
        { "label": "Historical Impact", "scorePath": "scores.historical", "rationale": "Past incidents linked to similar BGP changes; ref CRQ000000021900" },
        { "label": "Service Instability", "scorePath": "scores.serviceInstability", "rationale": "Parent service Apex-Online health at 30 (CRITICAL)" }
      ]
    },
    {
      "type": "impactMatrix",
      "title": "Likelihood vs Impact",
      "likelihoodPath": "matrix.likelihood",
      "impactPath": "matrix.impact",
      "rationale": "matrix.rationale"
    },
    {
      "type": "insightCard",
      "icon": "warning_triangle",
      "titlePath": "insights.0.title",
      "messagePath": "insights.0.message",
      "severity": "critical"
    },
    {
      "type": "insightCard",
      "icon": "heart",
      "titlePath": "insights.1.title",
      "messagePath": "insights.1.message",
      "severity": "high"
    },
    {
      "type": "checklist",
      "title": "Risk Validation Checks",
      "items": [
        { "label": "Documentation Quality", "statePath": "validation.documentation.state", "detailPath": "validation.documentation.detail" },
        { "label": "Historical Impact Review", "statePath": "validation.historical.state", "detailPath": "validation.historical.detail" },
        { "label": "Service Stability Check", "statePath": "validation.service.state", "detailPath": "validation.service.detail" }
      ]
    },
    {
      "type": "diffViewer",
      "title": "Documentation Mismatch",
      "leftLabel": "Expected",
      "leftPath": "docMismatch.expected",
      "rightLabel": "Found",
      "rightPath": "docMismatch.found"
    }
  ],

  "assessment": {
    "status": "High Risk",
    "recommendation": "Proceeding with this change is not recommended",
    "severity": "danger"
  },
  "overallScore": 5.0,
  "scores": {
    "documentation": 5.0,
    "historical": 5.0,
    "serviceInstability": 5.0
  },
  "matrix": {
    "likelihood": "high",
    "impact": "high",
    "rationale": "Service is currently unstable; past BGP routing changes have been linked to major incidents"
  },
  "insights": [
    {
      "title": "Proceeding Not Recommended",
      "message": "All three assessed risk dimensions scored at maximum (5/5). Substantial mitigation is required before this change should proceed."
    },
    {
      "title": "Parent Service Critical",
      "message": "Apex-Online has actualHealth: 30 (CRITICAL) with 2 active incidents (INC000000024603, INC000000024623). Any disruption will compound existing outages."
    }
  ],
  "validation": {
    "documentation": {
      "state": "fail",
      "detail": "Only impl plan.txt found — describes a firewall port change in non-prod (unrelated to BGP routing)."
    },
    "historical": {
      "state": "fail",
      "detail": "Past incidents INC000000024603 and INC000000024623 linked to similar BGP changes on Pune links."
    },
    "service": {
      "state": "fail",
      "detail": "Parent service Apex-Online: actualHealth 30 (CRITICAL), 2 active incidents, CI dependency on affected infrastructure."
    }
  },
  "docMismatch": {
    "expected": "BGP implementation plan for Pune Internet links with rollback procedures",
    "found": "impl plan.txt — Firewall port change in non-prod environment (completely unrelated to this change)"
  }
}
```

**Expected result:**

| Section | What you should see |
|---------|---------------------|
| Status Badge | Red danger pill: "High Risk" with label "Proceeding with this change is not recommended" |
| Risk Meter | Gauge ring at 100% (5.0/5, red); 3 sub-score bars all maxed red |
| Impact Matrix | 2x2 grid — "High / High" cell highlighted red with warning icon |
| Insight Card 1 | Critical (red border): "Proceeding Not Recommended" |
| Insight Card 2 | High (orange border): "Parent Service Critical" |
| Checklist | 3 items, all red fail circles (✗) with detail text |
| Diff Viewer | Left (green): expected BGP plan — Right (red): unrelated firewall doc |

---

### Quick Test — Low Risk (score 1.2/5, mostly pass)

```json
{
  "_header": {
    "title": "Change Readiness",
    "subtitle": "CRQ000000022100 — Scheduled DB patching on prod-mysql-03",
    "icon": "check-circle"
  },
  "_sections": [
    {
      "type": "statusBadge",
      "statusPath": "assessment.status",
      "labelPath": "assessment.recommendation",
      "severityPath": "assessment.severity"
    },
    {
      "type": "riskMeter",
      "title": "Overall Risk Score",
      "scorePath": "overallScore",
      "maxScore": 5,
      "subScores": [
        { "label": "Documentation", "scorePath": "scores.documentation", "rationale": "Detailed runbook attached with rollback steps and pre-checks" },
        { "label": "Historical Impact", "scorePath": "scores.historical", "rationale": "No incidents from last 4 similar patches" },
        { "label": "Service Instability", "scorePath": "scores.serviceInstability", "rationale": "prod-mysql-03 health is 95 (HEALTHY)" }
      ]
    },
    {
      "type": "impactMatrix",
      "title": "Likelihood vs Impact",
      "likelihoodPath": "matrix.likelihood",
      "impactPath": "matrix.impact",
      "rationale": "matrix.rationale"
    },
    {
      "type": "insightCard",
      "icon": "check-circle",
      "titlePath": "insights.0.title",
      "messagePath": "insights.0.message",
      "severity": "success"
    },
    {
      "type": "insightCard",
      "icon": "information-circle",
      "titlePath": "insights.1.title",
      "messagePath": "insights.1.message",
      "severity": "warning"
    },
    {
      "type": "checklist",
      "title": "Readiness Validation",
      "items": [
        { "label": "Documentation Quality", "statePath": "validation.documentation.state", "detailPath": "validation.documentation.detail" },
        { "label": "Historical Impact Review", "statePath": "validation.historical.state", "detailPath": "validation.historical.detail" },
        { "label": "Service Stability Check", "statePath": "validation.service.state", "detailPath": "validation.service.detail" },
        { "label": "Maintenance Window", "statePath": "validation.window.state", "detailPath": "validation.window.detail" }
      ]
    },
    {
      "type": "diffViewer",
      "title": "Patch Version Comparison",
      "leftLabel": "Current",
      "leftPath": "versions.current",
      "rightLabel": "Target",
      "rightPath": "versions.target"
    }
  ],

  "assessment": {
    "status": "Low Risk",
    "recommendation": "Change is ready to proceed within the scheduled window",
    "severity": "success"
  },
  "overallScore": 1.2,
  "scores": {
    "documentation": 0.8,
    "historical": 0.5,
    "serviceInstability": 1.0
  },
  "matrix": {
    "likelihood": "low",
    "impact": "low",
    "rationale": "Well-documented routine patch; service is healthy with no active incidents"
  },
  "insights": [
    {
      "title": "Change Approved for Execution",
      "message": "All risk dimensions are within acceptable thresholds. Runbook quality is high and rollback procedures are documented."
    },
    {
      "title": "Note: Brief Downtime Expected",
      "message": "MySQL restart required during patch. Expected 2-3 minute downtime. Failover to prod-mysql-04 is configured."
    }
  ],
  "validation": {
    "documentation": {
      "state": "pass",
      "detail": "Comprehensive runbook with pre-checks, execution steps, rollback, and post-validation."
    },
    "historical": {
      "state": "pass",
      "detail": "Last 4 identical patches completed without incident (CRQ000000021800, 21850, 21900, 21950)."
    },
    "service": {
      "state": "pass",
      "detail": "prod-mysql-03 health: 95 (HEALTHY), 0 active incidents, replication lag < 50ms."
    },
    "window": {
      "state": "warning",
      "detail": "Scheduled for Sunday 02:00 UTC — within approved window but overlaps with batch job at 02:15."
    }
  },
  "versions": {
    "current": "MySQL 8.0.36 — Community Edition (patched 2025-12-01)",
    "target": "MySQL 8.0.40 — Community Edition (security patch CVE-2026-1234)"
  }
}
```

**Expected result:**

| Section | What you should see |
|---------|---------------------|
| Status Badge | Green success pill: "Low Risk" with label "Change is ready to proceed within the scheduled window" |
| Risk Meter | Gauge ring at ~24% (1.2/5, green); 3 sub-score bars low and green |
| Impact Matrix | 2x2 grid — "Low / Low" cell highlighted green with check icon |
| Insight Card 1 | Success (green border): "Change Approved for Execution" |
| Insight Card 2 | Warning (yellow border): "Note: Brief Downtime Expected" |
| Checklist | 3 green pass (✓) + 1 yellow warning (!) |
| Diff Viewer | Left: current MySQL 8.0.36 — Right: target MySQL 8.0.40 |

---

## Approach 2: Config Record + Data JSON (Production Pattern)

Layout is stored in **AI Agent Card Configuration** record. Data comes separately.

### Step 1: Create Config Record

Create one record instance in `com.amar.helix-vibe-studio:AI Agent Card Configuration` with these values:

| Field Name | Value |
|------------|-------|
| configName | `Risk Assessment Card` |
| themeColor | `red` |
| headerConfig | `{"title":"Risk Assessment","icon":"warning_triangle"}` |
| sectionsConfig | _(see below)_ |
| isActive | `true` |

**sectionsConfig** value (paste as a single line into the field):

```
[{"type":"statusBadge","statusPath":"assessment.status","labelPath":"assessment.recommendation","severityPath":"assessment.severity"},{"type":"riskMeter","title":"Overall Risk Score","scorePath":"overallScore","maxScore":5,"subScores":[{"label":"Documentation","scorePath":"scores.documentation","rationale":"scores.documentationRationale"},{"label":"Historical Impact","scorePath":"scores.historical","rationale":"scores.historicalRationale"},{"label":"Service Instability","scorePath":"scores.serviceInstability","rationale":"scores.serviceRationale"}]},{"type":"impactMatrix","title":"Likelihood vs Impact","likelihoodPath":"matrix.likelihood","impactPath":"matrix.impact","rationale":"matrix.rationale"},{"type":"insightCard","icon":"warning_triangle","titlePath":"insights.0.title","messagePath":"insights.0.message","severity":"critical"},{"type":"insightCard","icon":"heart","titlePath":"insights.1.title","messagePath":"insights.1.message","severity":"high"},{"type":"checklist","title":"Risk Validation Checks","items":[{"label":"Documentation Quality","statePath":"validation.documentation.state","detailPath":"validation.documentation.detail"},{"label":"Historical Impact Review","statePath":"validation.historical.state","detailPath":"validation.historical.detail"},{"label":"Service Stability Check","statePath":"validation.service.state","detailPath":"validation.service.detail"}]},{"type":"diffViewer","title":"Documentation Mismatch","leftLabel":"Expected","leftPath":"docMismatch.expected","rightLabel":"Found","rightPath":"docMismatch.found"}]
```

Save the record and **copy its Instance ID** (GUID).

### Step 2: View Designer Setup

| Property | Value |
|----------|-------|
| Card Configuration (Record Instance ID) | Paste the config record GUID from Step 1 |
| Direct JSON Content | Paste one of the data-only JSON payloads below |
| Show Header | ON |
| Show Footer | ON |
| Compact Mode | OFF |
| Override Theme | _(leave empty — red comes from config record)_ |

### Step 3: Paste Data JSON

The data JSON contains **only data** — no `_header`, no `_sections`. Layout comes from the config record.

> **Note:** The `sectionsConfig` above uses `scores.documentationRationale`, `scores.historicalRationale`, and `scores.serviceRationale` as dynamic rationale paths (resolved from data at runtime). This is different from Approach 1 where rationale was a static string in `_sections`. Both patterns work — static string is used as-is; a dot-path string is resolved from data first and falls back to the literal string if the path doesn't exist.

---

### Data JSON — High Risk

```json
{
  "assessment": {
    "status": "High Risk",
    "recommendation": "Proceeding with this change is not recommended",
    "severity": "danger"
  },
  "overallScore": 5.0,
  "scores": {
    "documentation": 5.0,
    "documentationRationale": "No relevant implementation plan found; quality score 0.0/5",
    "historical": 5.0,
    "historicalRationale": "Past incidents linked to similar BGP changes; ref CRQ000000021900",
    "serviceInstability": 5.0,
    "serviceRationale": "Parent service Apex-Online health at 30 (CRITICAL)"
  },
  "matrix": {
    "likelihood": "high",
    "impact": "high",
    "rationale": "Service is currently unstable; past BGP routing changes have been linked to major incidents"
  },
  "insights": [
    {
      "title": "Proceeding Not Recommended",
      "message": "All three assessed risk dimensions scored at maximum (5/5). Substantial mitigation is required before this change should proceed."
    },
    {
      "title": "Parent Service Critical",
      "message": "Apex-Online has actualHealth: 30 (CRITICAL) with 2 active incidents (INC000000024603, INC000000024623). Any disruption will compound existing outages."
    }
  ],
  "validation": {
    "documentation": {
      "state": "fail",
      "detail": "Only impl plan.txt found — describes a firewall port change in non-prod (unrelated to BGP routing)."
    },
    "historical": {
      "state": "fail",
      "detail": "Past incidents INC000000024603 and INC000000024623 linked to similar BGP changes on Pune links."
    },
    "service": {
      "state": "fail",
      "detail": "Parent service Apex-Online: actualHealth 30 (CRITICAL), 2 active incidents, CI dependency on affected infrastructure."
    }
  },
  "docMismatch": {
    "expected": "BGP implementation plan for Pune Internet links with rollback procedures",
    "found": "impl plan.txt — Firewall port change in non-prod environment (completely unrelated to this change)"
  }
}
```

**Expected:** Same as Approach 1 High Risk — red badge, maxed gauge, red matrix cell, red/orange insight cards, all-fail checklist, diff viewer.

---

### Data JSON — Low Risk

```json
{
  "assessment": {
    "status": "Low Risk",
    "recommendation": "Change is ready to proceed within the scheduled window",
    "severity": "success"
  },
  "overallScore": 1.2,
  "scores": {
    "documentation": 0.8,
    "documentationRationale": "Detailed runbook attached with rollback steps and pre-checks",
    "historical": 0.5,
    "historicalRationale": "No incidents from last 4 similar patches",
    "serviceInstability": 1.0,
    "serviceRationale": "prod-mysql-03 health is 95 (HEALTHY), 0 active incidents"
  },
  "matrix": {
    "likelihood": "low",
    "impact": "low",
    "rationale": "Well-documented routine patch; service is healthy with no active incidents"
  },
  "insights": [
    {
      "title": "Change Approved for Execution",
      "message": "All risk dimensions are within acceptable thresholds. Runbook quality is high and rollback procedures are documented."
    },
    {
      "title": "Note: Brief Downtime Expected",
      "message": "MySQL restart required during patch. Expected 2-3 minute downtime. Failover to prod-mysql-04 is configured."
    }
  ],
  "validation": {
    "documentation": {
      "state": "pass",
      "detail": "Comprehensive runbook with pre-checks, execution steps, rollback, and post-validation."
    },
    "historical": {
      "state": "pass",
      "detail": "Last 4 identical patches completed without incident (CRQ000000021800, 21850, 21900, 21950)."
    },
    "service": {
      "state": "pass",
      "detail": "prod-mysql-03 health: 95 (HEALTHY), 0 active incidents, replication lag < 50ms."
    }
  },
  "docMismatch": {
    "expected": "MySQL 8.0.40 patch runbook for prod-mysql-03",
    "found": "mysql-patch-runbook-v3.pdf — Matches expected scope and includes rollback procedures"
  }
}
```

**Expected:** Green badge, low gauge (~24%), green "Low/Low" matrix cell, green + yellow insight cards, 3 pass + 0 fail checklist, clean diff viewer.

> **Tip:** To quickly switch between High and Low risk tests, just swap the Direct JSON Content value. The same config record works for both — only the data changes.

---

## Section Types Reference

All 6 new section types used by the Risk Assessment Card:

| Type | Purpose | Key config paths |
|------|---------|------------------|
| `statusBadge` | Colored pill with status text | `statusPath`, `labelPath`, `severityPath` |
| `riskMeter` | Gauge ring + sub-score bars | `scorePath`, `maxScore`, `subScores[].scorePath` |
| `impactMatrix` | 2x2 likelihood-vs-impact grid | `likelihoodPath`, `impactPath`, `rationale` |
| `insightCard` | Icon + title + message card | `titlePath`, `messagePath`, `severity`, `icon` |
| `checklist` | Pass/fail validation items | `items[].statePath`, `items[].detailPath` |
| `diffViewer` | Side-by-side comparison | `leftPath`, `rightPath`, `leftLabel`, `rightLabel` |

### Severity values

| Value | Color | Use for |
|-------|-------|---------|
| `danger` | Red | High risk, failures |
| `critical` | Deep red | Critical alerts |
| `high` | Orange | High severity warnings |
| `warning` | Yellow | Caution items |
| `success` | Green | Pass, low risk, approved |
| `info` | Blue | Informational |

### Checklist state values

| Value (+ aliases) | Icon | Color |
|--------------------|------|-------|
| `pass`, `true`, `passed` | ✓ | Green |
| `fail`, `false`, `failed` | ✗ | Red |
| `warning`, `warn` | ! | Yellow |
| `pending`, _(anything else)_ | • | Gray |
