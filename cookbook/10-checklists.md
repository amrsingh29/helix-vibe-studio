# Checklists

## View Component Review Checklist

Run through every section after creating or modifying a view component.

### File Structure
- [ ] All 10 files exist: types, registration, design (component + html + scss + model + types), runtime (component + html + scss)

### Types File
- [ ] Interface extends `IRxStandardProps`
- [ ] `name: string` property present
- [ ] All custom properties declared with specific types (no `any`)

### Registration Module
- [ ] `@NgModule()` decorator
- [ ] `type` follows: `<app-name>-<app-name>-<component-name>`
- [ ] `properties` array includes custom props + `...RX_STANDARD_PROPS_DESC`
- [ ] `component` = runtime, `designComponent` = design, `designComponentModel` = design model

### Design Model
- [ ] Extends `ViewDesignerComponentModel`, implements `IViewDesignerComponentModel`
- [ ] Constructor: `super(injector, sandbox)` called first
- [ ] `sandbox.updateInspectorConfig(...)` called in constructor
- [ ] `static getInitialProperties()` exists with `...RX_STANDARD_PROPS_DEFAULT_VALUES` and `...currentProperties`
- [ ] Inspector control `name` values match property names exactly
- [ ] Ends with `...getStandardPropsInspectorConfigs()`
- [ ] Data dictionary set via `setSettablePropertiesDataDictionary` and `setCommonDataDictionary`
- [ ] `validate()` calls `validateStandardProps(model)`
- [ ] All subscriptions use `takeUntil(sandbox.destroyed$)`

### Runtime Component
- [ ] `standalone: true`
- [ ] Extends `BaseViewComponent`, implements `OnInit, IViewComponent`
- [ ] `@Input() config: Observable<I...>` (Observable, not plain object)
- [ ] `@RxViewComponent({ name })` matches registration `type`
- [ ] Selector matches registration `type` (no `-design` suffix)
- [ ] `ngOnInit()` calls `super.ngOnInit()` first
- [ ] `notifyPropertyChanged('api', this.api)` in `ngOnInit`
- [ ] Config subscription uses `distinctUntilChanged()` + `takeUntil(this.destroyed$)`
- [ ] `setProperty` handles each settable property in switch + calls `notifyPropertyChanged`

### Templates
- [ ] No unescaped `@` characters (use `&#64;`)
- [ ] Safe navigation: `state?.property`
- [ ] No direct DOM manipulation

### Integration
- [ ] Registration module imported in main module
- [ ] Registration module exported in `index.ts`

### Cross-File Consistency
- [ ] Component type string identical in: registration `type`, `@RxViewComponent({ name })`, `selector`
- [ ] Property names consistent in: types interface, registration properties, inspector controls, `getInitialProperties`, `setProperty` cases

---

## Java Build & Deploy Checklist

### Before Writing Code
- [ ] Review AR System Platform Quirks (dates, transactions, required fields, attachments)
- [ ] Dates: epoch millis only, no ISO 8601
- [ ] `@RxDefinitionTransactional` only on REST endpoints
- [ ] Status (7) + Description (8) always set on record creation
- [ ] Attachments after record creation only

### Creating a New Service
1. [ ] Create `*Activity.java` and `*ResponsePayload.java`
2. [ ] Register in `MyApplication.java` (`registerService(new ...)`)
3. [ ] Verify files visible in Docker container
4. [ ] If stale, `docker cp` files in
5. [ ] Build and deploy
6. [ ] Verify classes in JAR (including `$AjcClosure1`)
7. [ ] Check deploy status: `Final Status:Deployed`
8. [ ] Clear browser cache
9. [ ] Check Process Designer (for process activities)

### Post-Build
- [ ] Maven: `BUILD SUCCESS`
- [ ] JAR contains new `.class` files
- [ ] `$AjcClosure1` companion exists (AspectJ weaving confirmed)
- [ ] No `ERROR 930` in deployment output

### Post-Deployment
- [ ] `Final Status:Deployed`
- [ ] Browser cache cleared
- [ ] For Process Activities: visible in Process Designer under process activities
- [ ] For REST APIs: callable via HTTP

---

## Module Federation & AOT Pitfalls

### First Component Strategy
- [ ] Build and deploy FIRST component before generating others
- [ ] Watch for `ɵmod undefined` errors — follow 3-step resolution:
  1. AOT compatibility: static metadata in decorators
  2. Module naming: class name matches import
  3. Registration wiring: both imported in `@NgModule` AND exported in `index.ts`
- [ ] After first component works, generate remaining using same pattern

### Common AOT Issues
- [ ] No function calls or computed values in decorator arguments
- [ ] No circular dependencies between files
- [ ] All imports resolve — no `Module not found`
