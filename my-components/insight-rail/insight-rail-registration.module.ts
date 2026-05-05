/**
 * @generated
 * @context Registers Insight rail VC; buttonActions sink; LaunchProcess for designer action chains (no legacy OpenView).
 * @decisions Dropped insightQueryExpression property registration — server qualification only from Records (expression).
 * @references cookbook/02-ui-view-components.md, my-components/catalog-view/catalog-view-registration.module.ts
 * @modified 2026-04-30; removed filterFieldKey / filterMatchValue registration.
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RX_VIEW_DEFINITION, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { LaunchProcessViewActionModule } from '@helix/platform/view/actions';
import { InsightRailDesignComponent } from './design/insight-rail-design.component';
import { InsightRailDesignModel } from './design/insight-rail-design.model';
import { InsightRailComponent } from './runtime/insight-rail.component';

@NgModule({
  imports: [LaunchProcessViewActionModule, InsightRailComponent, InsightRailDesignComponent]
})
export class InsightRailRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-insight-rail',
      name: 'Insight rail (data-quality)',
      group: 'Helix Vibe Studio',
      icon: 'view_carousel',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: InsightRailComponent,
      designComponent: InsightRailDesignComponent,
      designComponentModel: InsightRailDesignModel,
      isContainerComponent: true,
      outlets: [{ name: RX_VIEW_DEFINITION.defaultOutletName }],
      actionSinks: [{ name: 'buttonActions', label: 'Action button (actions)' }],
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'useBuiltInRecordQuery', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightPageSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightSelectedFieldIds', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightTitleFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightDescriptionFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightMetricFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightHeaderFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'sectionHeaderLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'metricLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'recordsViewInputParamName', localizable: false, enableExpressionEvaluation: false },
        { name: 'records', localizable: false, enableExpressionEvaluation: true },
        { name: 'buttonLabel', localizable: true, enableExpressionEvaluation: true },
        { name: 'insightActionRecord', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightActionRecordJson', localizable: false, enableExpressionEvaluation: false },
        { name: 'insightFieldValuesByFieldId', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
