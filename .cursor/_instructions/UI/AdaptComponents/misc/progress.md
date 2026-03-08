# Progress

## Description

Progress bars let the user know something is happening related to a specific activity. They set expectations that more work is needed to get to a state of completion of a functional task or activity.

### Guidance

- Use a progress bar to set expectations that more work is needed to get to a state of completion of a functional task or activity.
- Avoid using progress bars for page loading feedback during navigation. Instead, use a loader to signify the state of information being retrieved and displayed.

## Import

```typescript
import {AdaptProgressModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-progress`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| config | AdaptProgressConfig | - | Configuration for progress bar (see interface below) |

### Exported Interfaces

#### AdaptProgressConfig

```typescript
interface AdaptProgressConfig {
  value_min?: number;           // Minimum value
  value_max?: number;           // Maximum value
  value_now?: number;           // Current value
  type?: 'bar' | 'multibar';   // Progress bar type
  animated?: boolean;           // Enable animation
  striped?: boolean;            // Enable striped pattern
  segments?: AdaptProgressSegmentConfig[];  // Array of segments for multibar
  indicators?: AdaptProgressIndicator[];    // Progress indicators
}
```

#### AdaptProgressSegmentConfig

| Name | Type | Description |
|------|------|-------------|
| animated | boolean | Adds animation |
| title | string | Tooltip string, which appears above segment. Empty value removes the tooltip |
| action | any | Callback, firing on click/keypress. Sends back $event and the object of the clicked segment |
| value_now | number | Current value of the segment |
| value_min | number | Minimum value of the segment |
| value_max | number | Maximum value of the segment |
| type | string | Segment type (e.g., 'success', 'warning', 'danger', 'info') |
| striped | boolean | Enable striped pattern for segment |

#### AdaptProgressIndicator

| Name | Type | Description |
|------|------|-------------|
| title | string | Title of the indicator |
| min_width | number | Minimum width for title of indicator in pixels |
| value_now | number | Current value of the indicator |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {AdaptProgressConfig, AdaptProgressSegmentConfig} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'adapt-progress-demo',
  templateUrl: './progress.demo.html'
})
export class AdaptProgressDemoComponent {
  // Simple Progress Bar
  simpleConfig: AdaptProgressConfig = {
    value_min: 0,
    value_max: 100,
    value_now: 65,
    type: 'bar',
    animated: false,
    striped: false
  };

  // Animated and Striped
  animatedConfig: AdaptProgressConfig = {
    value_min: 0,
    value_max: 100,
    value_now: 75,
    type: 'bar',
    animated: true,
    striped: true
  };

  // Multi-bar Progress
  multibarConfig: AdaptProgressConfig = {
    value_min: 0,
    value_max: 100,
    type: 'multibar',
    segments: [
      {
        value_now: 30,
        type: 'success',
        title: 'Completed: 30%',
        animated: false
      },
      {
        value_now: 20,
        type: 'warning',
        title: 'In Progress: 20%',
        animated: true
      },
      {
        value_now: 15,
        type: 'danger',
        title: 'Failed: 15%',
        animated: false
      }
    ]
  };

  // Progress with Indicators
  indicatorConfig: AdaptProgressConfig = {
    value_min: 0,
    value_max: 100,
    value_now: 60,
    type: 'bar',
    indicators: [
      { title: 'Start', value_now: 0, min_width: 50 },
      { title: 'Midpoint', value_now: 50, min_width: 50 },
      { title: 'Target', value_now: 100, min_width: 50 }
    ]
  };

  onSegmentClick(event: any, segment: any): void {
    console.log('Segment clicked:', event, segment);
  }
}
```

### HTML Template

```html
<!-- Simple Progress Bar -->
<div class="mb-3">
  <label>Simple Progress (65%)</label>
  <adapt-progress [config]="simpleConfig"></adapt-progress>
</div>

<!-- Animated and Striped -->
<div class="mb-3">
  <label>Animated & Striped (75%)</label>
  <adapt-progress [config]="animatedConfig"></adapt-progress>
</div>

<!-- Multi-bar Progress -->
<div class="mb-3">
  <label>Multi-bar Progress</label>
  <adapt-progress [config]="multibarConfig"></adapt-progress>
</div>

<!-- Progress with Indicators -->
<div class="mb-3">
  <label>Progress with Indicators</label>
  <adapt-progress [config]="indicatorConfig"></adapt-progress>
</div>

<!-- Inline Configuration -->
<div class="mb-3">
  <label>Quick Progress</label>
  <adapt-progress [config]="{
    value_min: 0,
    value_max: 100,
    value_now: 45,
    type: 'bar',
    animated: true
  }"></adapt-progress>
</div>
```

## Key Features

- Single bar and multi-bar modes
- Animated progress indication
- Striped pattern option
- Segmented progress (different colors/types)
- Progress indicators/markers
- Clickable segments with callbacks
- Tooltips on segments
- Min/max value configuration
- Multiple segment types (success, warning, danger, info)
- Accessibility support (ARIA attributes)

