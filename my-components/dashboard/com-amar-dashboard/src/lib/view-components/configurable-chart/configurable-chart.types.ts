/**
 * @generated
 * @context Configurable chart VC for Dashboard bundle — record Data Page + field bindings.
 * @decisions chartKind drives Adapt chart; field IDs as strings matching Data Page row keys.
 * @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md
 * @modified 2026-03-24
 */
import { IRxStandardProps } from '@helix/platform/view/api';

/** Supported Adapt-backed chart modes (phase 1). */
export type ConfigurableChartKind = 'line' | 'bar' | 'column' | 'pie' | 'donut';

export interface IConfigurableChartProperties extends IRxStandardProps {
  name: string;
  /** Display title on chart header (optional). */
  chartTitle: string;
  chartKind: ConfigurableChartKind;
  recordDefinitionName: string;
  chartQueryExpression: string;
  /** Data Page page size as string; default -1 (platform all). */
  chartPageSize: string;
  /** Category / X bucket field id (numeric id as string). */
  categoryFieldId: string;
  /** Numeric measure field id. */
  valueFieldId: string;
  /** Chart height in px. */
  chartHeight: string;
}
