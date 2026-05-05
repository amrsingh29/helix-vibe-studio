/**
 * @generated
 * @context Inspector: action sink; RD-driven fields; server filter via Records (expression); data dictionary for insightActionRecord.
 * @decisions Mirrors catalog-view-design.model combineLatest + patch-on-save; legacy Open view section removed — use Action button (actions) only.
 * @references cookbook/02-ui-view-components.md, my-components/catalog-view/design/catalog-view-design.model.ts
 * @modified 2026-04-30; removed Tier 2 client filter inspector + validation.
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IDefinitionPickerComponentOptions,
  IExpressionFormControlOptions,
  ISelectFormControlOptions,
  ISwitcherFormControlOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  SelectFormControlComponent,
  SwitchFormControlComponent,
  TextFormControlComponent
} from '@helix/platform/shared/components';
import { RxRecordDefinitionService } from '@helix/platform/record/api';
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
import { catchError, distinctUntilChanged, map, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import {
  extractCatalogFieldId,
  flattenRecordDefinitionNameValue,
  normalizeCatalogFieldIds
} from '../../catalog-view/catalog-view.utils';
import { IInsightRailProperties } from '../insight-rail.types';
import {
  patchInsightPropertiesForViewDefinitionSave,
  shouldUseInsightBuiltInQuery
} from '../insight-rail.utils';
import { IInsightRailDesignProperties } from './insight-rail-design.types';

function optionalFieldSelectOptions(fieldOptions: { id: string; name: string }[]) {
  return [{ id: '', name: '(None)' }, ...fieldOptions];
}

const initialComponentProperties: IInsightRailProperties = {
  name: '',
  useBuiltInRecordQuery: true,
  insightPageSize: '-1',
  recordDefinitionName: '',
  insightSelectedFieldIds: [],
  insightTitleFieldId: '',
  insightDescriptionFieldId: '',
  insightMetricFieldId: '',
  insightHeaderFieldId: '',
  sectionHeaderLabel: '',
  metricLabel: '',
  recordsViewInputParamName: '',
  records: '',
  buttonLabel: 'View records'
};

export class InsightRailDesignModel extends ViewDesignerComponentModel<
  IInsightRailProperties,
  IInsightRailDesignProperties
> implements IViewDesignerComponentModel<IInsightRailProperties, IInsightRailDesignProperties> {
  private readonly rxRecordDefinitionService = this.injector.get(RxRecordDefinitionService);
  private insightAutoFieldsPreviousRd = '__init__';

  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<IInsightRailDesignProperties>
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

    recordDefinitionName$
      .pipe(
        withLatestFrom(this.sandbox.componentProperties$),
        switchMap(([rd, props]) => {
          if (!rd) {
            return of({ rd: '', props, allIds: [] as string[] });
          }
          return this.rxRecordDefinitionService.get(rd, {}, true).pipe(
            map((def) => ({
              rd,
              props,
              allIds: (def?.fieldDefinitions || []).map((f) => String(f.id))
            })),
            catchError(() => of({ rd, props, allIds: [] as string[] }))
          );
        }),
        takeUntil(this.sandbox.destroyed$)
      )
      .subscribe(({ rd, props, allIds }) => {
        const prev = this.insightAutoFieldsPreviousRd;
        const isFirst = prev === '__init__';
        const rdChanged = !isFirst && rd !== prev;
        this.insightAutoFieldsPreviousRd = rd || '__none__';

        if (!rd || allIds.length === 0) {
          return;
        }
        const selectionEmpty = normalizeCatalogFieldIds(props.insightSelectedFieldIds).length === 0;
        if (isFirst) {
          if (selectionEmpty) {
            this.sandbox.updateComponentProperties({ insightSelectedFieldIds: [...allIds] });
          }
        } else if (rdChanged) {
          this.sandbox.updateComponentProperties({ insightSelectedFieldIds: [...allIds] });
        }
      });

    combineLatest([
      this.sandbox.componentProperties$.pipe(
        startWith({
          ...initialComponentProperties,
          ...RX_STANDARD_PROPS_DEFAULT_VALUES
        } as IInsightRailDesignProperties)
      ),
      fieldOptions$
    ])
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe(([model, fieldOptions]) => {
        const selectionPatch = patchInsightPropertiesForViewDefinitionSave(model);
        if (selectionPatch) {
          this.sandbox.updateComponentProperties(selectionPatch);
        }
        const effective = selectionPatch ? { ...model, ...selectionPatch } : model;
        this.sandbox.updateInspectorConfig(this.setInspectorConfig(effective, fieldOptions));

        const componentName =
          effective.name && String(effective.name).trim()
            ? `${this.sandbox.descriptor.name} (${String(effective.name).trim()})`
            : this.sandbox.descriptor.name;
        this.sandbox.setSettablePropertiesDataDictionary(
          componentName,
          this.getSettablePropertiesDataDictionaryBranch()
        );
        this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName, fieldOptions));
      });

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: IInsightRailDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });
  }

  static getInitialProperties(currentProperties?: IInsightRailProperties): IInsightRailDesignProperties {
    const merged = {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    } as IInsightRailDesignProperties;
    const selectionPatch = patchInsightPropertiesForViewDefinitionSave(merged);
    return selectionPatch ? { ...merged, ...selectionPatch } : merged;
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Records', expression: this.getExpressionForProperty('records') },
      { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') },
      {
        label: 'Selected row (insightActionRecord)',
        expression: this.getExpressionForProperty('insightActionRecord')
      },
      {
        label: 'Field values by id (insightFieldValuesByFieldId)',
        expression: this.getExpressionForProperty('insightFieldValuesByFieldId')
      }
    ];
  }

  private prepareDataDictionary(
    componentName: string,
    fieldOptions: { id: string; name: string }[]
  ): IViewComponentDesignCommonDataDictionaryBranch {
    const byRecord = this.buildInsightFieldOutputBranches(fieldOptions, 'insightActionRecord');
    const byMap = this.buildInsightFieldOutputBranches(fieldOptions, 'insightFieldValuesByFieldId');
    return {
      label: componentName,
      children: [
        {
          label: 'Selected row (object)',
          expression: this.getExpressionForProperty('insightActionRecord'),
          children: byRecord.length ? byRecord : undefined
        },
        {
          label: 'Field values by field id (map)',
          expression: this.getExpressionForProperty('insightFieldValuesByFieldId'),
          children: byMap.length ? byMap : undefined
        },
        {
          label: 'Selected row (JSON string)',
          expression: this.getExpressionForProperty('insightActionRecordJson')
        },
        { label: 'Records', expression: this.getExpressionForProperty('records') },
        { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') }
      ]
    };
  }

  private buildInsightFieldDotPathExpression(
    property: 'insightActionRecord' | 'insightFieldValuesByFieldId',
    fieldId: string
  ): string {
    const base = this.getExpressionForProperty(property);
    if (base.startsWith('${') && base.endsWith('}')) {
      const inner = base.slice(2, -1).trim();
      return `\${${inner}.${fieldId}}`;
    }
    return `\${${base}.${fieldId}}`;
  }

  private buildInsightFieldOutputBranches(
    fieldOptions: { id: string; name: string }[],
    property: 'insightActionRecord' | 'insightFieldValuesByFieldId'
  ): IViewComponentDesignCommonDataDictionaryBranch[] {
    return fieldOptions
      .filter((f) => f.id !== '')
      .map((f) => ({
        label: f.name,
        expression: this.buildInsightFieldDotPathExpression(property, f.id)
      }));
  }

  private setInspectorConfig(_model: IInsightRailProperties, fieldOptions: { id: string; name: string }[]) {
    const sinkControls = this.sandbox.getActionsInspectorConfig().controls;

    return {
      inspectorSectionConfigs: [
        {
          label: 'Action button (actions)',
          controls: sinkControls[0] ? [sinkControls[0]] : []
        },
        {
          label: 'Insight data',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label for this component instance in the outline.')
              }
            },
            {
              name: 'useBuiltInRecordQuery',
              component: SwitchFormControlComponent,
              options: {
                label: 'Load records automatically (Record grid–style)',
                tooltip: new Tooltip(
                  'Uses Record Instance Data Page — pick a record definition and fields; no separate Records expression when on.'
                )
              } as ISwitcherFormControlOptions
            },
            {
              name: 'insightPageSize',
              component: TextFormControlComponent,
              options: {
                label: 'Automatic load: page size',
                tooltip: new Tooltip(
                  'Number of rows to fetch, or -1 for all (platform). Used only when automatic load is on.'
                )
              }
            },
            {
              name: 'recordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip(
                  'Select a record definition. Fields populate Display fields and card slot dropdowns.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'insightSelectedFieldIds',
              component: SelectFormControlComponent,
              options: {
                label: 'Display fields',
                tooltip: new Tooltip(
                  'Fields to fetch from the Data Page (field IDs).'
                ),
                options: fieldOptions,
                multiple: true,
                sortAlphabetically: true,
                enableFilter: true,
                placeholder:
                  fieldOptions.length === 0 ? 'Select record definition first' : 'Select one or more fields'
              } as ISelectFormControlOptions
            }
          ]
        },
        {
          label: 'Card layout',
          controls: [
            {
              name: 'insightTitleFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: title field',
                tooltip: new Tooltip('Bold issue / insight title on each card.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'insightDescriptionFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: description field',
                tooltip: new Tooltip('Body text under the title.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'insightMetricFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: metric field',
                tooltip: new Tooltip('Numeric or text value shown as the large metric (e.g. count).'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'insightHeaderFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: header field (optional)',
                tooltip: new Tooltip(
                  'Small label above the title (e.g. category). If empty, Section header label is used.'
                ),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'sectionHeaderLabel',
              component: TextFormControlComponent,
              options: {
                label: 'Section header label (fallback)',
                tooltip: new Tooltip(
                  'Shown when Card header field is not set (e.g. Inventory). Localizable.'
                )
              }
            },
            {
              name: 'metricLabel',
              component: TextFormControlComponent,
              options: {
                label: 'Metric label',
                tooltip: new Tooltip('Label above the metric value (e.g. Stockroom count).')
              }
            },
            {
              name: 'buttonLabel',
              component: TextFormControlComponent,
              options: {
                label: 'Action button label',
                tooltip: new Tooltip(
                  'CTA text on each card. Configure Open view or other actions on Action button (actions) above; there is no separate legacy open-view block.'
                )
              }
            }
          ]
        },
        {
          label: 'Standard properties',
          controls: [...getStandardPropsInspectorConfigs()]
        },
        {
          label: 'Records (expression mode)',
          controls: [
            {
              name: 'recordsViewInputParamName',
              component: TextFormControlComponent,
              options: {
                label: 'Records: view input parameter name',
                tooltip: new Tooltip(
                  'When automatic load is off: optional view input whose value is the records array.'
                )
              }
            },
            {
              name: 'records',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Records (expression)',
                tooltip: new Tooltip(
                  'When automatic load is off: bind a JSON array of row objects (or stringified JSON), or use view input. When automatic load is on: record-list filter chips and AR-style qualifications are sent as Data Page queryExpression. For selection/drop-down fields use the option\'s numeric id as RHS (see Qualification.md — labels like "Cloud" often match zero rows). Expression-evaluated bindings may be wrapped as { value: "..." } — runtime unwraps these.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            }
          ]
        }
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<IInsightRailDesignProperties>,
    model: IInsightRailDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    const builtIn = shouldUseInsightBuiltInQuery(model);

    if (!flattenRecordDefinitionNameValue(model.recordDefinitionName)) {
      validationIssues.push(
        sandbox.createWarning(
          'Select a record definition so field pickers and defaults resolve correctly.',
          'recordDefinitionName'
        )
      );
    }

    const hasRecordsParam = Boolean(model.recordsViewInputParamName?.trim());
    const recordsEmpty =
      !hasRecordsParam &&
      (model.records === '' ||
        model.records === null ||
        model.records === undefined ||
        (typeof model.records === 'string' && !(model.records as string).trim()));

    if (!builtIn && recordsEmpty) {
      validationIssues.push(
        sandbox.createWarning(
          'Turn on automatic load, or set view input parameter name / Records (expression).',
          'records'
        )
      );
    }

    if (builtIn && !flattenRecordDefinitionNameValue(model.recordDefinitionName)) {
      validationIssues.push(
        sandbox.createWarning('Automatic load requires a record definition.', 'recordDefinitionName')
      );
    }

    const hasPickerFields = normalizeCatalogFieldIds(model.insightSelectedFieldIds).length > 0;
    const hasSlot =
      Boolean(extractCatalogFieldId(model.insightTitleFieldId)) ||
      Boolean(extractCatalogFieldId(model.insightDescriptionFieldId)) ||
      Boolean(extractCatalogFieldId(model.insightMetricFieldId)) ||
      Boolean(extractCatalogFieldId(model.insightHeaderFieldId));

    if (builtIn) {
      if (!hasPickerFields && !hasSlot) {
        validationIssues.push(
          sandbox.createWarning(
            'Automatic load needs Display fields and/or card slot fields.',
            'insightSelectedFieldIds'
          )
        );
      }
    }

    validationIssues.push(...validateStandardProps(model));
    return validationIssues;
  }
}
