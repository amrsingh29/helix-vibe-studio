# TextArea (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The textarea component provides a multi-line text input field with support for character counting, auto-resize, and validation.

## Import

```typescript
import {AdaptRxTextareaModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-textarea`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| rows | number | 3 | Number of visible text rows |
| maxLength | number | - | Maximum character length |
| showCharCounter | boolean | false | Show character counter |
| autoResize | boolean | false | Auto-resize textarea based on content |
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
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-textarea-demo',
  templateUrl: './textarea-demo.html'
})
export class TextareaDemoComponent {
  // Template-driven
  description: string = '';
  comments: string = '';
  
  // Reactive forms
  form = new FormGroup({
    feedback: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    notes: new FormControl('')
  });
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-textarea [(ngModel)]="description"
                   [label]="'Description'"
                   [rows]="5"
                   [placeholder]="'Enter description...'"></adapt-rx-textarea>

<!-- With Character Counter -->
<adapt-rx-textarea [(ngModel)]="comments"
                   [label]="'Comments'"
                   [maxLength]="500"
                   [showCharCounter]="true"
                   [rows]="4"></adapt-rx-textarea>

<!-- Auto-Resize -->
<adapt-rx-textarea [(ngModel)]="description"
                   [label]="'Your Message'"
                   [autoResize]="true"
                   [rows]="2"
                   [placeholder]="'Type your message...'"></adapt-rx-textarea>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-textarea formControlName="feedback"
                     [label]="'Feedback'"
                     [requiredLabel]="'*'"
                     [maxLength]="500"
                     [showCharCounter]="true"
                     [rows]="5"
                     [placeholder]="'Please provide your feedback...'"></adapt-rx-textarea>
  
  <adapt-rx-textarea formControlName="notes"
                     [label]="'Additional Notes'"
                     [rows]="3"></adapt-rx-textarea>
</form>

<!-- With Tooltip and SubLabel -->
<adapt-rx-textarea [(ngModel)]="description"
                   [label]="'Product Description'"
                   [subLabel]="'Provide a detailed description'"
                   [tooltip]="{text: 'Include key features and benefits'}"
                   [rows]="6"
                   [maxLength]="1000"
                   [showCharCounter]="true"></adapt-rx-textarea>

<!-- Readonly State -->
<adapt-rx-textarea [ngModel]="'This is read-only content'"
                   [readonly]="true"
                   [label]="'Terms and Conditions'"
                   [rows]="8"></adapt-rx-textarea>
```

## Key Features

- Multi-line text input
- Configurable number of rows
- Character counter with max length validation
- Auto-resize based on content
- Label and sub-label support
- Template-driven and reactive forms support
- Placeholder text customization
- Tooltip/popover integration
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Autofocus support
- Validation support (required, maxlength, etc.)

