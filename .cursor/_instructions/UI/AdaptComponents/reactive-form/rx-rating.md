# Rating (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The rating component allows users to provide a rating using a visual star or icon-based interface.

## Import

```typescript
import {AdaptRxRatingModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-rating`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| max | number | 5 | Maximum rating value (number of stars/icons) |
| icon | string | 'star' | Icon to use for rating display |
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
| rateChange | EventEmitter<number> | Emits when rating value changes |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-rating-demo',
  templateUrl: './rating-demo.html'
})
export class RatingDemoComponent {
  // Template-driven
  productRating: number = 3;
  
  // Reactive forms
  form = new FormGroup({
    serviceRating: new FormControl(4)
  });

  onRatingChange(rating: number): void {
    console.log('Rating changed:', rating);
  }
}
```

### HTML Template

```html
<!-- Template-driven Form -->
<adapt-rx-rating [(ngModel)]="productRating"
                 [label]="'Rate this product'"
                 [max]="5"
                 (rateChange)="onRatingChange($event)"></adapt-rx-rating>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-rating formControlName="serviceRating"
                   [label]="'Service Rating'"
                   [max]="5"></adapt-rx-rating>
</form>

<!-- Readonly Rating Display -->
<adapt-rx-rating [ngModel]="4.5"
                 [readonly]="true"
                 [label]="'Average Rating'"
                 [max]="5"></adapt-rx-rating>

<!-- Custom Max Value -->
<adapt-rx-rating [(ngModel)]="productRating"
                 [label]="'Quality'"
                 [max]="10"></adapt-rx-rating>
```

## Key Features

- Visual star/icon-based rating
- Configurable maximum rating value
- Half-star support for display
- Label and sub-label support
- Template-driven and reactive forms support
- Readonly mode for displaying ratings
- Accessibility support (ARIA attributes)
- Keyboard navigation
- Hover preview

