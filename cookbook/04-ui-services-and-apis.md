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
