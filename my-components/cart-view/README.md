# Active cart view component

Standalone view component that loads **one active `CART`** for the current user (custodian + cart status), lists **`CART_ITEM`** rows, groups them by **billing cadence**, supports **quantity** updates, **remove line**, **order notes**, and optional **submit** (status transition + `cartSubmit` output).

Theming and responsiveness follow **`catalog-view`**: CSS variables (`--color-*`) and `:host` **container queries** so the layout reflows in narrow Helix columns.

## Copy into your bundle library

1. Copy `my-components/cart-view/` into your app library, e.g. `libs/<application-name>/src/lib/view-components/cart-view/`.
2. Replace selectors and registration `type` / `@RxViewComponent({ name })` if your application prefix is not `com-example-sample-application` (must match your other view components).
3. Import `CartViewRegistrationModule` in your view-components registration module (same pattern as other VC registration modules).
4. Deploy the bundle and add **Active cart (grouped)** from the palette in View Designer.

## Expression properties

- **Active cart status (expression)** — When non-empty, replaces **Active cart status value** in the query (e.g. `"Active"`).
- **Custodian filter (expression)** — When non-empty, replaces **Custodian match** (use for custom user / view-input filtering).

## Troubleshooting: “No active cart”

1. **Character Cart Status** — Use **Active cart status value** `Active` or an expression that returns `Active`. All-digit values use numeric qualification; anything else is quoted text.
2. **Custodian** — Use **Custodian filter (expression)** if dropdown **Custodian match** doesn’t match stored data.
3. **Quick test** — Turn **Restrict cart to current user** off; if a cart appears, fix custodian mapping.
4. **Debug** — `CartView: cart queryExpression:` in the console (debug).

## Inspector configuration

| Area | Purpose |
|------|---------|
| **Cart / Cart item record definition** | Fully qualified names (`bundleId:CART`, `bundleId:CART_ITEM`). |
| **Custodian field id** | Must match how you store owner on `CART` (e.g. `536870913`). |
| **Cart status field id** + **Active cart status value** | Query for the open cart (e.g. `536870914` = `Active`). |
| **Custodian match** | `RxCurrentUserService.get().fullName` vs `.loginName` — must match stored custodian values. |
| **Billing cadence field id** | `CART_ITEM` field used to group lines (Monthly / Yearly / Quarterly, etc.). `0` = single group **Items**. |
| **Base price field id** | Decimal per-unit price; preferred for **Base price** + **Line total** (base × qty). `0` uses **Unit price field id** instead. |
| **Unit price field id** | Legacy decimal when base price id is `0`. Either base or unit must be set to show money. |
| **Total cart item cost field id** | Optional; `0` skips. When set, persisted as base × quantity whenever quantity changes. |
| **Submitted cart status value** | Non-empty: after saving notes, sets **cart status field** to this value. Empty: only fires **`cartSubmit`** output for a view action / process. |

Default field ids match the sample **`com.amar.hssb`** cart schema discussed in the project; adjust for your definitions.

## View Designer outputs

Bind a view action to **`cartSubmit`** when `submittedCartStatusValue` is empty, or in addition to the status update. Payload shape:

```ts
{ cartId: string; displayId: string; lineCount: number }
```

## Runtime API (`setProperty` / `api`)

- `api.refresh()` — reloads cart and items from the server.
- Standard `hidden` and other configured properties via `setProperty`.

## `data-testid` hooks

`cart-title`, `cart-root`, `cart-no-active`, `cart-empty`, `order-notes`, `submit-order`, per-line `cart-item-{id}-*`, per-group `cart-group-{slug}-subtotal`.
