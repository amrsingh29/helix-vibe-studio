/**
 * @generated
 * @context Shared normalization for catalog field ID lists (picker, CSV, expression); flatten pickers + open-view presentation for view definition save (AR 1588).
 * @decisions Coerce {id,name} pickers to strings; flatten openViewPresentationType and initialView objects; strip quotes from modal title; buildCatalogFieldValuesByFieldId for Launch process inputs.
 * @references catalog-view-design.model.ts
 * @modified 2026-03-21
 */
import { OpenViewActionType } from '@helix/platform/view/api';
import type { CatalogViewMode, ICatalogViewProperties } from './catalog-view.types';

const ALLOWED_OPEN_VIEW_PRESENTATION = new Set<string>(
  Object.values(OpenViewActionType) as string[]
);

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

/** Record definition picker may return `{ id, name }`; server save expects a single string. */
export function flattenRecordDefinitionNameValue(v: unknown): string {
  return extractCatalogFieldId(v) || (typeof v === 'string' ? v.trim() : '');
}

/**
 * Expression / static text sometimes persists a view FQDN with literal surrounding quotes, e.g.
 * `"com.bundle:MyView"` in the stored string. Selection menus on save expect the bare FQDN (AR 1588).
 */
function stripSurroundingQuotes(s: string): string {
  let t = s.trim();
  if (t.length >= 2) {
    const a = t[0];
    const b = t[t.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) {
      t = t.slice(1, -1).trim();
    }
  }
  return t;
}

/** Bare `bundleId:ViewName` for legacy open view — strips accidental quote wrappers from inspector. */
export function normalizeTargetViewDefinitionNameValue(raw: unknown): string {
  const base = extractCatalogFieldId(raw) || (typeof raw === 'string' ? raw.trim() : '');
  if (!base) {
    return '';
  }
  return stripSurroundingQuotes(base);
}

/**
 * Inspector select may persist `{ id: 'centeredModal', name: '...' }`. Using `String(obj)` yields
 * `[object Object]`, which is not a valid OpenViewActionType and triggers AR 1588 on view definition save.
 */
export function flattenOpenViewPresentationType(raw: unknown): OpenViewActionType {
  const s = extractCatalogFieldId(raw) || (typeof raw === 'string' ? raw.trim() : '');
  if (s && ALLOWED_OPEN_VIEW_PRESENTATION.has(s)) {
    return s as OpenViewActionType;
  }
  return OpenViewActionType.DockedRightModal;
}

/**
 * Row snapshot keyed by field id (same keys as Record Instance Data Page / {@link ICatalogViewProperties} linked RD).
 * Emitted before rx-actions run so Launch process input expressions can reference field ids on the map.
 */
export function buildCatalogFieldValuesByFieldId(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) {
    out[k] = row[k];
  }
  return out;
}

function idSlotNeedsFlattening(raw: unknown): boolean {
  return raw != null && raw !== '' && typeof raw === 'object' && !Array.isArray(raw);
}

function catalogSelectedNeedsFlattening(raw: unknown): boolean {
  return Array.isArray(raw) && raw.some((x) => x != null && typeof x === 'object' && !Array.isArray(x));
}

/**
 * Coerces inspector picker shapes to primitives the view definition API accepts.
 * AR 1588: "Value specified for selection not one of defined values" often occurs when
 * `recordDefinitionName` or field pickers are stored as `{ id, name }` instead of strings.
 */
export function patchCatalogPropertiesForViewDefinitionSave(
  model: ICatalogViewProperties
): Partial<ICatalogViewProperties> | undefined {
  const patch: Partial<ICatalogViewProperties> = {};

  const rdFlat = flattenRecordDefinitionNameValue(model.recordDefinitionName);
  if (model.recordDefinitionName != null && rdFlat !== model.recordDefinitionName) {
    patch.recordDefinitionName = rdFlat;
  }

  const slotKeys: (keyof ICatalogViewProperties)[] = [
    'cardTitleFieldId',
    'cardDescriptionFieldId',
    'cardBadgeFieldId',
    'cardPriceFieldId',
    'cardCurrencyFieldId',
    'categoryFieldKey',
    'facetFieldKey'
  ];
  for (const key of slotKeys) {
    const raw = model[key];
    if (idSlotNeedsFlattening(raw)) {
      (patch as Record<string, unknown>)[key as string] = extractCatalogFieldId(raw);
    }
  }

  if (catalogSelectedNeedsFlattening(model.catalogSelectedFieldIds)) {
    patch.catalogSelectedFieldIds = normalizeCatalogFieldIds(model.catalogSelectedFieldIds);
  }

  const iv = model.initialView as unknown;
  if (iv === 'card' || iv === 'table') {
    /* valid */
  } else if (typeof iv === 'object' && iv !== null) {
    const id = extractCatalogFieldId(iv);
    if (id === 'card' || id === 'table') {
      patch.initialView = id as CatalogViewMode;
    } else {
      patch.initialView = 'card';
    }
  } else if (typeof iv === 'string') {
    const low = iv.toLowerCase();
    if (low === 'card' || low === 'table') {
      patch.initialView = low as CatalogViewMode;
    } else {
      patch.initialView = 'card';
    }
  } else {
    patch.initialView = 'card';
  }

  const rawPres = model.openViewPresentationType;
  if (rawPres != null) {
    const presFlat = flattenOpenViewPresentationType(rawPres);
    if (typeof rawPres === 'object' || rawPres !== presFlat) {
      patch.openViewPresentationType = presFlat;
    }
  }

  const sw: unknown = model.useBuiltInRecordQuery;
  if (typeof sw === 'string') {
    const t = sw.toLowerCase();
    if (t === 'true') {
      patch.useBuiltInRecordQuery = true;
    }
    if (t === 'false') {
      patch.useBuiltInRecordQuery = false;
    }
  }

  const tvn = model.targetViewDefinitionName;
  if (tvn != null && String(tvn).trim() !== '') {
    const norm = normalizeTargetViewDefinitionNameValue(tvn);
    const before =
      typeof tvn === 'string' ? tvn.trim() : extractCatalogFieldId(tvn) || String(tvn).trim();
    if (norm !== before) {
      patch.targetViewDefinitionName = norm;
    }
  }

  const rawTitle = model.openViewModalTitle;
  if (rawTitle != null && String(rawTitle).trim() !== '') {
    const trimmed = String(rawTitle).trim();
    const normTitle = stripSurroundingQuotes(trimmed);
    if (normTitle !== trimmed) {
      patch.openViewModalTitle = normTitle;
    }
  }

  return Object.keys(patch).length ? patch : undefined;
}
