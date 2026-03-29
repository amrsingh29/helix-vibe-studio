/**
 * @generated
 * @context Registers Date/Time Formatter standalone view with Innovation Studio palette.
 * @decisions Same pattern as cart-view; enableExpressionEvaluation for name and dateTimeValue.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-22
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { DateTimeFormatterDesignComponent } from './design/date-time-formatter-design.component';
import { DateTimeFormatterDesignModel } from './design/date-time-formatter-design.model';
import { DateTimeFormatterComponent } from './runtime/date-time-formatter.component';

@NgModule({
  imports: [DateTimeFormatterComponent, DateTimeFormatterDesignComponent]
})
export class DateTimeFormatterRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-date-time-formatter',
      name: 'Date/Time Formatter',
      group: 'Helix Vibe Studio',
      icon: 'schedule',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: DateTimeFormatterComponent,
      designComponent: DateTimeFormatterDesignComponent,
      designComponentModel: DateTimeFormatterDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'dateTimeValue', localizable: false, enableExpressionEvaluation: true },
        { name: 'format', localizable: false, enableExpressionEvaluation: false },
        { name: 'fontSize', localizable: false, enableExpressionEvaluation: false },
        { name: 'textColor', localizable: false, enableExpressionEvaluation: false },
        { name: 'badgeMode', localizable: false, enableExpressionEvaluation: false },
        { name: 'badgeBackgroundColor', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
