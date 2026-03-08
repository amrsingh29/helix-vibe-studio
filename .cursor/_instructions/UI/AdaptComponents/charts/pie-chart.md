# Pie Chart

## Description

A pie chart (or a circle chart) is a circular statistical graphic which is divided into slices to illustrate numerical proportion. In a pie chart, the arc length of each slice (and consequently its central angle and area) is proportional to the quantity it represents.

Pie charts can also be displayed as donut charts with a hollow center.

### Import Options

From **v14.7.0** there are 2 ways of importing pie chart (circle chart) to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptPieChartModule` and reduce bundle size

## Import

```typescript
import {AdaptPieChartModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-pie-chart`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptPieChartSeries[] | - | Sets chart data series |
| isDoughnut | boolean | false | Toggles donut chart mode (hollow center) |
| legend | AdaptChartLegend | - | Sets the legend |
| colorsPalette | ColorsPalette | 'gradient' | Defines chart's color scheme |
| backgroundColor | string | - | Sets the background color of chart container |
| width | number | Fills container | Sets the chart container width |
| height | number | Fills container | Sets the chart container height |
| header | AdaptChartHeader | - | Sets chart header |
| suppressHeader | boolean | - | Toggles chart header visibility |
| suppressLegend | boolean | - | Toggles chart legend visibility |
| renderLegend | boolean | - | Useful to prevent legend rendering on view |
| tooltip | string \| TemplateRef<unknown> | - | Sets the custom string or template for tooltip |
| noDataText | string | 'No data to show...' | Sets the string which will be shown if you don't initialize data to chart |
| description | string | - | Sets the <desc> content for chart's SVG |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| clickChart | EventEmitter<AdaptPieChartClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptPieChartSeries,
  AdaptChartHeader,
  AdaptChartLegend
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-pie-chart-demo',
  templateUrl: './pie-chart.demo.html'
})
export class AdaptPieChartDemoComponent {
  isDoughnut: boolean = false;

  header: AdaptChartHeader = {
    title: 'Sales Distribution',
    allowHideLegend: true
  };

  legend: AdaptChartLegend = {
    columns: 1,
    items: [],
    customColors: []
  };

  data: AdaptPieChartSeries[] = [
    { name: 'Product A', value: 45, hidden: false },
    { name: 'Product B', value: 30, hidden: false },
    { name: 'Product C', value: 15, hidden: false },
    { name: 'Product D', value: 10, hidden: false }
  ];

  onCategoryShow(event: any): void {
    console.log('Category shown:', event);
  }

  onCategoryHide(event: any): void {
    console.log('Category hidden:', event);
  }

  onChartClick(event: any): void {
    console.log('Chart clicked:', event);
  }
}
```

### HTML Template

```html
<adapt-pie-chart [series]="data"
                 [isDoughnut]="isDoughnut"
                 [header]="header"
                 [legend]="legend"
                 [height]="400"
                 [description]="'Sales distribution by product'"
                 (categoryShow)="onCategoryShow($event)"
                 (categoryHide)="onCategoryHide($event)"
                 (clickChart)="onChartClick($event)"></adapt-pie-chart>
```

## Key Features

- Display data as proportional slices in a circle
- Support for both pie and donut (doughnut) chart modes
- Interactive legend with show/hide functionality
- Customizable color schemes
- Click events on chart slices
- Tooltip support
- Ideal for showing percentage distributions and proportions

