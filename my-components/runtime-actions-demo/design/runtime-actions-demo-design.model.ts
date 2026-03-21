/**
 * @generated
 * @context Inspector: ActionSinkWidget per sink (no `name` on control — form widget path, not CVA/writeValue) + legacy sections.
 * @decisions actionSinks + sandbox.getActionsInspectorConfig() splits sink controls into three sections (no non-exported ActionSinkWidget import).
 * @references cookbook/02-ui-view-components.md, helix FormBuilderComponent.isFormControl (name => form control vs widget)
 * @modified 2026-03-21
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IExpressionFormControlOptions,
  ISelectFormControlOptions,
  SelectFormControlComponent,
  TextFormControlComponent
} from '@helix/platform/shared/components';
import { IViewDesignerComponentModel, OpenViewActionType, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
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
import { IRuntimeActionsDemoProperties } from '../runtime-actions-demo.types';
import { IRuntimeActionsDemoDesignProperties } from './runtime-actions-demo-design.types';

const OPEN_VIEW_PRESENTATION_OPTIONS: { id: string; name: string }[] = [
  { id: OpenViewActionType.FullWidth, name: 'Full width' },
  { id: OpenViewActionType.CenteredModal, name: 'Centered modal' },
  { id: OpenViewActionType.DockedLeftModal, name: 'Docked left modal' },
  { id: OpenViewActionType.DockedRightModal, name: 'Docked right modal' }
];

const initialComponentProperties: IRuntimeActionsDemoProperties = {
  name: '',
  targetViewDefinitionName: '',
  targetProcessDefinitionName: '',
  demoMessage: 'Hello from runtime-actions-demo',
  openViewPresentationType: OpenViewActionType.CenteredModal,
  openViewModalTitle: '',
  openViewParamsJson: ''
};

export class RuntimeActionsDemoDesignModel extends ViewDesignerComponentModel<
  IRuntimeActionsDemoProperties,
  IRuntimeActionsDemoDesignProperties
> implements IViewDesignerComponentModel<IRuntimeActionsDemoProperties, IRuntimeActionsDemoDesignProperties> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IRuntimeActionsDemoDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IRuntimeActionsDemoDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: IRuntimeActionsDemoProperties): IRuntimeActionsDemoDesignProperties {
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
      children: [{ label: 'Hidden', expression: this.getExpressionForProperty('hidden') }]
    };
  }

  private setInspectorConfig(_model: IRuntimeActionsDemoProperties) {
    // Same ActionSink controls as palette Button — built from descriptor.actionSinks (no deep import of ActionSinkWidget).
    const sinkControls = this.sandbox.getActionsInspectorConfig().controls;

    return {
      inspectorSectionConfigs: [
        {
          label: 'Open view button (actions)',
          controls: sinkControls[0] ? [sinkControls[0]] : []
        },
        {
          label: 'Launch process button (actions)',
          controls: sinkControls[1] ? [sinkControls[1]] : []
        },
        {
          label: 'Notification button (actions)',
          controls: sinkControls[2] ? [sinkControls[2]] : []
        },
        {
          label: 'Legacy — Open view (no action chain)',
          controls: [
            {
              name: 'targetViewDefinitionName',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Target view definition name',
                tooltip: new Tooltip(
                  'Used only when **Open view** action chain (above) is empty. Fully qualified view: `<bundleId>:<ViewDefinitionName>`.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'openViewPresentationType',
              component: SelectFormControlComponent,
              options: {
                label: 'Presentation',
                tooltip: new Tooltip('Legacy: used when no action chain is configured.'),
                sortAlphabetically: false,
                options: OPEN_VIEW_PRESENTATION_OPTIONS
              } as ISelectFormControlOptions
            },
            {
              name: 'openViewModalTitle',
              component: TextFormControlComponent,
              options: {
                label: 'Panel title (optional)',
                tooltip: new Tooltip('Legacy modal / docked title.')
              }
            },
            {
              name: 'openViewParamsJson',
              component: TextFormControlComponent,
              options: {
                label: 'View params (JSON object, optional)',
                tooltip: new Tooltip('Legacy JSON for `viewParams`.')
              }
            }
          ]
        },
        {
          label: 'Legacy — Launch process (no action chain)',
          controls: [
            {
              name: 'targetProcessDefinitionName',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Target process definition name',
                tooltip: new Tooltip(
                  'Used only when **Launch process** action chain (above) is empty. Format `<bundleId>:<ProcessName>`; demo input **`message**`.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'demoMessage',
              component: TextFormControlComponent,
              options: {
                label: 'Demo message (process input `message`)',
                tooltip: new Tooltip('Legacy: passed as **`message`** when using direct launch above.')
              }
            }
          ]
        },
        {
          label: 'Demo',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label for this component instance in the outline.')
              }
            },
            ...getStandardPropsInspectorConfigs()
          ]
        }
      ]
    };
  }

  private validate(
    _sandbox: IViewComponentDesignSandbox<IRuntimeActionsDemoDesignProperties>,
    model: IRuntimeActionsDemoDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    return validateStandardProps(model);
  }
}
