/**
 * @generated
 * @context Inspector: record definition drives multi-select field list (like Record grid); auto-select all on RD change; expressions remain as overrides.
 * @decisions RxRecordDefinitionService + SelectFormControl multiple; auto-fill only on first load if empty or when RD changes; catalogSelectedFieldIds precedes CSV/expression at runtime.
 * @references cookbook/02-ui-view-components.md, single-field-viewer-design.model.ts
 * @modified 2026-03-21
 */

const OPEN_VIEW_PRESENTATION_OPTIONS: { id: string; name: string }[] = [
  { id: OpenViewActionType.FullWidth, name: 'Full width' },
  { id: OpenViewActionType.CenteredModal, name: 'Centered modal' },
  { id: OpenViewActionType.DockedLeftModal, name: 'Docked left modal' },
  { id: OpenViewActionType.DockedRightModal, name: 'Docked right modal' }
];
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
import { IViewDesignerComponentModel, OpenViewActionType, RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
import {
  getStandardPropsInspectorConfigs,
  IViewComponentDesignCommonDataDictionaryBranch,
  IViewComponentDesignSandbox,
  IViewComponentDesignValidationIssue,
  validateStandardProps,
  ViewDesignerComponentModel
} from '@helix/platform/view/designer';
import {
  IViewComponentDesignSettablePropertiesDataDictionary
} from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
import { combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import {
  extractCatalogFieldId,
  normalizeCatalogFieldIds,
  shouldUseBuiltInRecordQuery
} from '../catalog-view.utils';
import { ICatalogViewProperties } from '../catalog-view.types';
import { ICatalogViewDesignProperties } from './catalog-view-design.types';

const initialComponentProperties: ICatalogViewProperties = {
  name: '',
  useBuiltInRecordQuery: true,
  catalogPageSize: '-1',
  catalogQueryExpression: '',
  recordDefinitionName: '',
  catalogSelectedFieldIds: [],
  cardTitleFieldId: '',
  cardDescriptionFieldId: '',
  cardBadgeFieldId: '',
  cardPriceFieldId: '',
  cardCurrencyFieldId: '',
  recordsViewInputParamName: '',
  records: '',
  fieldsCsv: '',
  fields: '',
  buttonLabel: 'Add to order',
  initialView: 'card',
  facetFieldKey: '',
  facetOptionsJson: '[]',
  categoryFieldKey: '',
  targetViewDefinitionName: '',
  openViewPresentationType: OpenViewActionType.DockedRightModal,
  openViewModalTitle: '',
  viewParamFieldKeysCsv: ''
};

function optionalFieldSelectOptions(fieldOptions: { id: string; name: string }[]) {
  return [{ id: '', name: '(None)' }, ...fieldOptions];
}

export class CatalogViewDesignModel extends ViewDesignerComponentModel<
  ICatalogViewProperties,
  ICatalogViewDesignProperties
> implements IViewDesignerComponentModel<ICatalogViewProperties, ICatalogViewDesignProperties> {
  private readonly rxRecordDefinitionService = this.injector.get(RxRecordDefinitionService);
  /** Tracks record definition name for auto-select-all behavior */
  private catalogAutoFieldsPreviousRd = '__init__';

  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<ICatalogViewDesignProperties>
  ) {
    super(injector, sandbox);

    const recordDefinitionName$ = this.sandbox.getComponentPropertyValue('recordDefinitionName').pipe(
      distinctUntilChanged()
    );

    const fieldOptions$ = recordDefinitionName$.pipe(
      switchMap((rd) => {
        if (!rd || typeof rd !== 'string') {
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
          if (!rd || typeof rd !== 'string') {
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
        const prev = this.catalogAutoFieldsPreviousRd;
        const isFirst = prev === '__init__';
        const rdChanged = !isFirst && rd !== prev;
        this.catalogAutoFieldsPreviousRd = rd || '__none__';

        if (!rd || allIds.length === 0) {
          return;
        }
        const selectionEmpty = normalizeCatalogFieldIds(props.catalogSelectedFieldIds).length === 0;
        if (isFirst) {
          if (selectionEmpty) {
            this.sandbox.updateComponentProperties({ catalogSelectedFieldIds: [...allIds] });
          }
        } else if (rdChanged) {
          this.sandbox.updateComponentProperties({ catalogSelectedFieldIds: [...allIds] });
        }
      });

    combineLatest([
      this.sandbox.componentProperties$.pipe(
        startWith({
          ...initialComponentProperties,
          ...RX_STANDARD_PROPS_DEFAULT_VALUES
        } as ICatalogViewDesignProperties)
      ),
      fieldOptions$
    ])
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe(([model, fieldOptions]) => {
        this.sandbox.updateInspectorConfig(this.setInspectorConfig(model, fieldOptions));
      });

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: ICatalogViewDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: ICatalogViewProperties): ICatalogViewDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Records', expression: this.getExpressionForProperty('records') },
      { label: 'Fields', expression: this.getExpressionForProperty('fields') },
      { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'Records', expression: this.getExpressionForProperty('records') },
        { label: 'Fields', expression: this.getExpressionForProperty('fields') },
        { label: 'Button label', expression: this.getExpressionForProperty('buttonLabel') }
      ]
    };
  }

  private setInspectorConfig(
    model: ICatalogViewProperties,
    fieldOptions: { id: string; name: string }[]
  ) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'Catalog data',
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
                  'Uses Record Instance Data Page in the component — pick a record definition and fields only; no separate Data Page on the view or Records expression.'
                )
              } as ISwitcherFormControlOptions
            },
            {
              name: 'catalogPageSize',
              component: TextFormControlComponent,
              options: {
                label: 'Built-in query: page size',
                tooltip: new Tooltip(
                  'Number of rows to fetch, or -1 for all (platform). Used only when automatic load is on.'
                )
              }
            },
            {
              name: 'catalogQueryExpression',
              component: TextFormControlComponent,
              options: {
                label: 'Built-in query: qualification (optional)',
                tooltip: new Tooltip(
                  'Data Page qualification, e.g. \'7\' = "0". Leave empty for no filter. See cookbook qualification docs.'
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
                  'Select a record definition. Its fields load into Display fields and card slot dropdowns; all display fields are selected by default when you change this.'
                )
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'catalogSelectedFieldIds',
              component: SelectFormControlComponent,
              options: {
                label: 'Display fields',
                tooltip: new Tooltip(
                  'Fields to fetch and show as extra lines on cards (and as table columns). Same mechanism as Record grid field pickers — uses field IDs.'
                ),
                options: fieldOptions,
                multiple: true,
                sortAlphabetically: true,
                enableFilter: true,
                placeholder:
                  fieldOptions.length === 0 ? 'Select record definition first' : 'Select one or more fields'
              } as ISelectFormControlOptions
            },
            {
              name: 'cardTitleFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: title field',
                tooltip: new Tooltip('Main heading on each card (e.g. product name). Leave None to auto-pick from display fields.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None) or choose field'
              } as ISelectFormControlOptions
            },
            {
              name: 'cardDescriptionFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: description field',
                tooltip: new Tooltip('Subtitle / body text under the title.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None) or choose field'
              } as ISelectFormControlOptions
            },
            {
              name: 'cardBadgeFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: badge field (e.g. billing)',
                tooltip: new Tooltip('Top-right pill on the card. Leave None to fall back to facet field when set.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None) or choose field'
              } as ISelectFormControlOptions
            },
            {
              name: 'cardPriceFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: price field',
                tooltip: new Tooltip('Numeric amount line on the card.'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None) or choose field'
              } as ISelectFormControlOptions
            },
            {
              name: 'cardCurrencyFieldId',
              component: SelectFormControlComponent,
              options: {
                label: 'Card: currency field',
                tooltip: new Tooltip('Currency code shown before the price (e.g. USD).'),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None) or choose field'
              } as ISelectFormControlOptions
            },
            {
              name: 'recordsViewInputParamName',
              component: TextFormControlComponent,
              options: {
                label: 'Records: view input parameter name (simple)',
                tooltip: new Tooltip(
                  'When automatic load is off: optional view input array. When on: ignored unless you also turn off automatic load.'
                )
              }
            },
            {
              name: 'records',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Records (expression)',
                tooltip: new Tooltip(
                  'When automatic load is off: bind rows (e.g. another query). Ignored when automatic load is on.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'buttonLabel',
              component: TextFormControlComponent,
              options: {
                label: 'Action button label',
                tooltip: new Tooltip('Shown on each card and row (e.g. Add to order).')
              }
            },
            {
              name: 'initialView',
              component: SelectFormControlComponent,
              options: {
                label: 'Initial view',
                sortAlphabetically: false,
                options: [
                  { id: 'card', name: 'Card grid' },
                  { id: 'table', name: 'Table' }
                ]
              } as ISelectFormControlOptions
            }
          ]
        },
        {
          label: 'Open view (row / card button)',
          controls: [
            {
              name: 'targetViewDefinitionName',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Target view definition name',
                tooltip: new Tooltip(
                  'Fully qualified view to open on button click, e.g. com.my.bundle:product-detail. Leave empty to only fire catalogActionRecord outputs.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'openViewPresentationType',
              component: SelectFormControlComponent,
              options: {
                label: 'Open view: presentation',
                tooltip: new Tooltip('How the target view is shown (modal, docked, or full width).'),
                sortAlphabetically: false,
                options: OPEN_VIEW_PRESENTATION_OPTIONS
              } as ISelectFormControlOptions
            },
            {
              name: 'openViewModalTitle',
              component: TextFormControlComponent,
              options: {
                label: 'Open view: panel title (optional)',
                tooltip: new Tooltip('Title shown in the modal or docked panel header when supported.')
              }
            },
            {
              name: 'viewParamFieldKeysCsv',
              component: TextFormControlComponent,
              options: {
                label: 'View input: field keys (comma-separated)',
                tooltip: new Tooltip(
                  'Row field IDs (or keys) to pass to the target view as input parameters — same names as the view definition inputs. Example: 379,536870913 or productId,name'
                )
              }
            }
          ]
        },
        {
          label: 'Advanced (override display fields)',
          controls: [
            {
              name: 'fieldsCsv',
              component: TextFormControlComponent,
              options: {
                label: 'Fields: comma-separated (overrides picker)',
                tooltip: new Tooltip(
                  'Only used when Display fields is empty. Example: 8,3045721 or name,description'
                )
              }
            },
            {
              name: 'fields',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Fields (expression)',
                tooltip: new Tooltip(
                  'Only used when Display fields and comma-separated fields are both empty.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            }
          ]
        },
        {
          label: 'Filters',
          controls: [
            {
              name: 'categoryFieldKey',
              component: SelectFormControlComponent,
              options: {
                label: 'Category rail: field',
                tooltip: new Tooltip(
                  'Left column filter — unique values from this field. Must be included in Display fields (or mapped in card slots).'
                ),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'facetFieldKey',
              component: SelectFormControlComponent,
              options: {
                label: 'Facet pills: field',
                tooltip: new Tooltip(
                  'Top filter chips; pair with Facet options JSON. Field must be in Display fields or card slots.'
                ),
                options: optionalFieldSelectOptions(fieldOptions),
                sortAlphabetically: true,
                enableFilter: true,
                placeholder: fieldOptions.length === 0 ? 'Select record definition first' : '(None)'
              } as ISelectFormControlOptions
            },
            {
              name: 'facetOptionsJson',
              component: TextFormControlComponent,
              options: {
                label: 'Facet options (JSON array)',
                tooltip: new Tooltip(
                  'JSON string array of allowed values, e.g. ["ONE_OFF","MONTHLY","QUARTERLY","YEARLY"]. Leave [] when no facet.'
                )
              }
            },
            ...getStandardPropsInspectorConfigs()
          ]
        }
      ]
    };
  }

  private validate(
    sandbox: IViewComponentDesignSandbox<ICatalogViewDesignProperties>,
    model: ICatalogViewDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];

    const builtIn = shouldUseBuiltInRecordQuery(model);

    if (!model.recordDefinitionName?.trim()) {
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

    if (builtIn && !model.recordDefinitionName?.trim()) {
      validationIssues.push(
        sandbox.createWarning('Automatic load requires a record definition.', 'recordDefinitionName')
      );
    }

    const hasPickerFields = normalizeCatalogFieldIds(model.catalogSelectedFieldIds).length > 0;
    const hasFieldsCsv = Boolean(model.fieldsCsv?.trim());
    const fieldsEmpty =
      !hasPickerFields &&
      !hasFieldsCsv &&
      (model.fields === '' ||
        model.fields === null ||
        model.fields === undefined ||
        (typeof model.fields === 'string' && !(model.fields as string).trim()));

    const hasSlot =
      Boolean(extractCatalogFieldId(model.cardTitleFieldId)) ||
      Boolean(extractCatalogFieldId(model.cardDescriptionFieldId)) ||
      Boolean(extractCatalogFieldId(model.cardBadgeFieldId)) ||
      Boolean(extractCatalogFieldId(model.cardPriceFieldId)) ||
      Boolean(extractCatalogFieldId(model.cardCurrencyFieldId));
    const hasFilterField =
      Boolean(extractCatalogFieldId(model.categoryFieldKey)) ||
      Boolean(extractCatalogFieldId(model.facetFieldKey));

    if (builtIn) {
      if (fieldsEmpty && !hasSlot && !hasFilterField) {
        validationIssues.push(
          sandbox.createWarning(
            'Automatic load needs at least one field: pick Display fields and/or card slots and/or category or facet field.',
            'catalogSelectedFieldIds'
          )
        );
      }
    } else if (fieldsEmpty) {
      validationIssues.push(
        sandbox.createWarning(
          'Choose fields under Display fields, or set comma-separated / Fields expression (Advanced).',
          'catalogSelectedFieldIds'
        )
      );
    }

    const pres = model.openViewPresentationType ?? OpenViewActionType.DockedRightModal;
    const hasOpenViewExtras =
      Boolean(model.openViewModalTitle?.trim()) ||
      Boolean(model.viewParamFieldKeysCsv?.trim()) ||
      pres !== OpenViewActionType.DockedRightModal;
    if (hasOpenViewExtras && !model.targetViewDefinitionName?.trim()) {
      validationIssues.push(
        sandbox.createWarning(
          'Set Target view definition name when using open-view options, or clear presentation / params.',
          'targetViewDefinitionName'
        )
      );
    }

    validationIssues.push(...validateStandardProps(model));
    return validationIssues;
  }
}
