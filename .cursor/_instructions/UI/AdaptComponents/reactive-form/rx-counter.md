# Counter (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The counter component allows users to incrementally adjust a numeric value using plus/minus buttons or direct input.

## Import

```typescript
import {AdaptRxCounterModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-counter`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| min | number | - | Minimum value allowed |
| max | number | - | Maximum value allowed |
| step | number | 1 | Increment/decrement step value |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| placeholder | string | - | Input placeholder text |
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

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-counter-demo',
  templateUrl: './counter-demo.html'
})
export class CounterDemoComponent {
  // Template-driven
  quantity: number = 1;
  
  // Reactive forms
  form = new FormGroup({
    itemCount: new FormControl(5)
  });
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-counter [(ngModel)]="quantity"
                  [label]="'Quantity'"
                  [min]="0"
                  [max]="100"
                  [step]="1"></adapt-rx-counter>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-counter formControlName="itemCount"
                    [label]="'Item Count'"
                    [min]="1"
                    [max]="50"
                    [step]="5"></adapt-rx-counter>
</form>

<!-- With Sublabel and Tooltip -->
<adapt-rx-counter [(ngModel)]="quantity"
                  [label]="'Number of users'"
                  [subLabel]="'Maximum 100 users allowed'"
                  [tooltip]="{text: 'Adjust the number of users'}"
                  [min]="0"
                  [max]="100"></adapt-rx-counter>
```

## Key Features

- Increment/decrement buttons
- Direct numeric input
- Min/max value validation
- Configurable step value
- Label and sub-label support
- Tooltip/popover integration
- Template-driven and reactive forms support
- Accessibility support (ARIA attributes)
- Disabled and readonly states

