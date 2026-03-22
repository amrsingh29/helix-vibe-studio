# UI View Components

## Overview

View components are Angular standalone components registered with the platform via `RxViewComponentRegistryService`. Each has:
- **Runtime component** — what end users interact with
- **Design component** — what View Designer shows on canvas
- **Design model** — property inspector config, validation, data dictionary
- **Registration module** — registers all parts with the platform
- **Types file** — TypeScript interfaces for properties

## Platform OOB: Record Grid

The platform provides a built-in **Record Grid** view component. Add it from the View Designer palette when creating view definitions — no code required. It:

- Displays record instances in a tabular grid for a chosen record definition
- Loads data via Record Instance DataPage (field pickers use field IDs)
- Supports sorting, row actions, multi-record edit, runtime filters, per-field/cell styling
- Switches to card layout when container width is below a configured threshold
- Exposes `selectedRow` / `firstSelectedRow` with field IDs for expression builder (e.g. `=RecordGrid.selectedRow.536870913`)

Use Record Grid when a simple tabular list of records is sufficient. Build a **custom** view component when you need cards, facets, custom actions, or different UX (see [Catalog view](../../my-components/catalog-view/README.md) for a Record grid–style custom alternative).

### Modifying Record Grid with CSS

| Approach | What you can do |
|----------|------------------|
| **CSS classes property** | In View Designer, select the Record Grid → Inspector → **CSS classes**. Add one or more class names (space-separated). Your app stylesheet can then target `.your-class` and descendant selectors to change layout, spacing, colors, etc. |
| **Built-in BMC classes** | Add these to **CSS classes** without writing custom CSS: `rx-no-margin`, `rx-default-border`, `rx-white-background`, `rx-auto-fill`, `rx-auto-scroll`. |
| **Bootstrap 4** | The platform supports Bootstrap 4 utility classes — use them in **CSS classes** (e.g. `mt-3`, `p-2`, `border`, `shadow-sm`). |
| **Per-field / per-cell styling** | Record Grid has built-in inspector options for each column: font size, bold, italic, text color, background color. Configure these in the Record Grid component’s field configuration — no external CSS needed. |
| **Custom stylesheet** | Add CSS to `libs/<application-name>/src/lib/styles/<application-name>.scss` (or equivalent). Use the `cssClass` you assigned to scope selectors, e.g. `.my-record-grid .adapt-table { ... }`. Inspect the DOM at runtime to find internal class names if you need finer control. |

### Ready-made modern styles

Pre-built styles for a cleaner Record Grid: [record-grid-modern-styles.scss](../../docs/record-grid-modern-styles.scss). Import it in your app stylesheet, then add the class `record-grid-modern` to the Record Grid's **CSS classes** property in View Designer.

**Included:**
- Rounded panel (14px), light border, warm header (#fbfaf8)
- Comfortable row padding (16px 20px)
- Links in cells styled blue (#1b6fb1), bold
- **Status pill:** For a Status column, add `status-pill` to that column's **CSS classes** in the Record Grid field config → green pill badge (uppercase, rounded)

**BMC Docs:** [Creating a tabular view of record instances by using a record grid](https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/BMC-Helix-Innovation-Studio/is221/Tailoring-applications-and-automating-processes/Creating-the-definitions-for-a-tailorable-application/Defining-the-user-interface-through-view-definitions/Creating-a-tabular-view-of-record-instances-by-using-a-record-grid/) | [CSS classes used in View designer components](https://docs.bmc.com/docs/innovationsuite/233/css-classes-used-in-view-designer-components-1365873916.html)

## Two Types

| Type | When to Use |
|------|-------------|
| **Standalone View Component** | Reusable UI element not tied to a record field (charts, tables, scanners, dashboards) |
| **Record Editor Field View Component** | Custom field type inside a record editor, mapped to a record definition field (date pickers, star ratings, rich text) |

## File Structure

```
view-components/<component-name>/
├── <component-name>.types.ts                      # Shared property interfaces
├── <component-name>-registration.module.ts        # Platform registration
├── design/
│   ├── <component-name>-design.component.ts       # Design-time component
│   ├── <component-name>-design.component.html     # Design-time template
│   ├── <component-name>-design.component.scss     # Design-time styles
│   ├── <component-name>-design.model.ts           # Inspector + validation + data dictionary
│   └── <component-name>-design.types.ts           # Design-only property interface
└── runtime/
    ├── <component-name>.component.ts              # Runtime component
    ├── <component-name>.component.html            # Runtime template
    └── <component-name>.component.scss            # Runtime styles
```

## Naming Convention

- Component name: lowercase alphanumeric + dashes only (kebab-case)
- No bundleId or application-name prefix needed in the name itself
- Selector: `<application-name>-<application-name>-<component-name>`
- Design selector: `<application-name>-<application-name>-<component-name>-design`

## Generation Commands

From `/bundle/src/main/webapp/`:

```bash
# Standalone View Component (interactive)
npx ng g rx-view-component "<component-name>"

# Dry run first
npx ng g rx-view-component "<component-name>" --dry-run

# Non-interactive with Nx
npx nx g @helix/schematics:create-view-component \
  --name="<component-name>" \
  --project="<application-name>" \
  --group="<group-name>" \
  --no-interactive

# Record Editor Field
npx nx g @helix/schematics:create-record-editor-field-view-component \
  --name="<component-name>" \
  --project="<application-name>" \
  --group="<group-name>" \
  --no-interactive

# Docker execution
docker exec bmc-helix-innovation-studio bash -c \
  "cd /workspace/<your-project>/bundle/src/main/webapp && npx nx g @helix/schematics:create-view-component --name='<name>' --project='<app>' --group='<group>' --no-interactive"
```

Manual creation is recommended for Docker environments to avoid interactive prompt issues.

## Types File Template

```typescript
import { IRxStandardProps } from '@helix/platform/view/api';

export interface IMyComponentProperties extends IRxStandardProps {
  name: string;
  title: string;
  // All custom properties declared here
}
```

## Registration Module Template

```typescript
import { NgModule } from '@angular/core';
import { RxViewComponentRegistryService, RX_STANDARD_PROPS_DESC } from '@helix/platform/view/api';
import { MyComponentComponent } from './runtime/my-component.component';
import { MyComponentDesignComponent } from './design/my-component-design.component';
import { MyComponentDesignModel } from './design/my-component-design.model';

@NgModule()
export class MyComponentRegistrationModule {
  constructor(private rxViewComponentRegistryService: RxViewComponentRegistryService) {
    this.rxViewComponentRegistryService.register({
      type: '<application-name>-<application-name>-my-component',
      name: 'My Component',
      group: 'Sample App',
      icon: 'table',
      component: MyComponentComponent,
      designComponent: MyComponentDesignComponent,
      designComponentModel: MyComponentDesignModel,
      properties: [
        { name: 'title', localizable: true, enableExpressionEvaluation: true },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
```

## Runtime Component Template

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { RxViewComponent } from '@helix/platform/view/api';
import { Observable, throwError } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IMyComponentProperties } from '../my-component.types';

@Component({
  selector: '<application-name>-<application-name>-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
@RxViewComponent({
  name: '<application-name>-<application-name>-my-component'
})
export class MyComponentComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input() config: Observable<IMyComponentProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state: IMyComponentProperties;
  protected isHidden = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(config => {
      this.state = config;
      this.isHidden = Boolean(config.hidden);
    });
  }

  private setProperty(propertyPath: string, propertyValue: any): void | Observable<never> {
    switch (propertyPath) {
      case 'hidden':
        this.state.hidden = propertyValue;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      case 'title':
        this.state.title = propertyValue;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      default:
        return throwError(`MyComponent: property ${propertyPath} is not settable.`);
    }
  }
}
```

## Design Model Template

```typescript
import { Injector } from '@angular/core';
import { ViewDesignerComponentModel } from '@helix/platform/view/designer';
import { IViewDesignerComponentModel, IViewComponentDesignSandbox, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
import { TextFormControlComponent, SwitchFormControlComponent } from '@helix/platform/shared/components';
import { Tooltip } from '@helix/platform/shared/api';
import { IMyComponentDesignProperties } from './my-component-design.types';
import { IMyComponentProperties } from '../my-component.types';
import { takeUntil } from 'rxjs/operators';
import { getStandardPropsInspectorConfigs, validateStandardProps } from '@helix/platform/view/designer';

export class MyComponentDesignModel extends ViewDesignerComponentModel<IMyComponentProperties, IMyComponentDesignProperties>
  implements IViewDesignerComponentModel<IMyComponentProperties, IMyComponentDesignProperties> {

  static getInitialProperties(currentProperties?: IMyComponentProperties): IMyComponentDesignProperties {
    return {
      name: '',
      title: 'My Component',
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  constructor(protected injector: Injector, protected sandbox: IViewComponentDesignSandbox<IMyComponentDesignProperties>) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(sandbox.descriptor.properties));

    sandbox.getComponentPropertyValue('name').pipe(
      takeUntil(sandbox.destroyed$)
    ).subscribe(name => {
      sandbox.setSettablePropertiesDataDictionary(name, [
        { label: 'Title', expression: this.getExpressionForProperty('title') },
        { label: 'Hidden', expression: this.getExpressionForProperty('hidden') }
      ]);
      sandbox.setCommonDataDictionary(name, [
        { label: 'Title', expression: this.getExpressionForProperty('title') }
      ]);
    });

    sandbox.componentProperties$.pipe(
      takeUntil(sandbox.destroyed$)
    ).subscribe(model => {
      sandbox.updateInspectorConfig(this.setInspectorConfig(model));
    });
  }

  private setInspectorConfig(model: any) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'General',
          controls: [
            { name: 'name', component: TextFormControlComponent, options: { label: 'Name', tooltip: new Tooltip('Component instance name') } },
            { name: 'title', component: TextFormControlComponent, options: { label: 'Title', tooltip: new Tooltip('Display title') } }
          ]
        },
        ...getStandardPropsInspectorConfigs()
      ]
    };
  }

  validate(model: any) {
    return [...validateStandardProps(model)];
  }
}
```

## Design Component Template

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponentDesignModel } from './my-component-design.model';

@Component({
  selector: '<application-name>-<application-name>-my-component-design',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component-design.component.html',
  styleUrls: ['./my-component-design.component.scss']
})
export class MyComponentDesignComponent {
  @Input() model: MyComponentDesignModel;
}
```

## Design Types Template

```typescript
import { IMyComponentProperties } from '../my-component.types';

export interface IMyComponentDesignProperties extends IMyComponentProperties {
  // Design-only properties if any
}
```

## Integration Steps

### 1. Register in Main Module

**File**: `libs/<application-name>/src/lib/<application-name>.module.ts`

```typescript
import { MyComponentRegistrationModule } from './view-components/my-component/my-component-registration.module';

@NgModule({
  imports: [
    CommonModule,
    MyComponentRegistrationModule,
    // Other modules — do NOT remove existing imports
  ]
})
export class ComExampleSampleApplicationModule {}
```

### 2. Export in Index

**File**: `libs/<application-name>/src/index.ts`

```typescript
export * from './lib/view-components/my-component/my-component-registration.module';
```

Missing this export means the component won't be bundled into the build output.

## Cross-File Consistency (Critical)

These values MUST be identical across files:

| Value | Registration | Runtime Component | Design Component |
|-------|-------------|-------------------|-----------------|
| Type string | `type` | `@RxViewComponent({ name })` and `selector` | — |
| Properties interface | — | `config: Observable<I...>` | `model` type |
| Property names | `properties[].name` | `setProperty` switch cases | Inspector `controls[].name` |

## For Complete Examples

See `.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/` for a full working view component with all 10 files.

See `.cursor/_instructions/UI/ObjectTypes/StandaloneViewcomponent/` for detailed documentation on each file:
- `standalone-view-component.md` — overview and generation
- `standalone-view-component-runtime.md` — runtime component details
- `standalone-view-component-design-time.md` — design model and component details
