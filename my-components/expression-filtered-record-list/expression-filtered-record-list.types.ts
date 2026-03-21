/**
 * @generated
 * @context Sample standalone VC: list rows from an expression, filter where a status-like field equals an expression-evaluated value (e.g. Active).
 * @decisions Records + matchStatusValue use expression binding; statusFieldKey + titleFieldKey are plain inspector text for stable keys on row objects.
 * @references cookbook/02-ui-view-components.md, how-to-build-coded-component-examples/expression-filtered-record-list.md
 * @modified 2026-03-20
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export interface IExpressionFilteredRecordListProperties extends IRxStandardProps {
  name: string;
  /**
   * Record definition picker in designer (metadata / validation); data still comes from `records` expression.
   */
  recordDefinitionName: string;
  /**
   * Expression: array of record objects (e.g. DataPage / query output).
   */
  records: unknown;
  /**
   * Field key on each row to compare (e.g. Status, or AR field name as exposed in data).
   */
  statusFieldKey: string;
  /**
   * Expression: value rows must match on statusFieldKey (e.g. literal 'Active' or a field from current record/view).
   */
  matchStatusValue: unknown;
  /**
   * Field key to show as the list label (e.g. Title, name).
   */
  titleFieldKey: string;
}
