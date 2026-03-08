import { Injectable } from '@angular/core';
import { IViewActionService, RxViewAction } from '@helix/platform/view/api';
import { forkJoin, Observable, of } from 'rxjs';
import { ICalculateVatActionProperties } from './calculate-vat-action.types';
import { IPlainObject, RxNotificationService } from '@helix/platform/shared/api';

@Injectable()
@RxViewAction({
  name: 'comExampleSampleApplicationCalculateVat'
})
export class CalculateVatActionService implements IViewActionService<ICalculateVatActionProperties, any> {
  constructor(private rxNotificationService: RxNotificationService) {
  }

  // Implements the runtime behavior of the view action.
  execute(inputParameters: ICalculateVatActionProperties): Observable<any> {
    const result: IPlainObject = {};
    const fullPrice = inputParameters.price * (1 + inputParameters.vatRate / 100);

    // Calculate VAT value based on the input parameters.
    // setting the output parameter "fullPrice".
    result['fullPrice'] = of(fullPrice);

    // Display a notification with the calculated full price.
    this.rxNotificationService.addSuccessMessage(`The full price is ${fullPrice}`);

    return forkJoin(result);
  }
}
