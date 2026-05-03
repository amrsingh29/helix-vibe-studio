/**
 * @generated
 * @context Runtime priority matrix VC: JSON from record or expression, dynamic grid, priority-tier styles, cell detail strip.
 * @decisions OnPush; resolveMatrixRaw$ mirrors org-chart; first cell entry wins; external error from record API + parse error.
 * @references cookbook/02-ui-view-components.md, my-components/org-chart-view/runtime/org-chart-view.component.ts
 * @modified 2026-05-03
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RxRecordInstanceDataPageService, RxRecordInstanceService } from '@helix/platform/record/api';
import { IDataPageParams, IDataPageRequestConfiguration, RxLogService } from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  buildCellDetailPairs,
  clampPriorityTier,
  formatDetailValue,
  IPriorityMatrixModel,
  parsePriorityMatrixConfig
} from '../priority-matrix.utils';
import {
  coerceDataPageRows,
  coerceDesignerString,
  flattenRecordDefinitionNameValue,
  getCellByFieldId
} from '../priority-matrix-view-record.util';
import type { IPriorityMatrixViewProperties } from '../priority-matrix-view.types';

const MAX_PRIORITY_TIER = 11;

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-priority-matrix-view',
  templateUrl: './priority-matrix-view.component.html',
  styleUrls: ['./priority-matrix-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-priority-matrix-view'
})
export class PriorityMatrixViewComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input() config!: Observable<IPriorityMatrixViewProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IPriorityMatrixViewProperties;

  parseErrorKey: string | null = null;
  loadError: string | null = null;
  model: IPriorityMatrixModel | null = null;

  selectedDetail: { label: string; value: string }[] | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly rxRecordInstanceDataPageService: RxRecordInstanceDataPageService,
    private readonly rxRecordInstanceService: RxRecordInstanceService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config
      .pipe(
        distinctUntilChanged((a, b) => this.matrixConfigFingerprint(a) === this.matrixConfigFingerprint(b)),
        switchMap((c) => {
          this.state = { ...c };
          this.isHidden = Boolean(c.hidden);
          return this.resolveMatrixRaw$(c);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ raw, externalError }) => {
        this.loadError = externalError;
        const parsed = parsePriorityMatrixConfig(raw);
        this.parseErrorKey = parsed.errorKey;
        this.model = parsed.model;
        this.selectedDetail = null;
        this.cdr.markForCheck();
      });
  }

  private matrixConfigFingerprint(c: IPriorityMatrixViewProperties): string {
    return JSON.stringify({
      h: c.hidden,
      rd: flattenRecordDefinitionNameValue(c.recordDefinitionName),
      fid: coerceDesignerString(c.matrixJsonFieldId),
      rid: coerceDesignerString(c.recordInstanceId),
      q: coerceDesignerString(c.matrixDataQueryExpression),
      ps: coerceDesignerString(c.matrixDataPageSize),
      j: c.matrixConfigJson
    });
  }

  private resolveMatrixRaw$(
    c: IPriorityMatrixViewProperties
  ): Observable<{ raw: unknown; externalError: string | null }> {
    const rd = flattenRecordDefinitionNameValue(c.recordDefinitionName);
    const fid = coerceDesignerString(c.matrixJsonFieldId);
    const instanceId = coerceDesignerString(c.recordInstanceId);
    if (rd && fid && instanceId) {
      return this.loadMatrixRawFromRecordInstance(rd, fid, instanceId);
    }
    if (rd && fid) {
      return this.loadMatrixRawFromRecord(rd, fid, c);
    }
    return of({ raw: c.matrixConfigJson, externalError: null });
  }

  private loadMatrixRawFromRecordInstance(
    rd: string,
    fieldId: string,
    instanceId: string
  ): Observable<{ raw: unknown; externalError: string | null }> {
    const fid = parseInt(fieldId, 10);
    return this.rxRecordInstanceService.get(rd, instanceId).pipe(
      map((record) => {
        const raw = Number.isFinite(fid) ? record.fieldInstances[fid]?.value : undefined;
        return { raw, externalError: null };
      }),
      catchError((e) => {
        this.rxLogService.error(`PriorityMatrixView: Record GET failed: ${String(e)}`);
        return of({ raw: null, externalError: String(e) });
      })
    );
  }

  private loadMatrixRawFromRecord(
    rd: string,
    fieldId: string,
    c: IPriorityMatrixViewProperties
  ): Observable<{ raw: unknown; externalError: string | null }> {
    const rawSize = coerceDesignerString(c.matrixDataPageSize) || '1';
    const pageSize = parseInt(rawSize, 10);
    const params: IDataPageParams = {
      recorddefinition: rd,
      propertySelection: [fieldId],
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 1,
      startIndex: 0
    };
    const qe = coerceDesignerString(c.matrixDataQueryExpression);
    if (qe) {
      params.queryExpression = qe;
    }
    const req: IDataPageRequestConfiguration = { params };
    return this.rxRecordInstanceDataPageService.post(req).pipe(
      map((res) => {
        const rows = coerceDataPageRows(res as unknown);
        if (!rows.length) {
          return { raw: null, externalError: null };
        }
        const cell = getCellByFieldId(rows[0], fieldId);
        return { raw: cell, externalError: null };
      }),
      catchError((e) => {
        this.rxLogService.error(`PriorityMatrixView: Data Page failed: ${String(e)}`);
        return of({ raw: null, externalError: String(e) });
      })
    );
  }

  cellEntry(row: string, col: string): Record<string, unknown> | null {
    const m = this.model;
    if (!m) {
      return null;
    }
    const key = `${row}\u0000${col}`;
    return m.cellMap.get(key) ?? null;
  }

  /** @context Priority styling tier from first-seen priority order in matrix array */
  cellTier(entry: Record<string, unknown> | null): number {
    const m = this.model;
    if (!m || !entry) {
      return 0;
    }
    const pk =
      entry['priority'] === null || entry['priority'] === undefined ? '' : String(entry['priority']);
    const idx = m.priorityIndexByKey.get(pk);
    return clampPriorityTier(idx, MAX_PRIORITY_TIER);
  }

  cellClass(entry: Record<string, unknown> | null): string {
    if (!entry) {
      return 'pm-cell pm-cell--empty';
    }
    return `pm-cell pm-cell--${this.cellTier(entry)}`;
  }

  /** @context Surface priority fields from dynamic matrix row without hardcoded property names in template */
  cellPriorityText(entry: Record<string, unknown> | null): string {
    if (!entry) {
      return '';
    }
    return formatDetailValue(entry['priority']);
  }

  cellPriorityLabelText(entry: Record<string, unknown> | null): string {
    if (!entry) {
      return '';
    }
    return formatDetailValue(entry['priority_label']);
  }

  onCellClick(row: string, col: string): void {
    const entry = this.cellEntry(row, col);
    const m = this.model;
    if (!entry || !m) {
      this.selectedDetail = null;
      this.cdr.markForCheck();
      return;
    }
    const pairs = buildCellDetailPairs(entry, m.rowField, m.colField);
    this.selectedDetail = pairs.map((p) => ({ label: p.label, value: p.value }));
    this.cdr.markForCheck();
  }

  displayError(): string | null {
    if (this.loadError) {
      return this.loadError;
    }
    return null;
  }

  /**
   * View Designer / runtime property writes — mirrors config stream handling for dynamic bindings.
   */
  setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as IPriorityMatrixViewProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'name':
      case 'recordDefinitionName':
      case 'matrixJsonFieldId':
      case 'recordInstanceId':
      case 'matrixDataQueryExpression':
      case 'matrixDataPageSize':
      case 'matrixConfigJson':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as IPriorityMatrixViewProperties;
        this.resolveMatrixRaw$(this.state)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(({ raw, externalError }) => {
            this.loadError = externalError;
            const parsed = parsePriorityMatrixConfig(raw);
            this.parseErrorKey = parsed.errorKey;
            this.model = parsed.model;
            this.selectedDetail = null;
            this.notifyPropertyChanged(propertyPath, propertyValue);
            this.cdr.markForCheck();
          });
        break;
      default:
        return throwError(() => new Error(`PriorityMatrixView: property ${propertyPath} is not settable.`));
    }
  }
}
