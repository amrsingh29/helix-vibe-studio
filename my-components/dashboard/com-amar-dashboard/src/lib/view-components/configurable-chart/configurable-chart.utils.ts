/**
 * @generated
 * @context Aggregate record rows into Adapt chart series for configurable-chart.
 * @decisions Sum values per category; coerce numeric strings; stable sort categories.
 * @references cookbook/04-ui-services-and-apis.md
 * @modified 2026-03-24
 */
import type {
  AdaptLineGraphDateAndData,
  AdaptPieData,
  AdaptStackedChartSeries
} from '@bmc-ux/adapt-charts';

export type RecordRow = Record<string, unknown>;

export function coerceRecords(value: unknown): RecordRow[] {
  if (Array.isArray(value)) {
    return value.filter((r) => r != null && typeof r === 'object') as RecordRow[];
  }
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return coerceRecords((value as { data: unknown }).data);
  }
  return [];
}

function cellValue(row: RecordRow, fieldId: string): unknown {
  if (!fieldId) {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(row, fieldId)) {
    return row[fieldId];
  }
  return undefined;
}

function toNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function toCategoryLabel(v: unknown): string {
  if (v === null || v === undefined) {
    return '';
  }
  return String(v);
}

/**
 * Groups rows by category field, sums value field.
 */
export function aggregateSumByCategory(
  rows: RecordRow[],
  categoryFieldId: string,
  valueFieldId: string
): { categories: string[]; totals: number[] } {
  const map = new Map<string, number>();
  for (const row of rows) {
    const cat = toCategoryLabel(cellValue(row, categoryFieldId));
    const key = cat || '(empty)';
    const prev = map.get(key) ?? 0;
    map.set(key, prev + toNumber(cellValue(row, valueFieldId)));
  }
  const categories = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  const totals = categories.map((c) => map.get(c) ?? 0);
  return { categories, totals };
}

export function buildBarSeries(categories: string[], totals: number[]): AdaptStackedChartSeries[] {
  return [
    {
      name: 'Values',
      data: totals
    }
  ];
}

export function buildLinePoints(categories: string[], totals: number[]): AdaptLineGraphDateAndData[] {
  return categories.map((cat, i) => ({
    date: cat,
    data: totals[i] ?? 0
  }));
}

export function buildPieSeries(categories: string[], totals: number[]): AdaptPieData[] {
  return categories.map((name, i) => ({
    name,
    y: totals[i] ?? 0
  }));
}

export function buildPropertySelection(categoryFieldId: string, valueFieldId: string): number[] {
  const ids: number[] = [];
  const a = parseInt(categoryFieldId, 10);
  const b = parseInt(valueFieldId, 10);
  if (Number.isFinite(a)) {
    ids.push(a);
  }
  if (Number.isFinite(b)) {
    ids.push(b);
  }
  return ids;
}
