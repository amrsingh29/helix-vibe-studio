# Search (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The search component provides a text input field optimized for search functionality with built-in search icon and clear button.

## Import

```typescript
import {AdaptRxSearchModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-search`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| debounceTime | number | 0 | Debounce time in milliseconds for search input |
| showClearButton | boolean | true | Show/hide clear button |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| placeholder | string | 'Search...' | Input placeholder text |
| ariaLabel | string | - | Control [aria-label] attribute text |
| ariaLabelledby | string | - | Control [aria-labeledby] attribute text |
| ariaDescribedBy | string | - | Control [aria-describedby] attribute text |
| tabIndex | number | - | Control [tabindex] value |
| testID | string | - | String for test id data attribute |
| id | string | - | Control [id] |
| disabled | boolean | - | Control [disabled] attribute |
| readonly | boolean | - | Control [readonly] attribute |
| autofocus | boolean | - | Control [autofocus] attribute |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| search | EventEmitter<string> | Emits search value (with debounce if configured) |
| clear | EventEmitter<void> | Emits when clear button is clicked |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.html'
})
export class SearchDemoComponent {
  // Template-driven
  searchTerm: string = '';
  
  // Reactive forms
  form = new FormGroup({
    productSearch: new FormControl('')
  });

  onSearch(term: string): void {
    console.log('Searching for:', term);
    // Perform search logic
  }

  onClear(): void {
    console.log('Search cleared');
  }
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-search [(ngModel)]="searchTerm"
                 [label]="'Search Products'"
                 [placeholder]="'Enter product name...'"
                 [debounceTime]="300"
                 (search)="onSearch($event)"
                 (clear)="onClear()"></adapt-rx-search>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-search formControlName="productSearch"
                   [label]="'Find Items'"
                   [debounceTime]="500"></adapt-rx-search>
</form>

<!-- Without Clear Button -->
<adapt-rx-search [(ngModel)]="searchTerm"
                 [placeholder]="'Search...'"
                 [showClearButton]="false"></adapt-rx-search>

<!-- With Tooltip -->
<adapt-rx-search [(ngModel)]="searchTerm"
                 [label]="'Advanced Search'"
                 [tooltip]="{text: 'Use * for wildcard searches'}"
                 [debounceTime]="300"></adapt-rx-search>
```

## Key Features

- Built-in search icon
- Clear button to reset search
- Debounce functionality to limit API calls
- Label and sub-label support
- Template-driven and reactive forms support
- Placeholder text customization
- Accessibility support (ARIA attributes)
- Search and clear events
- Disabled and readonly states

