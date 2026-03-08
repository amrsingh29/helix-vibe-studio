import { Injector } from '@angular/core';
import { ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
import {
  IViewActionDesignPropertyEditorConfig,
  IViewActionDesignSandbox,
  IViewActionOutputDataDictionary,
  ViewActionDesignEditableProperties
} from '@helix/platform/view/api';
import { RxViewDesignerActionModel } from '@helix/platform/view/designer';
import { ICalculateVatActionDesignProperties } from './calculate-vat-action-design.types';

export class CalculateVatActionDesignModel extends RxViewDesignerActionModel {
  // This method is called when a new, or an existing view action is initialized in the view designer.
  // It returns values for all input parameters of the view action.
  static getInitialProperties(currentInputParams: ViewActionDesignEditableProperties<ICalculateVatActionDesignProperties>) {
    return {
      // initial values for custom input parameters
      price: 0,
      vatRate: 0,
      // input parameter values of an existing view action that are already saved in the view
      ...currentInputParams
    };
  }

  constructor(protected injector: Injector,
              readonly sandbox: IViewActionDesignSandbox<ICalculateVatActionDesignProperties>) {
    super(injector, sandbox);

    // Configure view action input parameter editor.
    this.sandbox.setActionPropertyEditorConfig(this.getActionEditorConfig());

    // Add view action output parameters to the expression builder data dictionary.
    this.sandbox.setActionOutputDataDictionary(this.getActionOutputDataDictionary());
  }

  private getActionEditorConfig(): IViewActionDesignPropertyEditorConfig {
    return [
      {
        name: 'price',
        component: ExpressionFormControlComponent,
        options: {
          label: 'Price',
          isRequired: true,
          dataDictionary$: this.expressionConfigurator.getDataDictionary(),
          operators: this.expressionConfigurator.getOperators()
        } as IExpressionFormControlOptions
      },
      {
        name: 'vatRate',
        component: ExpressionFormControlComponent,
        options: {
          label: 'Vat Rate',
          isRequired: true,
          dataDictionary$: this.expressionConfigurator.getDataDictionary(),
          operators: this.expressionConfigurator.getOperators()
        } as IExpressionFormControlOptions
      }
    ];
  }

  private getActionOutputDataDictionary(): IViewActionOutputDataDictionary {
    // One output parameter named 'fullPrice' that will be used in the expression builder of other view action input parameters or component properties.
    return [
      {
        label: 'Full Price',
        expression: this.getOutputExpressionForPropertyPath('fullPrice')
      }
    ];
  }
}
