/**
 * @generated
 * @context Registers configurable-chart in group Dashboard for helix-vibe-studio, hssb, and optional dashboard bundle.
 * @decisions NgModule imports standalone runtime + design components; availableInBundles includes helix-vibe-studio + hssb (+ dashboard for optional standalone bundle).
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-26
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { ConfigurableChartDesignComponent } from './design/configurable-chart-design.component';
import { ConfigurableChartDesignModel } from './design/configurable-chart-design.model';
import { ConfigurableChartComponent } from './runtime/configurable-chart.component';

@NgModule({
  imports: [ConfigurableChartComponent, ConfigurableChartDesignComponent]
})
export class ConfigurableChartRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-dashboard-configurable-chart',
      name: 'Configurable chart',
      group: 'Dashboard',
      icon: 'chart_bar',
      availableInBundles: [
        'com.amar.helix-vibe-studio',
        'com.amar.hssb',
        'com.amar.dashboard'
      ],
      component: ConfigurableChartComponent,
      designComponent: ConfigurableChartDesignComponent,
      designComponentModel: ConfigurableChartDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'chartTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'chartKind', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'chartQueryExpression', localizable: false, enableExpressionEvaluation: false },
        { name: 'chartPageSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'categoryFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'valueFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'chartHeight', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
