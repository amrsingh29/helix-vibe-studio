# DataIngest (BMC Helix Innovation Studio)

Template-driven data ingestion UI aligned with [`CONTEXT.md`](CONTEXT.md), the PRD (`DataIngest_PRD.docx` / PDF), and the interactive mock [`dataingest-v2.html`](dataingest-v2.html).

**This repo has no deployable `bundle/`:** components only appear in the palette after you copy them into your real coded app and wire **`*.module.ts` + `index.ts`** — see **[`AGENT-INSTRUCTIONS.md`](AGENT-INSTRUCTIONS.md)** if tiles are missing.

## What was implemented (Phase 1 — UI)

Two **standalone view components** (Angular 18, `standalone: true`, `OnPush`), matching the mock layout and design tokens:

| Folder | Registration module | Component id (`type` / `@RxViewComponent` / `selector`) |
|--------|---------------------|--------------------------------------------------------|
| [`data-ingest-admin/`](data-ingest-admin/) | `DataIngestAdminRegistrationModule` | `com-amar-helix-vibe-studio-data-ingest-admin` |
| [`data-ingest-user/`](data-ingest-user/) | `DataIngestUserRegistrationModule` | `com-amar-helix-vibe-studio-data-ingest-user` |

- **Admin:** Dashboard, Import templates, Submissions, Settings; **New import template** modal wizard (4 steps + Step 2 tabs). Uses mock data until `RxRecordInstanceService` / DataPage wiring.
- **User:** Workspace, **New upload** (3 steps), **My history**. Simulated file validation panel after click-to-upload (SheetJS integration can be added when copied into the bundle).

Shared styles: [`data-ingest-shared.scss`](data-ingest-shared.scss). Shared types: [`data-ingest.models.ts`](data-ingest.models.ts).

## Copy into your coded application

1. Copy `data-ingest-admin/`, `data-ingest-user/`, `data-ingest-shared.scss`, and `data-ingest.models.ts` into `libs/<application-name>/src/lib/view-components/` (or your team’s convention — keep `@import '../../data-ingest-shared.scss'` paths valid).
2. Merge `localized-strings.json` from both folders into your bundle’s translation source (e.g. `en.json` / `localized-strings.properties` pipeline).
3. **Import both registration modules** in `libs/<application-name>/src/lib/<application-name>.module.ts` (same module that imports Catalog view, etc.).

   ```typescript
   import { DataIngestAdminRegistrationModule } from './view-components/data-ingest-admin/data-ingest-admin-registration.module';
   import { DataIngestUserRegistrationModule } from './view-components/data-ingest-user/data-ingest-user-registration.module';

   @NgModule({
     imports: [
       // ...CatalogViewRegistrationModule, RuntimeActionsDemoRegistrationModule, etc.
       DataIngestAdminRegistrationModule,
       DataIngestUserRegistrationModule
     ]
   })
   export class YourApplicationModule {}
   ```

4. **`export *` from `libs/<application-name>/src/index.ts`** — **required.** The cookbook states that without this, the component **is not bundled** and will not appear in the palette.

   ```typescript
   export * from './lib/view-components/data-ingest-admin/data-ingest-admin-registration.module';
   export * from './lib/view-components/data-ingest-user/data-ingest-user-registration.module';
   ```

5. **Redeploy** (`mvn clean install -Pdeploy` or your pipeline), then **Workspace → Helix Vibe Studio → Visit deployed application**, open View Designer, **hard-refresh** (`Cmd+Shift+R` / `Ctrl+Shift+R`).

6. Adjust **`com-amar-helix-vibe-studio`** prefixes in registration `type`, `@RxViewComponent({ name })`, and `selector` if your application prefix differs.

7. Create or open views that use these components.

Full troubleshooting: [`AGENT-INSTRUCTIONS.md`](AGENT-INSTRUCTIONS.md).

### Palette icons

| Component        | `icon` (Material) | Meaning        |
|------------------|-------------------|----------------|
| DataIngest — Admin  | `import_export`   | Template / import configuration |
| DataIngest — User   | `cloud_upload`    | File upload       |

If an icon renders blank, the name may be missing from your Helix icon set — try `table` / `file_upload` as fallbacks.

## Next steps (not done here)

- Innovation Studio **record definitions** for templates, submissions, settings (see implementation plan).
- Java **`@Action`** ingestion engine + **`.def`** process; client/server validation with SheetJS + server re-validation.
- Optional: Google Fonts (Geist, DM Mono, Instrument Serif) in `index.html` for pixel-perfect typography.

## References

- [`CONTEXT.md`](CONTEXT.md) — rules, enums, data model sketch.
- [`dataingest-v2.html`](dataingest-v2.html) — UI reference.
- Cookbook: [`cookbook/02-ui-view-components.md`](../../cookbook/02-ui-view-components.md).
