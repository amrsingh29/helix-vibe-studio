# Request: Change Planning Dashboard View Component

Use this document when asking an AI agent or developer to create the Change Planning Dashboard view component. Reference: [Request View Component With Record Definition](../docs/request-view-component-with-record-definition.md), [AI Agent Visual Design](../docs/ai-agent-visual-design.md).

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case) | `change-planning-dashboard` |
| **Display name** (shown in View Designer palette) | Change Planning Dashboard |
| **One-sentence description** | Displays Change Planning Agent output as a structured dashboard with readiness gauge, collision card, MOP coverage, historical summary, and next-action CTAs. |
| **Group** (palette grouping) | Helix Vibe Studio |
| **Icon** (e.g. `clock_o`, `table`, `list`, `bar-chart`) | `bar-chart` or `clipboard` or `list-alt` |
| **Type** | Standalone (can also work in Record Editor Field context) |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown via RxDefinitionPicker) |
| **Field selection?** | Yes |
| **Which field types to show?** | Text/Character only (JSON is stored as flat text in a record field, e.g. worklog) |
| **Single or multiple fields?** | Single |
| **Record instance ID source** | View input param (name: `recordInstanceId`) or Record editor context when placed on a Change Request form |
| **Optional data source** | ExpressionFormControl `jsonContent` — when provided, use as JSON string instead of record fetch. When set, record fetch is skipped. |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | A dashboard with: Readiness section (gauge/badge), Collision & Conflict card, Change Context (accordion), MOP Coverage (checklist), Historical Risk (accordion/list), Recommended Next Action (buttons). All sections render from structured JSON. |
| **Data fetch pattern** | One record by ID, or JSON string from expression (`jsonContent`) |
| **JSON structure** | AI/agent produces JSON. Record field stores it as string. Runtime parses with `JSON.parse()` and maps known keys to sections. Unknown keys can be rendered in a generic label-value area. |

### Expected JSON schema (known keys; sections optional)

```json
{
  "changeId": "CRQ-56789",
  "changeSummary": "Oracle Database Critical Security Patch",
  "changeContext": {
    "changeType": "Standard - Database Patch",
    "window": "2025-12-29 01:00 - 04:00 SGT",
    "primaryCIs": ["DB-PROD-ORA-01"],
    "servicesImpacted": ["Customer Portal"],
    "estimatedUserImpact": "~500 concurrent users"
  },
  "collision": {
    "detected": true,
    "riskLevel": "moderate",
    "count": 2,
    "collidingChanges": [
      { "id": "CRQ-56801", "overlap": "1 hour", "sharedService": "Customer Portal" }
    ]
  },
  "readiness": "conditionally_ready",
  "mopStatus": {
    "present": true,
    "source": "manual",
    "coverage": { "preChecks": true, "steps": true, "rollback": true, "monitoring": false }
  },
  "historicalSummary": { "found": 4, "successRate": 100, "avgExecution": "17.75 min" },
  "nextAction": "generate_mop"
}
```

**Flexibility rules:**

- **Optional sections:** If a top-level key is absent or `null`, do not render that section (e.g. no `mopStatus` → skip MOP section).
- **Extra keys in `coverage`:** Fixed keys (`preChecks`, `steps`, `rollback`, `monitoring`) map to known checkmarks. Any extra keys in `coverage` should be rendered as additional checklist items with label from key name.
- **Unknown top-level keys:** Render in a generic "Additional Details" accordion as label-value pairs using `Object.entries()`.

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

### Optional section toggles (design-time)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `showMopSection` | boolean | SwitchFormControl | Yes | No | `true` |
| `showHistoricalSection` | boolean | SwitchFormControl | Yes | No | `true` |
| `showNextActionButtons` | boolean | SwitchFormControl | Yes | No | `true` |

When `false`, do not render that section even if JSON contains it. Use for layout customization per view.

### Next action behavior

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `onGenerateMopClick` | string | ExpressionFormControl | Yes | No | — |
| `onDeclineClick` | string | ExpressionFormControl | Yes | No | — |

Expression that runs when user clicks "Generate MOP" or "No, thanks". Typically invokes a View Action.

**Important:** Properties that use **RxDefinitionPicker** or **SelectFormControl** must have `enableExpressionEvaluation: false` in registration.

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService (when using record), RxRecordDefinitionService (for field list) |
| **Title bar?** | No |
| **Loading state?** | Yes |
| **Empty state message?** | Yes (e.g. "No planning data" or "Invalid or empty JSON") |
| **Error handling** | Inline message (JSON parse error; show raw text option if parse fails) |
| **setProperty support** | `jsonContent`, `recordInstanceId`, `showMopSection`, `showHistoricalSection`, `showNextActionButtons` |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder — show card outline with "Readiness", "Collision", "Change Context" placeholders |
| **Placeholder text** when not configured | "Configure record definition and JSON field, or bind JSON content expression." |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Neither record nor jsonContent configured | Configure record definition + field + record instance ID, or provide JSON content expression |
| Record definition selected but field not | Field must be selected |
| Record path used but recordInstanceId missing | Record instance ID is required when using record definition |
| JSON parse fails | Invalid JSON. Check field content or expression. |

---

## 8. Adapt component mapping

| Section | Adapt Component | Notes |
|---------|-----------------|-------|
| Readiness | `adapt-progress` or badge | Green (`ready`), Amber (`conditionally_ready`), Red (`not_ready`). Show text label. |
| Collision card | Card + list | Callout styling. Use Adapt CSS vars or semantic colors (success/warning/danger). |
| Change context | `adapt-accordion` | Collapsible; label-value pairs from `changeContext` object. |
| MOP coverage | Custom layout + icons | Check/uncheck per `coverage` key. Use `adapt-tag` or similar for source/evidence. |
| Historical | `adapt-accordion` or simple list | `historicalSummary` + optional CRQ list if provided. |
| Next action | `adapt-button` (primary, secondary) | "Generate MOP" / "No, thanks" — fire expressions if configured. |
| Additional details | `adapt-accordion` | For unknown keys; label-value rows. |

---

## 9. Color & styling

- Use **Adapt CSS variables** where possible: `var(--color-primary)`, `var(--color-background)`, `var(--color-text-primary)`.
- For status callouts, prefer semantic types (`success`, `warning`, `danger`) or component-level CSS variables with fallbacks (e.g. `--cpd-success`, `--cpd-warning`).
- See [AI Agent Visual Design](../docs/ai-agent-visual-design.md) Section 7.2 for color conventions. Avoid hardcoded hex when Adapt vars exist.

---

## 10. Other requirements

- **Existing similar components to reference?** `ai-analysis-display`, `pizza-ordering`
- **Localization keys?** `com.amar.helix-vibe-studio.view-components.change-planning-dashboard.*`
- **Constraints?** No third-party npm packages; use Adapt components only; no markdown in JSON values.
- **Helper:** Implement `getNestedValue(obj, path)` for dot-notation keys (e.g. `changeContext.window`).

---

## Quick copy-paste prompt

```
Create a new view component: Change Planning Dashboard (change-planning-dashboard)

- Display name: Change Planning Dashboard
- Group: Helix Vibe Studio
- Icon: bar-chart or clipboard

Record definition:
- Record definition picker: Yes (RxDefinitionPicker)
- Field selection: Yes, filter by: Text/Character only
- Fields: Single
- Record instance ID: View input param "recordInstanceId" or record editor context
- Optional: jsonContent expression — when set, use as JSON string instead of record fetch

Displays: Dashboard with Readiness gauge, Collision card, Change Context accordion, MOP Coverage checklist, Historical section, Next Action buttons. JSON-driven; optional sections; unknown keys in generic "Additional Details" accordion.

Properties:
- recordDefinitionName, fieldId, recordInstanceId, jsonContent (data source)
- showMopSection, showHistoricalSection, showNextActionButtons (optional section toggles)
- onGenerateMopClick, onDeclineClick (expressions for button clicks)

Reference: docs/ai-agent-visual-design.md (Section 3), ai-analysis-display, pizza-ordering.
Use Adapt components (accordion, progress, button). Leverage Adapt CSS variables for colors.
```

---

## Checklist before submitting

- [ ] Component name is kebab-case
- [ ] Record definition + field picker → `enableExpressionEvaluation: false`
- [ ] Record instance ID source is clear
- [ ] Optional sections render only when JSON key present and toggle is true
- [ ] Extra keys in `coverage` and unknown top-level keys handled
- [ ] All labels localized via localized-strings.json
