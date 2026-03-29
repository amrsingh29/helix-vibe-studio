/**
 * @generated
 * @context Inspector for configurable-chart — RD picker, chart kind, field ids, query, page size.
 * @decisions Text controls for numeric field ids (phase 1); validation for required strings.
 * @references cookbook/02-ui-view-components.md, expression-filtered-record-list design model
 * @modified 2026-03-24
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  IDefinitionPickerComponentOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  SelectFormControlComponent,
  TextFormControlComponent,
  ISelectFormControlOptions
} from '@helix/platform/shared/components';
import { IViewDesignerComponentModel, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
import {
  getStandardPropsInspectorConfigs,
  IViewComponentDesignCommonDataDictionaryBranch,
  IViewComponentDesignSandbox,
  IViewComponentDesignValidationIssue,
  validateStandardProps,
  ViewDesignerComponentModel
} from '@helix/platform/view/designer';
import { IViewComponentDesignSettablePropertiesDataDictionary } from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
import { takeUntil } from 'rxjs/operators';
import { IConfigurableChartProperties } from '../configurable-chart.types';
import { IConfigurableChartDesignProperties } from './configurable-chart-design.types';

const CHART_KIND_OPTIONS: { id: string; name: string }[] = [
  { id: 'line', name: 'Line' },
  { id: 'bar', name: 'Bar (horizontal)' },
  { id: 'column', name: 'Column (vertical)' },
  { id: 'pie', name: 'Pie' },
  { id: 'donut', name: 'Donut' }
];

const initialComponentProperties: IConfigurableChartProperties = {
  name: '',
  chartTitle: '',
  chartKind: 'bar',
  recordDefinitionName: '',
  chartQueryExpression: '',
  chartPageSize: '-1',
  categoryFieldId: '',
  valueFieldId: '',
  chartHeight: '400'
};

export class ConfigurableChartDesignModel extends ViewDesignerComponentModel<
  IConfigurableChartProperties,
  IConfigurableChartDesignProperties
> implements IViewDesignerComponentModel<
  IConfigurableChartProperties,
  IConfigurableChartDesignProperties
> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IConfigurableChartDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IConfigurableChartDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(
    currentProperties?: IConfigurableChartProperties
  ): IConfigurableChartDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [{ label: 'Hidden', expression: this.getExpressionForProperty('hidden') }];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: []
    };
  }

  private setInspectorConfig(_model: IConfigurableChartProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'Chart',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Label in the view outline.')
              }
            },
            {
              name: 'chartTitle',
              component: TextFormControlComponent,
              options: {
                label: 'Chart title (optional)',
                tooltip: new Tooltip('Shown in the chart header when set.')
              }
            },
            {
              name: 'chartKind',
              component: SelectFormControlComponent,
              options: {
                label: 'Chart kind',
                tooltip: new Tooltip('Visualization type (Adapt line, stacked bar/column, pie, donut).'),
                sortAlphabetically: false,
                options: CHART_KIND_OPTIONS
              } as ISelectFormControlOptions
            },
            {
              name: 'chartHeight',
              component: TextFormControlComponent,
              options: {
                label: 'Height (px)',
                tooltip: new Tooltip('Chart height in pixels.')
              }
            }
          ]
        },
        {
          label: 'Data',
          controls: [
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip('Source record definition for the Data Page query.')
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'chartPageSize',
              component: TextFormControlComponent,
              options: {
                label: 'Page size',
                tooltip: new Tooltip('Data Page page size (-1 = platform default for all matching rows).')
              }
            },
            {
              name: 'chartQueryExpression',
              component: TextFormControlComponent,
              options: {
                label: 'Query expression (optional)',
                tooltip: new Tooltip('Optional AR qualification, e.g. \'7\' = "0".')
              }
            },
            {
              name: 'categoryFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Category field id',
                tooltip: new Tooltip('Numeric field id used as category / X labels (same as Record grid field pickers).')
              }
            },
            {
              name: 'valueFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Value field id',
                tooltip: new Tooltip('Numeric field id to sum per category.')
              }
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
    sandbox: IViewComponentDesignSandbox<IConfigurableChartDesignProperties>,
    properties: IConfigurableChartDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];
    const rd = (properties.recordDefinitionName ?? '').trim();
    if (!rd) {
      validationIssues.push(
        sandbox.createError('Select a record definition.', 'recordDefinitionName')
      );
    }
    if (!(properties.categoryFieldId ?? '').trim()) {
      validationIssues.push(sandbox.createError('Enter category field id.', 'categoryFieldId'));
    }
    if (!(properties.valueFieldId ?? '').trim()) {
      validationIssues.push(sandbox.createError('Enter value field id.', 'valueFieldId'));
    }
    validationIssues.push(...validateStandardProps(properties));
    return validationIssues;
  }
}
