# Filtered record list (expression-driven filter)

Standalone view component for **BMC Helix Innovation Studio** that demonstrates:

- **`records`** — `enableExpressionEvaluation: true` → bind a **Records** expression (e.g. DataPage output array).
- **`matchStatusValue`** — `enableExpressionEvaluation: true` → bind **`'Active'`** or **another field** from the current record/view so the list shows only rows whose **status field** equals that value.
- **`statusFieldKey` / `titleFieldKey`** — plain inspector text (field names on each row object).

## How filtering works

At runtime the platform evaluates expressions and passes results on `config`. The component compares:

`normalize(row[statusFieldKey]) === normalize(matchStatusValue)`

If **Match status value** is left empty, **all** rows from **Records** are shown.

## Integration

1. Copy `my-components/expression-filtered-record-list/` into `libs/<application-name>/src/lib/view-components/expression-filtered-record-list/`.
2. Align **selector**, **`@RxViewComponent({ name })`**, and **`register({ type })`** with your application prefix (replace `com-example-sample-application` everywhere).
3. Import `ExpressionFilteredRecordListRegistrationModule` in the main app module and export from `index.ts`.

## View Designer example

| Property | Example |
|----------|---------|
| Record definition | `com.yourco.yourapp:Task` |
| Records | Expression returning `[{ Title: 'A', Status: 'Active' }, { Title: 'B', Status: 'Closed' }]` |
| Title field key | `Title` |
| Status field key | `Status` |
| Match status value | `'Active'` or an expression referencing the host record’s status field |

## Production notes

- Replace hardcoded English in the template with **`TranslateService`** and `localized-strings.json` per [cookbook/09-best-practices.md](../../cookbook/09-best-practices.md).
- For large datasets, prefer **server-side** filtering (DataPage query) and use this pattern for **author-driven** criteria or small client-side sets.

See also: [expression-filtered-record-list.md](../../how-to-build-coded-component-examples/expression-filtered-record-list.md).
