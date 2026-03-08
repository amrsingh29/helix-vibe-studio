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

## Showcase: All Section Types (One Sample)

One sample that demonstrates **all 8 section types**: alert, statsRow, keyValue, progressBar, statusGrid, repeatable, gapsList, divider.

**AI Agent Card Configuration record — all attributes**

| Field Name | Value |
|------------|-------|
| configName | `All Components Showcase` |
| description | `Demo config showing every section type: alert, statsRow, keyValue, progressBar, statusGrid, repeatable, gapsList, divider.` |
| themeColor | `purple` |
| headerConfig | `{"title":"All Components Demo","subtitle":"Every section type in one card","icon":"app_list"}` |
| sectionsConfig | `[{"type":"alert","conditionPath":"status.ready","trueMessage":"Ready","falseMessage":"Pending","trueSeverity":"success","falseSeverity":"warning"},{"type":"statsRow","items":[{"label":"Score","valuePath":"metrics.score","suffix":"/100"},{"label":"Count","valuePath":"metrics.count"},{"label":"Progress","valuePath":"metrics.progress","suffix":"%"}]},{"type":"keyValue","title":"Details","items":[{"label":"Owner","valuePath":"info.owner"},{"label":"Created","valuePath":"info.created"},{"label":"Priority","valuePath":"info.priority"}]},{"type":"progressBar","label":"Completion","valuePath":"metrics.progress","maxValue":100,"showPercentage":true},{"type":"statusGrid","title":"Checklist","columns":2,"items":[{"label":"Pre-checks","valuePath":"checklist.preChecks"},{"label":"Steps","valuePath":"checklist.steps"},{"label":"Rollback","valuePath":"checklist.rollback"},{"label":"Monitoring","valuePath":"checklist.monitoring"}]},{"type":"divider"},{"type":"repeatable","title":"Items","dataPath":"items","maxItems":5,"emptyMessage":"None","itemTemplate":{"primary":"title","secondary":"description","badge":"status","clickable":true}},{"type":"gapsList","title":"Gaps","dataPath":"gaps","emptyMessage":"No gaps"}]` |
| isActive | `true` |

**Input JSON** (AI response — store in data record field or use as Direct JSON Content data payload)

```json
{
  "status": { "ready": true },
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
  "checklist": {
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false
  },
  "items": [
    { "title": "Item A", "description": "First item", "status": "Done" },
    { "title": "Item B", "description": "Second item", "status": "In Progress" },
    { "title": "Item C", "description": "Third item", "status": "Pending" }
  ],
  "gaps": [
    "Minor documentation gap",
    "Test coverage 89%"
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
    {
      "type": "alert",
      "conditionPath": "status.ready",
      "trueMessage": "Ready",
      "falseMessage": "Pending",
      "trueSeverity": "success",
      "falseSeverity": "warning"
    },
    {
      "type": "statsRow",
      "items": [
        { "label": "Score", "valuePath": "metrics.score", "suffix": "/100" },
        { "label": "Count", "valuePath": "metrics.count" },
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
      "type": "statusGrid",
      "title": "Checklist",
      "columns": 2,
      "items": [
        { "label": "Pre-checks", "valuePath": "checklist.preChecks" },
        { "label": "Steps", "valuePath": "checklist.steps" },
        { "label": "Rollback", "valuePath": "checklist.rollback" },
        { "label": "Monitoring", "valuePath": "checklist.monitoring" }
      ]
    },
    { "type": "divider" },
    {
      "type": "repeatable",
      "title": "Items",
      "dataPath": "items",
      "maxItems": 5,
      "emptyMessage": "None",
      "itemTemplate": {
        "primary": "title",
        "secondary": "description",
        "badge": "status",
        "clickable": true
      }
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
  "checklist": {
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false
  },
  "items": [
    { "title": "Item A", "description": "First item", "status": "Done" },
    { "title": "Item B", "description": "Second item", "status": "In Progress" },
    { "title": "Item C", "description": "Third item", "status": "Pending" }
  ],
  "gaps": ["Minor documentation gap", "Test coverage 89%"]
}
```

**Expected:** Card shows all 8 sections in order: alert, statsRow, keyValue, progressBar, statusGrid, divider, repeatable (3 rows), gapsList (2 items).

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
