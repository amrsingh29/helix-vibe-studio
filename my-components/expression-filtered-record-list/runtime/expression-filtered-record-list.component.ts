/**
 * @generated
 * @context Runtime list filtered by comparing row[statusFieldKey] to evaluated matchStatusValue (expression from designer).
 * @decisions OnPush; empty match shows all rows; comparison trim + case-insensitive; coerce records from array or { data: [] }.
 * @references cookbook/02-ui-view-components.md, cookbook/09-best-practices.md
 * @modified 2026-03-20
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IExpressionFilteredRecordListProperties } from '../expression-filtered-record-list.types';

type RecordRow = Record<string, unknown>;

@Component({
  standalone: true,
  selector: 'com-example-sample-application-expression-filtered-record-list',
  styleUrls: ['./expression-filtered-record-list.component.scss'],
  templateUrl: './expression-filtered-record-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
@RxViewComponent({
  name: 'com-example-sample-application-expression-filtered-record-list'
})
export class ExpressionFilteredRecordListComponent
  extends BaseViewComponent
  implements OnInit, IViewComponent
{
  @Input()
  config!: Observable<IExpressionFilteredRecordListProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IExpressionFilteredRecordListProperties;

  rawRecords: RecordRow[] = [];
  filteredRows: RecordRow[] = [];
  statusKey = 'Status';
  titleKey = 'Title';
  /** Resolved filter value from expression (stringified for compare) */
  matchValueNormalized = '';

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config.pipe(takeUntil(this.destroyed$)).subscribe((c: IExpressionFilteredRecordListProperties) => {
      this.state = { ...c };
      this.isHidden = Boolean(c.hidden);
      this.statusKey = (c.statusFieldKey ?? 'Status').trim() || 'Status';
      this.titleKey = (c.titleFieldKey ?? 'Title').trim() || 'Title';
      this.rawRecords = coerceRecords(c.records);
      this.matchValueNormalized = normalizeMatchValue(c.matchStatusValue);
      this.rebuildFiltered();
      this.cdr.markForCheck();
    });
  }

  labelFor(row: RecordRow): string {
    const v = row[this.titleKey];
    if (v == null) {
      return '—';
    }
    return String(v);
  }

  statusFor(row: RecordRow): string {
    const v = row[this.statusKey];
    if (v == null) {
      return '';
    }
    return String(v);
  }

  private rebuildFiltered(): void {
    if (this.matchValueNormalized === '') {
      this.filteredRows = [...this.rawRecords];
      return;
    }
    this.filteredRows = this.rawRecords.filter((r) => normalizeMatchValue(this.statusFor(r)) === this.matchValueNormalized);
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as IExpressionFilteredRecordListProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'records':
      case 'statusFieldKey':
      case 'matchStatusValue':
      case 'titleFieldKey':
      case 'recordDefinitionName':
      case 'name':
        next[propertyPath] = propertyValue;
        this.state = next as IExpressionFilteredRecordListProperties;
        if (propertyPath === 'records') {
          this.rawRecords = coerceRecords(propertyValue);
        }
        if (propertyPath === 'statusFieldKey') {
          this.statusKey = String(propertyValue ?? 'Status').trim() || 'Status';
        }
        if (propertyPath === 'titleFieldKey') {
          this.titleKey = String(propertyValue ?? 'Title').trim() || 'Title';
        }
        if (propertyPath === 'matchStatusValue') {
          this.matchValueNormalized = normalizeMatchValue(propertyValue);
        }
        this.rebuildFiltered();
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      default:
        return throwError(
          () => new Error(`ExpressionFilteredRecordList: property ${propertyPath} is not settable.`)
        );
    }
  }
}

function coerceRecords(value: unknown): RecordRow[] {
  if (Array.isArray(value)) {
    return value.filter((r) => r != null && typeof r === 'object') as RecordRow[];
  }
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return coerceRecords((value as { data: unknown }).data);
  }
  return [];
}

function normalizeMatchValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim().toLowerCase();
}
