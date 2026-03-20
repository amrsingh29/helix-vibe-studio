/**
 * @generated
 * @context Inspector: record definition picker (no hard-coded bundle), expressions for records/fields, optional facet JSON and category key.
 * @decisions Warnings (not errors) for missing RD/expressions so views stay saveable during iteration; facet options as JSON text for flexibility across record defs.
 * @references cookbook/02-ui-view-components.md, docs/request-view-component-with-record-definition.md, .cursor/_instructions/UI/ObjectTypes/StandaloneViewcomponent/standalone-view-component-design-time.md
 * @modified 2026-03-20
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IDefinitionPickerComponentOptions,
  IExpressionFormControlOptions,
  ISelectFormControlOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  SelectFormControlComponent,
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
import {
  IViewComponentDesignSettablePropertiesDataDictionary
} from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
import { takeUntil } from 'rxjs/operators';
import { ICatalogViewProperties } from '../catalog-view.types';
import { ICatalogViewDesignProperties } from './catalog-view-design.types';

const initialComponentProperties: ICatalogViewProperties = {
  name: '',
  recordDefinitionName: '',
  records: '',
  fields: '',
  buttonLabel: 'Add to order',
  initialView: 'card',
  facetFieldKey: '',
  facetOptionsJson: '[]',
  categoryFieldKey: ''
};

export class CatalogViewDesignModel extends ViewDesignerComponentModel<
  ICatalogViewProperties,
  ICatalogViewDesignProperties
> implements IViewDesignerComponentModel<ICatalogViewProperties, ICatalogViewDesignProperties> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<ICatalogViewDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: ICatalogViewDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: ICatalogViewProperties): ICatalogViewDesignProperties {
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
      { label: 'Fields', expression: this.getExpressionForProperty('fields') },
      { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'Records', expression: this.getExpressionForProperty('records') },
        { label: 'Fields', expression: this.getExpressionForProperty('fields') },
        { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') }
      ]
    };
  }

  private setInspectorConfig(_model: ICatalogViewProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'Catalog data',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label for this component instance in the outline.')
              }
            },
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip(
                  'Pick any record definition from the environment. Bind rows via the Records expression — no runtime coupling to this bundle.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'records',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Records',
                tooltip: new Tooltip(
                  'Expression evaluating to an array of records (objects). Keys should match field names you list in Fields.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: true
              } as IExpressionFormControlOptions
            },
            {
              name: 'fields',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Fields',
                tooltip: new Tooltip(
                  'Expression evaluating to an ordered string array, e.g. ["category","name","description","billing_cycle_type","base_price"].'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: true
              } as IExpressionFormControlOptions
            },
            {
              name: 'buttonLabel',
              component: TextFormControlComponent,
              options: {
                label: 'Action button label',
                tooltip: new Tooltip('Shown on each card and row (e.g. Add to order).')
              }
            },
            {
              name: 'initialView',
              component: SelectFormControlComponent,
              options: {
                label: 'Initial view',
                sortAlphabetically: false,
                options: [
                  { id: 'card', name: 'Card grid' },
                  { id: 'table', name: 'Table' }
                ]
              } as ISelectFormControlOptions
            }
          ]
        },
        {
          label: 'Filters',
          controls: [
            {
              name: 'categoryFieldKey',
              component: TextFormControlComponent,
              options: {
                label: 'Category field key',
                tooltip: new Tooltip(
                  'When this key exists in Fields, a left rail filters by distinct values. Leave blank to use "category" if that key is present.'
                )
              }
            },
            {
              name: 'facetFieldKey',
              component: TextFormControlComponent,
              options: {
                label: 'Facet field key',
                tooltip: new Tooltip(
                  'Optional. When set and listed in Fields, shows pill filters. Example: billing_cycle_type'
                )
              }
            },
            {
              name: 'facetOptionsJson',
              component: TextFormControlComponent,
              options: {
                label: 'Facet options (JSON array)',
                tooltip: new Tooltip(
                  'JSON string array of allowed values, e.g. ["ONE_OFF","MONTHLY","QUARTERLY","YEARLY"]. Leave [] when no facet.'
                )
              }
            }
          ]
        },
        ...getStandardPropsInspectorConfigs()
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<ICatalogViewDesignProperties>,
    model: ICatalogViewDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    if (!model.recordDefinitionName?.trim()) {
      validationIssues.push(
        sandbox.createWarning(
          'Select a record definition so designers know which schema this catalog is bound to.',
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
      validationIssues.push(sandbox.createWarning('Bind Records to a datapage or array expression.', 'records'));
    }

    const fieldsEmpty =
      model.fields === '' ||
      model.fields === null ||
      model.fields === undefined ||
      (typeof model.fields === 'string' && !(model.fields as string).trim());

    if (fieldsEmpty) {
      validationIssues.push(sandbox.createWarning('Bind Fields to an expression that resolves to a string array.', 'fields'));
    }

    validationIssues.push(...validateStandardProps(model));
    return validationIssues;
  }
}
