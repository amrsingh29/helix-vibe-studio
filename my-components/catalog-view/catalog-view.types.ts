/**
 * @generated
 * @context Configurable catalog/grid-table view: records + field keys from any record definition; inspector picks RD and facet options.
 * @decisions Expression-bound records/fields for datapage/query outputs; facet filter optional via inspector JSON; output emits selected record for view actions.
 * @references cookbook/02-ui-view-components.md, docs/request-view-component-with-record-definition.md
 * @modified 2026-03-20
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export type CatalogViewMode = 'card' | 'table';

/**
 * Runtime input properties. `records` / `fields` are typically bound via View Designer expressions.
 */
export interface ICatalogViewProperties extends IRxStandardProps {
  name: string;
  /**
   * Fully qualified record definition name from the inspector picker (metadata / validation).
   * Example: com.mycompany.my-app:PRODUCT
   */
  recordDefinitionName: string;
  /**
   * Evaluates to an array of record objects (any shape). Keys should match `fields` entries.
   */
  records: unknown;
  /**
   * Field identifiers to show, in order (developer names or datapage keys).
   */
  fields: unknown;
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
}
