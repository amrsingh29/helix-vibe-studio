/**
 * @generated
 * @context View Designer canvas hint for expression-filtered record list.
 * @decisions Minimal placeholder text.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-20
 */
import { Component, Input } from '@angular/core';
import { ExpressionFilteredRecordListDesignModel } from './expression-filtered-record-list-design.model';

@Component({
  standalone: true,
  selector: 'com-example-sample-application-expression-filtered-record-list-design',
  styleUrls: ['./expression-filtered-record-list-design.component.scss'],
  templateUrl: './expression-filtered-record-list-design.component.html'
})
export class ExpressionFilteredRecordListDesignComponent {
  @Input()
  model!: ExpressionFilteredRecordListDesignModel;
}
