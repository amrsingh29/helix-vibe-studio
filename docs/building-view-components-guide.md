# Building View Components — Step-by-Step Guide

This document walks through the complete process of creating, building, and deploying a custom view component in BMC Helix Innovation Studio, based on the experience of building the **QR Code Generator** component. It also captures learnings from issues encountered so you can avoid the same mistakes.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step: Create a View Component](#step-by-step-create-a-view-component)
3. [Build and Deploy](#build-and-deploy)
4. [Verify in View Designer](#verify-in-view-designer)
5. [Learnings — What Went Wrong and Why](#learnings--what-went-wrong-and-why)

---

## Prerequisites

- Docker or Podman with the `bmc-helix-innovation-studio` container running
- Node.js 20+ and Yarn (for host-side builds if using `build-ui-on-host.sh`)
- `workspace/helix-vibe-studio/pom.xml` configured with:
  - `developerUserName` — BMC Helix login
  - `developerPassword` — BMC Helix password
  - `webUrl` — BMC Helix instance URL (e.g. `https://helixone-demo-is.onbmc.com`)

---

## Step-by-Step: Create a View Component

### 1. Add External Dependencies (If Needed)

If your component uses npm packages, add them to:

**File:** `workspace/helix-vibe-studio/bundle/src/main/webapp/package.json`

```json
"dependencies": {
  ...
  "some-package": "1.2.3"
}
```

Run `yarn install` inside the container if needed.

**Note:** The QR Code Generator does not use an npm package; it uses the public [QR Server API](https://api.qrserver.com/) to avoid Module Federation bundling issues (see [Learning 3](#learning-3-qr-code-and-third-party-packages-module-federation)).

### 2. Create the Types File

**File:** `libs/com-amar-helix-vibe-studio/src/lib/view-components/<component-name>/<component-name>.types.ts`

```typescript
import { IRxStandardProps } from '@helix/platform/view/api';

export interface I<ComponentName>Properties extends IRxStandardProps {
  name: string;
  inputText: string;  // your custom properties
}
```

### 3. Create the Runtime Component

**Files:**
- `runtime/<component-name>.component.ts`
- `runtime/<component-name>.component.html`
- `runtime/<component-name>.component.scss`

**Important for third-party packages:** Some npm packages (e.g. `qrcode`, `qrcode-generator`) fail to bundle correctly for Module Federation. For QR codes, use the [public QR Server API](https://api.qrserver.com/) (no npm dependency); see [Learning 3](#learning-3-qr-code-and-third-party-packages-module-federation). For other packages, prefer dynamic `import()` inside the method that uses them.

### 4. Create the Design Component and Model

**Files:**
- `design/<component-name>-design.component.ts`
- `design/<component-name>-design.component.html`
- `design/<component-name>-design.component.scss`
- `design/<component-name>-design.model.ts`
- `design/<component-name>-design.types.ts`

The design model defines:
- `getInitialProperties()` — default values
- Inspector controls (name, custom properties, standard props)
- Validation
- Data dictionary (for expressions and Set Property action)

### 5. Create the Registration Module

**File:** `libs/.../view-components/<component-name>/<component-name>-registration.module.ts`

```typescript
rxViewComponentRegistryService.register({
  type: 'com-amar-helix-vibe-studio-<component-name>',
  name: 'Display Name',
  group: 'Helix Vibe Studio',
  icon: 'qrcode',  // must be from Adapt icon set
  availableInBundles: ['com.amar.helix-vibe-studio'],  // important
  component: RuntimeComponent,
  designComponent: DesignComponent,
  designComponentModel: DesignModel,
  properties: [
    { name: 'inputText', localizable: false, enableExpressionEvaluation: true },
    ...RX_STANDARD_PROPS_DESC
  ]
});
```

**Critical:** Use `availableInBundles` so the palette shows the group when editing your app's views (see [Learnings](#learning-1-helix-vibe-studio-group-not-visible)).

### 6. Register in Main Module

**File:** `libs/com-amar-helix-vibe-studio/src/lib/com-amar-helix-vibe-studio.module.ts`

```typescript
import { MyComponentRegistrationModule } from "./view-components/my-component/my-component-registration.module";

@NgModule({
  imports: [CommonModule, ..., MyComponentRegistrationModule],
})
```

### 7. Export in Index

**File:** `libs/com-amar-helix-vibe-studio/src/index.ts`

```typescript
export * from "./lib/view-components/my-component/my-component-registration.module";
```

**Critical:** Missing this export means the component won't be bundled. The build may succeed but the component won't appear.

### 8. Add Localization Strings (If Needed)

**File:** `libs/.../i18n/localized-strings.json`

```json
{
  "com.amar.helix-vibe-studio.view-components.my-component.placeholder": "Placeholder text"
}
```

### 9. Cross-File Consistency Checklist

| Value | Must match in |
|-------|----------------|
| Component type string | Registration `type`, Runtime `@RxViewComponent({ name })`, Runtime `selector` |
| Property names | Types, registration `properties`, design model inspector, `setProperty` switch |

---

## Build and Deploy

### Option A: Full Build in Container

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests"
```

### Option B: Build UI on Host (When Container Build Fails with "Killed" / Exit 137)

```bash
./build-ui-on-host.sh
```

Then:

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests -PusePrebuiltUI"
```

### Verify Deployment

- Maven output shows `Final Status:Deployed`
- No `401 Unauthorized` (wrong credentials)
- No `Connection refused` (wrong webUrl)

---

## Verify in View Designer

### Correct Way to Enter View Designer

**Wrong:** Opening the view edit URL directly, or from a generic menu, may load the shell without your application module. Result: "Unknown component" or missing group.

**Right:** Load your application first so its JavaScript registers the components:

1. Go to **Workspace**
2. Find **Helix Vibe Studio**
3. Click **Visit deployed application**
4. From there, open your view (e.g. Pizza Demo) or create a new one

### After Deploy

1. **Hard refresh** the browser: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
2. Log out and log back in if the group still doesn't appear
3. Check the Palette — **Helix Vibe Studio** group should list your components

---

## Learnings — What Went Wrong and Why

### Learning 1: Helix Vibe Studio Group Not Visible

**Symptom:** Palette showed groups like "Basic components", "Record editor inputs", etc., but not "Helix Vibe Studio". Pizza Ordering and QR Code Generator were missing.

**Causes:**
1. **Missing `availableInBundles`** — Without it, the platform may not know when to show your components. Add:
   ```typescript
   availableInBundles: ['com.amar.helix-vibe-studio'],
   ```
2. **Wrong application context** — Components load only when editing a view that belongs to your application. Enter via **Workspace → Helix Vibe Studio → Visit deployed application**, then open views.

**Fix:** Add `availableInBundles` to registration; always enter View Designer through Workspace → your app.

---

### Learning 2: Unknown Component Error

**Symptom:** Opening a view showed: `Unknown component: com-amar-helix-vibe-studio-pizza-ordering` (or a similar type string).

**Causes:**
1. **Wrong component type string** — The registration `type`, `@RxViewComponent({ name })`, and `selector` must match the platform convention: one Angular `prefix` plus the kebab-case component name (e.g. `com-amar-helix-vibe-studio-catalog-view`). A duplicated prefix such as `com-amar-helix-vibe-studio-com-amar-helix-vibe-studio-catalog-view` will not resolve.
2. **Module failed to load** — If any part of the application module throws during load (e.g. a bad import), the whole module fails, no components get registered, and the shell reports "Unknown component" for every component in that app.

**Diagnostics:**
- **Network tab:** Check that `com-amar-helix-vibe-studio-remote-entry.js` and `libs_com-amar-helix-vibe-studio_src_index_ts_*.js` return 200 (not 404)
- **Console:** Look for `TypeError`, `Failed to fetch`, or `Loading chunk failed`
- **Entry path:** Use Workspace → Visit deployed application first to load the app

---

### Learning 3: QR Code and Third-Party Packages (Module Federation)

**Symptom:** The QR Code Generator failed with:
- `TypeError: Cannot read properties of undefined (reading 'call')` when using `qrcode` or `qrcode-generator` npm packages
- `Unknown component` when static imports pulled the package into the remote module and it failed at load time
- Dynamic import (`await import('qrcode')`) still failed due to CJS/ESM interop in Module Federation chunks

**Cause:** The `qrcode` and `qrcode-generator` packages (CommonJS/Node-oriented) do not bundle correctly for the Helix Module Federation remote. Webpack's resolution produces the "reading 'call'" error, or the default/named exports are undefined when loaded as a lazy chunk. This blocks the entire application module.

**Fix that worked for QR Code Generator:** Use the **public QR Server API** instead of any npm package. No bundling, no Module Federation issues:

```typescript
// Working approach — no npm dependency
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

private generateQrCode(text: string): void {
  if (!text?.trim()) {
    this.qrImageUrl = null;
    return;
  }
  const params = new URLSearchParams({
    size: '200x200',
    data: text.trim(),
    margin: '1'
  });
  this.qrImageUrl = `${QR_API}?${params.toString()}`;
}
```

Template: `<img [src]="qrImageUrl" alt="QR Code" />`

**Trade-off:** Encoded text is sent to an external server. For sensitive data, consider an offline/corporate QR API or a future library fix. For typical use (URLs, short codes, labels), the public API is reliable and was successfully deployed.

**For other third-party packages:** Prefer **dynamic import** inside the method that uses them: `const mod = await import('package'); const fn = mod.default ?? mod`. If that still fails, consider an API-based or library-free alternative.

---

### Learning 4: Helix One vs Innovation Studio

**Note:** `helixone-demo-is.onbmc.com` is a Helix One–style demo. Some BMC cloud instances may handle custom coded applications differently. If components or assets consistently fail to load, confirm with your BMC admin that your target instance supports custom Angular applications.

---

### Learning 5: Input Text Shows "No text to encode" at Runtime/Preview

**Symptom:** The QR Code Generator (or similar component) shows a placeholder like "No text to encode" in preview/runtime even though Input Text is set to e.g. "Amrendra" in the designer.

**Cause:** Using `TextFormControlComponent` with `enableExpressionEvaluation: false` can result in the platform not passing the value correctly to the runtime in some contexts (e.g. preview). The platform expects expression-evaluable properties for runtime resolution.

**Fix:** Use `ExpressionFormControlComponent` for properties whose values must reach the runtime, and set `enableExpressionEvaluation: true` in the registration. For a literal string like "Amrendra", the user opens the expression builder, selects **Constant**, enters the string (e.g. `Amrendra`), and the platform evaluates and passes it at runtime.

---

### Learning 6: Build Failures (Exit 137 / Killed)

**Symptom:** Angular build fails with "Killed" and exit code 137.

**Cause:** Out of memory — the build needs several GB of RAM.

**Fix A:** Increase container memory (e.g. 16 GB in Docker Desktop / Podman machine).

**Fix B:** Build UI on the host with `./build-ui-on-host.sh`, then run Maven with `-PusePrebuiltUI`.

---

## Quick Reference

| Task | Location |
|------|----------|
| Cookbook view components | `cookbook/02-ui-view-components.md` |
| Full example | `.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/` |
| Troubleshooting | `cookbook/11-troubleshooting.md` |
| Adapt icons (valid names) | `.cursor/_instructions/UI/Services/GettingAdaptIcons.md` |
