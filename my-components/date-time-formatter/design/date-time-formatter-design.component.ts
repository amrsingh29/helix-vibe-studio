/**
 * @generated
 * @context Design-time canvas for Date/Time Formatter with config summary and live preview.
 * @decisions Split layout: left config hint, right live preview via model.preview$.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-22
 */
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { DateTimeFormatterDesignModel } from './date-time-formatter-design.model';

@Component({
  selector: 'com-amar-helix-vibe-studio-date-time-formatter-design',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './date-time-formatter-design.component.html',
  styleUrls: ['./date-time-formatter-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeFormatterDesignComponent {
  @Input() model!: DateTimeFormatterDesignModel;
}
