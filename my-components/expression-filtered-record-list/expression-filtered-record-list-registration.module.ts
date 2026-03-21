/**
 * @generated
 * @context Registers expression-filtered record list; enableExpressionEvaluation on records, name, matchStatusValue.
 * @decisions Plain text keys for status/title fields; expression-driven filter value demonstrates Status = Active pattern.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-20
 */
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { ExpressionFilteredRecordListDesignComponent } from './design/expression-filtered-record-list-design.component';
import { ExpressionFilteredRecordListDesignModel } from './design/expression-filtered-record-list-design.model';
import { ExpressionFilteredRecordListComponent } from './runtime/expression-filtered-record-list.component';

@NgModule()
export class ExpressionFilteredRecordListRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-example-sample-application-expression-filtered-record-list',
      name: 'Filtered record list (expression)',
      group: 'Reusable UI',
      icon: 'table',
      component: ExpressionFilteredRecordListComponent,
      designComponent: ExpressionFilteredRecordListDesignComponent,
      designComponentModel: ExpressionFilteredRecordListDesignModel,
      properties: [
        { name: 'name', localizable: true, enableExpressionEvaluation: true },
        { name: 'recordDefinitionName', localizable: false, enableExpressionEvaluation: false },
        { name: 'records', localizable: false, enableExpressionEvaluation: true },
        { name: 'statusFieldKey', localizable: false, enableExpressionEvaluation: false },
        { name: 'matchStatusValue', localizable: false, enableExpressionEvaluation: true },
        { name: 'titleFieldKey', localizable: false, enableExpressionEvaluation: false },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
