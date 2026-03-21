/**
 * @generated
 * @context Runtime-actions harness: action sinks (ActionSink children) + legacy string fields when chains empty.
 * @decisions Actions edited via ActionSinkWidget in designer; runtime uses triggerSinkActions / getEnabledActions on sink guid.
 * @references cookbook/02-ui-view-components.md, @helix/platform/view/api common/action-sink.types
 * @modified 2026-03-21
 */
import { IActionSinkConfig, IRxStandardProps, OpenViewActionType } from '@helix/platform/view/api';

export interface IRuntimeActionsDemoProperties extends IRxStandardProps {
  /** Optional instance label in the outline. */
  name: string;

  /**
   * Populated at runtime from the view model — `{ name, guid }` per registration `actionSinks`.
   */
  actionSinks?: IActionSinkConfig[];

  /** Legacy fallback when the Open view action chain is empty. */
  targetViewDefinitionName: string;
  /** Legacy fallback when the Launch process action chain is empty. */
  targetProcessDefinitionName: string;
  /** Legacy demo string for process input `message`. */
  demoMessage: string;
  /** Legacy presentation when not using action chain. */
  openViewPresentationType: OpenViewActionType | string;
  /** Legacy modal title. */
  openViewModalTitle: string;
  /** Legacy JSON viewParams. */
  openViewParamsJson: string;
}
