# Request: Field Label + Value View Component

Use this document when asking an AI agent or developer to create the Field Label + Value view component. Reference: @docs/request-view-component-with-record-definition.md

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case) | `field-label-value` |
| **Display name** (shown in View Designer palette) | Field Label + Value |
| **One-sentence description** | Displays a configured label and the value of a selected record field. |
| **Group** (palette grouping) | Helix Vibe Studio |
| **Icon** (e.g. `clock_o`, `table`, `list`, `bar-chart`) | `tag` or `list-alt` |
| **Type** | Standalone (can also work in Record Editor Field context) |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown) |
| **Field selection?** | Yes |
| **Which field types to show?** | All (or at least Text, Number, Date-time, Selection) |
| **Single or multiple fields?** | Single |
| **Record instance ID source** | View input param (e.g. `recordInstanceId`) or Record editor context when placed on a record form |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | Single value: a label and the field value |
| **Data fetch pattern** | One record by ID |
| **Services needed** | RxRecordInstanceService |

---

## 4. Property inspector (design-time configuration)

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|---------------------|------------|---------|
| `title` (or `label`) | string | TextFormControl | Yes | No | Empty or field display name |
| `recordDefinitionName` | string | RxDefinitionPicker (Record) | **No** | Yes | — |
| `fieldId` | number | SelectFormControl (options from record) | **No** | Yes | — |
| `recordInstanceId` | string | ExpressionFormControl | Yes | If standalone | — |
| `separator` | string | TextFormControl | No | No | `': '` |

**Important:** Properties that use RxDefinitionPicker or SelectFormControl must have `enableExpressionEvaluation: false` in registration.

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService |
| **Title bar?** | No |
| **Loading state?** | Yes |
| **Empty state message?** | Yes (e.g. "No value") |
| **Error handling** | Inline message |
| **setProperty support** | `recordInstanceId`, `title` |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder |
| **Placeholder text** when not configured | "Bind to a record field to see label and value" |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Record definition not selected | Record definition name must be a valid expression |
| Field not selected | Field must be selected |
| Record instance ID missing (if required) | Record instance ID is required |

---

## 8. Other requirements

- **Existing similar components to reference?** `date-time-epoch-display`
- **Localization keys?** `com.amar.helix-vibe-studio.view-components.field-label-value.*`
- **Constraints?** No third-party npm packages; use Adapt components only

---

## Quick copy-paste prompt

```
Create a new view component: Field Label + Value (field-label-value)

- Display name: Field Label + Value
- Group: Helix Vibe Studio
- Icon: tag

Record definition:
- Record definition picker: Yes
- Field selection: Yes, filter by: all (or text, number, date-time, selection)
- Fields: Single
- Record instance ID: View input param "recordInstanceId" or record editor context

Displays: Single value — a label and the selected field's value in "Label: Value" format.

Properties:
- title: string, TextFormControl, expression yes, optional, default empty
- recordDefinitionName: RxDefinitionPicker (Record), expression NO, required
- fieldId: SelectFormControl (options from record), expression NO, required
- recordInstanceId: ExpressionFormControl, expression yes, required when standalone
- separator: string, TextFormControl, optional, default ": "

Reference: date-time-epoch-display. No third-party libraries.
```
