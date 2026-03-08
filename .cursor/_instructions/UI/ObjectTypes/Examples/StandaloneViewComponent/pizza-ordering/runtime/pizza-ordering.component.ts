import { Component, Input, OnInit } from '@angular/core';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable, throwError } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IPizzaOrderingProperties } from '../pizza-ordering.types';

@Component({
  standalone: true,
  selector: 'com-example-sample-application-pizza-ordering',
  styleUrls: ['./pizza-ordering.component.scss'],
  templateUrl: './pizza-ordering.component.html'
})
@RxViewComponent({
  name: 'com-example-sample-application-pizza-ordering'
})
export class PizzaOrderingComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config: Observable<IPizzaOrderingProperties>;

  api = {
    // This method will be called when a component property is set via the Set property view action.
    setProperty: this.setProperty.bind(this)
  };

  protected state: IPizzaOrderingProperties;

  ngOnInit() {
    super.ngOnInit();

    // Make component API available to runtime view.
    this.notifyPropertyChanged('api', this.api);

    // Subscribe to configuration property changes.
    this.config.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((config: IPizzaOrderingProperties) => {
      // Setting isHidden property to true will remove the component from the DOM.
      this.isHidden = Boolean(config.hidden);

      this.state = { ...config };
    });
  }

  private setProperty(propertyPath: string, propertyValue: any): void | Observable<never> {
    switch (propertyPath) {
      case 'hidden': {
        this.state.hidden = propertyValue;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      }
      case 'customerName': {
        this.state.customerName = propertyValue;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      }
      default: {
        return throwError(`Pizza Ordering : property ${propertyPath} is not settable.`);
      }
    }
  }
}
