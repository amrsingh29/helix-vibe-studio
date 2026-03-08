# Advanced Filter

## Description

Advanced Filter component provides a powerful, user-friendly interface for building complex filter expressions. It supports multiple filter types, saved filters, expression editing, and visual filter representation with tags. Users can create, edit, save, and apply sophisticated filtering criteria.

### Import Options

From **v14.10.0** there are 2 ways of importing advanced filter to the project:
1. import `AdaptAdvancedFilteringModule` as it has been earlier
2. import `AdaptAdvancedFilterModule` and reduce bundle size

## Import

```typescript
import {AdaptAdvancedFilterModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-filter-controls`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| filterOption | AdvancedFilterOption | - | Filter configuration with available fields and options |
| filterValue | any | - | Current filter value/expression |
| validationErrors | ValidationError[] | - | Array of validation errors |
| hasAllInvalidTags | boolean | - | Indicates if all tags are invalid |
| testID | string | - | Test ID for automation |
| disabledTabResolver | AdvancedFilterDisabledResolver | - | Resolver function to disable specific tabs |
| disabledInputResolver | AdvancedFilterDisabledResolver | - | Resolver function to disable specific inputs |
| showSelectedFiltersCount | boolean | - | Show count of selected filters |
| selectedFiltersIndicationStyle | 'text' \| 'mark' | - | Style for indicating selected filters |
| applyFiltersByUserAction | boolean | - | Require explicit user action to apply filters |
| selectedFiltersCountResolver | AdvancedFilterSelectedFiltersCount | - | Custom resolver for selected filters count |
| autofocusExpressionEditor | boolean | false | Auto-focus expression editor on open |
| disableExpressionEditing | boolean | false | Disable manual expression editing |
| showOutsideTags | boolean | true | Show filter tags outside the component |
| removableOutsideTags | boolean | true | Allow removing tags from outside view |
| savedFiltersConfig | SavedFiltersConfig | - | Configuration for saved filters feature |
| savedFiltersSearch | boolean | false | Enable search in saved filters |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| filterValueChange | EventEmitter<any> | Emits when filter value changes |
| applyFilters | EventEmitter<any> | Emits when filters are applied |
| clearFilters | EventEmitter<void> | Emits when filters are cleared |
| savedFilterChange | EventEmitter<any> | Emits when saved filter is selected |
| savedFilterDelete | EventEmitter<any> | Emits when saved filter is deleted |
| savedFilterSave | EventEmitter<any> | Emits when filter is saved |

### Key Interfaces

#### AdvancedFilterOption

```typescript
interface AdvancedFilterOption {
  fields: AdvancedFilterField[];
  operators?: string[];
  showSavedFilters?: boolean;
  savedFilters?: SavedFilter[];
}
```

#### AdvancedFilterField

```typescript
interface AdvancedFilterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  operators?: string[];
  values?: any[];
  defaultValue?: any;
}
```

#### SavedFilter

```typescript
interface SavedFilter {
  id: string;
  name: string;
  expression: any;
  isDefault?: boolean;
  createdBy?: string;
}
```

## Simple Example

### TypeScript Component

```typescript
import {Component, OnInit} from '@angular/core';
import {
  AdvancedFilterOption,
  AdvancedFilterField,
  SavedFilter
} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'app-advanced-filter-demo',
  templateUrl: './advanced-filter.demo.html'
})
export class AdvancedFilterDemoComponent implements OnInit {
  filterOption: AdvancedFilterOption;
  filterValue: any;
  savedFilters: SavedFilter[] = [];

  autofocusExpressionEditor: boolean = true;
  disableExpressionEditing: boolean = false;
  showOutsideTags: boolean = true;
  removableOutsideTags: boolean = true;

  ngOnInit() {
    // Define filter fields
    const fields: AdvancedFilterField[] = [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        values: ['New', 'In Progress', 'Closed', 'Resolved'],
        operators: ['=', '!=', 'in']
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        values: ['Low', 'Medium', 'High', 'Critical'],
        operators: ['=', '!=']
      },
      {
        id: 'assignee',
        label: 'Assignee',
        type: 'text',
        operators: ['=', '!=', 'contains', 'startsWith']
      },
      {
        id: 'createdDate',
        label: 'Created Date',
        type: 'date',
        operators: ['=', '>', '<', 'between']
      },
      {
        id: 'resolved',
        label: 'Resolved',
        type: 'boolean',
        operators: ['=']
      }
    ];

    this.filterOption = {
      fields: fields,
      showSavedFilters: true,
      savedFilters: this.savedFilters
    };
  }

  onFilterValueChange(value: any): void {
    console.log('Filter value changed:', value);
    this.filterValue = value;
  }

  onApplyFilters(filters: any): void {
    console.log('Apply filters:', filters);
    // Apply filters to your data
  }

  onClearFilters(): void {
    console.log('Clear filters');
    this.filterValue = null;
  }

  onSavedFilterChange(filter: SavedFilter): void {
    console.log('Saved filter selected:', filter);
    this.filterValue = filter.expression;
  }

  onSavedFilterSave(filter: any): void {
    console.log('Save filter:', filter);
    this.savedFilters.push(filter);
  }

  onSavedFilterDelete(filterId: string): void {
    console.log('Delete filter:', filterId);
    this.savedFilters = this.savedFilters.filter(f => f.id !== filterId);
  }
}
```

### HTML Template

```html
<!-- Basic Advanced Filter -->
<adapt-filter-controls [filterOption]="filterOption"
                       [(filterValue)]="filterValue"
                       (applyFilters)="onApplyFilters($event)"
                       (clearFilters)="onClearFilters()"></adapt-filter-controls>

<!-- Advanced Filter with All Features -->
<adapt-filter-controls [filterOption]="filterOption"
                       [(filterValue)]="filterValue"
                       [autofocusExpressionEditor]="autofocusExpressionEditor"
                       [disableExpressionEditing]="disableExpressionEditing"
                       [showOutsideTags]="showOutsideTags"
                       [removableOutsideTags]="removableOutsideTags"
                       [showSelectedFiltersCount]="true"
                       [selectedFiltersIndicationStyle]="'mark'"
                       [savedFiltersSearch]="true"
                       (filterValueChange)="onFilterValueChange($event)"
                       (applyFilters)="onApplyFilters($event)"
                       (clearFilters)="onClearFilters()"
                       (savedFilterChange)="onSavedFilterChange($event)"
                       (savedFilterSave)="onSavedFilterSave($event)"
                       (savedFilterDelete)="onSavedFilterDelete($event)"></adapt-filter-controls>

<!-- With Custom Validation -->
<adapt-filter-controls [filterOption]="filterOption"
                       [(filterValue)]="filterValue"
                       [validationErrors]="validationErrors"
                       (applyFilters)="onApplyFilters($event)"></adapt-filter-controls>

<!-- With Apply By User Action -->
<adapt-filter-controls [filterOption]="filterOption"
                       [(filterValue)]="filterValue"
                       [applyFiltersByUserAction]="true"
                       (applyFilters)="onApplyFilters($event)"></adapt-filter-controls>
```

## Key Features

- **Visual Filter Builder**: Intuitive UI for building complex filter expressions
- **Multiple Field Types**: Support for text, number, date, boolean, select, and multi-select fields
- **Operators**: Various operators (=, !=, >, <, contains, between, etc.)
- **Filter Tags**: Visual representation of applied filters as tags
- **Saved Filters**: Save and reuse frequently used filter combinations
- **Expression Editor**: Manual expression editing for advanced users
- **Validation**: Built-in validation with error messages
- **Search**: Search through saved filters
- **AND/OR Logic**: Combine filters with logical operators
- **Nested Filters**: Support for complex nested filter groups
- **Auto-apply or Manual**: Choose when to apply filters
- **Filter Count**: Show count of active filters
- **Accessibility**: Full keyboard navigation and ARIA support
- **Customizable**: Disable features, custom resolvers, styling options

