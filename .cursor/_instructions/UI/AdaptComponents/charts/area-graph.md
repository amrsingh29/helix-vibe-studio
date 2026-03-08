# Area Graph

## Description

Area graphs are used to display quantitative values over a continuous interval or time period. The area graph is most frequently used to show trends and analyse how the data has changed over time.

Area graphs are drawn by first plotting data points on a Cartesian coordinate grid, then connecting a line between all of these points. Typically, the y-axis has a quantitative value, while the x-axis is a timescale or a sequence of intervals. Negative values can be displayed below the x-axis.

Area graph extends line graph.

### Import Options

From **v14.7.0** there are 2 ways of importing area graph to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptAreaGraphModule` and reduce bundle size

## Import

```typescript
import {AdaptAreaGraphModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-area-graph`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptChartSeries<Point>[] | - | Sets chart data series |
| showLineCircles | boolean | true | Toggles circles visibility on chart lines hover |
| thresholdLine | number | - | Threshold line in a chart to help determine which data points are either below or above a significant value (Since 10.11.0) |
| formatXAxisValue | (domainValue: AxisDomain, index: number) => string | - | Sets the x-axis values formatter |
| showSlider | boolean | false | Toggles chart slider visibility |
| slidePointsCount | number | - | Sets min amount of points to be shown on the graph (Since v10.4.0) |
| suppressAxes | boolean | false | Toggles chart axles visibility (Since v17.25.0) |
| maxTicksCount | number | 7 | Maximum number of ticks to display on the y-axis. This value determines the granularity of the axis labels (Since v17.25.0) |
| optionFormatter | (option: number) => number | - | Formatter that transforms the y-axis steps (Since v14.32.0) |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the Y axis of the chart |
| rotateXAxis | boolean | false | Rotate x-axis text on 45deg. Could be useful when text is too long and you want to avoid overlapping. In case when axis text is too long (more than 150px) it will be split on multiple lines |
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
| supressAxles | boolean | false | **@deprecated since v17.25.0** - Please use suppressAxes property instead |
| hideAxises | boolean | false | **@deprecated since v17.25.0** - Please use suppressAxes property instead |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| clickChart | EventEmitter<AdaptAreaGraphClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown (Since v12.11.0) |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden (Since v12.11.0) |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptAreaGraphSeries,
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptChartLegend
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-area-graph-demo',
  templateUrl: './area-graph.demo.html'
})
export class AdaptAreaGraphDemoComponent {
  showAxes: boolean = true;
  showSlider: boolean = false;

  xAxis: AdaptChartAxis = {
    title: 'Year',
    categories: []
  };

  yAxis: AdaptChartAxis = {
    title: 'Number of some data'
  };

  header: AdaptChartHeader = {
    title: 'Area Graph',
    allowHideLegend: true
  }

  legend: AdaptChartLegend = {
    columns: 1,
    items: [],
    customColors: []
  };

  data: AdaptAreaGraphSeries[] = [
    {
      name: 'Installation',
      hidden: false,
      data: [
        {x: 100, y: 2000},
        {x: 101, y: 2100},
        {x: 102, y: 2050},
        // ... more data points
      ]
    },
    {
      name: 'Purchases',
      hidden: true,
      data: [
        {x: 100, y: 1000},
        {x: 101, y: 1100},
        {x: 102, y: 1050},
        // ... more data points
      ]
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
<adapt-area-graph [xAxis]="xAxis"
                  [yAxis]="yAxis"
                  [header]="header"
                  [legend]="legend"
                  [description]="'This chart displays the number of installations and purchases over the course of the last year.'"
                  [series]="data"
                  [suppressAxes]="!showAxes"
                  [showSlider]="showSlider"
                  [slidePointsCount]="3"
                  [height]="460"
                  (categoryShow)="onCategoryShow($event)"
                  (categoryHide)="onCategoryHide($event)"></adapt-area-graph>
```

## Key Features

- Display quantitative data over time or continuous intervals
- Support for multiple data series
- Interactive legend with show/hide functionality
- Optional slider for data navigation
- Threshold line support
- Customizable axes with formatters
- Tooltip customization
- Scientific notation mode for very large/small numbers

