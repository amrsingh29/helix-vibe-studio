/**
 * @generated
 * @context Inspector for cart view: dual record definition pickers, field id strings, billing order JSON, submit options.
 * @decisions Warnings for missing RDs; field ids as text for portability across bundles; Switch for submit visibility.
 * @references cookbook/02-ui-view-components.md, docs/request-view-component-with-record-definition.md
 * @modified 2026-03-20
 */
import { Injector } from '@angular/core';
import { Tooltip } from '@helix/platform/shared/api';
import {
  ExpressionFormControlComponent,
  IDefinitionPickerComponentOptions,
  IExpressionFormControlOptions,
  ISwitcherFormControlOptions,
  RxDefinitionPickerComponent,
  RxDefinitionPickerType,
  SelectFormControlComponent,
  SwitchFormControlComponent,
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
import { takeUntil } from 'rxjs/operators';
import { ICartViewProperties } from '../cart-view.types';
import { ICartViewDesignProperties } from './cart-view-design.types';

const initialComponentProperties: ICartViewProperties = {
  name: '',
  pageTitle: 'Cart',
  emptyStateMessage: 'Your cart is empty.',
  noActiveCartMessage: 'No active cart was found for your account.',
  orderNotesLabel: 'Order notes',
  submitOrderLabel: 'Submit order',
  removeConfirmTitle: 'Remove item',
  removeConfirmMessage: 'Remove this item from your cart?',
  cartRecordDefinitionName: '',
  cartItemRecordDefinitionName: '',
  custodianFieldId: '536870913',
  cartStatusFieldId: '536870914',
  activeCartStatusValue: 'Active',
  activeCartStatusExpression: '',
  custodianFilterExpression: '',
  custodianMatchSource: 'fullName',
  restrictCartToCurrentUser: true,
  cartNotesFieldId: '8',
  cartCurrencyFieldId: '0',
  defaultCurrencyCode: 'USD',
  cartItemCartFkFieldId: '536870913',
  cartItemQuantityFieldId: '536870915',
  cartItemProductNameFieldId: '536870916',
  cartItemBasePriceFieldId: '0',
  cartItemUnitPriceFieldId: '0',
  cartItemTotalCostFieldId: '0',
  cartItemBillingCadenceFieldId: '0',
  billingCadenceOrderJson: '["Monthly","Quarterly","Yearly"]',
  showSubmitButton: true,
  submittedCartStatusValue: '',
  maxQuantityPerLine: '9999'
};

export class CartViewDesignModel extends ViewDesignerComponentModel<
  ICartViewProperties,
  ICartViewDesignProperties
> implements IViewDesignerComponentModel<ICartViewProperties, ICartViewDesignProperties> {
  constructor(
    protected injector: Injector,
    protected sandbox: IViewComponentDesignSandbox<ICartViewDesignProperties>
  ) {
    super(injector, sandbox);

    sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));

    this.sandbox.componentProperties$
      .pipe(takeUntil(this.sandbox.destroyed$))
      .subscribe((properties: ICartViewDesignProperties) => {
        this.sandbox.setValidationIssues(this.validate(this.sandbox, properties));
      });

    this.sandbox.getComponentPropertyValue('name').subscribe((name) => {
      const componentName = name ? `${this.sandbox.descriptor.name} (${name})` : this.sandbox.descriptor.name;
      this.sandbox.setSettablePropertiesDataDictionary(componentName, this.getSettablePropertiesDataDictionaryBranch());
      this.sandbox.setCommonDataDictionary(this.prepareDataDictionary(componentName));
    });
  }

  static getInitialProperties(currentProperties?: ICartViewProperties): ICartViewDesignProperties {
    return {
      ...initialComponentProperties,
      ...RX_STANDARD_PROPS_DEFAULT_VALUES,
      ...currentProperties
    };
  }

  private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
    return [
      { label: 'Hidden', expression: this.getExpressionForProperty('hidden') },
      { label: 'Page title', expression: this.getExpressionForProperty('pageTitle') },
      { label: 'Active cart status (expression)', expression: this.getExpressionForProperty('activeCartStatusExpression') },
      { label: 'Custodian filter (expression)', expression: this.getExpressionForProperty('custodianFilterExpression') }
    ];
  }

  private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
    return {
      label: componentName,
      children: [
        { label: 'Page title', expression: this.getExpressionForProperty('pageTitle') },
        { label: 'Active cart status (expression)', expression: this.getExpressionForProperty('activeCartStatusExpression') },
        { label: 'Custodian filter (expression)', expression: this.getExpressionForProperty('custodianFilterExpression') }
      ]
    };
  }

  private setInspectorConfig(_model: ICartViewProperties) {
    return {
      inspectorSectionConfigs: [
        {
          label: 'Cart view',
          controls: [
            {
              name: 'name',
              component: TextFormControlComponent,
              options: {
                label: 'Name',
                tooltip: new Tooltip('Optional label in the view outline.')
              }
            },
            {
              name: 'pageTitle',
              component: TextFormControlComponent,
              options: {
                label: 'Page title',
                tooltip: new Tooltip('Heading shown above the cart.')
              }
            },
            {
              name: 'emptyStateMessage',
              component: TextFormControlComponent,
              options: { label: 'Empty cart message', tooltip: new Tooltip('When the active cart has no line items.') }
            },
            {
              name: 'noActiveCartMessage',
              component: TextFormControlComponent,
              options: { label: 'No active cart message', tooltip: new Tooltip('When no CART matches Active + custodian.') }
            },
            {
              name: 'orderNotesLabel',
              component: TextFormControlComponent,
              options: { label: 'Order notes label', tooltip: new Tooltip('Label above the notes field.') }
            },
            {
              name: 'submitOrderLabel',
              component: TextFormControlComponent,
              options: { label: 'Submit button label', tooltip: new Tooltip('Primary action at the bottom.') }
            },
            {
              name: 'removeConfirmTitle',
              component: TextFormControlComponent,
              options: { label: 'Remove confirm title', tooltip: new Tooltip('Modal title when removing a line.') }
            },
            {
              name: 'removeConfirmMessage',
              component: TextFormControlComponent,
              options: { label: 'Remove confirm message', tooltip: new Tooltip('Modal body when removing a line.') }
            }
          ]
        },
        {
          label: 'Record definitions',
          controls: [
            {
              name: 'cartRecordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Cart record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip('CART record definition (fully qualified name).')
              } as IDefinitionPickerComponentOptions
            },
            {
              name: 'cartItemRecordDefinitionName',
              component: RxDefinitionPickerComponent,
              options: {
                label: 'Cart item record definition',
                definitionType: RxDefinitionPickerType.Record,
                tooltip: new Tooltip('CART_ITEM record definition.')
              } as IDefinitionPickerComponentOptions
            }
          ]
        },
        {
          label: 'Cart field ids',
          controls: [
            {
              name: 'custodianFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Custodian field id',
                tooltip: new Tooltip(
                  'Field compared to the custodian filter: **Custodian filter (expression)** if set, otherwise **Custodian match**.'
                )
              }
            },
            {
              name: 'cartStatusFieldId',
              component: TextFormControlComponent,
              options: { label: 'Cart status field id', tooltip: new Tooltip('Field filtered by Active cart status value.') }
            },
            {
              name: 'activeCartStatusValue',
              component: TextFormControlComponent,
              options: {
                label: 'Active cart status value',
                tooltip: new Tooltip(
                  'Default status filter when no expression is set (e.g. **Active**, **Cancelled** for character fields). For selection fields that store numbers internally, enter that number.'
                )
              }
            },
            {
              name: 'activeCartStatusExpression',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Active cart status (expression)',
                tooltip: new Tooltip(
                  'Optional. When this evaluates to a non-empty string, it **replaces** Active cart status value in the query (e.g. return `"Active"` or a view input).'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'custodianFilterExpression',
              component: ExpressionFormControlComponent,
              options: {
                label: 'Custodian filter (expression)',
                tooltip: new Tooltip(
                  'Optional. When this evaluates to a non-empty string, it **replaces** Custodian match for filtering carts to the current user (e.g. current user login, person id, or view input). Leave empty to use Custodian match.'
                ),
                dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                operators: this.expressionConfigurator.getOperators(),
                isRequired: false
              } as IExpressionFormControlOptions
            },
            {
              name: 'custodianMatchSource',
              component: SelectFormControlComponent,
              options: {
                label: 'Custodian match',
                sortAlphabetically: false,
                options: [
                  { id: 'fullName', name: 'Full name' },
                  { id: 'loginName', name: 'Login name' },
                  { id: 'userId', name: 'User id' },
                  { id: 'personInstanceId', name: 'Person instance id' },
                  { id: 'emailAddress', name: 'Email address' }
                ]
              }
            },
            {
              name: 'restrictCartToCurrentUser',
              component: SwitchFormControlComponent,
              options: {
                label: 'Restrict cart to current user',
                tooltip: new Tooltip(
                  'When off, only **Active cart status** is used to find a cart (testing). When on, custodian field must match the user field chosen above.'
                )
              } as ISwitcherFormControlOptions
            },
            {
              name: 'cartNotesFieldId',
              component: TextFormControlComponent,
              options: { label: 'Order notes field id', tooltip: new Tooltip('CART field id for notes (often 8 Description).') }
            },
            {
              name: 'cartCurrencyFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Cart currency field id (0=none)',
                tooltip: new Tooltip('Optional. When 0, Default currency code is used.')
              }
            },
            {
              name: 'defaultCurrencyCode',
              component: TextFormControlComponent,
              options: { label: 'Default currency code', tooltip: new Tooltip('ISO code for formatting, e.g. USD.') }
            }
          ]
        },
        {
          label: 'Cart item field ids',
          controls: [
            {
              name: 'cartItemCartFkFieldId',
              component: TextFormControlComponent,
              options: { label: 'Cart FK field id', tooltip: new Tooltip('CART_ITEM field holding parent cart instance id.') }
            },
            {
              name: 'cartItemQuantityFieldId',
              component: TextFormControlComponent,
              options: { label: 'Quantity field id', tooltip: new Tooltip('Integer quantity field on CART_ITEM.') }
            },
            {
              name: 'cartItemProductNameFieldId',
              component: TextFormControlComponent,
              options: { label: 'Product name field id', tooltip: new Tooltip('Display name for the line.') }
            },
            {
              name: 'cartItemBasePriceFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Base price field id (0=use unit price below)',
                tooltip: new Tooltip(
                  'Decimal base price per line item. When set, **Line total** = base × quantity and group subtotals sum line totals. Overrides unit price for display when > 0.'
                )
              }
            },
            {
              name: 'cartItemUnitPriceFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Unit price field id (0=hide)',
                tooltip: new Tooltip(
                  'Legacy: decimal unit price when Base price field id is 0. If either base or unit id is set, money UI and subtotals are shown.'
                )
              }
            },
            {
              name: 'cartItemTotalCostFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Total cart item cost field id (0=skip)',
                tooltip: new Tooltip(
                  'Optional decimal field for base × quantity. Updated on every quantity save so the record stays consistent with the UI.'
                )
              }
            },
            {
              name: 'cartItemBillingCadenceFieldId',
              component: TextFormControlComponent,
              options: {
                label: 'Billing cadence field id (0=single group)',
                tooltip: new Tooltip('Selection/text used to group lines (Monthly, Yearly, …). 0 = one group "Items".')
              }
            },
            {
              name: 'billingCadenceOrderJson',
              component: TextFormControlComponent,
              options: {
                label: 'Billing group order (JSON)',
                tooltip: new Tooltip('Array of cadence labels for display order, e.g. ["Monthly","Quarterly","Yearly"].')
              }
            },
            {
              name: 'maxQuantityPerLine',
              component: TextFormControlComponent,
              options: { label: 'Max quantity per line', tooltip: new Tooltip('Upper bound enforced in the UI.') }
            }
          ]
        },
        {
          label: 'Submit',
          controls: [
            {
              name: 'showSubmitButton',
              component: SwitchFormControlComponent,
              options: {
                label: 'Show submit button',
                tooltip: new Tooltip('Hide in read-only carts.')
              } as ISwitcherFormControlOptions
            },
            {
              name: 'submittedCartStatusValue',
              component: TextFormControlComponent,
              options: {
                label: 'Submitted cart status value',
                tooltip: new Tooltip(
                  'When non-empty, Submit saves notes then sets Cart status field to this value. Leave empty to only fire the Cart submit output for a view action.'
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
    sandbox: IViewComponentDesignSandbox<ICartViewDesignProperties>,
    model: ICartViewDesignProperties
  ): IViewComponentDesignValidationIssue[] {
    const issues: IViewComponentDesignValidationIssue[] = [];

    if (!model.cartRecordDefinitionName?.trim()) {
      issues.push(sandbox.createWarning('Select the Cart record definition.', 'cartRecordDefinitionName'));
    }
    if (!model.cartItemRecordDefinitionName?.trim()) {
      issues.push(sandbox.createWarning('Select the Cart item record definition.', 'cartItemRecordDefinitionName'));
    }

    const cadenceId = parseInt(model.cartItemBillingCadenceFieldId ?? '0', 10);
    if (!Number.isFinite(cadenceId) || cadenceId <= 0) {
      issues.push(
        sandbox.createWarning(
          'Set Billing cadence field id to group lines like the design mock; 0 falls back to a single group.',
          'cartItemBillingCadenceFieldId'
        )
      );
    }

    issues.push(...validateStandardProps(model));
    return issues;
  }
}
