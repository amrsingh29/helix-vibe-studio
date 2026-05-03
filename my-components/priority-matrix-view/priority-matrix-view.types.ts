/**
 * @generated
 * @context Data-driven priority matrix VC: properties from record JSON + expression, IRxStandardProps.
 * @decisions Mirrors org-chart record-field pattern; matrixConfigJson for expression override when no record load path.
 * @references cookbook/02-ui-view-components.md, my-components/org-chart-view/org-chart-view.types.ts
 * @modified 2026-05-03
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export interface IPriorityMatrixViewProperties extends IRxStandardProps {
  name: string;
  /** Record definition that stores matrix JSON in a text field */
  recordDefinitionName: unknown;
  /** Field id (string) for JSON: row_axis, col_axis, matrix */
  matrixJsonFieldId: string;
  /** When set with RD + field, load that instance via GET */
  recordInstanceId?: unknown;
  /** Data Page AR qualification when instance id is empty */
  matrixDataQueryExpression: string;
  /** Data Page page size (default 1) */
  matrixDataPageSize: string;
  /** JSON string or object when not loading from record (record path wins when RD+field set) */
  matrixConfigJson: unknown;
}
