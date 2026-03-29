/**
 * @generated
 * @context Active shopping cart standalone view: CART + CART_ITEM via DataPage, billing groups, quantity/remove/notes/submit.
 * @decisions Field ids stored as strings for inspector TextFormControl; custodian match loginName vs fullName; optional unit price + billing cadence ids.
 * @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md
 * @modified 2026-03-21
 */
import { IRxStandardProps } from '@helix/platform/view/api';

export interface ICartViewProperties extends IRxStandardProps {
  name: string;
  pageTitle: string;
  emptyStateMessage: string;
  noActiveCartMessage: string;
  orderNotesLabel: string;
  submitOrderLabel: string;
  removeConfirmTitle: string;
  removeConfirmMessage: string;
  /** Label on the line-item remove control (header row, not beside prices). */
  removeLineActionLabel: string;
  /** Shown before the cart total row (sum of all line totals). */
  cartTotalAmountLabel: string;
  /** Muted label above cadence value on each line (e.g. Billing cycle). */
  lineItemBillingLabel: string;
  /** Fully qualified CART record definition */
  cartRecordDefinitionName: string;
  /** Fully qualified CART_ITEM record definition */
  cartItemRecordDefinitionName: string;
  custodianFieldId: string;
  cartStatusFieldId: string;
  /**
   * Active cart filter when **Active cart status (expression)** is empty.
   * Character fields: stored text (e.g. `Active`, `Cancelled`). Selection fields: often the **numeric** internal value.
   */
  activeCartStatusValue: string;
  /**
   * View Designer expression; when it evaluates to a non-empty string, that value is used for the cart status filter instead of **Active cart status value**.
   */
  activeCartStatusExpression: unknown;
  /**
   * View Designer expression; when it evaluates to a non-empty string, that value is matched against the custodian field instead of **Custodian match** (current user).
   */
  custodianFilterExpression: unknown;
  /**
   * Which `IUser` field is compared to the cart custodian column when **Custodian filter (expression)** is empty.
   */
  custodianMatchSource: 'loginName' | 'fullName' | 'userId' | 'personInstanceId' | 'emailAddress';
  /** When false, only the cart status filter runs (useful to verify data; may return another user’s cart if multiple Active). */
  restrictCartToCurrentUser: boolean;
  /** Cart field for order notes (often Description) */
  cartNotesFieldId: string;
  /** CART decimal field for order total on Submit; 0 = skip */
  cartOrderTotalFieldId: string;
  /** CART integer field for sum of line quantities on Submit; 0 = skip */
  cartTotalItemCountFieldId: string;
  /** Optional; 0 = use defaultCurrencyCode only */
  cartCurrencyFieldId: string;
  defaultCurrencyCode: string;
  cartItemCartFkFieldId: string;
  cartItemQuantityFieldId: string;
  cartItemProductNameFieldId: string;
  /**
   * Decimal **base price** per unit on CART_ITEM. When > 0, used for display and line totals (preferred over Unit price field).
   * @context User RD adds explicit Base Price; 0 = fall back to Unit price field id only.
   */
  cartItemBasePriceFieldId: string;
  /** 0 = hide unit price and monetary subtotals (ignored when Base price field id is set) */
  cartItemUnitPriceFieldId: string;
  /**
   * Decimal **line total** (base × quantity). When > 0, persisted whenever quantity changes.
   * Displayed total is always computed client-side from base × qty so the UI stays in sync.
   */
  cartItemTotalCostFieldId: string;
  /** Required for billing groups; 0 shows a single "Items" group */
  cartItemBillingCadenceFieldId: string;
  /** JSON array of cadence labels for sort order, e.g. ["Monthly","Quarterly","Yearly"] */
  billingCadenceOrderJson: string;
  showSubmitButton: boolean;
  /** When set, Submit updates cart status field to this value after saving notes (default Submitted). Empty skips the status write but still fires cartSubmit. */
  submittedCartStatusValue: string;
  /** When true, shows Cancel order next to Submit (secondary). */
  showCancelOrderButton: boolean;
  cancelOrderLabel: string;
  cancelOrderConfirmTitle: string;
  cancelOrderConfirmMessage: string;
  /** Value written to cart status field when Cancel order is confirmed */
  cancelledCartStatusValue: string;
  maxQuantityPerLine: string;
}
