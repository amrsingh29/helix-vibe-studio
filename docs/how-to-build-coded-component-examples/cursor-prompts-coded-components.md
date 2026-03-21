<!--
  @generated
  @context User requested Cursor-ready prompts for every Helix coded artifact; added §1b expression-filtered record list prompt; cross-link to composite examples.
  @decisions Single reference doc; consistent prompt template; aligns with cookbook artifact list; footer links to composite-coded-examples.md for multi-artifact flows.
  @references cookbook/01-getting-started.md, AGENTS.md, .cursor/rules/generation-context-comments.mdc
  @modified 2026-03-20
-->

# Cursor prompts for BMC Helix coded components

Use this document to **learn by building**: each section has a **problem**, **what the artifact does**, and a **copy-paste prompt** for Cursor.

## How to use these prompts well

1. **Open the right folder** in Cursor (your Helix coded-application repo).
2. Start a **Composer** or **Agent** turn, paste **one** prompt, then add **`@`** references so the model loads ground truth:
   - `@cookbook/02-ui-view-components.md` (or the exact file named in the prompt)
   - `@AGENTS.md`
   - `@.cursor/rules/generation-context-comments.mdc`
3. **One artifact per conversation** when possible — fewer merge conflicts and clearer diffs.
4. After code is generated, run through **`cookbook/10-checklists.md`** and build per **`cookbook/08-build-deploy.md`**.

### Prompt pattern (why these blocks look this way)

Each prompt follows a compact structure that tends to work well in Cursor:

| Section | Purpose |
|---------|---------|
| **Role + stack** | Anchors the model to Helix, Angular 18, Java 17 |
| **Read first** | Forces cookbook / instructions before edits |
| **Problem / goal** | User intent in one place |
| **Requirements** | Testable behavior |
| **Constraints** | Non-negotiables from `AGENTS.md` / cookbook |
| **Deliverables** | Files and registrations to touch |
| **Acceptance criteria** | How you know you’re done |

---

## 1. Standalone view component

### Problem

Authors need a **reusable canvas widget** (not tied to a single record field)—for example a small dashboard tile that shows live metrics and refreshes on demand.

### What it will do

- Appears in **View Designer** as a draggable component with a **property inspector** (title, refresh interval, optional hidden flag).
- At **runtime**, renders Adapt-based UI, subscribes to `config` as an `Observable`, uses **`takeUntil(this.destroyed$)`**, and exposes an optional **`api.setProperty`** if properties must be updated from a **Set property** view action.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **standalone view component** in this repo.

Read first:
- @cookbook/02-ui-view-components.md
- @cookbook/09-best-practices.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc
- Example (patterns only): @.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/

Problem: We need a standalone view component named `ops-metrics-tile` that shows a title, a numeric “open incidents” count (mocked static number for now), and an Adapt button “Refresh” that increments a local refresh counter and logs via RxLogService.

Requirements:
- standalone: true, ChangeDetectionStrategy.OnPush, @if/@for (not *ngIf/*ngFor).
- Component type string must match in: registration module `type`, @RxViewComponent name, and component `selector` (use this project’s application-name prefix convention from angular.json / cookbook).
- Register the component in a registration module; export that module from index.ts and import it in the main application module (follow existing project patterns).
- All user-visible strings in localized-strings.json + TranslateService; no hardcoded UI strings.
- Use RxLogService instead of console.log.
- Add @generated file headers on every new or substantially changed file per generation-context-comments rule.

Deliverables:
- view-components/ops-metrics-tile/ with types, registration, design (component, html, scss, model, design types), runtime (component, html, scss).
- Wire registration into the app module chain exactly as other components in this project do.

Acceptance: Project still builds; component registers; no console.log; localization keys namespaced by bundleId/view-components/ops-metrics-tile; headers present.
```

---

## 1b. Expression-filtered record list (standalone)

### Problem

Authors need a **simple list** fed by a **Records** expression, but rows must be **filtered** so a status-like field equals a value configured with the **expression picker** — e.g. show only tasks where **Status** is **`Active`**, or where status matches **another record field** on the view.

### What it will do

- **Records** property with `enableExpressionEvaluation: true` and **Expression** control in the inspector (array of objects).
- **Match status value** with `enableExpressionEvaluation: true` — authors enter `'Active'` or bind a contextual expression; runtime receives the **evaluated** value on `config`.
- **Status field key** / **title field key** as plain text (which keys exist on each row).
- Runtime compares normalized strings and re-filters when `config` or **Set property** updates `records` / `matchStatusValue`.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **standalone view component** that filters a record array using an expression-evaluated "match" value (Status = Active pattern).

Read first:
- @cookbook/02-ui-view-components.md
- @cookbook/09-best-practices.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc
- Reference implementation to mirror or adapt: @my-components/expression-filtered-record-list/
- Concept doc: @how-to-build-coded-component-examples/expression-filtered-record-list.md

Problem: Add (or port) component `expression-filtered-record-list` with:
- Registration properties: `name` (expression-evaluatable per RX patterns), `recordDefinitionName` (definition picker, not expression), `records` (enableExpressionEvaluation: true), `statusFieldKey` (plain), `matchStatusValue` (enableExpressionEvaluation: true), `titleFieldKey` (plain), plus RX_STANDARD_PROPS_DESC.
- Design model: ExpressionFormControlComponent for `records` and `matchStatusValue` with tooltips; TextFormControl for keys; RxDefinitionPicker for record definition; warnings if records empty or status key missing.
- Runtime: OnPush, @if/@for, subscribe to config with takeUntil(destroyed$). Coerce records from array or { data: [] }. Filter: if match value (after trim+lowercase) is empty string, show all rows; else keep rows where row[statusFieldKey] normalized equals match normalized. Expose api.setProperty for hidden, records, statusFieldKey, matchStatusValue, titleFieldKey, recordDefinitionName, name.
- Simple template: meta line (filter on/off), count, list of title + status per row, empty state.

Requirements:
- Type/selector/@RxViewComponent name identical and prefixed with this project’s application id.
- Prefer TranslateService + localized-strings for UI strings if this is a production app path; if copying the sample verbatim, note localization TODO in README only.
- RxLogService for unexpected issues if you add logging; no console.log.
- @generated headers on all files.

Deliverables:
- Full view-components/expression-filtered-record-list/ tree (types, registration, design/*, runtime/*) wired into the app module and index exports.

Acceptance: Builds; inspector shows expression editors for Records and Match status value; filtering behavior matches spec; document View Designer example (literal 'Active' vs record-bound expression) in README.
```

---

## 2. Record editor field view component

### Problem

A record has a field that the **stock record editor** cannot represent well—for example a **star rating** or **color + label** pair stored in one character field as JSON.

### What it will do

- Renders **inside the record editor** for a mapped field.
- Reads/writes the field value through the platform’s record editor integration (patterns in cookbook).
- Still has **design** and **runtime** halves plus registration, similar to a standalone component but with **field-specific** APIs.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **record editor field view component**.

Read first:
- @cookbook/02-ui-view-components.md (Record Editor Field section)
- @cookbook/09-best-practices.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc
- @docs/request-view-component-with-record-definition.md (for field/record assumptions; still under docs/)

Problem: Add a record editor field component `satisfaction-stars` that edits a single integer field (1–5) using an Adapt rating or star control. Empty value should be treated as null/undefined in the model. Validation: block save or surface error state if value is outside 1–5 (follow patterns used in this repo for field validation).

Requirements:
- standalone: true, OnPush, @if/@for only.
- Proper registration as a **record editor field** view component (not standalone) per cookbook.
- Localized strings + TranslateService; RxLogService for logging.
- @generated headers on new/changed files.

Deliverables:
- Full folder under view-components/satisfaction-stars/ per cookbook file layout.
- Registration module + main module imports/exports consistent with this project.

Acceptance: Follows record-field lifecycle from cookbook; no *ngIf; strings localized; builds cleanly.
```

---

## 3. View action

### Problem

A button should **run logic** when clicked: compute values, call the platform, show a notification, and optionally pass outputs to the **next** action in the chain.

### What it will do

- Registered **view action** with parameters (e.g. price, VAT rate) and outputs (e.g. fullPrice).
- `execute` returns Observables; uses **`forkJoin`** (or equivalent) for output map when multiple outputs exist.
- Errors stop the action chain.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **view action**.

Read first:
- @cookbook/03-ui-view-actions.md
- @cookbook/04-ui-services-and-apis.md
- @cookbook/09-best-practices.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc
- Example: @.cursor/_instructions/UI/ObjectTypes/Examples/ViewAction/calculate-vat/

Problem: Create view action `format-currency` with parameters: amount (number), currencyCode (string). Output: formatted (string) using Intl.NumberFormat in the browser locale. On success, show RxNotificationService success toast with the formatted string. On invalid amount (NaN), return Observable error to stop the chain.

Requirements:
- Register with RxViewActionRegistryService including design manager + design model per cookbook.
- Register module in the main Angular module like other actions in this repo.
- Localized notification messages via TranslateService keys.
- @generated headers.

Deliverables:
- actions/format-currency/ with service, types, design types, design model, design manager, module.

Acceptance: execute returns Observable; outputs wired for chaining; no console.log; registration complete.
```

---

## 4. Angular service (shared UI logic)

### Problem

Multiple view components and actions repeat the same **HTTP + mapping** or **DataPage query** code. You want one injectable to own that behavior.

### What it will do

- Injectable service (provided in appropriate module) with clear API (methods returning Observables).
- Uses `HttpClient` with required Helix headers where applicable, or wraps `RxRecordInstanceService` / DataPage patterns per cookbook.

### Cursor prompt

```text
You are adding a shared **Angular service** to a BMC Helix Innovation Studio coded application.

Read first:
- @cookbook/04-ui-services-and-apis.md
- @cookbook/09-best-practices.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Problem: Create `IncidentQueryService` in the Angular library that exposes `searchOpenIncidents$(query: string): Observable<{ id: string; title: string }[]>`.

For this task, implement the method using a **stub** that returns `of([...])` with 2–3 fake rows after a 300ms delay (simulate network), but structure the code so we can later replace the body with a real DataPage POST per cookbook without changing consumers.

Requirements:
- Injectable provided in an NgModule that is already imported by the app (or create a small CoreModule pattern only if this repo already uses one—match existing style).
- Use RxLogService inside the service for debug logs, not console.log.
- Subscriptions in components must still use takeUntil(destroyed$) at call sites (document this in a one-line comment on the public method).
- @generated header on new files.

Deliverables:
- Service file + module/provider wiring consistent with this project.

Acceptance: Injectable can be injected into a view component constructor in this project; stub observable works; logging via RxLogService.
```

---

## 5. Java process activity (`@Action`)

### Problem

A **BPMN process** (or rule) must run **server-side business logic**: validate input, call `RecordService`, return a structured payload.

### What it will do

- Java class implementing `Service` with `@Action(name = "...")` method.
- Returns a **response DTO** with `@JsonProperty` fields for process output mapping.
- Registered in `MyApplication.java` **before** `registerStaticWebResource()`.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **Java process activity** (@Action).

Read first:
- @cookbook/06-java-backend.md
- @cookbook/07-process-definitions.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Problem: Add `TicketLookupActivity` with @Action name `lookupTicket` and input parameter ticketId (String, required). It returns a payload { success, summary, errorMessage } where summary is a stub string "Ticket: " + ticketId for now. Log errors with ServiceLocator.getLogger().

Constraints:
- Do NOT put @RxDefinitionTransactional on this @Action if it is only called from processes/rules (cookbook/AGENTS: transactional only on REST endpoints).
- Use epoch millis if you touch any date fields in future extensions—not needed for this stub.
- No threads, no file I/O, no static mutable state.
- Register the service in MyApplication.register() before registerStaticWebResource(); do not remove existing registrations.

Deliverables:
- TicketLookupActivity.java + TicketLookupResponsePayload.java (or equivalent names) in the bundle Java package.
- MyApplication.java registration line.

Acceptance: Compiles; action name stable; response DTO suitable for process outputMap later; logging on failure paths.
```

---

## 6. Java REST API (`RestfulResource`)

### Problem

External systems or your **Angular** code need a **custom JSON endpoint** under your bundle (e.g. `/api/<bundleId>/...`).

### What it will do

- JAX-RS resource annotated with `@Path`, methods with `@GET`/`@POST`, etc.
- **`@RxDefinitionTransactional`** on REST methods as appropriate (readOnly for GET).
- **`@AccessControlledMethod`** for auth/licensing.
- Registered in `MyApplication.java`.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **Java REST API** (RestfulResource).

Read first:
- @cookbook/06-java-backend.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Problem: Add `HealthRestApi` with @Path("health") and GET `/ping` returning JSON { "status": "ok", "bundle": "<derive bundle id constant or comment placeholder>" }.

Requirements:
- @RxDefinitionTransactional(readOnly = true) on the GET handler.
- @AccessControlledMethod with ValidUser + Application licensing (match cookbook template).
- registerService in MyApplication before registerStaticWebResource().
- SLF4J/ServiceLocator logging for unexpected errors; never swallow exceptions silently.

Deliverables:
- HealthRestApi.java (+ small response DTO if needed)
- MyApplication registration

Acceptance: URL shape matches /api/<bundleId>/health/ping per project; compiles; security annotations present.
```

---

## 7. Java command (fire-and-forget)

### Problem

The platform must trigger a **side effect** where no meaningful response body is needed—audit flag, cache invalidation, enqueue-style work—expressed as a **command** rather than a full process output.

### What it will do

- Implements the command pattern expected by the SDK (see deep-dive doc).
- Returns appropriate status; registered in `MyApplication.java`.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **Java Command** (fire-and-forget style).

Read first:
- @cookbook/06-java-backend.md (Command section)
- @.cursor/_instructions/Java/ObjectTypes/command.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Problem: Add command `PurgeBundleCacheCommand` that logs an INFO message "Cache purge requested" via ServiceLocator.getLogger() and returns success. Accept a single string parameter `reason` (required) for the log line.

Constraints:
- No file I/O, no threads; keep logic trivial but production-safe.
- Register in MyApplication.java before registerStaticWebResource().

Deliverables:
- Command Java class + registration.

Acceptance: Matches command.md patterns for this SDK version; compiles; reason appears in logs.
```

---

## 8. Java DataPageQuery (custom data source)

### Problem

A grid or DataPage consumer needs rows from a **custom query** (aggregations, joins, external system facade) instead of a plain record query.

### What it will do

- Implements DataPageQuery per SDK.
- Returns paged row data in the shape DataPage expects.
- Registered in `MyApplication.java`.

### Cursor prompt

```text
You are implementing a BMC Helix Innovation Studio **DataPageQuery** custom data source.

Read first:
- @cookbook/06-java-backend.md (DataPageQuery section)
- @.cursor/_instructions/Java/ObjectTypes/datapagequery.md
- @AGENTS.md
- @.cursor/rules/generation-context-comments.mdc

Problem: Add `OpenTicketsDataPageQuery` that returns a static page of 5 fake ticket rows { id, title, priority } for demonstration, with correct pagination metadata (total count = 5). Use clear TODO comments where real RecordService queries would go later.

Constraints:
- Stateless; no static caches; use CacheService only if cookbook warrants it for this pattern (default: do not add caching for the stub).
- Register in MyApplication.java before registerStaticWebResource().

Deliverables:
- DataPageQuery implementation + any DTOs + registration.

Acceptance: Follows datapagequery.md structure; compiles; page size honored in stub logic.
```

---

## 9. Process definition (`.def`)

### Problem

You need a **callable BPMN process** on the server that invokes your Java `@Action` with input/output mapping.

### What it will do

- `.def` file under `package/src/main/definitions/db/process/`.
- **Service task** with `actionTypeName` = `<bundleId>:<@Action name>`.
- Correct `inputMap` / `outputMap` expressions; unique `rx-` GUIDs; lines prefixed with `   definition     : `.

### Cursor prompt

```text
You are authoring a BMC Helix Innovation Studio **process definition** .def file.

Read first:
- @cookbook/07-process-definitions.md
- @.cursor/_instructions/Java/Template/create-process-definition.md (if present)
- The Java @Action class you are wiring (user will @ mention it)

Problem: Create process `lookupTicketProcess` that calls the existing @Action `lookupTicket` on bundleId from pom.xml. Map input ticketId from process start to the action parameter with the exact @ActionParameter name. Map output fields success, summary, errorMessage to process outputs per cookbook field ID rules.

Requirements:
- Pattern B: Start → ServiceTask → End with synchronous true if appropriate.
- Every definition line uses the required `   definition     : ` prefix.
- Layout cells use JointJS rules from cookbook (GUIDs without rx- prefix in layout).
- Document in comments at top of file: deploy JAR before .def to avoid ERROR 930.

Deliverables:
- package/src/main/definitions/db/process/lookupTicketProcess.def

Acceptance: actionTypeName matches Java; inputMap assignTarget matches @ActionParameter names; outputMap expressions use activityResults path correctly.
```

---

## 10. View definition (`.def`)

### Problem

You need a **saved Innovation Studio view** that composes platform components and your **custom view components** with layout and bindings.

### What it will do

- View metadata in `package/src/main/definitions/db/view/` (path per your project).
- References component **type** strings and view actions consistent with registration.

### Cursor prompt

```text
You are authoring a BMC Helix Innovation Studio **view definition** .def file.

Read first:
- @.cursor/_instructions/UI/Template/create-view-definition.md
- @cookbook/01-getting-started.md (component type strings, bundleId)
- @cookbook/02-ui-view-components.md

Problem: Create a simple view definition "Ticket Console" that contains:
- A header text (localized via view definition capabilities as per template)
- One instance of our custom standalone component type `<paste exact registered type string>` (placeholder if unknown)
- A button bound to view action `<paste exact view action registration name>` that passes a static ticketId for demo

Requirements:
- Follow create-view-definition.md JSON/def structure exactly.
- Use only component types and action names that exist or will exist in this bundle; list assumptions at top of chat if placeholders are used.

Deliverables:
- package/src/main/definitions/db/view/ticket-console.def (name aligned with project conventions)

Acceptance: Valid per template; type strings match Angular registration; can be deployed with the bundle.
```

---

## 11. Record definition (`.def`)

### Problem

The app needs a **structured record type** (fields, permissions, lifecycle) stored as metadata—your UI and Java will read/write instances of this definition.

### What it will do

- Record schema in `package/src/main/definitions/db/record/`.
- Field IDs follow platform rules (custom fields from 536870913 upward, standard fields 1/7/8/379 as applicable).

### Cursor prompt

```text
You are authoring a BMC Helix Innovation Studio **record definition** .def file.

Read first:
- @cookbook/01-getting-started.md (record naming bundleId:Name)
- @.cursor/_instructions/UI/Services/GettingRecordDefinition.md
- @cookbook/09-best-practices.md (record field guidance)

Problem: Create record definition `com.<yourBundleId>:Demo Ticket` with fields:
- Title (character, required)
- Priority (integer, optional)
- Details (character large optional)
- Status uses standard platform status field conventions as applicable to this def format

Requirements:
- Name includes correct bundleId prefix matching pom.xml groupId.artifactId.
- Assign unique field IDs for custom fields starting at 536870913 incrementing.
- Do not mark FileAttachment fields REQUIRED (best practices).
- Follow the exact .def line/format conventions used by other record defs in this repo—inspect an existing file first.

Deliverables:
- package/src/main/definitions/db/record/demo-ticket.def (filename aligned with repo conventions)

Acceptance: Consistent with sibling .def files in the repo; deploys; no duplicate field IDs.
```

---

## Quick reference — all coded artifacts

| # | Artifact | Primary cookbook |
|---|----------|-------------------|
| 1 | Standalone view component | [02-ui-view-components.md](../../cookbook/02-ui-view-components.md) |
| 1b | Expression-filtered record list (sample + prompt) | [expression-filtered-record-list.md](./expression-filtered-record-list.md) |
| 2 | Record editor field view component | [02-ui-view-components.md](../../cookbook/02-ui-view-components.md) |
| 3 | View action | [03-ui-view-actions.md](../../cookbook/03-ui-view-actions.md) |
| 4 | Angular service | [04-ui-services-and-apis.md](../../cookbook/04-ui-services-and-apis.md) |
| 5 | Java process activity | [06-java-backend.md](../../cookbook/06-java-backend.md) |
| 6 | Java REST API | [06-java-backend.md](../../cookbook/06-java-backend.md) |
| 7 | Java command | [06-java-backend.md](../../cookbook/06-java-backend.md) + `command.md` |
| 8 | Java DataPageQuery | [06-java-backend.md](../../cookbook/06-java-backend.md) + `datapagequery.md` |
| 9 | Process definition | [07-process-definitions.md](../../cookbook/07-process-definitions.md) |
| 10 | View definition | `create-view-definition.md` |
| 11 | Record definition | `GettingRecordDefinition.md` + repo `.def` examples |

For orientation and diagrams, see [helix-coded-apps-tutorial.md](./helix-coded-apps-tutorial.md).

For **multi-artifact** scenarios (view + action + REST + record, process launches, DataPage chains, etc.), see [composite-coded-examples.md](./composite-coded-examples.md) — including **copy-paste agent prompts** for each composite.
