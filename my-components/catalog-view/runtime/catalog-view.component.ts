/**
 * @generated
 * @context Runtime catalog: card grid or sortable table, search + optional category rail + facet pills, action button emits output for view actions.
 * @decisions OnPush with manual markForCheck; coerces records/fields from expressions; facet options from inspector JSON — no hard-coded PRODUCT IDs.
 * @references cookbook/02-ui-view-components.md, cookbook/09-best-practices.md, .cursor/rules/bmc-ux-adapt-ui-components.md
 * @modified 2026-03-20
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AdaptBadgeModule, AdaptButtonModule } from '@bmc-ux/adapt-angular';
import { RxLogService } from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CatalogViewMode, ICatalogViewProperties } from '../catalog-view.types';

type RecordRow = Record<string, unknown>;

@Component({
  standalone: true,
  selector: 'com-example-sample-application-catalog-view',
  styleUrls: ['./catalog-view.component.scss'],
  templateUrl: './catalog-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, AdaptBadgeModule]
})
@RxViewComponent({
  name: 'com-example-sample-application-catalog-view'
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

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config.pipe(takeUntil(this.destroyed$)).subscribe((c: ICatalogViewProperties) => {
      this.state = { ...c };
      this.isHidden = Boolean(c.hidden);
      this.viewMode = c.initialView === 'table' ? 'table' : 'card';
      this.rawRecords = coerceRecords(c.records);
      this.fields = coerceFields(c.fields);
      this.facetFieldKey = (c.facetFieldKey ?? '').trim();
      const facetRaw = (c.facetOptionsJson ?? '').trim();
      this.facetOptionList = parseFacetOptionsJson(facetRaw);
      if (facetRaw && this.facetFieldKey && this.fields.includes(this.facetFieldKey) && this.facetOptionList.length === 0) {
        this.rxLogService.debug('CatalogView: facetOptionsJson could not be parsed as a JSON array.');
      }
      this.categoryFieldEffective = resolveCategoryFieldKey(c.categoryFieldKey ?? '', this.fields);
      this.rebuildView();
      this.cdr.markForCheck();
    });
  }

  get showCategoryRail(): boolean {
    return Boolean(this.categoryFieldEffective && this.fields.includes(this.categoryFieldEffective));
  }

  get showFacetRail(): boolean {
    return Boolean(this.facetFieldKey && this.fields.includes(this.facetFieldKey) && this.facetOptionList.length > 0);
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

  /** Key used for the prominent card title (name-like, else first configured field). */
  primaryTitleKey(): string | null {
    return this.titleFieldKey() ?? (this.fields[0] ?? null);
  }

  humanizeField(key: string): string {
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
    this.notifyPropertyChanged('catalogActionRecord', row);
    this.notifyPropertyChanged('catalogActionRecordJson', safeStringify(row));
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
      rows = rows.filter((r) =>
        this.fields.some((f) => this.displayValue(r, f).toLowerCase().includes(q))
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
        this.state = next as ICatalogViewProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'records':
      case 'fields':
      case 'buttonLabel':
      case 'initialView':
      case 'recordDefinitionName':
      case 'facetFieldKey':
      case 'facetOptionsJson':
      case 'categoryFieldKey':
      case 'name':
        next[propertyPath] = propertyValue;
        this.state = next as ICatalogViewProperties;
        if (propertyPath === 'records') {
          this.rawRecords = coerceRecords(propertyValue);
        }
        if (propertyPath === 'fields') {
          this.fields = coerceFields(propertyValue);
        }
        if (propertyPath === 'initialView') {
          this.viewMode = propertyValue === 'table' ? 'table' : 'card';
        }
        if (propertyPath === 'facetFieldKey') {
          this.facetFieldKey = String(propertyValue ?? '').trim();
        }
        if (propertyPath === 'facetOptionsJson') {
          this.facetOptionList = parseFacetOptionsJson(String(propertyValue ?? ''));
        }
        if (propertyPath === 'categoryFieldKey') {
          this.categoryFieldEffective = resolveCategoryFieldKey(String(propertyValue ?? ''), this.fields);
        }
        this.rebuildView();
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
    return value.map((x) => String(x).trim()).filter(Boolean);
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
