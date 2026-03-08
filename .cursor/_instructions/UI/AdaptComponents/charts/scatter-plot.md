# Scatter Plot

## Description

A scatter plot (also called a scatterplot, scatter graph, scatter chart, scattergram, or scatter diagram) is a type of plot or mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data.

If the points are color-coded, one additional variable can be displayed. The data are displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.

### Import Options

From **v14.7.0** there are 2 ways of importing scatter graph to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptScatterPlotModule` and reduce bundle size

## Import

```typescript
import {AdaptScatterPlotModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-scatter-plot`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptScatterPlotSeries[] | - | Sets chart data series |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the Y axis of the chart |
| rotateXAxis | boolean | false | Rotate x-axis text on 45deg |
| suppressAxes | boolean | false | Toggles chart axles visibility |
| maxTicksCount | number | 7 | Maximum number of ticks to display on the y-axis |
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
| clickChart | EventEmitter<AdaptScatterPlotClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptScatterPlotSeries,
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptChartLegend
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-scatter-plot-demo',
  templateUrl: './scatter-plot.demo.html'
})
export class AdaptScatterPlotDemoComponent {
  xAxis: AdaptChartAxis = {
    title: 'X Axis',
    categories: []
  };

  yAxis: AdaptChartAxis = {
    title: 'Y Axis'
  };

  header: AdaptChartHeader = {
    title: 'Scatter Plot',
    allowHideLegend: true
  };

  legend: AdaptChartLegend = {
    columns: 1,
    items: [],
    customColors: []
  };

  data: AdaptScatterPlotSeries[] = [
    {
      name: 'Series 1',
      hidden: false,
      data: [
        { x: 10, y: 20 },
        { x: 15, y: 35 },
        { x: 20, y: 30 },
        { x: 25, y: 45 }
      ]
    },
    {
      name: 'Series 2',
      hidden: false,
      data: [
        { x: 12, y: 25 },
        { x: 18, y: 40 },
        { x: 22, y: 35 },
        { x: 28, y: 50 }
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
<adapt-scatter-plot [xAxis]="xAxis"
                    [yAxis]="yAxis"
                    [header]="header"
                    [legend]="legend"
                    [series]="data"
                    [height]="460"
                    [description]="'Scatter plot showing correlation between two variables'"
                    (categoryShow)="onCategoryShow($event)"
                    (categoryHide)="onCategoryHide($event)"></adapt-scatter-plot>
```

## Key Features

- Display relationships between two variables
- Support for multiple data series
- Color-coded points for additional dimension
- Interactive legend with show/hide functionality
- Customizable axes
- Scientific notation mode for large/small numbers
- Ideal for correlation analysis and pattern identification

