# Button

## Description

A button performs an action in response to an object or selection, whereas a link is a navigational element that connects 2 places.

### Guidance
- Use clear verbs for action names and keep them short to avoid clutter.
- Generally the button size should match the size of any input fields grouped with the button, with the default size recommended in most cases.
- Large buttons are intended for calls to action, typically on a landing or sign in page.
- Small buttons are most appropriate for small containers or secondary panels where space is constrained.
- Do not use Small exclusively to get more controls on the screen at once, as this can be overwhelming and increase cognitive load.
- Recommended placement of buttons is provided in the defaults for ADAPT container components.
- **Important!** Please make sure you handle `keyup.enter` event once component is used by tag `adapt-button` to be fully accessible.

## Import

```typescript
import {AdaptButtonModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-button, button[adapt-button], a[adapt-button]`

**Exported as:** `adaptBtn`

## Properties

### @Inputs

| Name | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| type | 'btn-type' | ButtonColorType | - | Specifies type of the button. Supported values: "primary", "secondary", "tertiary", "toolbar", "success", "info", "warning", "critical", "special" |
| size | 'size' | ButtonSizeType | - | Specifies size of the button. Supported values: "xtra-small", "small", "large", "default", "xtra-large", "block" |
| disabled | - | boolean | false | When present, it specifies that the element should be disabled |
| typeAttr | 'type' | ButtonTypeAttribute | - | Native button type attribute |
| tabIndex | - | number | - | Native element tabindex (available since v10.14.0) |

### Exported Types

**ButtonColorType:**
```typescript
ButtonColorType = ColorVariantType | 'secondary' | 'tertiary' | 'toolbar' | 'critical' | 'special';
```

**ButtonTypeAttribute:**
```typescript
ButtonTypeAttribute = 'button' | 'submit' | 'reset';
```

**ButtonSizeType:**
```typescript
ButtonSizeType = 'xtra-large' | 'xtra-small' | 'small' | 'default' | 'large' | 'block';
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {ButtonSize, ColorVariantType} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'adapt-button-demo',
  templateUrl: './button.demo.html'
})
export class AdaptButtonDemoComponent {
  currentButtonType: ColorVariantType | 'secondary' | 'tertiary' | 'critical' = 'primary';
  currentButtonSize: ButtonSize | 'default' = 'default';
  disabledButton: boolean = false;
}
```

### HTML Template

```html
<button adapt-button
        [btn-type]="currentButtonType"
        [size]="currentButtonSize"
        [disabled]="disabledButton">
  <span>Button title</span>
</button>
```

### Button Types

- **Primary:** Conveys the most common or significant action on the page. Used to submit information or commit a change (e.g., Save). Generally there should only be one primary button in a given context.
- **Secondary:** Used for functions that are less significant than a primary button (e.g., Cancel) or when there are multiple important actions with no clear "primary".
- **Tertiary (Link buttons):** Represents functions that are lower priority than a secondary button. Although visually similar to text links, they are functionally different - they perform actions rather than navigate.
- **State styles (success, info, warning, critical):** Used only for special circumstances where the function behind a button is stately.

