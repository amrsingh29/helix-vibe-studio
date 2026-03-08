# BMC-UX Adapt UI Components Guide

## Overview

BMC-UX Adapt provides a rich set of UI components for building modern enterprise applications. These components follow the ADAPT design system and provide consistent user experience across BMC products.

**Version**: 18.24.0  
**Package**: `@bmc-ux/adapt-angular`  
**BMC Helix Innovation Studio**: 25.3.0+

---

## Installation and Setup

### Import Modules

```typescript
import { 
  AdaptModalModule,
  AdaptTabsModule,
  AdaptAccordionModule,
  AdaptTooltipModule,
  AdaptButtonModule,
  AdaptBadgeModule,
  AdaptAlertModule,
  AdaptToastModule
} from '@bmc-ux/adapt-angular';

@NgModule({
  imports: [
    CommonModule,
    AdaptModalModule,
    AdaptTabsModule,
    AdaptAccordionModule,
    AdaptTooltipModule,
    AdaptButtonModule,
    AdaptBadgeModule,
    AdaptAlertModule,
    AdaptToastModule
  ]
})
export class YourModule {}
```

---

## Button Components

### 1. Button (adapt-button)

**Purpose**: Styled buttons with various types and sizes.

**Import**:
```typescript
import { AdaptButtonModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<button adapt-button>Click Me</button>
```

**Button Types**:
```html
<!-- Primary Button -->
<button adapt-button type="primary">Primary</button>

<!-- Secondary Button -->
<button adapt-button type="secondary">Secondary</button>

<!-- Tertiary Button -->
<button adapt-button type="tertiary">Tertiary</button>

<!-- Danger Button -->
<button adapt-button type="danger">Delete</button>

<!-- Link Button -->
<button adapt-button type="link">Link</button>
```

**Button Sizes**:
```html
<button adapt-button size="small">Small</button>
<button adapt-button size="medium">Medium</button>
<button adapt-button size="large">Large</button>
```

**With Icons**:
```html
<button adapt-button>
  <i class="d-icon-add"></i>
  Add Item
</button>

<!-- Icon Only -->
<button adapt-button icon-only>
  <i class="d-icon-search"></i>
</button>
```

**Disabled State**:
```html
<button adapt-button [disabled]="true">Disabled</button>
```

**Loading State**:
```html
<button adapt-button [loading]="isLoading">
  Submit
</button>
```

---

### 2. Button Group (adapt-button-group)

**Purpose**: Group related buttons together.

**Import**:
```typescript
import { AdaptButtonGroupModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-button-group>
  <button adapt-button>Left</button>
  <button adapt-button>Center</button>
  <button adapt-button>Right</button>
</adapt-button-group>
```

**Vertical Layout**:
```html
<adapt-button-group orientation="vertical">
  <button adapt-button>Top</button>
  <button adapt-button>Middle</button>
  <button adapt-button>Bottom</button>
</adapt-button-group>
```

---

## Modal & Dialog

### 3. Modal (adapt-modal)

**Purpose**: Modal dialogs for displaying content over the main page.

**Import**:
```typescript
import { AdaptModalModule, AdaptModalService } from '@bmc-ux/adapt-angular';
```

**Service-Based Modal**:
```typescript
// Component
constructor(private modalService: AdaptModalService) {}

openModal() {
  const modalRef = this.modalService.open(MyModalContentComponent, {
    title: 'Modal Title',
    size: 'medium', // 'small', 'medium', 'large', 'xlarge'
    closeOnBackdrop: true,
    closeOnEscape: true
  });
  
  modalRef.afterClosed().subscribe(result => {
    console.log('Modal closed with result:', result);
  });
}
```

**Template-Based Modal**:
```html
<adapt-modal
  [(visible)]="showModal"
  title="Confirm Action"
  [closeOnBackdrop]="true">
  <div modal-body>
    <p>Are you sure you want to proceed?</p>
  </div>
  <div modal-footer>
    <button adapt-button type="secondary" (click)="showModal = false">
      Cancel
    </button>
    <button adapt-button type="primary" (click)="confirm()">
      Confirm
    </button>
  </div>
</adapt-modal>
```

**Modal Sizes**:
```typescript
modalService.open(Component, { size: 'small' });   // 400px
modalService.open(Component, { size: 'medium' });  // 600px
modalService.open(Component, { size: 'large' });   // 800px
modalService.open(Component, { size: 'xlarge' });  // 1200px
```

**Passing Data to Modal**:
```typescript
const modalRef = this.modalService.open(EditUserComponent, {
  title: 'Edit User',
  data: { userId: 123, userName: 'John Doe' }
});

// In EditUserComponent
constructor(@Inject(ADAPT_MODAL_DATA) public data: any) {
  console.log(this.data.userId); // 123
}
```

**Closing Modal with Result**:
```typescript
// In modal component
constructor(private modalRef: AdaptModalRef) {}

save() {
  this.modalRef.close({ success: true, data: this.formData });
}

cancel() {
  this.modalRef.dismiss();
}
```

---

### 4. Dialog (adapt-dialog)

**Purpose**: Confirmation dialogs and alerts.

**Import**:
```typescript
import { AdaptDialogService } from '@bmc-ux/adapt-angular';
```

**Confirm Dialog**:
```typescript
constructor(private dialogService: AdaptDialogService) {}

confirmDelete() {
  this.dialogService.confirm({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger'
  }).subscribe(confirmed => {
    if (confirmed) {
      // Perform delete
    }
  });
}
```

**Alert Dialog**:
```typescript
showAlert() {
  this.dialogService.alert({
    title: 'Success',
    message: 'Operation completed successfully!',
    type: 'success'
  });
}
```

---

## Tabs

### 5. Tabs (adapt-tabs)

**Purpose**: Organize content into tabs.

**Import**:
```typescript
import { AdaptTabsModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-tabs [(activeTab)]="activeTab">
  <adapt-tabs-panel title="Tab 1" id="tab1">
    <p>Content for Tab 1</p>
  </adapt-tabs-panel>
  
  <adapt-tabs-panel title="Tab 2" id="tab2">
    <p>Content for Tab 2</p>
  </adapt-tabs-panel>
  
  <adapt-tabs-panel title="Tab 3" id="tab3">
    <p>Content for Tab 3</p>
  </adapt-tabs-panel>
</adapt-tabs>
```

**With Icons**:
```html
<adapt-tabs>
  <adapt-tabs-panel title="Home" icon="d-icon-home">
    <p>Home content</p>
  </adapt-tabs-panel>
  
  <adapt-tabs-panel title="Settings" icon="d-icon-settings">
    <p>Settings content</p>
  </adapt-tabs-panel>
</adapt-tabs>
```

**Closable Tabs**:
```html
<adapt-tabs>
  <adapt-tabs-panel 
    title="Tab 1" 
    [closable]="true"
    (close)="onTabClose($event)">
    <p>Content</p>
  </adapt-tabs-panel>
</adapt-tabs>
```

**Disabled Tab**:
```html
<adapt-tabs>
  <adapt-tabs-panel title="Enabled Tab">
    <p>Content</p>
  </adapt-tabs-panel>
  
  <adapt-tabs-panel title="Disabled Tab" [disabled]="true">
    <p>This tab is disabled</p>
  </adapt-tabs-panel>
</adapt-tabs>
```

**Tab Position**:
```html
<!-- Top (default) -->
<adapt-tabs position="top">...</adapt-tabs>

<!-- Bottom -->
<adapt-tabs position="bottom">...</adapt-tabs>

<!-- Left -->
<adapt-tabs position="left">...</adapt-tabs>

<!-- Right -->
<adapt-tabs position="right">...</adapt-tabs>
```

---

## Accordion

### 6. Accordion (adapt-accordion)

**Purpose**: Collapsible content panels.

**Import**:
```typescript
import { AdaptAccordionModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-accordion>
  <adapt-accordion-panel title="Section 1">
    <p>Content for section 1</p>
  </adapt-accordion-panel>
  
  <adapt-accordion-panel title="Section 2">
    <p>Content for section 2</p>
  </adapt-accordion-panel>
  
  <adapt-accordion-panel title="Section 3">
    <p>Content for section 3</p>
  </adapt-accordion-panel>
</adapt-accordion>
```

**Single Expand Mode**:
```html
<adapt-accordion [multiple]="false">
  <!-- Only one panel can be open at a time -->
</adapt-accordion>
```

**Initially Expanded**:
```html
<adapt-accordion>
  <adapt-accordion-panel title="Section 1" [expanded]="true">
    <p>This section is initially expanded</p>
  </adapt-accordion-panel>
</adapt-accordion>
```

**Disabled Panel**:
```html
<adapt-accordion>
  <adapt-accordion-panel title="Disabled Section" [disabled]="true">
    <p>This section cannot be expanded</p>
  </adapt-accordion-panel>
</adapt-accordion>
```

---

## Alerts & Notifications

### 7. Alert (adapt-alert)

**Purpose**: Display inline alert messages.

**Import**:
```typescript
import { AdaptAlertModule } from '@bmc-ux/adapt-angular';
```

**Alert Types**:
```html
<!-- Success Alert -->
<adapt-alert type="success" [dismissible]="true">
  Operation completed successfully!
</adapt-alert>

<!-- Info Alert -->
<adapt-alert type="info">
  This is an informational message.
</adapt-alert>

<!-- Warning Alert -->
<adapt-alert type="warning">
  Please review this warning.
</adapt-alert>

<!-- Error Alert -->
<adapt-alert type="error">
  An error occurred. Please try again.
</adapt-alert>
```

**With Icon**:
```html
<adapt-alert type="success" [showIcon]="true">
  Success message with icon
</adapt-alert>
```

**Dismissible Alert**:
```html
<adapt-alert 
  type="info" 
  [dismissible]="true"
  (close)="onAlertClose()">
  This alert can be dismissed
</adapt-alert>
```

---

### 8. Toast (adapt-toast)

**Purpose**: Display temporary notification messages.

**Import**:
```typescript
import { AdaptToastService } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
constructor(private toastService: AdaptToastService) {}

showSuccess() {
  this.toastService.success('Operation completed successfully!');
}

showError() {
  this.toastService.error('An error occurred');
}

showInfo() {
  this.toastService.info('Information message');
}

showWarning() {
  this.toastService.warning('Warning message');
}
```

**With Options**:
```typescript
this.toastService.show({
  message: 'Custom toast message',
  type: 'success',
  duration: 5000, // milliseconds
  position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  closable: true
});
```

---

## Tooltips & Popovers

### 9. Tooltip (adapt-tooltip)

**Purpose**: Display helpful text on hover.

**Import**:
```typescript
import { AdaptTooltipModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<button adapt-button adaptTooltip="This is a tooltip">
  Hover me
</button>
```

**Tooltip Positions**:
```html
<button adaptTooltip="Top tooltip" tooltipPosition="top">Top</button>
<button adaptTooltip="Right tooltip" tooltipPosition="right">Right</button>
<button adaptTooltip="Bottom tooltip" tooltipPosition="bottom">Bottom</button>
<button adaptTooltip="Left tooltip" tooltipPosition="left">Left</button>
```

**HTML Content**:
```html
<button 
  [adaptTooltip]="tooltipContent" 
  [tooltipHtml]="true">
  Hover for HTML tooltip
</button>

<ng-template #tooltipContent>
  <strong>Bold text</strong>
  <p>Paragraph in tooltip</p>
</ng-template>
```

**Delay**:
```html
<button 
  adaptTooltip="Delayed tooltip" 
  [tooltipDelay]="500">
  Hover me
</button>
```

---

### 10. Popover (adapt-popover)

**Purpose**: Display rich content in a popup.

**Import**:
```typescript
import { AdaptPopoverModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<button 
  adapt-button 
  [adaptPopover]="popoverContent"
  popoverTrigger="click">
  Click for popover
</button>

<ng-template #popoverContent>
  <div class="popover-content">
    <h4>Popover Title</h4>
    <p>This is the popover content.</p>
    <button adapt-button>Action</button>
  </div>
</ng-template>
```

**Trigger Types**:
```html
<!-- Click trigger (default) -->
<button [adaptPopover]="content" popoverTrigger="click">Click</button>

<!-- Hover trigger -->
<button [adaptPopover]="content" popoverTrigger="hover">Hover</button>

<!-- Focus trigger -->
<input [adaptPopover]="content" popoverTrigger="focus">
```

---

## Badge & Tag

### 11. Badge (adapt-badge)

**Purpose**: Display small status indicators or counts.

**Import**:
```typescript
import { AdaptBadgeModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<span adapt-badge>5</span>
```

**Badge Types**:
```html
<span adapt-badge type="primary">Primary</span>
<span adapt-badge type="success">Success</span>
<span adapt-badge type="warning">Warning</span>
<span adapt-badge type="danger">Danger</span>
<span adapt-badge type="info">Info</span>
```

**Badge on Button**:
```html
<button adapt-button>
  Messages
  <span adapt-badge type="danger">3</span>
</button>
```

**Dot Badge**:
```html
<span adapt-badge dot type="danger"></span>
```

---

### 12. Tag (adapt-tag)

**Purpose**: Display labels or categories.

**Import**:
```typescript
import { AdaptTagModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-tag>Default Tag</adapt-tag>
```

**Tag Colors**:
```html
<adapt-tag color="primary">Primary</adapt-tag>
<adapt-tag color="success">Success</adapt-tag>
<adapt-tag color="warning">Warning</adapt-tag>
<adapt-tag color="danger">Danger</adapt-tag>
<adapt-tag color="info">Info</adapt-tag>
```

**Closable Tag**:
```html
<adapt-tag 
  [closable]="true"
  (close)="onTagClose()">
  Closable Tag
</adapt-tag>
```

**With Icon**:
```html
<adapt-tag>
  <i class="d-icon-user"></i>
  User Tag
</adapt-tag>
```

---

## Progress & Loading

### 13. Progress Bar (adapt-progress)

**Purpose**: Display progress of an operation.

**Import**:
```typescript
import { AdaptProgressModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-progress [value]="progressValue"></adapt-progress>
```

**With Label**:
```html
<adapt-progress 
  [value]="progressValue"
  [showLabel]="true">
</adapt-progress>
```

**Indeterminate**:
```html
<adapt-progress [indeterminate]="true"></adapt-progress>
```

**Colors**:
```html
<adapt-progress [value]="50" color="success"></adapt-progress>
<adapt-progress [value]="75" color="warning"></adapt-progress>
<adapt-progress [value]="90" color="danger"></adapt-progress>
```

---

### 14. Busy Loader (adapt-busy)

**Purpose**: Display loading indicator.

**Import**:
```typescript
import { AdaptBusyModule } from '@bmc-ux/adapt-angular';
```

**Inline Loader**:
```html
<div [adaptBusy]="isLoading">
  <p>Content that will be covered by loader</p>
</div>
```

**With Message**:
```html
<div [adaptBusy]="isLoading" busyMessage="Loading data...">
  <p>Content</p>
</div>
```

**Global Loader**:
```typescript
constructor(private busyService: AdaptBusyService) {}

showLoader() {
  this.busyService.show('Loading...');
}

hideLoader() {
  this.busyService.hide();
}
```

---

## Navigation

### 15. Sidebar (adapt-sidebar)

**Purpose**: Side navigation panel.

**Import**:
```typescript
import { AdaptSidebarModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-sidebar 
  [(visible)]="sidebarVisible"
  position="left">
  <div sidebar-header>
    <h3>Sidebar Title</h3>
  </div>
  <div sidebar-content>
    <p>Sidebar content goes here</p>
  </div>
</adapt-sidebar>
```

**Positions**:
```html
<adapt-sidebar position="left">...</adapt-sidebar>
<adapt-sidebar position="right">...</adapt-sidebar>
<adapt-sidebar position="top">...</adapt-sidebar>
<adapt-sidebar position="bottom">...</adapt-sidebar>
```

---

### 16. Navigation (adapt-navigation)

**Purpose**: Main navigation menu.

**Import**:
```typescript
import { AdaptNavigationModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
// Component
navItems = [
  { label: 'Home', icon: 'd-icon-home', route: '/home' },
  { label: 'Users', icon: 'd-icon-user', route: '/users' },
  { label: 'Settings', icon: 'd-icon-settings', route: '/settings' }
];
```

```html
<adapt-navigation [items]="navItems"></adapt-navigation>
```

---

## Cards & Panels

### 17. Card (adapt-card)

**Purpose**: Container for related content.

**Import**:
```typescript
import { AdaptCardModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-card>
  <div card-header>
    <h3>Card Title</h3>
  </div>
  <div card-body>
    <p>Card content goes here</p>
  </div>
  <div card-footer>
    <button adapt-button>Action</button>
  </div>
</adapt-card>
```

**Hoverable Card**:
```html
<adapt-card [hoverable]="true">
  <div card-body>
    <p>This card has hover effect</p>
  </div>
</adapt-card>
```

---

### 18. Statistics Card (adapt-statistics-card)

**Purpose**: Display key metrics and statistics.

**Import**:
```typescript
import { AdaptStatisticsCardModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-statistics-card
  title="Total Users"
  [value]="1234"
  icon="d-icon-user"
  [trend]="5.2"
  trendDirection="up">
</adapt-statistics-card>
```

---

## Stepper & Workflow

### 19. Stepper (adapt-stepper)

**Purpose**: Step-by-step process indicator.

**Import**:
```typescript
import { AdaptStepperModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-stepper [(activeStep)]="currentStep">
  <adapt-step label="Step 1" [completed]="step1Completed">
    <p>Step 1 content</p>
    <button adapt-button (click)="nextStep()">Next</button>
  </adapt-step>
  
  <adapt-step label="Step 2" [completed]="step2Completed">
    <p>Step 2 content</p>
    <button adapt-button (click)="previousStep()">Back</button>
    <button adapt-button (click)="nextStep()">Next</button>
  </adapt-step>
  
  <adapt-step label="Step 3">
    <p>Step 3 content</p>
    <button adapt-button (click)="previousStep()">Back</button>
    <button adapt-button (click)="finish()">Finish</button>
  </adapt-step>
</adapt-stepper>
```

**Vertical Stepper**:
```html
<adapt-stepper orientation="vertical">
  <!-- steps -->
</adapt-stepper>
```

---

## Empty State

### 20. Empty State (adapt-empty-state)

**Purpose**: Display message when no data is available.

**Import**:
```typescript
import { AdaptEmptyStateModule } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-empty-state
  title="No Data Found"
  description="There are no items to display"
  icon="d-icon-inbox">
  <button adapt-button (click)="addItem()">Add Item</button>
</adapt-empty-state>
```

---

## Best Practices

### 1. Consistent Button Usage

```html
<!-- Primary action -->
<button adapt-button type="primary">Save</button>

<!-- Secondary action -->
<button adapt-button type="secondary">Cancel</button>

<!-- Destructive action -->
<button adapt-button type="danger">Delete</button>
```

### 2. Modal Sizing

- Use `small` for simple confirmations
- Use `medium` for forms with few fields
- Use `large` for complex forms
- Use `xlarge` for data tables or rich content

### 3. Toast Positioning

```typescript
// For success/info messages
position: 'top-right'

// For errors that need attention
position: 'top-center'
```

### 4. Accessibility

- Always provide meaningful labels
- Use ARIA attributes when needed
- Ensure keyboard navigation works
- Test with screen readers

---

## Common Patterns

### Confirmation Dialog Pattern

```typescript
confirmAction() {
  this.dialogService.confirm({
    title: 'Confirm Action',
    message: 'Are you sure?',
    type: 'warning'
  }).subscribe(confirmed => {
    if (confirmed) {
      this.performAction();
      this.toastService.success('Action completed');
    }
  });
}
```

### Form in Modal Pattern

```typescript
openEditModal(item: any) {
  const modalRef = this.modalService.open(EditFormComponent, {
    title: 'Edit Item',
    data: { item }
  });
  
  modalRef.afterClosed().subscribe(result => {
    if (result?.saved) {
      this.refreshData();
      this.toastService.success('Changes saved');
    }
  });
}
```

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Package Version**: @bmc-ux/adapt-angular 18.24.0
