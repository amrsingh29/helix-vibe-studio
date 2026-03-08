# BMC Helix Innovation Studio — Agent Instructions

You are working in a BMC Helix Innovation Studio coded application development environment. This project uses Docker **or Podman** for builds and deploys Angular 18 frontend components and Java 17 backend services to a BMC Helix platform instance. All `docker` commands work identically with `podman` — substitute the binary name as needed.

## Before Writing Any Code

1. Read `cookbook/01-getting-started.md` for project structure and naming conventions
2. Read the specific cookbook section for the artifact you're building (see table in `.github/copilot-instructions.md`)
3. Read `cookbook/09-best-practices.md` for coding standards
4. Follow `.cursor/rules/generation-context-comments.mdc` — every created or substantially modified file **must** carry a `@generated` context header so future editors retain full traceability

## Key Constraints

### Angular / TypeScript (Frontend)
- All components must use `standalone: true` and `ChangeDetectionStrategy.OnPush`
- Use `@if`/`@for`/`@switch` control flow (NOT `*ngIf`/`*ngFor`)
- Escape `@` as `&#64;` in HTML templates (Angular 17+ treats `@` as control flow syntax)
- Use `RxLogService` for logging, not `console.log`
- Use `takeUntil(this.destroyed$)` for all RxJS subscriptions
- Localize all strings via `localized-strings.json` + `TranslateService`
- Use BMC Adapt components (`@bmc-ux/adapt-angular`) for UI, not raw HTML controls
- Component type string must be identical in registration `type`, `@RxViewComponent({ name })`, and `selector`

### Java (Backend)
- Dates: ALWAYS epoch millis (`System.currentTimeMillis()`), NEVER ISO 8601
- `@RxDefinitionTransactional` ONLY on REST endpoints, NOT on services called by Rules
- Record creation: ALWAYS set Status (field 7) and Description (field 8)
- Attachments: Persist AFTER parent record creation
- No threads, no file I/O, no static state
- Register all services in `MyApplication.java` before `registerStaticWebResource()`

### Process Definitions (.def)
- Every definition line prefixed with `   definition     : ` (3 spaces, "definition", 5 spaces, colon, space)
- `actionTypeName` must exactly match `<bundleId>:<@Action name>` from Java
- Deploy JAR before .def files to avoid ERROR 930

## Build Commands

All commands run inside the container `bmc-helix-innovation-studio`. Replace `docker` with `podman` if using Podman:

```bash
# Full build + deploy
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests"

# Backend-only build (faster)
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project> && mvn clean install -Pdeploy -DskipTests -PskipUICodeGeneration"
```

## After Implementation

Run through `cookbook/10-checklists.md` to verify completeness before deploying.

## Documentation Index

- Full cookbook: `cookbook/` (13 sections)
- Detailed deep-dive docs: `.cursor/_instructions/`
- Single-file context: `llms-full.md`
- Machine-readable index: `llms.txt`
