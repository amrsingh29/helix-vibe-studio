# Generic Agent Card — Usage & Testing

## Data Display Options

The component can display data in two ways:

1. **Config record + separate data source** — Layout from AI Agent Card Configuration record; data from record field or `jsonContent`.
2. **Combined JSON (recommended for testing)** — Put layout and data in a single JSON string in **Direct JSON Content**.

---

## Combined JSON Format (for Direct JSON Content)

When using **Direct JSON Content** without a config record, or to override layout from the config record, use this structure:

```json
{
  "_header": {
    "title": "Change Planning",
    "subtitle": "Collision & Historical Analysis",
    "icon": "git-branch"
  },
  "_sections": [
    {
      "type": "alert",
      "conditionPath": "collisions.detected",
      "trueMessage": "${collisions.count} Collision(s) Detected",
      "falseMessage": "No Collisions - Clear to proceed",
      "trueSeverity": "warning",
      "falseSeverity": "success"
    },
    {
      "type": "statsRow",
      "items": [
        { "label": "Success Rate", "valuePath": "historical.successRate", "suffix": "%" },
        { "label": "Similar Changes", "valuePath": "historical.similarChanges" }
      ]
    }
  ],
  "collisions": {
    "detected": true,
    "count": 2,
    "details": []
  },
  "historical": {
    "successRate": 92,
    "similarChanges": 15
  }
}
```

- `_header` — Optional. Overrides header when present.
- `_sections` — Optional. Overrides sections when present (array with at least one item).
- All other keys — Data used by section paths (e.g. `collisions.detected`, `historical.successRate`).

---

## Quick Test (No Config Record)

1. Set **Direct JSON Content** to the expression builder.
2. Add a **constant** with the combined JSON above.
3. Bind **Direct JSON Content** to that constant.
4. Leave **Card Configuration (Record Instance ID)** empty.
5. Save the view and run it.

---

## If Using Config Record

Field IDs are system-generated and vary. The component resolves fields **by name** (configName, themeColor, headerConfig, sectionsConfig). Ensure your AI Agent Card Configuration record has fields with matching names; see `docs/record-ai-agent-card-configuration.md`.

---

## Troubleshooting Empty Card

If you see the header (“Agent Card”) but the body is empty, the card will show a **yellow troubleshooting box** with:

- **No sections to display** — Layout is loaded but there are no sections. Add `_sections` to your Direct JSON Content, or populate the `sectionsConfig` field in the AI Agent Card Configuration record.
- **No data available** — No data source is configured. Use Direct JSON Content, or set Data Record Definition + JSON Data Field + Record Instance ID in the view component properties.
- **Configuration error** — No configuration selected. Either pick an AI Agent Card Configuration record instance, or provide Direct JSON Content with `_header` and `_sections`.

The troubleshooting messages include hints and a link to this guide. Use the sample JSON above for a quick test.

### "Data loaded" but still "No sections to display"

1. **Direct JSON Content**: Ensure your constant or expression provides the **full combined JSON** including `_sections` as an array. Both string and object values are supported. For a constant, paste the full JSON (including `_header` and `_sections`) as a single value.
2. **Config record**: If using AI Agent Card Configuration, verify the **sectionsConfig** field (by name) holds the sections JSON. The component resolves field IDs by name at runtime.
3. **Data record**: When data comes from a record field, that field must contain the full JSON with `_sections` (and optionally `_header`). The layout is overridden from the data when `_sections` is present.

---

## All 14 Section Types — Reference

Every section extends a common base with two fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Section type identifier (see each section below) |
| `showWhen` | string | No | Dot-path to a boolean in data; section is hidden when value is `false` |

---

### 1. `alert` — Conditional Banner

Displays a banner whose message and color change based on a boolean condition in the data.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conditionPath` | string | Yes | Dot-path to a boolean value in data |
| `trueMessage` | string | Yes | Message when condition is `true`. Supports `${path}` placeholders |
| `falseMessage` | string | Yes | Message when condition is `false`. Supports `${path}` placeholders |
| `trueSeverity` | string | Yes | Severity when true: `success`, `warning`, `danger`, `info` |
| `falseSeverity` | string | Yes | Severity when false |
| `trueIcon` | string | No | Adapt icon name when true |
| `falseIcon` | string | No | Adapt icon name when false |

```json
{
  "type": "alert",
  "conditionPath": "collisions.detected",
  "trueMessage": "${collisions.count} Collision(s) Detected",
  "falseMessage": "No Collisions - Clear to proceed",
  "trueSeverity": "warning",
  "falseSeverity": "success"
}
```

Sample data: `{ "collisions": { "detected": true, "count": 2 } }`

---

### 2. `statsRow` — Row of Stat Cards

Displays a horizontal row of numeric stat boxes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | array | Yes | Array of stat items |

Each item in `items`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display label |
| `valuePath` | string | Yes | Dot-path to the value |
| `suffix` | string | No | Text appended after value (e.g., `%`, `/100`) |
| `prefix` | string | No | Text prepended before value |
| `colorThresholds` | object | No | `{ "green": 80, "yellow": 50 }` — color when value >= threshold |
| `defaultValue` | string | No | Fallback when path is missing |

```json
{
  "type": "statsRow",
  "items": [
    { "label": "Success Rate", "valuePath": "historical.successRate", "suffix": "%" },
    { "label": "Similar Changes", "valuePath": "historical.similarChanges" },
    { "label": "Avg Duration", "valuePath": "historical.avgDuration" }
  ]
}
```

Sample data: `{ "historical": { "successRate": 92, "similarChanges": 15, "avgDuration": "17.75 min" } }`

---

### 3. `keyValue` — Label-Value Pair List

Displays a vertical list of label-value pairs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Section heading |
| `layout` | string | No | Layout style (default: vertical) |
| `items` | array | Yes | Array of key-value items |

Each item in `items`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display label |
| `valuePath` | string | Yes | Dot-path to the value |
| `format` | string | No | Value format hint |
| `defaultValue` | string | No | Fallback when path is missing |

```json
{
  "type": "keyValue",
  "title": "Details",
  "items": [
    { "label": "Owner", "valuePath": "info.owner" },
    { "label": "Created", "valuePath": "info.created" },
    { "label": "Priority", "valuePath": "info.priority" }
  ]
}
```

Sample data: `{ "info": { "owner": "Jane Doe", "created": "2025-03-05", "priority": "High" } }`

---

### 4. `progressBar` — Horizontal Progress Bar

Displays a progress bar with optional percentage label.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Bar label text |
| `valuePath` | string | Yes | Dot-path to the current value |
| `maxValue` | number | No | Static max value (default: 100) |
| `maxValuePath` | string | No | Dot-path to dynamic max value (overrides `maxValue`) |
| `showPercentage` | boolean | No | Show percentage text (default: false) |
| `colorThresholds` | object | No | `{ "green": 80, "yellow": 50 }` — color by percentage |

```json
{
  "type": "progressBar",
  "label": "Completion",
  "valuePath": "metrics.progress",
  "maxValue": 100,
  "showPercentage": true
}
```

Sample data: `{ "metrics": { "progress": 72 } }`

---

### 5. `statusGrid` — Grid of Boolean Status Indicators

Displays a grid of items with check/cross icons based on boolean values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section heading |
| `columns` | number | No | Number of columns (default: 2) |
| `items` | array | Yes | Array of status items |

Each item in `items`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display label |
| `valuePath` | string | Yes | Dot-path to a boolean value |
| `trueIcon` | string | No | Adapt icon when true |
| `falseIcon` | string | No | Adapt icon when false |
| `trueColor` | string | No | Color when true |
| `falseColor` | string | No | Color when false |
| `tooltip` | string | No | Tooltip text |

```json
{
  "type": "statusGrid",
  "title": "Checklist",
  "columns": 2,
  "items": [
    { "label": "Pre-checks", "valuePath": "checklist.preChecks" },
    { "label": "Steps", "valuePath": "checklist.steps" },
    { "label": "Rollback", "valuePath": "checklist.rollback" },
    { "label": "Monitoring", "valuePath": "checklist.monitoring" }
  ]
}
```

Sample data: `{ "checklist": { "preChecks": true, "steps": true, "rollback": true, "monitoring": false } }`

---

### 6. `repeatable` — Scrollable Item List

Displays a list of items from an array in the data. Supports click events.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section heading |
| `dataPath` | string | Yes | Dot-path to an array in data |
| `maxItems` | number | No | Maximum items to display |
| `emptyMessage` | string | No | Message when array is empty |
| `itemTemplate` | object | Yes | Template for each item |

`itemTemplate` fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primary` | string | Yes | Key name for the primary text in each array item |
| `secondary` | string | No | Key name for secondary text |
| `badge` | string | No | Key name for badge text |
| `badgeColorMap` | object | No | `{ "Done": "green", "Pending": "yellow" }` |
| `clickable` | boolean | No | Enable click events |
| `clickEventPayload` | object | No | Key mapping for click event data |

```json
{
  "type": "repeatable",
  "title": "Collisions",
  "dataPath": "collisions.details",
  "maxItems": 5,
  "emptyMessage": "No collisions found",
  "itemTemplate": {
    "primary": "changeId",
    "secondary": "recommendation",
    "badge": "overlapType",
    "clickable": true
  }
}
```

Sample data: `{ "collisions": { "details": [{ "changeId": "CRQ-56801", "overlapType": "CI-level", "recommendation": "Sequence database patch first" }] } }`

---

### 7. `gapsList` — Bullet List of Issues

Displays a simple bullet list from a string array. Used for gaps, warnings, or notes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section heading |
| `dataPath` | string | Yes | Dot-path to a string array in data |
| `severity` | string | No | Color theme: `warning`, `danger`, `info` |
| `icon` | string | No | Adapt icon for each item |
| `emptyBehavior` | string | No | What to do when array is empty |
| `emptyMessage` | string | No | Message when array is empty |

```json
{
  "type": "gapsList",
  "title": "Gaps Identified",
  "dataPath": "mopStatus.gaps",
  "emptyMessage": "No gaps"
}
```

Sample data: `{ "mopStatus": { "gaps": ["Monitoring duration unspecified", "Escalation contact outdated"] } }`

---

### 8. `divider` — Visual Separator

Renders a horizontal line between sections.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `style` | string | No | Line style |
| `spacing` | string | No | Vertical spacing |

```json
{ "type": "divider" }
```

No data required.

---

### 9. `statusBadge` — Colored Status Pill

Displays a colored pill badge with a status label and optional description.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `statusPath` | string | Yes | Dot-path to status text (e.g., "High Risk") |
| `labelPath` | string | No | Dot-path to description text below the pill |
| `severityPath` | string | No | Dot-path to dynamic severity value |
| `severity` | string | No | Static severity (used when `severityPath` is absent) |

Severity values: `danger`, `warning`, `success`, `info`

```json
{
  "type": "statusBadge",
  "statusPath": "assessment.status",
  "labelPath": "assessment.recommendation",
  "severityPath": "assessment.severity"
}
```

Sample data: `{ "assessment": { "status": "High Risk", "recommendation": "Proceeding not recommended", "severity": "danger" } }`

---

### 10. `riskMeter` — Gauge Ring with Sub-Scores

Displays a circular gauge for the overall score and horizontal bars for each sub-score dimension.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Section heading |
| `scorePath` | string | Yes | Dot-path to the numeric score |
| `maxScore` | number | No | Maximum score value (default: 5) |
| `subScores` | array | No | Array of sub-score items |

Each item in `subScores`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Sub-score label |
| `scorePath` | string | Yes | Dot-path to the sub-score value |
| `rationale` | string | No | Static text OR dot-path to rationale text in data |

Color thresholds (automatic): green < 40%, yellow 40-60%, orange 60-80%, red >= 80%

```json
{
  "type": "riskMeter",
  "title": "Overall Risk Score",
  "scorePath": "overallScore",
  "maxScore": 5,
  "subScores": [
    { "label": "Documentation", "scorePath": "scores.documentation", "rationale": "scores.documentationRationale" },
    { "label": "Historical Impact", "scorePath": "scores.historical", "rationale": "Past incidents linked to similar changes" },
    { "label": "Service Instability", "scorePath": "scores.serviceInstability", "rationale": "scores.serviceRationale" }
  ]
}
```

Sample data: `{ "overallScore": 5.0, "scores": { "documentation": 5.0, "documentationRationale": "No plan found", "historical": 5.0, "serviceInstability": 5.0, "serviceRationale": "Health 30 CRITICAL" } }`

---

### 11. `impactMatrix` — 2x2 Likelihood vs Impact Grid

Displays a 2x2 matrix with the active cell highlighted based on likelihood and impact values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Section heading |
| `likelihoodPath` | string | Yes | Dot-path to `"high"` or `"low"` |
| `impactPath` | string | Yes | Dot-path to `"high"` or `"low"` |
| `rationale` | string | No | Dot-path to rationale text in data |

Active cell colors: high/high = red, high/low or low/high = yellow, low/low = green

```json
{
  "type": "impactMatrix",
  "title": "Likelihood vs Impact",
  "likelihoodPath": "matrix.likelihood",
  "impactPath": "matrix.impact",
  "rationale": "matrix.rationale"
}
```

Sample data: `{ "matrix": { "likelihood": "high", "impact": "high", "rationale": "Service unstable; past changes linked to incidents" } }`

---

### 12. `insightCard` — Icon + Title + Message Card

Displays a left-bordered card with an icon, bold title, and message paragraph.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `icon` | string | No | Adapt icon name (default: `information-circle`) |
| `titlePath` | string | Yes | Dot-path to title text |
| `messagePath` | string | Yes | Dot-path to message text |
| `severity` | string | No | Static severity |
| `severityPath` | string | No | Dot-path to dynamic severity (overrides `severity`) |

Severity values: `critical`, `danger`, `high`, `warning`, `success`, `info`

```json
{
  "type": "insightCard",
  "icon": "warning_triangle",
  "titlePath": "insights.0.title",
  "messagePath": "insights.0.message",
  "severity": "critical"
}
```

Sample data: `{ "insights": [{ "title": "Proceeding Not Recommended", "message": "All risk dimensions at maximum (5/5)." }] }`

---

### 13. `checklist` — Pass/Fail Validation Items

Displays a list of validation items with circular state indicators.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Section heading |
| `items` | array | Yes | Array of checklist items |

Each item in `items`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Item label |
| `statePath` | string | Yes | Dot-path to state value |
| `detailPath` | string | No | Dot-path to detail text |

State values and their display:

| Value (+ aliases) | Icon | Color |
|--------------------|------|-------|
| `pass`, `true`, `passed` | ✓ | Green |
| `fail`, `false`, `failed` | ✗ | Red |
| `warning`, `warn` | ! | Yellow |
| `pending`, _(anything else)_ | • | Gray |

```json
{
  "type": "checklist",
  "title": "Risk Validation Checks",
  "items": [
    { "label": "Documentation Quality", "statePath": "validation.documentation.state", "detailPath": "validation.documentation.detail" },
    { "label": "Historical Impact", "statePath": "validation.historical.state", "detailPath": "validation.historical.detail" },
    { "label": "Service Stability", "statePath": "validation.service.state", "detailPath": "validation.service.detail" }
  ]
}
```

Sample data: `{ "validation": { "documentation": { "state": "fail", "detail": "No relevant plan found" }, "historical": { "state": "pass", "detail": "No past incidents" }, "service": { "state": "warning", "detail": "Health at 70" } } }`

---

### 14. `diffViewer` — Side-by-Side Comparison

Displays two text panels side-by-side for comparison (expected vs found, before vs after, etc.).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Section heading |
| `leftLabel` | string | No | Left panel label (default: "Expected") |
| `leftPath` | string | Yes | Dot-path to left panel text |
| `rightLabel` | string | No | Right panel label (default: "Found") |
| `rightPath` | string | Yes | Dot-path to right panel text |

Left panel has green tint, right panel has red tint. Monospace font.

```json
{
  "type": "diffViewer",
  "title": "Documentation Mismatch",
  "leftLabel": "Expected",
  "leftPath": "docMismatch.expected",
  "rightLabel": "Found",
  "rightPath": "docMismatch.found"
}
```

Sample data: `{ "docMismatch": { "expected": "BGP implementation plan for Pune links", "found": "Firewall port change in non-prod (unrelated)" } }`

---

## Showcase: All Section Types (One Sample)

One sample that demonstrates **all 14 section types**: alert, statsRow, keyValue, progressBar, statusGrid, repeatable, gapsList, divider, statusBadge, riskMeter, impactMatrix, insightCard, checklist, diffViewer.

**AI Agent Card Configuration record — all attributes**

| Field Name | Value |
|------------|-------|
| configName | `All Components Showcase` |
| description | `Demo config showing all 14 section types.` |
| themeColor | `purple` |
| headerConfig | `{"title":"All Components Demo","subtitle":"Every section type in one card","icon":"app_list"}` |
| sectionsConfig | _(see below — too long for one table cell)_ |
| isActive | `true` |

**sectionsConfig** value (paste as a single line):

```
[{"type":"statusBadge","statusPath":"assessment.status","labelPath":"assessment.recommendation","severityPath":"assessment.severity"},{"type":"alert","conditionPath":"status.ready","trueMessage":"Ready","falseMessage":"Pending","trueSeverity":"success","falseSeverity":"warning"},{"type":"statsRow","items":[{"label":"Score","valuePath":"metrics.score","suffix":"/100"},{"label":"Count","valuePath":"metrics.count"},{"label":"Progress","valuePath":"metrics.progress","suffix":"%"}]},{"type":"riskMeter","title":"Risk Score","scorePath":"riskScore","maxScore":5,"subScores":[{"label":"Documentation","scorePath":"scores.documentation","rationale":"scores.documentationRationale"},{"label":"Historical","scorePath":"scores.historical","rationale":"No past incidents"}]},{"type":"impactMatrix","title":"Likelihood vs Impact","likelihoodPath":"matrix.likelihood","impactPath":"matrix.impact","rationale":"matrix.rationale"},{"type":"keyValue","title":"Details","items":[{"label":"Owner","valuePath":"info.owner"},{"label":"Created","valuePath":"info.created"},{"label":"Priority","valuePath":"info.priority"}]},{"type":"progressBar","label":"Completion","valuePath":"metrics.progress","maxValue":100,"showPercentage":true},{"type":"statusGrid","title":"Checklist","columns":2,"items":[{"label":"Pre-checks","valuePath":"checklist.preChecks"},{"label":"Steps","valuePath":"checklist.steps"},{"label":"Rollback","valuePath":"checklist.rollback"},{"label":"Monitoring","valuePath":"checklist.monitoring"}]},{"type":"insightCard","icon":"warning_triangle","titlePath":"insights.0.title","messagePath":"insights.0.message","severity":"warning"},{"type":"insightCard","icon":"check-circle","titlePath":"insights.1.title","messagePath":"insights.1.message","severity":"success"},{"type":"checklist","title":"Validation","items":[{"label":"Documentation","statePath":"validation.documentation.state","detailPath":"validation.documentation.detail"},{"label":"Service Health","statePath":"validation.service.state","detailPath":"validation.service.detail"}]},{"type":"diffViewer","title":"Config Comparison","leftLabel":"Expected","leftPath":"comparison.expected","rightLabel":"Found","rightPath":"comparison.found"},{"type":"divider"},{"type":"repeatable","title":"Items","dataPath":"items","maxItems":5,"emptyMessage":"None","itemTemplate":{"primary":"title","secondary":"description","badge":"status","clickable":true}},{"type":"gapsList","title":"Gaps","dataPath":"gaps","emptyMessage":"No gaps"}]
```

**Input JSON** (AI response — store in data record field or use as Direct JSON Content data payload)

```json
{
  "assessment": {
    "status": "Medium Risk",
    "recommendation": "Review documentation before proceeding",
    "severity": "warning"
  },
  "status": { "ready": true },
  "metrics": {
    "score": 85,
    "count": 12,
    "progress": 72
  },
  "riskScore": 2.8,
  "scores": {
    "documentation": 3.5,
    "documentationRationale": "Runbook found but missing rollback section",
    "historical": 1.2
  },
  "matrix": {
    "likelihood": "low",
    "impact": "high",
    "rationale": "Service is healthy but change has broad blast radius"
  },
  "info": {
    "owner": "Jane Doe",
    "created": "2025-03-05",
    "priority": "High"
  },
  "checklist": {
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false
  },
  "insights": [
    {
      "title": "Documentation Incomplete",
      "message": "Runbook exists but is missing rollback procedures. Update before execution."
    },
    {
      "title": "Service Healthy",
      "message": "Target service health is 95 (HEALTHY) with 0 active incidents."
    }
  ],
  "validation": {
    "documentation": {
      "state": "warning",
      "detail": "Runbook missing rollback section"
    },
    "service": {
      "state": "pass",
      "detail": "Health 95 (HEALTHY), 0 incidents"
    }
  },
  "comparison": {
    "expected": "Complete runbook with pre-checks, execution, rollback, and monitoring",
    "found": "Runbook v2 — has pre-checks and execution steps; rollback section empty"
  },
  "items": [
    { "title": "Item A", "description": "First item", "status": "Done" },
    { "title": "Item B", "description": "Second item", "status": "In Progress" },
    { "title": "Item C", "description": "Third item", "status": "Pending" }
  ],
  "gaps": [
    "Rollback procedure missing from runbook",
    "Monitoring duration unspecified"
  ]
}
```

**Using Direct JSON Content (combined):** Paste this full JSON into Direct JSON Content, leave Card Configuration empty.

```json
{
  "_header": {
    "title": "All Components Demo",
    "subtitle": "Every section type in one card",
    "icon": "app_list"
  },
  "_sections": [
    { "type": "statusBadge", "statusPath": "assessment.status", "labelPath": "assessment.recommendation", "severityPath": "assessment.severity" },
    { "type": "alert", "conditionPath": "status.ready", "trueMessage": "Ready", "falseMessage": "Pending", "trueSeverity": "success", "falseSeverity": "warning" },
    { "type": "statsRow", "items": [
      { "label": "Score", "valuePath": "metrics.score", "suffix": "/100" },
      { "label": "Count", "valuePath": "metrics.count" },
      { "label": "Progress", "valuePath": "metrics.progress", "suffix": "%" }
    ]},
    { "type": "riskMeter", "title": "Risk Score", "scorePath": "riskScore", "maxScore": 5, "subScores": [
      { "label": "Documentation", "scorePath": "scores.documentation", "rationale": "scores.documentationRationale" },
      { "label": "Historical", "scorePath": "scores.historical", "rationale": "No past incidents" }
    ]},
    { "type": "impactMatrix", "title": "Likelihood vs Impact", "likelihoodPath": "matrix.likelihood", "impactPath": "matrix.impact", "rationale": "matrix.rationale" },
    { "type": "keyValue", "title": "Details", "items": [
      { "label": "Owner", "valuePath": "info.owner" },
      { "label": "Created", "valuePath": "info.created" },
      { "label": "Priority", "valuePath": "info.priority" }
    ]},
    { "type": "progressBar", "label": "Completion", "valuePath": "metrics.progress", "maxValue": 100, "showPercentage": true },
    { "type": "statusGrid", "title": "Checklist", "columns": 2, "items": [
      { "label": "Pre-checks", "valuePath": "checklist.preChecks" },
      { "label": "Steps", "valuePath": "checklist.steps" },
      { "label": "Rollback", "valuePath": "checklist.rollback" },
      { "label": "Monitoring", "valuePath": "checklist.monitoring" }
    ]},
    { "type": "insightCard", "icon": "warning_triangle", "titlePath": "insights.0.title", "messagePath": "insights.0.message", "severity": "warning" },
    { "type": "insightCard", "icon": "check-circle", "titlePath": "insights.1.title", "messagePath": "insights.1.message", "severity": "success" },
    { "type": "checklist", "title": "Validation", "items": [
      { "label": "Documentation", "statePath": "validation.documentation.state", "detailPath": "validation.documentation.detail" },
      { "label": "Service Health", "statePath": "validation.service.state", "detailPath": "validation.service.detail" }
    ]},
    { "type": "diffViewer", "title": "Config Comparison", "leftLabel": "Expected", "leftPath": "comparison.expected", "rightLabel": "Found", "rightPath": "comparison.found" },
    { "type": "divider" },
    { "type": "repeatable", "title": "Items", "dataPath": "items", "maxItems": 5, "emptyMessage": "None", "itemTemplate": { "primary": "title", "secondary": "description", "badge": "status", "clickable": true } },
    { "type": "gapsList", "title": "Gaps", "dataPath": "gaps", "emptyMessage": "No gaps" }
  ],
  "assessment": { "status": "Medium Risk", "recommendation": "Review documentation before proceeding", "severity": "warning" },
  "status": { "ready": true },
  "metrics": { "score": 85, "count": 12, "progress": 72 },
  "riskScore": 2.8,
  "scores": { "documentation": 3.5, "documentationRationale": "Runbook found but missing rollback section", "historical": 1.2 },
  "matrix": { "likelihood": "low", "impact": "high", "rationale": "Service is healthy but change has broad blast radius" },
  "info": { "owner": "Jane Doe", "created": "2025-03-05", "priority": "High" },
  "checklist": { "preChecks": true, "steps": true, "rollback": true, "monitoring": false },
  "insights": [
    { "title": "Documentation Incomplete", "message": "Runbook exists but is missing rollback procedures. Update before execution." },
    { "title": "Service Healthy", "message": "Target service health is 95 (HEALTHY) with 0 active incidents." }
  ],
  "validation": {
    "documentation": { "state": "warning", "detail": "Runbook missing rollback section" },
    "service": { "state": "pass", "detail": "Health 95 (HEALTHY), 0 incidents" }
  },
  "comparison": {
    "expected": "Complete runbook with pre-checks, execution, rollback, and monitoring",
    "found": "Runbook v2 — has pre-checks and execution steps; rollback section empty"
  },
  "items": [
    { "title": "Item A", "description": "First item", "status": "Done" },
    { "title": "Item B", "description": "Second item", "status": "In Progress" },
    { "title": "Item C", "description": "Third item", "status": "Pending" }
  ],
  "gaps": ["Rollback procedure missing from runbook", "Monitoring duration unspecified"]
}
```

**Expected:** Card shows all 14 sections in order: statusBadge (yellow "Medium Risk"), alert (green "Ready"), statsRow (3 stats), riskMeter (gauge at 56% with 2 sub-scores), impactMatrix (low/high cell yellow), keyValue (3 pairs), progressBar (72%), statusGrid (3 green + 1 red), insightCard (yellow warning), insightCard (green success), checklist (1 warning + 1 pass), diffViewer (expected vs found), divider, repeatable (3 items), gapsList (2 gaps).

---

## Test Data: Two Agent Cards (Full Config + AI Response)

Complete copy-paste values for **AI Agent Card Configuration** records and the **AI response JSON** (input data) for each card.

---

### Agent Card 1: Change Planning Agent Card

**AI Agent Card Configuration record — all attributes**

| Field Name      | Value |
|-----------------|-------|
| configName      | `Change Planning Card` |
| description     | `Displays change request collision analysis, historical success rate, and MOP readiness.` |
| themeColor      | `orange` |
| headerConfig    | `{"title":"Change Planning","subtitle":"Collision & Historical Analysis","icon":"arrow_chart"}` |
| sectionsConfig  | `[{"type":"alert","conditionPath":"collisions.detected","trueMessage":"${collisions.count} Collision(s) Detected","falseMessage":"No Collisions - Clear to proceed","trueSeverity":"warning","falseSeverity":"success"},{"type":"statsRow","items":[{"label":"Success Rate","valuePath":"historical.successRate","suffix":"%"},{"label":"Similar Changes","valuePath":"historical.similarChanges"},{"label":"Avg Duration","valuePath":"historical.avgDuration"}]},{"type":"gapsList","title":"Gaps Identified","dataPath":"mopStatus.gaps","emptyMessage":"No gaps"}]` |
| isActive        | `true` |

**AI response JSON** (store in data record field or use as Direct JSON Content data payload)

```json
{
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
    "successRate": 92,
    "similarChanges": 15,
    "avgDuration": "17.75 min"
  },
  "mopStatus": {
    "gaps": [
      "Monitoring duration unspecified",
      "Escalation contact outdated"
    ]
  }
}
```

**How to test:** Create the config record with the table values above. Create a data record with a text field; paste the AI response JSON into that field. Bind the component: Card Configuration = config record GUID, Data Record + JSON field + Record Instance ID = your data record.

---

### Agent Card 2: Incident Summary Agent Card

**AI Agent Card Configuration record — all attributes**

| Field Name      | Value |
|-----------------|-------|
| configName      | `Incident Summary Card` |
| description     | `Shows incident readiness, progress, and identified gaps.` |
| themeColor      | `blue` |
| headerConfig    | `{"title":"Incident Analysis","subtitle":"Readiness & Progress","icon":"app_info_bar"}` |
| sectionsConfig  | `[{"type":"alert","conditionPath":"status.ready","trueMessage":"Ready for handoff","falseMessage":"Pending validation","trueSeverity":"success","falseSeverity":"warning"},{"type":"statsRow","items":[{"label":"Score","valuePath":"metrics.score","suffix":"/100"},{"label":"Items","valuePath":"metrics.count"},{"label":"Progress","valuePath":"metrics.progress","suffix":"%"}]},{"type":"keyValue","title":"Details","items":[{"label":"Owner","valuePath":"info.owner"},{"label":"Created","valuePath":"info.created"},{"label":"Priority","valuePath":"info.priority"}]},{"type":"progressBar","label":"Completion","valuePath":"metrics.progress","maxValue":100,"showPercentage":true},{"type":"gapsList","title":"Gaps","dataPath":"gaps","emptyMessage":"No gaps"}]` |
| isActive        | `true` |

**AI response JSON** (store in data record field or use as Direct JSON Content data payload)

```json
{
  "status": {
    "ready": true
  },
  "metrics": {
    "score": 85,
    "count": 12,
    "progress": 72
  },
  "info": {
    "owner": "Jane Doe",
    "created": "2025-03-05",
    "priority": "High"
  },
  "gaps": [
    "Minor documentation gap",
    "Test coverage 89%"
  ]
}
```

**How to test:** Create the config record with the table values above. Create a data record with a text field; paste the AI response JSON into that field. Bind the component: Card Configuration = config record GUID, Data Record + JSON field + Record Instance ID = your data record.

---

### Using Direct JSON Content (combined layout + data)

To test **without** config records, use the **full combined JSON** below. Put this in Direct JSON Content and leave Card Configuration empty.

**Change Planning (combined):**
```json
{
  "_header": {
    "title": "Change Planning",
    "subtitle": "Collision & Historical Analysis",
    "icon": "arrow_chart"
  },
  "_sections": [
    {
      "type": "alert",
      "conditionPath": "collisions.detected",
      "trueMessage": "${collisions.count} Collision(s) Detected",
      "falseMessage": "No Collisions - Clear to proceed",
      "trueSeverity": "warning",
      "falseSeverity": "success"
    },
    {
      "type": "statsRow",
      "items": [
        { "label": "Success Rate", "valuePath": "historical.successRate", "suffix": "%" },
        { "label": "Similar Changes", "valuePath": "historical.similarChanges" },
        { "label": "Avg Duration", "valuePath": "historical.avgDuration" }
      ]
    },
    {
      "type": "gapsList",
      "title": "Gaps Identified",
      "dataPath": "mopStatus.gaps",
      "emptyMessage": "No gaps"
    }
  ],
  "collisions": {
    "detected": true,
    "count": 2,
    "details": []
  },
  "historical": {
    "successRate": 92,
    "similarChanges": 15,
    "avgDuration": "17.75 min"
  },
  "mopStatus": {
    "gaps": ["Monitoring duration unspecified", "Escalation contact outdated"]
  }
}
```

**Incident Summary (combined):**
```json
{
  "_header": {
    "title": "Incident Analysis",
    "subtitle": "Readiness & Progress",
    "icon": "app_info_bar"
  },
  "_sections": [
    {
      "type": "alert",
      "conditionPath": "status.ready",
      "trueMessage": "Ready for handoff",
      "falseMessage": "Pending validation",
      "trueSeverity": "success",
      "falseSeverity": "warning"
    },
    {
      "type": "statsRow",
      "items": [
        { "label": "Score", "valuePath": "metrics.score", "suffix": "/100" },
        { "label": "Items", "valuePath": "metrics.count" },
        { "label": "Progress", "valuePath": "metrics.progress", "suffix": "%" }
      ]
    },
    {
      "type": "keyValue",
      "title": "Details",
      "items": [
        { "label": "Owner", "valuePath": "info.owner" },
        { "label": "Created", "valuePath": "info.created" },
        { "label": "Priority", "valuePath": "info.priority" }
      ]
    },
    {
      "type": "progressBar",
      "label": "Completion",
      "valuePath": "metrics.progress",
      "maxValue": 100,
      "showPercentage": true
    },
    {
      "type": "gapsList",
      "title": "Gaps",
      "dataPath": "gaps",
      "emptyMessage": "No gaps"
    }
  ],
  "status": { "ready": true },
  "metrics": { "score": 85, "count": 12, "progress": 72 },
  "info": { "owner": "Jane Doe", "created": "2025-03-05", "priority": "High" },
  "gaps": ["Minor documentation gap", "Test coverage 89%"]
}
```

---

## View Designer Testing Steps

1. **Create two AI Agent Card Configuration records** using the tables above.
2. **Create two data records** (one per card); paste the AI response JSON into the text field for each.
3. **Add two Generic Agent Card instances** to a view — one bound to each config + data record.
4. **Or use Direct JSON** — paste the combined JSON into a constant, bind to Direct JSON Content, leave Card Configuration empty.
5. **Verify** — Each card shows its header, sections, and data correctly.
