/**
 * @generated
 * @context Inspector: Name + standard props for DataIngest User VC.
 * @modified 2026-03-21
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import { TextFormControlComponent } from '@helix/platform/shared/components';
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
import { IDataIngestUserProperties } from '../data-ingest-user.types';
import { IDataIngestUserDesignProperties } from './data-ingest-user-design.types';

const initialComponentProperties: IDataIngestUserProperties = {
  name: ''
};

export class DataIngestUserDesignModel extends ViewDesignerComponentModel<
  IDataIngestUserProperties,
  IDataIngestUserDesignProperties
> implements IViewDesignerComponentModel<IDataIngestUserProperties, IDataIngestUserDesignProperties> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IDataIngestUserDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IDataIngestUserDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: IDataIngestUserProperties): IDataIngestUserDesignProperties {
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

  private setInspectorConfig(_model: IDataIngestUserProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'DataIngest User',
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
    _sandbox: IViewComponentDesignSandbox<IDataIngestUserDesignProperties>,
    model: IDataIngestUserDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    return validateStandardProps(model);
  }
}
