# Code Viewer

## Description

Code Viewer component provides syntax-highlighted code display with features like line numbers, copy functionality, and support for multiple programming languages.

## Import

```typescript
import {AdaptCodeViewerModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-code-viewer`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| code | string | - | Code content to display |
| language | string | 'javascript' | Programming language for syntax highlighting |
| showLineNumbers | boolean | true | Show/hide line numbers |
| showCopyButton | boolean | true | Show/hide copy to clipboard button |
| highlightLines | number[] | [] | Array of line numbers to highlight |
| startLineNumber | number | 1 | Starting line number |
| maxHeight | string \| number | - | Maximum height of code viewer |
| theme | 'light' \| 'dark' | 'light' | Color theme |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| copySuccess | EventEmitter<void> | Emits when code is successfully copied to clipboard |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'adapt-code-viewer-demo',
  templateUrl: './code-viewer.demo.html'
})
export class AdaptCodeViewerDemoComponent {
  typescriptCode = `
import {Component} from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  message: string = 'Hello World';
  
  sayHello(): void {
    console.log(this.message);
  }
}`;

  htmlCode = `
<div class="container">
  <h1>{{message}}</h1>
  <button (click)="sayHello()">
    Click Me
  </button>
</div>`;

  jsonCode = `
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "@angular/core": "^18.0.0"
  }
}`;

  onCopySuccess(): void {
    console.log('Code copied to clipboard!');
  }
}
```

### HTML Template

```html
<!-- TypeScript Code -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   (copySuccess)="onCopySuccess()"></adapt-code-viewer>

<!-- HTML Code -->
<adapt-code-viewer [code]="htmlCode"
                   [language]="'html'"></adapt-code-viewer>

<!-- JSON Code -->
<adapt-code-viewer [code]="jsonCode"
                   [language]="'json'"
                   [showLineNumbers]="true"></adapt-code-viewer>

<!-- Without Line Numbers -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [showLineNumbers]="false"></adapt-code-viewer>

<!-- Without Copy Button -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [showCopyButton]="false"></adapt-code-viewer>

<!-- With Highlighted Lines -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [highlightLines]="[5, 7, 8]"></adapt-code-viewer>

<!-- With Max Height and Scroll -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [maxHeight]="300"></adapt-code-viewer>

<!-- Dark Theme -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [theme]="'dark'"></adapt-code-viewer>

<!-- Custom Starting Line Number -->
<adapt-code-viewer [code]="typescriptCode"
                   [language]="'typescript'"
                   [startLineNumber]="10"></adapt-code-viewer>

<!-- Inline Code Example -->
<adapt-code-viewer [code]="'const greeting = \"Hello World\";'"
                   [language]="'javascript'"
                   [showLineNumbers]="false"></adapt-code-viewer>
```

## Supported Languages

Common supported languages include:
- `javascript` / `js`
- `typescript` / `ts`
- `html`
- `css` / `scss` / `sass`
- `json`
- `xml`
- `python`
- `java`
- `c` / `cpp` / `csharp`
- `sql`
- `bash` / `shell`
- `markdown` / `md`
- And many more...

## Key Features

- Syntax highlighting for multiple languages
- Line numbers display
- Copy to clipboard functionality
- Line highlighting
- Custom starting line numbers
- Maximum height with scrolling
- Light and dark themes
- Responsive design
- Read-only display
- Ideal for documentation and code examples

