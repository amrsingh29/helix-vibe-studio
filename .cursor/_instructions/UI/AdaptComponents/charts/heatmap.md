# Heatmap

## Description

A heat map (or heatmap) is a graphical representation of data where the individual values contained in a matrix are represented as colors. It's particularly useful for visualizing patterns, correlations, and concentrations in large datasets.

### Import Options

From **v14.7.0** there are 2 ways of importing heat map (heatmap) to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptHeatmapModule` and reduce bundle size

## Import

```typescript
import {AdaptHeatmapModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-heatmap`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| data | AdaptHeatmapData<unknown> | - | Sets chart data |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the Y axis of the chart |
| legend | AdaptChartLegend | - | Sets chart legend |
| backgroundColor | string | - | Sets the background color of chart container |
| width | number | Fills container | Sets the chart container width |
| height | number | Fills container | Sets the chart container height |
| header | AdaptChartHeader | - | Sets chart header |
| suppressHeader | boolean | - | Toggles chart header visibility |
| suppressLegend | boolean | - | Toggles chart legend visibility |
| tooltip | string \| TemplateRef<unknown> | - | Sets the custom string or template for tooltip |
| noDataText | string | 'No data to show...' | Sets the string which will be shown if you don't initialize data to chart |
| description | string | - | Sets the <desc> content for chart's SVG |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| clickChart | EventEmitter<AdaptHeatmapClickEvent> | Emits each time chart has been clicked |
| nodeAction | EventEmitter<AdaptHeatmapNodeAction> | Emits when a node action is triggered |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptHeatmapData,
  AdaptHeatmapNodeAction
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-heatmap-demo',
  templateUrl: './heatmap.demo.html'
})
export class AdaptHeatmapDemoComponent {
  xAxis: AdaptChartAxis = {
    title: 'Time',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  yAxis: AdaptChartAxis = {
    title: 'Servers',
    categories: ['Server 1', 'Server 2', 'Server 3', 'Server 4']
  };

  header: AdaptChartHeader = {
    title: 'Server Status Heatmap',
    allowHideLegend: true
  };

  data: AdaptHeatmapData<any> = {
    values: [
      [
        { name: 'Status', size: 10, icon: 'check_circle_o', bg: '#e8f5e9' },
        { name: 'Status', size: 15, icon: 'check_circle_o', bg: '#e8f5e9' },
        // ... more data points
      ],
      // ... more rows
    ]
  };

  onNodeAction(event: AdaptHeatmapNodeAction): void {
    console.log('Node action:', event);
  }

  onChartClick(event: any): void {
    console.log('Chart clicked:', event);
  }
}
```

### HTML Template

```html
<adapt-heatmap [xAxis]="xAxis"
               [yAxis]="yAxis"
               [header]="header"
               [data]="data"
               [height]="500"
               [description]="'Server status heatmap visualization'"
               (nodeAction)="onNodeAction($event)"
               (clickChart)="onChartClick($event)"></adapt-heatmap>
```

## Key Features

- Visual representation of data using colors
- Customizable color schemes
- Interactive cells with click events
- Support for icons and custom backgrounds per cell
- Configurable axes
- Tooltip support
- Legend support
- Empty state handling
- Ideal for displaying status matrices, correlations, and patterns

