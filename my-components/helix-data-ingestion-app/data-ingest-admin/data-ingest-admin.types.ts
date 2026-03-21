/**
 * @generated
 * @context DataIngest Admin standalone VC — platform mapping, template wizard, dashboards per dataingest-v2.html.
 * @decisions Minimal designer props; runtime uses internal state + mock data until record APIs wired.
 * @references cookbook/02-ui-view-components.md, my-components/helix-data-ingestion-app/CONTEXT.md
 * @modified 2026-03-21
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export interface IDataIngestAdminProperties extends IRxStandardProps {
  /** Optional instance label in the outline. */
  name: string;
}
