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
