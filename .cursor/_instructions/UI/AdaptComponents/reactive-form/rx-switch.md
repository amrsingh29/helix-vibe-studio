# Switch (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The switch component provides a toggle control for binary (on/off) state selection, similar to a checkbox but with a different visual representation.

## Import

```typescript
import {AdaptRxSwitchModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-switch`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Toggle [checked] attribute |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
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
| change | EventEmitter<boolean> | Emits when switch state changes |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-switch-demo',
  templateUrl: './switch-demo.html'
})
export class SwitchDemoComponent {
  // Template-driven
  isEnabled: boolean = false;
  notificationsOn: boolean = true;
  
  // Reactive forms
  form = new FormGroup({
    darkMode: new FormControl(false),
    autoSave: new FormControl(true)
  });

  onSwitchChange(state: boolean): void {
    console.log('Switch state:', state);
  }
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-switch [(ngModel)]="isEnabled"
                 [label]="'Enable Feature'"
                 (change)="onSwitchChange($event)"></adapt-rx-switch>

<adapt-rx-switch [(ngModel)]="notificationsOn"
                 [label]="'Notifications'"
                 [subLabel]="'Receive email notifications'"></adapt-rx-switch>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-switch formControlName="darkMode"
                   [label]="'Dark Mode'"></adapt-rx-switch>
  
  <adapt-rx-switch formControlName="autoSave"
                   [label]="'Auto Save'"
                   [subLabel]="'Automatically save changes'"></adapt-rx-switch>
</form>

<!-- With Tooltip -->
<adapt-rx-switch [(ngModel)]="isEnabled"
                 [label]="'Advanced Mode'"
                 [tooltip]="{text: 'Enables advanced features'}"></adapt-rx-switch>

<!-- Disabled State -->
<adapt-rx-switch [ngModel]="true"
                 [disabled]="true"
                 [label]="'Premium Feature'"
                 [subLabel]="'Upgrade to enable'"></adapt-rx-switch>

<!-- Readonly State -->
<adapt-rx-switch [ngModel]="true"
                 [readonly]="true"
                 [label]="'Status: Active'"></adapt-rx-switch>
```

## Key Features

- Toggle on/off state with visual switch
- Label and sub-label support
- Template-driven and reactive forms support
- Tooltip/popover integration
- Warning messages
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Change event
- Test ID support
- Alternative to checkbox for binary choices

