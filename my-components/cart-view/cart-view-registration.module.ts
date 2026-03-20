/**
 * @generated
 * @context Registers active cart standalone view with Innovation Studio palette.
 * @decisions No expression evaluation on pickers and field id strings; localizable titles/messages only where needed.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-20
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { CartViewDesignComponent } from './design/cart-view-design.component';
import { CartViewDesignModel } from './design/cart-view-design.model';
import { CartViewComponent } from './runtime/cart-view.component';

@NgModule()
export class CartViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-example-sample-application-cart-view',
      name: 'Active cart (grouped)',
      group: 'Reusable UI',
      icon: 'shopping_cart',
      component: CartViewComponent,
      designComponent: CartViewDesignComponent,
      designComponentModel: CartViewDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'pageTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'emptyStateMessage', localizable: true, enableExpressionEvaluation: true },
        { name: 'noActiveCartMessage', localizable: true, enableExpressionEvaluation: true },
        { name: 'orderNotesLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'submitOrderLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'removeConfirmTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'removeConfirmMessage', localizable: true, enableExpressionEvaluation: true },
        { name: 'cartRecordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemRecordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'custodianFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartStatusFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'activeCartStatusValue', localizable: false, enableExpressionEvaluation: false },
        { name: 'activeCartStatusExpression', localizable: false, enableExpressionEvaluation: true },
        { name: 'custodianFilterExpression', localizable: false, enableExpressionEvaluation: true },
        { name: 'custodianMatchSource', localizable: false, enableExpressionEvaluation: false },
        { name: 'restrictCartToCurrentUser', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartNotesFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartCurrencyFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'defaultCurrencyCode', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemCartFkFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemQuantityFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemProductNameFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemBasePriceFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemUnitPriceFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemTotalCostFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cartItemBillingCadenceFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'billingCadenceOrderJson', localizable: false, enableExpressionEvaluation: false },
        { name: 'showSubmitButton', localizable: false, enableExpressionEvaluation: false },
        { name: 'submittedCartStatusValue', localizable: false, enableExpressionEvaluation: false },
        { name: 'maxQuantityPerLine', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
