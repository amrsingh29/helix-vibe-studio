/**
 * @generated
 * @context Registers Catalog view with Innovation Studio; palette name states card grid and table layouts; neutral type id com-example-sample-application-catalog-view.
 * @decisions Expression evaluation on records/fields/buttonLabel; picker + static facet JSON without expression to avoid invalid JSON in eval.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { CatalogViewDesignComponent } from './design/catalog-view-design.component';
import { CatalogViewDesignModel } from './design/catalog-view-design.model';
import { CatalogViewComponent } from './runtime/catalog-view.component';

@NgModule()
export class CatalogViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-example-sample-application-catalog-view',
      name: 'Catalog view (cards & table)',
      group: 'Reusable UI',
      icon: 'table',
      component: CatalogViewComponent,
      designComponent: CatalogViewDesignComponent,
      designComponentModel: CatalogViewDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'records', localizable: false, enableExpressionEvaluation: true },
        { name: 'fields', localizable: false, enableExpressionEvaluation: true },
        { name: 'buttonLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'initialView', localizable: false, enableExpressionEvaluation: false },
        { name: 'categoryFieldKey', localizable: false, enableExpressionEvaluation: false },
        { name: 'facetFieldKey', localizable: false, enableExpressionEvaluation: false },
        { name: 'facetOptionsJson', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
