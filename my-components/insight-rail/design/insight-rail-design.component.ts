/**
 * @generated
 * @context Design-time canvas placeholder for insight / data-quality rail.
 * @decisions Short hint; full UI is runtime-only.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-04-30
 */
import { Component, Input } from '@angular/core';
import { InsightRailDesignModel } from './insight-rail-design.model';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-insight-rail-design',
  styleUrls: ['./insight-rail-design.component.scss'],
  templateUrl: './insight-rail-design.component.html'
})
export class InsightRailDesignComponent {
  @Input()
  model!: InsightRailDesignModel;
}
