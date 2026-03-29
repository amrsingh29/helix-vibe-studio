/**
 * @generated
 * @context Org chart node card: avatar/initials, name, title, status, badge, department, report count, expand chevron.
 * @decisions OnPush; outputs for expand/select/contextmenu; vacant dashed styling via host class.
 * @references cookbook/02-ui-view-components.md, cookbook/05-adapt-components.md
 * @modified 2026-03-27
 */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { OrgChartNode } from '../org-chart-view.types';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-org-chart-node-card',
  templateUrl: './org-chart-node-card.component.html',
  styleUrls: ['./org-chart-node-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule]
})
export class OrgChartNodeCardComponent {
  @Input({ required: true }) node!: OrgChartNode;
  @Input() selected = false;
  @Input() pathHighlight = false;
  @Input() searchDim = false;
  @Input() reportCount = 0;
  @Input() expandable = false;
  @Input() expanded = false;
  @Input() vacant = false;
  @Input() compact = false;
  @Input() dragDx = 0;
  @Input() dragDy = 0;

  @Output() toggleExpand = new EventEmitter<void>();
  @Output() selectCard = new EventEmitter<void>();
  @Output() context = new EventEmitter<MouseEvent>();

  initials(): string {
    const n = (this.node?.name ?? '').trim().split(/\s+/).filter(Boolean);
    if (n.length === 0) {
      return '?';
    }
    if (n.length === 1) {
      return n[0].slice(0, 2).toUpperCase();
    }
    return (n[0][0] + n[n.length - 1][0]).toUpperCase();
  }

  onCardClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.selectCard.emit();
  }

  onExpandClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.toggleExpand.emit();
  }

  onCtx(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.context.emit(ev);
  }
}
