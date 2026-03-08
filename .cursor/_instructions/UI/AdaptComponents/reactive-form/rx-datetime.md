# DateTime (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The datetime component provides date and time selection functionality with calendar picker and time input.

## Import

```typescript
import {AdaptRxDatetimeModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-datetime`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| mode | 'date' \| 'time' \| 'datetime' | 'date' | Selection mode (date only, time only, or both) |
| minDate | Date \| string | - | Minimum selectable date |
| maxDate | Date \| string | - | Maximum selectable date |
| dateFormat | string | 'MM/DD/YYYY' | Date display format |
| timeFormat | string | 'HH:mm' | Time display format |
| showClearButton | boolean | true | Show/hide clear button |
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

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| dateChange | EventEmitter<Date> | Emits when date/time value changes |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-datetime-demo',
  templateUrl: './datetime-demo.html'
})
export class DatetimeDemoComponent {
  // Template-driven
  selectedDate: Date = new Date();
  selectedTime: string = '';
  selectedDateTime: Date = null;
  
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 3));
  
  // Reactive forms
  form = new FormGroup({
    eventDate: new FormControl(null),
    startTime: new FormControl(null)
  });

  onDateChange(date: Date): void {
    console.log('Date changed:', date);
  }
}
```

### HTML Template

```html
<!-- Date Only -->
<adapt-rx-datetime [(ngModel)]="selectedDate"
                   [mode]="'date'"
                   [label]="'Select Date'"
                   [minDate]="minDate"
                   [maxDate]="maxDate"
                   (dateChange)="onDateChange($event)"></adapt-rx-datetime>

<!-- Time Only -->
<adapt-rx-datetime [(ngModel)]="selectedTime"
                   [mode]="'time'"
                   [label]="'Select Time'"
                   [timeFormat]="'HH:mm'"></adapt-rx-datetime>

<!-- Date and Time -->
<adapt-rx-datetime [(ngModel)]="selectedDateTime"
                   [mode]="'datetime'"
                   [label]="'Event Date & Time'"
                   [dateFormat]="'MM/DD/YYYY'"
                   [timeFormat]="'HH:mm'"></adapt-rx-datetime>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-datetime formControlName="eventDate"
                     [mode]="'date'"
                     [label]="'Event Date'"
                     [placeholder]="'Select a date...'"></adapt-rx-datetime>
  
  <adapt-rx-datetime formControlName="startTime"
                     [mode]="'time'"
                     [label]="'Start Time'"></adapt-rx-datetime>
</form>

<!-- With Date Range Restrictions -->
<adapt-rx-datetime [(ngModel)]="selectedDate"
                   [mode]="'date'"
                   [label]="'Appointment Date'"
                   [minDate]="minDate"
                   [maxDate]="maxDate"
                   [subLabel]="'Select within the next 3 months'"></adapt-rx-datetime>
```

## Key Features

- Date, time, and datetime selection modes
- Calendar picker interface
- Time input with validation
- Min/max date restrictions
- Customizable date and time formats
- Clear button to reset selection
- Label and sub-label support
- Template-driven and reactive forms support
- Placeholder text customization
- Accessibility support (ARIA attributes)
- Keyboard navigation
- Disabled and readonly states

