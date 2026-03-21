/**
 * @generated
 * @context Registers active cart standalone view with Innovation Studio palette.
 * @decisions NgModule imports include standalone VC classes for AOT/federation; availableInBundles matches other Helix Vibe Studio VCs.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { CartViewDesignComponent } from './design/cart-view-design.component';
import { CartViewDesignModel } from './design/cart-view-design.model';
import { CartViewComponent } from './runtime/cart-view.component';

/**
 * Standalone runtime + design components must be in `imports` so the federated bundle retains them
 * and `RxViewComponentRegistryService.register()` runs at load (avoids "Unknown component" in View Designer).
 */
@NgModule({
  imports: [CartViewComponent, CartViewDesignComponent]
})
export class CartViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-cart-view',
      name: 'Active cart (grouped)',
      group: 'Helix Vibe Studio',
      icon: 'shopping_cart',
      availableInBundles: ['com.amar.helix-vibe-studio'],
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
        { name: 'removeLineActionLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'cartTotalAmountLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'lineItemBillingLabel', localizable: true, enableExpressionEvaluation: true },
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
        { name: 'showCancelOrderButton', localizable: false, enableExpressionEvaluation: false },
        { name: 'cancelOrderLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'cancelOrderConfirmTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'cancelOrderConfirmMessage', localizable: true, enableExpressionEvaluation: true },
        { name: 'cancelledCartStatusValue', localizable: false, enableExpressionEvaluation: false },
        { name: 'maxQuantityPerLine', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
