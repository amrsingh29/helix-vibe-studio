/**
 * @generated
 * @context Parse priority matrix JSON: ordered axis values, first-seen priority order, cell map, detail rows.
 * @decisions First matching matrix entry wins for duplicate (row,col); skip rows missing axis fields; String() for priority keys.
 * @references Plan: priority matrix view (data-driven)
 * @modified 2026-05-03
 */

const ERROR_PREFIX = 'com.amar.helix-vibe-studio.view-components.priority-matrix.error.';

export interface IPriorityMatrixModel {
  rowAxisLabel: string;
  colAxisLabel: string;
  rowField: string;
  colField: string;
  rowValues: string[];
  colValues: string[];
  /** unique priority values in first-seen order (String); index 0 = most critical styling */
  priorityOrder: string[];
  /** composite key row\u0000col → matrix entry (first wins) */
  cellMap: Map<string, Record<string, unknown>>;
  /** maps normalized priority key → severity index */
  priorityIndexByKey: Map<string, number>;
}

export interface IPriorityMatrixParseOutcome {
  errorKey: string | null;
  model: IPriorityMatrixModel | null;
}

export function humanizeFieldKey(key: string): string {
  return key.replace(/_/g, ' ');
}

export function formatDetailValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function axisLabel(ax: unknown): string {
  if (!ax || typeof ax !== 'object') {
    return '';
  }
  const lab = (ax as { label?: unknown }).label;
  return typeof lab === 'string' ? lab : lab != null ? String(lab) : '';
}

function axisField(ax: unknown): string {
  if (!ax || typeof ax !== 'object') {
    return '';
  }
  const f = (ax as { field?: unknown }).field;
  return typeof f === 'string' ? f : f != null ? String(f) : '';
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) {
    return '';
  }
  return String(v);
}

function priorityKey(p: unknown): string {
  return toStr(p);
}

/**
 * Parse and validate config. Returns `errorKey` (i18n suffix after ERROR_PREFIX) or `model`.
 */
export function parsePriorityMatrixConfig(raw: unknown): IPriorityMatrixParseOutcome {
  let data: unknown = raw;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t) {
      return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
    }
    try {
      data = JSON.parse(t) as unknown;
    } catch {
      return { errorKey: `${ERROR_PREFIX}invalid-json`, model: null };
    }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
  }

  const o = data as Record<string, unknown>;
  const rowAxis = o.row_axis;
  const colAxis = o.col_axis;
  const matrix = o.matrix;

  if (!rowAxis || typeof rowAxis !== 'object' || Array.isArray(rowAxis)) {
    return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
  }
  if (!colAxis || typeof colAxis !== 'object' || Array.isArray(colAxis)) {
    return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
  }
  if (!Array.isArray(matrix)) {
    return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
  }

  const rowField = axisField(rowAxis);
  const colField = axisField(colAxis);
  if (!rowField || !colField) {
    return { errorKey: `${ERROR_PREFIX}invalid-structure`, model: null };
  }

  const rowAxisLabel = axisLabel(rowAxis);
  const colAxisLabel = axisLabel(colAxis);

  const rowValues: string[] = [];
  const colValues: string[] = [];
  const seenR = new Set<string>();
  const seenC = new Set<string>();
  const priorityOrder: string[] = [];
  const seenP = new Set<string>();
  const cellMap = new Map<string, Record<string, unknown>>();

  for (const entry of matrix) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      continue;
    }
    const rec = entry as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(rec, rowField) || !Object.prototype.hasOwnProperty.call(rec, colField)) {
      continue;
    }
    const rv = toStr(rec[rowField]);
    const cv = toStr(rec[colField]);
    if (!seenR.has(rv)) {
      seenR.add(rv);
      rowValues.push(rv);
    }
    if (!seenC.has(cv)) {
      seenC.add(cv);
      colValues.push(cv);
    }
    const pk = priorityKey(rec.priority);
    if (!seenP.has(pk)) {
      seenP.add(pk);
      priorityOrder.push(pk);
    }
    const ck = `${rv}\u0000${cv}`;
    if (!cellMap.has(ck)) {
      cellMap.set(ck, rec);
    }
  }

  const priorityIndexByKey = new Map<string, number>();
  priorityOrder.forEach((k, i) => priorityIndexByKey.set(k, i));

  return {
    errorKey: null,
    model: {
      rowAxisLabel,
      colAxisLabel,
      rowField,
      colField,
      rowValues,
      colValues,
      priorityOrder,
      cellMap,
      priorityIndexByKey
    }
  };
}

export function buildCellDetailPairs(
  entry: Record<string, unknown>,
  rowField: string,
  colField: string
): { key: string; label: string; value: string }[] {
  const out: { key: string; label: string; value: string }[] = [];
  for (const key of Object.keys(entry)) {
    if (key === rowField || key === colField) {
      continue;
    }
    out.push({
      key,
      label: humanizeFieldKey(key),
      value: formatDetailValue(entry[key])
    });
  }
  return out;
}

/** Clamp visual tier index for SCSS classes 0..maxTier */
export function clampPriorityTier(index: number | undefined, maxTier: number): number {
  if (index === undefined || Number.isNaN(index)) {
    return 0;
  }
  return Math.min(Math.max(0, index), maxTier);
}
