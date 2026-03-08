# Select (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The select component provides a dropdown selection interface with support for single and multiple selections, search functionality, and grouped options.

## Import

```typescript
import {AdaptRxSelectModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-select`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| options | RxSelectOptions[] \| RxSelectOptionsGroup[] | - | Array of options or grouped options |
| multiple | boolean | false | Enable multiple selection |
| searchable | boolean | false | Enable search functionality in dropdown |
| clearable | boolean | true | Show clear button to reset selection |
| optionFormatter | (option: any) => string | - | Custom formatter for option display |
| valueFormatter | (value: any) => string | - | Custom formatter for selected value display |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| placeholder | string | 'Select...' | Placeholder text |
| ariaLabel | string | - | Control [aria-label] attribute text |
| ariaLabelledby | string | - | Control [aria-labeledby] attribute text |
| ariaDescribedBy | string | - | Control [aria-describedby] attribute text |
| tabIndex | number | - | Control [tabindex] value |
| testID | string | - | String for test id data attribute |
| id | string | - | Control [id] |
| disabled | boolean | - | Control [disabled] attribute |
| readonly | boolean | - | Control [readonly] attribute |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| selectionChange | EventEmitter<any> | Emits when selection changes |

### Interfaces

#### RxSelectOptions

```typescript
interface RxSelectOptions {
  name: string;
  value: any;
  disabled?: boolean;
}
```

#### RxSelectOptionsGroup

```typescript
interface RxSelectOptionsGroup {
  name: string;
  children: RxSelectOptions[];
}
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {RxSelectOptions, RxSelectOptionsGroup} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'app-select-demo',
  templateUrl: './select-demo.html'
})
export class SelectDemoComponent {
  // Template-driven
  selectedCountry: string = '';
  selectedColors: string[] = [];
  
  // Simple options
  countries: RxSelectOptions[] = [
    { name: 'United States', value: 'us' },
    { name: 'Canada', value: 'ca' },
    { name: 'Mexico', value: 'mx' },
    { name: 'United Kingdom', value: 'uk' }
  ];

  // Grouped options
  groupedOptions: RxSelectOptionsGroup[] = [
    {
      name: 'North America',
      children: [
        { name: 'United States', value: 'us' },
        { name: 'Canada', value: 'ca' }
      ]
    },
    {
      name: 'Europe',
      children: [
        { name: 'United Kingdom', value: 'uk' },
        { name: 'Germany', value: 'de' }
      ]
    }
  ];
  
  // Reactive forms
  form = new FormGroup({
    country: new FormControl(null)
  });

  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }
}
```

### HTML Template

```html
<!-- Simple Select -->
<adapt-rx-select [(ngModel)]="selectedCountry"
                 [options]="countries"
                 [label]="'Select Country'"
                 [searchable]="true"
                 (selectionChange)="onSelectionChange($event)"></adapt-rx-select>

<!-- Multiple Selection -->
<adapt-rx-select [(ngModel)]="selectedColors"
                 [options]="countries"
                 [label]="'Select Multiple'"
                 [multiple]="true"
                 [searchable]="true"></adapt-rx-select>

<!-- Grouped Options -->
<adapt-rx-select [(ngModel)]="selectedCountry"
                 [options]="groupedOptions"
                 [label]="'Select Region'"
                 [searchable]="true"></adapt-rx-select>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-select formControlName="country"
                   [options]="countries"
                   [label]="'Country'"
                   [placeholder]="'Choose a country...'"
                   [searchable]="true"></adapt-rx-select>
</form>

<!-- With Custom Formatter -->
<adapt-rx-select [(ngModel)]="selectedCountry"
                 [options]="countries"
                 [label]="'Country'"
                 [optionFormatter]="customFormatter"></adapt-rx-select>
```

## Key Features

- Single and multiple selection modes
- Searchable dropdown
- Grouped options support
- Clear button to reset selection
- Custom formatters for options and values
- Label and sub-label support
- Template-driven and reactive forms support
- Placeholder text customization
- Accessibility support (ARIA attributes)
- Disabled options support
- Keyboard navigation

