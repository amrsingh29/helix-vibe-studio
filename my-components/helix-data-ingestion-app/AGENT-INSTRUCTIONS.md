# DataIngest — Why the palette is empty (and how to fix it)

This folder lives under **`my-components/`** as a **source template**. This **Sample-IS-Vibe-Coded-App** repo does **not** include `bundle/` or `libs/<application-name>/`, so **nothing here is deployed or bundled** until you copy it into your real coded application.

If **DataIngest — Admin** / **DataIngest — User** do not appear under **Data Ingestion** in View Designer, work through this checklist in **your** project (the one you `mvn deploy`).

---

## 1. Copy the folders into the Angular library

Copy into:

`bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/`

- `data-ingest-admin/` (entire folder)
- `data-ingest-user/` (entire folder)
- `data-ingest-shared.scss` (parent of the two `runtime/` folders — keep the relative `@import '../../data-ingest-shared.scss'` paths working)
- `data-ingest.models.ts`

Adjust paths if your layout differs; fix `@import` in each component’s `.scss` if you move `data-ingest-shared.scss`.

---

## 2. Import BOTH registration modules in the app NgModule

**File:** `libs/<application-name>/src/lib/<application-name>.module.ts` (name varies)

```typescript
import { DataIngestAdminRegistrationModule } from './view-components/data-ingest-admin/data-ingest-admin-registration.module';
import { DataIngestUserRegistrationModule } from './view-components/data-ingest-user/data-ingest-user-registration.module';

@NgModule({
  imports: [
    // ...existing modules...
    DataIngestAdminRegistrationModule,
    DataIngestUserRegistrationModule
  ]
})
export class /* your app module */ {}
```

---

## 3. Export BOTH modules from `index.ts` (easy to miss)

Per [cookbook/02-ui-view-components.md](../../cookbook/02-ui-view-components.md):

> **Missing this export means the component won't be bundled into the build output.**

**File:** `libs/<application-name>/src/index.ts`

```typescript
export * from './lib/view-components/data-ingest-admin/data-ingest-admin-registration.module';
export * from './lib/view-components/data-ingest-user/data-ingest-user-registration.module';
```

Add these next to your existing `export * from '...catalog-view...'` lines.

---

## 4. Merge localized strings

Merge keys from:

- `data-ingest-admin/localized-strings.json`
- `data-ingest-user/localized-strings.json`

into your bundle’s translation pipeline (same pattern as other view components).

---

## 5. Build and deploy

```bash
# From your project root (with Docker/Podman per AGENTS.md)
mvn clean install -Pdeploy -DskipTests
```

Then in Helix: **Workspace → Helix Vibe Studio → Visit deployed application**, open View Designer, **hard refresh** (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## 6. Optional: `availableInBundles`

Registrations in this repo **do not** set `availableInBundles` (same idea as **Catalog view**). If you add `availableInBundles: ['your-bundle-id']` later, it **must** match your deployed bundle id **exactly** or the palette will hide the components.

---

## Verify the bundle actually contains the registration

After deploy, in the browser **Network** tab, load your app and search the built JS for:

`data-ingest-admin` or `DataIngestAdminRegistrationModule`

If there is **no match**, the module was not included in the chunk — recheck **step 3 (`index.ts` exports)**.
