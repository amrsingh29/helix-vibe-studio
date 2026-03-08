# List Builder (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The list builder component provides a dual-list interface for selecting items from an available list and moving them to a selected list, with support for search, sorting, and custom item templates.

## Import

```typescript
import {AdaptRxListBuilderModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-list-builder`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| availableItems | any[] | [] | Array of available items to select from |
| selectedItems | any[] | [] | Array of currently selected items |
| searchable | boolean | true | Enable search functionality in both lists |
| sortable | boolean | true | Enable sorting of items |
| displayProperty | string | 'name' | Property to display for each item |
| valueProperty | string | 'value' | Property to use as value for each item |
| availableLabel | string | 'Available' | Label for available items list |
| selectedLabel | string | 'Selected' | Label for selected items list |
| itemTemplate | TemplateRef | - | Custom template for item rendering |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| testID | string | - | String for test id data attribute |
| id | string | - | Control [id] |
| disabled | boolean | - | Control [disabled] attribute |
| readonly | boolean | - | Control [readonly] attribute |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| selectionChange | EventEmitter<any[]> | Emits when selected items change |
| itemAdd | EventEmitter<any> | Emits when item is added to selected list |
| itemRemove | EventEmitter<any> | Emits when item is removed from selected list |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-list-builder-demo',
  templateUrl: './list-builder-demo.html'
})
export class ListBuilderDemoComponent {
  availableUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' }
  ];

  selectedUsers: User[] = [];

  // Reactive forms
  form = new FormGroup({
    assignedUsers: new FormControl([])
  });

  onSelectionChange(items: User[]): void {
    console.log('Selected items:', items);
  }

  onItemAdd(item: User): void {
    console.log('Item added:', item);
  }

  onItemRemove(item: User): void {
    console.log('Item removed:', item);
  }
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-list-builder [(ngModel)]="selectedUsers"
                       [availableItems]="availableUsers"
                       [label]="'Assign Users'"
                       [displayProperty]="'name'"
                       [valueProperty]="'id'"
                       [availableLabel]="'Available Users'"
                       [selectedLabel]="'Assigned Users'"
                       [searchable]="true"
                       (selectionChange)="onSelectionChange($event)"
                       (itemAdd)="onItemAdd($event)"
                       (itemRemove)="onItemRemove($event)"></adapt-rx-list-builder>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-list-builder formControlName="assignedUsers"
                         [availableItems]="availableUsers"
                         [label]="'Team Members'"
                         [requiredLabel]="'*'"
                         [displayProperty]="'name'"
                         [valueProperty]="'id'"
                         [searchable]="true"
                         [sortable]="true"></adapt-rx-list-builder>
</form>

<!-- Simple String Array -->
<adapt-rx-list-builder [(ngModel)]="selectedItems"
                       [availableItems]="['Option 1', 'Option 2', 'Option 3', 'Option 4']"
                       [label]="'Select Options'"
                       [availableLabel]="'Available Options'"
                       [selectedLabel]="'Selected Options'"></adapt-rx-list-builder>

<!-- Without Search -->
<adapt-rx-list-builder [(ngModel)]="selectedUsers"
                       [availableItems]="availableUsers"
                       [label]="'Select Items'"
                       [displayProperty]="'name'"
                       [searchable]="false"
                       [sortable]="false"></adapt-rx-list-builder>

<!-- With Tooltip and SubLabel -->
<adapt-rx-list-builder [(ngModel)]="selectedUsers"
                       [availableItems]="availableUsers"
                       [label]="'User Assignment'"
                       [subLabel]="'Select users to assign to this project'"
                       [tooltip]="{text: 'Users can be added or removed anytime'}"
                       [displayProperty]="'name'"
                       [valueProperty]="'id'"></adapt-rx-list-builder>
```

## Key Features

- Dual-list selection interface
- Move items between available and selected lists
- Search functionality in both lists
- Sortable lists
- Support for object arrays with custom display/value properties
- Custom item templates
- Move all/remove all functionality
- Label customization for both lists
- Template-driven and reactive forms support
- Tooltip/popover integration
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Selection change events
- Add/remove individual item events

