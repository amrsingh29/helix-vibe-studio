# Uploader (Reactive Form Control)

## Description

A part of AdaptRx- form controls. The uploader component provides file upload functionality with drag-and-drop support, file type validation, size limits, and preview capabilities.

## Import

```typescript
import {AdaptRxUploaderModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-rx-uploader`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| accept | string | - | Accepted file types (e.g., '.pdf,.doc,.docx' or 'image/*') |
| multiple | boolean | false | Allow multiple file selection |
| maxFileSize | number | - | Maximum file size in bytes |
| maxFiles | number | - | Maximum number of files allowed |
| showPreview | boolean | true | Show preview of uploaded files |
| dragDropEnabled | boolean | true | Enable drag-and-drop functionality |
| tooltip | AdaptRxControlLabelTooltip | - | Label icon with a tooltip or popover |
| warningMessage | string | - | Warning message |
| name | string | - | Native control name |
| label | string | - | Control label text |
| subLabel | string | - | Control subLabel text |
| requiredLabel | string | - | Required label text |
| placeholder | string | 'Drop files here or click to browse' | Placeholder text |
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
| fileSelect | EventEmitter<File[]> | Emits when files are selected |
| fileRemove | EventEmitter<File> | Emits when a file is removed |
| uploadError | EventEmitter<string> | Emits when upload validation fails |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-uploader-demo',
  templateUrl: './uploader-demo.html'
})
export class UploaderDemoComponent {
  // Template-driven
  uploadedFiles: File[] = [];
  
  // Reactive forms
  form = new FormGroup({
    documents: new FormControl([]),
    images: new FormControl([])
  });

  onFileSelect(files: File[]): void {
    console.log('Files selected:', files);
    this.uploadedFiles = files;
  }

  onFileRemove(file: File): void {
    console.log('File removed:', file);
  }

  onUploadError(error: string): void {
    console.error('Upload error:', error);
  }
}
```

### HTML Template

```html
<!-- Basic File Upload -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload Documents'"
                   [multiple]="true"
                   (fileSelect)="onFileSelect($event)"
                   (fileRemove)="onFileRemove($event)"></adapt-rx-uploader>

<!-- Image Upload with Type Restriction -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload Images'"
                   [accept]="'image/*'"
                   [multiple]="true"
                   [maxFileSize]="5242880"
                   [showPreview]="true"></adapt-rx-uploader>

<!-- PDF/Document Upload with Size Limit -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload PDF'"
                   [accept]="'.pdf,.doc,.docx'"
                   [maxFileSize]="10485760"
                   [subLabel]="'Maximum file size: 10MB'"
                   (uploadError)="onUploadError($event)"></adapt-rx-uploader>

<!-- Single File Upload -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload Resume'"
                   [accept]="'.pdf,.doc,.docx'"
                   [multiple]="false"
                   [maxFileSize]="5242880"></adapt-rx-uploader>

<!-- Reactive Form -->
<form [formGroup]="form">
  <adapt-rx-uploader formControlName="documents"
                     [label]="'Supporting Documents'"
                     [requiredLabel]="'*'"
                     [multiple]="true"
                     [accept]="'.pdf,.doc,.docx,.txt'"
                     [maxFiles]="5"
                     [maxFileSize]="10485760"></adapt-rx-uploader>
  
  <adapt-rx-uploader formControlName="images"
                     [label]="'Product Images'"
                     [accept]="'image/*'"
                     [multiple]="true"
                     [maxFiles]="10"
                     [showPreview]="true"></adapt-rx-uploader>
</form>

<!-- With Drag-Drop Disabled -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload File'"
                   [dragDropEnabled]="false"
                   [placeholder]="'Click to select file'"></adapt-rx-uploader>

<!-- With Tooltip -->
<adapt-rx-uploader [(ngModel)]="uploadedFiles"
                   [label]="'Upload Attachments'"
                   [tooltip]="{text: 'Supported formats: PDF, DOC, DOCX'}"
                   [accept]="'.pdf,.doc,.docx'"
                   [multiple]="true"></adapt-rx-uploader>
```

## Key Features

- Drag-and-drop file upload
- Multiple file selection
- File type validation (accept attribute)
- File size validation
- Maximum files limit
- File preview (especially for images)
- Remove uploaded files
- Label and sub-label support
- Template-driven and reactive forms support
- Error handling and validation
- Tooltip/popover integration
- Accessibility support (ARIA attributes)
- Disabled and readonly states
- Custom placeholder text

