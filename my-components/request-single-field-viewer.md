# Request: Single Field Viewer View Component

Use this document when asking an AI agent or developer to create the Single Field Viewer view component. Reference: [Request View Component With Record Definition](./request-view-component-with-record-definition.md)

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case) | `single-field-viewer` |
| **Display name** (shown in View Designer palette) | Single Field Viewer |
| **One-sentence description** | Displays one record field as a widget with optional label, and configurable width and height. |
| **Group** (palette grouping) | Helix Vibe Studio |
| **Icon** (e.g. `clock_o`, `table`, `list`, `bar-chart`) | `tag` or `square-o` |
| **Type** | Standalone (can also work in Record Editor Field context) |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown via RxDefinitionPicker) |
| **Field selection?** | Yes |
| **Which field types to show?** | All (Text, Number, Date-time, Selection, Boolean, etc.) |
| **Single or multiple fields?** | Single |
| **If multiple fields:** | N/A |
| **Record instance ID source** | View input param (name: `recordInstanceId`) or Record editor context when placed on a record form |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | Single value: a field value, optionally prefixed by a label, rendered as a compact widget |
| **Data fetch pattern** | One record by ID |
| **If query:** | N/A |

---

## 4. Property inspector (design-time configuration)

List each configurable property:

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|-----------|---------|
| `recordDefinitionName` | string | RxDefinitionPicker (Record) | **No** | Yes | — |
| `fieldId` | number | SelectFormControl (options from record) | **No** | Yes | — |
| `label` | string | TextFormControl | Yes | No | `''` (or field display name when empty) |
| `recordInstanceId` | string | ExpressionFormControl | Yes | If standalone | — |
| `width` | string | TextFormControl | Yes | No | `'auto'` |
| `height` | string | TextFormControl | Yes | No | `'auto'` |

**Important:** Properties that use **RxDefinitionPicker** or **SelectFormControl** with static/picker values must have `enableExpressionEvaluation: false` in registration. Only ExpressionFormControl properties should have `enableExpressionEvaluation: true`.

**Width and height:**
- Accept CSS values: `'auto'`, `'100%'`, `'200px'`, `'10rem'`, etc.
- Applied as `width` and `height` styles on the component's root container
- Used to define the rendered view component dimensions as a widget

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService |
| **Title bar?** | No |
| **Loading state?** | Yes |
| **Empty state message?** | Yes (e.g. "No value") |
| **Error handling** | Inline message |
| **setProperty support** | `recordInstanceId`, `label`, `width`, `height` |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder (show label + sample value, or placeholder text when not configured) |
| **Placeholder text** when not configured | "Select record definition and field to display" |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Record definition not selected | Record definition must be selected |
| Field not selected | Field must be selected |
| Record instance ID missing (if required) | Record instance ID is required when used standalone |
| Invalid width/height (optional) | Width and height must be valid CSS values (e.g. auto, px, %, rem) |

---

## 8. Other requirements

- **Existing similar components to reference?** `date-time-epoch-display`, `field-label-value`
- **Localization keys?** `com.amar.helix-vibe-studio.view-components.single-field-viewer.*`
- **Constraints?** No third-party npm packages; use Adapt components only

---

## Quick copy-paste prompt

```
Create a new view component: Single Field Viewer (single-field-viewer)

- Display name: Single Field Viewer
- Group: Helix Vibe Studio
- Icon: tag

Record definition:
- Record definition picker: Yes (RxDefinitionPicker)
- Field selection: Yes, filter by: all field types
- Fields: Single
- Record instance ID: View input param "recordInstanceId" or record editor context

Displays: Single value — one record field with optional label, rendered as a widget with configurable width and height.

Properties:
- recordDefinitionName: string, RxDefinitionPicker (Record), expression NO, required
- fieldId: number, SelectFormControl (options from record), expression NO, required
- label: string, TextFormControl, expression yes, optional, default empty
- recordInstanceId: string, ExpressionFormControl, expression yes, required when standalone
- width: string, TextFormControl, expression yes, optional, default "auto" (CSS value)
- height: string, TextFormControl, expression yes, optional, default "auto" (CSS value)

Reference: date-time-epoch-display, field-label-value. No third-party libraries.
```

---

## Checklist before submitting

- [x] Component name is kebab-case
- [x] Record definition + field picker → `enableExpressionEvaluation: false` for those properties
- [x] Record instance ID source is clear (view input param name if applicable)
- [x] Form controls are specified for each property
- [x] Validation rules are defined
- [x] Width and height configuration options included
