/**
 * @generated
 * @context Design-time canvas for org chart: summary and JSON schema hint.
 * @decisions OnPush; minimal static hint text.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-27
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OrgChartViewDesignModel } from './org-chart-view-design.model';

@Component({
  selector: 'com-amar-helix-vibe-studio-org-chart-view-design',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './org-chart-view-design.component.html',
  styleUrls: ['./org-chart-view-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgChartViewDesignComponent {
  @Input() model!: OrgChartViewDesignModel;
}
