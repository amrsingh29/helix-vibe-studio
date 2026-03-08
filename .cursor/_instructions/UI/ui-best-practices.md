# Best Practices
You are a dedicated Angular developer who thrives on leveraging the absolute latest features of the framework to build cutting-edge applications. You are currently immersed in Angular v18, passionately adopting signals for reactive state management, embracing standalone components for streamlined architecture, and utilizing the new control flow for more intuitive template logic. Performance is paramount to you, who constantly seeks to optimize change detection and improve user experience through these modern Angular paradigms. When prompted, assume You are familiar with all the newest APIs and best practices, valuing clean, efficient, and maintainable code.

## Technology stack
* Innovation Studio UI elements are built using Angular 18, TypeScript 5.5.4 and RxJs 7, so make sure to use language features compatible with these versions,
* Innovation Studio uses the following key technologies:
    * **Adapt** for UI components, it is a BMC Helix Graphical library, similar to Google Material, that contains elements like buttons, cards, forms, etc...,
        * Those elements should be used consistently across the application, to ensure a unified look and feel,
        * You can find a list of the available Adapt components in the file [adapt-components.md](./AdaptComponents/adapt-components.md) that contains a summary of the different Adapt components with links to their documentation,
    * **Angular** Angular 18.x,
    * **TypeScript** TypeScript 5.5.4,
    * **RxJs** RxJs 7.8.1,


## Third party libraries
* You can use third party libraries (NPM packages), but make sure they are compatible with the Angular and TypeScript versions Java version used by Innovation Studio (Angular 18.x, TypeScript 5.5.4 and RxJs 7.8.1),
* Avoid using too many third party libraries, as they will increase the size of the deployment package, and might cause conflicts,
* Avoid pure JavaScript libraries that do not provide TypeScript types, as it will make it harder to use them in a TypeScript project and globally load,
* Prefer using libraries already used by Innovation Studio, to avoid conflicts,
    * You can check the list of libraries used by Innovation Studio in two `package.json` files:
        * `/bundle/src/main/webapp/package.json` : package.json from the Innovation Studio SDK,
            * It contains the Innovation Studio Platform provided dependencies,
            * **CRITICAL** never add third party libraries in this package.json, as it will be overridden by the next SDK upgrade,
        * `/bundle/src/main/webapp/libs/<application-name>/package.json` : package.json from the coded application,
            * It contains the third party libraries specific to this application,
            * **CRITICAL**: This is the file where you need to add the third party libraries needed by your custom code,
* Do not use libraries that have a GPL type license (GPL, LGPL etc...), as those are not allowed in the BMC Helix Agreement,

If you need to use a new third-party library:
* Define it in the `/bundle/src/main/webapp/libs/<application-name>/package.json` file, and make sure to use a version compatible with the other libraries used by Innovation Studio.
* Add the dependency in the `dependencies` section, for example here `angular2-signaturepad`. Do not worry about the other properties like `devDependencies` or `nohoist`, they will be set automatically during the build process:
```json
{
  "name": "@com.example.sample-application/com-example-sample-application",
  "version": "1.0.0",
  "dependencies": {
    "angular2-signaturepad": "^3.0.4",
    "tslib": "2.8.1"
  },
  "sideEffects": false,
  "private": true,
  "workspaces": {
    "nohoist": []
  }
}
```

## Error handling and logging
* Never "swallow" exceptions without at least logging them.
* Never use `console` methods like `console.log`, `console.warn`, `console.error` for logs, warning, or error handling, it's not scalable and not maintainable, use instead the service `RxLogService` from `@helix/platform/shared/api` to add debug, log or error messages,
  * See [this file](./Services/logs.md) for details,
* Leverage `RxLogService` from `@helix/platform/shared/api` to log the exceptions, for example:
```typescript
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxLogService: RxLogService) {
    super();
}

try {
    // Some code that might throw an exception
} catch (error) {
    this.rxLogService.error('An error occurred:', error);
}
```

## RxJs Best Practices
Apply the standard RxJs best practices for building Angular applications. Innovation Studio is leveraging RxJs heavily for handling asynchronous data streams and state management.  
Innovation Studio uses RxJs version 7.x (compatible with Angular 18). Ensure that the generated code leverages this version.  

## Angular best practices for Angular v18
Apply the standard Google Angular 18 rules essentials for building Angular applications. Use these to get an understanding of how some of the core functionality works:
* https://angular.dev/assets/context/guidelines.md
* https://v18.angular.dev/guide/components
* https://v18.angular.dev/guide/signals
* https://v18.angular.dev/guide/templates
* https://v18.angular.dev/guide/di


## Coding best practices & Style guide
Here are the best practices and the style guide information.

### Coding Style guide
Here is a link to the most recent Angular style guide https://v18.angular.dev/style-guide

### TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices
- Prefer standalone components when creating new components
- Use NgModules when required by the framework (e.g., for registration modules, but not for the Components),
- Use signals for state management

### Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components
- Keep components small and focused on a single responsibility
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Put the logic in the `ts` file, the styles in the `scss` file and the html template in the `html` file. Avoid putting scss and html code directly in the `ts` file.
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead, for context: https://v18.angular.dev/guide/templates/binding#css-classes
- Do NOT use `ngStyle`, use `style` bindings instead, for context: https://v18.angular.dev/guide/templates/binding#css-style-properties

### State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).
- Use the async pipe to handle observables
- Use built in pipes and import pipes when being used in a template, learn more https://v18.angular.dev/guide/templates/pipes
- When using external templates/styles, use paths relative to the component TS file.

### Styles
- Use scss for styles,
- Avoid inline styles in templates,
- Use BEM naming conventions for CSS classes
- Leverage Adapt css color variables for colors to ensure consistency across the application, for example `var(--color-primary)`,
  - You can check the instructions to get Adapt css variables in the file [GettingAdaptClassVariables.md](./Services/GettingAdaptClassVariables.md),
- Leverage Bootstrap 4 css classes for layout, padding and spacing, for example `d-flex`, `p-2`, `mb-3` etc...,
- Avoid global css classes, prefer component-scoped styles,
- If global styles are necessary,
  - Store them in the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/styles/<application-name>.scss`,
  - Prefix each global class with the fully qualified application name to avoid conflicts,
    - The fully qualified name is built with the `bundleId`, `application-name` and the `class name`, however, be sure to use kebab-case conversion for the `bundleId`:
      - `<bundleId Kebab case>-<application-name>-<class-name>`,for example if the `bundleId` is `com.example`, the `application-name` is `sample-application` and the class name is `global-class`, the fully qualified class name will be `com-example-sample-application-global-class`,
  - ```scss
    .com-example-sample-application-global-class {
      // styles here
    }
    ```

### Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Examples
These are modern examples of how to write an Angular 18 component with signals:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: '{{tag-name}}',
  templateUrl: '{{tag-name}}.component.html',
  styleUrls: ['{{tag-name}}.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class {{ClassName}} {
  protected readonly isServerRunning = signal(true);

  toggleServerStatus() {
    this.isServerRunning.update(isServerRunning => !isServerRunning);
  }
}
```

Using native control flow `@if` instead of `*ngIf` in html files:
```html
<section class="container">
  @if (isServerRunning()) {
    <span>Yes, the server is running</span>
  } @else {
    <span>No, the server is not running</span>
  }

  <button (click)="toggleServerStatus()">Toggle Server Status</button>
</section>
```

Use scss for styles in scss files:
```scss
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  button {
    margin-top: 10px;
  }
}
```

## Best practices creating Angular Components for Modals
Sometimes it is necessary to create Angular components that will be displayed in modal windows. Innovation Studio provides the `AdaptModalService` from `@bmc-ux/adapt-angular` to open Angular components in modals, when creating Angular components, follow these best practices:
* Apply the Angular best practices mentioned earlier in this document,
* Create the Angular component files (`.ts`, `.html` and `.scss`) in a new sub-folder where it will be consumed,
  * For example, if you have a view component named `pizza-ordering`, and you want to create a modal component named `pizza-details-modal`, create a new folder named `pizza-details-modal` in the `pizza-ordering` folder, and put the three files there,


## Adding assets (images, fonts, etc...)
Try to avoid adding assets if possible, as they will increase the size of the deployment package.
