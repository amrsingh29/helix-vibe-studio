/**
 * @generated
 * @context Inspector: RD picker + JSON field + optional query; chartDataJson expression fallback; event outputs in data dictionary.
 * @decisions combineLatest refreshes field dropdown when RD changes; Data Page loads first row by default (page size 1).
 * @references cookbook/02-ui-view-components.md, my-components/catalog-view/design/catalog-view-design.model.ts
 * @modified 2026-03-29
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
import { coerceDesignerString, flattenRecordDefinitionNameValue } from '../org-chart-record.util';
import type { IOrgChartViewProperties } from '../org-chart-view.types';
import type { IOrgChartViewDesignProperties } from './org-chart-view-design.types';

const initialComponentProperties: IOrgChartViewProperties = {
  name: '',
  recordDefinitionName: '',
  chartJsonFieldId: '',
  recordInstanceId: '',
  chartDataQueryExpression: '',
  chartDataPageSize: '1',
  chartDataJson: ''
};

export class OrgChartViewDesignModel extends ViewDesignerComponentModel<
  IOrgChartViewProperties,
  IOrgChartViewDesignProperties
> implements IViewDesignerComponentModel<IOrgChartViewProperties, IOrgChartViewDesignProperties> {
  private readonly rxRecordDefinitionService = this.injector.get(RxRecordDefinitionService);

  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IOrgChartViewDesignProperties>
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
        } as IOrgChartViewDesignProperties)
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

  static getInitialProperties(currentProperties?: IOrgChartViewProperties): IOrgChartViewDesignProperties {
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
      { label: 'Chart data (JSON)', expression: this.getExpressionForProperty('chartDataJson') },
      { label: 'onNodeClick', expression: this.getExpressionForProperty('onNodeClick') },
      { label: 'onExpand', expression: this.getExpressionForProperty('onExpand') },
      { label: 'onCollapse', expression: this.getExpressionForProperty('onCollapse') },
      { label: 'onSearch', expression: this.getExpressionForProperty('onSearch') },
      { label: 'onContextAction', expression: this.getExpressionForProperty('onContextAction') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'onNodeClick', expression: this.getExpressionForProperty('onNodeClick') },
        { label: 'onExpand', expression: this.getExpressionForProperty('onExpand') },
        { label: 'onCollapse', expression: this.getExpressionForProperty('onCollapse') },
        { label: 'onSearch', expression: this.getExpressionForProperty('onSearch') },
        { label: 'onContextAction', expression: this.getExpressionForProperty('onContextAction') },
        { label: 'Record Instance ID', expression: this.getExpressionForProperty('recordInstanceId') },
        { label: 'Chart data (JSON)', expression: this.getExpressionForProperty('chartDataJson') }
      ]
    };
  }

  private setInspectorConfig(
    _model: IOrgChartViewProperties,
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
          label: 'Chart data from record',
          controls: [
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip(
                  'Pick the record definition that stores org chart JSON in a character/long text field. Bind Record instance ID (like Markdown Viewer) to load one record, or leave it empty and use Query expression / first Data Page row.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'chartJsonFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'JSON field',
                tooltip: new Tooltip(
                  'Field (usually Character/Large Character) whose value is JSON: { "nodes": [...], "config": { ... } }.'
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
                  'Bind to the view input (or expression) that provides the record instance id, same pattern as Markdown Viewer. When set with Record definition + JSON field, that record is loaded via GET. Leave empty to use Data Page + optional query below.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'chartDataQueryExpression',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Query expression (Data Page)',
                tooltip: new Tooltip(
                  'Used only when Record instance ID is empty. AR qualification to choose rows, e.g. \'536870913\' = "MY-ID". Leave empty for the first row returned by the Data Page (page size 1).'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'chartDataPageSize',
              component: TextFormControlComponent,
              options: {
                label: 'Page size',
                tooltip: new Tooltip(
                  'How many rows the Data Page returns (default 1 = first row only). Increase if you use query to narrow to one row.'
                )
              }
            }
          ]
        },
        {
          label: 'Chart data (expression)',
          controls: [
            {
              name: 'chartDataJson',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Chart data (JSON)',
                tooltip: new Tooltip(
                  'Use when not loading from a record field, or bind to record.<fieldId> when the view has record context. Evaluates to JSON: { "nodes": [...], "config": { ... } }. If Record definition + JSON field are both set, the record field wins at runtime.'
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
    sandbox: IViewComponentDesignSandbox<IOrgChartViewDesignProperties>,
    model: IOrgChartViewDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const issues: IViewComponentDesignValidationIssue[] = [];
    const rd = flattenRecordDefinitionNameValue(model.recordDefinitionName);
    const fid = coerceDesignerString(model.chartJsonFieldId);
    if (rd && !fid) {
      issues.push(
        sandbox.createWarning('Select the JSON field on the record definition, or clear Record definition to use only the expression.', 'chartJsonFieldId')
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
