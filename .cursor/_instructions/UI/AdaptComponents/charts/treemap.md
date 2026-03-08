# Treemap

## Description

Treemaps display hierarchical (tree-structured) data as a set of nested rectangles. Each branch of the tree is represented by a rectangle, which is then tiled with smaller rectangles representing sub-branches. The size of each rectangle is proportional to a specified dimension of the data.

Treemaps are particularly useful for visualizing large hierarchical datasets and identifying patterns, such as which categories are the largest or smallest.

### Import Options

From **v14.7.0** there are 2 ways of importing treemap to the project:
1. import `AdaptChartsModule` as it has been earlier
2. import `AdaptTreemapModule` and reduce bundle size

## Import

```typescript
import {AdaptTreemapModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-treemap`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| data | AdaptTreemapData | - | Sets chart hierarchical data |
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
| clickChart | EventEmitter<AdaptTreemapClickEvent> | Emits each time chart has been clicked |
| cellClick | EventEmitter<AdaptTreemapCell> | Emits when a treemap cell is clicked |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {
  AdaptTreemapData,
  AdaptChartHeader,
  AdaptChartLegend
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-treemap-demo',
  templateUrl: './treemap.demo.html'
})
export class AdaptTreemapDemoComponent {
  header: AdaptChartHeader = {
    title: 'Storage Usage',
    allowHideLegend: true
  };

  legend: AdaptChartLegend = {
    columns: 1,
    items: [],
    customColors: []
  };

  data: AdaptTreemapData = {
    name: 'Root',
    children: [
      {
        name: 'Documents',
        value: 500,
        children: [
          { name: 'PDFs', value: 200 },
          { name: 'Word Docs', value: 150 },
          { name: 'Spreadsheets', value: 150 }
        ]
      },
      {
        name: 'Images',
        value: 800,
        children: [
          { name: 'Photos', value: 500 },
          { name: 'Screenshots', value: 200 },
          { name: 'Graphics', value: 100 }
        ]
      },
      {
        name: 'Videos',
        value: 1200
      },
      {
        name: 'Other',
        value: 300
      }
    ]
  };

  onCellClick(cell: any): void {
    console.log('Cell clicked:', cell);
  }

  onChartClick(event: any): void {
    console.log('Chart clicked:', event);
  }
}
```

### HTML Template

```html
<adapt-treemap [data]="data"
               [header]="header"
               [legend]="legend"
               [height]="500"
               [description]="'Storage usage visualization by category'"
               (cellClick)="onCellClick($event)"
               (clickChart)="onChartClick($event)"></adapt-treemap>
```

## Key Features

- Display hierarchical data as nested rectangles
- Rectangle size proportional to data values
- Support for multi-level hierarchies
- Interactive cells with click events
- Customizable color schemes
- Tooltip support
- Legend support
- Ideal for visualizing large hierarchical datasets
- Good for showing part-to-whole relationships
- Effective for comparing sizes within hierarchies

