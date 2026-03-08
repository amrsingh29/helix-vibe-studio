---
applyTo: "**/webapp/libs/**/*.ts,**/webapp/libs/**/*.html,**/webapp/libs/**/*.scss"
---

# BMC Helix Innovation Studio — UI Development Rules

When creating or modifying Angular/TypeScript files in this project, follow these rules.

## Mandatory Reading Before Code Changes

1. Read `cookbook/09-best-practices.md` for Angular 18 coding standards
2. Read `cookbook/02-ui-view-components.md` for the 10-file component pattern
3. After changes, run through `cookbook/10-checklists.md` (View Component Review Checklist)

## Critical Rules

- Use `standalone: true` for all components
- Use `ChangeDetectionStrategy.OnPush`
- Use `@if`/`@for`/`@switch` (NOT `*ngIf`/`*ngFor`)
- Escape `@` as `&#64;` in HTML templates
- Use `RxLogService` instead of `console.log`
- Use `takeUntil(this.destroyed$)` for all subscriptions
- Localize all strings via `localized-strings.json` + `TranslateService`
- Use Adapt components for UI (not raw HTML controls)

## Component Type String

Must be identical in: registration `type`, `@RxViewComponent({ name })`, and `selector`:

```
<application-name>-<application-name>-<component-name>
```

## Integration Checklist

After creating a component:
- Import registration module in `<application-name>.module.ts`
- Export registration module in `index.ts`
- Verify cross-file consistency (type string, property names)

## Detailed Reference

- View component details: `.cursor/_instructions/UI/ObjectTypes/StandaloneViewcomponent/`
- Adapt components: `.cursor/_instructions/UI/AdaptComponents/`
- Platform services: `.cursor/_instructions/UI/Services/`
- Full example: `.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/`
