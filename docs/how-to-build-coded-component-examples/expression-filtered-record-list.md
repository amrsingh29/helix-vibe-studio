<!--
  @generated
  @context Doc for expression-driven list filtering (Status = Active); points to sample under my-components and Cursor prompt.
  @decisions Concept + designer table + prompt in cursor-prompts; sample code lives in my-components not duplicated here.
  @references cookbook/02-ui-view-components.md, ./cursor-prompts-coded-components.md
  @modified 2026-03-20
-->

# Expression-driven filter on a record list (example)

This pattern answers: *“Show a list from a query, but only rows where **Status** equals a value chosen with the **expression picker** (e.g. `'Active'` or the current record’s field).”*

## What `enableExpressionEvaluation` does here

| Property | `enableExpressionEvaluation` | Role |
|----------|------------------------------|------|
| **Records** | `true` | Evaluates to an **array** of row objects (your DataPage / query). |
| **Match status value** | `true` | Evaluates to the **value** to compare (literal or expression from record context). |
| **Status field key** | `false` | Plain text: which property on each row is the status (e.g. `Status`). |

The component **does not** evaluate expressions itself — the platform does before `config` reaches Angular. Your code **reads** the results and applies the filter.

## Sample implementation (in this repo)

Full source:

`my-components/expression-filtered-record-list/`

- Registration: `expression-filtered-record-list-registration.module.ts`
- Runtime filter logic: `runtime/expression-filtered-record-list.component.ts`
- Inspector: **Expression** controls for **Records** and **Match status value** in `design/expression-filtered-record-list-design.model.ts`

## View Designer wiring (conceptual)

1. Drop **Filtered record list (expression)** on the view.
2. Set **Record definition** (metadata).
3. **Records** → expression that returns an array of objects with at least **Title** (or your title key) and **Status** (or your status key).
4. **Status field key** → e.g. `Status`.
5. **Match status value** → open the expression builder → enter `'Active'` **or** bind to a field on the **host record** / view input so the filter follows context.

## Cursor prompt

Use the block in **[Cursor prompts — §1b](./cursor-prompts-coded-components.md#1b-expression-filtered-record-list-standalone)** to regenerate or adapt this component in your application library.

## Related

- [Catalog view](../../my-components/catalog-view/README.md) — richer grid/table with expression-bound **records** and **fields**.
- [Helix coded apps tutorial](./helix-coded-apps-tutorial.md) — view component overview.
