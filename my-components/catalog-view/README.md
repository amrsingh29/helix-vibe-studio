# Catalog view (standalone view component)

Configurable catalog for **BMC Helix Innovation Studio** coded applications. **Shows the same records in a responsive card grid and in a sortable table**, with a toolbar toggle to switch between the two. Renders any array of records using an ordered list of field keys, plus search, optional category rail, optional facet pills, and a per-row action.

> **Platform stack:** Innovation Studio view components are **Angular 18** (not React). This folder is a drop-in view component following the same registration pattern as other samples under `my-components/` (e.g. `pizza-ordering` in `.cursor/_instructions`). The API mirrors what you described as React props (`records`, `fields`, `buttonLabel`, `onAction`) but uses Helix expressions and `notifyPropertyChanged` for outputs.

## Capabilities

| Area | Behavior |
|------|-----------|
| **Record definition** | Inspector **Record definition** picker (`RxDefinitionPicker`) — lists definitions from the environment (nothing hard-coded to a single bundle). |
| **Data** | **Records** and **Fields** are **expressions** (e.g. datapage output and a string array). Runtime does not depend on the picker; the picker documents intent and drives validation hints. |
| **Layout** | Category rail: **narrow sidebar (max 12rem) on wide viewports**; below **992px** it becomes a **full-width horizontal chip row** above the main area so the grid uses the full width. Toolbar: search, facet pills (optional), view toggle (grid / list). Root uses `width: 100%` / `min-width: 0` to avoid clipping in Helix shells. |
| **Card view** | **Fluid CSS grid** (`auto-fill` + `minmax`) so column count follows **container** width, not only viewport breakpoints. Badge for facet field; title wraps; description fields line-clamped; price-like fields emphasized. |
| **Table** | Same columns as `Fields` + action column; sortable headers (asc/desc); sort applies to the **filtered** set. |
| **Action** | Primary button per card/row calls `notifyPropertyChanged('catalogActionRecord', row)` and `notifyPropertyChanged('catalogActionRecordJson', JSON.stringify(row))` for downstream wiring. |
| **Styling** | Layout follows the provided reference; colors use **ADAPT / platform CSS variables** (`--color-*`), not screenshot colors. |

## Integration

1. Copy `my-components/catalog-view/` into your app library under `libs/<application-name>/src/lib/view-components/catalog-view/`.
2. Adjust **selector**, **`@RxViewComponent({ name })`**, and **`register({ type })`** if your application prefix is not `com-example-sample-application` (keep all three identical).
3. Import `CatalogViewRegistrationModule` in your main `*.module.ts` and export it from `src/index.ts` (see [cookbook/02-ui-view-components.md](../../cookbook/02-ui-view-components.md)).
4. Add localized strings if you replace English placeholders (see [cookbook/09-best-practices.md](../../cookbook/09-best-practices.md)).

## Inspector configuration (PRODUCT-style example)

| Property | Example |
|----------|---------|
| Record definition | `com.yourcompany.your-app:PRODUCT` |
| Records | Expression returning an array of objects (e.g. from `RxRecordInstanceDataPageService` / view input). |
| Fields | `["category","name","description","billing_cycle_type","base_price"]` |
| Action button label | `Add to order` |
| Category field key | leave blank to use `category` when present |
| Facet field key | `billing_cycle_type` |
| Facet options (JSON) | `["ONE_OFF","MONTHLY","QUARTERLY","YEARLY"]` |

## Sharing across applications

Deploy a bundle that registers this component to any Helix environment where other apps should see it in View Designer, **or** copy the folder into each application’s Angular library and register it there. The implementation avoids `com.amar.helix-vibe-studio`-specific IDs; replace the sample prefix with your own consistent type string.

## Files

- `runtime/` — runtime UI
- `design/` — designer inspector + canvas hint
- `catalog-view-registration.module.ts` — `RxViewComponentRegistryService.register`
- `catalog-view.types.ts` — property interfaces
