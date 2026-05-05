/**
 * @generated
 * @context Insight / data-quality horizontal card rail: built-in Data Page with optional record-list qualification via Records (expression); buttonActions only (no legacy open view).
 * @decisions Mirrors catalog row outputs for Launch process / expression parity; optional header field or static section label.
 * @references cookbook/02-ui-view-components.md, my-components/catalog-view/catalog-view.types.ts
 * @modified 2026-04-30; removed Tier 2 client-side filter properties.
 */
import { IActionSinkConfig, IRxStandardProps } from '@helix/platform/view/api';

/** Row shape emitted on CTA — keys are field ids (strings) from Record Instance Data Page. */
export type InsightActionRecordRow = Record<string, unknown>;

export interface IInsightRailProperties extends IRxStandardProps {
  name: string;
  /** Populated at runtime — ActionSinkWidget GUIDs for {@link triggerSinkActions}. */
  actionSinks?: IActionSinkConfig[];

  /** When true, load via Record Instance Data Page using {@link recordDefinitionName}. */
  useBuiltInRecordQuery?: boolean;
  /** Page size for Data Page when automatic load is on (`-1` = all per platform). May be numeric from expressions. */
  insightPageSize?: string | number | unknown;

  recordDefinitionName: string;
  /** Field IDs to fetch (multi-select). */
  insightSelectedFieldIds: string | string[] | undefined;

  insightTitleFieldId?: string;
  insightDescriptionFieldId?: string;
  insightMetricFieldId?: string;
  /** Optional small header above title (e.g. domain label per row). */
  insightHeaderFieldId?: string;
  /** When {@link insightHeaderFieldId} is empty, shown as the card header line (e.g. Inventory). */
  sectionHeaderLabel?: string;
  /** Label above the metric value (e.g. Stockroom count). */
  metricLabel?: string;

  records: unknown;
  recordsViewInputParamName: string;

  /** Per-card CTA label. */
  buttonLabel: string;

  /** Output: clicked row (field ids as keys). */
  insightActionRecord?: InsightActionRecordRow;
  insightActionRecordJson?: string;
  insightFieldValuesByFieldId?: InsightActionRecordRow;
}
