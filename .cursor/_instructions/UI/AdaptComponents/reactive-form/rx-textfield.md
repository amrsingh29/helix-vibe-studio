# TextField (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The textfield component provides a single-line text input field with support for various input types, validation, icons, and helper text.

## Import

```typescript
import {AdaptRxTextfieldModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-textfield`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | string | 'text' | Input type (text, password, email, number, tel, url, etc.) |
| maxLength | number | - | Maximum character length |
| prefixIcon | string | - | Icon to display at the start of input |
| suffixIcon | string | - | Icon to display at the end of input |
| showPasswordToggle | boolean | false | Show password visibility toggle (for type="password") |
| autocomplete | string | - | Native autocomplete attribute |
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
| prefixIconClick | EventEmitter<MouseEvent> | Emits when prefix icon is clicked |
| suffixIconClick | EventEmitter<MouseEvent> | Emits when suffix icon is clicked |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-textfield-demo',
  templateUrl: './textfield-demo.html'
})
export class TextfieldDemoComponent {
  // Template-driven
  username: string = '';
  email: string = '';
  password: string = '';
  
  // Reactive forms
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.pattern(/^\d{10}$/))
  });

  onIconClick(event: MouseEvent): void {
    console.log('Icon clicked:', event);
  }
}
```

### HTML Template

```html
<!-- Basic Text Input -->
<adapt-rx-textfield [(ngModel)]="username"
                    [label]="'Username'"
                    [placeholder]="'Enter username'"></adapt-rx-textfield>

<!-- Email Input -->
<adapt-rx-textfield [(ngModel)]="email"
                    [type]="'email'"
                    [label]="'Email Address'"
                    [placeholder]="'example@domain.com'"></adapt-rx-textfield>

<!-- Password Input with Toggle -->
<adapt-rx-textfield [(ngModel)]="password"
                    [type]="'password'"
                    [label]="'Password'"
                    [showPasswordToggle]="true"
                    [placeholder]="'Enter password'"></adapt-rx-textfield>

<!-- With Prefix Icon -->
<adapt-rx-textfield [(ngModel)]="username"
                    [label]="'Search'"
                    [prefixIcon]="'search'"
                    [placeholder]="'Search...'"></adapt-rx-textfield>

<!-- With Suffix Icon and Click Handler -->
<adapt-rx-textfield [(ngModel)]="email"
                    [label]="'Email'"
                    [suffixIcon]="'info_circle_o'"
                    [placeholder]="'Enter email'"
                    (suffixIconClick)="onIconClick($event)"></adapt-rx-textfield>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-textfield formControlName="firstName"
                      [label]="'First Name'"
                      [requiredLabel]="'*'"
                      [placeholder]="'John'"></adapt-rx-textfield>
  
  <adapt-rx-textfield formControlName="emailAddress"
                      [type]="'email'"
                      [label]="'Email'"
                      [requiredLabel]="'*'"
                      [placeholder]="'john@example.com'"></adapt-rx-textfield>
  
  <adapt-rx-textfield formControlName="phone"
                      [type]="'tel'"
                      [label]="'Phone Number'"
                      [placeholder]="'1234567890'"
                      [maxLength]="10"></adapt-rx-textfield>
</form>

<!-- With Tooltip and SubLabel -->
<adapt-rx-textfield [(ngModel)]="username"
                    [label]="'Username'"
                    [subLabel]="'Must be unique and at least 5 characters'"
                    [tooltip]="{text: 'Username cannot be changed later'}"
                    [maxLength]="20"></adapt-rx-textfield>

<!-- Number Input -->
<adapt-rx-textfield [(ngModel)]="quantity"
                    [type]="'number'"
                    [label]="'Quantity'"
                    [placeholder]="'0'"></adapt-rx-textfield>

<!-- Readonly State -->
<adapt-rx-textfield [ngModel]="'Read-only value'"
                    [readonly]="true"
                    [label]="'Display Only'"></adapt-rx-textfield>
```

## Key Features

- Multiple input types (text, password, email, number, tel, url, etc.)
- Password visibility toggle
- Prefix and suffix icons with click handlers
- Max length validation
- Label and sub-label support
- Template-driven and reactive forms support
- Placeholder text customization
- Tooltip/popover integration
- Autocomplete support
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Autofocus support
- Warning messages
- Validation integration

