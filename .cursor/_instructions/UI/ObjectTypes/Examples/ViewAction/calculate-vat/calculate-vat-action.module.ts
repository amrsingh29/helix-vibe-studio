import { NgModule } from '@angular/core';
import { RxViewActionRegistryService } from '@helix/platform/view/api';
import { CalculateVatActionDesignManagerService } from './calculate-vat-action-design-manager.service';
import { CalculateVatActionDesignModel } from './calculate-vat-action-design-model.class';
import { CalculateVatActionService } from './calculate-vat-action.service';

@NgModule({
  providers: [CalculateVatActionService, CalculateVatActionDesignManagerService]
})
export class CalculateVatActionModule {
  constructor(
    rxViewActionRegistryService: RxViewActionRegistryService,
    calculateVatActionService: CalculateVatActionService,
    calculateVatActionDesignManagerService: CalculateVatActionDesignManagerService
  ) {
    rxViewActionRegistryService.register({
      name: 'comExampleSampleApplicationCalculateVat',
      label: 'Calculate Vat',
      // a service that will execute the view action at runtime
      service: calculateVatActionService,
      // the design manager service responsible for view action parameter validation at design time
      designManager: calculateVatActionDesignManagerService,
      // the design model class responsible for the design time behavior of the view action
      designModel: CalculateVatActionDesignModel,
      // the list of view action input parameters
      parameters: [
        {
          name: 'price',
          label: 'Price',
          isRequired: true,
          enableExpressionEvaluation: true
        },
        {
          name: 'vatRate',
          label: 'Vat Rate',
          isRequired: true,
          enableExpressionEvaluation: true
        }
      ]
    });
  }
}
