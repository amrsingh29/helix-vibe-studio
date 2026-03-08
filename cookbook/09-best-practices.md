# Best Practices

## Angular / TypeScript Best Practices

### Technology Stack
- Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1
- Use Adapt components for all UI elements
- Use `RxLogService` instead of `console.log/warn/error`

### Component Standards
- Always use `standalone: true`
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Keep templates in `.html`, styles in `.scss`, logic in `.ts` — no inline
- Use `OnPush` change detection strategy
- Implement `OnDestroy`, use `takeUntil(this.destroyed$)` for subscriptions
- Single responsibility per component
- Prefer Reactive forms over Template-driven forms

### State Management
- Use Angular signals for local state
- Use `computed()` for derived state
- Use `update` or `set` on signals, NOT `mutate`
- Keep state transformations pure

### Templates
- Use native control flow: `@if`, `@for`, `@switch` (NOT `*ngIf`, `*ngFor`)
- Use `async` pipe for observables
- No arrow functions in templates
- No `ngClass` — use `[class]` bindings
- No `ngStyle` — use `[style]` bindings
- Escape `@` characters as `&#64;` in HTML (Angular interprets `@` as control flow)
- Access state with safe navigation: `state?.property`

### Styles
- Use SCSS
- BEM naming convention for CSS classes
- Leverage Adapt CSS variables: `var(--color-primary)`
- Use Bootstrap 4 utility classes: `d-flex`, `p-2`, `mb-3`
- Avoid global CSS; if needed, prefix with `<bundleId-kebab>-<app-name>-<class-name>`
- Component-scoped styles preferred
- No hardcoded colors conflicting with platform themes

### Services
- `providedIn: 'root'` for singleton services
- Use `inject()` function instead of constructor injection
- Single responsibility per service

### RxJS
- Use `takeUntil` for subscription cleanup
- Use `catchError` for error handling
- Use `distinctUntilChanged` for config subscriptions
- Use `debounceTime` for user input

### Data Loading Patterns
- **Never fetch metadata and data in parallel** — if a data query depends on dynamically resolved IDs (e.g., from a record definition), chain the data load inside the metadata callback. Parallel calls cause the data query to use stale/fallback IDs.
- Set fallback values synchronously before the async fetch, so the error path can still load data.

```typescript
// WRONG — parallel, data query uses fallback IDs
ngOnInit() {
  this.fetchDefinition().subscribe(def => this.buildFieldMap(def));
  this.loadRecords(); // fires immediately with wrong IDs
}

// CORRECT — chained, data query uses resolved IDs
ngOnInit() {
  this.fieldIds = { ...FALLBACK_IDS }; // sync fallback
  this.fetchDefinition().subscribe({
    next: (def) => { this.buildFieldMap(def); this.loadRecords(); },
    error: () => { this.loadRecords(); } // fallback path
  });
}
```

### Error Handling
- Never swallow exceptions
- Use `RxLogService` for all logging
- Show user-friendly error messages via `RxNotificationService`
- Display loading indicators during async operations
- Display empty state when no data available

### Localization
- Never hardcode strings — use `localized-strings.json` + `TranslateService`
- Use `TranslatePipe` in templates: `{{ 'key' | translate }}`
- Use `translateService.instant('key')` in TypeScript

### Accessibility
- Must pass AXE checks
- Must follow WCAG AA minimums
- Include focus management, color contrast, ARIA attributes
- Use semantic HTML
- Ensure keyboard navigation

---

## Java Best Practices

### Technology Stack
- OpenJDK 17 language features only
- JAX-RS for REST, Jackson for JSON, Spring for DI, SLF4J for logging
- OSGi module system

### Decorators
- `@RxDefinitionTransactional` — ONLY on REST endpoint methods, NOT internal services
  - `readOnly = true` for read operations
  - `isolation = Isolation.DEFAULT, rollbackFor = Exception.class`
- `@AccessControlledMethod` — security enforcement
  - `authorization = AuthorizationLevel.ValidUser`
  - `licensing = LicensingLevel.Application`
  - For write operations: `checkSchemaForSpecialAccess = true, promoteStructAdmin = true`

### Error Handling
- Always log exceptions: `ServiceLocator.getLogger().error(...)`
- Use `RxException` to catch platform exceptions
- Return error info in response DTOs (`success=false, errorMessage=...`)
- Implement debug-level logging for troubleshooting

### Do's
- Use platform services (RecordService, CacheService)
- Use standard technology stack (Jackson, SLF4J)
- Follow standard Java coding conventions
- Keep operations short — break long processing into smaller actions
- Use `@RxDefinitionTransactional` and `@AccessControlledMethod` on data access methods
- Use CacheService for caching

### Don'ts
- No threads (`new Thread`, `extends Thread`, `synchronized`, `sleep`)
- No file I/O (`FileReader`, `BufferedReader`, filesystem read/write)
- No static state or member variables for state
- No custom servlet containers, filters, or interceptors
- No custom permission/security mechanisms
- No custom caching frameworks (use CacheService)
- No aspects
- No Core AR-API or API-Clients
- No additional databases or job schedulers
- No thread local storage
- No blocking long-running operations

### Date/Time
- ALWAYS use epoch milliseconds: `System.currentTimeMillis()` or `Instant.now().toEpochMilli()`
- NEVER use ISO 8601 strings for AR System date fields

### Record Operations
- Always set Status (field 7) and Description (field 8) on record creation
- Persist attachments AFTER parent record creation
- Don't make FileAttachment fields REQUIRED on record definitions

### Rules Behavior
- Rules fire only once per event — don't design loops relying on repeated rule firing
- For batch processing, iterate within a single service method

---

## Build & Deploy Best Practices

- Always rebuild frontend before full build
- Use `-DskipTests` during development
- Use `mvn clean` for fresh builds
- Verify deployment status before testing
- Clear browser cache after every deployment
- Deploy early, deploy often
- Test each service individually before creating the next
- Batch multiple fixes per build cycle
