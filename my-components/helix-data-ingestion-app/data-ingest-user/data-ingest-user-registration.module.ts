/**
 * @generated
 * @context Registers DataIngest User standalone VC; palette group "Data Ingestion".
 * @modified 2026-03-21
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { DataIngestUserDesignComponent } from './design/data-ingest-user-design.component';
import { DataIngestUserDesignModel } from './design/data-ingest-user-design.model';
import { DataIngestUserComponent } from './runtime/data-ingest-user.component';

@NgModule({
  imports: [DataIngestUserComponent, DataIngestUserDesignComponent]
})
export class DataIngestUserRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-amar-helix-vibe-studio-data-ingest-user',
      name: 'DataIngest - User',
      group: 'Data Ingestion',
      icon: 'cloud_arrow_up',
      availableInBundles: ['com.amar.helix-vibe-studio', 'com.amar.hssb'],
      component: DataIngestUserComponent,
      designComponent: DataIngestUserDesignComponent,
      designComponentModel: DataIngestUserDesignModel,
      properties: [{ name: 'name', localizable: true, enableExpressionEvaluation: true }, ...RX_STANDARD_PROPS_DESC]
    });
  }
}
