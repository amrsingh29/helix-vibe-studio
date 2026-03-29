/**
 * @generated
 * @context Inspector for Date/Time Formatter: expression for ISO date, format dropdown, typography, badge mode.
 * @decisions ExpressionFormControl for dateTimeValue; ColorPickerFormControl for text and badge colors; free-form fontSize.
 * @references cookbook/02-ui-view-components.md, .cursor/_instructions/UI/ObjectTypes/ViewAction/view-action.md
 * @modified 2026-03-22
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ColorPickerFormControlComponent,
  ExpressionFormControlComponent,
  IColorPickerFormControlOptions,
  IExpressionFormControlOptions,
  ISelectFormControlOptions,
  ISwitcherFormControlOptions,
  SelectFormControlComponent,
  SwitchFormControlComponent,
  TextFormControlComponent
} from '@helix/platform/shared/components';
import { IViewDesignerComponentModel, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
import {
  getStandardPropsInspectorConfigs,
  IViewComponentDesignSandbox,
  IViewComponentDesignValidationIssue,
  validateStandardProps,
  ViewDesignerComponentModel
} from '@helix/platform/view/designer';
import { IViewComponentDesignSettablePropertiesDataDictionary } from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
import { map, startWith, takeUntil } from 'rxjs/operators';
import type { DateTimeFormatKey } from '../date-time-formatter.types';
import { formatDateTime, parseFontSize } from '../date-time-formatter-formatter.util';
import type { IDateTimeFormatterProperties } from '../date-time-formatter.types';
import type { IDateTimeFormatterDesignProperties } from './date-time-formatter-design.types';

const FORMAT_OPTIONS: { id: DateTimeFormatKey; name: string }[] = [
  { id: 'shortMonthDayYear', name: 'Mar 29, 2024' },
  { id: 'longMonthDayYear', name: 'March 29, 2024' },
  { id: 'dayShortMonthYear', name: '29 Mar 2024' },
  { id: 'usShort', name: '03/29/2024' },
  { id: 'euShort', name: '29/03/2024' },
  { id: 'isoDate', name: '2024-03-29' },
  { id: 'shortWithTime', name: 'Mar 29, 2024, 3:38 PM' },
  { id: 'relative', name: 'Relative (e.g. 2 days ago)' }
];

const initialComponentProperties: IDateTimeFormatterProperties = {
  name: '',
  dateTimeValue: '',
  format: 'shortMonthDayYear',
  fontSize: '14',
  textColor: '#22272A',
  badgeMode: false,
  badgeBackgroundColor: '#e0e5eb'
};

export interface IPreviewState {
  formatted: string;
  fontSize: number;
  textColor: string;
  badgeMode: boolean;
  badgeBackgroundColor: string;
}

export class DateTimeFormatterDesignModel extends ViewDesignerComponentModel<
  IDateTimeFormatterProperties,
  IDateTimeFormatterDesignProperties
> implements IViewDesignerComponentModel<IDateTimeFormatterProperties, IDateTimeFormatterDesignProperties> {
  /** Observable of preview state for design component live preview */
  preview$ = this.sandbox.componentProperties$.pipe(
    map((props) => this.buildPreview(props)),
    startWith(this.buildPreview(initialComponentProperties)),
    takeUntil(this.sandbox.destroyed$)
  );

  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IDateTimeFormatterDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
    });
  }

  static getInitialProperties(
    currentProperties?: IDateTimeFormatterProperties
  ): IDateTimeFormatterDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  buildPreview(props: IDateTimeFormatterDesignProperties): IPreviewState {
    const sampleIso = '2026-03-22T03:38:09.000Z';
    const hasValue = props?.dateTimeValue != null && String(props.dateTimeValue).trim() !== '';
    const valueToFormat = hasValue ? props.dateTimeValue : sampleIso;
    const formatted = formatDateTime(valueToFormat, props?.format ?? 'shortMonthDayYear');
    return {
      formatted,
      fontSize: parseFontSize(props?.fontSize),
      textColor: (props?.textColor ?? '#22272A').trim() || '#22272A',
      badgeMode: Boolean(props?.badgeMode),
      badgeBackgroundColor: (props?.badgeBackgroundColor ?? '#e0e5eb').trim() || '#e0e5eb'
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Date/time value', expression: this.getExpressionForProperty('dateTimeValue') }
    ];
  }

  private setInspectorConfig(_model: IDateTimeFormatterProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'General',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: { label: 'Name', tooltip: new Tooltip('Component instance name in the view outline.') }
            },
            {
              name: 'dateTimeValue',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Date/time value',
                tooltip: new Tooltip(
                  'Expression that evaluates to an ISO date-time string (e.g. 2026-03-22T03:38:09.000Z) or epoch milliseconds. Bind to a field or variable.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'format',
              component: SelectFormControlComponent,
              options: {
                label: 'Format',
                tooltip: new Tooltip('Display format for the date/time.'),
                options: FORMAT_OPTIONS,
                sortAlphabetically: false
              } as ISelectFormControlOptions
            }
          ]
        },
        {
          label: 'Typography',
          controls: [
            {
              name: 'fontSize',
              component: TextFormControlComponent,
              options: {
                label: 'Font size (px)',
                tooltip: new Tooltip('Pixel value for font size, e.g. 10, 14, 30.')
              }
            },
            {
              name: 'textColor',
              component: ColorPickerFormControlComponent,
              options: {
                label: 'Text color',
                tooltip: new Tooltip('Color of the formatted date/time text.')
              } as IColorPickerFormControlOptions
            }
          ]
        },
        {
          label: 'Badge',
          controls: [
            {
              name: 'badgeMode',
              component: SwitchFormControlComponent,
              options: {
                label: 'Badge mode',
                tooltip: new Tooltip('When on, display the date in a pill/badge style with background color.')
              } as ISwitcherFormControlOptions
            },
            {
              name: 'badgeBackgroundColor',
              component: ColorPickerFormControlComponent,
              options: {
                label: 'Badge background color',
                tooltip: new Tooltip('Background color of the badge (applies when Badge mode is on).')
              } as IColorPickerFormControlOptions
            }
          ]
        },
        {
          label: 'Standard',
          controls: [...getStandardPropsInspectorConfigs()]
        }
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<IDateTimeFormatterDesignProperties>,
    model: IDateTimeFormatterDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const issues: IViewComponentDesignValidationIssue[] = [];
    const fs = parseFontSize(model?.fontSize);
    if (fs < 8 || fs > 72) {
      issues.push(
        sandbox.createWarning('Font size should be between 8 and 72 px.', 'fontSize')
      );
    }
    issues.push(...validateStandardProps(model));
    return issues;
  }
}
