/**
 * @generated
 * @context Registers Runtime actions demo VC; actionSinks + container/outlet for ActionSinkWidget; OpenView + LaunchProcess action modules.
 * @decisions actionSinks (openViewActions / launchProcessActions / notificationActions) — same pattern as palette Button actions; no array props (actions live under ActionSink children).
 * @references cookbook/02-ui-view-components.md, .cursor/_instructions/UI/Services/open-view.md
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RX_VIEW_DEFINITION, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { LaunchProcessViewActionModule, OpenViewActionModule } from '@helix/platform/view/actions';
import { RuntimeActionsDemoDesignComponent } from './design/runtime-actions-demo-design.component';
import { RuntimeActionsDemoDesignModel } from './design/runtime-actions-demo-design.model';
import { RuntimeActionsDemoComponent } from './runtime/runtime-actions-demo.component';

@NgModule({
  imports: [OpenViewActionModule, LaunchProcessViewActionModule]
})
export class RuntimeActionsDemoRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-runtime-actions-demo',
      name: 'Runtime actions demo',
      group: 'Helix Vibe Studio',
      icon: 'flash_on',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: RuntimeActionsDemoComponent,
      designComponent: RuntimeActionsDemoDesignComponent,
      designComponentModel: RuntimeActionsDemoDesignModel,
      isContainerComponent: true,
      outlets: [{ name: RX_VIEW_DEFINITION.defaultOutletName }],
      actionSinks: [
        { name: 'openViewActions', label: 'Open view button (actions)' },
        { name: 'launchProcessActions', label: 'Launch process button (actions)' },
        { name: 'notificationActions', label: 'Notification button (actions)' }
      ],
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'targetViewDefinitionName', localizable: false, enableExpressionEvaluation: true },
        { name: 'targetProcessDefinitionName', localizable: false, enableExpressionEvaluation: true },
        { name: 'demoMessage', localizable: true, enableExpressionEvaluation: true },
        { name: 'openViewPresentationType', localizable: false, enableExpressionEvaluation: false },
        { name: 'openViewModalTitle', localizable: true, enableExpressionEvaluation: true },
        { name: 'openViewParamsJson', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
