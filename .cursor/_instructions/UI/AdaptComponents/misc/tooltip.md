# Tooltip

## Description

Tooltips display informative text when users hover over, focus on, or tap an element. They provide contextual help or additional information without cluttering the interface.

## Import

```typescript
import {AdaptTooltipModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Directive Selector:** `[adaptTooltip]`

**Exported as:** `tooltip`

## Properties

### @Inputs

| Name | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| adaptTooltip | - | string \| TemplateRef<unknown> | - | Tooltip content (text or template) |
| delay | 'popupDelay' | number | 200 | Delay in milliseconds before showing tooltip |
| placement | - | PlacementArray | 'top' | Tooltip placement: 'top', 'right', 'bottom', 'left', 'auto', or array of placements |
| customCls | - | string | - | Custom CSS class for tooltip |
| content | - | string \| TemplateRef<unknown> | - | Alternative way to set tooltip content |
| context | - | unknown | - | Context object for template tooltips |
| width | - | string \| number | - | Tooltip width |
| id | - | string | - | Tooltip ID |

### Deprecated Properties

| Name | Type | Description |
|------|------|-------------|
| useWidthFitting | boolean | **@deprecated v17.1.0** |
| adjustedWidthMargin | number | **@deprecated v17.1.0** |
| placement | TooltipPlacement | **@deprecated v17.1.0** - Use PlacementArray instead |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'adapt-tooltip-demo',
  templateUrl: './tooltip.demo.html'
})
export class AdaptTooltipDemoComponent {
  tooltipText: string = 'This is helpful information';
  tooltipPlacement: 'top' | 'right' | 'bottom' | 'left' | 'auto' = 'top';
}
```

### HTML Template

```html
<!-- Simple Text Tooltip -->
<button type="button"
        class="btn btn-secondary"
        adaptTooltip="This is a tooltip">
  Hover me
</button>

<!-- Tooltip with Placement -->
<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Top tooltip"
        [placement]="'top'">
  Top
</button>

<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Right tooltip"
        [placement]="'right'">
  Right
</button>

<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Bottom tooltip"
        [placement]="'bottom'">
  Bottom
</button>

<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Left tooltip"
        [placement]="'left'">
  Left
</button>

<!-- Auto Placement -->
<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Auto positioned tooltip"
        [placement]="'auto'">
  Auto
</button>

<!-- Dynamic Tooltip Content -->
<button type="button"
        class="btn btn-secondary"
        [adaptTooltip]="tooltipText"
        [placement]="tooltipPlacement">
  Dynamic Tooltip
</button>

<!-- Tooltip with Custom Delay -->
<button type="button"
        class="btn btn-secondary"
        adaptTooltip="Tooltip with 500ms delay"
        [delay]="500">
  Delayed Tooltip
</button>

<!-- Tooltip with Custom Width -->
<button type="button"
        class="btn btn-secondary"
        adaptTooltip="This is a wider tooltip with more content"
        [width]="300">
  Wide Tooltip
</button>

<!-- Tooltip on Icon -->
<i class="d-icon-info_circle_o"
   adaptTooltip="Information tooltip"
   [placement]="'right'"></i>

<!-- Tooltip with Template -->
<button type="button"
        class="btn btn-secondary"
        [adaptTooltip]="tooltipTemplate"
        [context]="{name: 'User'}">
  Template Tooltip
</button>

<ng-template #tooltipTemplate let-name="name">
  <div>
    <strong>Welcome, {{name}}!</strong>
    <p>This is a custom template tooltip.</p>
  </div>
</ng-template>
```

## Key Features

- Text or template-based content
- Multiple placement options (top, right, bottom, left, auto)
- Configurable show delay
- Custom width support
- Custom CSS classes
- Template context support
- Accessibility support
- Automatic positioning
- Works on any element (buttons, icons, text, etc.)
- Floating or fixed placement

