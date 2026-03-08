# BMC Helix Innovation Studio — Coded Application Cookbook (Full Context)

> Complete development reference for building coded applications on BMC Helix Innovation Studio 25.4.00+.
>
> **Container engine note**: This project supports both Docker and Podman. All `docker exec` commands in this document work identically with `podman exec`. See `README.md` for Podman-specific setup.

---

<section file="cookbook/01-getting-started.md">

# Getting Started with BMC Helix Innovation Studio Coded Applications

## Platform Overview

BMC Helix Innovation Studio allows developers to extend the platform with:
- **UI Components** (Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1) — view components, view actions, Angular services
- **Java Backend** (OpenJDK 17, OSGi, JAX-RS, Spring 5.3.42) — process activities, REST APIs, commands, DataPageQuery
- **BPMN Process Definitions** — workflow orchestration connecting Java services
- **Record Definitions** — data schema stored as `.def` files

## Prerequisites

| Tool | Version | Verify |
|------|---------|--------|
| Node.js | 20.15.1 | `node --version` |
| Yarn | 1.22.22 | `yarn --version` |
| Java JDK | 17.0.x | `java -version` |
| BMC Helix IS SDK | 25.4.00+ | `ls $RX_SDK_HOME` |

### Environment Variables

```bash
export RX_SDK_HOME=/path/to/com.bmc.arsys.rx.sdk-25.4.00
export JAVA_HOME=/path/to/jdk-17
```

If the file `.cursor/_instructions/my-env-vars.env` exists, read environment variable values from it.

Set Node.js version if `nvm` is installed:
```bash
nvm use 20.15.1
```

## Application Name

The **application name** determines the path where Angular code lives. Find it in `/bundle/src/main/webapp/angular.json` under `projects`:

```json
"projects": {
    "<application-name>": {
        "projectType": "library",
        "root": "./libs/<application-name>",
        "sourceRoot": "./libs/<application-name>/src",
        "prefix": "<application-name>"
    }
}
```

## Bundle ID

The **bundleId** uniquely identifies the application package: `<groupId>.<artifactId>` from `/bundle/pom.xml`.

```xml
<groupId>com.mycompany</groupId>
<artifactId>my-app</artifactId>
<!-- bundleId = com.mycompany.my-app -->
```

Used for:
- Record definition names: `<bundleId>:<recordDefinitionName>`
- REST API URLs: `/api/<bundleId>/<your-path>`
- Component type strings: `<application-name>-<application-name>-<component-name>`

## Project Structure

All code lives under `workspace/<your-project>/`:

```
workspace/<your-project>/
├── pom.xml                                    # Root Maven config
├── bundle/
│   ├── pom.xml                                # Bundle Maven config (groupId, artifactId)
│   └── src/main/
│       ├── java/com/<group>/<app>/bundle/     # Java backend code
│       │   ├── MyApplication.java             # OSGi bundle activator — register services here
│       │   ├── *ProcessActivity.java          # Java process activities
│       │   ├── *ResponsePayload.java          # Response DTOs
│       │   └── *.java                         # REST APIs, Commands, DataPageQuery
│       ├── resources/
│       │   └── localized-strings.properties   # Server-side localized strings
│       └── webapp/
│           ├── angular.json                   # DO NOT MODIFY — belongs to BMC Helix SDK
│           ├── package.json                   # DO NOT MODIFY — belongs to BMC Helix SDK
│           └── libs/<application-name>/
│               ├── package.json               # YOUR third-party NPM dependencies go here
│               └── src/
│                   ├── index.ts               # Exports — all registration modules must be exported
│                   └── lib/
│                       ├── <application-name>.module.ts  # Main module — import all registration modules
│                       ├── view-components/              # View Components (standalone + record editor field)
│                       ├── actions/                      # View Actions
│                       ├── assets/                       # Static assets (images, fonts)
│                       ├── i18n/
│                       │   └── localized-strings.json    # UI localized strings
│                       └── styles/
│                           └── <application-name>.scss   # Global SCSS styles
├── package/
│   ├── pom.xml
│   └── src/main/definitions/db/
│       ├── record/                            # Record definitions (.def)
│       ├── process/                           # Process definitions (.def)
│       └── view/                              # View definitions (.def)
└── llms.txt                                   # This cookbook index
```

## Key Files — Do Not Modify Rules

| File | Rule |
|------|------|
| `/bundle/src/main/webapp/angular.json` | DO NOT MODIFY — BMC Helix SDK managed |
| `/bundle/src/main/webapp/package.json` | DO NOT MODIFY — BMC Helix SDK managed |
| `<application-name>.module.ts` | Do not remove existing imports or commented code |
| `MyApplication.java` | Do not remove existing imports or commented code |

## Component Type String Convention

All view components and actions use a fully qualified type string:

```
<application-name>-<application-name>-<component-name>
```

Example: `com-example-sample-application-com-example-sample-application-pizza-ordering`

This string MUST be identical in:
- Registration module `type`
- Runtime component `@RxViewComponent({ name })` decorator
- Runtime component `selector`

## Asset Paths at Runtime

Assets stored in `libs/<application-name>/src/lib/assets/` are served at:
```
/<bundleId>/scripts/assets/resources/<subfolder>/<filename>
```

Example:
```html
<img src="/com.example.sample-application/scripts/assets/resources/images/pizza.jpg"/>
```

## Localization

All UI strings must use localization. Never hardcode strings.

**File**: `libs/<application-name>/src/lib/i18n/localized-strings.json`

```json
{
  "<bundleId>.view-components.<component-name>.<string-id>": "English text"
}
```

**TypeScript usage**:
```typescript
import { TranslateService } from '@ngx-translate/core';
const msg = this.translateService.instant('com.example.sample-application.view-components.pizza-ordering.welcome');
```

**HTML usage**:
```html
<h1>{{ 'com.example.sample-application.view-components.pizza-ordering.welcome' | translate }}</h1>
```

## What Can You Build?

| Need | Build | Docs |
|------|-------|------|
| Reusable UI element | Standalone View Component | [02-ui-view-components.md](02-ui-view-components.md) |
| Custom record editor field | Record Editor Field View Component | [02-ui-view-components.md](02-ui-view-components.md) |
| Button click / event handler | View Action | [03-ui-view-actions.md](03-ui-view-actions.md) |
| Shared Angular logic | Angular Service | [04-ui-services-and-apis.md](04-ui-services-and-apis.md) |
| BPMN process step | Java Process Activity | [06-java-backend.md](06-java-backend.md) |
| Custom API endpoint | Java REST API | [06-java-backend.md](06-java-backend.md) |
| Fire-and-forget operation | Java Command | [06-java-backend.md](06-java-backend.md) |
| Custom data source | Java DataPageQuery | [06-java-backend.md](06-java-backend.md) |
| BPMN workflow | Process Definition (.def) | [07-process-definitions.md](07-process-definitions.md) |
| Innovation Studio view | View Definition (.def) | See `.cursor/_instructions/UI/Template/create-view-definition.md` |

</section>

---

<section file="cookbook/02-ui-view-components.md">

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

</section>

---

<section file="cookbook/03-ui-view-actions.md">

# UI View Actions

## Overview

View actions are Angular services that execute logic in response to UI events (button clicks, grid row actions, etc.). They run in a synchronous chain — each action can consume output from the previous one, and if one throws an error, subsequent actions are skipped.

## When to Use

- Button click handlers
- Custom business logic triggered by UI events
- API integrations from UI
- Data transformations
- Navigation actions

## File Structure

```
actions/<action-name>/
├── <action-name>-action.service.ts                    # Runtime action service
├── <action-name>-action.types.ts                      # Action parameter interfaces
├── <action-name>-action.module.ts                     # Registration module
├── <action-name>-action-design.types.ts               # Design-time parameter interface
├── <action-name>-action-design-model.class.ts         # Design model (inspector config)
└── <action-name>-action-design-manager.service.ts     # Design manager service
```

## Generation Commands

From `/bundle/src/main/webapp/`:

```bash
# Interactive
npx nx g @helix/schematics:create-view-action

# Non-interactive
npx nx g @helix/schematics:create-view-action \
  --name="<action-name>" \
  --project="<application-name>" \
  --no-interactive
```

## Runtime Action Service Template

```typescript
import { Injectable } from '@angular/core';
import { RxViewActionService } from '@helix/platform/view/api';
import { Observable, of } from 'rxjs';
import { IMyActionParams } from './<action-name>-action.types';

@Injectable()
export class MyActionService implements RxViewActionService {
  execute(params: IMyActionParams): Observable<any> {
    // Action logic here — must return an Observable
    // Throw error to stop the action chain
    return of({ success: true, result: params.inputValue });
  }
}
```

## Action Registration Module Template

```typescript
import { NgModule } from '@angular/core';
import { RxViewActionRegistryService } from '@helix/platform/view/api';
import { MyActionService } from './<action-name>-action.service';
import { MyActionDesignManagerService } from './<action-name>-action-design-manager.service';
import { MyActionDesignModel } from './<action-name>-action-design-model.class';

@NgModule({
  providers: [MyActionService]
})
export class MyActionModule {
  constructor(
    private rxViewActionRegistryService: RxViewActionRegistryService,
    private myActionService: MyActionService
  ) {
    this.rxViewActionRegistryService.register({
      name: '<application-name>-<action-name>',
      label: 'My Action',
      service: this.myActionService,
      designManager: MyActionDesignManagerService,
      designModel: MyActionDesignModel,
      parameters: [
        { name: 'inputValue', label: 'Input Value', enableExpressionEvaluation: true }
      ],
      output: [
        { name: 'result', label: 'Result' }
      ]
    });
  }
}
```

## Integration Steps

### 1. Register in Main Module

```typescript
import { MyActionModule } from './actions/<action-name>/<action-name>-action.module';

@NgModule({
  imports: [
    MyActionModule,
    // ...existing imports
  ]
})
```

### 2. Export in Index

```typescript
export * from './lib/actions/<action-name>/<action-name>-action.module';
```

## Key Concepts

- Actions execute in a synchronous chain
- Each action can consume output from the previous action
- If one action throws an error, following actions won't execute
- Return an `Observable` that completes when the action is done
- Use for button clicks, record grid actions, event handlers

## For Complete Examples

See `.cursor/_instructions/UI/ObjectTypes/Examples/ViewAction/calculate-vat/` for a full working view action with all files.

See `.cursor/_instructions/UI/ObjectTypes/ViewAction/view-action.md` for detailed documentation.

</section>

---

<section file="cookbook/04-ui-services-and-apis.md">

# UI Services and APIs

## Platform Services

Innovation Studio SDK provides Angular services for data access, logging, navigation, and user interaction. Import these in your components and actions.

### Service Injection

**In runtime components and actions** — use constructor injection:
```typescript
constructor(private rxLogService: RxLogService, private rxCurrentUserService: RxCurrentUserService) {
  super();
}
```

**In design models** — use the `Injector` (design models are not created by Angular DI):
```typescript
private rxCurrentUserService = this.injector.get<RxCurrentUserService>(RxCurrentUserService);
```

### Available Services

| Service | Import | Purpose |
|---------|--------|---------|
| `RxLogService` | `@helix/platform/shared/api` | Logging to browser console (use instead of `console.log`) |
| `RxNotificationService` | `@helix/platform/shared/api` | Toast notifications to end users |
| `RxRecordInstanceService` | `@helix/platform/record/api` | CRUD operations on record instances |
| `RxRecordInstanceDataPageService` | `@helix/platform/record/api` | Paginated record queries |
| `RxCurrentUserService` | `@helix/platform/shared/api` | Current user info (username, userId) |
| `RxOpenViewActionService` | `@helix/platform/view/actions` | Navigate to Innovation Studio views |
| `RxModalService` | `@helix/platform/ui-kits` | System modals (alert, confirm, prompt) |
| `AdaptModalService` | `@bmc-ux/adapt-angular` | Open Angular components in modal windows |
| `RxLaunchProcessViewActionService` | `@helix/platform/view/actions` | Execute Innovation Studio processes |

### Logging (RxLogService)

Never use `console.log/warn/error`. Always use `RxLogService`:

```typescript
import { RxLogService } from '@helix/platform/shared/api';

this.rxLogService.log('Info message');
this.rxLogService.warn('Warning message');
this.rxLogService.error('Error occurred:', error);
this.rxLogService.debug('Debug info');
```

See `.cursor/_instructions/UI/Services/logs.md` for full details.

### Record Operations

See `.cursor/_instructions/UI/Services/records.md` for `RxRecordInstanceService` and `RxRecordInstanceDataPageService` detailed usage.

### Opening Views

See `.cursor/_instructions/UI/Services/open-view.md` for `RxOpenViewActionService`.

### Modals

See `.cursor/_instructions/UI/Services/open-modal.md` for `RxModalService` (system modals).
See `.cursor/_instructions/UI/Services/open-modal-components.md` for `AdaptModalService` (custom component modals).

### Launching Processes

See `.cursor/_instructions/UI/Services/launch-process.md` for `RxLaunchProcessViewActionService`.

---

## REST API Integration

### DataPage API (Recommended for Queries)

**Endpoint**: `POST /api/rx/application/datapage`

```typescript
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-By': 'XMLHttpRequest'
});

const payload = {
  values: {
    dataPageType: 'com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery',
    pageSize: '50',
    startIndex: '0',
    recorddefinition: '<bundleId>:<Record Name>',
    shouldIncludeTotalSize: 'false',
    propertySelection: '1,2,3,4,5,6,7,8,16,379,536870913,536870914',
    queryExpression: ''
  }
};

this.http.post<any>('/api/rx/application/datapage', payload, { headers })
  .pipe(catchError(err => { this.rxLogService.error('Query failed:', err); return throwError(err); }),
        takeUntil(this.destroyed$))
  .subscribe(response => {
    const records = response.data;
  });
```

### Query Expression Syntax

```typescript
// Text search
"'536870913' LIKE \"%John%\""

// Multiple conditions
"'536870913' LIKE \"%John%\" AND '536870914' != \"\""

// Numeric comparison
"'536870916' > 100"
```

See `.cursor/_instructions/UI/Services/Qualification.md` for full qualification building guide.

### Record Instance API (CRUD)

**Create**: `POST /api/rx/application/record/recordinstance`

```typescript
const payload = {
  id: null,
  resourceType: 'com.bmc.arsys.rx.services.record.domain.RecordInstance',
  displayId: null,
  recordDefinitionName: '<bundleId>:<Record Name>',
  permittedGroupsBySecurityLabels: null,
  permittedUsersBySecurityLabels: null,
  permittedRolesBySecurityLabels: null,
  fieldInstances: {
    '8': { resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance', id: 8, value: '.', permissionType: 'CHANGE' },
    '536870913': { resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance', id: 536870913, value: 'John Doe', permissionType: 'CHANGE' }
  }
};
```

**Update**: `PUT /api/rx/application/record/recordinstance/<guid>`
**Delete**: `DELETE /api/rx/application/record/recordinstance/<guid>`

### Common Field IDs

| Field ID | Name | Description |
|----------|------|-------------|
| 1 | Request ID | Unique record identifier |
| 2 | Submitter | User who created the record |
| 3 | Create Date | Record creation timestamp |
| 5 | Last Modified By | Last modifier |
| 6 | Modified Date | Last modification timestamp |
| 7 | Status | Record status |
| 8 | Short Description | Brief description (often required) |
| 16 | Status History | Status change history |
| 379 | GUID | Global unique identifier |

Custom fields start at `536870913`.

### Calling Custom Java REST APIs

```typescript
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-By': 'XMLHttpRequest'
});

this.http.get<any>('/api/<bundleId>/<rest-path>/<param>', { headers })
  .pipe(takeUntil(this.destroyed$))
  .subscribe(response => { /* handle response */ });
```

See `.cursor/_instructions/UI/Services/CallingJavaRestApi.md` for full details.

### Calling Custom DataPageQuery

See `.cursor/_instructions/UI/Services/CallingDataPageQuery.md` for querying custom Java DataPageQuery types.

---

## Getting Definitions

| What | Where | Docs |
|------|-------|------|
| Record definitions & field IDs | `/package/src/main/definitions/db/record/*.def` | `.cursor/_instructions/UI/Services/GettingRecordDefinition.md` |
| Process definitions & params | `/package/src/main/definitions/db/process/*.def` | `.cursor/_instructions/UI/Services/GettingProcessDefinition.md` |
| View definitions | `/package/src/main/definitions/db/view/*.def` | `.cursor/_instructions/UI/Services/GettingViewDefinition.md` |
| Adapt icons | — | `.cursor/_instructions/UI/Services/GettingAdaptIcons.md` |
| Adapt CSS variables | — | `.cursor/_instructions/UI/Services/GettingAdaptClassVariables.md` |

</section>

---

<section file="cookbook/05-adapt-components.md">

# BMC-UX Adapt Components

## Overview

The Adapt library (`@bmc-ux/adapt-angular`, `@bmc-ux/adapt-charts`, `@bmc-ux/adapt-table`) provides 36 pre-built UI components. Always use Adapt components for consistent look and feel.

## Import Packages

```typescript
import { /* components */ } from '@bmc-ux/adapt-angular';   // Core UI + form controls
import { AdaptTableModule } from '@bmc-ux/adapt-table';     // Data table
import { /* chart modules */ } from '@bmc-ux/adapt-charts';  // Charts
```

**Styles** (in global or component SCSS):
```scss
@import '@bmc-ux/adapt-css/adapt.scss';
```

## Component Categories

### Buttons (2 components)
- **Button** — Multiple styles (primary, secondary, danger), sizes, icons, loading states. [Detail](../.cursor/_instructions/UI/AdaptComponents/buttons/button.md)
- **Button Group** — Grouped buttons for toggles and segmented controls. [Detail](../.cursor/_instructions/UI/AdaptComponents/buttons/button-group.md)

### Carousel (2 components)
- **Carousel** — Image/content slideshow with auto-play and navigation. [Detail](../.cursor/_instructions/UI/AdaptComponents/carousel/carousel.md)
- **Multi-Card Carousel** — Horizontally scrollable card gallery. [Detail](../.cursor/_instructions/UI/AdaptComponents/carousel/multi-card.md)

### Charts (9 components)
- **Area Graph** — Filled area trends over time. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/area-graph.md)
- **Area Stacked Graph** — Stacked area part-to-whole. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/area-stacked-graph.md)
- **Dual Chart** — Two Y-axes, mixed chart types. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/dual-chart.md)
- **Flow Chart** — Directed graph with nodes/edges (ngx-graph). [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/flow-chart.md)
- **Heatmap** — Color-coded matrix visualization. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/heatmap.md)
- **Pie Chart** — Pie/donut proportional data. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/pie-chart.md)
- **Scatter Plot** — Cartesian coordinate relationships. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/scatter-plot.md)
- **Stacked Chart** — Vertical/horizontal stacked bars. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/stacked-chart.md)
- **Treemap** — Nested rectangles for hierarchical data. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/treemap.md)

### Reactive Form Controls (14 components)
- **TextField** — Text, password, email, number, tel, url input. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-textfield.md)
- **TextArea** — Multi-line text with auto-resize. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-textarea.md)
- **Select** — Single/multi-select dropdown with search. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-select.md)
- **Checkbox** — Single/multi-option with indeterminate state. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-checkbox.md)
- **Radio Button** — Mutually exclusive group selection. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-radiobutton.md)
- **Switch** — Binary on/off toggle. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-switch.md)
- **DateTime** — Date/time picker with calendar. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-datetime.md)
- **Counter** — Numeric input with increment/decrement. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-counter.md)
- **Rating** — Star-based rating input. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-rating.md)
- **Search** — Search input with debounce. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-search.md)
- **Uploader** — File upload with drag-and-drop. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-uploader.md)
- **List Builder** — Dual-list select interface. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-list-builder.md)
- **List Selector** — Scrollable selection list. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-list-selector.md)
- **Dropdown** — Options/controls from trigger element. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/dropdown.md)

### Misc Components (6 components)
- **Accordion** — Collapsible content sections. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/accordion.md)
- **Code Viewer** — Syntax-highlighted code display. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/code-viewer.md)
- **Progress** — Progress bars (single/multi/segmented). [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/progress.md)
- **QR Code Scanner** — Camera-based QR/barcode scanning. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/qr-code-scanner.md)
- **Steps** — Step indicator for wizards/workflows. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/steps.md)
- **Tooltip** — Contextual help on hover/focus. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/tooltip.md)

### Table & Data (3 components)
- **Table** — Full-featured data table with sort, filter, paginate, select, export. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/table.md)
- **Advanced Filter** — Visual filter builder for complex expressions. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/advanced-filter.md)
- **Empty State** — No-data placeholder with icon and actions. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/empty-state.md)

## Quick Reference by Use Case

| Use Case | Components |
|----------|-----------|
| Form building | TextField, TextArea, Select, Checkbox, RadioButton, Switch, DateTime, Counter, Rating, Uploader |
| Data display | Table, Empty State |
| Data visualization | Area Graph, Pie Chart, Stacked Chart, Heatmap, Treemap, Scatter Plot |
| Navigation/layout | Carousel, Multi-Card, Steps, Accordion |
| Actions | Button, Button Group, Dropdown |
| Filtering | Search, Advanced Filter |
| Feedback | Progress, Tooltip |

## Icon Usage

BMC-UX provides the DPL icon font:

```html
<button adapt-button><i class="d-icon-add"></i> Add</button>
<i class="d-icon-home"></i>
<i class="d-icon-user"></i>
<i class="d-icon-settings"></i>
<i class="d-icon-edit"></i>
<i class="d-icon-delete"></i>
<i class="d-icon-save"></i>
<i class="d-icon-close"></i>
<i class="d-icon-check"></i>
<i class="d-icon-search"></i>
```

## Standalone Component Import Pattern

```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdaptRxTextfieldComponent,
    AdaptButtonModule,
    AdaptModalModule,
    AdaptTableModule
  ]
})
export class MyComponent {}
```

For detailed per-component documentation with full API, properties, and examples, see the individual `.md` files linked above in `.cursor/_instructions/UI/AdaptComponents/`.

Also see the larger reference guides:
- `.cursor/rules/bmc-ux-adapt-form-controls.md`
- `.cursor/rules/bmc-ux-adapt-ui-components.md`
- `.cursor/rules/bmc-ux-adapt-charts.md`
- `.cursor/rules/bmc-ux-adapt-table.md`

</section>

---

<section file="cookbook/06-java-backend.md">

# Java Backend Services

## Overview

Innovation Studio backend extends the platform using Java 17 (OpenJDK), OSGi modules, JAX-RS for REST, Jackson for JSON, Spring for DI, and SLF4J for logging.

## Service Types

| Type | When to Use | Returns |
|------|-------------|---------|
| **Process Activity** | Business logic in BPMN processes, callable from rules | Response DTO |
| **REST API** | Custom endpoints for external/internal HTTP clients | JSON response |
| **Command** | Fire-and-forget operations | Status code |
| **DataPageQuery** | Custom paginated data sources | DataPage object |

## File Location

Java files go in `bundle/src/main/java/com/<group>/<app>/bundle/`:
- `*ProcessActivity.java` — Process activities
- `*ResponsePayload.java` — Response DTOs
- `*Rest.java` — REST API resources
- `MyApplication.java` — Bundle activator (register services here)

## Process Activity

### Template

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.Service;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.AuthorizationLevel;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.LicensingLevel;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import com.bmc.arsys.rx.application.common.ServiceLocator;
import org.springframework.transaction.annotation.Isolation;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class MyProcessActivity implements Service {

    @Action(name = "myAction", scope = Action.Scope.PUBLIC)
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AuthorizationLevel.ValidUser,
        licensing = LicensingLevel.Application,
        checkSchemaForSpecialAccess = true,
        promoteStructAdmin = true
    )
    public MyResponsePayload execute(
        @ActionParameter(name = "inputParam") @NotBlank @NotNull String inputParam
    ) {
        MyResponsePayload response = new MyResponsePayload();
        try {
            // Business logic here
            response.setSuccess(true);
            response.setResult("Processed: " + inputParam);
        } catch (Exception e) {
            ServiceLocator.getLogger().error("Error in myAction: " + e.getLocalizedMessage());
            response.setSuccess(false);
            response.setErrorMessage(e.getLocalizedMessage());
        }
        return response;
    }
}
```

### Response Payload Template

```java
package com.example.bundle;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MyResponsePayload {
    @JsonProperty
    private boolean success;

    @JsonProperty
    private String result;

    @JsonProperty
    private String errorMessage;

    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
```

## REST API

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.common.RestfulResource;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("myapi")
public class MyRestApi implements RestfulResource {

    // URL: /api/<bundleId>/myapi/endpoint/{param}
    @GET
    @Path("/endpoint/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AccessControlledMethod.AuthorizationLevel.ValidUser,
        licensing = AccessControlledMethod.LicensingLevel.Application
    )
    public MyResponsePayload getEndpoint(@PathParam("param") String param) {
        // Business logic
        return new MyResponsePayload();
    }
}
```

## Command

See `.cursor/_instructions/Java/ObjectTypes/command.md` for command implementation details.

## DataPageQuery

See `.cursor/_instructions/Java/ObjectTypes/datapagequery.md` for custom data source implementation.

## Service Registration

**File**: `MyApplication.java` — add in `register()` method, BEFORE `registerStaticWebResource()`:

```java
registerService(new MyProcessActivity());
registerService(new MyRestApi());
```

Do NOT remove existing registrations or commented code.

## Available Platform Services

| Service | Entry Point | Purpose |
|---------|-------------|---------|
| RecordService | `com.bmc.arsys.rx.services.record.RecordService` | CRUD on record instances |
| CacheService | `com.bmc.arsys.rx.services.cache.CacheService` | Bundle-scoped caching |
| Logger | `ServiceLocator.getLogger()` | Logging |

See `.cursor/_instructions/Java/Services/records.md` and `.cursor/_instructions/Java/Services/cache.md` for details.

## Third-Party Libraries

- Add Maven dependencies to `/bundle/pom.xml`
- Must be compatible with OpenJDK 17
- No GPL-licensed libraries
- Add `Embed-Transitive=true` to `maven-bundle-plugin` for OSGi embedding:

```xml
<plugin>
  <groupId>org.apache.felix</groupId>
  <artifactId>maven-bundle-plugin</artifactId>
  <configuration>
    <instructions>
      <Embed-Dependency>*;scope=compile|runtime</Embed-Dependency>
      <Embed-Transitive>true</Embed-Transitive>
    </instructions>
  </configuration>
</plugin>
```

## NPM Third-Party Libraries (Frontend)

- Add to `/bundle/src/main/webapp/libs/<application-name>/package.json` (NOT the root `package.json`)
- Must be compatible with Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1
- Avoid pure JavaScript libraries without TypeScript types
- No GPL-licensed libraries

## Key Rules

- **@RxDefinitionTransactional** — Only on REST endpoints, NOT on internal services called by Rules/Processes
- **Dates** — Always epoch milliseconds (`System.currentTimeMillis()`), never ISO 8601
- **Required fields** — Always set Status (field 7) and Description (field 8) on record creation
- **Attachments** — Persist AFTER parent record creation, never before
- **No threads** — Code must be synchronous; no `Thread`, `sleep`, `synchronized`
- **No file I/O** — Don't read/write filesystem; use RecordService for persistence
- **No static state** — Write stateless code; use CacheService for caching
- **Error handling** — Always log exceptions via `ServiceLocator.getLogger()`, never swallow

</section>

---

<section file="cookbook/07-process-definitions.md">

# Process Definitions (.def Files)

## Overview

Process definitions are BPMN workflows stored as `.def` files in `/package/src/main/definitions/db/process/`. They wrap Java `@Action` services into callable processes that can be triggered from views, rules, or other processes.

## Two Patterns

| Pattern | Flow | When to Use |
|---------|------|-------------|
| **A — Stub** | Start → End | Mock/placeholder with hardcoded defaults |
| **B — Service-Invoking** | Start → ServiceTask → End | Production — calls a registered Java @Action |

Pattern B is recommended for production use.

## .def File Format

NOT pure JSON. Each line in the definition block is prefixed with `   definition     : `:

```
begin process definition
   name           : com.example.sample-application:myProcess
   definition     : {
   definition     :   "version": null,
   definition     :   "name": "com.example.sample-application:myProcess",
   definition     :   ...JSON content...
   definition     : }
end
```

## Step-by-Step: Service-Invoking Process

### Step 1 — Analyze the Java Service

From the `@Action` class, extract:
- `@Action(name = "...")` → `actionTypeName`
- `@ActionParameter(name = "...")` → input parameter names
- `@NotBlank @NotNull` → required vs optional
- Response payload `@JsonProperty` fields → output mappings

### Step 2 — Assign Field IDs

- Input params: start at `536870913`, increment
- Output params: start at `536870912`, increment
- Shift output IDs higher if overlap with inputs

### Step 3 — Map Java Types

| Java Type | resourceType | storageTypeClass |
|-----------|-------------|------------------|
| `String` | `CharacterFieldDefinition` | `CharacterFieldStorageType` |
| `Integer`/`int` | `IntegerFieldDefinition` | `IntegerFieldStorageType` |
| `Boolean` | `CharacterFieldDefinition` | `CharacterFieldStorageType` |

### Step 4 — Generate GUIDs

Every node needs `rx-<uuid-v4>`:
- Process itself
- StartEventDefinition
- EndEventDefinition
- ServiceTaskDefinition
- Each SequenceFlowDefinition (2 for Pattern B)

### Step 5 — Build ServiceTaskDefinition

```json
{
  "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
  "name": "Execute My Action",
  "guid": "rx-<uuid>",
  "actionTypeName": "<bundleId>:<actionName>",
  "inputMap": [
    { "assignTarget": "<@ActionParameter name>", "expression": "${processContext.<inputFieldId>}" }
  ],
  "outputMap": [
    { "assignTarget": "<outputFieldId>", "expression": "${activityResults.<taskGuid>.output.<@JsonProperty name>}" }
  ]
}
```

Key rules:
- `actionTypeName` = `<bundleId>:<@Action name>`
- `inputMap[].assignTarget` = exact `@ActionParameter(name = "...")` value
- `outputMap[].expression` = `${activityResults.<taskGuid>.output.<fieldName>}`

### Step 6 — Layout JSON

Layout uses JointJS format with cell IDs that OMIT the `rx-` prefix:

- StartEvent: `{"x": 50, "y": 375}`, type `rx.StartEvent`
- ServiceTask: `{"x": 430, "y": 360}`, type `rx.ProcessAction`
- EndEvent: `{"x": 900, "y": 375}`, type `rx.EndEvent`

## Checklist

- [ ] File location: `db/process/<processName>.def`
- [ ] Process name: `<bundleId>:<processName>`
- [ ] All GUIDs unique `rx-<uuid>` format
- [ ] `actionTypeName` matches Java `@Action(name)`
- [ ] Every `@ActionParameter` has inputParam + inputMap entry
- [ ] `inputMap[].assignTarget` matches `@ActionParameter(name)` exactly
- [ ] `outputMap[].expression` references correct `@JsonProperty` field names
- [ ] Required params: `"fieldOption": "REQUIRED"`, optional: `"OPTIONAL"`
- [ ] Layout cell IDs match GUIDs without `rx-` prefix
- [ ] SequenceFlow chains: Start → ServiceTask → End
- [ ] `"synchronous": true` for immediate-return processes
- [ ] Every definition line prefixed with `   definition     : `

## Deployment Warning

Deploy the JAR first before .def files. If deployed together and the @Action isn't yet activated in OSGi, you'll get `ERROR 930: Action type does not exist on server`.

For the complete detailed guide with full JSON templates, see `.cursor/_instructions/Java/Template/create-process-definition.md` and `.cursor/rules/bmc-helix-process-definition.mdc`.

</section>

---

<section file="cookbook/08-build-deploy.md">

# Build and Deploy

## Docker Environment

All build/deploy commands run inside the Docker container:

```bash
# Execute command
docker exec bmc-helix-innovation-studio bash -c "<command>"

# Interactive shell
docker exec -it bmc-helix-innovation-studio bash
```

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

## Docker Bind Mount Sync (Critical)

Docker Desktop bind mounts can silently stop syncing host file changes.

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

</section>

---

<section file="cookbook/09-best-practices.md">

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

</section>

---

<section file="cookbook/10-checklists.md">

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

</section>

---

<section file="cookbook/11-troubleshooting.md">

# Troubleshooting

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

### Component Not in View Designer Palette
**Causes**:
1. Missing export in `index.ts`
2. Missing import in main module
3. Docker bind mount stale

**Fix**: Verify both files, then check if component type appears in compiled JS:
```bash
grep -c '<type-string>' dist/apps/shell/libs_*_src_index_ts*.js
```

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

## Backend Issues

### Docker Bind Mount Desync (Most Common)
**Symptom**: Build succeeds, deploys, but new action doesn't appear
**Cause**: Docker Desktop VirtioFS/gRPC-FUSE silently stops syncing

**Diagnosis**:
```bash
docker exec bmc-helix-innovation-studio bash -c \
  "ls -la /workspace/<your-project>/bundle/src/main/java/com/example/bundle/MyApplication.java"
```

**Fix**: `docker cp` all changed files into container

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

## Manifest vs JS Bundle Mismatch

The manifest can list a component even when it's NOT in the compiled JS. Always verify:

```bash
# What the manifest says
cat dist/apps/shell/<app-name>.json | python3 -m json.tool

# What's actually compiled
grep -o '<app-name>-<app-name>-[a-z-]*' dist/apps/shell/libs_*_src_index_ts*.js | sort -u
```

If component is in manifest but not in grep output, the container has stale `index.ts` or main module.

</section>

---

<section file="cookbook/12-glossary.md">

# Glossary

## Application Name
The project identifier found in `/bundle/src/main/webapp/angular.json` under `projects`. Determines the path where Angular code lives: `/bundle/src/main/webapp/libs/<application-name>/`.

## Bundle
An Innovation Studio application package containing custom Java code, configurations, and resources. Each bundle is an OSGi module.

## Bundle ID (bundleId)
Unique identifier: `<groupId>.<artifactId>` from `/bundle/pom.xml`. Example: `com.example.sample-application`. Used for record definition names, REST API URLs, and component type strings.

## Component Type String
Fully qualified identifier for a view component: `<application-name>-<application-name>-<component-name>`. Must be identical in registration `type`, runtime `@RxViewComponent({ name })`, and runtime `selector`.

## Data Dictionary
In View Designer, the treeview showing inputs/outputs of all components and actions on a view. Used by the expression builder to wire components together. Set via `setSettablePropertiesDataDictionary` and `setCommonDataDictionary` in the design model.

## DataPageQuery
A Java component that queries data from various sources and returns paginated results as a DataPage object. Can be custom-built for non-standard data sources.

## Field ID (fieldId)
Integer identifier for a field within a Record Definition. Standard fields: 1 (Request ID), 7 (Status), 8 (Description), 379 (GUID). Custom fields start at 536870913.

## Process Activity
A reusable Java component callable from BPMN processes. Implemented as a Service with methods decorated with `@Action`. Registered in `MyApplication.java`.

## Process Definition
A BPMN workflow stored as a `.def` file in `/package/src/main/definitions/db/process/`. Orchestrates process activities and other tasks.

## Qualification
A string-based filter expression (similar to SQL WHERE clause) using field IDs and operators. Used in both Java backend and Angular frontend for data filtering.

## Record Definition
Data schema in Innovation Studio (like a database table). Stored as `.def` files in `/package/src/main/definitions/db/record/`. Identified by `<bundleId>:<recordDefinitionName>`.

## Record Instance
Individual data entry (row) within a Record Definition. Each has a unique GUID and field values.

## Registration Module
An `@NgModule` class that registers a view component or action with the platform via `RxViewComponentRegistryService` or `RxViewActionRegistryService`.

## Settable Properties
View component properties that can be set at runtime via the "Set Property" view action. Declared in the design model's `setSettablePropertiesDataDictionary`.

## ServiceLocator
Utility class (`com.bmc.arsys.rx.application.common.ServiceLocator`) for accessing Innovation Studio services (RecordService, CacheService, Logger) in Java code.

## Standalone View Component
An Angular component registered with the platform that can be used independently in any view. Not tied to a specific record definition field.

## Record Editor Field View Component
An Angular component designed to be used within a record editor, mapped to a specific record definition field.

## View Action
An Angular service that executes logic in response to UI events. Implements `execute()` returning an Observable. Registered via `RxViewActionRegistryService`.

## View Definition
A `.def` file describing a complete Innovation Studio view (UI layout combining components, actions, and data bindings). Stored in `/package/src/main/definitions/db/view/`.

</section>

---

<section file="cookbook/13-requirement-gathering.md">

# Requirement Gathering

Use this guide to systematically gather requirements before building a View Component or Java Service. Ask questions conversationally — do not dump the entire list at once.

## Section 1: What Are You Building?

| # | Question | Options |
|---|----------|---------|
| 1.1 | Artifact type? | **View Component** / **Java Service** / **Both** |
| 1.2 | One-sentence description? | _e.g., "Kanban board of tickets grouped by status"_ |
| 1.3 | Name (kebab-case)? | _e.g., `ticket-kanban-board`_ |

## Section 2: View Component Questions

### Category & Layout
| # | Question | Options |
|---|----------|---------|
| 2A.1 | Category? | Data Table / Create Form / Detail View / Kanban Board / Dashboard/Chart / Interactive Utility / Display Only / Custom Widget |
| 2A.2 | Title bar/header? | Yes / No |
| 2A.3 | Conditionally visible? | Yes / No |
| 2A.4 | View Designer group? | _e.g., `Sample App`_ |
| 2A.5 | Palette icon? | `table` / `edit` / `plus-circle` / `calculator` / `bar-chart` / other |

### Data Source
| # | Question | Options |
|---|----------|---------|
| 2B.1 | Uses record data? | Yes / No |
| 2B.2 | Which record definition(s)? | _e.g., `com.example:Contacts`_ |
| 2B.3 | Record def configurable? | Inspector property / Hardcoded |
| 2B.4 | Fields to display (ID=Name)? | _e.g., `536870913=Name, 536870914=Phone`_ |
| 2B.5 | Include standard fields? | Yes (1,2,3,5,6,7,8,16,379) / Specific / No |

### CRUD
| # | Question | Options |
|---|----------|---------|
| 2C.1 | Operations? | Read / Create / Update / Delete / Multiple |
| 2C.2 | Create form fields? | _List field IDs, names, types_ |
| 2C.3 | Required fields? | _List field IDs_ |
| 2C.4 | Validation rules? | _e.g., max length, regex, range_ |
| 2C.5 | Edit mode? | Inline / Modal / Separate view |
| 2C.6 | Delete confirmation? | Yes / No |
| 2C.7 | After success? | Refresh list / Toast / Navigate / Emit event |

### Filtering, Sorting, Pagination
| # | Question | Options |
|---|----------|---------|
| 2D.1 | Filtering? | Yes / No |
| 2D.2 | Sortable columns? | Yes (which) / No |
| 2D.3 | Pagination? | Yes / No |
| 2D.4 | Default page size? | 10 / 25 / 50 / 100 |

### UI & Styling
| # | Question | Options |
|---|----------|---------|
| 2G.1 | Adapt components? | Yes (which: table, charts, buttons, etc.) / Plain HTML |
| 2G.2 | Loading indicator? | Yes / No |
| 2G.3 | Empty state message? | Yes / No |
| 2G.4 | Error state display? | Yes / No |

### Property Inspector
| # | Question | Options |
|---|----------|---------|
| 2H.1 | Configurable properties? | _List with types_ |
| 2H.2 | Form controls per property? | TextFormControl / SwitchFormControl / NumberFormControl / SelectFormControl |
| 2H.3 | Expression evaluation support? | Yes (which properties) / No |
| 2H.4 | Expose Set Property action? | Yes (which properties) / No |
| 2H.5 | Default values? | _e.g., title="My Component", pageSize="25"_ |

## Section 3: Java Service Questions

### Service Type
| # | Question | Options |
|---|----------|---------|
| 3A.1 | Type? | Process Activity / REST API / Command / DataPageQuery |
| 3A.2 | Description? | _One sentence_ |
| 3A.3 | Class name? | _PascalCase, e.g., `IncidentFetcherProcessActivity`_ |
| 3A.4 | Scope.PUBLIC? | Yes / No |

### Inputs & Outputs
| # | Question | Options |
|---|----------|---------|
| 3B.1 | Input parameters? | _Name, type, required/optional_ |
| 3B.2 | Validation rules? | @NotNull / @NotBlank / custom |
| 3C.1 | Record operations? | Query / Read / Create / Update / Delete / Multi-step |
| 3D.1 | Return type? | Simple value / Response DTO / Markdown table / JSON |
| 3D.2 | DTO fields? | _Name, type, description_ |

### Process Definition
| # | Question | Options |
|---|----------|---------|
| 3G.1 | Needs .def file? | Yes / No (REST API doesn't need one) |
| 3G.2 | Process name? | _e.g., `com.example:fetchIncident`_ |

## Section 4: Both (UI + Backend)

| # | Question | Options |
|---|----------|---------|
| 4.1 | How does UI call backend? | Direct REST / Via Process / Via DataPage |
| 4.2 | Data flow? | Component → REST → Java → Response → Component renders |
| 4.3 | Reusable backend? | Yes (generic, Scope.PUBLIC) / No (tightly coupled) |

## Reference Examples (in `.cursor/_instructions/`)

| Example | Type | Location |
|---------|------|----------|
| pizza-ordering | View Component | `.cursor/_instructions/UI/ObjectTypes/Examples/StandaloneViewComponent/pizza-ordering/` |
| calculate-vat | View Action | `.cursor/_instructions/UI/ObjectTypes/Examples/ViewAction/calculate-vat/` |
| SimpleRest | REST API | `.cursor/_instructions/Java/ObjectTypes/Examples/RestApi/SimpleRest.java` |
| SimpleCommand | Command | `.cursor/_instructions/Java/ObjectTypes/Examples/Command/SimpleCommand.java` |
| SimpleDataPageQuery | DataPageQuery | `.cursor/_instructions/Java/ObjectTypes/Examples/DataPageQuery/SimpleDataPageQuery.java` |

</section>

---

