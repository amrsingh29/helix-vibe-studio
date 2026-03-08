import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IExpressionFormControlOptions,
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
import { IPizzaOrderingProperties } from '../pizza-ordering.types';
import { IPizzaOrderingDesignProperties } from './pizza-ordering-design.types';

const initialComponentProperties: IPizzaOrderingProperties = {
  name: '',
  customerName: ''
};

export class PizzaOrderingDesignModel extends ViewDesignerComponentModel<IPizzaOrderingProperties, IPizzaOrderingDesignProperties> implements IViewDesignerComponentModel<IPizzaOrderingProperties, IPizzaOrderingDesignProperties> {
  constructor(protected injector: Injector,
              protected sandbox: IViewComponentDesignSandbox<IPizzaOrderingDesignProperties>) {
    super(injector, sandbox);

    // Configure view component property inspector.
    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    // Validate view component properties.
    // Note that the standard view component properties should also be validated.
    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IPizzaOrderingDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;

      // Add settable view component properties to the expression builder data dictionary.
      // These properties can be set via the Set property view action.
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());

      // Add view component properties to the expression builder data dictionary.
      // The values of these properties can be used when building expressions.
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  // This method is called when a new, or an existing view component is initialized in the view designer.
  // It returns values for all properties of the view component.
  static getInitialProperties(currentProperties?: IPizzaOrderingProperties): IPizzaOrderingDesignProperties {
    return {
      // initial values for custom properties
      name: '',
      customerName: '',
      // initial values for the standard properties available for all view components
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      // property values of an existing view component that are already saved in the view
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      {
        label: 'Hidden',
        expression: this.getExpressionForProperty('hidden')
      },
      {
        label: 'Customer Name',
        expression: this.getExpressionForProperty('customerName')
      }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        {
          label: 'Customer Name',
          expression: this.getExpressionForProperty('customerName')
        }
      ]
    };
  }

  private setInspectorConfig(model: IPizzaOrderingProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'General',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Enter a name to uniquely identify this view component.')
              }
            },
            {
              name: 'customerName',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Customer Name',
                tooltip: new Tooltip('The Customer Name is a required property whose value will be displayed at runtime.'),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: true
              } as IExpressionFormControlOptions
            },
            // Add standard properties available for most view components, such as
            // Hidden, Available on devices, CSS classes.
            ...getStandardPropsInspectorConfigs()
          ]
        }
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<IPizzaOrderingDesignProperties>,
    model: IPizzaOrderingDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    if (!model.customerName) {
      validationIssues.push(sandbox.createError('Message cannot be blank.', 'message'));
    }

    // Validate standard properties.
    validationIssues.push(...validateStandardProps(model));

    return validationIssues;
  }
}
