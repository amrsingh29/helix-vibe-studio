<!--
  @generated
  @context User wants AI agent steps: wire catalog card/table button to open an Innovation Studio view; brighten layout to white background and improve contrast/beauty.
  @decisions Single instruction doc for agents; references RxOpenViewActionService, existing onRowAction, cv-* SCSS tokens; placeholders for bundleId and view name.
  @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md, .cursor/_instructions/UI/Services/open-view.md, AGENTS.md
  @modified 2026-03-21
-->

# Agent instructions: Catalog view — open view on button click + UI polish (white / contrast)

Use this document when implementing changes to **`my-components/catalog-view/`** (or the same component after you copy it into `libs/<app>/src/lib/view-components/catalog-view/`).

---

## Goals

1. **Behavior:** When the user clicks **Add to order** (or the configured `buttonLabel`) on a **card** or **table row**, open **another Innovation Studio view** that the team has already deployed, passing **context from the selected row** (e.g. product id, name) as **view parameters** where appropriate.
2. **Visual:** The catalog area should read as **clean and bright**: **white (or near-white) main content background**, **clear separation** between sidebar, toolbar, and cards, and **stronger text contrast** — without breaking Adapt / platform CSS variable conventions where possible.

---

## Part A — Open view from the custom component (recommended pattern)

### Approach

Use **`RxOpenViewActionService`** from `@helix/platform/view/actions` inside the **runtime** component (`runtime/catalog-view.component.ts`). This is the supported way to open a view from Angular code (same outcome as the **Open view** view action, but wired to your internal button).

Do **not** rely on the palette **Edit actions** dialog for the button *inside* this custom component unless you have confirmed SDK support for that on custom VCs; see `docs/how-to-build-coded-component-examples/custom-view-component-with-designer-configured-actions.md`.

### Implementation checklist

1. **Inject** `RxOpenViewActionService` in `CatalogViewComponent`’s constructor (alongside existing `ChangeDetectorRef`, `RxLogService`).
2. **Extend** `ICatalogViewProperties` in `catalog-view.types.ts` with designer-configurable fields, for example:
   - `targetViewDefinitionName: string` — full name `<bundleId>:<ViewDefinitionName>` for the view to open.
   - Optional: `openViewPresentation: 'modal' | 'dockedRight' | ...` mapped to `OpenViewActionType` (match `open-view.md` / SDK).
   - Optional: `viewParamFieldKeys: string` — comma-separated or JSON list of **row field keys** to pass into `viewParams` (map display names to what the target view expects).
3. **Register** new properties in `catalog-view-registration.module.ts` (`properties` array) with `enableExpressionEvaluation: true` where authors should bind expressions (at minimum **`targetViewDefinitionName`** is often static per instance).
4. **Design model** (`design/catalog-view-design.model.ts`): add inspector controls (text or expression) for the new properties with tooltips; extend `getSettablePropertiesDataDictionary` / `prepareDataDictionary` if outputs should expose “last opened” for debugging (optional).
5. **Runtime click handler:** extend **`onRowAction(row)`** (or add `openTargetView(row)` called from it):
   - Build **`IOpenViewActionParams`** (`viewDefinitionName`, `presentation`, **`viewParams`** as a plain object built from `row` using the configured field keys).
   - Call `this.rxOpenViewActionService.execute(params).pipe(takeUntil(this.destroyed$), catchError(...))`.
   - Use **`RxLogService`** for failures; **no `console.log`**.
6. **Localization:** any new user-visible strings (errors, aria labels) go through **`TranslateService`** + `localized-strings.json` per project rules.
7. **Subscriptions:** use **`takeUntil(this.destroyed$)`** on the open-view observable.
8. **Document** in `README.md` the exact **`viewDefinitionName`** format and example **`viewParams`** keys the target view must define.

### Cursor / Agent prompt snippet (paste with `@` files)

```text
Implement “open view” on catalog card/table button click for @my-components/catalog-view/

Read:
- @cookbook/04-ui-services-and-apis.md
- @.cursor/_instructions/UI/Services/open-view.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Requirements:
- Inject RxOpenViewActionService in CatalogViewComponent; extend ICatalogViewProperties with targetViewDefinitionName (required for open) and optional presentation + view param field mapping from the row.
- On onRowAction(row), call rxOpenViewActionService.execute with IOpenViewActionParams; use takeUntil(destroyed$), catchError for cancel path, RxLogService on errors.
- Update registration module, design model (inspector + validation warnings if target view empty), design types, runtime template unchanged except if new labels need translate pipe.
- Keep standalone + OnPush; add @generated headers on touched files.

Acceptance: Clicking Add to order opens the deployed view; params match row; build passes.
```

---

## Part B — White background and improved contrast / polish

### Root cause (this repo)

In `runtime/catalog-view.component.scss`, **`.cv-root`** uses `background: var(--color-background, transparent)` and **`.cv-card`** uses `var(--color-background-elevated, ...)`. In many Helix shells, **`--color-background`** is a **light gray**, so the catalog reads “not quite white.” Cards can look slightly dingy against that.

### Design direction

- **Main content column (`.cv-main` + grid area):** explicit **`#ffffff`** (or `var(--color-background-elevated, #fff)` only if that resolves white in your theme — prefer explicit `#fff` for the **content column** if the shell gray must be overridden locally).
- **Cards (`.cv-card`):** **`#ffffff`** face, slightly **stronger border** (`rgba(0,0,0,.08)`–`.12`) and a **soft shadow** so they lift off the page; hover state can be a **very light** gray tint (`#f8f9fb`) instead of heavy gray overlay.
- **Left rail (`.cv-rail`):** either **white** with a **right border**, or a **distinct** light gray (e.g. `#f0f2f5`) so it is clearly “chrome,” not a dirty main background.
- **Typography:** titles **`color: var(--color-text, #1a1a1a)`** or similar; secondary text use **`--color-text-secondary`** with sufficient contrast on white (avoid mid-gray on white below ~4.5:1 if possible).
- **Toolbar (`.cv-toolbar`):** optional light bottom border or subtle background strip so search + toggles separate from the grid.
- **Scope styles under** `.cv-root` **or** `:host` so you do not change global Helix styles outside this component.

### Files to edit

- Primary: **`runtime/catalog-view.component.scss`**
- If table/card shared tokens: adjust **`.cv-table`**, **`.cv-table-wrap`**, **`.cv-empty`** for the same contrast story.

### Agent constraints

- Prefer **CSS variables** from the theme when they give white + contrast; use **literal `#fff` / `#fafafa`** only where the shell token forces gray and the product owner asked for a **white** catalog canvas.
- Keep **focus outlines** visible (`:focus-visible`) for accessibility.
- Do not remove **`:host` / container queries** layout behavior — **visual-only** changes unless a small markup tweak is required.

### Cursor / Agent prompt snippet (visual only)

```text
Polish catalog view visuals in @my-components/catalog-view/runtime/catalog-view.component.scss

Goals: Main catalog content reads white/bright; cards are pure white with subtle border+shadow; sidebar and toolbar visually distinct; improve text contrast (titles vs secondary); hover states stay subtle. Scoped to .cv-* under :host/.cv-root only. Preserve layout, grid, container queries, and a11y outlines.

Reference current classes: .cv-root, .cv-main, .cv-rail, .cv-toolbar, .cv-grid, .cv-card, .cv-table.

After edits, summarize which tokens/colors were chosen and why.
```

---

## Verification

- [ ] Click **Add to order** on a card → target view opens with expected record context.
- [ ] Cancel/close modal (if used) does not throw unhandled errors.
- [ ] No `console.log`; logging via `RxLogService` only.
- [ ] Visual: main area and cards read **white / crisp** on the target Helix theme; sidebar and content remain distinguishable.

---

## Related docs

- [Open view service](.cursor/_instructions/UI/Services/open-view.md) (deep dive)
- [UI Services cookbook](../../cookbook/04-ui-services-and-apis.md)
- [Linking palette button to actions](../../docs/how-to-build-coded-component-examples/linking-view-actions-to-buttons.md) (for comparison — different from in-component open)
