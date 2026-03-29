/**
 * @generated
 * @context Runtime active cart: line cards with billing + prices; remove in header row; cart total row; no group pills (section title only when multiple groups).
 * @decisions OnPush; RxModalService for remove confirm; partial record saves; outputs cartSubmit for view actions when status transition disabled.
 * @references cookbook/02-ui-view-components.md, cookbook/04-ui-services-and-apis.md, .cursor/_instructions/UI/Services/records.md
 * @modified 2026-03-21
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdaptButtonModule, AdaptIconModule } from '@bmc-ux/adapt-angular';
import {
  IDataPageParams,
  IDataPageResult,
  RxCurrentUserService,
  RxLogService,
  RxNotificationService
} from '@helix/platform/shared/api';
import { IModalConfig, RX_MODAL, RxModalService } from '@helix/platform/ui-kit';
import { RX_RECORD_DEFINITION, RxRecordInstanceDataPageService, RxRecordInstanceService } from '@helix/platform/record/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { ICartViewProperties } from '../cart-view.types';

type DataRow = Record<string, unknown>;

export interface ICartLineViewModel {
  id: string;
  displayName: string;
  /** Base (unit) price for one item; null when no money field configured */
  unitPrice: number | null;
  /** base × quantity when unitPrice is set */
  lineTotal: number | null;
  quantity: number;
  cadenceKey: string;
  busy: boolean;
}

export interface ICartGroupViewModel {
  cadenceKey: string;
  lines: ICartLineViewModel[];
  subtotal: number;
}

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-cart-view',
  styleUrls: ['./cart-view.component.scss'],
  templateUrl: './cart-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, AdaptIconModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-cart-view'
})
export class CartViewComponent extends BaseViewComponent implements OnInit, OnDestroy, IViewComponent {
  @Input()
  config!: Observable<ICartViewProperties>;

  api = {
    setProperty: this.setProperty.bind(this),
    refresh: this.reload.bind(this)
  };

  protected state!: ICartViewProperties;

  loading = false;
  savingNotes = false;
  submitting = false;
  cancelling = false;
  loadError: string | null = null;

  cartId: string | null = null;
  cartDisplayId = '';
  orderNotesDraft = '';
  /** Server copy to detect dirty */
  private orderNotesSaved = '';

  groups: ICartGroupViewModel[] = [];
  private rawItemRows: DataRow[] = [];

  private currencyCode = 'USD';

  /** Debounce typing in the quantity box so we do not save on every keypress */
  private qtyInputDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly rxNotificationService: RxNotificationService,
    private readonly rxCurrentUserService: RxCurrentUserService,
    private readonly rxRecordInstanceDataPageService: RxRecordInstanceDataPageService,
    private readonly rxRecordInstanceService: RxRecordInstanceService,
    private readonly rxModalService: RxModalService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config.pipe(takeUntil(this.destroyed$)).subscribe((c) => {
      // @context Saved views may omit newer inspector keys; undefined would make fid() skip rollup writes.
      this.state = {
        ...c,
        cartOrderTotalFieldId: c.cartOrderTotalFieldId ?? '0',
        cartTotalItemCountFieldId: c.cartTotalItemCountFieldId ?? '0'
      } as ICartViewProperties;
      this.isHidden = Boolean(c.hidden);
      this.reload();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.clearQtyInputDebounce();
    super.ngOnDestroy();
  }

  reload(): void {
    this.loadError = null;
    const cartRd = this.state?.cartRecordDefinitionName?.trim() ?? '';
    const itemRd = this.state?.cartItemRecordDefinitionName?.trim() ?? '';
    if (!cartRd || !itemRd) {
      this.loadError = 'Configure cart and cart item record definitions.';
      this.resetCartState();
      this.cdr.markForCheck();
      return;
    }
    this.fetchActiveCart(cartRd, itemRd);
  }

  onNotesChange(value: string): void {
    this.orderNotesDraft = value;
    this.cdr.markForCheck();
  }

  onNotesBlur(): void {
    if (!this.cartId || this.orderNotesDraft === this.orderNotesSaved) {
      return;
    }
    this.persistOrderNotes();
  }

  incrementQty(line: ICartLineViewModel): void {
    this.clearQtyInputDebounce();
    const maxQ = this.maxQty();
    if (line.quantity >= maxQ) {
      return;
    }
    this.updateLineQuantity(line, line.quantity + 1);
  }

  decrementQty(line: ICartLineViewModel): void {
    this.clearQtyInputDebounce();
    if (line.quantity <= 1) {
      return;
    }
    this.updateLineQuantity(line, line.quantity - 1);
  }

  private clearQtyInputDebounce(): void {
    if (this.qtyInputDebounceTimer) {
      clearTimeout(this.qtyInputDebounceTimer);
      this.qtyInputDebounceTimer = null;
    }
  }

  onQtyInput(line: ICartLineViewModel, raw: string): void {
    if (this.qtyInputDebounceTimer) {
      clearTimeout(this.qtyInputDebounceTimer);
    }
    this.qtyInputDebounceTimer = setTimeout(() => {
      this.qtyInputDebounceTimer = null;
      const n = parseInt(String(raw).trim(), 10);
      if (!Number.isFinite(n) || n < 1) {
        this.cdr.markForCheck();
        return;
      }
      const maxQ = this.maxQty();
      this.updateLineQuantity(line, Math.min(n, maxQ));
    }, 300);
  }

  async removeLine(line: ICartLineViewModel): Promise<void> {
    const cfg: IModalConfig = {
      title: this.state.removeConfirmTitle || 'Remove item',
      modalStyle: RX_MODAL.modalStyles.warning,
      message: this.state.removeConfirmMessage || 'Remove this item from your cart?'
    };
    const ok = await this.rxModalService.confirm(cfg);
    if (!ok) {
      return;
    }
    const itemRd = this.state.cartItemRecordDefinitionName.trim();
    line.busy = true;
    this.cdr.markForCheck();
    this.rxRecordInstanceService.delete(itemRd, line.id).subscribe({
      next: () => {
        this.rxNotificationService.addSuccessMessage('Item removed.');
        this.reload();
      },
      error: (err: unknown) => {
        line.busy = false;
        this.rxLogService.error(`CartView: delete item failed: ${String(err)}`);
        this.rxNotificationService.addErrorMessage('Could not remove the item.');
        this.cdr.markForCheck();
      }
    });
  }

  formatMoney(amount: number): string {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: this.currencyCode }).format(amount);
    } catch {
      return `${this.currencyCode} ${amount.toFixed(2)}`;
    }
  }

  /** Whole-cart sum of line totals (not a per-group subtotal). */
  cartGrandTotal(): number {
    let t = 0;
    for (const g of this.groups) {
      for (const ln of g.lines) {
        if (ln.lineTotal != null && Number.isFinite(ln.lineTotal)) {
          t += ln.lineTotal;
        }
      }
    }
    return roundCurrency(t);
  }

  showCartTotalRow(): boolean {
    return this.showMoney() && this.groups.length > 0;
  }

  /** Per-line cadence when not the fallback single-bucket label from an unset cadence field. */
  showBillingCadenceOnLine(line: ICartLineViewModel): boolean {
    const k = (line.cadenceKey ?? '').trim();
    return k !== '' && k !== 'Items';
  }

  /** Optional accent class for inline cadence text (subtle, not a header pill). */
  cadenceLineClasses(cadence: string): string {
    const key = cadence.trim().toLowerCase();
    let mod = '';
    if (key.includes('month')) {
      mod = 'acv-line__cadence--monthly';
    } else if (key.includes('year')) {
      mod = 'acv-line__cadence--yearly';
    } else if (key.includes('quarter')) {
      mod = 'acv-line__cadence--quarterly';
    }
    return mod ? `acv-line__cadence ${mod}` : 'acv-line__cadence';
  }

  showSubmitButtonFlag(): boolean {
    return this.coerceBool(this.state?.showSubmitButton, true);
  }

  showCancelOrderButtonFlag(): boolean {
    return this.coerceBool(this.state?.showCancelOrderButton, true);
  }

  submitDisabled(): boolean {
    return (
      this.submitting ||
      this.cancelling ||
      this.loading ||
      !this.cartId ||
      this.groups.length === 0 ||
      !this.showSubmitButtonFlag()
    );
  }

  cancelOrderDisabled(): boolean {
    const statusField = this.fid(this.state?.cartStatusFieldId);
    const cancelledVal = (this.state?.cancelledCartStatusValue ?? '').trim();
    return (
      this.cancelling ||
      this.submitting ||
      this.loading ||
      !this.cartId ||
      this.groups.length === 0 ||
      !this.showSubmitButtonFlag() ||
      !this.showCancelOrderButtonFlag() ||
      statusField <= 0 ||
      !cancelledVal
    );
  }

  submitOrder(): void {
    if (this.submitDisabled()) {
      return;
    }
    this.submitting = true;
    this.cdr.markForCheck();

    const cartRd = this.state.cartRecordDefinitionName.trim();
    const notesField = this.fid(this.state.cartNotesFieldId);

    const afterNotes = (): void => {
      const { needsLine, needsCart } = this.submitPersistWorkload();
      if (!needsLine && !needsCart) {
        this.emitSubmitOutput();
        this.submitting = false;
        this.cdr.markForCheck();
        return;
      }
      this.persistItemLinesOnSubmit()
        .pipe(switchMap(() => this.persistCartRollupAndStatus()), takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            this.rxNotificationService.addSuccessMessage('Order submitted.');
            this.emitSubmitOutput();
            this.submitting = false;
            this.reload();
          },
          error: (err: unknown) => {
            this.rxLogService.error(`CartView: submit failed: ${String(err)}`);
            this.rxNotificationService.addErrorMessage('Could not complete submit.');
            this.submitting = false;
            this.cdr.markForCheck();
          }
        });
    };

    if (notesField > 0 && this.orderNotesDraft !== this.orderNotesSaved) {
      this.rxRecordInstanceService.get(cartRd, this.cartId!).subscribe({
        next: (rec) => {
          rec.setFieldValue(notesField, this.orderNotesDraft);
          this.rxRecordInstanceService.save(rec).subscribe({
            next: () => {
              this.orderNotesSaved = this.orderNotesDraft;
              afterNotes();
            },
            error: (err: unknown) => {
              this.rxLogService.error(`CartView: submit notes save failed: ${String(err)}`);
              this.rxNotificationService.addErrorMessage('Could not save order notes.');
              this.submitting = false;
              this.cdr.markForCheck();
            }
          });
        },
        error: (err: unknown) => {
          this.rxLogService.error(`CartView: submit get cart for notes failed: ${String(err)}`);
          this.rxNotificationService.addErrorMessage('Could not load cart.');
          this.submitting = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      afterNotes();
    }
  }

  /** Whether Submit should run line and/or cart record writes (inspector field ids + data). */
  private submitPersistWorkload(): { needsLine: boolean; needsCart: boolean } {
    const qtyF = this.fid(this.state.cartItemQuantityFieldId);
    const totalF = this.fid(this.state.cartItemTotalCostFieldId);
    const lines = this.flattenLines();
    const needsLine = lines.length > 0 && (qtyF > 0 || totalF > 0);
    const totalField = this.fid(this.state.cartOrderTotalFieldId);
    const countField = this.fid(this.state.cartTotalItemCountFieldId);
    const statusField = this.fid(this.state.cartStatusFieldId);
    const submittedVal = (this.state.submittedCartStatusValue ?? '').trim();
    const needsCart =
      totalField > 0 || countField > 0 || (submittedVal.length > 0 && statusField > 0);
    return { needsLine, needsCart };
  }

  private flattenLines(): ICartLineViewModel[] {
    const out: ICartLineViewModel[] = [];
    for (const g of this.groups) {
      out.push(...g.lines);
    }
    return out;
  }

  /** Sum of line quantities (e.g. 1+3+4 = 8). */
  totalItemQuantitySum(): number {
    let n = 0;
    for (const g of this.groups) {
      for (const ln of g.lines) {
        n += ln.quantity;
      }
    }
    return n;
  }

  /** Persist each CART_ITEM quantity + line total using inspector field ids. */
  private persistItemLinesOnSubmit(): Observable<void> {
    const itemRd = this.state.cartItemRecordDefinitionName.trim();
    const qtyF = this.fid(this.state.cartItemQuantityFieldId);
    const totalF = this.fid(this.state.cartItemTotalCostFieldId);
    const lines = this.flattenLines();
    if (!itemRd || lines.length === 0 || (qtyF <= 0 && totalF <= 0)) {
      return of(void 0);
    }
    return forkJoin(
      lines.map((line) =>
        this.rxRecordInstanceService.get(itemRd, line.id).pipe(
          switchMap((rec) => {
            if (qtyF > 0) {
              rec.setFieldValue(qtyF, line.quantity);
            }
            if (totalF > 0) {
              const v = line.lineTotal != null && Number.isFinite(line.lineTotal) ? line.lineTotal : 0;
              rec.setFieldValue(totalF, v);
            }
            return this.rxRecordInstanceService.save(rec);
          })
        )
      )
    ).pipe(map(() => void 0));
  }

  /** Persist CART order total, total item qty, and/or submitted status. */
  private persistCartRollupAndStatus(): Observable<void> {
    const cartRd = this.state.cartRecordDefinitionName.trim();
    const totalField = this.fid(this.state.cartOrderTotalFieldId);
    const countField = this.fid(this.state.cartTotalItemCountFieldId);
    const statusField = this.fid(this.state.cartStatusFieldId);
    const submittedVal = (this.state.submittedCartStatusValue ?? '').trim();
    const hasStatus = submittedVal.length > 0 && statusField > 0;
    const hasRollup = totalField > 0 || countField > 0;
    if (!hasRollup && !hasStatus) {
      return of(void 0);
    }
    const grand = this.cartGrandTotal();
    const qtySum = this.totalItemQuantitySum();
    return this.rxRecordInstanceService.get(cartRd, this.cartId!).pipe(
      switchMap((rec) => {
        if (totalField > 0) {
          rec.setFieldValue(totalField, grand);
        }
        if (countField > 0) {
          rec.setFieldValue(countField, qtySum);
        }
        if (hasStatus) {
          rec.setFieldValue(statusField, submittedVal);
        }
        return this.rxRecordInstanceService.save(rec);
      }),
      map(() => void 0)
    );
  }

  async cancelOrder(): Promise<void> {
    if (this.cancelOrderDisabled()) {
      return;
    }
    const cfg: IModalConfig = {
      title: this.state.cancelOrderConfirmTitle || 'Cancel order',
      modalStyle: RX_MODAL.modalStyles.warning,
      message:
        this.state.cancelOrderConfirmMessage ||
        'Set this cart to cancelled status? You can configure the status value in the inspector.'
    };
    const ok = await this.rxModalService.confirm(cfg);
    if (!ok) {
      return;
    }

    const cartRd = this.state.cartRecordDefinitionName.trim();
    const statusField = this.fid(this.state.cartStatusFieldId);
    const cancelledVal = (this.state.cancelledCartStatusValue ?? '').trim();
    if (!cartRd || statusField <= 0 || !cancelledVal) {
      return;
    }

    this.cancelling = true;
    this.cdr.markForCheck();

    this.rxRecordInstanceService.get(cartRd, this.cartId!).subscribe({
      next: (rec) => {
        rec.setFieldValue(statusField, cancelledVal);
        this.rxRecordInstanceService.save(rec).subscribe({
          next: () => {
            this.rxNotificationService.addSuccessMessage('Cart cancelled.');
            this.emitCancelOutput();
            this.cancelling = false;
            this.reload();
          },
          error: (err: unknown) => {
            this.rxLogService.error(`CartView: cancel save cart failed: ${String(err)}`);
            this.rxNotificationService.addErrorMessage('Could not update cart status.');
            this.cancelling = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err: unknown) => {
        this.rxLogService.error(`CartView: cancel get cart failed: ${String(err)}`);
        this.rxNotificationService.addErrorMessage('Could not load cart for cancel.');
        this.cancelling = false;
        this.cdr.markForCheck();
      }
    });
  }

  showMoney(): boolean {
    return (
      this.fid(this.state.cartItemBasePriceFieldId) > 0 || this.fid(this.state.cartItemUnitPriceFieldId) > 0
    );
  }

  showOrderNotes(): boolean {
    return this.fid(this.state?.cartNotesFieldId ?? '0') > 0;
  }

  trackGroup(_i: number, g: ICartGroupViewModel): string {
    return g.cadenceKey;
  }

  trackLine(_i: number, l: ICartLineViewModel): string {
    return l.id;
  }

  private emitSubmitOutput(): void {
    this.notifyPropertyChanged('cartSubmit', {
      cartId: this.cartId,
      displayId: this.cartDisplayId,
      lineCount: this.rawItemRows.length,
      totalItemQuantity: this.totalItemQuantitySum(),
      cartGrandTotal: this.cartGrandTotal()
    });
  }

  private emitCancelOutput(): void {
    this.notifyPropertyChanged('cartCancel', {
      cartId: this.cartId,
      displayId: this.cartDisplayId,
      lineCount: this.rawItemRows.length
    });
  }

  private persistOrderNotes(): void {
    if (!this.cartId) {
      return;
    }
    const cartRd = this.state.cartRecordDefinitionName.trim();
    const notesField = this.fid(this.state.cartNotesFieldId);
    if (notesField <= 0) {
      return;
    }
    this.savingNotes = true;
    this.cdr.markForCheck();
    this.rxRecordInstanceService.get(cartRd, this.cartId).subscribe({
      next: (rec) => {
        rec.setFieldValue(notesField, this.orderNotesDraft);
        this.rxRecordInstanceService.save(rec).subscribe({
          next: () => {
            this.orderNotesSaved = this.orderNotesDraft;
            this.savingNotes = false;
            this.cdr.markForCheck();
          },
          error: (err: unknown) => {
            this.rxLogService.error(`CartView: save notes failed: ${String(err)}`);
            this.rxNotificationService.addErrorMessage('Could not save order notes.');
            this.savingNotes = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err: unknown) => {
        this.rxLogService.error(`CartView: get cart for notes failed: ${String(err)}`);
        this.savingNotes = false;
        this.cdr.markForCheck();
      }
    });
  }

  private updateLineQuantity(line: ICartLineViewModel, nextQty: number): void {
    const itemRd = this.state.cartItemRecordDefinitionName.trim();
    const qField = this.fid(this.state.cartItemQuantityFieldId);
    if (qField <= 0) {
      return;
    }
    const clamped = Math.max(1, Math.min(nextQty, this.maxQty()));
    if (clamped === line.quantity) {
      this.cdr.markForCheck();
      return;
    }
    const totalField = this.fid(this.state.cartItemTotalCostFieldId);
    const base = line.unitPrice;
    const computedTotal =
      totalField > 0 && base != null && Number.isFinite(base) ? roundCurrency(base * clamped) : null;

    line.busy = true;
    this.cdr.markForCheck();
    this.rxRecordInstanceService.get(itemRd, line.id).subscribe({
      next: (rec) => {
        rec.setFieldValue(qField, clamped);
        if (computedTotal != null) {
          rec.setFieldValue(totalField, computedTotal);
        }
        this.rxRecordInstanceService.save(rec).subscribe({
          next: () => {
            line.busy = false;
            this.patchRawItemRowQuantityAndTotal(line.id, clamped, computedTotal);
            this.rebuildGroups();
            this.cdr.markForCheck();
          },
          error: (err: unknown) => {
            line.busy = false;
            this.rxLogService.error(`CartView: quantity save failed: ${String(err)}`);
            this.rxNotificationService.addErrorMessage('Could not update quantity.');
            this.reload();
          }
        });
      },
      error: (err: unknown) => {
        line.busy = false;
        this.rxLogService.error(`CartView: get line for quantity failed: ${String(err)}`);
        this.rxNotificationService.addErrorMessage('Could not load line item.');
        this.cdr.markForCheck();
      }
    });
  }

  /** @context rebuildGroups reads rawItemRows — without this patch the UI reverted to the pre-save quantity */
  private patchRawItemRowQuantityAndTotal(lineId: string, nextQty: number, lineTotal: number | null): void {
    const qtyF = this.fid(this.state.cartItemQuantityFieldId);
    const totalF = this.fid(this.state.cartItemTotalCostFieldId);
    for (const row of this.rawItemRows) {
      if (this.rowId(row) !== lineId) {
        continue;
      }
      if (qtyF > 0) {
        row[String(qtyF)] = nextQty;
      }
      if (totalF > 0 && lineTotal != null) {
        row[String(totalF)] = lineTotal;
      }
      break;
    }
  }

  /** Non-empty evaluated expression wins; otherwise static config / IUser. */
  private coerceExpressionToFilterString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string') {
      const t = value.trim();
      return t === '' || t === 'undefined' || t === 'null' ? '' : t;
    }
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return String(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : '';
    }
    const s = String(value).trim();
    return s === '' || s === 'undefined' || s === 'null' ? '' : s;
  }

  private resolvedActiveCartStatusForQuery(): string {
    const fromExpr = this.coerceExpressionToFilterString(this.state.activeCartStatusExpression);
    if (fromExpr !== '') {
      return fromExpr;
    }
    return (this.state.activeCartStatusValue ?? '').trim();
  }

  private resolvedCustodianForQuery(): string {
    const fromExpr = this.coerceExpressionToFilterString(this.state.custodianFilterExpression);
    if (fromExpr !== '') {
      return fromExpr;
    }
    return this.custodianValue().trim();
  }

  private custodianValue(): string {
    const u = this.rxCurrentUserService.get();
    switch (this.state.custodianMatchSource) {
      case 'loginName':
        return u.loginName ?? '';
      case 'userId':
        return u.userId ?? '';
      case 'personInstanceId':
        return u.personInstanceId ?? '';
      case 'emailAddress':
        return u.emailAddress ?? '';
      case 'fullName':
      default:
        return u.fullName ?? u.loginName ?? '';
    }
  }

  private restrictCartToCurrentUserFlag(): boolean {
    return this.coerceBool(this.state?.restrictCartToCurrentUser, true);
  }

  /**
   * AR qualification: selection fields compare to **numeric** internal values; character fields use double-quoted text.
   */
  private qualificationValueEquals(fieldId: number, raw: string): string {
    const t = raw.trim();
    if (!t || fieldId <= 0) {
      return '';
    }
    if (/^-?\d+$/.test(t)) {
      return `'${fieldId}' = ${t}`;
    }
    return `'${fieldId}' = "${qualEscape(t)}"`;
  }

  private buildActiveCartQueryExpression(statusFieldId: number, custodianFieldId: number): string {
    const statusPart = this.qualificationValueEquals(statusFieldId, this.resolvedActiveCartStatusForQuery());
    const custodian = this.resolvedCustodianForQuery();
    // @context Custodian filter (expression) must apply even when Restrict is off — authors expect the expression to scope the cart.
    const custodianFromExpression =
      this.coerceExpressionToFilterString(this.state.custodianFilterExpression) !== '';
    const needCustodian =
      custodianFieldId > 0 &&
      (this.restrictCartToCurrentUserFlag() || custodianFromExpression);
    if (needCustodian && !custodian) {
      return '';
    }
    const custodianPart =
      needCustodian && custodian ? `'${custodianFieldId}' = "${qualEscape(custodian)}"` : '';

    if (statusPart && custodianPart) {
      return `${statusPart} AND ${custodianPart}`;
    }
    if (statusPart) {
      return statusPart;
    }
    if (custodianPart) {
      return custodianPart;
    }
    return '';
  }

  private fetchActiveCart(cartRd: string, itemRd: string): void {
    const stFid = this.fid(this.state.cartStatusFieldId);
    const cuFid = this.fid(this.state.custodianFieldId);
    const q = this.buildActiveCartQueryExpression(stFid, cuFid);

    if (!q.trim()) {
      this.loadError = this.restrictCartToCurrentUserFlag()
        ? 'Could not build cart query: set Active cart status value and ensure the current user has a value for Custodian match (or turn off Restrict cart to current user for testing).'
        : 'Could not build cart query: set Active cart status value.';
      this.resetCartState();
      this.cdr.markForCheck();
      return;
    }

    this.rxLogService.debug(`CartView: cart queryExpression: ${q}`);

    const params: IDataPageParams = {
      recorddefinition: cartRd,
      propertySelection: this.buildCartPropertySelection(),
      pageSize: 50,
      startIndex: 0,
      queryExpression: q
    };

    this.loading = true;
    this.cdr.markForCheck();

    this.rxRecordInstanceDataPageService
      .post({ params })
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res: IDataPageResult) => {
          const rows = (res.data ?? []) as DataRow[];
          const picked = this.pickLatestCart(rows);
          if (!picked) {
            this.resetCartState();
            this.cartId = null;
            this.cdr.markForCheck();
            return;
          }
          this.cartId = this.rowId(picked);
          this.cartDisplayId = String(getRowValue(picked, 1) ?? this.cartId);
          this.currencyCode = this.resolveCurrency(picked);
          const notesF = this.fid(this.state.cartNotesFieldId);
          this.orderNotesDraft = notesF > 0 ? String(getRowValue(picked, notesF) ?? '') : '';
          this.orderNotesSaved = this.orderNotesDraft;
          this.fetchItems(itemRd, this.cartId);
        },
        error: (err: unknown) => {
          this.rxLogService.error(`CartView: cart query failed: ${String(err)}`);
          this.loadError = 'Could not load cart.';
          this.resetCartState();
        }
      });
  }

  private fetchItems(itemRd: string, parentCartId: string): void {
    this.rawItemRows = [];
    this.groups = [];
    this.cdr.markForCheck();

    const fk = this.fid(this.state.cartItemCartFkFieldId);
    const q = `'${fk}' = "${qualEscape(parentCartId)}"`;
    const params: IDataPageParams = {
      recorddefinition: itemRd,
      propertySelection: this.buildItemPropertySelection(),
      pageSize: -1,
      startIndex: 0,
      queryExpression: q
    };

    this.loading = true;
    this.cdr.markForCheck();

    this.rxRecordInstanceDataPageService
      .post({ params })
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res: IDataPageResult) => {
          this.rawItemRows = (res.data ?? []) as DataRow[];
          this.rebuildGroups();
        },
        error: (err: unknown) => {
          this.rxLogService.error(`CartView: items query failed: ${String(err)}`);
          this.loadError = 'Could not load cart items.';
          this.rawItemRows = [];
          this.groups = [];
        }
      });
  }

  private rebuildGroups(): void {
    const baseF = this.fid(this.state.cartItemBasePriceFieldId);
    const legacyUnitF = this.fid(this.state.cartItemUnitPriceFieldId);
    const qtyF = this.fid(this.state.cartItemQuantityFieldId);
    const nameF = this.fid(this.state.cartItemProductNameFieldId);
    const cadenceF = this.fid(this.state.cartItemBillingCadenceFieldId);
    const order = this.parseCadenceOrder(this.state.billingCadenceOrderJson);
    const priceSourceF = baseF > 0 ? baseF : legacyUnitF;

    const lines: ICartLineViewModel[] = this.rawItemRows.map((row) => {
      const id = this.rowId(row);
      const displayName = String(getRowValue(row, nameF) ?? getRowValue(row, 8) ?? 'Item');
      const qtyRaw = getRowValue(row, qtyF);
      const quantity = Math.max(1, parseInt(String(qtyRaw ?? '1'), 10) || 1);
      let unitPrice: number | null = null;
      if (priceSourceF > 0) {
        const p = parseFloat(String(getRowValue(row, priceSourceF) ?? '0'));
        unitPrice = Number.isFinite(p) ? p : null;
      }
      const lineTotal =
        unitPrice != null && Number.isFinite(unitPrice) ? roundCurrency(unitPrice * quantity) : null;
      const cadenceRaw = cadenceF > 0 ? getRowValue(row, cadenceF) : null;
      const cadenceKey =
        cadenceRaw != null && String(cadenceRaw).trim() !== '' ? String(cadenceRaw).trim() : 'Items';

      return { id, displayName, unitPrice, lineTotal, quantity, cadenceKey, busy: false };
    });

    const byCadence = new Map<string, ICartLineViewModel[]>();
    for (const ln of lines) {
      const list = byCadence.get(ln.cadenceKey) ?? [];
      list.push(ln);
      byCadence.set(ln.cadenceKey, list);
    }

    const keys = Array.from(byCadence.keys());
    keys.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      if (sa !== sb) {
        return sa - sb;
      }
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });

    this.groups = keys.map((k) => {
      const gLines = byCadence.get(k) ?? [];
      let subtotal = 0;
      if (priceSourceF > 0) {
        for (const ln of gLines) {
          if (ln.lineTotal != null) {
            subtotal += ln.lineTotal;
          }
        }
      }
      return { cadenceKey: k, lines: gLines, subtotal };
    });
  }

  private parseCadenceOrder(raw: string): string[] {
    const t = (raw ?? '').trim();
    if (!t) {
      return [];
    }
    try {
      const v = JSON.parse(t) as unknown;
      if (Array.isArray(v)) {
        return v.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      /* ignore */
    }
    return [];
  }

  private resolveCurrency(cartRow: DataRow): string {
    const cf = this.fid(this.state.cartCurrencyFieldId);
    if (cf > 0) {
      const v = getRowValue(cartRow, cf);
      if (v != null && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return (this.state.defaultCurrencyCode ?? 'USD').trim() || 'USD';
  }

  private pickLatestCart(rows: DataRow[]): DataRow | null {
    if (rows.length === 0) {
      return null;
    }
    if (rows.length === 1) {
      return rows[0];
    }
    this.rxLogService.debug(`CartView: multiple active carts (${rows.length}); using most recently modified.`);
    return rows
      .map((r) => ({ r, t: Date.parse(String(getRowValue(r, 6) ?? '')) || 0 }))
      .sort((a, b) => b.t - a.t)[0].r;
  }

  private resetCartState(): void {
    this.cartId = null;
    this.cartDisplayId = '';
    this.orderNotesDraft = '';
    this.orderNotesSaved = '';
    this.rawItemRows = [];
    this.groups = [];
  }

  private rowId(row: DataRow): string {
    const v = getRowValue(row, 379) ?? row['$ID$'] ?? row['379'];
    return String(v ?? '');
  }

  private buildCartPropertySelection(): number[] {
    const extra = [
      this.fid(this.state.custodianFieldId),
      this.fid(this.state.cartStatusFieldId),
      this.fid(this.state.cartNotesFieldId),
      this.fid(this.state.cartOrderTotalFieldId),
      this.fid(this.state.cartTotalItemCountFieldId),
      this.fid(this.state.cartCurrencyFieldId)
    ];
    return uniqueNums([...coreFieldIds(), ...extra.filter((n) => n > 0)]);
  }

  private buildItemPropertySelection(): number[] {
    const extra = [
      this.fid(this.state.cartItemCartFkFieldId),
      this.fid(this.state.cartItemQuantityFieldId),
      this.fid(this.state.cartItemProductNameFieldId),
      this.fid(this.state.cartItemBasePriceFieldId),
      this.fid(this.state.cartItemUnitPriceFieldId),
      this.fid(this.state.cartItemTotalCostFieldId),
      this.fid(this.state.cartItemBillingCadenceFieldId),
      8
    ];
    return uniqueNums([...coreFieldIds(), ...extra.filter((n) => n > 0)]);
  }

  private fid(s: string): number {
    const n = parseInt(String(s ?? '').trim(), 10);
    return Number.isFinite(n) ? n : 0;
  }

  private maxQty(): number {
    const n = parseInt(String(this.state.maxQuantityPerLine ?? '9999'), 10);
    return Number.isFinite(n) && n >= 1 ? n : 9999;
  }

  private coerceBool(value: unknown, defaultValue: boolean): boolean {
    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false;
    }
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true;
    }
    return defaultValue;
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as ICartViewProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'name':
      case 'pageTitle':
      case 'emptyStateMessage':
      case 'noActiveCartMessage':
      case 'orderNotesLabel':
      case 'submitOrderLabel':
      case 'removeConfirmTitle':
      case 'removeConfirmMessage':
      case 'removeLineActionLabel':
      case 'cartTotalAmountLabel':
      case 'lineItemBillingLabel':
      case 'cancelOrderLabel':
      case 'cancelOrderConfirmTitle':
      case 'cancelOrderConfirmMessage':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as ICartViewProperties;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'cartRecordDefinitionName':
      case 'cartItemRecordDefinitionName':
      case 'custodianFieldId':
      case 'cartStatusFieldId':
      case 'activeCartStatusValue':
      case 'activeCartStatusExpression':
      case 'custodianFilterExpression':
      case 'custodianMatchSource':
      case 'restrictCartToCurrentUser':
      case 'cartNotesFieldId':
      case 'cartOrderTotalFieldId':
      case 'cartTotalItemCountFieldId':
      case 'cartCurrencyFieldId':
      case 'defaultCurrencyCode':
      case 'cartItemCartFkFieldId':
      case 'cartItemQuantityFieldId':
      case 'cartItemProductNameFieldId':
      case 'cartItemBasePriceFieldId':
      case 'cartItemUnitPriceFieldId':
      case 'cartItemTotalCostFieldId':
      case 'cartItemBillingCadenceFieldId':
      case 'billingCadenceOrderJson':
      case 'showSubmitButton':
      case 'submittedCartStatusValue':
      case 'showCancelOrderButton':
      case 'cancelledCartStatusValue':
      case 'maxQuantityPerLine':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as ICartViewProperties;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.reload();
        this.cdr.markForCheck();
        break;
      default:
        return throwError(() => new Error(`CartView: property ${propertyPath} is not settable.`));
    }
  }
}

function coreFieldIds(): number[] {
  const core = RX_RECORD_DEFINITION.coreFieldIds as Record<string, number | string>;
  const out: number[] = [];
  for (const v of Object.values(core)) {
    const n = typeof v === 'number' ? v : parseInt(String(v), 10);
    if (Number.isFinite(n)) {
      out.push(n);
    }
  }
  return out;
}

function uniqueNums(ids: number[]): number[] {
  return Array.from(new Set(ids.filter((n) => n > 0)));
}

function getRowValue(row: DataRow, fieldId: number): unknown {
  if (!row) {
    return undefined;
  }
  const a = row[String(fieldId)];
  if (a !== undefined && a !== null) {
    return a;
  }
  const b = row[fieldId as unknown as string];
  return b;
}

function qualEscape(value: string): string {
  return (value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '""');
}

function roundCurrency(n: number): number {
  return Math.round(n * 100) / 100;
}
