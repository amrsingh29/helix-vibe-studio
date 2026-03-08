# UI View Components

## Overview

View components are Angular standalone components registered with the platform via `RxViewComponentRegistryService`. Each has:
- **Runtime component** — what end users interact with
- **Design component** — what View Designer shows on canvas
- **Design model** — property inspector config, validation, data dictionary
- **Registration module** — registers all parts with the platform
- **Types file** — TypeScript interfaces for properties

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
