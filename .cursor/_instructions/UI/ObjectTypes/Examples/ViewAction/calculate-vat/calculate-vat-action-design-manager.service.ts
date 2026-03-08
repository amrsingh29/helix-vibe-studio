import { Injectable } from '@angular/core';
import {IViewActionDesignManager, RxViewActionRegistryService} from '@helix/platform/view/api';
import { IViewComponentDesignValidationIssue } from '@helix/platform/view/designer';
import { Observable, of } from 'rxjs';
import { ICalculateVatActionDesignProperties } from './calculate-vat-action-design.types';
import {ValidationIssueType} from "@helix/platform/ui-kit";

@Injectable()
export class CalculateVatActionDesignManagerService implements IViewActionDesignManager<ICalculateVatActionDesignProperties> {
  constructor(private rxViewActionRegistryService: RxViewActionRegistryService) {
  }

  // This method will be called automatically to validate view action input parameters.
  validate(actionProperties: ICalculateVatActionDesignProperties, propertyName: string): Observable<IViewComponentDesignValidationIssue[]> {
    // Getting the action design information.
    const actionDescriptor = this.rxViewActionRegistryService.get(actionProperties.name);
    // Default validation issues.
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    // The price should be a positive number, if it is hardcoded in view designer as a number.
    // It can be a string since it can be an expression, but if it is a number we validate it.
    if (actionProperties.price && Number(actionProperties.price) < 0) {
      validationIssues.push({
        type: ValidationIssueType.Error,
        propertyName: propertyName,
        description: `${actionDescriptor.label}: Price should be a positive number.`
      });
    }

    // The vat rate should be a positive number, if it is hardcoded in view designer as a number.
    // It can be a string since it can be an expression, but if it is a number we validate it.
    if (actionProperties.vatRate && Number(actionProperties.vatRate) < 0) {
        validationIssues.push({
          type: ValidationIssueType.Error,
          propertyName: propertyName,
          description: `${actionDescriptor.label}: Vat Rate should be a positive number.`
        });
      }

    return of(validationIssues);
  }
}
