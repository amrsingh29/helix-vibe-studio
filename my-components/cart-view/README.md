# Active cart view component

Standalone view component that loads **one active `CART`** for the current user (custodian + cart status), lists **`CART_ITEM`** rows, groups them by **billing cadence**, supports **quantity** updates, **remove line**, **order notes**, and **submit / cancel order** (cart status updates + optional `cartSubmit` / `cartCancel` outputs). The page title uses the DPL **cart** icon tinted with `--color-action`.

Theming and responsiveness follow **`catalog-view`**: CSS variables (`--color-*`) and `:host` **container queries** so the layout reflows in narrow Helix columns.

## Layout & remove action (UX)

- **Remove** sits on the **same row as the product title** (top-right of the card), as a **compact text control** with underline — it stays out of the **price block** so users don’t confuse it with amounts or quantity.
- **Billing cadence** (when the field is configured and not the fallback `Items` bucket) appears **under the title** as a muted row with an optional **Billing cycle** label and the value (e.g. One Off). Optional **left border** color hints Monthly / Yearly / Quarterly in the label text.
- **No header pill**: a single cadence group no longer shows a pill row; **multiple** cadence groups get a small **section title** only.
- **Cart total**: one row **below all line items** — label **Total amount** (configurable) and the **sum of all line totals** (whole cart), right-aligned with a **Helix action** left accent (`--color-action`).
- **Actions**: **Submit order** uses Adapt **`primary`** (platform primary fill). **Cancel order** uses **`secondary`**; confirms in a modal, then sets **Cancelled cart status value** on the cart record.

## Copy into your bundle library

1. Copy `my-components/cart-view/` into your app library, e.g. `libs/<application-name>/src/lib/view-components/cart-view/`.
2. Align selectors and registration `type` / `@RxViewComponent({ name })` with your bundle prefix (this repo uses `com-amar-helix-vibe-studio-cart-view`; all three must match). Palette group is **Helix Vibe Studio** (`group: 'Helix Vibe Studio'` in registration).
3. Import `CartViewRegistrationModule` in your view-components registration module (same pattern as other VC registration modules).
4. Deploy the bundle and add **Active cart (grouped)** from the palette in View Designer.

## Expression-driven filters (`enableExpressionEvaluation: true`)

- **Active cart status (expression)** — Non-empty evaluated string replaces **Active cart status value** (e.g. `"Active"` for a character field).
- **Custodian filter (expression)** — Non-empty evaluated string replaces **Custodian match** for the user/owner filter.

## Troubleshooting: “No active cart”

1. **Character Cart Status** — Set **Active cart status value** to `Active` (or use the expression). All-digit values use numeric qualification; otherwise the value is quoted as text.
2. **Custodian** — Use **Custodian filter (expression)** when the dropdown user field doesn’t match your stored custodian value.
3. **Quick test** — Disable **Restrict cart to current user**; if a cart appears, fix custodian mapping.
4. **Console** — `CartView: cart queryExpression:` (debug).

## Inspector configuration

| Area | Purpose |
|------|---------|
| **Cart / Cart item record definition** | Fully qualified names (`bundleId:CART`, `bundleId:CART_ITEM`). |
| **Custodian field id** | Must match how you store owner on `CART` (e.g. `536870913`). |
| **Cart status field id** + **Active cart status value** | Status filter: use **number** for selection fields, exact text for character fields. |
| **Custodian match** | Which `IUser` field is compared to the custodian column. |
| **Restrict cart to current user** | Off = status-only query (testing / shared dev data). |
| **Billing cadence field id** | `CART_ITEM` field used to group lines (Monthly / Yearly / Quarterly, etc.). `0` = single group **Items**. |
| **Base price field id** | Decimal per-unit price; preferred for **Base price** + **Line total** (base × qty). `0` uses **Unit price field id** instead. |
| **Unit price field id** | Legacy decimal when base price id is `0`. Either base or unit must be set to show money. |
| **Total cart item cost field id** | Optional; `0` skips. When set, persisted as base × quantity whenever quantity changes. |
| **Remove line button label** | Text for the per-row remove control (default `Remove`). |
| **Cart total label** | Label for the whole-cart sum row (default `Total amount`). |
| **Per-line billing label** | Muted label before cadence on each card (default `Billing cycle`). |
| **Submitted cart status value** | Default **`Submitted`**. After saving notes, sets **cart status field** to this value. Empty: skips the status write but still fires **`cartSubmit`**. |
| **Show cancel order button** | When on (default), shows **Cancel order** beside Submit. |
| **Cancel order** labels / confirm text | Button label and modal title/message for cancel. |
| **Cancelled cart status value** | Written to **cart status field** when cancel is confirmed (default **`Cancelled`**; use selection internal value if needed). |

Default field ids match the sample **`com.amar.hssb`** cart schema discussed in the project; adjust for your definitions.

## View Designer outputs

- **`cartSubmit`** — Fired after a successful submit (after status update when configured). Bind view actions for custom flows; clearing **Submitted cart status value** skips the status write but still emits this output.
- **`cartCancel`** — Fired after a successful cancel (status updated to **Cancelled cart status value**).

Payload shape (both):

```ts
{ cartId: string; displayId: string; lineCount: number }
```

## Runtime API (`setProperty` / `api`)

- `api.refresh()` — reloads cart and items from the server.
- Standard `hidden` and other configured properties via `setProperty`.

## `data-testid` hooks

`cart-title`, `cart-root`, `cart-no-active`, `cart-empty`, `order-notes`, `cancel-order`, `submit-order`, per-line `cart-item-{id}-*`, per-group `cart-group-{slug}-subtotal`.
