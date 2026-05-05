/**
 * @generated
 * @context Horizontal insight card rail: Data Page + record-list qualification via Records (expression); buttonActions only; deferred notify to avoid stack overflow.
 * @decisions Troubleshooting logs use info() so Chrome Default levels shows them (debug is hidden unless Verbose is on).
 * @references cookbook/02-ui-view-components.md, my-components/catalog-view/runtime/catalog-view.component.ts
 * @modified 2026-04-30; removed Tier 2 client-side filter — rows shown match Data Page / Records binding only.
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AdaptButtonModule } from '@bmc-ux/adapt-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IRecordDefinition, RxRecordDefinitionService, RxRecordInstanceDataPageService } from '@helix/platform/record/api';
import { IDataPageRequestConfiguration, RxLogService } from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent, RuntimeViewModelApi } from '@helix/platform/view/runtime';
import { EMPTY, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  buildCatalogFieldValuesByFieldId,
  extractCatalogFieldId,
  normalizeCatalogFieldIds
} from '../../catalog-view/catalog-view.utils';
import { IInsightRailProperties } from '../insight-rail.types';
import {
  buildInsightDataPageQualificationDiagnostics,
  buildInsightPropertySelection,
  buildInsightRuntimeModeDiagnostics,
  coerceInsightExpressionProperty,
  coerceTrimmedString,
  formatInsightDataPageError,
  isLikelyRecordsQualificationExpression,
  normalizeInsightPageSizeToken,
  qualificationUsesQuotedTextRhs,
  resolveInsightDataPageQualification,
  shouldUseInsightBuiltInQuery,
  unwrapInsightEvaluatedProperty
} from '../insight-rail.utils';

type RecordRow = Record<string, unknown>;

function insightDataInputsFingerprint(c: IInsightRailProperties): string {
  try {
    return JSON.stringify({
      hidden: c.hidden,
      name: c.name,
      actionSinks: c.actionSinks,
      useBuiltInRecordQuery: c.useBuiltInRecordQuery,
      insightPageSize: c.insightPageSize,
      recordDefinitionName: c.recordDefinitionName,
      insightSelectedFieldIds: c.insightSelectedFieldIds,
      insightTitleFieldId: c.insightTitleFieldId,
      insightDescriptionFieldId: c.insightDescriptionFieldId,
      insightMetricFieldId: c.insightMetricFieldId,
      insightHeaderFieldId: c.insightHeaderFieldId,
      sectionHeaderLabel: c.sectionHeaderLabel,
      metricLabel: c.metricLabel,
      recordsViewInputParamName: c.recordsViewInputParamName,
      records: c.records,
      buttonLabel: c.buttonLabel
    });
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
}

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-insight-rail',
  styleUrls: ['./insight-rail.component.scss'],
  templateUrl: './insight-rail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-insight-rail'
})
export class InsightRailComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config!: Observable<IInsightRailProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IInsightRailProperties;

  rawRecords: RecordRow[] = [];
  fieldDisplayNameById: Record<string, string> = {};

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly translate: TranslateService,
    private readonly rxRecordInstanceDataPageService: RxRecordInstanceDataPageService,
    private readonly rxRecordDefinitionService: RxRecordDefinitionService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config
      .pipe(
        tap((c: IInsightRailProperties) => {
          this.state = { ...c };
          this.isHidden = Boolean(c.hidden);
        }),
        distinctUntilChanged((a, b) => insightDataInputsFingerprint(a) === insightDataInputsFingerprint(b)),
        switchMap((c: IInsightRailProperties) => {
          const rdName =
            extractCatalogFieldId(c.recordDefinitionName) ||
            (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
          const builtIn = shouldUseInsightBuiltInQuery(c) && Boolean(rdName);

          const mode = buildInsightRuntimeModeDiagnostics(c);
          this.rxLogService.log(
            `InsightRail [mode] dataPageActive=${mode.builtInEffective} useBuiltInRecordQuery=${mode.useBuiltInRecordQueryLabel} rd=${mode.recordDefinitionResolved} recordsLooksLikeQualificationChip=${isLikelyRecordsQualificationExpression(c.records)} → ${mode.reasonNotUsingDataPage}`
          );

          if (mode.builtInEffective) {
            const coercedRec = coerceInsightExpressionProperty(c.records);
            const appliedQe = resolveInsightDataPageQualification(c);
            if (coercedRec && coercedRec.includes('=') && !appliedQe) {
              this.rxLogService.warning(
                `InsightRail: Records text looks like an equation but was NOT applied as queryExpression (wrong shape, JSON array, or unwrap failed). Start of value: ${coercedRec.slice(0, 160)}`
              );
            }
          }

          if (!builtIn && isLikelyRecordsQualificationExpression(c.records)) {
            this.rxLogService.warning(
              'InsightRail: Records (expression) looks like a server qualification token, but automatic Data Page load is not active (toggle off, missing record definition, or view-input mode). Enable "Load records automatically", set record definition, and leave view input empty so the filter is sent as queryExpression.'
            );
          }

          const rows$: Observable<RecordRow[]> = builtIn
            ? this.loadBuiltInRecords(c).pipe(
                catchError((e) => {
                  this.rxLogService.error(
                    `InsightRail: built-in record query failed: ${formatInsightDataPageError(e)}`
                  );
                  return of([]);
                })
              )
            : of(resolveRecordsSource(c, this.runtimeViewModelApi, this.rxLogService));

          return forkJoin({
            labels: this.fetchFieldLabelMap(rdName),
            rows: rows$
          }).pipe(
            map(({ labels, rows }) => {
              this.fieldDisplayNameById = labels;
              this.rawRecords = rows;
            })
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        if (this.rawRecords.length === 0) {
          this.rxLogService.info('InsightRail [empty UI] rowCount=0');
        }
        this.cdr.markForCheck();
      });
  }

  private loadBuiltInRecords(c: IInsightRailProperties): Observable<RecordRow[]> {
    const rd =
      extractCatalogFieldId(c.recordDefinitionName) ||
      (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
    const ids = buildInsightPropertySelection(c);
    if (ids.length === 0) {
      this.rxLogService.info('InsightRail: built-in query skipped — empty property selection.');
      return of([]);
    }
    const rawSize = normalizeInsightPageSizeToken(c.insightPageSize);
    const pageSize = parseInt(rawSize, 10);
    const params: Record<string, string | number | number[]> = {
      recorddefinition: rd,
      propertySelection: ids,
      pageSize: Number.isFinite(pageSize) ? pageSize : -1,
      startIndex: 0
    };
    const qe = resolveInsightDataPageQualification(c);
    if (qe) {
      params.queryExpression = qe;
    }
    const req: IDataPageRequestConfiguration = { params };

    const diag = buildInsightDataPageQualificationDiagnostics(c);
    this.rxLogService.info(
      `InsightRail [DataPage request] recorddefinition=${rd} pageSize=${params.pageSize} propertySelectionCount=${ids.length} sendsQualification=${diag.sendsQualificationToDataPage} recordsRawType=${diag.recordsRawType} recordsUnwrappedType=${diag.recordsUnwrappedType} coercedPreview=${diag.recordsCoercedPreview || '(empty)'} queryExpression=${diag.normalizedQueryExpression || '(none)'}`
    );

    return this.rxRecordInstanceDataPageService.post(req).pipe(
      map((res) => coerceRecords(res as unknown)),
      tap((rows) => {
        this.rxLogService.info(`InsightRail [DataPage response] rowCount=${rows.length}`);
        if (rows.length === 0 && qe) {
          this.rxLogService.warning(
            `InsightRail [DataPage] Zero rows with queryExpression. Verify qualification matches AR rules (see cookbook/04-ui-services-and-apis.md → Qualification.md). Sent: ${qe}`
          );
          if (qualificationUsesQuotedTextRhs(qe)) {
            this.rxLogService.warning(
              'InsightRail [DataPage] RHS uses quoted text. Selection/drop-down fields usually require the option\'s numeric enum value (e.g. \'536870919\' = 2), not the display label ("Cloud"). Compare with OOB Record grid expression filters.'
            );
          }
        }
        if (rows.length === 0 && !qe) {
          this.rxLogService.info(
            'InsightRail [DataPage] Zero rows with no queryExpression — check permissions, record definition, or dataset.'
          );
        }
      })
    );
  }

  private fetchFieldLabelMap(recordDefinitionName: string): Observable<Record<string, string>> {
    if (!recordDefinitionName) {
      return of({});
    }
    return this.rxRecordDefinitionService.get(recordDefinitionName, {}, true).pipe(
      map((def) => buildInsightFieldLabelMap(def)),
      catchError(() => of({}))
    );
  }

  private refreshDataRows(): void {
    const c = this.state;
    const rdName =
      extractCatalogFieldId(c.recordDefinitionName) ||
      (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
    const builtIn = shouldUseInsightBuiltInQuery(c) && Boolean(rdName);
    if (builtIn) {
      this.loadBuiltInRecords(c)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (rows) => {
            this.rawRecords = rows;
            this.cdr.markForCheck();
          },
          error: (e) => {
            this.rxLogService.error(
              `InsightRail: built-in record query failed: ${formatInsightDataPageError(e)}`
            );
            this.rawRecords = [];
            this.cdr.markForCheck();
          }
        });
      return;
    }
    this.rawRecords = resolveRecordsSource(c, this.runtimeViewModelApi, this.rxLogService);
    this.cdr.markForCheck();
  }

  private refreshFieldLabels(): void {
    const rd =
      extractCatalogFieldId(this.state.recordDefinitionName) ||
      (typeof this.state.recordDefinitionName === 'string' ? this.state.recordDefinitionName.trim() : '');
    this.fetchFieldLabelMap(rd)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((labels) => {
        this.fieldDisplayNameById = labels;
        this.cdr.markForCheck();
      });
  }

  cardTitle(row: RecordRow): string {
    const id = extractCatalogFieldId(this.state?.insightTitleFieldId);
    if (id) {
      return this.displayValue(row, id);
    }
    const keys = this.fieldKeys();
    const prefer = keys.find((f) => /title|name|summary/i.test(f));
    return prefer ? this.displayValue(row, prefer) : '';
  }

  cardDescription(row: RecordRow): string {
    const id = extractCatalogFieldId(this.state?.insightDescriptionFieldId);
    if (id) {
      return this.displayValue(row, id);
    }
    const keys = this.fieldKeys();
    const prefer = keys.find((f) => /description|detail|body/i.test(f));
    return prefer ? this.displayValue(row, prefer) : '';
  }

  cardMetric(row: RecordRow): string {
    const id = extractCatalogFieldId(this.state?.insightMetricFieldId);
    if (id) {
      return this.displayValue(row, id);
    }
    return '';
  }

  cardHeader(row: RecordRow): string {
    const id = extractCatalogFieldId(this.state?.insightHeaderFieldId);
    if (id) {
      return this.displayValue(row, id);
    }
    const fallback = coerceTrimmedString(this.state?.sectionHeaderLabel);
    if (fallback) {
      return fallback;
    }
    return this.translate.instant('com.amar.helix-vibe-studio.view-components.insight-rail.default-section-header');
  }

  metricLabelText(): string {
    const m = coerceTrimmedString(this.state?.metricLabel);
    if (m) {
      return m;
    }
    return this.translate.instant('com.amar.helix-vibe-studio.view-components.insight-rail.default-metric-label');
  }

  buttonText(): string {
    const b = coerceTrimmedString(this.state?.buttonLabel);
    if (b) {
      return b;
    }
    return this.translate.instant('com.amar.helix-vibe-studio.view-components.insight-rail.default-action-label');
  }

  actionAriaLabel(row: RecordRow): string {
    const label = this.buttonText();
    const name = this.cardTitle(row) || 'item';
    return `${label}: ${name}`;
  }

  displayValue(row: RecordRow, key: string): string {
    const v = getFieldValue(row, key);
    if (v == null) {
      return '';
    }
    if (typeof v === 'object') {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
    return String(v);
  }

  trackRow(_index: number, row: RecordRow): string {
    const rid = row['379'] ?? row[String(379)];
    if (rid != null && String(rid).trim() !== '') {
      return `379:${String(rid)}`;
    }
    const d = row['1'];
    if (d != null && String(d).trim() !== '') {
      return `1:${String(d)}`;
    }
    try {
      return JSON.stringify(row);
    } catch {
      return String(_index);
    }
  }

  onCardAction(row: RecordRow): void {
    const fieldMap = buildCatalogFieldValuesByFieldId(row);
    setTimeout(() => {
      this.notifyPropertyChanged('insightFieldValuesByFieldId', fieldMap);
      this.notifyPropertyChanged('insightActionRecord', row);
      this.notifyPropertyChanged('insightActionRecordJson', safeStringify(row));

      if (this.tryRunSinkActions('buttonActions')) {
        return;
      }
    }, 0);
  }

  private tryRunSinkActions(sinkName: string): boolean {
    const guid = this.state?.actionSinks?.find((s) => s.name === sinkName)?.guid;
    if (!guid) {
      return false;
    }
    const enabled = this.runtimeViewModelApi.getEnabledActions(guid);
    if (!enabled.length) {
      return false;
    }
    this.triggerSinkActions(sinkName)
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.cdr.markForCheck());
    return true;
  }

  private fieldKeys(): string[] {
    return normalizeCatalogFieldIds(this.state?.insightSelectedFieldIds);
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as IInsightRailProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'name':
      case 'buttonLabel':
      case 'sectionHeaderLabel':
      case 'metricLabel':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as IInsightRailProperties;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'records':
      case 'recordsViewInputParamName':
      case 'recordDefinitionName':
      case 'useBuiltInRecordQuery':
      case 'insightPageSize':
      case 'insightSelectedFieldIds':
      case 'insightTitleFieldId':
      case 'insightDescriptionFieldId':
      case 'insightMetricFieldId':
      case 'insightHeaderFieldId':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as IInsightRailProperties;
        this.refreshDataRows();
        if (propertyPath === 'recordDefinitionName') {
          this.refreshFieldLabels();
        }
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      default:
        return throwError(() => new Error(`InsightRail: property ${propertyPath} is not settable.`));
    }
  }
}

function buildInsightFieldLabelMap(def: IRecordDefinition): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of def.fieldDefinitions ?? []) {
    const id = String(f.id);
    const name = (f.name ?? '').trim();
    out[id] = name || id;
  }
  return out;
}

function resolveRecordsSource(
  c: IInsightRailProperties,
  runtimeViewModelApi: RuntimeViewModelApi | undefined,
  rxLogService: RxLogService
): RecordRow[] {
  const paramName = coerceTrimmedString(c.recordsViewInputParamName);
  if (paramName && runtimeViewModelApi) {
    try {
      const params = runtimeViewModelApi.getViewInputParameters() as Record<string, unknown>;
      const raw = params?.[paramName];
      const rows = coerceRecords(raw);
      if (rows.length === 0 && raw != null) {
        rxLogService.info(
          `InsightRail: view input "${paramName}" is missing or not an array (got ${typeof raw}).`
        );
      }
      return rows;
    } catch (e) {
      rxLogService.info(`InsightRail: could not read view input parameters: ${String(e)}`);
      return coerceRecords(c.records);
    }
  }
  return coerceRecords(c.records);
}

function coerceRecords(value: unknown): RecordRow[] {
  const v = unwrapInsightEvaluatedProperty(value);
  if (typeof v === 'string') {
    const t = v.trim();
    if (t.startsWith('[')) {
      try {
        return coerceRecords(JSON.parse(t));
      } catch {
        return [];
      }
    }
    return [];
  }
  if (Array.isArray(v)) {
    return v.filter((r) => r != null && typeof r === 'object') as RecordRow[];
  }
  if (v && typeof v === 'object' && Array.isArray((v as { data?: unknown }).data)) {
    return coerceRecords((v as { data: unknown }).data);
  }
  return [];
}

function getFieldValue(row: RecordRow, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(row, key)) {
    return row[key];
  }
  return undefined;
}

function safeStringify(row: RecordRow): string {
  try {
    return JSON.stringify(row);
  } catch {
    return '';
  }
}
