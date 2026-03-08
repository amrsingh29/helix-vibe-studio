import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { PizzaOrderingDesignComponent } from './design/pizza-ordering-design.component';
import { PizzaOrderingDesignModel } from './design/pizza-ordering-design.model';
import { PizzaOrderingComponent } from './runtime/pizza-ordering.component';

@NgModule()
export class PizzaOrderingRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-example-sample-application-pizza-ordering',
      name: 'Pizza Ordering',
      group: 'SampleApplication',
      icon: 'wall',
      component: PizzaOrderingComponent,
      designComponent: PizzaOrderingDesignComponent,
      designComponentModel: PizzaOrderingDesignModel,
      properties: [
        {
          name: 'customerName',
          localizable: true,
          enableExpressionEvaluation: true
        },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
