/**
 * @generated
 * @context Configurable catalog/grid-table view: records + field keys from any record definition; optional built-in Data Page load (Record grid–style); card slot mapping; optional RxOpenViewActionService target view + viewParams.
 * @decisions useBuiltInRecordQuery uses RxRecordInstanceDataPageService (cookbook/04); slot field IDs optional — fallback to previous heuristics when empty.
 * @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md, docs/request-view-component-with-record-definition.md
 * @modified 2026-03-21
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export type CatalogViewMode = 'card' | 'table';

/**
 * Runtime input properties. `records` / `fields` are typically bound via View Designer expressions.
 */
export interface ICatalogViewProperties extends IRxStandardProps {
  name: string;
  /**
   * When true, loads rows via Record Instance Data Page using recordDefinitionName — no Records expression or canvas Data Page.
   * Omitted/false keeps legacy: view input, then Records expression.
   */
  /** Default true for new instances; omit on older saved views = expression mode. */
  useBuiltInRecordQuery?: boolean;
  /**
   * Page size for built-in query (-1 = all per platform). Stored as string for inspector text control.
   */
  catalogPageSize?: string;
  /**
   * Optional Data Page qualification, e.g. `'7' = "0"`. Empty = no extra filter.
   */
  catalogQueryExpression?: string;
  /**
   * Card slot: field ID for main title (e.g. product name). Empty = infer from display fields / name-like key.
   */
  cardTitleFieldId?: string;
  /** Card slot: subtitle / long description under title. */
  cardDescriptionFieldId?: string;
  /** Card slot: top-right badge (e.g. billing cadence). Empty = use facet field on card if configured. */
  cardBadgeFieldId?: string;
  /** Card slot: numeric price amount. */
  cardPriceFieldId?: string;
  /** Card slot: currency code (e.g. USD). Shown before price when set. */
  cardCurrencyFieldId?: string;
  /**
   * Fully qualified record definition name from the inspector picker (metadata / validation).
   * Example: com.mycompany.my-app:PRODUCT
   */
  recordDefinitionName: string;
  /**
   * Field IDs to show (strings), from the multi-select in View Designer. Matches Data Page row keys.
   * When non-empty, takes precedence over {@link fieldsCsv} and {@link fields}.
   */
  catalogSelectedFieldIds: string | string[] | undefined;
  /**
   * Evaluates to an array of record objects (any shape). Keys should match `fields` entries.
   * Ignored at runtime when {@link recordsViewInputParamName} is set (non-empty).
   */
  records: unknown;
  /**
   * Optional: name of a **view input parameter** whose value is the records array.
   * When set, runtime reads `getViewInputParameters()[name]` and you can leave **Records** expression empty.
   */
  recordsViewInputParamName: string;
  /**
   * Field identifiers to show, in order (developer names or datapage keys).
   * Used when {@link catalogSelectedFieldIds} is empty and {@link fieldsCsv} is empty.
   */
  fields: unknown;
  /**
   * Optional comma-separated field keys (names or IDs).
   * Used when {@link catalogSelectedFieldIds} is empty.
   */
  fieldsCsv: string;
  /** Label for the per-row / per-card primary action. */
  buttonLabel: string;
  /** Designer default for first paint; user can switch at runtime. */
  initialView: CatalogViewMode;
  /**
   * When set and the key exists in `fields`, a facet control (pills) is shown for that field.
   * Example: billing_cycle_type
   */
  facetFieldKey: string;
  /**
   * JSON array of allowed facet values, e.g. ["ONE_OFF","MONTHLY","QUARTERLY","YEARLY"]
   */
  facetOptionsJson: string;
  /**
   * When this key exists in `fields`, a left "category" rail is shown (unique values + All).
   * Leave empty to auto-use `category` only if listed in `fields`.
   */
  categoryFieldKey: string;

  /**
   * Fully qualified view to open when the row action runs, e.g. `com.my.bundle:product-detail`.
   * Empty = only `catalogActionRecord` / JSON outputs (no navigation).
   */
  targetViewDefinitionName?: string;
  /**
   * How to present the opened view — matches OpenViewActionType string values (`fullWidth`, `centeredModal`, …).
   */
  openViewPresentationType?: string;
  /** Optional modal / docked panel title. */
  openViewModalTitle?: string;
  /**
   * Comma-separated **row field keys** (IDs) to copy into `viewParams` for the target view (same key names as view inputs).
   * Example: `379,536870913` or `productId,name`
   */
  viewParamFieldKeysCsv?: string;
}
