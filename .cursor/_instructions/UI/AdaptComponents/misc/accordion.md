# Accordion

## Description

Accordions break up sections of content for a less cluttered display (similar to tabs). Each section has a title and, when collapsed, everything but the title is hidden. Users can expand/collapse sections to view content as needed.

## Import

```typescript
import {AdaptAccordionModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-accordion`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| config | Accordion | - | Configuration object for accordion items |
| multiselect | boolean | false | Allows opening multiple tabs simultaneously |
| bordered | boolean | true | Enable/disable borders |
| autoScrollToContent | boolean | false | If set to true, view will be automatically scrolled to the accordion content after opening |
| enableDnD | boolean | false | Enables tabs dragging (Since v14.14.0) |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onOpen | EventEmitter<AccordionItem> | Emits when accordion item is opened |
| onClose | EventEmitter<AccordionItem> | Emits when accordion item is closed |
| dndChange | EventEmitter<AccordionItem[]> | Emits when drag-and-drop order changes |

### Accordion Configuration Interface

```typescript
interface Accordion {
  items: AccordionItem[];
}

interface AccordionItem {
  id: string | number;
  title: string;
  content: string | TemplateRef<any>;
  isOpen?: boolean;
  disabled?: boolean;
  icon?: string;
}
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {Accordion, AccordionItem} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'adapt-accordion-demo',
  templateUrl: './accordion.demo.html'
})
export class AdaptAccordionDemoComponent {
  accordionConfig: Accordion = {
    items: [
      {
        id: 1,
        title: 'Section 1',
        content: 'Content for section 1. This can be any HTML or text.',
        isOpen: true
      },
      {
        id: 2,
        title: 'Section 2',
        content: 'Content for section 2 with more details.',
        isOpen: false
      },
      {
        id: 3,
        title: 'Section 3',
        content: 'Content for section 3.',
        isOpen: false,
        disabled: false
      }
    ]
  };

  onItemOpen(item: AccordionItem): void {
    console.log('Opened:', item);
  }

  onItemClose(item: AccordionItem): void {
    console.log('Closed:', item);
  }

  onDndChange(items: AccordionItem[]): void {
    console.log('Order changed:', items);
  }
}
```

### HTML Template

```html
<!-- Basic Accordion -->
<adapt-accordion [config]="accordionConfig"
                 (onOpen)="onItemOpen($event)"
                 (onClose)="onItemClose($event)"></adapt-accordion>

<!-- Multiselect Accordion (multiple items can be open) -->
<adapt-accordion [config]="accordionConfig"
                 [multiselect]="true"></adapt-accordion>

<!-- Borderless Accordion -->
<adapt-accordion [config]="accordionConfig"
                 [bordered]="false"></adapt-accordion>

<!-- Accordion with Auto-scroll -->
<adapt-accordion [config]="accordionConfig"
                 [autoScrollToContent]="true"></adapt-accordion>

<!-- Accordion with Drag-and-Drop -->
<adapt-accordion [config]="accordionConfig"
                 [enableDnD]="true"
                 (dndChange)="onDndChange($event)"></adapt-accordion>

<!-- Inline Configuration -->
<adapt-accordion [config]="{
  items: [
    { id: 1, title: 'Item 1', content: 'Content 1', isOpen: true },
    { id: 2, title: 'Item 2', content: 'Content 2', isOpen: false },
    { id: 3, title: 'Item 3', content: 'Content 3', isOpen: false }
  ]
}"></adapt-accordion>
```

### Using Templates for Content

```html
<adapt-accordion [config]="accordionConfigWithTemplates"></adapt-accordion>

<ng-template #section1Content>
  <div class="custom-content">
    <h4>Custom Content</h4>
    <p>This is a template-based content section.</p>
    <button class="btn btn-primary">Action Button</button>
  </div>
</ng-template>
```

```typescript
// In component
@ViewChild('section1Content') section1Content: TemplateRef<any>;

ngAfterViewInit() {
  this.accordionConfigWithTemplates = {
    items: [
      {
        id: 1,
        title: 'Custom Section',
        content: this.section1Content,
        isOpen: true
      }
    ]
  };
}
```

## Key Features

- Collapsible content sections
- Single or multiple selection modes
- Auto-scroll to opened content
- Drag-and-drop reordering
- Bordered or borderless styles
- Disabled items support
- Template-based content
- Icon support in headers
- Open/close events
- Initial state configuration
- Accessibility support (ARIA attributes)
- Keyboard navigation

