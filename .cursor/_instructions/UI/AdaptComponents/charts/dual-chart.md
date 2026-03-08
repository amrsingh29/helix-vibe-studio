# Dual Chart

## Description

Dual chart allows you to display two different types of charts (area stacked chart and line graph) with two separate Y-axes (primary and secondary) on the same chart. This is useful for comparing metrics with different scales or units.

## Import

```typescript
import {AdaptDualChartModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-dual-chart`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptDualChartSeries[] | - | Sets chart data series |
| yAxisSecondary | AdaptChartAxis | - | Configuration for the secondary Y axis of the chart |
| optionFormatterYPrimaryStep | (option: number) => number | - | Formatter function for transforming primary y-axis steps |
| optionFormatterYPrimaryValue | (option: number) => string | - | Formatter function for transforming primary y-axis values displayed on chart |
| optionFormatterYSecondaryStep | (option: number) => number | - | Formatter function for transforming secondary y-axis steps |
| optionFormatterYSecondaryValue | (option: number) => string | - | Formatter function for transforming secondary y-axis values displayed on chart |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the primary Y axis of the chart |
| rotateXAxis | boolean | false | Rotate x-axis text on 45deg. Could be useful when text is too long and you want to avoid overlapping. In case when axis text is too long (more than 150px) it will be split on multiple lines |
| suppressAxes | boolean | false | Toggles chart axles visibility (Since v17.25.0) |
| maxTicksCount | number | 7 | Maximum number of ticks to display on the y-axis (Since v17.25.0) |
| legend | AdaptChartLegend | - | Sets the legend |
| colorsPalette | ColorsPalette | 'gradient' | Defines chart's color scheme |
| disallowPadding | boolean | false | Unsets padding between actual graph data and axis |
| scientificMode | boolean | false | Turns on showing numbers in scientific format |
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
| clickChart | EventEmitter<AdaptDualChartClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown (Since v12.11.0) |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden (Since v12.11.0) |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptChartParentYAxis,
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptDualChartSeries,
  AdaptDualChartSubType,
  ColorsPalette
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-dual-chart-demo',
  templateUrl: './dual-chart.demo.html'
})
export class DocsDualChartDemoComponent {
  colorsPalette: ColorsPalette = 'high-diff';
  
  header: AdaptChartHeader = {
    title: 'Cache Performance',
    allowHideLegend: true
  };

  xAxis: AdaptChartAxis = {
    title: '',
    categories: ['03:54', '04:04', '04:14', '04:24', '04:34', '04:44']
  };
  
  yAxisPrimary: AdaptChartAxis = {
    title: 'Cache Hits',
  };
  
  yAxisSecondary: AdaptChartAxis = {
    title: 'Cache Misses / Evictions',
  };

  graphData: AdaptDualChartSeries[] = [
    {
      name: 'Cache Hits',
      hidden: false,
      parentYAxis: AdaptChartParentYAxis.Primary,
      renderAs: AdaptDualChartSubType.AreaStackedChart,
      data: [1198887, 14237, 12865, 372940, 20150, 134711]
    },
    {
      name: 'Cache Misses',
      hidden: false,
      parentYAxis: AdaptChartParentYAxis.Secondary,
      renderAs: AdaptDualChartSubType.LineGraph,
      data: [2958, 1, 0, 463, 1, 0]
    }
  ];

  onCategoryShow(event: any): void {
    console.log('Category shown:', event);
  }

  onCategoryHide(event: any): void {
    console.log('Category hidden:', event);
  }
}
```

### HTML Template

```html
<adapt-dual-chart [xAxis]="xAxis"
                  [rotateXAxis]="true"
                  [yAxis]="yAxisPrimary"
                  [yAxisSecondary]="yAxisSecondary"
                  [header]="header"
                  [series]="graphData"
                  [colorsPalette]="colorsPalette"
                  (categoryShow)="onCategoryShow($event)"
                  (categoryHide)="onCategoryHide($event)"></adapt-dual-chart>
```

## Key Features

- Combines multiple chart types (area stacked and line graphs)
- Supports two separate Y-axes with different scales
- Each series can be assigned to primary or secondary Y-axis
- Interactive legend with show/hide functionality
- Separate formatters for each Y-axis
- Customizable axes and styling
- Useful for comparing metrics with different units or scales

