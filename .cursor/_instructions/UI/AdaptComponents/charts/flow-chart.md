# Flow Chart

## Description

Flow chart is based on the ngx-graph library. It visualizes directed graphs with nodes and edges, useful for displaying workflows, processes, and hierarchical relationships.

### Important Notes

- The chart uses the OnPush strategy for change detection. Make sure to change the @Input() reference in order to apply changes to the flow chart.
- `<base href="/">` inside index file can corrupt arrow icons due to incorrect url resolving in `marker-end="url(#arrow)"`.
- Use `{ provide: APP_BASE_HREF, useValue: '/' }` instead.

## Import

```typescript
import {AdaptFlowChartModule} from '@bmc-ux/adapt-charts';
```

## Component Name / Selector

**Selector:** `adapt-flow-chart`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| links | AdaptFlowChartEdge[] | - | Array of links that connect nodes to each other |
| nodes | AdaptFlowChartNode[] | - | Array of nodes that can be used to show main information |
| curve | shape.CurveFactory | curveCatmullRom | Type of curve which will be used to draw connection links. More info: https://github.com/d3/d3-shape#curves |
| orientation | AdaptFlowChartOrientation | BOTTOM_TO_TOP | Used to pass flow direction. Ex: from bottom to top |
| zoomSpeed | number | 0.04 | Value that is used to control zoom speed. Higher value - higher speed |
| enableZoom | boolean | true | Toggles chart zoom feature |
| autoZoom | boolean | false | Toggles zoom on chart initialization |
| autoCenter | boolean | false | Toggles chart centering on initialization |
| texts | AdaptFlowChartTexts | - | Configurable texts for flow-chart |
| hasEmptyState | boolean | false | Toggles empty state display |
| emptyStateConfig | object | - | Configuration for empty state |
| width | number | Fills container | Sets the chart container width |
| height | number | Fills container | Sets the chart container height |
| header | AdaptChartHeader | - | Sets chart header |
| suppressHeader | boolean | - | Toggles chart header visibility |
| description | string | - | Sets the <desc> content for chart's SVG |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| nodeClick | EventEmitter<AdaptFlowChartNode> | Emits when a node is clicked |
| linkClick | EventEmitter<AdaptFlowChartEdge> | Emits when a link is clicked |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import * as shape from 'd3-shape';
import {
  AdaptFlowChartEdge,
  AdaptFlowChartNode,
  AdaptFlowChartOrientation,
  AdaptFlowChartTexts,
  AdaptChartColorStatus
} from '@bmc-ux/adapt-charts';

@Component({
  selector: 'adapt-flow-chart-demo',
  templateUrl: './flow-chart.demo.html',
  styles: [`
    adapt-flow-chart {
      height: 500px;
    }
  `]
})
export class AdaptFlowChartDemoComponent {
  curve: shape.CurveFactory = shape.curveLinear;
  orientation: AdaptFlowChartOrientation = AdaptFlowChartOrientation.BOTTOM_TO_TOP;
  zoomSpeed: number = 0.04;
  enableZoom: boolean = true;
  autoZoom: boolean = true;
  autoCenter: boolean = false;
  
  texts: AdaptFlowChartTexts = {
    fitGraphButton: 'Fit to screen'
  };
  
  emptyStateConfig = {
    label: 'Chart data is empty',
    inverted: false
  };
  
  links: AdaptFlowChartEdge[] = [
    {
      id: 'link1',
      source: 'node1',
      target: 'node2',
      label: 'Connection'
    }
  ];
  
  nodes: AdaptFlowChartNode[] = [
    {
      id: 'node1',
      label: 'Start',
      status: AdaptChartColorStatus.SUCCESS
    },
    {
      id: 'node2',
      label: 'End',
      status: AdaptChartColorStatus.INFO
    }
  ];

  onNodeClick(node: AdaptFlowChartNode): void {
    console.log('Node clicked:', node);
  }

  onLinkClick(link: AdaptFlowChartEdge): void {
    console.log('Link clicked:', link);
  }
}
```

### HTML Template

```html
<adapt-flow-chart [links]="links"
                  [nodes]="nodes"
                  [curve]="curve"
                  [orientation]="orientation"
                  [zoomSpeed]="zoomSpeed"
                  [enableZoom]="enableZoom"
                  [autoZoom]="autoZoom"
                  [autoCenter]="autoCenter"
                  [hasEmptyState]="true"
                  [emptyStateConfig]="emptyStateConfig"
                  [texts]="texts"
                  (nodeClick)="onNodeClick($event)"
                  (linkClick)="onLinkClick($event)"></adapt-flow-chart>
```

## Key Features

- Visualizes directed graphs with nodes and edges
- Multiple orientation options (bottom-to-top, top-to-bottom, left-to-right, right-to-left)
- Zoom and pan functionality
- Auto-zoom and auto-center on initialization
- Customizable node and edge styles
- Status indicators for nodes
- Click events for nodes and links
- Empty state support
- Based on ngx-graph library with D3 curve support

