/**
 * @generated
 * @context Date/Time Formatter standalone view: expression-bound ISO date, format presets, typography, badge mode.
 * @decisions Format keys map to Intl/relative formatters; fontSize free-form px; badge uses background color picker.
 * @references cookbook/02-ui-view-components.md, cookbook/05-adapt-components.md
 * @modified 2026-03-22
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export type DateTimeFormatKey =
  | 'shortMonthDayYear'
  | 'longMonthDayYear'
  | 'dayShortMonthYear'
  | 'usShort'
  | 'euShort'
  | 'isoDate'
  | 'shortWithTime'
  | 'relative';

export interface IDateTimeFormatterProperties extends IRxStandardProps {
  name: string;
  /** Expression that evaluates to ISO date-time string (e.g. 2026-03-22T03:38:09.000Z) or epoch ms */
  dateTimeValue: unknown;
  format: DateTimeFormatKey;
  /** Font size in px (free-form, e.g. 10, 14, 30) */
  fontSize: string;
  textColor: string;
  badgeMode: boolean;
  badgeBackgroundColor: string;
}
