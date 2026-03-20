/**
 * @generated
 * @context Design-time canvas label for catalog view component.
 * @decisions Minimal text preview; full UI only at runtime.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-20
 */
import { Component, Input } from '@angular/core';
import { CatalogViewDesignModel } from './catalog-view-design.model';

@Component({
  standalone: true,
  selector: 'com-example-sample-application-catalog-view-design',
  styleUrls: ['./catalog-view-design.component.scss'],
  templateUrl: './catalog-view-design.component.html'
})
export class CatalogViewDesignComponent {
  @Input()
  model!: CatalogViewDesignModel;
}
