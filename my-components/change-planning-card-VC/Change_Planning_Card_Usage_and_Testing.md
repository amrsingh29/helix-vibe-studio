# Change Planning Card — Usage & Testing Guide

## Overview

The **Change Planning Card** is a BMC Helix Innovation Studio view component that visualizes AI-generated change planning analysis. It displays:

- **Risk** — A numeric severity badge (1–5) with color coding
- **Collisions** — Conflicting or overlapping changes with clickable details
- **Historical** — Success rate, similar changes count, and average duration
- **MOP Status** — Method of Procedure readiness (Pre, Steps, Rollback, Monitoring) and identified gaps

The component uses a dark-themed card layout with orange accents, designed for embedding in views or record forms.

---

## Data Sources

The component can receive planning analysis data in two ways:

| Source | When Used | Configuration |
|--------|-----------|----------------|
| **JSON Content (Direct)** | When `jsonContent` is provided and non-empty | Expression binding (e.g., `${view.params.jsonContent}`) |
| **Record Field** | When no `jsonContent` or when empty | Record Definition + JSON Field + Record Instance ID |

**Priority:** `jsonContent` takes precedence. When set, the record fetch is skipped.

---

## Properties

### Data Source

| Property | Type | Description |
|----------|------|-------------|
| `recordDefinitionName` | string | Record definition containing the JSON field |
| `jsonFieldId` | number | Field ID of the text/character field storing JSON |
| `recordInstanceId` | expression | Record instance ID (e.g., `${view.params.recordInstanceId}`) |
| `jsonContent` | expression | Direct JSON string; skips record fetch when provided |

### Display Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showRisk` | boolean | `true` | Show risk section with numeric badge |
| `showCollisions` | boolean | `true` | Show collision analysis section |
| `showHistorical` | boolean | `true` | Show historical stats section |
| `showMopStatus` | boolean | `true` | Show MOP status badges and gaps |
| `compactMode` | boolean | `false` | Condensed layout; hides footer |
| `cardTitle` | string | `"Change Planning"` | Card title text |

---

## Output Events

| Event | Payload | When |
|-------|---------|------|
| `collisionClicked` | `{ changeId, overlapType }` | User clicks a collision item |
| `viewFullAnalysis` | `{ recordInstanceId }` | User clicks "View Full Analysis" |
| `refresh` | — | User clicks refresh button |
| `dataLoaded` | `{ success, data?, error? }` | After data fetch/parse completes |

---

## JSON Structure

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `changeId` | string | no | Change request ID |
| `analysisTimestamp` | string | no | When analysis was run |
| `risk` | number | no | Risk level 1–5 (see below) |
| `collisions` | object | no | Collision analysis |
| `historical` | object | no | Historical statistics |
| `mopStatus` | object | no | MOP readiness status |

### Risk (`risk`)

- **Type:** number 1–5 (string values like `"3"` are parsed)
- **Mapping:**

| Value | Severity | Badge Color |
|-------|----------|-------------|
| 1 | Very Low | Green (#2ECC71) |
| 2 | Low | Darker green (#27AE60) |
| 3 | Medium | Yellow (#F1C40F) |
| 4 | High | Orange (#E67E22) |
| 5 | Critical | Red (#E74C3C) |
| missing/invalid | Unknown | Gray (#7f8c8d), shows "—" |

### Collisions (`collisions`)

```json
{
  "detected": true,
  "count": 2,
  "details": [
    {
      "changeId": "CRQ-56801",
      "overlapType": "CI-level",
      "affectedCi": "APP-WEB-CLUSTER",
      "window": "01:30-02:30 SGT",
      "recommendation": "Sequence database patch before JVM tuning"
    }
  ]
}
```

**Overlap types** that get styled badges: `CI-level`, `Service-level`, `Time-window`, `Dependency`. Others use a generic style.

### Historical (`historical`)

```json
{
  "successRate": 85,
  "similarChanges": 12,
  "avgDuration": "17.75 min",
  "failureHistory": "None",
  "referencedChangeIds": ["CRQ-54201", "CRQ-52456"]
}
```

**Success rate** color mapping: ≥90% green, ≥70% orange, &lt;70% red.

### MOP Status (`mopStatus`)

```json
{
  "present": true,
  "quality": "Good",
  "preChecks": true,
  "steps": true,
  "rollback": true,
  "monitoring": false,
  "gaps": ["Monitoring duration unspecified", "Escalation contact outdated"]
}
```

Badges shown: Pre (preChecks), Stps (steps), Roll (rollback), Moni (monitoring).

---

## Test JSON Scenarios

Use these samples in the View Designer’s **JSON Content** expression for quick testing.

### Scenario 1: Full Analysis — Medium Risk, Collisions, Gaps

```json
{
  "changeId": "CRQ-56789",
  "analysisTimestamp": "2025-03-05T14:30:00Z",
  "risk": 3,
  "collisions": {
    "detected": true,
    "count": 2,
    "details": [
      {
        "changeId": "CRQ-56801",
        "overlapType": "CI-level",
        "affectedCi": "APP-WEB-CLUSTER",
        "window": "01:30-02:30 SGT",
        "recommendation": "Sequence database patch before JVM tuning"
      },
      {
        "changeId": "CRQ-56823",
        "overlapType": "Time-window",
        "affectedCi": "LB-PROD-01",
        "window": "00:00-01:00 SGT",
        "recommendation": "Confirm completion before proceeding"
      }
    ]
  },
  "historical": {
    "successRate": 85,
    "similarChanges": 4,
    "avgDuration": "17.75 min",
    "failureHistory": "None",
    "referencedChangeIds": ["CRQ-54201", "CRQ-52456", "CRQ-50789"]
  },
  "mopStatus": {
    "present": true,
    "quality": "Good",
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false,
    "gaps": [
      "Monitoring duration unspecified",
      "Escalation contact outdated"
    ]
  }
}
```

**Expected:** Risk badge 3 (yellow), 2 collisions listed, historical stats, MOP badges with 2 gaps.

---

### Scenario 2: Very Low Risk — No Collisions — Full MOP

```json
{
  "changeId": "CRQ-56001",
  "risk": 1,
  "collisions": {
    "detected": false,
    "count": 0,
    "details": []
  },
  "historical": {
    "successRate": 100,
    "similarChanges": 8,
    "avgDuration": "12 min",
    "failureHistory": "None"
  },
  "mopStatus": {
    "present": true,
    "quality": "Excellent",
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": true,
    "gaps": []
  }
}
```

**Expected:** Risk badge 1 (green), success message for collisions, 100% success rate (green), all MOP badges pass.

---

### Scenario 3: Critical Risk — Multiple Collision Types

```json
{
  "changeId": "CRQ-56999",
  "risk": 5,
  "collisions": {
    "detected": true,
    "count": 4,
    "details": [
      {
        "changeId": "CRQ-56800",
        "overlapType": "CI-level",
        "affectedCi": "DB-PROD",
        "window": "02:00-03:00"
      },
      {
        "changeId": "CRQ-56801",
        "overlapType": "Service-level",
        "affectedCi": "API-GATEWAY",
        "window": "01:30-02:00"
      },
      {
        "changeId": "CRQ-56802",
        "overlapType": "Time-window",
        "affectedCi": "LB-01",
        "window": "00:00-01:00"
      },
      {
        "changeId": "CRQ-56803",
        "overlapType": "Dependency",
        "affectedCi": "K8S-CLUSTER",
        "window": "N/A"
      }
    ]
  },
  "historical": {
    "successRate": 45,
    "similarChanges": 22,
    "avgDuration": "45 min"
  },
  "mopStatus": {
    "present": false,
    "quality": "Unknown",
    "preChecks": false,
    "steps": false,
    "rollback": false,
    "monitoring": false,
    "gaps": ["No MOP available"]
  }
}
```

**Expected:** Risk badge 5 (red), 4 collisions with different overlap badges, low success rate (red), all MOP badges fail.

---

### Scenario 4: Risk Parsing — String and Edge Cases

**Risk as string (parsed to number):**
```json
{
  "risk": "4",
  "collisions": { "detected": false, "count": 0, "details": [] },
  "historical": { "successRate": 75, "similarChanges": 5, "avgDuration": "20 min" }
}
```
**Expected:** Risk badge 4 (orange).

**Risk out of range (unknown):**
```json
{
  "risk": 0,
  "collisions": { "detected": false, "count": 0, "details": [] }
}
```
**Expected:** Risk badge gray, shows "—".

**Risk missing:**
```json
{
  "collisions": { "detected": false, "count": 0, "details": [] }
}
```
**Expected:** Risk badge gray, shows "—".

---

### Scenario 5: Minimal Data — Only Required Fields

```json
{
  "collisions": { "detected": false, "count": 0, "details": [] }
}
```

**Expected:** Risk "—", no collisions, no historical section, no MOP section.

---

### Scenario 6: Historical Only — No Collisions, No MOP

```json
{
  "risk": 2,
  "collisions": { "detected": false, "count": 0, "details": [] },
  "historical": {
    "successRate": 92,
    "similarChanges": 15,
    "avgDuration": "22 min"
  }
}
```

**Expected:** Risk badge 2 (green), success for collisions, historical stats shown (92% green), no MOP badges.

---

### Scenario 7: Collision Click Test

Use Scenario 1 or 3. Click any collision row; the view should emit `collisionClicked` with `{ changeId, overlapType }`. Wire this event in the View Designer to navigate or open a modal.

---

## View Designer Testing Steps

1. Add the **Change Planning Card** to a view.
2. In **JSON Content**, paste one of the test JSON samples above.
3. Verify:
   - Risk badge shows correct number and color.
   - Collision section shows detected count and details (or success message).
   - Historical stats and success-rate color.
   - MOP badges (pass/fail).
   - Gaps list when present.
4. Toggle **Show Risk**, **Show Collisions**, **Show Historical**, **Show MOP Status** to hide/show sections.
5. Enable **Compact Mode** to hide the footer.
6. Use **Refresh** to re-parse the JSON content (with `jsonContent` bound to a variable, refresh triggers re-evaluation).

---

## Behavior Notes

- **Graceful defaults:** Missing or invalid fields use safe defaults; the component does not throw.
- **Localization:** All labels use `localized-strings.json` keys.
- **Accessibility:** Risk badge has `aria-label` and `role="status"`; collision items are keyboard accessible.
- **Collision clicks:** Each collision row is clickable and emits `collisionClicked` for downstream handling.
