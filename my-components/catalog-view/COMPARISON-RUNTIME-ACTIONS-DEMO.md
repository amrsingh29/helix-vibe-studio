<!--
  @generated
  @context Compare Catalog view with working Runtime actions demo for rx-action / actionSinks parity and AR 1588 debugging.
  @decisions Documents registration + design-model differences; no code changes required for this file alone.
  @references my-components/runtime-actions-demo/, catalog-view-registration.module.ts
  @modified 2026-03-21
-->

# Catalog view vs **Runtime actions demo** (rx-action reference)

Use **Runtime actions demo** as the known-good baseline: same bundle, same `OpenViewActionModule` / `LaunchProcessViewActionModule`, same container + default outlet pattern. If **Open view** saves there but **1588** appears on **Catalog view**, the problem is almost always **Catalog-specific persisted properties**, not the action chain itself.

## Registration (aligned)

| Item | Runtime actions demo | Catalog view |
|------|----------------------|--------------|
| `isContainerComponent` | `true` | `true` |
| `outlets` | `[{ name: RX_VIEW_DEFINITION.defaultOutletName }]` | Same |
| `OpenViewActionModule` | imported | imported |
| `actionSinks` | Multiple sinks (`openViewActions`, …) | Single sink: `buttonActions` |
| Legacy / expression props | `targetViewDefinitionName`, `openViewPresentationType`, … | Same idea + catalog data props |

**Sink name** (`openViewActions` vs `buttonActions`) only labels the inspector; it does not change how **Open view** actions serialize. If rx-action works on the demo, the platform accepts that action shape.

## Design model (important differences)

| Area | Runtime actions demo | Catalog view |
|------|----------------------|--------------|
| Inspector setup | **`updateInspectorConfig` once** in the constructor (static sections + `getActionsInspectorConfig()`) | Same **plus** `combineLatest(componentProperties$, fieldOptions$)` that **rebuilds** inspector config when props or RD fields change |
| Save-oriented coercion | **None** (no `patchCatalogPropertiesForViewDefinitionSave`) | **`patchCatalogPropertiesForViewDefinitionSave`** runs on **every** `componentProperties$` emission and may call **`updateComponentProperties`** to flatten pickers / enums |
| Extra inspector surface | Small legacy + demo sections | **Record definition**, **Display fields**, **card slots**, **filters**, **Initial view**, **Legacy open view**, etc. — many **selection** fields |

So: **the same Open view action** in **Edit actions** should produce the **same nested `componentDefinitions` for that action** on both components. If save fails only on Catalog, the invalid **selection** value is usually in **Catalog’s own `componentProperties`** (or a **nested** component on the same view), not in the action widget’s type token.

## Why 1588 can still point at `componentDefinitions=>=>componentDefinitions`

The server walks **nested** component trees (layout → container → inner view → …). **Catalog** contributes **more** primitive properties that map to **menu/selection** fields in the stored schema. Any one of these still stored as `{ id, name }`, wrong enum string, or stale field id can trigger **1588** even when **rx-action** is configured correctly.

### Confirmed from Network payloads (same Open view action)

If the **working** runtime-actions-demo node has `resourceType` **`ContainerViewComponentDefinition`** but the **failing** catalog node has **`ViewComponentDefinition`** while both nest `rx-action-sink` → `rx-action`, the catalog instance is **stale** (created before `isContainerComponent: true` or copied from an old view). **Delete the component and add a fresh one from the palette** after deploying the current bundle. See [troubleshoot-view-definition-save-400-1588.md](../../docs/how-to-build-coded-component-examples/troubleshoot-view-definition-save-400-1588.md) §4b.

## What to compare in Network (practical)

1. **Isolate** a view that contains **only** Runtime actions demo + **Open view** action → save succeeds.
2. **Isolate** a view that contains **only** Catalog view + the **same** Open view configuration (target view, presentation) → if save fails, export **PUT** bodies and **diff** the `componentProperties` object for the two component types.
3. Focus diff on: `recordDefinitionName`, `catalogSelectedFieldIds`, **card** `*FieldId*`, `categoryFieldKey`, `facetFieldKey`, `initialView`, `openViewPresentationType`, `useBuiltInRecordQuery`, and any field that looks like a **string** in the schema but is still an **object** in JSON.

## Alignment recommendations

1. **Do not assume** 1588 is from **Edit actions** until the Catalog **non-action** properties are flattened in the payload (diff vs demo).
2. **Legacy — Open view**: If you rely on **Edit actions** only, set **Open view: presentation** to **Docked right modal** (default) and leave legacy target/title/params empty to avoid an extra legacy selection block in the payload.
3. **After changing record definition**, re-pick **Display fields** and card/filter fields so IDs match the current definition.

See also: [RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md](../runtime-actions-demo/RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md), [troubleshoot-view-definition-save-400-1588.md](../../docs/how-to-build-coded-component-examples/troubleshoot-view-definition-save-400-1588.md).
