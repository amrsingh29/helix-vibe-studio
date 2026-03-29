/**
 * @generated
 * @context Angular module for com.amar.dashboard bundle — Dashboard view components + i18n defaults.
 * @decisions Import ConfigurableChartRegistrationModule; Helix shell also imports it via ComAmarHelixVibeStudioModule (do not import both modules in one shell).
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-24
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxLocalizationService } from '@helix/platform/shared/api';
import * as defaultApplicationStrings from './i18n/localized-strings.json';
import { ConfigurableChartRegistrationModule } from './view-components/configurable-chart/configurable-chart-registration.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ConfigurableChartRegistrationModule]
})
export class ComAmarDashboardModule {
  constructor(private rxLocalizationService: RxLocalizationService) {
    this.rxLocalizationService.setDefaultApplicationStrings(defaultApplicationStrings['default']);
  }
}
