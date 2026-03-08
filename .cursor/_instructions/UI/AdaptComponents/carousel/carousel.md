# Carousel (Image Carousel)

## Description

An image carousel component that displays a slideshow of images or content with navigation controls. The carousel supports full-screen mode for mobile devices, auto-play functionality, and customizable transitions.

## Import

```typescript
import {AdaptCarouselModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Main Component Selector:** `adapt-carousel-component`

**Slide Selector:** `adapt-carousel-slide`

## Properties

### @Inputs (adapt-carousel-component)

| Name | Type | Default | Description |
|------|------|---------|-------------|
| fullScreenMode | boolean | true | Full screen mode for mobile devices |
| indicators | boolean | - | Toggles slide indicators visibility |
| autoPlayInterval | number | - | Sets the interval for auto-play in milliseconds |
| options | CarouselOptions | - | Configuration options for the carousel (see below) |
| texts | CarouselTextsModel | - | Customizable text labels for carousel controls |

### Exported Interfaces

#### CarouselOptions

| Name | Type | Description |
|------|------|-------------|
| selector | string | **Required.** This should be unique for each carousel on the page |
| duration | number | Duration of each slide in milliseconds to show in the carousel |
| easing | string | Easing function for transitions |
| perPage | number \| Object | No. of slides per page |
| startIndex | number | Starting slide index |
| draggable | boolean | Enable drag functionality |
| threshold | number | Drag threshold |
| loop | boolean | Enable looping of slides |
| multipleDrag | boolean | Enable multiple drag |
| rtl | boolean | Enable right-to-left mode |
| allowMobileControls | boolean | Show controls on mobile devices |
| onInit | (onChangeArgs?: CarouselCallbackArgs) => void | Callback triggered on initialization |
| onChange | (onChangeArgs?: CarouselCallbackArgs) => void | Callback triggered each time carousel item changed |

#### CarouselCallbackArgs

| Name | Type | Description |
|------|------|-------------|
| currentSlideIndex | number | The index of the current active slide (Since 14.26.0) |

#### CarouselTextsModel

| Name | Type | Description |
|------|------|-------------|
| previous | string | Text for previous button |
| next | string | Text for next button |
| title | string | Carousel title text |
| play | string | Text for play button |
| pause | string | Text for pause button |
| slide | string | Text for slide indicator |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {CarouselOptions} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'adapt-image-carousel-example',
  templateUrl: './carousel.demo.html'
})
export class AdaptImageCarouselDemoComponent {
  /**
   * {selector: string;} - is required option
   */
  options: CarouselOptions = {
    selector: '.my-carousel',
    loop: false,
    duration: 300,
    onChange: this.onSlideChange
  };

  onSlideChange(args?: any): void {
    console.log('Slide changed:', args);
  }
}
```

### HTML Template

```html
<adapt-carousel-component [options]="options" [autoPlayInterval]="3000">
  <adapt-carousel-slide>
    <img src="https://example.com/image1.jpg" alt="Slide 1"/>
    <div class="a-carousel__caption d-none d-md-block">
      <h3>First slide label</h3>
      <p>Description for the first slide</p>
    </div>
  </adapt-carousel-slide>

  <adapt-carousel-slide>
    <img src="https://example.com/image2.jpg" alt="Slide 2"/>
    <div class="a-carousel__caption d-none d-md-block">
      <h3>Second slide label</h3>
      <p>Description for the second slide</p>
    </div>
  </adapt-carousel-slide>

  <adapt-carousel-slide>
    <img src="https://example.com/image3.jpg" alt="Slide 3"/>
    <div class="a-carousel__caption d-none d-md-block">
      <h3>Third slide label</h3>
      <p>Description for the third slide</p>
    </div>
  </adapt-carousel-slide>
</adapt-carousel-component>
```

### Video Slide Example

```html
<adapt-carousel-slide>
  <div class="video-wrapper">
    <iframe class="ex-video"
            title="Video from Youtube"
            src="https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1&ytp-pause-overlay=0&rel=0"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen></iframe>
  </div>
</adapt-carousel-slide>
```

## Key Features

- Slideshow of images or mixed content (images, videos, etc.)
- Auto-play functionality with configurable intervals
- Full-screen mode for mobile devices
- Navigation controls (previous/next buttons)
- Slide indicators
- Draggable slides
- Loop mode for continuous playback
- RTL (right-to-left) support
- Customizable transitions and easing
- Callback functions for initialization and slide changes
- Support for captions and overlays
- Responsive design with mobile-specific controls

