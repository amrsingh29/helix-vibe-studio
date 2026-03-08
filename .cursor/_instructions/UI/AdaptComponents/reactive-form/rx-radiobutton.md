# RadioButton (Reactive Form Control)

## Description

A part of AdaptRx- form controls. Radio buttons allow users to select a single option from a set of mutually exclusive choices. Radio buttons are grouped using the `adapt-rx-radiobutton-group` component.

## Import

```typescript
import {AdaptRxRadiobuttonModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Group Selector:** `adapt-rx-radiobutton-group`

**Button Selector:** `adapt-rx-radiobutton`

## Properties

### @Inputs (adapt-rx-radiobutton-group)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name (required for grouping) |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| ariaLabel | string | - | Control [aria-label] attribute text |
| ariaLabelledby | string | - | Control [aria-labeledby] attribute text |
| ariaDescribedBy | string | - | Control [aria-describedby] attribute text |
| testID | string | - | String for test id data attribute |
| id | string | - | Control [id] |
| disabled | boolean | - | Control [disabled] attribute |
| readonly | boolean | - | Control [readonly] attribute |

### @Inputs (adapt-rx-radiobutton)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | any | - | Value for this radio button option |
| label | string | - | Label text for this option |
| disabled | boolean | - | Disable this specific option |
| testID | string | - | String for test id data attribute |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| selectionChange | EventEmitter<any> | Emits when selection changes |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-radiobutton-demo',
  templateUrl: './radiobutton-demo.html'
})
export class RadiobuttonDemoComponent {
  // Template-driven
  selectedSize: string = 'medium';
  selectedColor: string = 'blue';
  
  sizes: string[] = ['small', 'medium', 'large', 'xlarge'];
  
  // Reactive forms
  form = new FormGroup({
    preference: new FormControl('option1')
  });

  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-radiobutton-group [(ngModel)]="selectedSize"
                            [name]="'sizeGroup'"
                            [label]="'Select Size'"
                            (selectionChange)="onSelectionChange($event)">
  <adapt-rx-radiobutton [value]="'small'"
                        [label]="'Small'"></adapt-rx-radiobutton>
  <adapt-rx-radiobutton [value]="'medium'"
                        [label]="'Medium'"></adapt-rx-radiobutton>
  <adapt-rx-radiobutton [value]="'large'"
                        [label]="'Large'"></adapt-rx-radiobutton>
  <adapt-rx-radiobutton [value]="'xlarge'"
                        [label]="'Extra Large'"></adapt-rx-radiobutton>
</adapt-rx-radiobutton-group>

<!-- Using *ngFor -->
<adapt-rx-radiobutton-group [(ngModel)]="selectedSize"
                            [name]="'sizeGroup2'"
                            [label]="'Size Options'">
  <adapt-rx-radiobutton *ngFor="let size of sizes"
                        [value]="size"
                        [label]="size | titlecase"></adapt-rx-radiobutton>
</adapt-rx-radiobutton-group>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-radiobutton-group formControlName="preference"
                              [name]="'preferenceGroup'"
                              [label]="'User Preference'">
    <adapt-rx-radiobutton [value]="'option1'"
                          [label]="'Option 1'"></adapt-rx-radiobutton>
    <adapt-rx-radiobutton [value]="'option2'"
                          [label]="'Option 2'"></adapt-rx-radiobutton>
    <adapt-rx-radiobutton [value]="'option3'"
                          [label]="'Option 3'"
                          [disabled]="true"></adapt-rx-radiobutton>
  </adapt-rx-radiobutton-group>
</form>

<!-- With Tooltip and SubLabel -->
<adapt-rx-radiobutton-group [(ngModel)]="selectedColor"
                            [name]="'colorGroup'"
                            [label]="'Choose Color'"
                            [subLabel]="'Select your preferred color'"
                            [tooltip]="{text: 'This selection affects theme'}">
  <adapt-rx-radiobutton [value]="'blue'"
                        [label]="'Blue'"></adapt-rx-radiobutton>
  <adapt-rx-radiobutton [value]="'red'"
                        [label]="'Red'"></adapt-rx-radiobutton>
  <adapt-rx-radiobutton [value]="'green'"
                        [label]="'Green'"></adapt-rx-radiobutton>
</adapt-rx-radiobutton-group>
```

## Key Features

- Mutually exclusive selection within a group
- Label and sub-label support
- Individual option labels
- Disable entire group or individual options
- Template-driven and reactive forms support
- Tooltip/popover integration
- Accessibility support (ARIA attributes)
- Keyboard navigation
- Value of any type (string, number, object, etc.)
- Required field validation support

