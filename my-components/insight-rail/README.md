# Insight rail (data-quality)

Horizontal scrollable **insight cards** driven by **Record Instance Data Page** (same pattern as Catalog view) or by **Records** expression / view input.

## Features

- **Server qualification:** **Records (expression)** — when automatic load is on and the expression resolves to a record-list filter chip or AR qualification string, it is applied as the Data Page `queryExpression`. Selection fields: prefer **numeric enum id** as RHS (see `Qualification.md`), not the display label — align with OOB Record grid expression filters.
- **Action button (actions):** Same View Designer **Edit actions** flow as Catalog view (`buttonActions` sink).
- **Legacy open view** when the action chain is empty (`targetViewDefinitionName`, presentation, view params).

## Integration

Copy `my-components/insight-rail/` into `libs/<application>/src/lib/view-components/insight-rail/`, then:

1. Import `InsightRailRegistrationModule` in your main application module (alongside `CatalogViewRegistrationModule`).
2. Export from `src/index.ts`: `export * from './lib/view-components/insight-rail/insight-rail-registration.module';`
3. Merge `localized-strings.json` into your bundle translations.

See [docs/my-components-helix-vibe-studio-integration.md](../../docs/my-components-helix-vibe-studio-integration.md).

## Troubleshooting (browser console)

Filter by **`InsightRail`**.

1. **“Hidden” message count** — Open the **Default levels** dropdown and turn on **Verbose** if you still rely on `debug`-level logs elsewhere. Main Insight rail diagnostics use **`info()`** so they appear under typical defaults.
2. **Context dropdown** (`top` vs `InsightRail`) — If the console context is restricted to a child frame, switch to **`top`** or **All contexts** so messages are not filtered out.
3. Lines to expect — **`InsightRail [mode]`** (always): whether **Data Page** is active and why not; then **`[DataPage request]`** / **`[DataPage response]`** when Data Page runs; **`[empty UI]`** when no cards; **`warning`** when configuration or qualification is inconsistent.

### If filtering still “does nothing” but there is no error

1. Read **`InsightRail [mode]`**: if **`dataPageActive=false`**, the Records expression is **never** sent as `queryExpression` — fix automatic load / record definition / view input first.
2. If **`dataPageActive=true`** but **`sendsQualification=false`** in **`[DataPage request]`**, the platform did not treat **Records** as a qualification chip (unwrap/format).
3. If **`rowCount=0`** with a **`queryExpression`**, the server returned no rows (often **selection field** needs **numeric** RHS, not label — see `Qualification.md`).
4. **Module Federation** version mismatch (25.x bundle on 26.x shell) can prevent correct remote loading — fix SDK alignment; use **Network** tab and confirm a **datapage** request fires when the rail loads.
