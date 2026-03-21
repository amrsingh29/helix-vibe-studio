/**
 * @generated
 * @context Runtime catalog: optional built-in Record Instance Data Page; card slot mapping; table + filters; RD field names; buttonActions sink (triggerSinkActions) then legacy RxOpenViewActionService.
 * @decisions notifyPropertyChanged catalogFieldValuesByFieldId + catalogActionRecord before tryRunSinkActions for Launch process input expressions; OnPush; forkJoin labels + rows.
 * @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md, BaseViewComponent.triggerSinkActions
 * @modified 2026-03-21
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AdaptBadgeModule, AdaptButtonModule } from '@bmc-ux/adapt-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IRecordDefinition,
  RxRecordDefinitionService,
  RxRecordInstanceDataPageService
} from '@helix/platform/record/api';
import { IDataPageRequestConfiguration, RxLogService } from '@helix/platform/shared/api';
import { OpenViewActionType, RxViewComponent } from '@helix/platform/view/api';
import { RxOpenViewActionService } from '@helix/platform/view/actions';
import { IOpenViewActionParams } from '@helix/platform/view/actions/open-view/open-view-action.types';
import { BaseViewComponent, IViewComponent, RuntimeViewModelApi } from '@helix/platform/view/runtime';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  buildCatalogFieldValuesByFieldId,
  buildCatalogPropertySelection,
  extractCatalogFieldId,
  normalizeCatalogFieldIds,
  normalizeTargetViewDefinitionNameValue,
  shouldUseBuiltInRecordQuery
} from '../catalog-view.utils';
import { CatalogViewMode, ICatalogViewProperties } from '../catalog-view.types';

type RecordRow = Record<string, unknown>;

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-catalog-view',
  styleUrls: ['./catalog-view.component.scss'],
  templateUrl: './catalog-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, AdaptBadgeModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-catalog-view'
})
export class CatalogViewComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config!: Observable<ICatalogViewProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: ICatalogViewProperties;

  /** Raw rows from `records` expression */
  rawRecords: RecordRow[] = [];
  /** Normalized field keys */
  fields: string[] = [];
  viewMode: CatalogViewMode = 'card';
  searchQuery = '';
  selectedCategory: string | 'all' = 'all';
  selectedFacet: string | 'all' = 'all';
  sortColumn: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  displayRows: RecordRow[] = [];

  facetFieldKey = '';
  facetOptionList: string[] = [];
  categoryFieldEffective = '';

  /** Field id → display name from {@link RxRecordDefinitionService} for table/card labels. */
  fieldDisplayNameById: Record<string, string> = {};

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly translate: TranslateService,
    private readonly rxOpenViewActionService: RxOpenViewActionService,
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
        switchMap((c: ICatalogViewProperties) => {
          this.state = { ...c };
          this.isHidden = Boolean(c.hidden);
          this.applyLayoutFromConfig(c);
          const rdName =
            extractCatalogFieldId(c.recordDefinitionName) ||
            (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
          const builtIn = shouldUseBuiltInRecordQuery(c) && Boolean(rdName);

          const rows$: Observable<RecordRow[]> = builtIn
            ? this.loadBuiltInRecords(c).pipe(
                catchError((e) => {
                  this.rxLogService.error(`CatalogView: built-in record query failed: ${String(e)}`);
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
        this.rebuildView();
        this.cdr.markForCheck();
      });
  }

  /**
   * Layout, field list, filters — everything except {@link rawRecords}.
   */
  private applyLayoutFromConfig(c: ICatalogViewProperties): void {
    this.viewMode = c.initialView === 'table' ? 'table' : 'card';
    this.fields = resolveFieldsSource(c);
    this.facetFieldKey = extractCatalogFieldId(c.facetFieldKey);
    const facetRaw = (c.facetOptionsJson ?? '').trim();
    this.facetOptionList = parseFacetOptionsJson(facetRaw);
    if (facetRaw && this.facetFieldKey && this.facetOptionList.length === 0) {
      this.rxLogService.debug('CatalogView: facetOptionsJson could not be parsed as a JSON array.');
    }
    const explicitCategory = extractCatalogFieldId(c.categoryFieldKey);
    this.categoryFieldEffective = explicitCategory || resolveCategoryFieldKey('', this.fields);
  }

  private loadBuiltInRecords(c: ICatalogViewProperties): Observable<RecordRow[]> {
    const rd =
      extractCatalogFieldId(c.recordDefinitionName) ||
      (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
    const ids = buildCatalogPropertySelection(c);
    if (ids.length === 0) {
      this.rxLogService.debug('CatalogView: built-in query skipped — empty property selection.');
      return of([]);
    }
    const rawSize = (c.catalogPageSize ?? '-1').trim();
    const pageSize = parseInt(rawSize, 10);
    const params: Record<string, string | number | number[]> = {
      recorddefinition: rd,
      propertySelection: ids,
      pageSize: Number.isFinite(pageSize) ? pageSize : -1,
      startIndex: 0
    };
    const qe = (c.catalogQueryExpression ?? '').trim();
    if (qe) {
      params.queryExpression = qe;
    }
    const req: IDataPageRequestConfiguration = { params };
    return this.rxRecordInstanceDataPageService.post(req).pipe(
      map((res) => coerceRecords(res as unknown))
    );
  }

  private fetchFieldLabelMap(recordDefinitionName: string): Observable<Record<string, string>> {
    if (!recordDefinitionName) {
      return of({});
    }
    return this.rxRecordDefinitionService.get(recordDefinitionName, {}, true).pipe(
      map((def) => buildCatalogFieldLabelMap(def)),
      catchError(() => of({}))
    );
  }

  /** Refreshes rows after Set Property — mirrors config stream behavior. */
  private refreshDataRows(): void {
    const c = this.state;
    const rdName =
      extractCatalogFieldId(c.recordDefinitionName) ||
      (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
    const builtIn = shouldUseBuiltInRecordQuery(c) && Boolean(rdName);
    if (builtIn) {
      this.loadBuiltInRecords(c)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (rows) => {
            this.rawRecords = rows;
            this.rebuildView();
            this.cdr.markForCheck();
          },
          error: (e) => {
            this.rxLogService.error(`CatalogView: built-in record query failed: ${String(e)}`);
            this.rawRecords = [];
            this.rebuildView();
            this.cdr.markForCheck();
          }
        });
      return;
    }
    this.rawRecords = resolveRecordsSource(c, this.runtimeViewModelApi, this.rxLogService);
    this.rebuildView();
    this.cdr.markForCheck();
  }

  /** When RD changes via Set Property without a full config re-emission. */
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

  get showCategoryRail(): boolean {
    return Boolean(this.categoryFieldEffective);
  }

  get showFacetRail(): boolean {
    return Boolean(this.facetFieldKey && this.facetOptionList.length > 0);
  }

  categoryChoices(): string[] {
    const key = this.categoryFieldEffective;
    if (!key || !this.fields.includes(key)) {
      return [];
    }
    const set = new Set<string>();
    for (const r of this.rawRecords) {
      const v = getFieldValue(r, key);
      if (v != null && String(v).trim() !== '') {
        set.add(String(v));
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  facetChoices(): string[] {
    return this.facetOptionList;
  }

  onSearchInput(value: string): void {
    this.searchQuery = value;
    this.rebuildView();
    this.cdr.markForCheck();
  }

  pickCategory(value: string | 'all'): void {
    this.selectedCategory = value;
    this.rebuildView();
    this.cdr.markForCheck();
  }

  pickFacet(value: string | 'all'): void {
    this.selectedFacet = value;
    this.rebuildView();
    this.cdr.markForCheck();
  }

  setView(mode: CatalogViewMode): void {
    this.viewMode = mode;
    this.rebuildView();
    this.cdr.markForCheck();
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDir = 'asc';
    }
    this.rebuildView();
    this.cdr.markForCheck();
  }

  sortIndicator(column: string): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDir === 'asc' ? 'asc' : 'desc';
  }

  ariaSortFor(column: string): 'ascending' | 'descending' | null {
    if (this.sortColumn !== column) {
      return null;
    }
    return this.sortDir === 'asc' ? 'ascending' : 'descending';
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

  titleFieldKey(): string | null {
    const prefer = this.fields.find((f) => f.toLowerCase() === 'name' || f.toLowerCase().endsWith('_name'));
    return prefer ?? null;
  }

  /** Key used for the prominent card title (inspector slot, then name-like, else first display field). */
  primaryTitleKey(): string | null {
    const slot = extractCatalogFieldId(this.state?.cardTitleFieldId);
    if (slot) {
      return slot;
    }
    return this.titleFieldKey() ?? (this.fields[0] ?? null);
  }

  /** Description line under title when mapped in inspector. */
  cardDescriptionKey(): string | null {
    const d = extractCatalogFieldId(this.state?.cardDescriptionFieldId);
    return d || null;
  }

  /** Top-right card badge: dedicated slot, else facet field. */
  cardCornerBadgeKey(): string | null {
    const b = extractCatalogFieldId(this.state?.cardBadgeFieldId);
    if (b) {
      return b;
    }
    const f = (this.facetFieldKey ?? '').trim();
    return f || null;
  }

  /** Display fields shown on the card body excluding slot keys (and corner badge field). */
  extraCardFieldKeys(): string[] {
    const exclude = new Set<string>();
    const add = (v: unknown) => {
      const t = extractCatalogFieldId(v);
      if (t) {
        exclude.add(t);
      }
    };
    add(this.state?.cardTitleFieldId);
    add(this.state?.cardDescriptionFieldId);
    add(this.state?.cardBadgeFieldId);
    add(this.state?.cardPriceFieldId);
    add(this.state?.cardCurrencyFieldId);
    const corner = this.cardCornerBadgeKey();
    if (corner) {
      exclude.add(corner);
    }
    return this.fields.filter((k) => !exclude.has(k));
  }

  priceLine(row: RecordRow): string {
    const pr = extractCatalogFieldId(this.state?.cardPriceFieldId);
    if (!pr) {
      return '';
    }
    const pv = this.displayValue(row, pr);
    const cur = extractCatalogFieldId(this.state?.cardCurrencyFieldId);
    if (cur) {
      return `${this.displayValue(row, cur)} ${pv}`.trim();
    }
    return pv;
  }

  private searchFieldKeys(): string[] {
    const keys = new Set<string>(this.fields);
    const add = (v: unknown) => {
      const t = extractCatalogFieldId(v);
      if (t) {
        keys.add(t);
      }
    };
    add(this.state?.cardTitleFieldId);
    add(this.state?.cardDescriptionFieldId);
    add(this.state?.cardBadgeFieldId);
    add(this.state?.cardPriceFieldId);
    add(this.state?.cardCurrencyFieldId);
    return [...keys];
  }

  humanizeField(key: string): string {
    const fromRd = this.fieldDisplayNameById[key];
    if (fromRd) {
      return fromRd;
    }
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  isDescriptionField(key: string): boolean {
    return /description|details|summary/i.test(key);
  }

  isPriceField(key: string): boolean {
    return /price|amount|cost|total|fee/i.test(key);
  }

  cardPrimaryTitle(row: RecordRow): string {
    const pk = this.primaryTitleKey();
    return pk ? this.displayValue(row, pk) : '';
  }

  badgeTypeFor(value: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
    const palette: Array<'primary' | 'success' | 'warning' | 'info' | 'danger'> = [
      'primary',
      'success',
      'warning',
      'info',
      'danger'
    ];
    let h = 0;
    for (let i = 0; i < value.length; i++) {
      h = (h + value.charCodeAt(i) * (i + 1)) % palette.length;
    }
    return palette[h];
  }

  onRowAction(row: RecordRow): void {
    const fieldMap = buildCatalogFieldValuesByFieldId(row);
    this.notifyPropertyChanged('catalogFieldValuesByFieldId', fieldMap);
    this.notifyPropertyChanged('catalogActionRecord', row);
    this.notifyPropertyChanged('catalogActionRecordJson', safeStringify(row));

    if (this.tryRunSinkActions('buttonActions')) {
      return;
    }

    const viewDefRaw = this.state?.targetViewDefinitionName;
    const viewDef = normalizeTargetViewDefinitionNameValue(viewDefRaw);
    if (!viewDef) {
      return;
    }

    const keys = parseViewParamFieldKeys(this.state?.viewParamFieldKeysCsv);
    const viewParams = buildViewInputParamsFromRow(row, keys);
    const presentationType = resolveOpenViewPresentationType(this.state?.openViewPresentationType);
    const modalTitleRaw = this.state?.openViewModalTitle;
    const modalTitle = (
      extractCatalogFieldId(modalTitleRaw) ||
      (typeof modalTitleRaw === 'string' ? modalTitleRaw.trim() : '')
    ).trim();

    const params: IOpenViewActionParams = {
      viewDefinitionName: viewDef,
      viewParams,
      presentation: {
        type: presentationType,
        ...(modalTitle ? { title: modalTitle } : {})
      }
    };

    this.rxOpenViewActionService
      .execute(params)
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => {
          // @context Cancel/outside-click paths surface as errors — avoid noisy error logs
          this.rxLogService.debug(
            this.translate.instant('com.amar.helix-vibe-studio.view-components.catalog.open-view-cancelled')
          );
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.rxLogService.debug(
          this.translate.instant('com.amar.helix-vibe-studio.view-components.catalog.open-view-closed')
        );
      });
  }

  /**
   * Runs rx-actions configured for the row/card Action button (same path as palette Action button).
   * @returns true when a non-empty enabled chain was started
   */
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

  actionAriaLabel(row: RecordRow): string {
    const label = (this.state?.buttonLabel ?? 'Action').trim();
    const name = this.cardPrimaryTitle(row) || 'item';
    return `${label}: ${name}`;
  }

  private rebuildView(): void {
    let rows = [...this.rawRecords];

    if (this.showCategoryRail && this.selectedCategory !== 'all') {
      rows = rows.filter(
        (r) => this.displayValue(r, this.categoryFieldEffective) === this.selectedCategory
      );
    }

    if (this.showFacetRail && this.selectedFacet !== 'all') {
      rows = rows.filter((r) => this.displayValue(r, this.facetFieldKey) === this.selectedFacet);
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      const keys = this.searchFieldKeys();
      rows = rows.filter((r) =>
        keys.some((f) => this.displayValue(r, f).toLowerCase().includes(q))
      );
    }

    if (this.viewMode === 'table' && this.sortColumn) {
      const col = this.sortColumn;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      rows.sort((a, b) => compareValues(getFieldValue(a, col), getFieldValue(b, col), dir));
    }

    this.displayRows = rows;
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as ICatalogViewProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'name':
      case 'buttonLabel':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as ICatalogViewProperties;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'initialView':
        next.initialView = propertyValue as CatalogViewMode;
        this.state = next as unknown as ICatalogViewProperties;
        this.applyLayoutFromConfig(this.state);
        this.rebuildView();
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'records':
      case 'fields':
      case 'catalogSelectedFieldIds':
      case 'recordsViewInputParamName':
      case 'fieldsCsv':
      case 'recordDefinitionName':
      case 'facetFieldKey':
      case 'facetOptionsJson':
      case 'categoryFieldKey':
      case 'useBuiltInRecordQuery':
      case 'catalogPageSize':
      case 'catalogQueryExpression':
      case 'cardTitleFieldId':
      case 'cardDescriptionFieldId':
      case 'cardBadgeFieldId':
      case 'cardPriceFieldId':
      case 'cardCurrencyFieldId':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as ICatalogViewProperties;
        this.applyLayoutFromConfig(this.state);
        this.refreshDataRows();
        if (propertyPath === 'recordDefinitionName') {
          this.refreshFieldLabels();
        }
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'targetViewDefinitionName':
      case 'openViewPresentationType':
      case 'openViewModalTitle':
      case 'viewParamFieldKeysCsv':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as ICatalogViewProperties;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      default:
        return throwError(
          () => new Error(`CatalogView: property ${propertyPath} is not settable.`)
        );
    }
  }
}

function buildCatalogFieldLabelMap(def: IRecordDefinition): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of def.fieldDefinitions ?? []) {
    const id = String(f.id);
    const name = (f.name ?? '').trim();
    out[id] = name || id;
  }
  return out;
}

function resolveRecordsSource(
  c: ICatalogViewProperties,
  runtimeViewModelApi: RuntimeViewModelApi | undefined,
  rxLogService: RxLogService
): RecordRow[] {
  const paramName = (c.recordsViewInputParamName ?? '').trim();
  if (paramName && runtimeViewModelApi) {
    try {
      const params = runtimeViewModelApi.getViewInputParameters() as Record<string, unknown>;
      const raw = params?.[paramName];
      const rows = coerceRecords(raw);
      if (rows.length === 0 && raw != null) {
        rxLogService.debug(
          `CatalogView: view input "${paramName}" is missing or not an array (got ${typeof raw}).`
        );
      }
      return rows;
    } catch (e) {
      rxLogService.debug(`CatalogView: could not read view input parameters: ${String(e)}`);
      return coerceRecords(c.records);
    }
  }
  return coerceRecords(c.records);
}

function resolveFieldsSource(c: ICatalogViewProperties): string[] {
  const fromPicker = normalizeCatalogFieldIds(c.catalogSelectedFieldIds);
  if (fromPicker.length > 0) {
    return fromPicker;
  }
  const csv = (c.fieldsCsv ?? '').trim();
  if (csv) {
    return csv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return coerceFields(c.fields);
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

function coerceFields(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((x) => extractCatalogFieldId(x)).filter(Boolean);
  }
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.startsWith('[')) {
      try {
        const parsed = JSON.parse(t) as unknown;
        return coerceFields(parsed);
      } catch {
        /* fall through */
      }
    }
    return t
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseFacetOptionsJson(raw: string): string[] {
  const t = raw.trim();
  if (!t) {
    return [];
  }
  try {
    const parsed = JSON.parse(t) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((x) => String(x).trim()).filter(Boolean);
    }
  } catch (e) {
    // @context Invalid JSON from inspector — ignore facet list
    void e;
  }
  return [];
}

function resolveCategoryFieldKey(configured: string, fields: string[]): string {
  const c = configured.trim();
  if (c && fields.includes(c)) {
    return c;
  }
  if (fields.includes('category')) {
    return 'category';
  }
  return '';
}

function getFieldValue(row: RecordRow, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(row, key)) {
    return row[key];
  }
  return undefined;
}

function compareValues(a: unknown, b: unknown, dir: number): number {
  const na = toSortable(a);
  const nb = toSortable(b);
  if (typeof na === 'number' && typeof nb === 'number' && !Number.isNaN(na) && !Number.isNaN(nb)) {
    if (na < nb) {
      return -1 * dir;
    }
    if (na > nb) {
      return 1 * dir;
    }
    return 0;
  }
  const sa = String(na);
  const sb = String(nb);
  return sa.localeCompare(sb, undefined, { sensitivity: 'base' }) * dir;
}

function toSortable(v: unknown): string | number {
  if (v == null) {
    return '';
  }
  if (typeof v === 'number') {
    return v;
  }
  const s = String(v).trim();
  const n = Number(s);
  if (s !== '' && !Number.isNaN(n)) {
    return n;
  }
  return s.toLowerCase();
}

function safeStringify(row: RecordRow): string {
  try {
    return JSON.stringify(row);
  } catch {
    return '';
  }
}

function resolveOpenViewPresentationType(raw: string | undefined): OpenViewActionType {
  const v = (raw ?? '').trim();
  const allowed = Object.values(OpenViewActionType) as string[];
  if (v && allowed.includes(v)) {
    return v as OpenViewActionType;
  }
  return OpenViewActionType.DockedRightModal;
}

function parseViewParamFieldKeys(csv: string | undefined): string[] {
  const s = (csv ?? '').trim();
  if (!s) {
    return [];
  }
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildViewInputParamsFromRow(row: RecordRow, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = getFieldValue(row, k);
    if (v != null) {
      out[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
    }
  }
  return out;
}
