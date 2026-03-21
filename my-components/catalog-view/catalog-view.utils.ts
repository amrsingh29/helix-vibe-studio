/**
 * @generated
 * @context Shared normalization for catalog field ID lists (picker, CSV, expression).
 * @decisions Single module imported by runtime and design — avoids runtime importing design model.
 * @references catalog-view-design.model.ts
 * @modified 2026-03-21
 */
import type { ICatalogViewProperties } from './catalog-view.types';

/**
 * Helix inspector often stores select option as `{ id, name }`; multi-select as an array of those.
 */
export function extractCatalogFieldId(value: unknown): string {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id: unknown }).id).trim();
  }
  return '';
}

/** Normalizes stored multi-select / JSON / comma string into string field IDs. */
export function normalizeCatalogFieldIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((x) => extractCatalogFieldId(x)).filter(Boolean);
  }
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.startsWith('[')) {
      try {
        return normalizeCatalogFieldIds(JSON.parse(t) as unknown);
      } catch {
        return [];
      }
    }
    if (t) {
      return t.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/**
 * Field IDs to request for Record Instance Data Page (display fields + card slots + filters).
 */
export function buildCatalogPropertySelection(c: ICatalogViewProperties): number[] {
  const strIds = new Set<string>();
  for (const x of normalizeCatalogFieldIds(c.catalogSelectedFieldIds)) {
    strIds.add(x);
  }
  const addId = (v: unknown) => {
    const t = extractCatalogFieldId(v);
    if (t) {
      strIds.add(t);
    }
  };
  addId(c.cardTitleFieldId);
  addId(c.cardDescriptionFieldId);
  addId(c.cardBadgeFieldId);
  addId(c.cardPriceFieldId);
  addId(c.cardCurrencyFieldId);
  addId(c.categoryFieldKey);
  addId(c.facetFieldKey);
  const nums: number[] = [];
  for (const s of strIds) {
    const n = Number(s);
    if (!Number.isNaN(n)) {
      nums.push(n);
    }
  }
  return [...new Set(nums)];
}

/**
 * When switch is omitted (older saved views), use built-in load if a record definition is set and no other row source is configured.
 */
export function shouldUseBuiltInRecordQuery(c: ICatalogViewProperties): boolean {
  if (c.useBuiltInRecordQuery === false) {
    return false;
  }
  if (c.useBuiltInRecordQuery === true) {
    return true;
  }
  const rd = extractCatalogFieldId(c.recordDefinitionName) ||
    (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
  if (!rd) {
    return false;
  }
  if ((c.recordsViewInputParamName ?? '').trim()) {
    return false;
  }
  const r = c.records;
  if (r == null || r === '') {
    return true;
  }
  if (typeof r === 'string' && !r.trim()) {
    return true;
  }
  return false;
}
