/**
 * @generated
 * @context Registers Priority Matrix VC in Helix Vibe Studio palette; Adapt icon tiles; record + JSON props.
 * @decisions NgModule imports standalone runtime + design; properties flags mirror org-chart (no events).
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-05-03
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { PriorityMatrixViewDesignComponent } from './design/priority-matrix-view-design.component';
import { PriorityMatrixViewDesignModel } from './design/priority-matrix-view-design.model';
import { PriorityMatrixViewComponent } from './runtime/priority-matrix-view.component';

@NgModule({
  imports: [PriorityMatrixViewComponent, PriorityMatrixViewDesignComponent]
})
export class PriorityMatrixViewRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-priority-matrix-view',
      name: 'Priority Matrix',
      group: 'Helix Vibe Studio',
      icon: 'tiles',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: PriorityMatrixViewComponent,
      designComponent: PriorityMatrixViewDesignComponent,
      designComponentModel: PriorityMatrixViewDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'matrixJsonFieldId', localizable: false, enableExpressionEvaluation: false },
        { name: 'recordInstanceId', localizable: true, enableExpressionEvaluation: true },
        { name: 'matrixDataQueryExpression', localizable: false, enableExpressionEvaluation: true },
        { name: 'matrixDataPageSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'matrixConfigJson', localizable: false, enableExpressionEvaluation: true },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
