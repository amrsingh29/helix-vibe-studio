/**
 * @generated
 * @context Registers DataIngest Admin standalone VC (dashboard, templates, submissions, settings, wizard modal); palette group "Data Ingestion".
 * @decisions No actionSinks in v1; availableInBundles matches other Helix Vibe Studio VCs; standalone VCs in NgModule imports.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { DataIngestAdminDesignComponent } from './design/data-ingest-admin-design.component';
import { DataIngestAdminDesignModel } from './design/data-ingest-admin-design.model';
import { DataIngestAdminComponent } from './runtime/data-ingest-admin.component';

@NgModule({
  /** Standalone runtime + design components must be listed so the bundle compiles them when this module loads. */
  imports: [DataIngestAdminComponent, DataIngestAdminDesignComponent]
})
export class DataIngestAdminRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-data-ingest-admin',
      name: 'DataIngest - Admin',
      group: 'Data Ingestion',
      icon: 'upload',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: DataIngestAdminComponent,
      designComponent: DataIngestAdminDesignComponent,
      designComponentModel: DataIngestAdminDesignModel,
      properties: [{ name: 'name', localizable: true, enableExpressionEvaluation: true }, ...RX_STANDARD_PROPS_DESC]
    });
  }
}
