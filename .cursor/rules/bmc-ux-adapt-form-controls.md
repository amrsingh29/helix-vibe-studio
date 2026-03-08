# BMC-UX Adapt Form Controls Guide

## Overview

BMC-UX Adapt provides a comprehensive set of Angular form controls that follow ADAPT design system. These components are part of `@bmc-ux/adapt-angular` package and provide consistent, accessible, and feature-rich form controls.

**Version**: 18.24.0  
**Package**: `@bmc-ux/adapt-angular`  
**BMC Helix Innovation Studio**: 25.3.0+

---

## Installation and Setup

### Import Module

```typescript
import { AdaptModule } from '@bmc-ux/adapt-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdaptModule
  ]
})
export class YourModule {}
```

### Standalone Component Import

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  AdaptRxTextfieldComponent,
  AdaptRxSelectComponent,
  AdaptRxCheckboxComponent
} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdaptRxTextfieldComponent,
    AdaptRxSelectComponent,
    AdaptRxCheckboxComponent
  ],
  templateUrl: './my-component.component.html'
})
export class MyComponent {}
```

---

## Form Control Components

### 1. Text Field (adapt-rx-textfield)

**Purpose**: Single-line text input with validation, icons, and helper text.

**Import**:
```typescript
import { AdaptRxTextfieldComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-rx-textfield
  label="Username"
  placeholder="Enter username"
  [(ngModel)]="username"
  [required]="true">
</adapt-rx-textfield>
```

**With Reactive Forms**:
```typescript
// Component
form = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]]
});
```

```html
<form [formGroup]="form">
  <adapt-rx-textfield
    label="Username"
    formControlName="username"
    [required]="true"
    helperText="Minimum 3 characters">
  </adapt-rx-textfield>
</form>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | false | Mark as required |
| `disabled` | boolean | false | Disable input |
| `readonly` | boolean | false | Make read-only |
| `helperText` | string | - | Helper text below input |
| `errorText` | string | - | Error message |
| `prefixIcon` | string | - | Icon before input |
| `suffixIcon` | string | - | Icon after input |
| `type` | string | 'text' | Input type (text, password, email, etc.) |
| `maxLength` | number | - | Maximum character length |
| `minLength` | number | - | Minimum character length |

**Events**:
- `(ngModelChange)` - Value change event
- `(blur)` - Focus lost event
- `(focus)` - Focus gained event

**Example with Icons**:
```html
<adapt-rx-textfield
  label="Email"
  type="email"
  prefixIcon="d-icon-email"
  [(ngModel)]="email"
  [required]="true">
</adapt-rx-textfield>
```

---

### 2. Text Area (adapt-rx-textarea)

**Purpose**: Multi-line text input with auto-resize and character counter.

**Import**:
```typescript
import { AdaptRxTextareaComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-rx-textarea
  label="Description"
  placeholder="Enter description"
  [(ngModel)]="description"
  [rows]="4"
  [maxLength]="500">
</adapt-rx-textarea>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `placeholder` | string | - | Placeholder text |
| `rows` | number | 3 | Number of visible rows |
| `maxLength` | number | - | Maximum character length |
| `autoResize` | boolean | false | Auto-resize based on content |
| `showCounter` | boolean | false | Show character counter |
| `required` | boolean | false | Mark as required |
| `disabled` | boolean | false | Disable textarea |
| `readonly` | boolean | false | Make read-only |

**Example with Counter**:
```html
<adapt-rx-textarea
  label="Comments"
  [(ngModel)]="comments"
  [maxLength]="1000"
  [showCounter]="true"
  [autoResize]="true">
</adapt-rx-textarea>
```

---

### 3. Select Dropdown (adapt-rx-select)

**Purpose**: Dropdown select with search, multi-select, and custom templates.

**Import**:
```typescript
import { AdaptRxSelectComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
// Component
options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
];
selectedValue: string;
```

```html
<adapt-rx-select
  label="Select Option"
  [options]="options"
  [(ngModel)]="selectedValue"
  [required]="true">
</adapt-rx-select>
```

**Multi-Select**:
```html
<adapt-rx-select
  label="Select Multiple"
  [options]="options"
  [(ngModel)]="selectedValues"
  [multiple]="true"
  [showSelectAll]="true">
</adapt-rx-select>
```

**With Search**:
```html
<adapt-rx-select
  label="Search and Select"
  [options]="options"
  [(ngModel)]="selectedValue"
  [searchable]="true"
  searchPlaceholder="Search options...">
</adapt-rx-select>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `options` | Array | [] | Array of options |
| `multiple` | boolean | false | Enable multi-select |
| `searchable` | boolean | false | Enable search |
| `showSelectAll` | boolean | false | Show "Select All" option |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | false | Mark as required |
| `disabled` | boolean | false | Disable select |
| `clearable` | boolean | true | Show clear button |

**Option Format**:
```typescript
interface SelectOption {
  label: string;      // Display text
  value: any;         // Option value
  disabled?: boolean; // Disable option
  icon?: string;      // Option icon
  group?: string;     // Group name
}
```

**Grouped Options**:
```typescript
options = [
  { label: 'Apple', value: 'apple', group: 'Fruits' },
  { label: 'Banana', value: 'banana', group: 'Fruits' },
  { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
  { label: 'Lettuce', value: 'lettuce', group: 'Vegetables' }
];
```

---

### 4. Checkbox (adapt-rx-checkbox)

**Purpose**: Single checkbox or checkbox group with custom labels.

**Import**:
```typescript
import { AdaptRxCheckboxComponent } from '@bmc-ux/adapt-angular';
```

**Single Checkbox**:
```html
<adapt-rx-checkbox
  label="Accept Terms"
  [(ngModel)]="acceptTerms"
  [required]="true">
</adapt-rx-checkbox>
```

**Checkbox Group**:
```typescript
// Component
checkboxOptions = [
  { label: 'Option 1', value: '1', checked: false },
  { label: 'Option 2', value: '2', checked: false },
  { label: 'Option 3', value: '3', checked: true }
];
```

```html
<div *ngFor="let option of checkboxOptions">
  <adapt-rx-checkbox
    [label]="option.label"
    [(ngModel)]="option.checked">
  </adapt-rx-checkbox>
</div>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Checkbox label |
| `disabled` | boolean | false | Disable checkbox |
| `required` | boolean | false | Mark as required |
| `indeterminate` | boolean | false | Indeterminate state |

---

### 5. Radio Button (adapt-rx-radiobutton)

**Purpose**: Radio button group for single selection.

**Import**:
```typescript
import { AdaptRxRadiobuttonComponent, AdaptRxRadiobuttonGroupComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
// Component
selectedOption: string = '1';
```

```html
<adapt-rx-radiobutton-group
  label="Select Option"
  [(ngModel)]="selectedOption"
  [required]="true">
  <adapt-rx-radiobutton
    label="Option 1"
    value="1">
  </adapt-rx-radiobutton>
  <adapt-rx-radiobutton
    label="Option 2"
    value="2">
  </adapt-rx-radiobutton>
  <adapt-rx-radiobutton
    label="Option 3"
    value="3">
  </adapt-rx-radiobutton>
</adapt-rx-radiobutton-group>
```

**Horizontal Layout**:
```html
<adapt-rx-radiobutton-group
  label="Select Option"
  [(ngModel)]="selectedOption"
  orientation="horizontal">
  <!-- radio buttons -->
</adapt-rx-radiobutton-group>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Group label |
| `orientation` | string | 'vertical' | Layout: 'vertical' or 'horizontal' |
| `required` | boolean | false | Mark as required |
| `disabled` | boolean | false | Disable all radios |

---

### 6. Switch (adapt-rx-switch)

**Purpose**: Toggle switch for boolean values.

**Import**:
```typescript
import { AdaptRxSwitchComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-rx-switch
  label="Enable Notifications"
  [(ngModel)]="notificationsEnabled">
</adapt-rx-switch>
```

**With Description**:
```html
<adapt-rx-switch
  label="Dark Mode"
  helperText="Switch to dark theme"
  [(ngModel)]="darkMode"
  [disabled]="false">
</adapt-rx-switch>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Switch label |
| `helperText` | string | - | Helper text |
| `disabled` | boolean | false | Disable switch |

---

### 7. Date Time Picker (adapt-rx-datetime)

**Purpose**: Date and time selection with calendar and clock.

**Import**:
```typescript
import { AdaptRxDatetimeComponent } from '@bmc-ux/adapt-angular';
```

**Date Only**:
```html
<adapt-rx-datetime
  label="Select Date"
  [(ngModel)]="selectedDate"
  [showTime]="false"
  [required]="true">
</adapt-rx-datetime>
```

**Date and Time**:
```html
<adapt-rx-datetime
  label="Select Date & Time"
  [(ngModel)]="selectedDateTime"
  [showTime]="true"
  [timeFormat]="'24'"
  [required]="true">
</adapt-rx-datetime>
```

**Date Range**:
```html
<adapt-rx-datetime-range
  label="Select Date Range"
  [(ngModel)]="dateRange"
  [required]="true">
</adapt-rx-datetime-range>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `showTime` | boolean | false | Show time picker |
| `timeFormat` | string | '12' | Time format: '12' or '24' |
| `dateFormat` | string | 'MM/dd/yyyy' | Date format |
| `minDate` | Date | - | Minimum selectable date |
| `maxDate` | Date | - | Maximum selectable date |
| `required` | boolean | false | Mark as required |
| `disabled` | boolean | false | Disable picker |

---

### 8. Typeahead (adapt-rx-typeahead)

**Purpose**: Autocomplete input with suggestions.

**Import**:
```typescript
import { AdaptRxTypeaheadComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
// Component
suggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
selectedValue: string;

onSearch(query: string) {
  // Filter suggestions based on query
  return this.suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  );
}
```

```html
<adapt-rx-typeahead
  label="Search Fruit"
  [(ngModel)]="selectedValue"
  [suggestions]="suggestions"
  (search)="onSearch($event)"
  [minLength]="2">
</adapt-rx-typeahead>
```

**With Async Data**:
```typescript
// Component
onSearch(query: string): Observable<any[]> {
  return this.http.get(`/api/search?q=${query}`);
}
```

```html
<adapt-rx-typeahead
  label="Search"
  [(ngModel)]="selectedValue"
  [asyncSearch]="onSearch.bind(this)"
  [minLength]="3"
  [debounceTime]="300">
</adapt-rx-typeahead>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `suggestions` | Array | [] | Suggestion list |
| `asyncSearch` | Function | - | Async search function |
| `minLength` | number | 1 | Min chars to trigger search |
| `debounceTime` | number | 200 | Debounce time in ms |
| `maxResults` | number | 10 | Max suggestions to show |

---

### 9. Counter (adapt-rx-counter)

**Purpose**: Number input with increment/decrement buttons.

**Import**:
```typescript
import { AdaptRxCounterComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-rx-counter
  label="Quantity"
  [(ngModel)]="quantity"
  [min]="1"
  [max]="100"
  [step]="1">
</adapt-rx-counter>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Field label |
| `min` | number | - | Minimum value |
| `max` | number | - | Maximum value |
| `step` | number | 1 | Increment/decrement step |
| `disabled` | boolean | false | Disable counter |

---

### 10. Rating (adapt-rx-rating)

**Purpose**: Star rating or custom rating component.

**Import**:
```typescript
import { AdaptRxRatingComponent } from '@bmc-ux/adapt-angular';
```

**Star Rating**:
```html
<adapt-rx-rating
  label="Rate this product"
  [(ngModel)]="rating"
  [stars]="5"
  [readonly]="false">
</adapt-rx-rating>
```

**Like/Dislike**:
```html
<adapt-rx-rating-binary
  [(ngModel)]="liked">
</adapt-rx-rating-binary>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Rating label |
| `stars` | number | 5 | Number of stars |
| `readonly` | boolean | false | Make read-only |
| `disabled` | boolean | false | Disable rating |

---

### 11. Search (adapt-rx-search)

**Purpose**: Search input with clear button and search icon.

**Import**:
```typescript
import { AdaptRxSearchComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```html
<adapt-rx-search
  placeholder="Search..."
  [(ngModel)]="searchQuery"
  (search)="onSearch($event)">
</adapt-rx-search>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | - | Placeholder text |
| `debounceTime` | number | 300 | Debounce time in ms |
| `minLength` | number | 0 | Min chars to trigger search |

**Events**:
- `(search)` - Emits search query
- `(clear)` - Emits when cleared

---

### 12. File Uploader (adapt-rx-uploader)

**Purpose**: File upload with drag-and-drop, preview, and validation.

**Import**:
```typescript
import { AdaptRxUploaderComponent } from '@bmc-ux/adapt-angular';
```

**Basic Usage**:
```typescript
// Component
uploadedFiles: File[] = [];

onUpload(files: File[]) {
  this.uploadedFiles = files;
  // Handle file upload
}
```

```html
<adapt-rx-uploader
  label="Upload Files"
  [multiple]="true"
  [maxFileSize]="5242880"
  [accept]="'.pdf,.doc,.docx'"
  (filesSelected)="onUpload($event)">
</adapt-rx-uploader>
```

**With Preview**:
```html
<adapt-rx-uploader
  label="Upload Images"
  [multiple]="true"
  [accept]="'image/*'"
  [showPreview]="true"
  [maxFileSize]="2097152"
  (filesSelected)="onUpload($event)">
</adapt-rx-uploader>
```

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | Uploader label |
| `multiple` | boolean | false | Allow multiple files |
| `accept` | string | - | Accepted file types |
| `maxFileSize` | number | - | Max file size in bytes |
| `showPreview` | boolean | false | Show file preview |
| `disabled` | boolean | false | Disable uploader |

---

## Form Validation

### Built-in Validators

```typescript
import { Validators } from '@angular/forms';

form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
  website: ['', [Validators.pattern(/^https?:\/\/.+/)]]
});
```

### Custom Validators

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Custom validator function
function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);
  
  const valid = hasNumber && hasUpper && hasLower && hasSpecial;
  return valid ? null : { passwordStrength: true };
}

// Usage
form = this.fb.group({
  password: ['', [Validators.required, passwordStrength]]
});
```

### Displaying Validation Errors

```html
<adapt-rx-textfield
  label="Email"
  formControlName="email"
  [required]="true">
</adapt-rx-textfield>

<div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" 
     class="error-message">
  <span *ngIf="form.get('email')?.errors?.['required']">
    Email is required
  </span>
  <span *ngIf="form.get('email')?.errors?.['email']">
    Please enter a valid email
  </span>
</div>
```

---

## Form Layouts

### Vertical Layout (Default)

```html
<form [formGroup]="form">
  <adapt-rx-textfield
    label="First Name"
    formControlName="firstName">
  </adapt-rx-textfield>
  
  <adapt-rx-textfield
    label="Last Name"
    formControlName="lastName">
  </adapt-rx-textfield>
  
  <adapt-rx-select
    label="Country"
    [options]="countries"
    formControlName="country">
  </adapt-rx-select>
</form>
```

### Horizontal Layout

```html
<form [formGroup]="form" class="form-horizontal">
  <div class="form-row">
    <div class="form-col-6">
      <adapt-rx-textfield
        label="First Name"
        formControlName="firstName">
      </adapt-rx-textfield>
    </div>
    <div class="form-col-6">
      <adapt-rx-textfield
        label="Last Name"
        formControlName="lastName">
      </adapt-rx-textfield>
    </div>
  </div>
</form>
```

---

## Best Practices

### 1. Use Reactive Forms

```typescript
// Recommended
form = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]]
});
```

### 2. Handle Form Submission

```typescript
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  
  const formData = this.form.value;
  // Process form data
}
```

### 3. Reset Forms

```typescript
resetForm() {
  this.form.reset();
  // Or reset with default values
  this.form.reset({
    username: '',
    email: ''
  });
}
```

### 4. Disable Forms

```typescript
// Disable entire form
this.form.disable();

// Disable specific control
this.form.get('username')?.disable();

// Enable
this.form.enable();
```

### 5. Listen to Value Changes

```typescript
ngOnInit() {
  this.form.get('country')?.valueChanges
    .pipe(takeUntil(this.destroyed$))
    .subscribe(value => {
      // React to country change
      this.loadStates(value);
    });
}
```

---

## Accessibility

All Adapt form controls follow WCAG 2.1 AA standards:

- Keyboard navigation support
- Screen reader compatible
- ARIA labels and descriptions
- Focus management
- Error announcements

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate to next field |
| Shift+Tab | Navigate to previous field |
| Space | Toggle checkbox/switch |
| Enter | Submit form / Select option |
| Esc | Close dropdown / Cancel |
| Arrow Keys | Navigate options in select/radio |

---

## Common Patterns

### Form with Sections

```html
<form [formGroup]="form">
  <h3>Personal Information</h3>
  <adapt-rx-textfield label="Name" formControlName="name"></adapt-rx-textfield>
  <adapt-rx-textfield label="Email" formControlName="email"></adapt-rx-textfield>
  
  <h3>Address</h3>
  <adapt-rx-textfield label="Street" formControlName="street"></adapt-rx-textfield>
  <adapt-rx-textfield label="City" formControlName="city"></adapt-rx-textfield>
  
  <button type="submit" (click)="onSubmit()">Submit</button>
</form>
```

### Dynamic Form Fields

```typescript
// Component
fields = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' }
];
```

```html
<form [formGroup]="form">
  <div *ngFor="let field of fields">
    <adapt-rx-textfield
      [label]="field.label"
      [type]="field.type"
      [formControlName]="field.name">
    </adapt-rx-textfield>
  </div>
</form>
```

---

## Troubleshooting

### Issue: Form control not updating

**Solution**: Ensure you're using `[(ngModel)]` or `formControlName`, not both.

### Issue: Validation not working

**Solution**: Make sure to import `ReactiveFormsModule` and use `formGroup`.

### Issue: Styles not applied

**Solution**: Import `@bmc-ux/adapt-css` in your styles:
```scss
@import '@bmc-ux/adapt-css/adapt.scss';
```

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Package Version**: @bmc-ux/adapt-angular 18.24.0
