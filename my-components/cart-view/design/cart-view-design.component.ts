/**
 * @generated
 * @context Design-time placeholder for active cart view.
 * @decisions Short hint to configure record defs and field ids in inspector.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-20
 */
import { Component, Input } from '@angular/core';
import { CartViewDesignModel } from './cart-view-design.model';

@Component({
  standalone: true,
  selector: 'com-example-sample-application-cart-view-design',
  styleUrls: ['./cart-view-design.component.scss'],
  templateUrl: './cart-view-design.component.html'
})
export class CartViewDesignComponent {
  @Input()
  model!: CartViewDesignModel;
}
