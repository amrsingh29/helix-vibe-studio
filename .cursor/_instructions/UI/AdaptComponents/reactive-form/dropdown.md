# Dropdown

## Description

Dropdowns expose a list of options or a selection of related controls, typically from a source control like a button or icon.

Use dropdowns when you need to disclose more complex options than simple selection. For selection-oriented tasks, like you would see in forms, consider using the select component.

## Import

```typescript
import {AdaptDropdownModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Main Selector:** `adapt-dropdown, [adaptDropdown]`

**Menu Selector:** `[adaptDropdownMenu]`

**Menu Template Selector:** `ng-template[adaptDropdownMenuTemplate]`

**Anchor Selector:** `[adaptDropdownAnchor]`

**Toggle Selector:** `[adaptDropdownToggle]`

**Exported as:** `adaptDropdown`

## Properties

### @Inputs (adapt-dropdown)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| autoClose | boolean \| 'outside' \| 'inside' | true | Controls when dropdown auto-closes. true: closes on both outside and inside clicks; false: never auto-closes; 'outside': closes on outside clicks only; 'inside': closes on menu clicks only |
| customClass | string | - | Class for dropdown window component, need to differentiate tablet/mobile sizes per component |
| closeOnEscape | boolean | - | Automatically 'true' if autoClose != false |
| placement | PlacementArray | 'auto' | Placement of dropdown: "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-top", "left-bottom", "right", "right-top", "right-bottom" and array of above values |
| animationPlacement | 'auto' \| 'center' | 'auto' | Animation transform-origin property |
| holdFocusInMenu | boolean | false | Hold Tab key focus in the dropdownMenu area |

### @Inputs (adaptDropdownToggle)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| showCaret | boolean | true | Controls caret visibility (Since v10.14.0) |
| dropdownTogglerType | AdaptDropdownTogglerType | 'default' | Set caret color type. Can be useful if the button looks like a link (Since v10.17.0) |
| ariaHasPopupAttr | string | 'true' | Sets the value of the aria-haspopup attribute (Since v14.16.0) |

### @Inputs (adaptDropdownAnchor)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| ariaHasPopupAttr | string | 'false' | Sets the value of the aria-haspopup attribute (Since v14.16.0) |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {PlacementArray} from '@bmc-ux/adapt-angular';

interface DropdownItem {
  item: string;
}

@Component({
  selector: 'adapt-dropdown-demo',
  templateUrl: './dropdown.demo.html'
})
export class AdaptDropdownDemoComponent {
  dropdownPlacement: PlacementArray = 'bottom-left';
  activeIndex: number;
  
  list: DropdownItem[] = [
    { item: 'Option 1' },
    { item: 'Option 2' },
    { item: 'Option 3' },
    { item: 'Option 4' }
  ];

  onItemClick(index: number): void {
    this.activeIndex = index;
    console.log('Selected:', this.list[index]);
  }
}
```

### HTML Template

```html
<!-- Basic Dropdown -->
<div class="dropdown" adaptDropdown #dropdown="adaptDropdown" [placement]="dropdownPlacement">
  <button class="btn btn-secondary" 
          adaptDropdownToggle
          type="button">
    Dropdown Button
  </button>
  
  <div adaptDropdownMenu class="dropdown-menu">
    <button *ngFor="let option of list; let i = index"
            class="dropdown-item"
            [class.active]="activeIndex === i"
            (click)="onItemClick(i)"
            type="button">
      {{option.item}}
    </button>
  </div>
</div>

<!-- Dropdown with Template -->
<div class="dropdown" adaptDropdown>
  <button class="btn btn-secondary" adaptDropdownToggle>
    Select Option
  </button>
  
  <ng-template adaptDropdownMenuTemplate>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="#">Action</a>
      <a class="dropdown-item" href="#">Another action</a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#">Separated link</a>
    </div>
  </ng-template>
</div>
```

## Key Features

- Multiple placement options (top, bottom, left, right with variants)
- Auto-close behavior (outside, inside, or both)
- Keyboard navigation support
- Customizable toggle button with optional caret
- Template-based menu content
- Accessibility support (ARIA attributes)
- Focus management
- Custom styling support
- Ideal for action menus, option lists, and complex selections

