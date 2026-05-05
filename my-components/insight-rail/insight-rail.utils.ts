/**
 * @generated
 * @context Property selection for Data Page; built-in query toggle; save-time flatten for AR 1588.
 * @decisions Unwrap expression-evaluated `records` ({ value } wrappers); Qualification.md enum RHS should be numeric — log hint when qualification uses quoted label text.
 * @references my-components/catalog-view/catalog-view.utils.ts, .cursor/_instructions/UI/Services/Qualification.md
 * @modified 2026-04-30; removed Tier 2 client filter helpers from property selection.
 */
import {
  extractCatalogFieldId,
  normalizeCatalogFieldIds,
  flattenRecordDefinitionNameValue
} from '../catalog-view/catalog-view.utils';
import type { IInsightRailProperties } from './insight-rail.types';

/**
 * Expression-evaluated view props often arrive as `{ value, expression, constant }` — unwrap before string/array coercion.
 * @references my-components/org-chart-view/org-chart-record.util.ts coerceDesignerString
 */
export function unwrapInsightEvaluatedProperty(value: unknown): unknown {
  if (value == null) {
    return value;
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.value !== 'undefined') {
    return unwrapInsightEvaluatedProperty(obj.value);
  }
  if (typeof obj.expression === 'string') {
    return unwrapInsightEvaluatedProperty(obj.expression);
  }
  if (obj.constant && typeof obj.constant === 'object') {
    const c = obj.constant as Record<string, unknown>;
    if (c.value != null) {
      return unwrapInsightEvaluatedProperty(c.value);
    }
  }
  return value;
}

/** String form of an expression-evaluated property (e.g. Records filter chip text). */
export function coerceInsightExpressionProperty(value: unknown): string {
  const u = unwrapInsightEvaluatedProperty(value);
  if (u == null || u === '') {
    return '';
  }
  if (typeof u === 'string') {
    const t = u.trim();
    return t === '' || t === 'undefined' || t === 'null' ? '' : t;
  }
  if (typeof u === 'number' && Number.isFinite(u)) {
    return String(u);
  }
  if (typeof u === 'boolean') {
    return u ? 'true' : '';
  }
  const s = String(u).trim();
  return s === '' || s === 'undefined' || s === 'null' ? '' : s;
}

/**
 * View props with expression evaluation can be number/object at runtime; never assume `.trim` exists.
 */
export function coerceTrimmedString(value: unknown): string {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return String(value).trim();
}

/**
 * Innovation Studio qualifications require character/text RHS in double quotes (`'7' = "New"`).
 * Users often type `'536870919' = 'SaaS'`, which makes the Data Page API return 400 — normalize common cases.
 * Skips segments that already contain `"` inside the single-quoted span (avoid corrupting escapes).
 */
export function normalizeArQualificationRhsSingleQuotesToDouble(qe: string): string {
  if (!qe.includes("'")) {
    return qe;
  }
  const esc = (inner: string): string => inner.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  let out = qe.replace(/=\s*'([^']*)'/g, (_full, inner: string) => {
    if (inner.includes('"')) {
      return _full;
    }
    if (/^\d+$/.test(inner)) {
      return `= ${inner}`;
    }
    return `= "${esc(inner)}"`;
  });
  out = out.replace(/\bLIKE\s+'([^']*)'/gi, (_full, inner: string) => {
    if (inner.includes('"')) {
      return _full;
    }
    return `LIKE "${esc(inner)}"`;
  });
  return out;
}

/** Readable message from Data Page / HTTP failures (avoids `[object Object]` in logs). */
export function formatInsightDataPageError(err: unknown): string {
  if (err == null) {
    return 'unknown error';
  }
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err !== 'object') {
    return String(err);
  }
  const o = err as Record<string, unknown>;
  const msg = o.message;
  if (typeof msg === 'string' && msg.trim()) {
    return withHttpStatus(o, msg);
  }
  const inner = o.error;
  if (typeof inner === 'string' && inner.trim()) {
    return withHttpStatus(o, inner);
  }
  if (inner && typeof inner === 'object') {
    const ie = inner as Record<string, unknown>;
    const im = ie.message;
    if (typeof im === 'string' && im.trim()) {
      return withHttpStatus(o, im);
    }
    try {
      return withHttpStatus(o, JSON.stringify(inner));
    } catch {
      /* fall through */
    }
  }
  try {
    return withHttpStatus(o, JSON.stringify(o));
  } catch {
    return withHttpStatus(o, String(err));
  }
}

function withHttpStatus(o: Record<string, unknown>, detail: string): string {
  const status = o.status;
  if (typeof status === 'number') {
    const st = typeof o.statusText === 'string' ? o.statusText : '';
    return `HTTP ${status}${st ? ` ${st}` : ''} — ${detail}`;
  }
  return detail;
}

/** Data Page `queryExpression` must be a qualification string; coerce non-strings from the expression engine. */
export function normalizeInsightQueryExpression(value: unknown): string {
  const s = coerceTrimmedString(value);
  if (!s) {
    return '';
  }
  return normalizeArQualificationRhsSingleQuotesToDouble(s);
}

/** True when `records` looks like a JSON array of row objects (not an AR filter token). */
export function isJsonRecordArrayString(s: string): boolean {
  const t = s.trim();
  if (!t.startsWith('[')) {
    return false;
  }
  try {
    return Array.isArray(JSON.parse(t));
  } catch {
    return false;
  }
}

/**
 * Record list / expression binding sometimes delivers a filter chip string (e.g. `Category (536870919) = "SaaS"`)
 * instead of row JSON. Those must drive Data Page `queryExpression`, not `coerceRecords`.
 */
export function isLikelyRecordsQualificationExpression(raw: unknown): boolean {
  const s = coerceInsightExpressionProperty(raw);
  if (!s || isJsonRecordArrayString(s)) {
    return false;
  }
  if (!s.includes('=')) {
    return false;
  }
  if (/'?\d+'?\s*=/.test(s)) {
    return true;
  }
  if (/\(\s*\d+\s*\)/.test(s)) {
    return true;
  }
  return false;
}

/**
 * Turns designer-style filter text into AR qualification (`'536870919' = "SaaS"`).
 */
export function normalizeVisualRecordFilterToQualification(raw: unknown): string {
  const s = coerceInsightExpressionProperty(raw);
  if (!s || isJsonRecordArrayString(s)) {
    return '';
  }
  const eqIdx = s.indexOf('=');
  if (eqIdx < 0) {
    return '';
  }
  const lhs = s.slice(0, eqIdx).trim();
  const rhsRaw = s.slice(eqIdx + 1).trim();
  let rhsInner = rhsRaw;
  if (
    (rhsInner.startsWith('"') && rhsInner.endsWith('"')) ||
    (rhsInner.startsWith("'") && rhsInner.endsWith("'"))
  ) {
    rhsInner = rhsInner.slice(1, -1);
  }
  const parenId = lhs.match(/\(\s*(\d+)\s*\)/);
  let fid = parenId?.[1];
  if (!fid) {
    const bare = lhs.match(/^\s*['"]?\s*(\d+)\s*['"]?\s*$/);
    fid = bare?.[1];
  }
  if (!fid) {
    const anyId = lhs.match(/(\d+)/);
    fid = anyId?.[1];
  }
  if (!fid || !/^\d+$/.test(fid)) {
    return normalizeInsightQueryExpression(s);
  }
  const escapedRhs = rhsInner.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return normalizeInsightQueryExpression(`'${fid}' = "${escapedRhs}"`);
}

/** Data Page `queryExpression` from Records (expression) when it resolves to a record-list / AR filter token. */
export function resolveInsightDataPageQualification(c: IInsightRailProperties): string {
  if (!isLikelyRecordsQualificationExpression(c.records)) {
    return '';
  }
  return normalizeVisualRecordFilterToQualification(c.records);
}

/** Structured diagnostics for RxLogService (troubleshoot empty rail / wrong binding shape). */
export function buildInsightDataPageQualificationDiagnostics(c: IInsightRailProperties): {
  recordsRawType: string;
  recordsUnwrappedType: string;
  recordsCoercedPreview: string;
  sendsQualificationToDataPage: boolean;
  normalizedQueryExpression: string;
} {
  const unwrapped = unwrapInsightEvaluatedProperty(c.records);
  const coerced = coerceInsightExpressionProperty(c.records);
  const normalizedQueryExpression = resolveInsightDataPageQualification(c);
  return {
    recordsRawType: c.records === null || c.records === undefined ? String(c.records) : typeof c.records,
    recordsUnwrappedType:
      unwrapped === null || unwrapped === undefined ? String(unwrapped) : typeof unwrapped,
    recordsCoercedPreview: coerced.length > 220 ? `${coerced.slice(0, 220)}…` : coerced,
    sendsQualificationToDataPage: Boolean(normalizedQueryExpression),
    normalizedQueryExpression:
      normalizedQueryExpression.length > 300
        ? `${normalizedQueryExpression.slice(0, 300)}…`
        : normalizedQueryExpression
  };
}

/** True when normalized qualification compares to a double-quoted RHS (selection/enums often need integer — see Qualification.md). */
export function qualificationUsesQuotedTextRhs(qe: string): boolean {
  return /=\s*"/.test(qe);
}

/** Why automatic Data Page path is or is not used — for operator-visible troubleshooting. */
export function buildInsightRuntimeModeDiagnostics(c: IInsightRailProperties): {
  useBuiltInRecordQueryLabel: string;
  recordDefinitionResolved: string;
  builtInEligible: boolean;
  builtInEffective: boolean;
  reasonNotUsingDataPage: string;
} {
  const rd =
    extractCatalogFieldId(c.recordDefinitionName) ||
    (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
  const tri = c.useBuiltInRecordQuery;
  const useBuiltInRecordQueryLabel =
    tri === true ? 'true' : tri === false ? 'false' : 'unset';
  const builtInEligible = shouldUseInsightBuiltInQuery(c);
  const builtInEffective = builtInEligible && Boolean(rd);

  let reasonNotUsingDataPage = '';
  if (!builtInEffective) {
    if (tri === false) {
      reasonNotUsingDataPage = 'Automatic load OFF — Records filter is NOT sent as queryExpression';
    } else if (!rd) {
      reasonNotUsingDataPage = 'No record definition — Data Page cannot run';
    } else if (coerceTrimmedString(c.recordsViewInputParamName)) {
      reasonNotUsingDataPage =
        'View input param set — rows come from view input only; Records chip is not used as server qualification';
    } else if (!builtInEligible) {
      reasonNotUsingDataPage =
        'Tri-state: non-empty Records value is not recognized as qualification chip (or is row JSON only)';
    }
  }

  return {
    useBuiltInRecordQueryLabel,
    recordDefinitionResolved: rd || '(none)',
    builtInEligible,
    builtInEffective,
    reasonNotUsingDataPage: reasonNotUsingDataPage || 'OK — Data Page load'
  };
}

/** Page size token for Data Page (`-1` = platform default / all). */
export function normalizeInsightPageSizeToken(value: unknown): string {
  const s = coerceTrimmedString(value);
  return s || '-1';
}

/**
 * Field IDs requested on Record Instance Data Page (display + card slots).
 */
export function buildInsightPropertySelection(c: IInsightRailProperties): number[] {
  const strIds = new Set<string>();
  for (const x of normalizeCatalogFieldIds(c.insightSelectedFieldIds)) {
    strIds.add(x);
  }
  const add = (v: unknown) => {
    const t = extractCatalogFieldId(v);
    if (t) {
      strIds.add(t);
    }
  };
  add(c.insightTitleFieldId);
  add(c.insightDescriptionFieldId);
  add(c.insightMetricFieldId);
  add(c.insightHeaderFieldId);
  const nums: number[] = [];
  for (const s of strIds) {
    const n = Number(s);
    if (!Number.isNaN(n) && n > 0) {
      nums.push(n);
    }
  }
  nums.push(1, 379);
  return [...new Set(nums.filter((n) => n > 0))];
}

/** Same semantics as {@link shouldUseBuiltInRecordQuery} on catalog. */
export function shouldUseInsightBuiltInQuery(c: IInsightRailProperties): boolean {
  if (c.useBuiltInRecordQuery === false) {
    return false;
  }
  if (c.useBuiltInRecordQuery === true) {
    return true;
  }
  const rd =
    extractCatalogFieldId(c.recordDefinitionName) ||
    (typeof c.recordDefinitionName === 'string' ? c.recordDefinitionName.trim() : '');
  if (!rd) {
    return false;
  }
  if (coerceTrimmedString(c.recordsViewInputParamName)) {
    return false;
  }
  if (!coerceInsightExpressionProperty(c.records)) {
    return true;
  }
  if (isLikelyRecordsQualificationExpression(c.records)) {
    return true;
  }
  return false;
}

function idSlotNeedsFlattening(raw: unknown): boolean {
  return raw != null && raw !== '' && typeof raw === 'object' && !Array.isArray(raw);
}

function insightSelectedNeedsFlattening(raw: unknown): boolean {
  return Array.isArray(raw) && raw.some((x) => x != null && typeof x === 'object' && !Array.isArray(x));
}

/**
 * Coerces inspector picker shapes for view-definition save (AR 1588).
 */
export function patchInsightPropertiesForViewDefinitionSave(
  model: IInsightRailProperties
): Partial<IInsightRailProperties> | undefined {
  const patch: Partial<IInsightRailProperties> = {};

  const rdFlat = flattenRecordDefinitionNameValue(model.recordDefinitionName);
  if (model.recordDefinitionName != null && rdFlat !== model.recordDefinitionName) {
    patch.recordDefinitionName = rdFlat;
  }

  const slotKeys: (keyof IInsightRailProperties)[] = [
    'insightTitleFieldId',
    'insightDescriptionFieldId',
    'insightMetricFieldId',
    'insightHeaderFieldId'
  ];
  for (const key of slotKeys) {
    const raw = model[key];
    if (idSlotNeedsFlattening(raw)) {
      (patch as Record<string, unknown>)[key as string] = extractCatalogFieldId(raw);
    }
  }

  if (insightSelectedNeedsFlattening(model.insightSelectedFieldIds)) {
    patch.insightSelectedFieldIds = normalizeCatalogFieldIds(model.insightSelectedFieldIds);
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

  return Object.keys(patch).length ? patch : undefined;
}
