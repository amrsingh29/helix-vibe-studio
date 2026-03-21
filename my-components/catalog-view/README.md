# Catalog view (standalone view component)

Configurable catalog for **BMC Helix Innovation Studio** coded applications. **Shows the same records in a responsive card grid and in a sortable table**, with a toolbar toggle to switch between the two. Renders any array of records using an ordered list of field keys, plus search, optional category rail, optional facet pills, and a per-row action.

> **Platform stack:** Innovation Studio view components are **Angular 18** (not React). This folder is a drop-in view component following the same registration pattern as other samples under `my-components/` (e.g. `pizza-ordering` in `.cursor/_instructions`). The API mirrors what you described as React props (`records`, `fields`, `buttonLabel`, `onAction`) but uses Helix expressions and `notifyPropertyChanged` for outputs.

## Capabilities

| Area | Behavior |
|------|-----------|
| **Record definition** | Inspector **Record definition** picker (`RxDefinitionPicker`) — lists definitions from the environment (nothing hard-coded to a single bundle). |
| **Data** | **Records** and **Fields** are **expressions** (e.g. datapage output and a string array). Runtime does not depend on the picker; the picker documents intent and drives validation hints. |
| **Layout** | Category rail: **sidebar (max 12rem)** when the component is wide; when the **host is ≤991px** wide (container query + viewport fallback), a **horizontal scrollable pill strip** above the main area. **≤600px** host: stacked toolbar (full-width search, facets, Grid/Table). Root uses `width: 100%` / `min-width: 0` to avoid clipping in Helix shells. |
| **Card view** | **Fluid CSS grid** (`auto-fill` + `minmax`) so column count follows **container** width, not only viewport breakpoints. Badge for facet field; title wraps; description fields line-clamped; price-like fields emphasized. |
| **Table** | Same columns as `Fields` + action column; sortable headers (asc/desc); sort applies to the **filtered** set. |
| **Action** | Per card/row button: emits **`catalogFieldValuesByFieldId`**, **`catalogActionRecord`**, **`catalogActionRecordJson`**, then runs **Edit actions** if configured (**Action button (actions)** — same as palette **Action button**). Use the component’s **data dictionary** when binding **Launch process** inputs: pick a field under *Selected row (object)* or *Field values by field id* so each process input expression resolves to the clicked row’s value. If no enabled action chain, falls back to **Legacy — Open view**. Same rx-action pattern as **[Runtime actions demo](../runtime-actions-demo/)** — see [COMPARISON-RUNTIME-ACTIONS-DEMO.md](./COMPARISON-RUNTIME-ACTIONS-DEMO.md) and [RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md](../runtime-actions-demo/RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md). |
| **Styling** | Bright **white** main column and distinct rail/toolbar/card treatment (scoped SCSS); ADAPT `adapt-button` for actions; tokens where possible. |

### Edit actions vs Legacy — Open view (no conflict at runtime)

| Topic | Behavior |
|--------|-----------|
| **Order** | On click, the component emits `catalogActionRecord` outputs, then runs **`buttonActions`** if the chain has enabled actions. **Only if** that returns false does it use **Legacy — Open view** (`targetViewDefinitionName` + presentation + view param keys). |
| **Double open?** | No. The legacy path is skipped whenever a configured chain actually runs. |
| **Inspector** | You can leave legacy fields filled while using Edit actions; legacy values are simply ignored when the chain runs. Clear legacy fields if you want to avoid confusion. |

### Troubleshooting: save fails with 400 / AR error 1588

**1588** means a **selection (menu) field** received a value that is not in the server’s allowed list — often on **PUT** `/api/rx/application/view/viewdefinition/...`.

1. **This component** — The design model coerces **Initial view**, **Open view: presentation**, **Load records automatically**, flattens pickers, and strips **accidental quotes** around **Target view definition name** (e.g. `\"com.bundle:MyView\"` → `com.bundle:MyView`) — a common cause of 1588 when the expression field stored literal quotes. Re-open the view and save after deploying the latest bundle.
2. **Your rx-action** — If the failure appeared right after configuring **Open view** (or another action) in **Edit actions**, open that action’s inspector: **presentation type**, **process name**, etc. must use values the server accepts. Check the **response body** of the failed request in DevTools → Network for the exact field hint.
3. **Display fields** — Rarely, stale field IDs in **Display fields** after a record definition change can upset server validation; re-pick fields from the current definition.
4. **Full playbook** — Step-by-step (Network payload, bisect, view-level vs action): [troubleshoot-view-definition-save-400-1588.md](../../docs/how-to-build-coded-component-examples/troubleshoot-view-definition-save-400-1588.md).

## Integration

1. Copy `my-components/catalog-view/` into your app library under `libs/<application-name>/src/lib/view-components/catalog-view/`.
2. Adjust **selector**, **`@RxViewComponent({ name })`**, and **`register({ type })`** to match your bundle (this sample uses `com-amar-helix-vibe-studio` — keep all three identical).
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

## AI agent instructions (open view + UI polish)

To wire **Add to order** to **open another view** (with row context) and to **brighten** the catalog (white background, contrast), use:

- **[AGENT-INSTRUCTIONS-open-view-and-polish-ui.md](./AGENT-INSTRUCTIONS-open-view-and-polish-ui.md)** — full checklist, `RxOpenViewActionService` pattern, SCSS targets (`.cv-root`, `.cv-main`, `.cv-card`, …), and copy-paste prompts for Cursor.

## Files

- `runtime/` — runtime UI
- `design/` — designer inspector + canvas hint
- `catalog-view-registration.module.ts` — `RxViewComponentRegistryService.register`
- `catalog-view.types.ts` — property interfaces
