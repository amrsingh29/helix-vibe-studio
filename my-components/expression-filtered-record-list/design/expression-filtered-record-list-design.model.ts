/**
 * @generated
 * @context Inspector: RD picker, expression for records, text keys for fields, expression for match value (Status = Active pattern).
 * @decisions Warnings for empty records/match; expression picker for matchStatusValue so authors bind literals or record fields.
 * @references cookbook/02-ui-view-components.md, .cursor/_instructions/UI/ObjectTypes/StandaloneViewcomponent/standalone-view-component-design-time.md
 * @modified 2026-03-20
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IDefinitionPickerComponentOptions,
  IExpressionFormControlOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  TextFormControlComponent
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
import { IExpressionFilteredRecordListProperties } from '../expression-filtered-record-list.types';
import { IExpressionFilteredRecordListDesignProperties } from './expression-filtered-record-list-design.types';

const initialComponentProperties: IExpressionFilteredRecordListProperties = {
  name: '',
  recordDefinitionName: '',
  records: '',
  statusFieldKey: 'Status',
  matchStatusValue: '',
  titleFieldKey: 'Title'
};

export class ExpressionFilteredRecordListDesignModel extends ViewDesignerComponentModel<
  IExpressionFilteredRecordListProperties,
  IExpressionFilteredRecordListDesignProperties
> implements IViewDesignerComponentModel<
  IExpressionFilteredRecordListProperties,
  IExpressionFilteredRecordListDesignProperties
> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IExpressionFilteredRecordListDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IExpressionFilteredRecordListDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(
    currentProperties?: IExpressionFilteredRecordListProperties
  ): IExpressionFilteredRecordListDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Records', expression: this.getExpressionForProperty('records') },
      { label: 'Match status value', expression: this.getExpressionForProperty('matchStatusValue') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'Records', expression: this.getExpressionForProperty('records') },
        { label: 'Match status value', expression: this.getExpressionForProperty('matchStatusValue') }
      ]
    };
  }

  private setInspectorConfig(_model: IExpressionFilteredRecordListProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'Data',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label in the view outline.')
              }
            },
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip(
                  'Pick the record definition this list relates to (documentation). Rows still come from the Records expression.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'records',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Records',
                tooltip: new Tooltip(
                  'Expression that evaluates to an array of objects (e.g. all rows from a DataPage query).'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: true
              } as IExpressionFormControlOptions
            },
            {
              name: 'titleFieldKey',
              component: TextFormControlComponent,
              options: {
                label: 'Title field key',
                tooltip: new Tooltip('Property name on each row for the primary label (e.g. Title, name).')
              }
            },
            {
              name: 'statusFieldKey',
              component: TextFormControlComponent,
              options: {
                label: 'Status field key',
                tooltip: new Tooltip(
                  'Property name on each row to filter (e.g. Status). Must match keys in your record data.'
                )
              }
            },
            {
              name: 'matchStatusValue',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Match status value',
                tooltip: new Tooltip(
                  "Expression for the value rows must have on the status field — e.g. literal 'Active' or a field from the current record."
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            }
          ]
        },
        ...getStandardPropsInspectorConfigs()
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<IExpressionFilteredRecordListDesignProperties>,
    model: IExpressionFilteredRecordListDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    if (!model.recordDefinitionName?.trim()) {
      validationIssues.push(
        sandbox.createWarning(
          'Select a record definition so designers know which schema this list targets.',
          'recordDefinitionName'
        )
      );
    }

    const recordsEmpty =
      model.records === '' ||
      model.records === null ||
      model.records === undefined ||
      (typeof model.records === 'string' && !(model.records as string).trim());

    if (recordsEmpty) {
      validationIssues.push(sandbox.createWarning('Bind Records to a query or array expression.', 'records'));
    }

    if (!model.statusFieldKey?.trim()) {
      validationIssues.push(
        sandbox.createWarning('Set Status field key (e.g. Status) to match your row objects.', 'statusFieldKey')
      );
    }

    validationIssues.push(...validateStandardProps(model));
    return validationIssues;
  }
}
