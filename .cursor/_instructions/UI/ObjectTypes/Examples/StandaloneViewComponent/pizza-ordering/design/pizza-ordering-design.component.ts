import { Component, Input } from '@angular/core';
import { PizzaOrderingDesignModel } from './pizza-ordering-design.model';

@Component({
  standalone: true,
  selector: 'com-example-sample-application-pizza-ordering-design',
  styleUrls: ['./pizza-ordering-design.component.scss'],
  templateUrl: './pizza-ordering-design.component.html'
})
export class PizzaOrderingDesignComponent {
  @Input()
  model: PizzaOrderingDesignModel;
}
