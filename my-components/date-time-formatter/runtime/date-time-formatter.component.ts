/**
 * @generated
 * @context Runtime display for Date/Time Formatter: formatted date with typography and badge mode.
 * @decisions OnPush; formatDateTime + parseFontSize from shared util; inline styles for font/color/badge.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-22
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import type { IDateTimeFormatterProperties } from '../date-time-formatter.types';
import { formatDateTime, parseFontSize } from '../date-time-formatter-formatter.util';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-date-time-formatter',
  templateUrl: './date-time-formatter.component.html',
  styleUrls: ['./date-time-formatter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-date-time-formatter'
})
export class DateTimeFormatterComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input() config!: Observable<IDateTimeFormatterProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IDateTimeFormatterProperties;

  formatted = '—';
  fontSize = 14;
  textColor = '#22272A';
  badgeMode = false;
  badgeBackgroundColor = '#e0e5eb';

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config.pipe(takeUntil(this.destroyed$)).subscribe((c: IDateTimeFormatterProperties) => {
      this.state = { ...c };
      this.isHidden = Boolean(c.hidden);
      this.formatted = formatDateTime(c.dateTimeValue, c.format ?? 'shortMonthDayYear');
      this.fontSize = parseFontSize(c.fontSize);
      this.textColor = (c.textColor ?? '#22272A').trim() || '#22272A';
      this.badgeMode = Boolean(c.badgeMode);
      this.badgeBackgroundColor = (c.badgeBackgroundColor ?? '#e0e5eb').trim() || '#e0e5eb';
      this.cdr.markForCheck();
    });
  }

  setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as IDateTimeFormatterProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'dateTimeValue':
      case 'format':
      case 'fontSize':
      case 'textColor':
      case 'badgeMode':
      case 'badgeBackgroundColor':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as IDateTimeFormatterProperties;
        this.formatted = formatDateTime(this.state.dateTimeValue, this.state.format ?? 'shortMonthDayYear');
        this.fontSize = parseFontSize(this.state.fontSize);
        this.textColor = (this.state.textColor ?? '#22272A').trim() || '#22272A';
        this.badgeMode = Boolean(this.state.badgeMode);
        this.badgeBackgroundColor = (this.state.badgeBackgroundColor ?? '#e0e5eb').trim() || '#e0e5eb';
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      default:
        return throwError(() => new Error(`DateTimeFormatter: property ${propertyPath} is not settable.`));
    }
  }
}
