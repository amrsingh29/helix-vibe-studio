/**
 * @generated
 * @context Registers Org chart view VC in Helix Vibe Studio palette; chartDataJson + event outputs in properties.
 * @decisions NgModule imports standalone runtime + design components; availableInBundles matches other VCs.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-29
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { OrgChartViewDesignComponent } from './design/org-chart-view-design.component';
import { OrgChartViewDesignModel } from './design/org-chart-view-design.model';
import { OrgChartViewComponent } from './runtime/org-chart-view.component';

@NgModule({
  imports: [OrgChartViewComponent, OrgChartViewDesignComponent]
})
export class OrgChartViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-org-chart-view',
      name: 'Org chart',
      group: 'Helix Vibe Studio',
      icon: 'account_tree',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: OrgChartViewComponent,
      designComponent: OrgChartViewDesignComponent,
      designComponentModel: OrgChartViewDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'chartJsonFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordInstanceId', localizable: true, enableExpressionEvaluation: true },
        { name: 'chartDataQueryExpression', localizable: false, enableExpressionEvaluation: true },
        { name: 'chartDataPageSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'chartDataJson', localizable: false, enableExpressionEvaluation: true },
        { name: 'onNodeClick', localizable: false, enableExpressionEvaluation: false },
        { name: 'onExpand', localizable: false, enableExpressionEvaluation: false },
        { name: 'onCollapse', localizable: false, enableExpressionEvaluation: false },
        { name: 'onSearch', localizable: false, enableExpressionEvaluation: false },
        { name: 'onContextAction', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
