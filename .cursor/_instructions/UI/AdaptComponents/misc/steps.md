# Steps

## Description

Steps component displays a sequence of steps in a process, showing progress through numbered or labeled steps. It's commonly used for wizards, multi-step forms, or progress tracking.

## Import

```typescript
import {AdaptStepsModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-steps`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| steps | AdaptStep[] | [] | Array of step configurations |
| currentStep | number | 0 | Index of the current active step |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | Display orientation |
| clickable | boolean | false | Allow clicking on steps to navigate |
| showNumbers | boolean | true | Show step numbers |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| stepClick | EventEmitter<number> | Emits when a step is clicked (if clickable) |
| stepChange | EventEmitter<number> | Emits when current step changes |

### Step Interface

```typescript
interface AdaptStep {
  label: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
}
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {AdaptStep} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'adapt-steps-demo',
  templateUrl: './steps.demo.html'
})
export class AdaptStepsDemoComponent {
  currentStep: number = 0;

  steps: AdaptStep[] = [
    {
      label: 'Personal Information',
      description: 'Enter your details',
      completed: false
    },
    {
      label: 'Address',
      description: 'Provide your address',
      completed: false
    },
    {
      label: 'Payment',
      description: 'Payment information',
      completed: false
    },
    {
      label: 'Review',
      description: 'Review and submit',
      completed: false
    }
  ];

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.steps[this.currentStep].completed = true;
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onStepClick(stepIndex: number): void {
    console.log('Step clicked:', stepIndex);
    this.currentStep = stepIndex;
  }
}
```

### HTML Template

```html
<!-- Basic Horizontal Steps -->
<adapt-steps [steps]="steps"
             [currentStep]="currentStep"
             (stepChange)="onStepChange($event)"></adapt-steps>

<!-- Clickable Steps -->
<adapt-steps [steps]="steps"
             [currentStep]="currentStep"
             [clickable]="true"
             (stepClick)="onStepClick($event)"></adapt-steps>

<!-- Vertical Steps -->
<adapt-steps [steps]="steps"
             [currentStep]="currentStep"
             [orientation]="'vertical'"></adapt-steps>

<!-- Steps without Numbers -->
<adapt-steps [steps]="steps"
             [currentStep]="currentStep"
             [showNumbers]="false"></adapt-steps>

<!-- Complete Example with Navigation -->
<div class="wizard-container">
  <adapt-steps [steps]="steps"
               [currentStep]="currentStep"
               [clickable]="true"
               (stepClick)="onStepClick($event)"></adapt-steps>

  <div class="step-content mt-4">
    <div *ngIf="currentStep === 0">
      <!-- Personal Information Form -->
      <h3>{{steps[0].label}}</h3>
      <p>{{steps[0].description}}</p>
      <!-- Form fields here -->
    </div>

    <div *ngIf="currentStep === 1">
      <!-- Address Form -->
      <h3>{{steps[1].label}}</h3>
      <p>{{steps[1].description}}</p>
      <!-- Form fields here -->
    </div>

    <div *ngIf="currentStep === 2">
      <!-- Payment Form -->
      <h3>{{steps[2].label}}</h3>
      <p>{{steps[2].description}}</p>
      <!-- Form fields here -->
    </div>

    <div *ngIf="currentStep === 3">
      <!-- Review -->
      <h3>{{steps[3].label}}</h3>
      <p>{{steps[3].description}}</p>
      <!-- Review content here -->
    </div>
  </div>

  <div class="step-navigation mt-4">
    <button class="btn btn-secondary"
            [disabled]="currentStep === 0"
            (click)="previousStep()">
      Previous
    </button>
    <button class="btn btn-primary"
            [disabled]="currentStep === steps.length - 1"
            (click)="nextStep()">
      Next
    </button>
  </div>
</div>
```

## Key Features

- Horizontal and vertical layouts
- Numbered or icon-based steps
- Step descriptions
- Clickable navigation
- Completed state tracking
- Error state indication
- Disabled steps
- Custom icons per step
- Step change events
- Progress visualization
- Accessibility support (ARIA attributes)
- Responsive design

