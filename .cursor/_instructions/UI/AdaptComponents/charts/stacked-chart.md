# Stacked Chart (Bar Chart)

## Description

A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars with heights or lengths proportional to the values that they represent. The bars can be plotted vertically or horizontally.

Bar graphs can be used for more complex comparisons of data with grouped bar charts and stacked bar charts. In a grouped bar chart, for each categorical group there are two or more bars color-coded to represent a particular grouping. A stacked bar chart stacks bars that represent different groups on top of each other. The height of the resulting bar shows the combined result of the groups.

Stacked bar charts are not suited to datasets where some groups have negative values. In such cases, grouped bar charts are preferable.

## Import

```typescript
import {AdaptStackedChartModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-stacked-chart`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| series | AdaptStackedChartSeries[] | - | Sets chart data series |
| type | AdaptStackedChartType | Bar | Chart type (Bar, Line, Area) |
| xAxis | AdaptChartAxis | - | Configuration for the X axis of the chart |
| yAxis | AdaptChartAxis | - | Configuration for the Y axis of the chart |
| rotateXAxis | boolean | false | Rotate x-axis text on 45deg |
| suppressAxes | boolean | false | Toggles chart axles visibility |
| maxTicksCount | number | 7 | Maximum number of ticks to display on the y-axis |
| thresholdLine | number | - | Threshold line in a chart |
| xAxisTickFormatResolver | (interval: string \| number, index: number) => string | - | Allows controlling X axes labels format |
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
| clickChart | EventEmitter<AdaptStackedChartClickEvent> | Emits each time chart has been clicked |
| categoryShow | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category shown |
| categoryHide | EventEmitter<AdaptChartCategoryToggleEvent> | Emits each time chart category hidden |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptStackedChartSeries,
  AdaptStackedChartType,
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptChartLegend
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-stacked-chart-demo',
  templateUrl: './stacked-chart.demo.html'
})
export class AdaptStackedChartDemoComponent {
  type: AdaptStackedChartType = AdaptStackedChartType.Bar;

  xAxis: AdaptChartAxis = {
    title: 'Months',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  };

  yAxis: AdaptChartAxis = {
    title: 'Revenue'
  };

  header: AdaptChartHeader = {
    title: 'Monthly Revenue',
    allowHideLegend: true
  };

  legend: AdaptChartLegend = {
    columns: 2,
    items: [],
    customColors: []
  };

  data: AdaptStackedChartSeries[] = [
    {
      name: 'Product A',
      hidden: false,
      data: [10, 15, 13, 17, 21, 18]
    },
    {
      name: 'Product B',
      hidden: false,
      data: [8, 12, 11, 14, 16, 15]
    },
    {
      name: 'Product C',
      hidden: false,
      data: [5, 8, 7, 10, 12, 11]
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
<adapt-stacked-chart [xAxis]="xAxis"
                     [yAxis]="yAxis"
                     [series]="data"
                     [type]="type"
                     [header]="header"
                     [legend]="legend"
                     [height]="500"
                     [rotateXAxis]="false"
                     [description]="'Stacked bar chart showing monthly revenue by product'"
                     (categoryShow)="onCategoryShow($event)"
                     (categoryHide)="onCategoryHide($event)"></adapt-stacked-chart>
```

## Key Features

- Display categorical data with stacked bars
- Support for vertical and horizontal orientation
- Multiple chart types (Bar, Line, Area)
- Show combined totals and individual contributions
- Interactive legend with show/hide functionality
- Threshold line support
- Rotatable x-axis labels
- Customizable color schemes
- Ideal for comparing parts of a whole across categories

