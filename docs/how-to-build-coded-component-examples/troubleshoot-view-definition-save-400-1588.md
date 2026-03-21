<!--
  @generated
  @context User hits PUT viewdefinition 400 + AR 1588 when saving in View Designer; practical isolation and Network-based debugging.
  @decisions Doc-only; no unverified API claims; points to DevTools + bisect strategy.
  @references BMC AR error 1588 (selection value not in menu)
  @modified 2026-03-21
-->

# Troubleshooting: View definition save fails (400) with AR error 1588

**Symptom:** `PUT /api/rx/application/view/viewdefinition/...` returns **400 Bad Request**. Client log shows **Error (1588): Value specified for selection not one of defined values for this field**.

**Meaning:** On the AR System / Innovation Studio side, a **selection (menu/dropdown) field** is being set to a value that is **not** in that field’s allowed list. The bad value can live in **any** part of the payload the server validates—not only your custom component’s JSON.

---

## 1. Capture the failing request (fastest way to narrow scope)

1. Open **Chrome DevTools** → **Network**.
2. Check **Preserve log**.
3. Trigger **Save** on the view.
4. Click the failing **`viewdefinition`** request (method **PUT**, status **400**).
5. Inspect:
   - **Headers** — confirm URL and `Content-Type` (usually `application/json`).
   - **Payload** / **Request** — full JSON body (this is what the server rejects).
   - **Response** / **Preview** — sometimes the API returns a message, field id, or structured error (copy it).

Repeat for a **successful** save on another view (or the same view after you fix it) and **diff** mentally: what structure or value appears only in the failing save?

---

## 2. Decide: view-level vs component vs action

| Layer | What to check in the JSON |
|--------|---------------------------|
| **View root** | Layout, shell, template, theme, presentation type, or other **top-level** enums—values must match what your tenant’s menus allow. |
| **Any palette component** | Each component’s `properties` / inspector-backed fields—especially **dropdowns** and **pickers** (often stored as `{ id, name }` until flattened). |
| **Custom coded VC** (e.g. Catalog view) | Same: `recordDefinitionName`, field pickers, `initialView`, `openViewPresentationType`, toggles, **Display fields** multi-select. |
| **Action sink / rx-actions** | Each **Open view**, **Launch process**, etc.: **presentation type**, **modal size**, **target view/process**—must be valid enum / FQDN for that action type. |

**1588 does not tell you which field**—only that *some* selection field failed. Isolation (below) is how you find it.

---

## 3. Bisect: isolate the offending change

Do this on a **copy** of the view or after export/backup if your process allows.

1. **Remove the last change** (e.g. delete the **Edit actions** chain under the Catalog **Action button**). Save.  
   - If save **succeeds**, the problem is likely in **that action** (parameter, presentation, or target definition).
2. **Strip the view** to minimum: one container + Catalog only, minimal inspector settings. Save.  
   - If that **works**, add back sections (filters, legacy open view, other components) until save fails.
3. **New blank view**: add **only** the Catalog component, pick record definition + fields, **no** rx-actions. Save.  
   - If this works but **Product Catalog - Testing** does not, compare **exported JSON** or the two **PUT payloads** side by side.

---

## 4. Example (real payload): quoted target view name

If **Legacy — Open view** has `targetViewDefinitionName` stored with **literal double-quotes inside the string**, the PUT body may look like:

```json
"targetViewDefinitionName": "\"com.amar.hssb:Order Create\""
```

The server’s selection list expects **`com.amar.hssb:Order Create`** only → **1588**. Fix: clear the extra quotes in the inspector, or deploy a catalog build that runs `normalizeTargetViewDefinitionNameValue` before save (see `catalog-view.utils.ts`).

---

## 4b. Root node is `ViewComponentDefinition` but has **Edit actions** (rx-action-sink)

**Symptom:** **Runtime actions demo** saves cleanly with the same **Open view** action, but **Catalog view** (or another custom VC) fails with **1588**. Diff the **PUT** body for the component node:

| Working (e.g. runtime-actions-demo) | Failing (e.g. catalog) |
|--------------------------------------|-------------------------|
| `"resourceType":"com.bmc.arsys.rx.services.view.domain.ContainerViewComponentDefinition"` | `"resourceType":"com.bmc.arsys.rx.services.view.domain.ViewComponentDefinition"` |

**Meaning:** **Edit actions** attach **child** nodes (`rx-action-sink` → `rx-action`) under the component. The server expects a **container** component definition for that tree. If the instance was created **before** the bundle registered `isContainerComponent: true` + `outlets` + `actionSinks`, or was copied from an older view, the saved node may still be **`ViewComponentDefinition`**. Nesting action children under that shape can fail validation (**1588**).

**Fix (authoring):**

1. Confirm the **latest** bundle is deployed (registration includes `isContainerComponent: true`, `outlets`, `actionSinks`).
2. On the failing view: **delete** the Catalog (or affected) component from the canvas.
3. **Drag a new** instance from the palette and reconfigure (record definition, fields, Edit actions).

Fresh placement picks up **ContainerViewComponentDefinition**. Optionally create a **new** view definition and add the component once to verify save.

**Note:** Compare with `my-components/catalog-view/COMPARISON-RUNTIME-ACTIONS-DEMO.md`.

---

## 5. Common causes (checklist)

- **Picker not flattened:** Value saved as `{ "id": "...", "name": "..." }` where the server expects a **string** (or integer index). *Mitigation:* coded components can normalize in the design model before save (see Catalog view `patchCatalogPropertiesForViewDefinitionSave` in `catalog-view.utils.ts`).
- **Stale field IDs:** **Display fields** or card slots reference field IDs **removed** from the record definition after a schema change—re-pick fields from the current definition.
- **Invalid enum:** `openViewPresentationType`, Open View action **presentation**, modal size, etc.—must match **exact** platform strings (e.g. `dockedRightModal`, not a typo or legacy value).
- **Expression vs static:** For expression-enabled properties, ensure the stored shape matches what the server expects for that property (string vs expression object)—wrong shape can surface as validation errors depending on field type.
- **Not your component:** Another widget on the canvas or a **view** property (layout/shell) can be invalid—bisect by removing other components.

---

## 6. Server-side / admin (if you have access)

- **AR Server / API logs** around the PUT time may log the **form name** and **field id** for the failed write.
- **BMC docs:** Search for **ARERR 1588** or **“Value specified for selection not one of defined values”** in your Helix version’s troubleshooting docs.

---

## 7. Quick browser-only trick

In **Network**, right-click the failed **PUT** → **Copy** → **Copy as cURL**. You can replay against a test environment or share with support (redact tokens).

---

## Related project notes

- Catalog-specific mitigations and README pointers: `my-components/catalog-view/README.md` (Troubleshooting section).
- Action sinks + Edit actions: `my-components/runtime-actions-demo/RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md`.

---

*The Innovation Studio build in this repo cannot log the server’s internal field id for 1588; DevTools payload/response and bisection are the reliable first steps.*
