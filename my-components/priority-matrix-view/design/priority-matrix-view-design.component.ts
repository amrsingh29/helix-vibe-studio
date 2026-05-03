/**
 * @generated
 * @context Design-time canvas: title and schema hint for priority matrix VC.
 * @decisions OnPush; translate keys for design-time copy only.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-05-03
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PriorityMatrixViewDesignModel } from './priority-matrix-view-design.model';

@Component({
  selector: 'com-amar-helix-vibe-studio-priority-matrix-view-design',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './priority-matrix-view-design.component.html',
  styleUrls: ['./priority-matrix-view-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriorityMatrixViewDesignComponent {
  @Input() model!: PriorityMatrixViewDesignModel;
}
