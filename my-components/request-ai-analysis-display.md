# Request: AI Analysis Display View Component

Use this document when asking an AI agent or developer to create the AI Analysis Display view component. Reference: [Request View Component With Record Definition](./request-view-component-with-record-definition.md)

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case) | `ai-analysis-display` |
| **Display name** (shown in View Designer palette) | AI Analysis Display |
| **One-sentence description** | Displays AI-generated JSON analysis in a configurable card layout with title, badge, callout, and label-value sections. |
| **Group** (palette grouping) | Helix Vibe Studio |
| **Icon** (e.g. `clock_o`, `table`, `list`, `bar-chart`) | `bar-chart` or `list-alt` |
| **Type** | Standalone (can also work in Record Editor Field context) |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown via RxDefinitionPicker) |
| **Field selection?** | Yes |
| **Which field types to show?** | Text/Character only (JSON is stored as flat text in a record field) |
| **Single or multiple fields?** | Single |
| **Record instance ID source** | View input param (name: `recordInstanceId`) or Record editor context when placed on a record form |
| **Optional data source** | ExpressionFormControl `jsonContent` — when provided, use this as the JSON string instead of fetching from record (for view input, another component output, etc.). When set, record fetch is skipped. |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | A card with: configurable title, optional badge, a callout box (from one JSON key), and a list of label-value rows (from other JSON keys). All keys are configurable. JSON is parsed at runtime; keys support dot notation for nested paths (e.g. `summary.executive`). |
| **Data fetch pattern** | One record by ID, or JSON string from expression (`jsonContent`) |
| **JSON structure** | AI produces JSON. Record field stores it as a string. Runtime parses with `JSON.parse()` and reads values by configured keys. No markdown. |

---

## 4. Property inspector (design-time configuration)

### Data source

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `recordDefinitionName` | string | RxDefinitionPicker (Record) | **No** | Yes* | — |
| `fieldId` | number | SelectFormControl (text fields only) | **No** | Yes* | — |
| `recordInstanceId` | string | ExpressionFormControl | Yes | If using record | — |
| `jsonContent` | string | ExpressionFormControl | Yes | If not using record | — |

\* Either `recordDefinitionName` + `fieldId` + `recordInstanceId` OR `jsonContent` must be configured. When `jsonContent` has a value, it takes precedence over record fetch.

### Card header (not from JSON)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `title` | string | TextFormControl | Yes | No | `''` |
| `badgeText` | string | TextFormControl | Yes | No | `''` (empty = no badge) |

### Callout (one JSON key, styled)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `calloutJsonKey` | string | TextFormControl | No | No | `''` (empty = no callout) |
| `calloutLabel` | string | TextFormControl | Yes | No | `''` |
| `calloutBackgroundColor` | string | TextFormControl | Yes | No | `#e9f9ed` |
| `calloutBorderColor` | string | TextFormControl | Yes | No | `#9fe1a8` |
| `calloutBorderRadius` | string | TextFormControl | Yes | No | `6px` |

### Label-value sections (generic list from JSON)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `sections` | string | TextFormControl | No | No | `[]` |

**`sections` format:** JSON array of `{ "key": "<jsonKey>", "label": "<displayLabel>" }`.  
Example: `[{"key":"keyPoints","label":"Key Points:"},{"key":"recommendation","label":"Recommendation:"}]`  
- Keys support dot notation for nested paths, e.g. `summary.executive`.  
- Designer types key names; no dropdown (JSON not available at design time).

### Card styling

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `backgroundColor` | string | TextFormControl | Yes | No | `#f3e7fb` |
| `borderColor` | string | TextFormControl | Yes | No | `#b291e6` |
| `borderRadius` | string | TextFormControl | Yes | No | `8px` |
| `borderWidth` | string | TextFormControl | Yes | No | `1px` |
| `width` | string | TextFormControl | Yes | No | `'100%'` |
| `height` | string | TextFormControl | Yes | No | `'auto'` |

### Misc

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `badgeBackgroundColor` | string | TextFormControl | Yes | No | `#7b4fc0` |
| `badgeTextColor` | string | TextFormControl | Yes | No | `#ffffff` |

**Important:** Properties that use **RxDefinitionPicker** or **SelectFormControl** must have `enableExpressionEvaluation: false` in registration.

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService (when using record), RxRecordDefinitionService (for field list) |
| **Title bar?** | No |
| **Loading state?** | Yes |
| **Empty state message?** | Yes (e.g. "No analysis data" or "Invalid or empty JSON") |
| **Error handling** | Inline message (JSON parse error, missing key, etc.) |
| **setProperty support** | `title`, `badgeText`, `calloutJsonKey`, `calloutLabel`, `sections`, `jsonContent`, `recordInstanceId`, all color/size props |
| **Helper** | Implement `getNestedValue(obj, path)` to resolve dot notation (e.g. `summary.executive` → `obj.summary.executive`) |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder — show card outline with title/badge if configured; placeholder text for callout and sections |
| **Placeholder text** when not configured | "Configure record definition and JSON field, or bind JSON expression. Set callout key and sections." |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Neither record nor jsonContent configured | Configure record definition + field + record instance ID, or provide JSON content expression |
| Record definition selected but field not | Field must be selected |
| Record path used but recordInstanceId missing | Record instance ID is required when using record definition |
| `sections` invalid JSON | Sections must be a valid JSON array of {key, label} objects |
| `calloutJsonKey` with invalid characters | Callout key must be a valid JSON key path (alphanumeric, dots for nested) |

---

## 8. Other requirements

- **Existing similar components to reference?** `single-field-viewer`, `field-label-value`
- **Localization keys?** `com.amar.helix-vibe-studio.view-components.ai-analysis-display.*`
- **Constraints?** No third-party npm packages; use Adapt components only; no markdown
- **Decision styling?** None — all values rendered as plain text
- **JSON key selection:** Designer types key names in TextFormControl (no dropdown; keys not known at design time). Support dot notation for nested keys.

---

## 9. Visual structure (reference)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [title]                                    [badgeText] (pill)          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─ callout (calloutJsonKey value) ─────────────────────────────────┐   │
│  │  [calloutLabel] value from calloutJsonKey                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [sections[0].label] sections[0].key value                              │
│  [sections[1].label] sections[1].key value                              │
│  ...                                                                    │
└─────────────────────────────────────────────────────────────────────────┘
  ↑ Card: backgroundColor, borderColor, borderRadius, borderWidth
```

---

## Quick copy-paste prompt

```
Create a new view component: AI Analysis Display (ai-analysis-display)

- Display name: AI Analysis Display
- Group: Helix Vibe Studio
- Icon: bar-chart

Record definition:
- Record definition picker: Yes (RxDefinitionPicker)
- Field selection: Yes, filter by: text/character only
- Fields: Single
- Record instance ID: View input param "recordInstanceId" or record editor context
- Optional: jsonContent expression — when set, use as JSON string instead of record fetch

Displays: Card with title, badge, callout box (from one JSON key), and label-value rows (from sections config). AI produces JSON; no markdown. All keys configurable; dot notation for nested. No special decision styling.

Properties:
- title, badgeText: config (not from JSON)
- calloutJsonKey, calloutLabel, calloutBackgroundColor, calloutBorderColor, calloutBorderRadius
- sections: JSON array string [{"key":"...","label":"..."}]
- backgroundColor, borderColor, borderRadius, borderWidth, width, height
- badgeBackgroundColor, badgeTextColor
- recordDefinitionName, fieldId, recordInstanceId, jsonContent

Reference: single-field-viewer, field-label-value. No third-party libraries.
```

---

## Checklist before submitting

- [x] Component name is kebab-case
- [x] Record definition + field picker → `enableExpressionEvaluation: false` for those properties
- [x] Record instance ID source is clear
- [x] Form controls and defaults specified for each property
- [x] Validation rules defined
- [x] Callout and card styling configurable (hex/CSS)
- [x] Generic sections (Option A) for label-value rows
- [x] No decision styling (plain text)
