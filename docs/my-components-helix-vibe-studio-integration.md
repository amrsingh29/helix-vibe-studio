# Helix Vibe Studio Components — Integration Checklist

Components in `my-components/` that use the **Helix Vibe Studio** palette group. To make them available in View Designer (alongside Active cart, Catalog view, etc.), copy each component and add its registration module.

## Components in Helix Vibe Studio Group

| Component | Folder | Registration Module |
|-----------|--------|---------------------|
| Active cart (grouped) | `cart-view/` | `CartViewRegistrationModule` |
| Catalog view (cards & table) | `catalog-view/` | `CatalogViewRegistrationModule` |
| Insight rail (data-quality) | `insight-rail/` | `InsightRailRegistrationModule` |
| Date/Time Formatter | `date-time-formatter/` | `DateTimeFormatterRegistrationModule` |
| Runtime actions demo | `runtime-actions-demo/` | `RuntimeActionsDemoRegistrationModule` |
| Org chart | `org-chart-view/` | `OrgChartViewRegistrationModule` |
| Priority matrix | `priority-matrix-view/` | `PriorityMatrixViewRegistrationModule` |

## Integration Steps

### 1. Copy component folder

Copy from `my-components/<component>/` to:

```
bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/<component>/
```

Example for Date/Time Formatter:

```
my-components/date-time-formatter/  →  libs/com-amar-helix-vibe-studio/src/lib/view-components/date-time-formatter/
```

### 2. Import in app module

**File:** `libs/<application-name>/src/lib/<application-name>.module.ts`

Add to `imports`:

```typescript
import { CartViewRegistrationModule } from './view-components/cart-view/cart-view-registration.module';
import { CatalogViewRegistrationModule } from './view-components/catalog-view/catalog-view-registration.module';
import { DateTimeFormatterRegistrationModule } from './view-components/date-time-formatter/date-time-formatter-registration.module';
import { InsightRailRegistrationModule } from './view-components/insight-rail/insight-rail-registration.module';
import { OrgChartViewRegistrationModule } from './view-components/org-chart-view/org-chart-view-registration.module';
import { PriorityMatrixViewRegistrationModule } from './view-components/priority-matrix-view/priority-matrix-view-registration.module';
import { RuntimeActionsDemoRegistrationModule } from './view-components/runtime-actions-demo/runtime-actions-demo-registration.module';

@NgModule({
  imports: [
    // ... other modules
    CartViewRegistrationModule,
    CatalogViewRegistrationModule,
    DateTimeFormatterRegistrationModule,
    InsightRailRegistrationModule,
    RuntimeActionsDemoRegistrationModule,
    OrgChartViewRegistrationModule,
    PriorityMatrixViewRegistrationModule
  ]
})
export class ComAmarHelixVibeStudioModule {}
```

### 3. Export from index.ts

**File:** `libs/<application-name>/src/index.ts`

Add exports (required for bundling):

```typescript
export * from './lib/view-components/cart-view/cart-view-registration.module';
export * from './lib/view-components/catalog-view/catalog-view-registration.module';
export * from './lib/view-components/date-time-formatter/date-time-formatter-registration.module';
export * from './lib/view-components/insight-rail/insight-rail-registration.module';
export * from './lib/view-components/runtime-actions-demo/runtime-actions-demo-registration.module';
export * from './lib/view-components/org-chart-view/org-chart-view-registration.module';
export * from './lib/view-components/priority-matrix-view/priority-matrix-view-registration.module';
```

Merge `localized-strings.json` from this component into your bundle i18n if you maintain translations per component.

### 3a. Bundle manifest (`postbuild.js`) — **required** for this project’s webapp

In `bundle/src/main/webapp/postbuild.js`, the `publishedViewComponentTypes` array is written into `dist/.../com-amar-helix-vibe-studio.json` after each UI build. **Add the new view component’s canonical `type` string** (same as in `RxViewComponentRegistryService.register({ type: ... })` and `@RxViewComponent({ name: ... })`) to that array. If you skip this step, the server can log CLIE errors (e.g. missing `@RxViewComponent`) even though the decorator is present in source.

### 4. Deploy and verify

1. Build and deploy: `mvn clean install -Pdeploy -DskipTests`
2. In Helix: **Workspace → Helix Vibe Studio → Visit deployed application**
3. Open View Designer, create or edit a view
4. In the palette, open the **Helix Vibe Studio** group
5. You should see: Active cart, Catalog view, Insight rail, Date/Time Formatter, Runtime actions demo, Org chart, Priority matrix

### Troubleshooting

- **Group not visible:** Enter View Designer via **Workspace → Helix Vibe Studio → Visit deployed application** (not a direct URL)
- **Component missing:** Ensure the module is imported AND exported; hard refresh (`Cmd+Shift+R`)
- **Unknown component:** Check that `type`, `@RxViewComponent({ name })`, and `selector` are identical
