/**
 * @generated
 * @context Registers Catalog view; actionSinks + outputs catalogActionRecord / catalogFieldValuesByFieldId for Launch process input expressions.
 * @decisions buttonActions sink + OpenView/LaunchProcess modules; legacy inspector fields when chain empty.
 * @references cookbook/02-ui-view-components.md, my-components/runtime-actions-demo/RUNTIME-ACTIONS-DEMO-ARCHITECTURE.md
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RX_VIEW_DEFINITION, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { LaunchProcessViewActionModule, OpenViewActionModule } from '@helix/platform/view/actions';
import { CatalogViewDesignComponent } from './design/catalog-view-design.component';
import { CatalogViewDesignModel } from './design/catalog-view-design.model';
import { CatalogViewComponent } from './runtime/catalog-view.component';

@NgModule({
  imports: [OpenViewActionModule, LaunchProcessViewActionModule]
})
export class CatalogViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-catalog-view',
      name: 'Catalog view (cards & table)',
      group: 'Helix Vibe Studio',
      icon: 'table',
      availableInBundles: ['com.amar.helix-vibe-studio'],
      component: CatalogViewComponent,
      designComponent: CatalogViewDesignComponent,
      designComponentModel: CatalogViewDesignModel,
      isContainerComponent: true,
      outlets: [{ name: RX_VIEW_DEFINITION.defaultOutletName }],
      actionSinks: [{ name: 'buttonActions', label: 'Action button (actions)' }],
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'useBuiltInRecordQuery', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogPageSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogQueryExpression', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogSelectedFieldIds', localizable: false, enableExpressionEvaluation: false },
        { name: 'cardTitleFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cardDescriptionFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cardBadgeFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cardPriceFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'cardCurrencyFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordsViewInputParamName', localizable: false, enableExpressionEvaluation: false },
        { name: 'records', localizable: false, enableExpressionEvaluation: true },
        { name: 'fieldsCsv', localizable: false, enableExpressionEvaluation: false },
        { name: 'fields', localizable: false, enableExpressionEvaluation: true },
        { name: 'buttonLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'initialView', localizable: false, enableExpressionEvaluation: false },
        { name: 'categoryFieldKey', localizable: false, enableExpressionEvaluation: false },
        { name: 'facetFieldKey', localizable: false, enableExpressionEvaluation: false },
        { name: 'facetOptionsJson', localizable: false, enableExpressionEvaluation: false },
        { name: 'targetViewDefinitionName', localizable: false, enableExpressionEvaluation: true },
        { name: 'openViewPresentationType', localizable: false, enableExpressionEvaluation: false },
        { name: 'openViewModalTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'viewParamFieldKeysCsv', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogActionRecord', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogActionRecordJson', localizable: false, enableExpressionEvaluation: false },
        { name: 'catalogFieldValuesByFieldId', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
