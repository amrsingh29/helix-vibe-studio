/**
 * @generated
 * @context Helpers for org chart record-field data source: flatten RD picker value, coerce Data Page rows, read cell by field id.
 * @decisions Mirrors catalog-view flattenRecordDefinitionNameValue pattern for picker `{ id, name }` vs string.
 * @references my-components/catalog-view/catalog-view.utils.ts
 * @modified 2026-03-29
 */

export type RecordRow = Record<string, unknown>;

/**
 * Coerce designer / expression-evaluated values to a trimmed string.
 * Properties with enableExpressionEvaluation may be objects ({ value, expression, constant }); calling .trim() on them throws.
 * @references markdown-viewer.component.ts normalizeValue
 */
export function coerceDesignerString(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    if (typeof obj.value !== 'undefined') {
      return coerceDesignerString(obj.value);
    }
    if (typeof obj.expression === 'string') {
      return coerceDesignerString(obj.expression);
    }
    if (obj.constant && typeof obj.constant === 'object') {
      const c = obj.constant as Record<string, unknown>;
      if (c.value != null) {
        return coerceDesignerString(c.value);
      }
    }
  }
  return '';
}

/** Record definition picker may return `{ id, name }`; runtime needs a single string name. */
export function flattenRecordDefinitionNameValue(v: unknown): string {
  if (v === null || v === undefined) {
    return '';
  }
  if (typeof v === 'object' && v !== null && 'id' in v) {
    const id = (v as { id?: unknown }).id;
    return typeof id === 'string' ? id.trim() : String(id ?? '').trim();
  }
  return typeof v === 'string' ? v.trim() : '';
}

export function coerceDataPageRows(value: unknown): RecordRow[] {
  if (Array.isArray(value)) {
    return value.filter((r) => r != null && typeof r === 'object') as RecordRow[];
  }
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return coerceDataPageRows((value as { data: unknown }).data);
  }
  return [];
}

export function getCellByFieldId(row: RecordRow, fieldId: string): unknown {
  if (!fieldId || !row) {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(row, fieldId)) {
    return row[fieldId];
  }
  return undefined;
}
