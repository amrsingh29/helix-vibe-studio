# Add rx-actions (Edit actions picker) to an existing view component

Use this prompt when you have a **custom view component with a button** (or other clickable trigger) and want to add **View Designer–configurable rx-actions** — the same **Edit actions** picker used by the palette **Action button** and **Event button**. Authors will then be able to add `rxOpenViewAction`, `rxLaunchProcessAction`, etc. via the inspector instead of hardcoding behavior.

---

## Copy-paste prompt for the agent

```text
You are modifying an **existing** BMC Helix Innovation Studio standalone view component that has at least one button (or clickable trigger). Add **rx-action** support so authors can configure **Edit actions** in View Designer for that button — same UX as the palette Action button.

Read first (attach with @):
- @my-components/runtime-actions-demo/RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md
- @my-components/runtime-actions-demo/AGENT-INSTRUCTIONS.md (PART 1 — Rx-actions)
- @my-components/runtime-actions-demo/runtime-actions-demo-registration.module.ts
- @my-components/runtime-actions-demo/design/runtime-actions-demo-design.model.ts
- @my-components/runtime-actions-demo/runtime/runtime-actions-demo.component.ts
- @docs/how-to-build-coded-component-examples/custom-view-component-with-designer-configured-actions.md

### What to do

1. **Registration module** — Add to the component descriptor:
   - `isContainerComponent: true`
   - `outlets: [{ name: RX_VIEW_DEFINITION.defaultOutletName }]`
   - `actionSinks: [{ name: '<sinkName>', label: '<Inspector section label>' }]` — one sink per button (e.g. `primaryButtonActions`, `secondaryButtonActions`)
   - Import `OpenViewActionModule` and `LaunchProcessViewActionModule` in the NgModule `imports` (so authors can add those actions)

2. **Types** — Add to the component’s config interface:
   - `actionSinks?: IActionSinkConfig[]`
   Do NOT add array properties like `actions: IAction[]` — actions live as child components in the view tree.

3. **Design model** — Add an inspector section for each action sink:
   - Call `this.sandbox.getActionsInspectorConfig().controls`
   - Use `controls[0]` for the first sink, `controls[1]` for the second, etc.
   - Add sections: `{ label: '<Section label>', controls: sinkControls[i] ? [sinkControls[i]] : [] }`
   - **CRITICAL:** Do NOT add `name: '...'` to these controls. They are ActionSinkWidget configs; adding `name` causes `TypeError: this.instance.writeValue is not a function` because FormBuilderComponent treats them as form controls.

4. **Runtime component** — Ensure the component extends `BaseViewComponent`. For each button’s click handler:
   - First call `tryRunSinkActions('<sinkName>')` — use the same name as in `actionSinks`
   - If it returns `true`, the action chain ran — return
   - If it returns `false`, run your existing logic (e.g. direct service calls)

   Implement `tryRunSinkActions` like this:
   ```typescript
   private tryRunSinkActions(sinkName: string): boolean {
     const guid = this.state?.actionSinks?.find((s) => s.name === sinkName)?.guid;
     if (!guid) return false;
     const enabled = this.runtimeViewModelApi.getEnabledActions(guid);
     if (!enabled.length) return false;
     this.triggerSinkActions(sinkName)
       .pipe(takeUntil(this.destroyed$), catchError(() => EMPTY))
       .subscribe(() => this.cdr.markForCheck());
     return true;
   }
   ```

### Sink names

Choose a clear sink name per button, e.g.:
- One button: `actionSinks: [{ name: 'buttonActions', label: 'Button (actions)' }]`
- Two buttons: `actionSinks: [{ name: 'primaryActions', label: 'Primary button (actions)' }, { name: 'secondaryActions', label: 'Secondary button (actions)' }]`

### Acceptance

- Inspector shows an "Edit actions" control for the sink(s).
- Author can add rxOpenViewAction, rxLaunchProcessAction, etc.
- At runtime, button click runs the configured chain when present.
- No `writeValue` errors in the inspector.
```

---

## Quick checklist (for human review)

| Area | Change |
|------|--------|
| Registration | `actionSinks`, `outlets`, `isContainerComponent: true`, OpenView/LaunchProcess modules |
| Types | `actionSinks?: IActionSinkConfig[]` in config |
| Design model | `getActionsInspectorConfig().controls` → inspector sections; **no `name` on controls** |
| Runtime | Extend `BaseViewComponent`; `tryRunSinkActions(sinkName)` before existing logic |

---

## Reference implementation

`my-components/runtime-actions-demo/` — a complete working example with three action sinks, legacy fallbacks, and full architecture documentation.
