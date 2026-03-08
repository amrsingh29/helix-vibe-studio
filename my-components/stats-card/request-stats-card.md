# Request: Stats Card View Component

Use this document when asking an AI agent or developer to create the Stats Card view component. Reference: [Request View Component With Record Definition](../../docs/request-view-component-with-record-definition.md)

**Usage guide:** See [Stats Card — Usage & Testing](Stats_Card_Usage_and_Testing.md) for how to use the component, sample JSON, mapping examples, and testing checklist.

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case) | `stats-card` |
| **Display name** (shown in View Designer palette) | Stats Card |
| **One-sentence description** | A compact card displaying an emoji, primary number, title, and subtitle summary — ideal for metrics like "Services Impacted" or "Users Affected". |
| **Group** (palette grouping) | Helix Vibe Studio |
| **Icon** (e.g. `clock_o`, `table`, `list`, `chart_bar`) | `chart_bar` or `arrow_chart` |
| **Type** | Standalone |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown via RxDefinitionPicker) |
| **Field selection?** | Yes |
| **Which field types to show?** | Text/Character only (JSON is stored as flat text in a record field) |
| **Single or multiple fields?** | Single |
| **Record instance ID source** | View input param (name: `recordInstanceId`) or Record editor context when placed on a record form |
| **Optional data source** | ExpressionFormControl `jsonContent` — when provided, use this as the JSON string instead of fetching from record. When set, record fetch is skipped. |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | A compact horizontal card with: (1) emoji/icon driven by `type`, (2) primary number, (3) title, (4) subtitle summary (e.g. "2 Mission Critical · 3 High"). Each display slot maps to a data field; optional label overrides supported. |
| **Data fetch pattern** | One record by ID, or JSON string from expression (`jsonContent`) |
| **JSON structure** | Data object with `type`, `primaryNumber`, `title`, `subtitle`, and optional `labels`. Record field stores it as a string. Runtime parses with `JSON.parse()`. |

### Data JSON schema — arbitrary shape with key mapping

**The component does not require a fixed JSON shape.** Users supply any JSON; the designer maps JSON keys to display slots via **Data Mapping** properties.

**Example 1 — Standard shape (default mapping):**

```json
{
  "type": "services",
  "primaryNumber": 6,
  "title": "Change Request",
  "subtitle": "2 Mission Critical · 3 High"
}
```

**Example 2 — Arbitrary shape (user maps keys):**

```json
{
  "detected": true,
  "count": 2,
  "risk": "Moderate"
}
```

Designer sets: `primaryNumberKey` = `"count"`, `titleKey` = `"risk"`, `subtitleKey` = `""`, `typeKey` = `""`.

Result: Primary shows `2`, title shows `Moderate`, no subtitle; icon falls back to default.

**Mapping properties (dot notation supported):**

- `primaryNumberKey` — JSON path for primary number (e.g. `"primaryNumber"`, `"count"`, `"data.total"`)
- `titleKey` — JSON path for title
- `subtitleKey` — JSON path for subtitle (empty = hide subtitle slot)
- `typeKey` — JSON path for type/icon (empty = use default icon; values like `"services"`, `"users"`, `"risk"` drive icon lookup)

---

## 4. Property inspector (design-time configuration)

### Data source

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `name` | string | TextFormControl | No | Yes | `''` |
| `recordDefinitionName` | string | RxDefinitionPicker (Record) | **No** | Yes* | — |
| `jsonFieldId` | number | SelectFormControl (text fields only) | **No** | Yes* | — |
| `recordInstanceId` | string | ExpressionFormControl | Yes | If using record | — |
| `jsonContent` | string | ExpressionFormControl | Yes | If not using record | — |

\* Either `recordDefinitionName` + `jsonFieldId` + `recordInstanceId` OR `jsonContent` must be configured. When `jsonContent` has a value, it takes precedence over record fetch.

### Data mapping (JSON key → display slot)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `primaryNumberKey` | string | TextFormControl | **No** | No | `'primaryNumber'` |
| `titleKey` | string | TextFormControl | **No** | No | `'title'` |
| `subtitleKey` | string | TextFormControl | **No** | No | `'subtitle'` |
| `typeKey` | string | TextFormControl | **No** | No | `'type'` |

Dot notation supported (e.g. `data.total`, `summary.count`). Empty = hide slot for subtitle; for type, use default icon.

### Card styling (individual controls)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `cardBackgroundColor` | string | TextFormControl | **No** | No | `#FFFFFF` |
| `cardBorderColor` | string | TextFormControl | **No** | No | `rgba(0,0,0,0.04)` |
| `cardBorderRadius` | string | TextFormControl | **No** | No | `12px` |
| `cardBoxShadow` | string | TextFormControl | **No** | No | `0 2px 8px rgba(0,0,0,0.06)` |
| `cardPadding` | string | TextFormControl | **No** | No | `16px` |

### Icon (Adapt icon picker)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `iconName` | string | IconPickerFormControl | **No** | No | `''` |

When set, overrides the icon from `data.type`. Empty = use type-based lookup (services, users, risk).

### Icon slot styling

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `emojiBackgroundColor` | string | TextFormControl | **No** | No | `#FFF7E6` |
| `emojiColor` | string | TextFormControl | **No** | No | `#4B5563` |
| `emojiFontSize` | string | TextFormControl | **No** | No | `24` |

### Primary number slot styling

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `primaryNumberColor` | string | TextFormControl | **No** | No | `#C96A1F` |
| `primaryNumberFontSize` | string | TextFormControl | **No** | No | `36` |

### Title slot styling

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `titleColor` | string | TextFormControl | **No** | No | `#22272A` |
| `titleFontSize` | string | TextFormControl | **No** | No | `15` |

### Subtitle slot styling

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `subtitleColor` | string | TextFormControl | **No** | No | `#6B7280` |
| `subtitleFontSize` | string | TextFormControl | **No** | No | `12` |

### Advanced (optional override)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `styleConfigOverride` | string | TextFormControl | **No** | No | `''` |

**Note:** Style properties use `enableExpressionEvaluation: false`. Plain values like `#FFFFFF`, `12px`, `rgba(0,0,0,0.04)` work correctly. If set to `true`, the inspector validates them as expressions and errors on unquoted literals.

**styleConfigOverride:** Optional. When non-empty and valid JSON, it overrides all individual style properties. JSON shape matches the structure implied by the individual controls (e.g. `{"card":{"background":"#FFFFFF"},"primaryNumber":{"color":"#C96A1F","fontSize":36}}`). Leave empty to use individual controls. Default: empty string.

**Important:** Properties that use **RxDefinitionPicker** or **SelectFormControl** must have `enableExpressionEvaluation: false` in registration.

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService (when using record), RxRecordDefinitionService (for field list) |
| **Title bar?** | No |
| **Loading state?** | Yes |
| **Empty state message?** | Yes (e.g. "No data" or "Invalid or empty JSON") |
| **Error handling** | Inline message (JSON parse error, missing key, etc.) |
| **setProperty support** | `recordInstanceId`, `jsonContent`, mapping keys (`primaryNumberKey`, `titleKey`, `subtitleKey`, `typeKey`), all style properties, `styleConfigOverride` |
| **Style merge logic** | If `styleConfigOverride` is non-empty and valid JSON, parse and use it for all styling. Otherwise use individual style properties. |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder — show card outline with emoji container, sample number "6", title "Services Impacted", subtitle "2 Mission Critical · 3 High" |
| **Placeholder text** when not configured | "Configure record definition and JSON field, or bind JSON expression." |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Neither record nor jsonContent configured | Configure record definition + JSON field + record instance ID, or provide JSON content expression |
| Record definition selected but field not | Select JSON field when Record Definition is chosen |
| Record path used but recordInstanceId missing | Record instance ID is required when using record |
| styleConfigOverride invalid JSON (when non-empty) | Style config override must be valid JSON |

---

## 8. Other requirements

- **Existing similar components to reference?** `ai-analysis-display`, `change-planning-card` (for RxDefinitionPicker, record+field pattern, individual style controls)
- **Localization keys?** `com.amar.helix-vibe-studio.view-components.stats-card.*`
- **Constraints?** No third-party npm packages; use Adapt components only; use `[style]` bindings (not ngStyle) per cookbook
- **Emoji lookup map:** Component must have internal map: `type` → emoji/icon (e.g. `services` → satellite-dish, `users` → user/group icon, `risk` → warning icon). Provide fallback for unknown type.
- **Accessibility:** Ensure color contrast meets WCAG AA for primary number and title

---

## 9. Visual structure (reference)

```
┌────────────────────────────────────────────────────────────┐
│  ┌────────────┐                                             │
│  │  [emoji]   │  (rounded square, cream bg)                 │
│  └────────────┘                                             │
│                                                             │
│  6                    ← primaryNumber (large, warm amber)   │
│  Services Impacted    ← title (bold, dark)                  │
│  2 Mission Critical · 3 High  ← subtitle (muted)           │
└────────────────────────────────────────────────────────────┘
  ↑ Card: white bg, rounded corners, subtle shadow
  Width ~280–320px, height ~110–140px
```

---

## 10. Quick copy-paste prompt

```
Create a new view component: Stats Card (stats-card)

- Display name: Stats Card
- Group: Helix Vibe Studio
- Icon: chart_bar

Record definition:
- Record definition picker: Yes (RxDefinitionPicker)
- Field selection: Yes, filter by: text/character only
- Fields: Single
- Record instance ID: View input param "recordInstanceId" or record editor context
- Optional: jsonContent expression — when set, use as JSON string instead of record fetch

Displays: Compact card with emoji (type-driven), primary number, title, subtitle. Data from arbitrary JSON — map keys via primaryNumberKey, titleKey, subtitleKey, typeKey (dot notation supported). Emoji resolved via type lookup (services, users, risk) or default.

Properties:
- Data: recordDefinitionName, jsonFieldId, recordInstanceId, jsonContent
- Data Mapping: primaryNumberKey, titleKey, subtitleKey, typeKey
- Card styling: cardBackgroundColor, cardBorderColor, cardBorderRadius, cardBoxShadow, cardPadding
- Emoji: emojiBackgroundColor, emojiColor, emojiFontSize
- Primary number: primaryNumberColor, primaryNumberFontSize
- Title: titleColor, titleFontSize
- Subtitle: subtitleColor, subtitleFontSize
- Advanced: styleConfigOverride (optional JSON override for all styles)

Reference: ai-analysis-display, change-planning-card. Individual style controls in inspector (no raw JSON as primary). Optional styleConfigOverride for power users. No third-party libraries.
```

---

## Checklist before submitting

- [x] Component name is kebab-case
- [x] Record definition + field picker → `enableExpressionEvaluation: false` for those properties
- [x] Record instance ID source is clear
- [x] Form controls and defaults specified for each property
- [x] Individual style controls (no raw JSON as primary config)
- [x] Optional styleConfigOverride (JSON) in Advanced section
- [x] Validation rules defined
- [x] Emoji type lookup map and fallback documented
