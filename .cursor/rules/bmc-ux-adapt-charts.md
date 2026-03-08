# BMC-UX Adapt Charts Guide

## Overview

BMC-UX Adapt Charts provides a comprehensive set of data visualization components built on D3.js. These charts are optimized for enterprise applications with features like responsive design, accessibility, and theming support.

**Version**: 18.24.0  
**Package**: `@bmc-ux/adapt-charts`  
**Dependencies**: D3.js v7.9.0, @swimlane/ngx-graph  
**BMC Helix Innovation Studio**: 25.3.0+

---

## Installation and Setup

### Import Module

```typescript
import { AdaptChartsModule } from '@bmc-ux/adapt-charts';

@NgModule({
  imports: [
    CommonModule,
    AdaptChartsModule
  ]
})
export class YourModule {}
```

### Standalone Component Import

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AdaptLineGraphComponent,
  AdaptBarChartComponent,
  AdaptPieChartComponent
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdaptLineGraphComponent,
    AdaptBarChartComponent,
    AdaptPieChartComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
```

---

## Chart Components

### 1. Line Graph (adapt-line-graph)

**Purpose**: Display trends and time-series data.

**Import**:
```typescript
import { AdaptLineGraphComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
// Component
lineChartData = {
  series: [
    {
      name: 'Sales',
      data: [
        { x: new Date('2024-01-01'), y: 100 },
        { x: new Date('2024-02-01'), y: 150 },
        { x: new Date('2024-03-01'), y: 120 },
        { x: new Date('2024-04-01'), y: 180 },
        { x: new Date('2024-05-01'), y: 200 }
      ]
    }
  ]
};

lineChartOptions = {
  width: 800,
  height: 400,
  showLegend: true,
  showGrid: true,
  curve: 'linear' // 'linear', 'smooth', 'step'
};
```

```html
<adapt-line-graph
  [data]="lineChartData"
  [options]="lineChartOptions">
</adapt-line-graph>
```

**Multiple Series**:
```typescript
lineChartData = {
  series: [
    {
      name: 'Sales',
      data: [
        { x: new Date('2024-01-01'), y: 100 },
        { x: new Date('2024-02-01'), y: 150 },
        { x: new Date('2024-03-01'), y: 120 }
      ],
      color: '#4CAF50'
    },
    {
      name: 'Revenue',
      data: [
        { x: new Date('2024-01-01'), y: 80 },
        { x: new Date('2024-02-01'), y: 130 },
        { x: new Date('2024-03-01'), y: 110 }
      ],
      color: '#2196F3'
    }
  ]
};
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | Object | - | Chart data with series |
| `options` | Object | {} | Chart configuration |
| `width` | number | auto | Chart width |
| `height` | number | 400 | Chart height |
| `showLegend` | boolean | true | Show legend |
| `showGrid` | boolean | true | Show grid lines |
| `curve` | string | 'linear' | Line curve type |
| `showTooltip` | boolean | true | Show tooltip on hover |

**Events**:
- `(pointClick)` - Emits when data point is clicked
- `(legendClick)` - Emits when legend item is clicked

---

### 2. Area Graph (adapt-area-graph)

**Purpose**: Display trends with filled area under the line.

**Import**:
```typescript
import { AdaptAreaGraphComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
areaChartData = {
  series: [
    {
      name: 'Traffic',
      data: [
        { x: '00:00', y: 100 },
        { x: '04:00', y: 80 },
        { x: '08:00', y: 200 },
        { x: '12:00', y: 250 },
        { x: '16:00', y: 180 },
        { x: '20:00', y: 120 }
      ]
    }
  ]
};
```

```html
<adapt-area-graph
  [data]="areaChartData"
  [height]="300">
</adapt-area-graph>
```

---

### 3. Stacked Area Graph (adapt-area-stacked-graph)

**Purpose**: Display multiple data series stacked on top of each other.

**Import**:
```typescript
import { AdaptAreaStackedGraphComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
stackedAreaData = {
  series: [
    {
      name: 'Desktop',
      data: [
        { x: 'Jan', y: 100 },
        { x: 'Feb', y: 120 },
        { x: 'Mar', y: 110 }
      ]
    },
    {
      name: 'Mobile',
      data: [
        { x: 'Jan', y: 80 },
        { x: 'Feb', y: 90 },
        { x: 'Mar', y: 95 }
      ]
    },
    {
      name: 'Tablet',
      data: [
        { x: 'Jan', y: 40 },
        { x: 'Feb', y: 45 },
        { x: 'Mar', y: 50 }
      ]
    }
  ]
};
```

```html
<adapt-area-stacked-graph
  [data]="stackedAreaData"
  [height]="400">
</adapt-area-stacked-graph>
```

---

### 4. Bar Chart (adapt-chart)

**Purpose**: Display categorical data with rectangular bars.

**Import**:
```typescript
import { AdaptChartComponent } from '@bmc-ux/adapt-charts';
```

**Vertical Bar Chart**:
```typescript
barChartData = {
  series: [
    {
      name: 'Sales',
      data: [
        { category: 'Product A', value: 100 },
        { category: 'Product B', value: 150 },
        { category: 'Product C', value: 120 },
        { category: 'Product D', value: 180 }
      ]
    }
  ]
};

barChartOptions = {
  type: 'bar',
  orientation: 'vertical',
  showValues: true,
  showLegend: true
};
```

```html
<adapt-chart
  [data]="barChartData"
  [options]="barChartOptions"
  [height]="400">
</adapt-chart>
```

**Horizontal Bar Chart**:
```typescript
barChartOptions = {
  type: 'bar',
  orientation: 'horizontal',
  showValues: true
};
```

**Grouped Bar Chart**:
```typescript
groupedBarData = {
  series: [
    {
      name: '2023',
      data: [
        { category: 'Q1', value: 100 },
        { category: 'Q2', value: 120 },
        { category: 'Q3', value: 110 },
        { category: 'Q4', value: 130 }
      ]
    },
    {
      name: '2024',
      data: [
        { category: 'Q1', value: 110 },
        { category: 'Q2', value: 130 },
        { category: 'Q3', value: 125 },
        { category: 'Q4', value: 145 }
      ]
    }
  ]
};
```

---

### 5. Stacked Bar Chart (adapt-stacked-chart)

**Purpose**: Display multiple data series stacked in bars.

**Import**:
```typescript
import { AdaptStackedChartComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
stackedBarData = {
  series: [
    {
      name: 'Critical',
      data: [
        { category: 'Jan', value: 10 },
        { category: 'Feb', value: 8 },
        { category: 'Mar', value: 12 }
      ],
      color: '#f44336'
    },
    {
      name: 'High',
      data: [
        { category: 'Jan', value: 20 },
        { category: 'Feb', value: 25 },
        { category: 'Mar', value: 22 }
      ],
      color: '#ff9800'
    },
    {
      name: 'Medium',
      data: [
        { category: 'Jan', value: 30 },
        { category: 'Feb', value: 28 },
        { category: 'Mar', value: 32 }
      ],
      color: '#ffeb3b'
    }
  ]
};
```

```html
<adapt-stacked-chart
  [data]="stackedBarData"
  [height]="400">
</adapt-stacked-chart>
```

---

### 6. Pie Chart (adapt-pie-chart)

**Purpose**: Display proportional data in circular format.

**Import**:
```typescript
import { AdaptPieChartComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
pieChartData = [
  { name: 'Chrome', value: 45, color: '#4285F4' },
  { name: 'Firefox', value: 25, color: '#FF7139' },
  { name: 'Safari', value: 20, color: '#00C4CC' },
  { name: 'Edge', value: 10, color: '#0078D7' }
];

pieChartOptions = {
  showLabels: true,
  showLegend: true,
  showPercentage: true
};
```

```html
<adapt-pie-chart
  [data]="pieChartData"
  [options]="pieChartOptions"
  [width]="400"
  [height]="400">
</adapt-pie-chart>
```

**Donut Chart**:
```typescript
pieChartOptions = {
  donut: true,
  innerRadius: 0.6, // 60% of radius
  showLabels: true
};
```

---

### 7. Dual Chart (adapt-dual-chart)

**Purpose**: Display two different metrics on the same chart with dual Y-axes.

**Import**:
```typescript
import { AdaptDualChartComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
dualChartData = {
  primarySeries: {
    name: 'Revenue',
    type: 'bar',
    data: [
      { x: 'Jan', y: 10000 },
      { x: 'Feb', y: 12000 },
      { x: 'Mar', y: 11000 }
    ]
  },
  secondarySeries: {
    name: 'Growth %',
    type: 'line',
    data: [
      { x: 'Jan', y: 5 },
      { x: 'Feb', y: 8 },
      { x: 'Mar', y: 6 }
    ]
  }
};
```

```html
<adapt-dual-chart
  [data]="dualChartData"
  [height]="400">
</adapt-dual-chart>
```

---

### 8. Scatter Plot (adapt-scatter-plot)

**Purpose**: Display correlation between two variables.

**Import**:
```typescript
import { AdaptScatterPlotComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
scatterData = {
  series: [
    {
      name: 'Dataset 1',
      data: [
        { x: 10, y: 20, size: 5 },
        { x: 15, y: 25, size: 8 },
        { x: 20, y: 30, size: 6 },
        { x: 25, y: 35, size: 10 }
      ]
    }
  ]
};

scatterOptions = {
  xAxisLabel: 'X Axis',
  yAxisLabel: 'Y Axis',
  showGrid: true
};
```

```html
<adapt-scatter-plot
  [data]="scatterData"
  [options]="scatterOptions"
  [height]="400">
</adapt-scatter-plot>
```

---

### 9. Heatmap (adapt-heatmap)

**Purpose**: Display data density using color intensity.

**Import**:
```typescript
import { AdaptHeatmapComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
heatmapData = {
  xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  yLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  data: [
    [10, 20, 30, 40, 50],
    [15, 25, 35, 45, 55],
    [20, 30, 40, 50, 60],
    [25, 35, 45, 55, 65],
    [30, 40, 50, 60, 70],
    [35, 45, 55, 65, 75]
  ]
};

heatmapOptions = {
  colorScheme: 'cool', // 'cool', 'warm', 'natural'
  showValues: true
};
```

```html
<adapt-heatmap
  [data]="heatmapData"
  [options]="heatmapOptions"
  [height]="400">
</adapt-heatmap>
```

---

### 10. Treemap (adapt-treemap)

**Purpose**: Display hierarchical data using nested rectangles.

**Import**:
```typescript
import { AdaptTreemapComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
treemapData = {
  name: 'Root',
  children: [
    {
      name: 'Category A',
      value: 100,
      children: [
        { name: 'Item 1', value: 40 },
        { name: 'Item 2', value: 60 }
      ]
    },
    {
      name: 'Category B',
      value: 150,
      children: [
        { name: 'Item 3', value: 80 },
        { name: 'Item 4', value: 70 }
      ]
    }
  ]
};
```

```html
<adapt-treemap
  [data]="treemapData"
  [height]="400">
</adapt-treemap>
```

---

### 11. Flow Chart (adapt-flow-chart)

**Purpose**: Display process flows and relationships.

**Import**:
```typescript
import { AdaptFlowChartComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
flowChartData = {
  nodes: [
    { id: '1', label: 'Start', type: 'start' },
    { id: '2', label: 'Process 1', type: 'process' },
    { id: '3', label: 'Decision', type: 'decision' },
    { id: '4', label: 'Process 2', type: 'process' },
    { id: '5', label: 'End', type: 'end' }
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    { source: '3', target: '4', label: 'Yes' },
    { source: '3', target: '5', label: 'No' },
    { source: '4', target: '5' }
  ]
};
```

```html
<adapt-flow-chart
  [data]="flowChartData"
  [height]="500">
</adapt-flow-chart>
```

---

## Chart Legend

### Chart Legend Component (adapt-chart-legend)

**Purpose**: Display chart legend separately from the chart.

**Import**:
```typescript
import { AdaptChartLegendComponent } from '@bmc-ux/adapt-charts';
```

**Basic Usage**:
```typescript
legendData = [
  { name: 'Series 1', color: '#4CAF50', visible: true },
  { name: 'Series 2', color: '#2196F3', visible: true },
  { name: 'Series 3', color: '#FF9800', visible: false }
];
```

```html
<adapt-chart-legend
  [items]="legendData"
  [orientation]="'horizontal'"
  (itemClick)="onLegendClick($event)">
</adapt-chart-legend>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | Array | [] | Legend items |
| `orientation` | string | 'horizontal' | 'horizontal' or 'vertical' |
| `position` | string | 'bottom' | Legend position |

---

## Chart Configuration

### Common Chart Options

```typescript
interface ChartOptions {
  // Dimensions
  width?: number;           // Chart width (auto if not specified)
  height?: number;          // Chart height (default: 400)
  
  // Display
  showLegend?: boolean;     // Show legend (default: true)
  showGrid?: boolean;       // Show grid lines (default: true)
  showTooltip?: boolean;    // Show tooltip (default: true)
  showValues?: boolean;     // Show values on chart (default: false)
  
  // Axes
  xAxisLabel?: string;      // X-axis label
  yAxisLabel?: string;      // Y-axis label
  xAxisFormat?: string;     // X-axis format (e.g., '%Y-%m-%d')
  yAxisFormat?: string;     // Y-axis format (e.g., '.2f')
  
  // Colors
  colorScheme?: string;     // Color scheme name
  colors?: string[];        // Custom colors array
  
  // Interaction
  enableZoom?: boolean;     // Enable zoom (default: false)
  enablePan?: boolean;      // Enable pan (default: false)
  
  // Animation
  animate?: boolean;        // Enable animation (default: true)
  animationDuration?: number; // Animation duration in ms
}
```

### Color Schemes

```typescript
// Predefined color schemes
colorSchemes = {
  default: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'],
  cool: ['#00BCD4', '#2196F3', '#3F51B5', '#673AB7', '#9C27B0'],
  warm: ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39'],
  natural: ['#8BC34A', '#4CAF50', '#009688', '#00BCD4', '#03A9F4'],
  monochrome: ['#212121', '#424242', '#616161', '#757575', '#9E9E9E']
};

// Usage
chartOptions = {
  colorScheme: 'cool'
};

// Or custom colors
chartOptions = {
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
};
```

---

## Responsive Charts

### Auto-Resize

```typescript
// Component
@ViewChild('chartContainer') chartContainer: ElementRef;

ngAfterViewInit() {
  // Chart will auto-resize to container
  this.chartWidth = this.chartContainer.nativeElement.offsetWidth;
}

@HostListener('window:resize')
onResize() {
  this.chartWidth = this.chartContainer.nativeElement.offsetWidth;
}
```

```html
<div #chartContainer class="chart-container">
  <adapt-line-graph
    [data]="chartData"
    [width]="chartWidth"
    [height]="400">
  </adapt-line-graph>
</div>
```

### Responsive Configuration

```typescript
chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024
  }
};
```

---

## Chart Interactions

### Click Events

```typescript
// Component
onPointClick(event: any) {
  console.log('Point clicked:', event);
  // event contains: { series, point, x, y, value }
}

onLegendClick(event: any) {
  console.log('Legend clicked:', event);
  // Toggle series visibility
  this.toggleSeries(event.series);
}
```

```html
<adapt-line-graph
  [data]="chartData"
  (pointClick)="onPointClick($event)"
  (legendClick)="onLegendClick($event)">
</adapt-line-graph>
```

### Tooltips

```typescript
// Custom tooltip formatter
tooltipFormatter(data: any): string {
  return `
    <div class="custom-tooltip">
      <strong>${data.series}</strong><br>
      ${data.x}: ${data.y}
    </div>
  `;
}

chartOptions = {
  tooltip: {
    enabled: true,
    formatter: this.tooltipFormatter.bind(this)
  }
};
```

---

## Real-Time Data Updates

### Live Data Streaming

```typescript
// Component
private dataSubscription: Subscription;

ngOnInit() {
  // Simulate real-time data
  this.dataSubscription = interval(1000).subscribe(() => {
    this.updateChartData();
  });
}

updateChartData() {
  const newPoint = {
    x: new Date(),
    y: Math.random() * 100
  };
  
  // Add new point
  this.chartData.series[0].data.push(newPoint);
  
  // Keep only last 20 points
  if (this.chartData.series[0].data.length > 20) {
    this.chartData.series[0].data.shift();
  }
  
  // Trigger change detection
  this.chartData = { ...this.chartData };
}

ngOnDestroy() {
  this.dataSubscription?.unsubscribe();
}
```

---

## Performance Optimization

### Large Datasets

```typescript
// Use data sampling for large datasets
chartOptions = {
  sampling: {
    enabled: true,
    threshold: 1000, // Sample if more than 1000 points
    method: 'lttb' // Largest-Triangle-Three-Buckets algorithm
  }
};
```

### Virtual Scrolling

```typescript
// For charts with many series
chartOptions = {
  virtualScroll: {
    enabled: true,
    itemHeight: 30,
    maxVisibleItems: 20
  }
};
```

### Lazy Loading

```typescript
// Load chart data on demand
loadChartData() {
  this.loading = true;
  this.chartService.getData().subscribe(data => {
    this.chartData = data;
    this.loading = false;
  });
}
```

---

## Exporting Charts

### Export as Image

```typescript
import { AdaptChartExportService } from '@bmc-ux/adapt-charts';

constructor(private exportService: AdaptChartExportService) {}

exportToPNG() {
  this.exportService.exportChart('myChart', {
    format: 'png',
    filename: 'chart.png',
    width: 1200,
    height: 600
  });
}

exportToSVG() {
  this.exportService.exportChart('myChart', {
    format: 'svg',
    filename: 'chart.svg'
  });
}
```

```html
<adapt-line-graph
  id="myChart"
  [data]="chartData">
</adapt-line-graph>

<button adapt-button (click)="exportToPNG()">Export PNG</button>
<button adapt-button (click)="exportToSVG()">Export SVG</button>
```

---

## Accessibility

### ARIA Support

All charts include:
- ARIA labels for screen readers
- Keyboard navigation
- High contrast mode support
- Focus indicators

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate to chart |
| Arrow Keys | Navigate data points |
| Enter | Select data point |
| Esc | Clear selection |

### Data Tables

```html
<!-- Provide data table alternative for accessibility -->
<adapt-line-graph [data]="chartData"></adapt-line-graph>

<table class="sr-only" aria-label="Chart data">
  <thead>
    <tr>
      <th>Date</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let point of chartData.series[0].data">
      <td>{{ point.x }}</td>
      <td>{{ point.y }}</td>
    </tr>
  </tbody>
</table>
```

---

## Best Practices

### 1. Choose the Right Chart Type

- **Line/Area**: Trends over time
- **Bar/Column**: Comparisons between categories
- **Pie/Donut**: Parts of a whole (max 6-8 slices)
- **Scatter**: Correlation between variables
- **Heatmap**: Data density and patterns

### 2. Color Usage

```typescript
// Use consistent colors for same data across charts
const brandColors = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336'
};

// Use colorblind-friendly palettes
const accessibleColors = [
  '#0173B2', '#DE8F05', '#029E73', '#CC78BC',
  '#CA9161', '#949494', '#ECE133', '#56B4E9'
];
```

### 3. Data Formatting

```typescript
// Format large numbers
yAxisFormat: '.2s' // 1000 becomes 1k, 1000000 becomes 1M

// Format dates
xAxisFormat: '%b %d' // Jan 01

// Format percentages
yAxisFormat: '.0%' // 0.5 becomes 50%

// Format currency
yAxisFormat: '$,.2f' // 1234.56 becomes $1,234.56
```

### 4. Performance

- Limit data points to 500-1000 for smooth interaction
- Use sampling for larger datasets
- Debounce real-time updates
- Lazy load charts below the fold

### 5. Responsive Design

```scss
.chart-container {
  width: 100%;
  height: 400px;
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
}
```

---

## Common Patterns

### Dashboard with Multiple Charts

```html
<div class="dashboard-grid">
  <div class="chart-card">
    <h3>Sales Trend</h3>
    <adapt-line-graph [data]="salesData"></adapt-line-graph>
  </div>
  
  <div class="chart-card">
    <h3>Revenue by Product</h3>
    <adapt-pie-chart [data]="revenueData"></adapt-pie-chart>
  </div>
  
  <div class="chart-card">
    <h3>Monthly Comparison</h3>
    <adapt-chart [data]="comparisonData"></adapt-chart>
  </div>
</div>
```

### Chart with Filters

```typescript
// Component
filterData(period: string) {
  this.loading = true;
  this.chartService.getData(period).subscribe(data => {
    this.chartData = data;
    this.loading = false;
  });
}
```

```html
<div class="chart-controls">
  <button adapt-button (click)="filterData('day')">Day</button>
  <button adapt-button (click)="filterData('week')">Week</button>
  <button adapt-button (click)="filterData('month')">Month</button>
</div>

<adapt-line-graph
  [data]="chartData"
  [loading]="loading">
</adapt-line-graph>
```

---

## Troubleshooting

### Issue: Chart not rendering

**Solution**: Ensure container has defined height
```scss
.chart-container {
  height: 400px; // Required
}
```

### Issue: Data not updating

**Solution**: Create new object reference
```typescript
// Wrong
this.chartData.series[0].data.push(newPoint);

// Correct
this.chartData = {
  ...this.chartData,
  series: [...this.chartData.series]
};
```

### Issue: Performance issues

**Solution**: Enable sampling or reduce data points
```typescript
chartOptions = {
  sampling: { enabled: true, threshold: 500 }
};
```

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Package Version**: @bmc-ux/adapt-charts 18.24.0
