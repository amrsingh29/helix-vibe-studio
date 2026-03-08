# Multi-Card Carousel

## Description

A multi-card carousel component that displays multiple cards in a horizontal scrollable container. Unlike the standard carousel, this component shows multiple items at once and allows for card-based navigation with customizable styling and auto-play functionality.

## Import

```typescript
import {AdaptMultiCardModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Main Component Selector:** `adapt-multi-card`

**Slide Selector:** `adapt-multi-card-slide`

**Line Selector:** `adapt-multi-card-line`

## Properties

### @Inputs (adapt-multi-card-slide)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| tabindex | number | 0 | Sets the value to the tabindex attr |
| order | number | - | If present, it expects a parameter by which the slides will be filtered |

### @Inputs (adapt-multi-card)

| Name | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| statusBar | - | boolean | false | When present, it indicates that the tabs navigation should be displayed |
| customClass | - | string | - | Adds custom CSS class(es) for the component |
| cardHeader | 'card-header' | boolean | true | When present, it indicates that the header should be displayed |
| title | 'card-title' | string | - | Sets the value of the header title |
| btnPrevText | - | string | 'Previous' | Sets the value of the previous button control |
| btnNextText | - | string | 'Next' | Sets the value of the next button control |
| btnView | - | AdaptMultiCardCarouselBtnView | 'square' | Used to change the view of the button controls (Since 14.26.0) |
| autoPlayInterval | - | number | 0 | Sets the interval for autoplay in ms. If a passed value of more than 0 enables autoplay, if 0 or null - it disables (Since v10.8.0) |
| loop | - | boolean | false | Allows content to start showing from the start if autoplay enabled (Since v10.8.0) |
| skin | - | MULTI_SKIN_ENUM | 'carousel_foreground' | Sets the style of the component |
| count | - | number | - | Setter/getter for counter [slide cards] |

### Exported Types

**MULTI_SKIN_ENUM:**
```typescript
MULTI_SKIN_ENUM = 'carousel_foreground' | 'skin1' | 'carousel_background' | 'skin3' | 'skin4' | 'skin5' | 'skin6' | 'skin7' | 'skin8' | 'carousel_foreground_inverse' | 'carousel_background_inverse' | 'skin11';
```

**AdaptMultiCardCarouselBtnView:**
```typescript
AdaptMultiCardCarouselBtnView = 'square' | 'circle';
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {MULTI_SKIN_ENUM} from '@bmc-ux/adapt-angular';

export interface TestCard {
  status: 'active' | 'new' | 'approved' | 'decline';
  item: string;
  color: string;
}

@Component({
  selector: 'adapt-multi-card-demo',
  templateUrl: './multi-card.demo.html',
  styles: [`
    adapt-multi-card-slide {
      .adapt-multi-card-slide__card {
        width: 250px;
      }
    }
  `]
})
export class AdaptMultiCardDemoComponent {
  cards: TestCard[] = [
    { status: 'active', item: 'Item 1', color: '#f2f2f2' },
    { status: 'active', item: 'Item 2', color: '#aed581' },
    { status: 'new', item: 'Item 3', color: '#303f9f' },
    { status: 'decline', item: 'Item 4', color: '#00a79d' },
    { status: 'approved', item: 'Item 5', color: '#455a64' }
  ];

  showHeader: boolean = true;
  autoplayEnabled: boolean = false;
  autoplayInterval: number = 3000;
  loopEnabled: boolean = false;
  selectedSkin: MULTI_SKIN_ENUM = 'carousel_foreground';
}
```

### HTML Template

```html
<adapt-multi-card [card-title]="'Carousel custom title'"
                  [card-header]="showHeader"
                  [autoPlayInterval]="autoplayEnabled ? autoplayInterval : null"
                  [loop]="loopEnabled"
                  [skin]="selectedSkin"
                  [btnView]="'square'">
  <adapt-multi-card-slide *ngFor="let card of cards">
    <div class="px-1 adapt-multi-card-slide__card">
      <div class="card">
        <div class="card-header font-weight-bold">
          {{card.item}}
        </div>
        <div class="card-body">
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button class="btn btn-sm btn-secondary">
            <span>Cancel</span>
          </button>
          <span>&nbsp;</span>
          <button class="btn btn-sm btn-primary">
            <span class="icon d-icon-cart" aria-hidden="true"></span>
            <span class="icon d-icon-plus" aria-hidden="true"></span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  </adapt-multi-card-slide>
</adapt-multi-card>
```

### Using adapt-multi-card-line

```html
<adapt-multi-card [card-title]="'Products'">
  <adapt-multi-card-line>
    <!-- Content for a specific line/section -->
  </adapt-multi-card-line>
  
  <adapt-multi-card-slide>
    <!-- Your card content -->
  </adapt-multi-card-slide>
</adapt-multi-card>
```

## Key Features

- Display multiple cards in a horizontal carousel
- Auto-play functionality with configurable intervals
- Loop mode for continuous playback
- Multiple skin/theme options for different visual styles
- Customizable button views (square or circle)
- Optional header with custom title
- Navigation controls (previous/next buttons)
- Status bar/tabs navigation support
- Filtering slides by order parameter
- Responsive design
- Support for custom card content
- Ideal for product showcases, feature highlights, or content galleries

