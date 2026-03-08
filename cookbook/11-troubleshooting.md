# Troubleshooting

## Deployment Issues

### DEPLOY_SCHEDULED_ERROR / HTTP 500 When Deploying

**Symptom**: `mvn clean install -Pdeploy` fails with `response status: 500` and `***Operation Error*** DEPLOY_SCHEDULED_ERROR`. The application/server is accessible, but the deploy API fails.

**Troubleshooting steps** (in order):

#### 1. Capture the actual HTTP response body

The Maven plugin may not log the server's error message. Run with debug and look for any response body in the output:

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests -X" 2>&1 | tee deploy.log
```

Search `deploy.log` for `response`, `500`, `body`, `error`, or JSON/XML that might contain the server's error message.

#### 2. Check BMC Helix server logs

If you have access to the Helix instance:

- **Innovation Studio Admin**: Go to **Administration** → **Logs** or **Logger Configuration**
- Enable DEBUG for deployment-related loggers (e.g. `com.bmc.arsys.rx.deployment`, `com.bmc.arsys.rx.application`)
- Reproduce the deploy, then download/export the logs
- Look for stack traces, `PARSE_DEF_IMPORT_STATUS`, `IMPORT_APPLICATION_ERROR`, or HTTP 500 root cause

#### 3. Verify deployment credentials

Ensure the user has **Developer** (or equivalent) role and deployment permissions:

- Log into Helix at the same `webUrl` used in `pom.xml`
- Check **Workspace** → your app → **Deploy** (if visible) — if you can't see deploy options, the user may lack permissions
- Try with a different developer account that has full deployment rights

#### 4. Try manual deployment via UI

To rule out Maven/API issues:

1. Build without deploy: `mvn clean install -DskipTests` (omit `-Pdeploy`)
2. Locate the ZIP: `workspace/helix-vibe-studio/package/target/com.amar.helix-vibe-studio-1.0.0-SNAPSHOT.zip`
3. In BMC Helix: **Workspace** → **Helix Vibe Studio** → **Deploy** or **Import Package** (exact menu depends on your version)
4. Upload the ZIP manually

If manual deployment works, the issue is with the Maven deploy API/configuration. If it also fails, the package or server config is the problem.

#### 5. Isolate package changes

Temporarily revert recent changes to confirm the package itself is valid:

```bash
# Temporarily remove the new component from module and index
# Then: mvn clean install -Pdeploy -DskipTests
```

If deploy succeeds without the new component, the new code (e.g. a view component) may be causing validation/import failures on the server. Add components back incrementally.

#### 6. Check package contents

Inspect what’s being deployed:

```bash
unzip -l workspace/helix-vibe-studio/package/target/com.amar.helix-vibe-studio-1.0.0-SNAPSHOT.zip
```

Verify: JAR, manifest, view/record `.def` files. Look for malformed or duplicate definitions.

#### 7. Version / environment compatibility

- Ensure `rx-sdk.version` in the parent POM matches the Helix platform version (e.g. 25.4.00 for IS 25.4)
- If the server is older or newer, the deploy API or package format may be incompatible

#### 8. Export before re-deploy (avoid duplicate config)

If you’ve deployed before and the server has existing definitions:

```bash
# Export current state from server first
mvn install -Pexport -DskipTests

# Then deploy
mvn clean install -Pdeploy -DskipTests
```

This can avoid duplicate or conflicting configuration records that trigger 500 during import.

---

## Build Issues

### Build Fails with Exit Code 137 (Killed)
**Cause**: Out of memory — the Angular build needs several GB of RAM and the container does not have enough.

**Fix A — Increase container memory**:
- **Docker Desktop**: Settings → Resources → Memory → set to **16 GB** (minimum 8 GB), then restart Docker Desktop
- **Podman**: `podman machine stop` → `podman machine set --memory 16384` → `podman machine start`

**Fix B — Build UI on host (no container memory increase needed)**:
1. Ensure Node.js 20+ and Yarn are installed on your Mac/Linux
2. Run: `./build-ui-on-host.sh`
3. Then run Maven in the container with `-PusePrebuiltUI`:
   ```bash
   docker exec bmc-helix-innovation-studio bash -c \
     "cd /workspace/helix-vibe-studio && mvn clean install -Pdeploy -DskipTests -PusePrebuiltUI"
   ```
   (Use `podman` instead of `docker` if applicable)

## AR System Error Codes

| Error | Meaning | Fix |
|-------|---------|-----|
| ERROR 307 | Required field blank or attachment before record | Set Status (7) + Description (8); persist attachments after record |
| ERROR 930 | Action type not found on server | Deploy JAR first, then .def files separately |
| ERROR 8790 | Transaction not started | Add `@RxDefinitionTransactional` on REST endpoint |
| ERROR 12004 | Transaction conflict | Remove `@RxDefinitionTransactional` from internal service (Rule already has one) |
| ERROR 12095 | Invalid date format | Use epoch millis (`System.currentTimeMillis()`), not ISO 8601 |

## Frontend Issues

### Angular Template: `Incomplete block` Error
**Cause**: Unescaped `@` in HTML (Angular 17+ treats `@` as control flow)
**Fix**: Replace `@` with `&#64;` in templates

### Unknown component: com-amar-helix-vibe-studio-...
**Cause**: The application's JavaScript module didn't load, so components were never registered. The shell knows the view uses the component (from the manifest) but can't find it in the registry.

**Diagnostics** (open DevTools → Network + Console before loading the view):
1. **Network tab**: Filter for `helix-vibe-studio` or `com-amar`. Look for:
   - `com-amar-helix-vibe-studio-remote-entry.js` — should return 200
   - `libs_com-amar-helix-vibe-studio_src_index_ts_*.js` — should return 200
   - Any 404 → assets aren't being served (platform config or deployment issue)
2. **Console**: Look for Module Federation errors, `Failed to fetch`, or `Loading chunk failed`
3. **Try**: Workspace → Helix Vibe Studio → **Visit deployed application** first (this loads the app). Then open Pizza Demo from within that context.

**Fixes**:
- If 404 on scripts: The platform may not serve bundle assets correctly. Check with your BMC/Helix admin — custom Angular apps may require full Innovation Studio, not all Helix One demo environments.
- If CORS/network errors: Platform proxy or CDN config may block app scripts.
- Re-deploy and hard refresh (`Cmd+Shift+R`), then clear all site data and log in again.

### Component Not in View Designer Palette / No "Helix Vibe Studio" Group
**Causes**:
1. Missing export in `index.ts`
2. Missing import in main module
3. Container bind mount stale
4. **Wrong application context** — components load only when editing a view that belongs to your application

**Fix**:
1. Verify export and import (see above), then check: `grep -c '<type-string>' dist/apps/shell/libs_*_src_index_ts*.js`
2. **Use the correct application context**: Open View Designer to edit a view that belongs to **Helix Vibe Studio**:
   - Go to **Workspace** → find **Helix Vibe Studio** → **Visit deployed application**
   - Or: **Record Definitions** / **View Definitions** → open view `com.amar.helix-vibe-studio:Pizza Demo` for editing
   - When the view's application is your bundle, the palette loads your components under "Helix Vibe Studio" group
3. Hard refresh (`Cmd+Shift+R`), clear cache, logout/login

### `ɵmod undefined` in Console
**Cause**: AOT compilation didn't process registration module
**Fix sequence**:
1. Ensure static metadata in decorators (no function calls)
2. Class name matches import
3. Both imported in `@NgModule` AND exported in `index.ts`

### Component in Palette but Drag Fails
**Cause**: Registration module constructor error
**Fix**: Check browser console for specific error

### Design Preview Blank
**Cause**: Design template error or missing `standalone: true`
**Fix**: Check design `.html` and component decorator

### Property Inspector Empty
**Cause**: `setInspectorConfig` not called or malformed config
**Fix**: Verify design model constructor calls `sandbox.updateInspectorConfig(...)`

### Runtime Blank Box
**Cause**: Runtime component throws on init
**Fix**: Check console; verify `super.ngOnInit()` is called

### "Set Property" Has No Effect
**Cause**: Missing `notifyPropertyChanged` call
**Fix**: Add `notifyPropertyChanged(propertyPath, propertyValue)` in setProperty switch case

### 405 Method Not Allowed
**Cause**: Using GET instead of POST for DataPage
**Fix**: Use `POST /api/rx/application/datapage`

### Old Version After Deploy
**Cause**: Browser cache
**Fix**: Hard refresh (`Cmd+Shift+R`) + logout/login

### View Save Fails with Validation Error
**Cause**: `validateStandardProps` not called or custom validation too strict
**Fix**: Check `validate()` method in design model

### 404 on PUT viewdefinition (View Save Fails)
**Symptom**: Saving a view in View Designer returns `404 Not Found` for `PUT /api/rx/application/view/viewdefinition/com.amar.helix-vibe-studio:your-view-name`

**Cause**: The view definition does not exist on the server. The designer sends PUT (update) to save changes, but the view was never deployed — there is no `.def` file in the package.

**Fix**:
1. Create the view definition file: `package/src/main/definitions/db/view/<view-name>.def` (e.g. `test-qr-code.def` for view `com.amar.helix-vibe-studio:test-qr-code`)
2. Use the template format from `.cursor/_instructions/UI/Template/create-view-definition.md` or copy from an existing view (e.g. `QR Demo.def`)
3. Deploy: `mvn clean install -Pdeploy -DskipTests`
4. After deployment, the view exists on the server; the designer can then edit and save (PUT will succeed)

**Alternative**: Edit an existing view (e.g. `Pizza Demo` or `QR Demo`) instead of creating a new one — existing views can be saved.

## Backend Issues

### Bind Mount Desync (Most Common)
**Symptom**: Build succeeds, deploys, but new action doesn't appear
**Cause**: Docker Desktop VirtioFS/gRPC-FUSE (or Podman machine on macOS) silently stops syncing

**Diagnosis** (replace `docker` with `podman` if applicable):
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "ls -la /workspace/<your-project>/bundle/src/main/java/com/example/bundle/MyApplication.java"
```

**Fix**: `docker cp` (or `podman cp`) all changed files into container

### AspectJ Weaving Not Applied
**Symptom**: Class in JAR but no `$AjcClosure1` companion
**Fix**: `mvn clean install` (ensure clean build)

### OSGi ClassNotFoundException
**Symptom**: Runtime `ClassNotFoundException` for third-party library classes
**Fix**: Add `Embed-Transitive=true` to `maven-bundle-plugin`

### OSGI Bundle Activation Failure
**Symptom**: No actions (old or new) appear
**Cause**: Exception during `MyApplication.register()`
**Fix**: Ensure all classes compile, correct imports, no missing dependencies

### Processing Stuck at 0%
**Cause**: Relying on Rules to fire repeatedly for batch processing
**Fix**: Rules fire once per event — inline the processing loop in the service

## AI-Generated Code Patterns That Fail on IS

| Pattern | Why It Fails | Correct Approach |
|---------|-------------|-----------------|
| `Instant.now().toString()` | IS uses epoch millis | `String.valueOf(System.currentTimeMillis())` |
| `@RxDefinitionTransactional` on all services | Rules already have transactions | Only on REST endpoints |
| `new ServiceClass()` for delegation | Bypasses DI, loses transaction context | Inject via constructor or `@Inject` |
| FileAttachment as REQUIRED field | Attachment persisted after record | Make field optional, validate in code |
| `console.log()` | Not scalable | Use `RxLogService` |
| `*ngIf` / `*ngFor` | Deprecated syntax | Use `@if` / `@for` |
| `FormControl('value')` with `adapt-rx-select` | `writeValue` clears non-arrays | `FormControl(['value'])` — always use arrays |
| `<ng-template adaptTableCellTemplate="x">` | Directive doesn't exist in adapt-table | `ColumnConfig.rowLevelActionsConfig` or `.cellTemplate` |
| `[variant]="'primary'"` on `adapt-button` | Input doesn't exist | `[btn-type]="'primary'"` |
| `<i class="d-icon-add">` inside button | Wrong tag and class pattern | `<span class="d-icon-left-plus">` |
| Parallel `fetchDefinition()` + `loadData()` | Data query uses stale/fallback field IDs | Chain: call `loadData()` inside definition callback |
| Guessing Adapt directive/input names | Frequently wrong, silently ignored | Always verify from `.d.ts` in `node_modules/@bmc-ux/` |

## Manifest vs JS Bundle Mismatch

The manifest can list a component even when it's NOT in the compiled JS. Always verify:

```bash
# What the manifest says
cat dist/apps/shell/<app-name>.json | python3 -m json.tool

# What's actually compiled
grep -o '<app-name>-<app-name>-[a-z-]*' dist/apps/shell/libs_*_src_index_ts*.js | sort -u
```

If component is in manifest but not in grep output, the container has stale `index.ts` or main module.
