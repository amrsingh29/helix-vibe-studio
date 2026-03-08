# List Selector (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The list selector component provides a scrollable list interface for selecting one or multiple items, with support for search, custom item templates, and keyboard navigation.

## Import

```typescript
import {AdaptRxListSelectorModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-list-selector`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| items | any[] | [] | Array of items to display in the list |
| multiple | boolean | false | Enable multiple selection |
| searchable | boolean | false | Enable search functionality |
| displayProperty | string | 'name' | Property to display for each item |
| valueProperty | string | 'value' | Property to use as value for each item |
| maxHeight | number | 300 | Maximum height of the list in pixels |
| itemTemplate | TemplateRef | - | Custom template for item rendering |
| emptyMessage | string | 'No items available' | Message to display when list is empty |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| placeholder | string | 'Search...' | Search placeholder text |
| ariaLabel | string | - | Control [aria-label] attribute text |
| ariaLabelledby | string | - | Control [aria-labeledby] attribute text |
| ariaDescribedBy | string | - | Control [aria-describedby] attribute text |
| testID | string | - | String for test id data attribute |
| id | string | - | Control [id] |
| disabled | boolean | - | Control [disabled] attribute |
| readonly | boolean | - | Control [readonly] attribute |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onFocus | EventEmitter<FocusEvent> | Focus emitter |
| onBlur | EventEmitter<FocusEvent> | Blur emitter |
| selectionChange | EventEmitter<any> | Emits when selection changes |
| itemClick | EventEmitter<any> | Emits when item is clicked |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-list-selector-demo',
  templateUrl: './list-selector-demo.html'
})
export class ListSelectorDemoComponent {
  products: Product[] = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Mouse', category: 'Electronics', price: 29 },
    { id: 3, name: 'Keyboard', category: 'Electronics', price: 79 },
    { id: 4, name: 'Monitor', category: 'Electronics', price: 299 },
    { id: 5, name: 'Desk', category: 'Furniture', price: 199 }
  ];

  selectedProduct: Product = null;
  selectedProducts: Product[] = [];

  // Reactive forms
  form = new FormGroup({
    product: new FormControl(null),
    products: new FormControl([])
  });

  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }

  onItemClick(item: any): void {
    console.log('Item clicked:', item);
  }
}
```

### HTML Template

```html
<!-- Single Selection -->
<adapt-rx-list-selector [(ngModel)]="selectedProduct"
                        [items]="products"
                        [label]="'Select Product'"
                        [displayProperty]="'name'"
                        [valueProperty]="'id'"
                        [searchable]="true"
                        [maxHeight]="400"
                        (selectionChange)="onSelectionChange($event)"
                        (itemClick)="onItemClick($event)"></adapt-rx-list-selector>

<!-- Multiple Selection -->
<adapt-rx-list-selector [(ngModel)]="selectedProducts"
                        [items]="products"
                        [label]="'Select Products'"
                        [multiple]="true"
                        [displayProperty]="'name'"
                        [valueProperty]="'id'"
                        [searchable]="true"></adapt-rx-list-selector>

<!-- Simple String Array -->
<adapt-rx-list-selector [(ngModel)]="selectedItem"
                        [items]="['Option 1', 'Option 2', 'Option 3', 'Option 4']"
                        [label]="'Select Option'"
                        [maxHeight]="250"></adapt-rx-list-selector>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-list-selector formControlName="product"
                          [items]="products"
                          [label]="'Choose Product'"
                          [requiredLabel]="'*'"
                          [displayProperty]="'name'"
                          [valueProperty]="'id'"
                          [searchable]="true"></adapt-rx-list-selector>
  
  <adapt-rx-list-selector formControlName="products"
                          [items]="products"
                          [label]="'Choose Multiple Products'"
                          [multiple]="true"
                          [displayProperty]="'name'"
                          [valueProperty]="'id'"
                          [searchable]="true"></adapt-rx-list-selector>
</form>

<!-- Without Search -->
<adapt-rx-list-selector [(ngModel)]="selectedProduct"
                        [items]="products"
                        [label]="'Products'"
                        [displayProperty]="'name'"
                        [searchable]="false"
                        [maxHeight]="300"></adapt-rx-list-selector>

<!-- With Tooltip and SubLabel -->
<adapt-rx-list-selector [(ngModel)]="selectedProduct"
                        [items]="products"
                        [label]="'Featured Products'"
                        [subLabel]="'Select a product from the list'"
                        [tooltip]="{text: 'Click to select a product'}"
                        [displayProperty]="'name'"
                        [valueProperty]="'id'"
                        [searchable]="true"></adapt-rx-list-selector>

<!-- With Empty Message -->
<adapt-rx-list-selector [(ngModel)]="selectedProduct"
                        [items]="[]"
                        [label]="'Products'"
                        [emptyMessage]="'No products available at the moment'"
                        [displayProperty]="'name'"></adapt-rx-list-selector>
```

## Key Features

- Single and multiple selection modes
- Scrollable list with configurable max height
- Search functionality
- Support for object arrays with custom display/value properties
- Custom item templates
- Empty state message
- Label and sub-label support
- Template-driven and reactive forms support
- Tooltip/popover integration
- Keyboard navigation
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Selection change and item click events
- Visual selection indicators

