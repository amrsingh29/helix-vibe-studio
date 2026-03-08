# Generate View Component Request from Use Case

Use this prompt when you have a **brief use case idea** and want an AI to generate a **complete view component request** that follows the structure in `docs/request-view-component-with-record-definition.md`. You can then use that generated request to build the component.

---

## How to use

1. Copy the **User prompt template** below.
2. Replace `[YOUR USE CASE]` with your idea (e.g. "Single field viewer", "Record summary card", "Status badge from field").
3. Optionally add extra details in **Optional refinements**.
4. Send to the AI agent.
5. The AI will output a full view component request (and optionally save it to `my-working-prompts/<component-name>.md`).

---

## User prompt template

```
Generate a complete view component request from this use case:

Use case: [YOUR USE CASE]

The component must use record definition as input (record definition picker in property inspector) and allow field selection from the chosen record.

Follow the structure in @docs/request-view-component-with-record-definition.md and fill in all sections. Infer sensible defaults for anything not specified. Use kebab-case for component names. Reference existing components (date-time-epoch-display, field-label-value) where helpful.

Optional refinements:
- [Add any extra requirements, e.g. "Show only date-time fields", "Support multiple fields", "Must work inside record editor"]
```

---

## Example inputs and what they produce

| Your input | Generated component name | What it does |
|------------|--------------------------|--------------|
| Single field viewer | `single-field-viewer` | Displays one record field with optional label |
| Record summary card | `record-summary-card` | Card showing key fields from one record |
| Status badge from field | `status-badge-from-field` | Renders a selection/enum field as a colored badge |
| Date diff display | `date-diff-display` | Shows difference between two date fields |
| Field count | `field-count-display` | Counts non-empty values across selected fields |

---

## Quick one-liner prompt

For minimal input:

```
Create a view component request for: [YOUR USE CASE]. Use record definition + field selection. Output full prompt per docs/request-view-component-with-record-definition.md.
```

---

## What the AI should output

1. A complete filled-in request (all 8 sections from the reference doc).
2. A quick copy-paste block for building the component.
3. Optionally: save to `my-working-prompts/<component-name>.md` if you ask.
