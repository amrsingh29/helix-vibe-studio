# Area Stacked Graph

## Description

Stacked area graph is based on AdaptStackedChartComponent. It displays multiple data series stacked on top of each other, useful for showing how different components contribute to a total over time.

To enable stacked area graph input [type] should be set as AdaptStackedChartType.Area.

### Import Options

From **v14.7.0** there are 2 ways of importing area stacked graph to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptStackedChartModule` and reduce bundle size

## Import

```typescript
import {AdaptAreaStackedGraphModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-area-stacked-graph`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptStackedChartSeries[] | - | Sets chart data series |
| xAxisTickFormatResolver | (interval: string \| number, index: number) => string | - | Allows controlling X axes labels format. Under the hood used tickFormat() from D3. More information: https://github.com/d3/d3-axis#axis_tickFormat |
| thresholdLine | number | - | Threshold line in a chart to help determine which data points are either below or above a significant value |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the Y axis of the chart |
| rotateXAxis | boolean | false | Rotate x-axis text on 45deg. Could be useful when text is too long and you want to avoid overlapping. In case when axis text is too long (more than 150px) it will be split on multiple lines |
| suppressAxes | boolean | false | Toggles chart axles visibility (Since v17.25.0) |
| maxTicksCount | number | 7 | Maximum number of ticks to display on the y-axis. This value determines the granularity of the axis labels (Since v17.25.0) |
| legend | AdaptChartLegend | - | Sets the legend |
| colorsPalette | ColorsPalette | 'gradient' | Defines chart's color scheme. Specified color scheme will be applied in case no custom colors provided |
| disallowPadding | boolean | false | Unsets padding between actual graph data and axis. Might be useful for usage once toggling suppressAxes |
| scientificMode | boolean | false | Turns on showing numbers in scientific format (e.g. 1.4e-11 instead of 0.000000000014). BigNumber.js library used under the hood |
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

### Deprecated Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| hideAxises | boolean | false | **@deprecated since v17.25.0** - Please use suppressAxes property instead |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| clickChart | EventEmitter<AdaptStackedChartClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown (Since v12.11.0) |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden (Since v12.11.0) |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptChartLegend,
  AdaptStackedChartSeries,
  AdaptStackedChartType
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-area-graph-stacked-demo',
  templateUrl: './area-stacked-graph.demo.html'
})
export class AdaptAreaGraphStackedDemoComponent {
  type: AdaptStackedChartType = AdaptStackedChartType.Area;

  xAxis: AdaptChartAxis = {
    title: 'Months',
    categories: [
      'Jan 16', 'Feb 16', 'Mar 16', 'Apr 16', 'May 16', 'Jun 16',
      'Jul 16', 'Aug 16', 'Sep 16', 'Oct 16', 'Nov 16', 'Dec 16'
    ]
  };

  yAxis: AdaptChartAxis = {
    title: 'Costs'
  };

  header: AdaptChartHeader = {
    title: 'Costs',
    allowHideLegend: true
  };

  legend: AdaptChartLegend = {
    columns: 2,
    items: [],
    customColors: []
  };

  data: AdaptStackedChartSeries[] = [
    {
      name: 'Food',
      hidden: false,
      data: [1, 6, 1, 2, 9, 5, 7, 3, 5, 2, 8, 4]
    },
    {
      name: 'Water',
      hidden: false,
      data: [5, 2, 8, 4, 1, 6, 3, 7, 2, 9, 1, 5]
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
<adapt-area-stacked-graph [xAxis]="xAxis"
                          [rotateXAxis]="true"
                          [yAxis]="yAxis"
                          [series]="data"
                          [header]="header"
                          [height]="500"
                          [legend]="legend"
                          [description]="'This stacked area graph displays costs over time.'"
                          (categoryShow)="onCategoryShow($event)"
                          (categoryHide)="onCategoryHide($event)"></adapt-area-stacked-graph>
```

## Key Features

- Displays multiple data series stacked on top of each other
- Shows how different components contribute to a total value
- Interactive legend with show/hide functionality
- Threshold line support
- Customizable axes with formatters
- Rotatable x-axis labels for better readability
- Scientific notation mode for large/small numbers

