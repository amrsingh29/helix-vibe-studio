<!--
  @generated
  @context Document implemented runtime-actions-demo VC and wire-up steps for consuming apps.
  @decisions Copy-into-libs pattern; merge localized-strings.json; prefix alignment note; troubleshooting when palette missing.
  @references cookbook/02-ui-view-components.md, AGENT-INSTRUCTIONS.md
  @modified 2026-03-21
-->

# Runtime actions demo (standalone view component)

Small **developer test harness** that exercises three **runtime** integrations from a single palette widget:

| Button | Primary path | Legacy (no actions configured) |
|--------|----------------|----------------------------------|
| **Open view** | `triggerSinkActions('openViewActions')` — same rx-actions as palette **Button → Edit actions** | `RxOpenViewActionService.execute` from legacy fields |
| **Launch process** | `triggerSinkActions('launchProcessActions')` | `RxLaunchProcessViewActionService.execute` (`message` from **Demo message**) |
| **Show notification** | `triggerSinkActions('notificationActions')` | `RxNotificationService` demo toasts |

The inspector uses **ActionSink** widgets (`actionSinks` on the component descriptor), not array properties — that matches how Helix stores **Edit actions** in the view tree and avoids the `writeValue` / `rx-form-outlet` mismatch.

## Why you don't see it in View Designer

`my-components/runtime-actions-demo/` in **this repo** is a **source template only**. There is **no** Angular application here that imports `RuntimeActionsDemoRegistrationModule`, and nothing in this folder is built or deployed by itself.

View Designer only shows custom components that are **registered at runtime** by your **coded application’s** Angular bundle (after `mvn … -Pdeploy` or your pipeline). Until you do all of the following, the palette will **not** list **Runtime actions demo**:

1. **Copy** the folder into your real project, e.g. `libs/<your-bundle>/src/lib/view-components/runtime-actions-demo/`.
2. **Import** `RuntimeActionsDemoRegistrationModule` in the same `NgModule` where your other view components are registered (the one that already imports e.g. `CatalogViewRegistrationModule`).
3. **Export** that module from your library `index.ts` (same pattern as your other VCs).
4. **Rebuild and redeploy** the bundle to the server you use for View Designer.
5. In the palette, search for **Runtime actions demo** or open the **Helix Vibe Studio** group (same section as Catalog view and your other custom components).

If you did wire it but still don’t see it: confirm the deploy succeeded, hard-refresh the browser, and verify you’re editing a view in the **same bundle** you deployed. Optional: align the component `type` / `selector` / `@RxViewComponent` prefix with your app id (e.g. match [catalog-view](../catalog-view/catalog-view-registration.module.ts)) so naming is consistent with your other components.

## Files in this folder

| Area | Files |
|------|--------|
| Types | `runtime-actions-demo.types.ts` |
| Registration | `runtime-actions-demo-registration.module.ts`, `index.ts` |
| Design time | `design/*` (component, html, scss, model, design types) |
| Runtime | `runtime/*` (component, html, scss) |
| i18n | `localized-strings.json` (merge keys into your bundle’s `localized-strings.json`) |

**Component id** (must stay aligned): `com-amar-helix-vibe-studio-runtime-actions-demo` — used as registration `type`, `@RxViewComponent({ name })`, and component `selector` (aligned with [catalog-view](../catalog-view/catalog-view-registration.module.ts)).

## Wire into a real coded application

1. Copy this folder into your Angular library, e.g. `libs/<application-name>/src/lib/view-components/runtime-actions-demo/`.
2. Align the **prefix** if your app is not `com-example-sample-application`: change `type`, `selector`, and `@RxViewComponent({ name })` to match your bundle (same string in all three places).
3. Import `RuntimeActionsDemoRegistrationModule` in your view-components registration `NgModule` `imports` array (same pattern as other VCs in your app).
4. Export the module from your library `index.ts`, e.g. `export * from './lib/view-components/runtime-actions-demo/runtime-actions-demo-registration.module';`
5. Merge **`localized-strings.json`** from this folder into your application’s main `localized-strings.json` (keys use `com.amar.helix-vibe-studio.view-components.runtime-actions-demo.*` — adjust if your bundle id differs).
6. Build and deploy per [Build & Deploy](../../cookbook/08-build-deploy.md).

## View Designer usage

1. Add **Runtime actions demo** to a throwaway test view.
2. For each button, use **Edit actions** in the inspector (same picker as palette **Button**) to add `rxOpenViewAction`, `rxLaunchProcessAction`, etc. Actions are stored under **named action sinks** (`openViewActions`, `launchProcessActions`, `notificationActions`).
3. **Legacy** sections (optional): when a sink has **no** enabled actions, the matching button falls back to **Target view definition name** / **Target process definition name** / demo notifications as before.

If legacy names are blank and no actions are configured, the buttons **no-op** with a **warning** where applicable and a **debug** log.

## Architecture and rx-action picker

For a detailed explanation of how **Edit actions** are wired (same pattern as palette **Action button** and **Event button**), see [RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md](./RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md). It documents:

- `actionSinks` registration and `getActionsInspectorConfig()`
- View-definition structure (ActionSink children + rx-action chains)
- Runtime flow (`triggerSinkActions`) and legacy fallback

## Related

- [RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md](./RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md) — architecture, diagrams, rx-action picker flow
- [AGENT-INSTRUCTIONS.md](./AGENT-INSTRUCTIONS.md) — original build prompt and acceptance criteria
- [Triggering actions cookbook index](../../docs/triggering-actions-cookbook-index.md)
- [UI Services & APIs](../../cookbook/04-ui-services-and-apis.md)
