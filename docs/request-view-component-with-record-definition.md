# Request a New View Component That Uses Record Definition

Use this document when asking an AI agent or developer to create a new view component that uses record definition and field selection. Copy the sections below and fill in your answers. The more detail you provide, the better the result.

---

## 1. Component basics

| Field | Your answer |
|-------|-------------|
| **Component name** (kebab-case, e.g. `ticket-status-display`) | |
| **Display name** (shown in View Designer palette, e.g. `Ticket Status Display`) | |
| **One-sentence description** | |
| **Group** (palette grouping, e.g. `Helix Vibe Studio`) | |
| **Icon** (e.g. `clock_o`, `table`, `list`, `bar-chart`) | |
| **Type** | Standalone / Record Editor Field |

---

## 2. Record definition & field selection

| Field | Your answer |
|-------|-------------|
| **Record definition picker?** | Yes (inspector dropdown) / No (hardcoded or expression) |
| **Field selection?** | Yes / No |
| **Which field types to show?** | All / Date-time only / Text only / Numeric only / Selection only / Custom (specify) |
| **Single or multiple fields?** | Single / Multiple |
| **If multiple fields:** | Same type / Mixed types / Specific field IDs (list them) |
| **Record instance ID source** | View input param (name: _____) / Record editor context / Expression (user configures) |

---

## 3. Data & behavior

| Field | Your answer |
|-------|-------------|
| **What does the component display?** | Single value / List / Table / Chart / Form / Other (describe) |
| **Data fetch pattern** | One record by ID / Query (list) / Both |
| **If query:** | DataPage / RxRecordInstanceDataPageService / Custom Java API |

---

## 4. Property inspector (design-time configuration)

List each configurable property:

| Property name | Type | Form control | Expression support? | Required? | Default |
|---------------|------|--------------|--------------------|-----------|---------|
| (e.g. `title`) | string | TextFormControl | Yes | No | `''` |
| (e.g. `recordDefinitionName`) | string | RxDefinitionPicker (Record) | **No** | Yes | — |
| (e.g. `dateTimeFieldId`) | number | SelectFormControl (options from record) | **No** | Yes | — |
| (e.g. `recordInstanceId`) | string | ExpressionFormControl | Yes | If standalone | — |

**Important:** Properties that use **RxDefinitionPicker** or **SelectFormControl** with static/picker values must have `enableExpressionEvaluation: false` in registration. Only ExpressionFormControl properties should have `enableExpressionEvaluation: true`.

---

## 5. Runtime behavior

| Field | Your answer |
|-------|-------------|
| **Services needed** | RxRecordInstanceService / RxRecordInstanceDataPageService / HttpClient / Other |
| **Title bar?** | Yes / No |
| **Loading state?** | Yes / No |
| **Empty state message?** | Yes / No (text: _____) |
| **Error handling** | Toast / Inline message / Silent |
| **setProperty support** | List property names that can be updated at runtime (e.g. `recordInstanceId`, `title`) |

---

## 6. Design-time preview

| Field | Your answer |
|-------|-------------|
| **Canvas preview** | Static placeholder / Live preview from config / Minimal (e.g. component name only) |
| **Placeholder text** when not configured | |

---

## 7. Validation rules

| When | Error or warning message |
|------|--------------------------|
| Record definition not selected | |
| Field not selected | |
| Record instance ID missing (if required) | |
| Other | |

---

## 8. Other requirements

- **Existing similar components to reference?** (e.g. `date-time-epoch-display`, `pizza-ordering`)
- **Localization keys?** (e.g. `com.amar.helix-vibe-studio.view-components.<name>.<key>`)
- **Constraints?** (e.g. no third-party npm packages, use Adapt components only)

---

## Quick copy-paste template (minimal)

```
Create a new view component:

- Name: [kebab-case-name]
- Display name: [Human Readable Name]
- Group: [Palette Group]
- Icon: [icon_name]

Record definition:
- Record definition picker: Yes
- Field selection: Yes, filter by: [date-time / text / all / custom]
- Fields: Single / Multiple
- Record instance ID: [view input param name / record editor / expression]

Displays: [single value / list / table / etc.]

Properties: [list each with type and form control]
```

---

## Reference: Existing components

| Component | Record def? | Field picker? | Use case |
|-----------|-------------|---------------|----------|
| **date-time-epoch-display** | Yes (RxDefinitionPicker) | Yes (date/time fields) | Display one date/time field as epoch |
| **pizza-ordering** | No | No | Form with expression-bound customer name |
| **qr-code-generator** | No | No | Encode text as QR via external API |

---

## Checklist before submitting

- [ ] Component name is kebab-case
- [ ] Record definition + field picker → `enableExpressionEvaluation: false` for those properties
- [ ] Record instance ID source is clear (view input param name if applicable)
- [ ] Form controls are specified for each property
- [ ] Validation rules are defined
