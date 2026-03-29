/**
 * @generated
 * @context Design-time preview for configurable-chart in View Designer.
 * @decisions Muted dashed frame; hints for inspector-driven configuration.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-24
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurableChartDesignModel } from './configurable-chart-design.model';

@Component({
  standalone: true,
  selector: 'com-amar-dashboard-configurable-chart-design',
  templateUrl: './configurable-chart-design.component.html',
  styleUrls: ['./configurable-chart-design.component.scss'],
  imports: [CommonModule]
})
export class ConfigurableChartDesignComponent {
  @Input() model!: ConfigurableChartDesignModel;
}
