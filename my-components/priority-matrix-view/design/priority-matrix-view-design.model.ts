/**
 * @generated
 * @context Inspector: RD + JSON field + instance id / Data Page; matrixConfigJson expression; validation for RD/field pair.
 * @decisions combineLatest for field dropdown; same Data Page defaults as org-chart; data dictionary for expression bindings.
 * @references my-components/org-chart-view/design/org-chart-view-design.model.ts
 * @modified 2026-05-03
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import { RxRecordDefinitionService } from '@helix/platform/record/api';
import {
  ExpressionFormControlComponent,
  IDefinitionPickerComponentOptions,
  IExpressionFormControlOptions,
  ISelectFormControlOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  SelectFormControlComponent,
  TextFormControlComponent
} from '@helix/platform/shared/components';
import { IViewDesignerComponentModel, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
import {
  getStandardPropsInspectorConfigs,
  IViewComponentDesignCommonDataDictionaryBranch,
  IViewComponentDesignSandbox,
  IViewComponentDesignValidationIssue,
  validateStandardProps,
  ViewDesignerComponentModel
} from '@helix/platform/view/designer';
import { IViewComponentDesignSettablePropertiesDataDictionary } from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
import { combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { coerceDesignerString, flattenRecordDefinitionNameValue } from '../priority-matrix-view-record.util';
import type { IPriorityMatrixViewProperties } from '../priority-matrix-view.types';
import type { IPriorityMatrixViewDesignProperties } from './priority-matrix-view-design.types';

const initialComponentProperties: IPriorityMatrixViewProperties = {
  name: '',
  recordDefinitionName: '',
  matrixJsonFieldId: '',
  recordInstanceId: '',
  matrixDataQueryExpression: '',
  matrixDataPageSize: '1',
  matrixConfigJson: ''
};

export class PriorityMatrixViewDesignModel extends ViewDesignerComponentModel<
  IPriorityMatrixViewProperties,
  IPriorityMatrixViewDesignProperties
> implements IViewDesignerComponentModel<IPriorityMatrixViewProperties, IPriorityMatrixViewDesignProperties> {
  private readonly rxRecordDefinitionService = this.injector.get(RxRecordDefinitionService);

  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IPriorityMatrixViewDesignProperties>
  ) {
    super(injector, sandbox);

    const recordDefinitionName$ = this.sandbox.getComponentPropertyValue('recordDefinitionName').pipe(
      map((raw) => flattenRecordDefinitionNameValue(raw)),
      distinctUntilChanged()
    );

    const fieldOptions$ = recordDefinitionName$.pipe(
      switchMap((rd) => {
        if (!rd) {
          return of([] as { id: string; name: string }[]);
        }
        return this.rxRecordDefinitionService.get(rd, {}, true).pipe(
          map((def) =>
            (def?.fieldDefinitions || []).map((f) => ({
              id: String(f.id),
              name: `${f.name || f.id} (${f.id})`
            }))
          ),
          catchError(() => of([] as { id: string; name: string }[]))
        );
      }),
      startWith([] as { id: string; name: string }[])
    );

    combineLatest([
      this.sandbox.componentProperties$.pipe(
        startWith({
          ...initialComponentProperties,
          ...RX_STANDARD_PROPS_DEFAULT_VALUES
        } as IPriorityMatrixViewDesignProperties)
      ),
      fieldOptions$
    ])
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe(([model, fieldOptions]) => {
        this.sandbox.updateInspectorConfig(this.setInspectorConfig(model, fieldOptions));
      });

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
    });
  }

  static getInitialProperties(currentProperties?: IPriorityMatrixViewProperties): IPriorityMatrixViewDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Record Instance ID', expression: this.getExpressionForProperty('recordInstanceId') },
      { label: 'Matrix config (JSON)', expression: this.getExpressionForProperty('matrixConfigJson') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'Record Instance ID', expression: this.getExpressionForProperty('recordInstanceId') },
        { label: 'Matrix config (JSON)', expression: this.getExpressionForProperty('matrixConfigJson') }
      ]
    };
  }

  private setInspectorConfig(
    _model: IPriorityMatrixViewProperties,
    fieldOptions: { id: string; name: string }[]
  ) {
    const fieldSelectOptions = [{ id: '', name: '(None)' }, ...fieldOptions];
    return {
      inspectorSectionConfigs: [
        {
          label: 'General',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label for this component instance in the outline.')
              }
            }
          ]
        },
        {
          label: 'Matrix data from record',
          controls: [
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip(
                  'Record definition that stores matrix JSON in a character or long text field. Bind Record instance ID to load one record, or leave empty and use Query expression with Data Page.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'matrixJsonFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'JSON field',
                tooltip: new Tooltip(
                  'Field whose value is JSON: row_axis, col_axis, matrix array (see component documentation).'
                ),
                options: fieldSelectOptions,
                sortAlphabetically: false
              } as ISelectFormControlOptions
            },
            {
              name: 'recordInstanceId',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Record instance ID',
                tooltip: new Tooltip(
                  'View input or expression for record instance id. With Record definition + JSON field, loads that record via GET.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'matrixDataQueryExpression',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Query expression (Data Page)',
                tooltip: new Tooltip(
                  'Used when Record instance ID is empty. AR qualification to choose rows, e.g. \'536870913\' = "MY-ID".'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'matrixDataPageSize',
              component: TextFormControlComponent,
              options: {
                label: 'Page size',
                tooltip: new Tooltip('Data Page row count (default 1 = first row only).')
              }
            }
          ]
        },
        {
          label: 'Matrix data (expression)',
          controls: [
            {
              name: 'matrixConfigJson',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Matrix config (JSON)',
                tooltip: new Tooltip(
                  'JSON string or expression when not loading from a record field. If Record definition + JSON field are set, the record field wins at runtime.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            }
          ]
        },
        {
          label: 'Standard',
          controls: [...getStandardPropsInspectorConfigs()]
        }
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<IPriorityMatrixViewDesignProperties>,
    model: IPriorityMatrixViewDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const issues: IViewComponentDesignValidationIssue[] = [];
    const rd = flattenRecordDefinitionNameValue(model.recordDefinitionName);
    const fid = coerceDesignerString(model.matrixJsonFieldId);
    if (rd && !fid) {
      issues.push(
        sandbox.createWarning('Select the JSON field on the record definition, or clear Record definition to use only the expression.', 'matrixJsonFieldId')
      );
    }
    if (fid && !rd) {
      issues.push(
        sandbox.createWarning('Select a record definition when using the JSON field.', 'recordDefinitionName')
      );
    }
    issues.push(...validateStandardProps(model));
    return issues;
  }
}
