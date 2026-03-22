# Definition
Innovation Studio is a production from BMC Helix.  
A view components is implemented as regular Angular components. They extend classes, implement interfaces, and use services provided in BMC Helix Innovation Studio SDK. To make a view component available in the View designer, it must be registered using `RxViewComponentRegistryService`.  
A Standalone View Component can be used by itself.


## 1. Naming convention
When creating a Standalone View Component, you need to provide a name for it (`<view-component-name>`):
* The View Component name should only use lowercase alphanumeric characters and dashes. No spaces or special characters are allowed,
* It is not necessary to use the `bundleId` or the `application-name `in the View Component name, as the View Component is already scoped to the application,


## 2. Pre-requisites
To generate a View Component, you can leverage the Angular Schematic provided by BMC Helix Innovation Studio SDK, but before that, make sure that you have the following pre-requisites:
* Check that the nodeJs version is 20.15.1,
* Check that yarn version is 1.22.22 is installed,
* Check that the environment variable `JAVA_HOME` is set and points to a valid JDK 17.0.x installation,
* Check that the environment variable `RX_SDK_HOME` is set (location of the BMC Helix Innovation Studio SDK) and that it points to the correct path where the SDK is installed,
  
If any of these pre-requisites are not met, you might encounter errors when generating the View Component skeleton or when running the application.  
In this case, execute the different commands from the file [pre-requisites.md](../../pre-requisites.md) to check and set up the required environment for generating the View Component skeleton and running the application.
  
> Note:
> Be careful, depending on the shell, it might not be immediately accessible especially when the End User is using zsh since it might display information about the system etc... So the first command might fail.  
> You might have to repeat the command.  

## 3. Skeleton generation
BMC Helix Innovation Studio SDK provides an Angular Schematic to generate the skeleton of a Standalone View Component.  
The View Component will automatically be generated in the folder `/bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/` in its own folder which is the View Component name `<view-component-name>` itself.  
  
To generate the skeleton of a Standalone View Component, run the following command from the folder `/bundle/src/main/webapp/`:
```bash
npx ng g rx-view-component "<view-component-name>"
```
  
_Note:_  
If you want to see if there are no errors, you can first run the command with the `--dry-run` option, it will check that everything is correct without generating any file:
```bash
npx ng g rx-view-component "<view-component-name>" --dry-run
```

The View Component is automatically registered in the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/<application-name>.module.ts` by the Schematic.


# View Component folder structure
## Treeview
The folder structure of a Standalone View Component will then be as follows:
```
<view-component-name>/
├── design/
│   ├── <view-component-name>-design.component.html
│   ├── <view-component-name>-design.component.scss
│   ├── <view-component-name>-design.component.ts
│   ├── <view-component-name>-design.model.ts
│   └── <view-component-name>-design.types.ts
├── runtime/
│   ├── <view-component-name>.component.html
│   ├── <view-component-name>.component.scss
│   └── <view-component-name>.component.ts
├── <view-component-name>-registration.module.ts
└── <view-component-name>.types.ts
```

Description of the files:
* `design/`: This folder contains the files related to the design-time experience of the View Component in the View Designer.
  * `<view-component-name>-design.component.html`: The HTML template for the design-time component.
  * `<view-component-name>-design.component.scss`: The SCSS styles for the design-time component.
  * `<view-component-name>-design.component.ts`: The TypeScript file for the design-time component.
  * `<view-component-name>-design.model.ts`: The model definitions for the design-time component that defines the View Component Input and Output parameters and their validation.
  * `<view-component-name>-design.types.ts`: The type definitions for the design-time component.
* `runtime/`: This folder contains the files related to the runtime experience of the View Component that the End User will see.
  * `<view-component-name>.component.html`: The HTML template for the runtime component.
  * `<view-component-name>.component.scss`: The SCSS styles for the runtime component.
  * `<view-component-name>.component.ts`: The TypeScript file for the runtime component.
* `<view-component-name>-registration.module.ts`: The module file that registers the View Component with the `RxViewComponentRegistryService`. This module will be registered in the main application module.
* `<view-component-name>.types.ts`: The type definitions for the View Component.


## Design vs Runtime
The View Component is split into two parts:
* Design-time: This part is used in the View Designer to configure the View Component. It defines the Input and Output parameters, and provides a preview of the component.
* Runtime: This part is used when the application is running. It defines the actual behavior and appearance of the component that the End User will interact with.
  
You can find information about how to implement:
* The design-time component and configuration in the document [standalone-view-component-design-time.md](./standalone-view-component-design-time.md),  
* The runtime component in the document [standalone-view-component-runtime.md](./standalone-view-component-runtime.md),


## Standalone View Component type (`<view-component-name>.types.ts`)
It is virtually identical to the design time model file (`design/<view-component-name>-design.types.ts`), but it is used to define the types for the runtime component, while the design time types is used to define the types for the design time component.    
The only difference is that the interface extends `IRxStandardProps` from `@helix/platform/view/api`.  
For example:
```typescript
import { IRxStandardProps } from '@helix/platform/view/api';

export interface IPizzaOrderingProperties extends IRxStandardProps {
  name: string;
  customerName: string;
}
```

## Standalone View Component registration
### Standalone View Component registration module
The View Component is registered in the file `<view-component-name>-registration.module.ts` as an Angular Module.  
This module imports the `RxViewComponentRegistryService` from `@helix/platform/view/api` and registers the View Component using the `register()` method.  
Both the design-time and runtime components are registered together in this registration module.

Here are the registration properties:
* Some are automatically set by the Schematic when generating the View Component skeleton:
  * `type`: A unique identifier for the View Component, usually in the format `<bundle-id-kebab>-<application-name>-<view-component-name>`.
    * This property is very important and should not be modified,
  * `name`: The display name of the View Component shown in the View Designer,
  * `group`: The group or category under which the View Component will be listed in the View Designer,
  * `icon`: The icon representing the View Component in the View Designer,
    * **CRITICAL** Only use an icon from the Adapt icon library listed [here](../../Services/GettingAdaptIcons.md), otherwise the icon will not be displayed and you might get errors in the console,
* `component`: The runtime component class that will be used when the application is running.
  * This should not be modified,
* `designComponent`: The design-time component class that will be used in the View Designer.
  * * This should not be modified,
* `designComponentModel`: The model class that defines the Input and Output parameters for the design-time component.
  * * This should not be modified,
* `properties`: An array defining the input parameters of the View Component
  * The Input parameters input typing, validation and more details are defined in the file `<view-component-name>-design.model.ts`,
  * The Output parameters are defined in the file `<view-component-name>-design.model.ts`,
  * Some default input properties are defined Out of the box in the constant `RX_STANDARD_PROPS_DESC` from `@helix/platform/view/api` like `visible`, `enabled`, `cssClass`, etc....
  * Custom input variables, including their names and whether expression evaluation is enabled:
    * ```typescript
      {
          name: '<inputVariableName>',
          enableExpressionEvaluation: true | false
       }
      ```
    * The property `enableExpressionEvaluation` specifies whether the input variable can be configured using expression evaluation in the View Designer,
      * If set to `true`, the expression stored in this input variable will automatically evaluated at runtime,
        * This can be useful for dynamic values that depend from other View Components for example, in this case the input variable value would be updated automatically when the other View Component value changes,
        * Most of the time, `true` is the recommended value for this property,
      * If set to `false`, the input variable can only be set to static values and will not be automatically evaluated,
    * The property `localizable` specifies whether the input variable supports localization,
      * If set to `true`, the input variable can have different values based on the user's locale,
      * If set to `false`, the input variable will have the same value for all locales,
        * Usually an input variable is not localizable,
* Some are optional and can be added as needed:
  * `options`: Additional options for the View Component, such as whether it can be embedded in a Record Editor:
  *   * ```typescript
        options: {
          canBeEmbeddedInRecordEditor: true | false
        }
        ```
  * The property `canBeEmbeddedInRecordEditor` specifies whether the View Component can be used (positioned) inside a Record Editor,
    * If set to `true`, the View Component will be available for embedding in Record Editors,
      * This is often useful for View Components that display or interact with record data,
    * If set to `false`, it will not be available for embedding in Record Editors,
  * `availableInBundles`: An array of bundle IDs where the View Component should be available in the View Designer palette.
    * This should be set if you want to restrict the availability of the View Component to specific bundles only,
    * This is rarely used for Standalone View Components, as they are usually used withing multiple applications,
    * To show the same component in more than one coded application’s palette, list every bundle id (e.g. `['com.example.pizza', 'com.other.app']`).

Here is an example of a registration Module for a Standalone View Component where:
* The bundleId would be `com.example`,
* The application name would be `pizza`,
* The View Component name would be `pizza-ordering`,
* One custom input variable called `customerName` is defined with expression evaluation enabled,
```typescript
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { PizzaOrderingDesignComponent } from './design/pizza-ordering-design.component';
import { PizzaOrderingDesignModel } from './design/pizza-ordering-design.model';
import { PizzaOrderingComponent } from './runtime/pizza-ordering.component';

@NgModule()
export class PizzaOrderingRegistrationModule {
  constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
    rxViewComponentRegistryService.register({
      type: 'com-example-pizza-pizza-ordering',
      name: 'Pizza Ordering',
      group: 'Pizza',
      icon: 'search_plus',
      component: PizzaOrderingComponent,
      designComponent: PizzaOrderingDesignComponent,
      designComponentModel: PizzaOrderingDesignModel,
      availableInBundles: ['com.example.pizza'],
      options: {
        canBeEmbeddedInRecordEditor: true
      },
      properties: [
        {
          name: 'customerName',
          enableExpressionEvaluation: true
        },
        ...RX_STANDARD_PROPS_DESC
      ]
    });
  }
}
```

### Standalone View Component registration in the main application module
The Standalone View Component is automatically registered in the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/<view-component-name>-registration.module.ts` by the Schematic, for example:
```typescript
import { <StandaloneViewComponentModule> } from './view-components/<view-component-name>/<view-component-name>-registration.module';
// ...
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    <StandaloneViewComponentModule>
  ]
})
```
Using the example above with the View Component module `PizzaOrderingRegistrationModule`:
```typescript
import { PizzaOrderingRegistrationModule } from './view-components/pizza-ordering/pizza-ordering-registration.module';
// ...
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PizzaOrderingRegistrationModule
  ]
})
```

## Adding new input / outputs for the View Component
It might be necessary to add new Input or Output parameters to the View Component to allow configuration in the View Designer or to emit events to other components, for example getting as input a price, the VAT, and then emitting the total price as output.  
You might have to remove the out of the box input parameter `message`, and add new ones in the registration, design time and runtime types, design time model and runtime code.  


## Default input parameter `message`
The Innovation Studio schematic will generate a default `message` input parameter for the View Component, this is just an example input parameter to show how to define an input parameter, it can be removed or modified as needed.  
Since it is marked as `required`, it might be necessary to remove this input parameter and its logic from the design-time and runtime components if it is not needed, otherwise you will need to provide a value for this input parameter when configuring the View Component instance in the View Designer, otherwise you will get a validation error.  


# Sample code
An example of a Standalone View Component is the `Pizza Ordering` component in the folder [pizza-ordering](../Examples/StandaloneViewComponent/pizza-ordering/), it is a simple component that takes as input the `customer name` and displays it in the runtime view, it also has a design-time component that shows a placeholder text in the View Designer.
`customer name` is also defined as a settable input parameter.  
`customer name` is also an output parameter that emits an event when it is set using a Set Property view action.

