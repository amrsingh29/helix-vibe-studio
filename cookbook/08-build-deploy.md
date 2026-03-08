# Build and Deploy

## Container Environment

All build/deploy commands run inside the container (Docker or Podman):

```bash
# Execute command (replace "docker" with "podman" if using Podman)
docker exec bmc-helix-innovation-studio bash -c "<command>"

# Interactive shell
docker exec -it bmc-helix-innovation-studio bash
```

> **Podman users**: Every `docker exec` command in this page works identically with `podman exec`. The container name `bmc-helix-innovation-studio` is the same for both engines.

## Build Commands

### Frontend Only
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && npm run build"
```

### Full Build (Frontend + Backend)
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -DskipTests"
```

### Backend-Only (Skip Frontend)
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests -PskipUICodeGeneration"
```

### Build and Deploy
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"
```

## Build Output

| Output | Location |
|--------|----------|
| Frontend | `bundle/src/main/webapp/dist/apps/shell/` |
| JAR | `bundle/target/<bundleId>-1.0.0-SNAPSHOT.jar` |
| Package ZIP | `package/target/<bundleId>-1.0.0-SNAPSHOT.zip` |
| Manifest | `dist/apps/shell/<application-name>.json` |

## Deployment Configuration

**File**: Root `pom.xml`

```xml
<properties>
  <developerUserName>Demo</developerUserName>
  <developerPassword>password</developerPassword>
  <webUrl>https://your-server.com</webUrl>
</properties>
```

## Development Server

```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check"
```

Access: `http://localhost:4200/helix`

## Post-Build Verification

### Frontend Build
- [ ] Exit code 0, no `error TS****` or `error NG****`
- [ ] `dist/apps/shell/` directory populated
- [ ] Manifest JSON lists your component type strings

### Manifest Verification
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cat /workspace/<your-project>/bundle/src/main/webapp/dist/apps/shell/<application-name>.json | python3 -m json.tool"
```

### Compiled JS Verification (Critical)
```bash
# Verify component exists in actual JS bundles (not just manifest)
docker exec bmc-helix-innovation-studio bash -c \
  "grep -c '<component-type-string>' /workspace/<your-project>/bundle/src/main/webapp/dist/apps/shell/libs_<application-name>_src_index_ts*.js"
```

### Java JAR Verification
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "jar tf /workspace/<your-project>/bundle/target/<bundleId>-1.0.0-SNAPSHOT.jar | grep 'bundle/.*\.class' | sort"
```

Look for `$AjcClosure1` companion classes — confirms AspectJ weaving for `@Action`.

### Maven Build
- [ ] `BUILD SUCCESS`
- [ ] JAR generated
- [ ] Package ZIP generated

## Post-Deployment Verification

- [ ] `Final Status:Deployed` in Maven output
- [ ] No `401 Unauthorized` (check credentials)
- [ ] No `Connection refused` (check `webUrl`)

### Browser Cache Clearing (Mandatory)
- Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows/Linux)
- Or: DevTools open → right-click refresh → "Empty Cache and Hard Reload"
- Worst case: logout → clear all browser data for domain → login again

### View Designer Check
- [ ] Component in palette under correct group
- [ ] Drag onto canvas without errors
- [ ] Design preview renders
- [ ] Property inspector shows all controls
- [ ] Save view without validation errors

### Runtime Check
- [ ] Component renders (no blank box)
- [ ] No console errors
- [ ] API calls work (check Network tab)
- [ ] Interactive elements respond

## Bind Mount Sync (Critical)

Docker Desktop (and Podman machine on macOS) bind mounts can silently stop syncing host file changes.

### Verify Files in Container
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "cat /workspace/<your-project>/bundle/src/main/webapp/libs/<application-name>/src/index.ts"

docker exec bmc-helix-innovation-studio bash -c \
  "cat /workspace/<your-project>/bundle/src/main/webapp/libs/<application-name>/src/lib/<application-name>.module.ts"
```

### Force Sync with docker cp
```bash
docker cp /path/on/host/MyFile.java \
  bmc-helix-innovation-studio:/workspace/<your-project>/bundle/src/main/java/com/example/bundle/
```

If build output chunk sizes are the SAME as previous build, new code was NOT compiled — container has stale files.

## Build Cycle Awareness

Each build-deploy cycle takes ~3 minutes. Plan accordingly:
- Batch multiple fixes per cycle
- Use `mvn clean install -DskipTests` (no `-Pdeploy`) for compilation-only checks
- Only deploy when confident the fix is correct
- Backend-only changes: add `-PskipUICodeGeneration` to save ~2 minutes

## Incremental Development Strategy

1. Build and deploy the FIRST component before generating others
2. Resolve all platform quirks on one component
3. Only after first component works, generate remaining using the proven pattern
4. Deploy early, deploy often
5. Test each new service individually
