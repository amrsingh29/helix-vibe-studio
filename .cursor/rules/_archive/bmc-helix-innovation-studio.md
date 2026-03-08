# BMC Helix Innovation Studio Development Guide

## Project Structure

```
workspace/sample-app/
├── bundle/
│ ├── src/main/webapp/ # Frontend code
│ │ ├── libs/
│ │ │ └── com-mycompany-sample-app/ # Your library
│ │ │ └── src/lib/
│ │ │ ├── view-components/ # Custom view components
│ │ │ ├── actions/ # Custom actions
│ │ │ ├── assets/ # Static assets
│ │ │ ├── i18n/ # Translations
│ │ │ └── styles/ # Global styles
│ │ ├── apps/shell/ # Shell application
│ │ ├── dist/ # Build output
│ │ └── node_modules/ # Dependencies
│ └── pom.xml # Maven config
├── package/ # Deployment package
│ ├── src/main/definitions/ # Record definitions
│ └── pom.xml
└── pom.xml # Root Maven config
```

---

## Custom View Components

### Overview

Custom view components are Angular standalone components that extend View Designer functionality. Each component has:
- **Design Component**: Preview and configuration in View Designer
- **Runtime Component**: Actual execution in views
- **Registration Module**: Registers component with the platform
- **Types File**: TypeScript interfaces for properties

### Component Structure

```
view-components/my-component/
├── my-component.types.ts # Interfaces
├── my-component-registration.module.ts # Registration
├── design/ # Design-time
│ ├── my-component-design.component.ts
│ ├── my-component-design.component.html
│ ├── my-component-design.component.scss
│ ├── my-component-design.model.ts # Property inspector config
│ └── my-component-design.types.ts
└── runtime/ # Runtime
 ├── my-component.component.ts
 ├── my-component.component.html
 └── my-component.component.scss
```

### Generation Commands

#### Using Schematics (Interactive)

All schematic commands should be run from the webapp directory:

```bash
# Navigate to webapp directory (inside Docker)
cd /workspace/sample-app/bundle/src/main/webapp

# Generate View Component
npx nx g @helix/schematics:create-view-component

# Generate Record Editor Field View Component
npx nx g @helix/schematics:create-record-editor-field-view-component

# Generate View Action
npx nx g @helix/schematics:create-view-action

# Generate Inspectable Component
npx nx g @helix/schematics:create-inspectable-component

# Generate Action
npx nx g @helix/schematics:create-action

# Generate Service
npx nx g @helix/schematics:create-service

# Generate Initializer
npx nx g @helix/schematics:create-initializer
```

#### Using Schematics (Non-Interactive with Options)

To avoid interactive prompts, provide all required options:

```bash
# View Component with options
npx nx g @helix/schematics:create-view-component \
  --name="my-component" \
  --project="com-mycompany-sample-app" \
  --group="Sample App" \
  --no-interactive

# View Action with options
npx nx g @helix/schematics:create-view-action \
  --name="my-action" \
  --project="com-mycompany-sample-app" \
  --no-interactive

# Record Editor Field View Component with options
npx nx g @helix/schematics:create-record-editor-field-view-component \
  --name="my-field" \
  --project="com-mycompany-sample-app" \
  --group="Sample App" \
  --no-interactive
```

#### Docker Execution

Run schematics inside Docker container:

```bash
# Interactive mode
docker exec -it bmc-helix-innovation-studio bash -c "cd /workspace/sample-app/bundle/src/main/webapp && npx nx g @helix/schematics:create-view-component"

# Non-interactive mode (recommended for automation)
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app/bundle/src/main/webapp && npx nx g @helix/schematics:create-view-component --name='my-component' --project='com-mycompany-sample-app' --group='Sample App' --no-interactive"
```

#### Common Schematic Options

| Option | Description | Required | Example |
|--------|-------------|----------|---------|
| `--name` | Component/Action name (kebab-case) | Yes | `my-component` |
| `--project` | Library name | Yes | `com-mycompany-sample-app` |
| `--group` | Component group in View Designer | No | `Sample App` |
| `--no-interactive` | Skip interactive prompts | No | - |
| `--dry-run` | Preview changes without creating files | No | - |
| `--skip-import` | Skip adding to module imports | No | - |

#### Schematic Prompts (Interactive Mode)

When running interactively, schematics will prompt for:

**View Component**:
- Component name (kebab-case)
- Component selector prefix
- Library/Project name
- Component group for View Designer
- Whether to export in module

**View Action**:
- Action name (kebab-case)
- Library/Project name
- Whether to export in module

**Record Editor Field**:
- Field component name (kebab-case)
- Library/Project name
- Component group for View Designer
- Field type (text, number, date, etc.)

#### Manual Creation (Recommended for Docker)

**Advantages**:
- Full control over file structure
- No interactive prompts blocking in Docker
- Can use existing components as templates
- Faster for experienced developers

**Process**:
1. Copy existing component folder as template
2. Rename files and update component names
3. Update TypeScript classes and decorators
4. Register in main module
5. Export in index.ts

**Note**: Schematics are interactive by default and may block in Docker environments. For automated workflows or Docker execution, either use `--no-interactive` with all required options or create files manually using existing components as templates.

### Runtime Component Template

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { RxViewComponent } from '@helix/platform/view/api';
import { IMyComponentProperties } from '../my-component.types';

@Component({
 selector: 'com-mycompany-sample-app-com-mycompany-sample-app-my-component',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './my-component.component.html',
 styleUrls: ['./my-component.component.scss']
})
@RxViewComponent({
 name: 'com-mycompany-sample-app-com-mycompany-sample-app-my-component'
})
export class MyComponentComponent implements OnInit, OnDestroy {
 private destroyed$ = new Subject<void>();
 
 // Configuration observable
 config: Observable<IMyComponentProperties>;
 
 // API methods exposed to custom actions
 api = {
 setProperty: this.setProperty.bind(this),
 refresh: this.refresh.bind(this),
 // Add more API methods as needed
 };
 
 protected state: IMyComponentProperties;
 
 constructor(private http: HttpClient) {}
 
 ngOnInit(): void {
 this.config.pipe(takeUntil(this.destroyed$)).subscribe(config => {
 this.state = config;
 // Initialize component with config
 });
 }
 
 ngOnDestroy(): void {
 this.destroyed$.next();
 this.destroyed$.complete();
 }
 
 private setProperty(propertyPath: string, propertyValue: any): void | Observable<never> {
 // Handle property changes
 this.notifyPropertyChanged(propertyPath, propertyValue);
 }
 
 private notifyPropertyChanged(propertyPath: string, value: any): void {
 // Notify platform of property changes
 }
}
```

### Design Model Template

```typescript
import { ViewDesignerComponentModel } from '@helix/platform/view/designer';
import { IViewDesignerComponentModel } from '@helix/platform/view/api';
import { TextFormControlComponent, SwitchFormControlComponent } from '@helix/platform/shared/components';
import { IMyComponentDesign } from './my-component-design.types';

export class MyComponentDesignModel extends ViewDesignerComponentModel implements IViewDesignerComponentModel<IMyComponentDesign> {
 constructor() {
 super();
 
 // Set default property values
 this.properties = {
 name: '',
 title: 'My Component',
 // Add more defaults
 };
 }
 
 getInspectorConfig() {
 return [
 {
 name: 'General',
 groups: [
 {
 label: 'Settings',
 controls: [
 {
 name: 'title',
 component: TextFormControlComponent,
 options: {
 label: 'Title',
 tooltip: 'Component title'
 }
 },
 {
 name: 'enabled',
 component: SwitchFormControlComponent,
 options: {
 label: 'Enabled',
 tooltip: 'Enable/disable component'
 }
 }
 ]
 }
 ]
 }
 ];
 }
}
```

### Registration Module Template

```typescript
import { NgModule } from '@angular/core';
import { RxViewComponentRegistryService } from '@helix/platform/view/api';
import { MyComponentComponent } from './runtime/my-component.component';
import { MyComponentDesignComponent } from './design/my-component-design.component';
import { MyComponentDesignModel } from './design/my-component-design.model';

@NgModule()
export class MyComponentRegistrationModule {
 constructor(private rxViewComponentRegistryService: RxViewComponentRegistryService) {
 this.rxViewComponentRegistryService.register({
 type: 'com-mycompany-sample-app-com-mycompany-sample-app-my-component',
 name: 'My Component',
 group: 'Sample App',
 icon: 'table',
 component: MyComponentComponent,
 designComponent: MyComponentDesignComponent,
 designComponentModel: MyComponentDesignModel,
 properties: ['title', 'enabled']
 });
 }
}
```

### Component Integration

After creating a component, register it in the main module:

**File**: `libs/com-mycompany-sample-app/src/lib/com-mycompany-sample-app.module.ts`

```typescript
import { MyComponentRegistrationModule } from './view-components/my-component/my-component-registration.module';

@NgModule({
 imports: [
 CommonModule,
 MyComponentRegistrationModule,
 // Other modules
 ]
})
export class ComMycompanySampleAppModule {}
```

**File**: `libs/com-mycompany-sample-app/src/index.ts`

```typescript
export * from './lib/view-components/my-component/my-component-registration.module';
```

---

## REST API Integration

### DataPage API (Recommended for Queries)

Use for fetching record instances with filtering, sorting, and pagination.

**Endpoint**: `POST /api/rx/application/datapage`

**Headers**:
```typescript
{
 'Content-Type': 'application/json',
 'X-Requested-By': 'XMLHttpRequest'
}
```

**Request Payload**:
```typescript
{
 values: {
 dataPageType: 'com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery',
 pageSize: '50', // Number of records
 startIndex: '0', // Offset for pagination
 recorddefinition: 'com.mycompany.sample-app:Record Name',
 shouldIncludeTotalSize: 'false', // Set to 'true' for total count
 propertySelection: '1,2,3,4,5,6,7,8,16,379,536870913,536870914,536870915',
 queryExpression: '' // Optional: Filter query
 }
}
```

**Query Expression Examples**:
```typescript
// Filter by name field (536870913)
queryExpression: "'536870913' LIKE \"%John%\""

// Multiple conditions
queryExpression: "'536870913' LIKE \"%John%\" AND '536870914' != \"\""

// Numeric comparison
queryExpression: "'536870916' > 100"
```

**Response Format**:
```json
{
 "data": [
 {
 "1": "record-id",
 "536870913": "John Doe",
 "536870914": "+1234567890",
 "536870915": "john@example.com"
 }
 ]
}
```

**Implementation Example**:
```typescript
loadRecords(): void {
 this.loading = true;
 this.error = '';
 
 const url = '/api/rx/application/datapage';
 const payload = {
 values: {
 dataPageType: 'com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery',
 pageSize: '1000',
 startIndex: '0',
 recorddefinition: 'com.mycompany.sample-app:Contact Book',
 shouldIncludeTotalSize: 'false',
 propertySelection: '1,2,3,4,5,6,7,8,16,379,536870913,536870914,536870915'
 }
 };
 
 const headers = new HttpHeaders({
 'Content-Type': 'application/json',
 'X-Requested-By': 'XMLHttpRequest'
 });
 
 this.http.post<any>(url, payload, { headers })
 .pipe(
 catchError(error => {
 console.error('Error loading records:', error);
 this.error = 'Failed to load records';
 this.loading = false;
 return throwError(error);
 }),
 takeUntil(this.destroyed$)
 )
 .subscribe(response => {
 this.records = response.data.map((record: any) => ({
 id: record['1'] || record.id,
 name: record['536870913'] || '',
 phone: record['536870914'] || '',
 email: record['536870915'] || ''
 }));
 this.loading = false;
 });
}
```

### Record Instance API (For Create/Update/Delete)

**Create Record**:

**Endpoint**: `POST /api/rx/application/record/recordinstance`

**Payload**:
```typescript
{
 id: null,
 resourceType: 'com.bmc.arsys.rx.services.record.domain.RecordInstance',
 displayId: null,
 recordDefinitionName: 'com.mycompany.sample-app:Contact Book',
 permittedGroupsBySecurityLabels: null,
 permittedUsersBySecurityLabels: null,
 permittedRolesBySecurityLabels: null,
 fieldInstances: {
 '8': {
 resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance',
 id: 8,
 value: '.', // Status field (required)
 permissionType: 'CHANGE'
 },
 '536870913': {
 resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance',
 id: 536870913,
 value: 'John Doe',
 permissionType: 'CHANGE'
 },
 '536870914': {
 resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance',
 id: 536870914,
 value: '+1234567890',
 permissionType: 'CHANGE'
 }
 }
}
```

**Implementation Example**:
```typescript
createRecord(data: any): void {
 const url = '/api/rx/application/record/recordinstance';
 const payload = {
 id: null,
 resourceType: 'com.bmc.arsys.rx.services.record.domain.RecordInstance',
 displayId: null,
 recordDefinitionName: this.RECORD_DEFINITION,
 permittedGroupsBySecurityLabels: null,
 permittedUsersBySecurityLabels: null,
 permittedRolesBySecurityLabels: null,
 fieldInstances: {
 '8': {
 resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance',
 id: 8,
 value: '.',
 permissionType: 'CHANGE'
 },
 [this.FIELD_ID]: {
 resourceType: 'com.bmc.arsys.rx.services.record.domain.FieldInstance',
 id: parseInt(this.FIELD_ID),
 value: data.value,
 permissionType: 'CHANGE'
 }
 }
 };
 
 const headers = new HttpHeaders({
 'Content-Type': 'application/json',
 'X-Requested-By': 'XMLHttpRequest'
 });
 
 this.http.post<any>(url, payload, { headers })
 .pipe(
 catchError(error => {
 console.error('Error creating record:', error);
 return throwError(error);
 }),
 takeUntil(this.destroyed$)
 )
 .subscribe(response => {
 console.log('Record created:', response);
 this.loadRecords(); // Refresh data
 });
}
```

### Common Field IDs

| Field ID | Field Name | Description |
|----|---|----|
| 1 | Request ID | Unique record identifier |
| 2 | Submitter | User who created the record |
| 3 | Create Date | Record creation timestamp |
| 5 | Last Modified By | User who last modified |
| 6 | Modified Date | Last modification timestamp |
| 7 | Status | Record status |
| 8 | Short Description | Brief description (often required) |
| 16 | Status History | Status change history |
| 379 | GUID | Global unique identifier |

---

## Build and Deployment

### Docker Environment

All commands should run inside the Docker container:

```bash
# Execute command in container
docker exec bmc-helix-innovation-studio bash -c "<command>"

# Interactive shell
docker exec -it bmc-helix-innovation-studio bash
```

### Build Process

**1. Frontend Build Only**:
```bash
cd /workspace/sample-app/bundle/src/main/webapp
npm run build
```

**2. Full Build (Frontend + Backend)**:
```bash
cd /workspace/sample-app
mvn clean install -DskipTests
```

**3. Build and Deploy**:
```bash
cd /workspace/sample-app
mvn clean install -Pdeploy -DskipTests
```

### Deployment Configuration

**File**: `workspace/sample-app/pom.xml`

```xml
<properties>
 <developerUserName>Demo</developerUserName>
 <developerPassword>password</developerPassword>
 <webUrl>https://your-server.com</webUrl>
</properties>
```

### Build Output

- **Frontend**: `bundle/src/main/webapp/dist/apps/shell/`
- **JAR**: `bundle/target/com.mycompany.sample-app-1.0.0-SNAPSHOT.jar`
- **Package**: `package/target/com.mycompany.sample-app-1.0.0-SNAPSHOT.zip`

### Deployment Verification

After deployment:
1. Check deployment status in Maven output
2. Look for: `Final Status:Deployed`
3. Note the status URI for tracking
4. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
5. Logout and login to BMC Helix
6. Refresh View Designer

---

## Common Issues and Solutions

### Angular Template Parsing Errors

**Issue**: `Incomplete block "example". If you meant to write the @ character...`

**Cause**: Angular interprets `@` as control flow syntax

**Solution**: Escape `@` in HTML templates:
```html
<!-- Wrong -->
<td>john.doe@example.com</td>

<!-- Correct -->
<td>john.doe&#64;example.com</td>
```

### Form Control Components

**Available Form Controls**:
- `TextFormControlComponent` - Text input
- `SwitchFormControlComponent` - Toggle switch (boolean)
- `NumberFormControlComponent` - Number input
- `SelectFormControlComponent` - Dropdown select

**Not Available**:
- ~~`CheckboxFormControlComponent`~~ - Use `SwitchFormControlComponent` instead

### Component Not Showing After Deployment

**Checklist**:
1. Frontend was rebuilt (`npm run build`)
2. Full build completed successfully
3. Deployment status shows "Deployed"
4. Browser cache cleared (hard refresh)
5. Logged out and back in
6. Component registered in main module
7. Component exported in index.ts

**Cache Clearing**:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **DevTools**: Right-click refresh > "Empty Cache and Hard Reload"

### API 405 Method Not Allowed

**Issue**: GET request to record instance endpoint fails

**Cause**: Wrong HTTP method or endpoint

**Solution**: Use DataPage API with POST:
```typescript
// Wrong
GET /api/rx/application/record/recordinstance/...

// Correct
POST /api/rx/application/datapage
```

### Missing Dependencies

**Issue**: Module not found errors

**Solution**: Install dependencies:
```bash
cd /workspace/sample-app/bundle/src/main/webapp
npm install
```

---

## Best Practices

### Component Development

1. **Standalone Components**: Always use standalone: true for Angular components
2. **Import Modules**: Import CommonModule and FormsModule in component imports
3. **Cleanup**: Always implement OnDestroy and use takeUntil for subscriptions
4. **Error Handling**: Use catchError operator for all HTTP requests
5. **Loading States**: Show loading indicators during async operations
6. **Empty States**: Display helpful messages when no data available

### API Integration

1. **Use DataPage API**: For queries, filtering, and pagination
2. **Use Record Instance API**: For create, update, delete operations
3. **Include Headers**: Always include X-Requested-By header
4. **Error Logging**: Log errors to console for debugging
5. **Field IDs**: Use constants for field IDs, not magic numbers
6. **Property Selection**: Always include standard fields (1,2,3,4,5,6,7,8,16,379)

### Design Components

1. **Preview Data**: Show realistic sample data in design preview
2. **Escape Special Characters**: Use HTML entities for @, <, >, etc.
3. **Inspector Config**: Provide clear labels and tooltips
4. **Default Values**: Set sensible defaults in design model
5. **Validation**: Validate property values in design model

### Registration

1. **Unique Names**: Use full qualified names for component types
2. **Group Organization**: Group related components together
3. **Descriptive Icons**: Choose appropriate icons from available set
4. **Property List**: Include all configurable properties in registration

### Build and Deploy

1. **Build Order**: Always rebuild frontend before full build
2. **Skip Tests**: Use -DskipTests for faster builds during development
3. **Clean Build**: Use `mvn clean` to ensure fresh build
4. **Verify Deployment**: Check deployment status before testing
5. **Clear Cache**: Always clear browser cache after deployment

### Code Organization

1. **File Structure**: Follow standard component structure
2. **Naming Conventions**: Use consistent naming (kebab-case for files)
3. **Type Safety**: Define TypeScript interfaces for all data structures
4. **Comments**: Document complex logic and API integrations
5. **README**: Create README.md for each component

---

## Custom Actions

Custom actions are Angular services that execute logic in response to UI events.

**Generation Commands**:
```bash
# Navigate to webapp folder
cd /workspace/sample-app/bundle/src/main/webapp

# Generate using Nx
npx nx g @helix/schematics:create-view-action

# With options (non-interactive)
npx nx g @helix/schematics:create-view-action \
  --name="my-action" \
  --project="com-mycompany-sample-app" \
  --no-interactive

# Alternative: Using npm script
npm run ng g @helix/schematics:create-view-action

# Alternative: Direct schematics call
npx schematics @helix/schematics:create-view-action

# Legacy format (may not work in newer versions)
yarn run ng g rx-view-action "<action-name>"
```

**Note**: Action schematics are also interactive and will prompt for action name and configuration.

**Key Concepts**:
- Actions execute in a synchronous chain
- Each action can consume output from previous action
- If one action throws error, following actions won't execute
- Use for button clicks, record grid actions, event handlers

### Action Structure

```
actions/my-action/
├── my-action.action.ts           # Action service
├── my-action.action.interface.ts # Action parameters interface
└── my-action.action.module.ts    # Registration module
```

### Action Template

```typescript
import { Injectable } from '@angular/core';
import { RxViewActionService } from '@helix/platform/view/api';
import { Observable, of } from 'rxjs';
import { IMyActionParameters } from './my-action.action.interface';

@Injectable()
export class MyActionService implements RxViewActionService {
  // Action parameters from View Designer
  static readonly TYPE = 'com-mycompany-sample-app-my-action';
  
  execute(parameters: IMyActionParameters): Observable<any> {
    // Action logic here
    console.log('Executing action with parameters:', parameters);
    
    // Return observable with result
    return of({ success: true });
  }
}
```

### Action Registration

```typescript
import { NgModule } from '@angular/core';
import { RxViewActionRegistryService } from '@helix/platform/view/api';
import { MyActionService } from './my-action.action';

@NgModule({
  providers: [MyActionService]
})
export class MyActionModule {
  constructor(
    private rxViewActionRegistryService: RxViewActionRegistryService,
    private myActionService: MyActionService
  ) {
    this.rxViewActionRegistryService.register(
      MyActionService.TYPE,
      this.myActionService
    );
  }
}
```

---

## Available Schematics Reference

### Overview

BMC Helix Innovation Studio provides several schematics through `@helix/schematics` package for generating different types of components and services.

### Schematic Commands Summary

| Schematic | Command | Purpose |
|-----------|---------|---------|
| View Component | `create-view-component` | Custom UI components for View Designer |
| Record Editor Field | `create-record-editor-field-view-component` | Custom field types for record editors |
| View Action | `create-view-action` | Custom actions for UI events |
| Inspectable Component | `create-inspectable-component` | Components with property inspector |
| Action | `create-action` | Generic action services |
| Service | `create-service` | Angular services |
| Initializer | `create-initializer` | Application initializers |

### 1. Create View Component

**Command**:
```bash
npx nx g @helix/schematics:create-view-component
```

**Options**:
```bash
npx nx g @helix/schematics:create-view-component \
  --name="my-component" \
  --project="com-mycompany-sample-app" \
  --group="Sample App" \
  --no-interactive
```

**Generated Files**:
- Runtime component (`.component.ts`, `.html`, `.scss`)
- Design component (`.design.component.ts`, `.html`, `.scss`)
- Design model (`.design.model.ts`)
- Types files (`.types.ts`, `.design.types.ts`)
- Registration module (`.registration.module.ts`)

**Use Cases**:
- Custom data display components
- Interactive widgets
- Data visualization components
- Custom form controls
- Dashboard widgets

### 2. Create Record Editor Field View Component

**Command**:
```bash
npx nx g @helix/schematics:create-record-editor-field-view-component
```

**Options**:
```bash
npx nx g @helix/schematics:create-record-editor-field-view-component \
  --name="my-field" \
  --project="com-mycompany-sample-app" \
  --group="Sample App" \
  --fieldType="text" \
  --no-interactive
```

**Generated Files**:
- Field component (`.component.ts`, `.html`, `.scss`)
- Field design component (`.design.component.ts`, `.html`, `.scss`)
- Field design model (`.design.model.ts`)
- Types files (`.types.ts`)
- Registration module (`.registration.module.ts`)

**Use Cases**:
- Custom input fields for record forms
- Specialized data entry controls
- Validated input fields
- Composite field types
- Rich text editors

### 3. Create View Action

**Command**:
```bash
npx nx g @helix/schematics:create-view-action
```

**Options**:
```bash
npx nx g @helix/schematics:create-view-action \
  --name="my-action" \
  --project="com-mycompany-sample-app" \
  --no-interactive
```

**Generated Files**:
- Action service (`.action.ts`)
- Action interface (`.action.interface.ts`)
- Action module (`.action.module.ts`)

**Use Cases**:
- Button click handlers
- Custom business logic
- API integrations
- Data transformations
- Navigation actions

### 4. Create Inspectable Component

**Command**:
```bash
npx nx g @helix/schematics:create-inspectable-component
```

**Options**:
```bash
npx nx g @helix/schematics:create-inspectable-component \
  --name="my-inspectable" \
  --project="com-mycompany-sample-app" \
  --no-interactive
```

**Generated Files**:
- Component with property inspector support
- Inspector configuration
- Component module

**Use Cases**:
- Components with configurable properties
- Design-time editable components
- Components with visual property editors

### 5. Create Action

**Command**:
```bash
npx nx g @helix/schematics:create-action
```

**Options**:
```bash
npx nx g @helix/schematics:create-action \
  --name="my-generic-action" \
  --project="com-mycompany-sample-app" \
  --no-interactive
```

**Generated Files**:
- Generic action service
- Action interface
- Action module

**Use Cases**:
- Backend operations
- Data processing
- Utility functions
- Service integrations

### 6. Create Service

**Command**:
```bash
npx nx g @helix/schematics:create-service
```

**Options**:
```bash
npx nx g @helix/schematics:create-service \
  --name="my-service" \
  --project="com-mycompany-sample-app" \
  --no-interactive
```

**Generated Files**:
- Angular service (`.service.ts`)
- Service module

**Use Cases**:
- Shared business logic
- Data access services
- Utility services
- State management

### 7. Create Initializer

**Command**:
```bash
npx nx g @helix/schematics:create-initializer
```

**Options**:
```bash
npx nx g @helix/schematics:create-initializer \
  --name="my-initializer" \
  --project="com-mycompany-sample-app" \
  --no-interactive
```

**Generated Files**:
- Initializer service (`.initializer.ts`)
- Initializer module

**Use Cases**:
- Application startup logic
- Configuration loading
- Service initialization
- Pre-loading data

### Schematic Best Practices

1. **Naming Conventions**:
   - Use kebab-case for component/action names
   - Use descriptive names that indicate purpose
   - Avoid generic names like "component1" or "action1"

2. **Project Structure**:
   - Keep related components in same folder
   - Group by feature, not by type
   - Use consistent folder structure

3. **Non-Interactive Mode**:
   - Always use `--no-interactive` in CI/CD pipelines
   - Provide all required options explicitly
   - Use `--dry-run` to preview changes first

4. **Testing Schematics**:
   ```bash
   # Preview without creating files
   npx nx g @helix/schematics:create-view-component \
     --name="test-component" \
     --project="com-mycompany-sample-app" \
     --dry-run
   ```

5. **Troubleshooting**:
   - Check that `@helix/schematics` package is installed
   - Verify you're in the correct directory (`webapp` folder)
   - Ensure project name matches your library name
   - Check for typos in schematic names

### Alternative: Manual File Creation

For complex components or when schematics don't meet your needs:

1. **Copy Template**: Use existing component as template
2. **Rename Files**: Update all file names consistently
3. **Update Classes**: Change class names and decorators
4. **Update Selectors**: Change component selectors
5. **Register**: Add to main module and index.ts
6. **Test**: Build and verify component appears

**Advantages**:
- Full control over structure
- Can customize beyond schematic templates
- No dependency on schematic versions
- Better for complex components

**When to Use Manual Creation**:
- Schematics don't support your use case
- Need to deviate from standard structure
- Creating variations of existing components
- Working in environments where schematics are problematic

---

## Testing

### Local Development Server

**Start Server**:
```bash
cd /workspace/sample-app/bundle/src/main/webapp
npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check
```

**Access**: http://localhost:4200/helix

**Stop Server**: Ctrl+C in terminal

### Browser Testing

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Verify component loads correctly
5. Test all interactive features

---

## BMC-UX Adapt Components

BMC Helix Innovation Studio includes the BMC-UX Adapt component library for building modern UIs. These components are available in the `@bmc-ux` packages.

### Available Component Libraries

1. **@bmc-ux/adapt-angular** - Core UI components and form controls
2. **@bmc-ux/adapt-charts** - Data visualization and charts
3. **@bmc-ux/adapt-table** - Advanced data table component
4. **@bmc-ux/adapt-css** - ADAPT design system styles
5. **@bmc-ux/dpl-iconfont** - Icon library

### Component Documentation

For detailed documentation on using BMC-UX Adapt components, refer to these guides:

- **[BMC-UX Adapt Form Controls](.cursor/rules/bmc-ux-adapt-form-controls.md)** - Text fields, selects, checkboxes, date pickers, and more
- **[BMC-UX Adapt UI Components](.cursor/rules/bmc-ux-adapt-ui-components.md)** - Buttons, modals, tabs, alerts, tooltips, and navigation
- **[BMC-UX Adapt Charts](.cursor/rules/bmc-ux-adapt-charts.md)** - Line graphs, bar charts, pie charts, heatmaps, and more
- **[BMC-UX Adapt Table](.cursor/rules/bmc-ux-adapt-table.md)** - Advanced data table with sorting, filtering, pagination

### Quick Start

**Import in Component**:
```typescript
import { 
  AdaptRxTextfieldComponent,
  AdaptButtonModule,
  AdaptModalModule,
  AdaptTabsModule
} from '@bmc-ux/adapt-angular';

import { AdaptTableModule } from '@bmc-ux/adapt-table';
import { AdaptChartsModule } from '@bmc-ux/adapt-charts';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdaptRxTextfieldComponent,
    AdaptButtonModule,
    AdaptModalModule,
    AdaptTabsModule,
    AdaptTableModule,
    AdaptChartsModule
  ]
})
export class MyComponent {}
```

**Import Styles**:
```scss
// In your global styles or component styles
@import '@bmc-ux/adapt-css/adapt.scss';
```

### Component Categories

**Form Controls**:
- Text Field, Text Area, Select, Checkbox, Radio Button
- Switch, Date/Time Picker, Typeahead, Counter
- Rating, Search, File Uploader

**UI Components**:
- Button, Button Group, Modal, Dialog, Tabs
- Accordion, Alert, Toast, Tooltip, Popover
- Badge, Tag, Progress Bar, Busy Loader
- Sidebar, Navigation, Card, Stepper, Empty State

**Data Visualization**:
- Line Graph, Area Graph, Bar Chart, Pie Chart
- Stacked Charts, Dual Chart, Scatter Plot
- Heatmap, Treemap, Flow Chart

**Data Table**:
- Sorting, Filtering, Pagination
- Row Selection, Row Expansion, Column Resizing
- Virtual Scrolling, Lazy Loading, Inline Editing
- Export to CSV/Excel

### Icon Usage

BMC-UX provides the DPL icon font:

```html
<!-- Icon in button -->
<button adapt-button>
  <i class="d-icon-add"></i>
  Add Item
</button>

<!-- Icon only button -->
<button adapt-button icon-only>
  <i class="d-icon-search"></i>
</button>

<!-- Common icons -->
<i class="d-icon-home"></i>
<i class="d-icon-user"></i>
<i class="d-icon-settings"></i>
<i class="d-icon-edit"></i>
<i class="d-icon-delete"></i>
<i class="d-icon-save"></i>
<i class="d-icon-close"></i>
<i class="d-icon-check"></i>
<i class="d-icon-email"></i>
<i class="d-icon-phone"></i>
```

---

## Reference Documentation

- **BMC Helix Innovation Studio Docs**: https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/
- **REST API Reference**: https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/BMC-Helix-Innovation-Suite/is261/Developing-applications-by-using-BMC-Helix-Innovation-Studio/Developing-and-deploying-code-based-applications/Customizing-an-application-with-REST-APIs/
- **BMC-UX Adapt Components**: See separate component guide files in `.cursor/rules/` directory

---

## Quick Reference

### Essential Commands

```bash
# Build frontend
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app/bundle/src/main/webapp && npm run build"

# Build and deploy
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app && mvn clean install -Pdeploy -DskipTests"

# Start dev server
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app/bundle/src/main/webapp && npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check"
```

### Schematic Commands (Quick)

```bash
# All commands run from: /workspace/sample-app/bundle/src/main/webapp

# Generate View Component
npx nx g @helix/schematics:create-view-component --name="my-component" --project="com-mycompany-sample-app" --group="Sample App" --no-interactive

# Generate View Action
npx nx g @helix/schematics:create-view-action --name="my-action" --project="com-mycompany-sample-app" --no-interactive

# Generate Record Editor Field
npx nx g @helix/schematics:create-record-editor-field-view-component --name="my-field" --project="com-mycompany-sample-app" --group="Sample App" --no-interactive

# Generate Service
npx nx g @helix/schematics:create-service --name="my-service" --project="com-mycompany-sample-app" --no-interactive
```

### Component Selector Format

```
com-mycompany-sample-app-com-mycompany-sample-app-<component-name>
```

### Important Paths

- **Components**: `libs/com-mycompany-sample-app/src/lib/view-components/`
- **Actions**: `libs/com-mycompany-sample-app/src/lib/actions/`
- **Services**: `libs/com-mycompany-sample-app/src/lib/services/`
- **Main Module**: `libs/com-mycompany-sample-app/src/lib/com-mycompany-sample-app.module.ts`
- **Index**: `libs/com-mycompany-sample-app/src/index.ts`
- **Build Output**: `dist/apps/shell/`
- **Webapp Root**: `bundle/src/main/webapp/`

---

**Last Updated**: February 2, 2026 
**Version**: 2.1 
**BMC Helix Innovation Studio**: 25.4.00+

## Changelog

### Version 2.2 (February 2, 2026)
- Added BMC-UX Adapt Components section with links to detailed guides
- Created separate comprehensive guides for:
  - Form Controls (bmc-ux-adapt-form-controls.md)
  - UI Components (bmc-ux-adapt-ui-components.md)
  - Charts & Data Visualization (bmc-ux-adapt-charts.md)
  - Data Table (bmc-ux-adapt-table.md)
- Added icon usage documentation
- Added quick start guide for BMC-UX components
- Documented all available component categories

### Version 2.1 (February 2, 2026)
- Added comprehensive schematics reference section
- Enhanced view component generation commands with non-interactive options
- Added all available schematic types (7 total)
- Expanded action generation documentation
- Added schematic best practices and troubleshooting
- Updated quick reference with schematic commands
- Added detailed options and use cases for each schematic type
