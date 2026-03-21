/**
 * @generated
 * @context Inspector: Name + standard props for DataIngest Admin VC.
 * @decisions Minimal section; no record wiring until DataPage integration.
 * @references cookbook/02-ui-view-components.md
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
import { IDataIngestAdminProperties } from '../data-ingest-admin.types';
import { IDataIngestAdminDesignProperties } from './data-ingest-admin-design.types';

const initialComponentProperties: IDataIngestAdminProperties = {
  name: ''
};

export class DataIngestAdminDesignModel extends ViewDesignerComponentModel<
  IDataIngestAdminProperties,
  IDataIngestAdminDesignProperties
> implements IViewDesignerComponentModel<IDataIngestAdminProperties, IDataIngestAdminDesignProperties> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IDataIngestAdminDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IDataIngestAdminDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: IDataIngestAdminProperties): IDataIngestAdminDesignProperties {
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

  private setInspectorConfig(_model: IDataIngestAdminProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'DataIngest Admin',
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
    _sandbox: IViewComponentDesignSandbox<IDataIngestAdminDesignProperties>,
    model: IDataIngestAdminDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    return validateStandardProps(model);
  }
}
