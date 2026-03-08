# Definition
Innovation Studio is a production from BMC Helix.
A view action is a service that implements the execute method. The method receives the view action parameters and returns an Observable that should be completed when the view action is completed. It can also throw an error if something goes wrong. When a view action throws an error, the following view actions will not be executed.  


## 1. Naming convention
When creating a View Action, you need to provide a name for it (`<view-action-name>`):
* The View Action name should only use lowercase alphanumeric characters and dashes. No spaces or special characters are allowed,
* It is not necessary to use the `bundleId` or the `application-name `in the View Action name, as the View Action is already scoped to the application,


## 2. Pre-requisites
To generate a View Action, you can leverage the Angular Schematic provided by BMC Helix Innovation Studio SDK, but before that, make sure that you have the following pre-requisites:
* Check that the nodeJs version is 20.15.1,
* Check that yarn version is 1.22.22 is installed,
* Check that the environment variable `JAVA_HOME` is set and points to a valid JDK 17.0.x installation,
* Check that the environment variable `RX_SDK_HOME` is set (location of the BMC Helix Innovation Studio SDK) and that it points to the correct path where the SDK is installed,
  
If any of these pre-requisites are not met, you might encounter errors when generating the View Action skeleton or when running the application.  
In this case, execute the different commands from the file [pre-requisites.md](../../pre-requisites.md) to check and set up the required environment for generating the View Action skeleton and running the application.
  
> Note:
> Be careful, depending on the shell, it might not be immediately accessible especially when the End User is using zsh since it might display information about the system etc... So the first command might fail.  
> You might have to repeat the command.  

## 3. Skeleton generation
BMC Helix Innovation Studio SDK provides an Angular Schematic to generate the skeleton of a View Action.  
The Action Component will automatically be generated in the folder `/bundle/src/main/webapp/libs/<application-name>/src/lib/actions/` in its own folder which is the View Action name `<view-action-name>` itself.  
  
To generate the skeleton of a View Action, run the following command from the folder `/bundle/src/main/webapp/`:
```bash
npx ng g rx-view-action "<view-action-name>"
```
  
_Note:_  
If you want to see if there are no errors, you can first run the command with the `--dry-run` option, it will check that everything is correct without generating any file:
```bash
npx ng g rx-view-action "<view-action-name>" --dry-run
```

The View Action is automatically registered in the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/<application-name>.module.ts` by the Schematic.


# View Action folder structure
## Treeview
The folder structure of a View Action will then be as follows:
```
<view-action-name>/
  ├── <view-action-name>-action-design-manager.service.ts
  ├── <view-action-name>-action-design-model.class.ts
  ├── <view-action-name>-action-design.types.ts
  ├── <view-action-name>-action.module.ts
  ├── <view-action-name>-action.service.ts
  └── <view-action-name>-action.types.ts
```
  
Description of the files:
* `<view-action-name>-action-design-manager.service.ts`: The design time view action manager service responsible for view action parameter validation, it implements the `IViewActionDesignManager` interface from `@helix/platform/view/api` and defines the `validate()` method that will be called when validating the view action parameters in the View Designer.
* `<view-action-name>-action-design-model.class.ts`: The design time view action model class responsible for view action initialization and configuration. It extends the `RxViewDesignerActionModel` class from `@helix/platform/view/designer` and defines the input parameters for the View Action, it can also include any additional logic needed for the design-time configuration of the view action.
* `<view-action-name>-action-design.types.ts`: A TypeScript interface that describes the runtime View Action parameters.
* `<view-action-name>-action.module.ts`: An Angular module required for registering the view Action. It will import the `rxViewActionRegistryService` from `@helix/platform/view/api` and register the View Action using the `register()` method, it will also specify the design manager service and the design model class to be used for this View Action.
* `<view-action-name>-action.service.ts`: The runtime view action service. It implements the `IViewActionService` interface from `@helix/platform/view/api` and defines the `execute()` method that will be called when executing the view action at runtime, it receives the view action parameters as input and should return an Observable that completes when the view action is completed, it can also throw an error if something goes wrong.
* `<view-action-name>-action.types.ts`: A TypeScript interface that describes the runtime view action parameters.

# Design vs Runtime
The View Action is split into two parts:
* Design-time: This part is used in the View Designer to configure the View Action. It defines the Input and Output parameters and their validation.
* Runtime: This part is used when the application is running. It defines the actual behavior of the View Action that the End User will interact with.
  
## Design
### Type definition (`<view-action-name>-action-design.types.ts`)
The `<view-action-name>-action-design.types.ts` file contains the type definitions for the View Action inputs (name and type) used in the design model.  
The Interface extends the `IViewActionDesignProperties` interface from `@helix/platform/view/api`.
```typescript
import { IViewActionDesignProperties } from '@helix/platform/view/api';

export interface I<ViewActionName>ActionDesignProperties extends IViewActionDesignProperties {
  customerName: string;
}
```  

**Important note:**  
Do not modify the imported interface `IViewActionDesignProperties`.

### Model (`<view-action-name>-action-design-model.class.ts`)
This file contains the model class that defines:
* The Input parameters with their types,
* The Output parameters with their types,

_Note:_  
The validation rules for the Input parameters will be in the file `<view-action-name>-action-design-manager.service.ts`.

_Note:_  
The Inputs and Outputs will be available in the View Designer when configuring the View Action instance, in the Data Dictionary.  

The model constructor contains multiple sections, registering:
* The input parameters,
* The settable input parameters,
* The output parameters,

#### Input parameters current values
The current value of the input parameters are the ones saved in a previous configuration.
They are in the return statement of the method `getInitialProperties` in the design model, which is typed with the type `I<ViewActionName>DesignProperties` from `<view-action-name>-action-design.types.ts`.  It returns the initial properties of the View Action instance, which override default values. The returned type is `I<ViewActionName>DesignProperties` from `<view-action-name>-action-design.types.ts`.  
You also need to set the default values of the input parameters here.  
  
For example:
```typescript
import { IDisplayMessageActionDesignProperties } from './display-message-action-design.types';
import { ViewActionDesignEditableProperties } from '@helix/platform/view/api';
// ...
// This method is called when a new, or an existing view action is initialized in the view designer.
// It returns values for all properties of the view action.
static getInitialProperties(currentInputParams: ViewActionDesignEditableProperties<IDisplayMessageActionDesignProperties>) {
  return {
    // initial values for custom input parameters
    customerName: '',
    // input parameter values of an existing view action that are already saved in the view
    ...currentInputParams
  };
}
```
If you add or remove inputs for the view action, do not forget to update this method.


#### Input parameters registration
```typescript
this.sandbox.setActionPropertyEditorConfig(this.getActionEditorConfig());
```

The method in itself lists the different input parameters with their types and default values, for example here the input parameters `customerName` is registered with its type:
```typescript
import { IViewActionDesignPropertyEditorConfig } from '@helix/platform/view/api';
// ..
private getActionEditorConfig(): IViewActionDesignPropertyEditorConfig {
  return [
    {
      name: 'customerName',
      component: ExpressionFormControlComponent,
      options: {
        label: 'Customer Name',
        isRequired: true,
        dataDictionary$: this.expressionConfigurator.getDataDictionary(),
        operators: this.expressionConfigurator.getOperators()
      } as IExpressionFormControlOptions
    }
  ];
}
```   

#### Input parameters definition
The structure of each input parameter configuration is as follows:
* `name`: The name of the input parameter, it should match the property name defined in the design types file (`<view-action-name>-action-design.types.ts`) and in the runtime types file (`<view-action-name>-action.types.ts`),
* `component`: The form control component used to configure this input parameter in the View Designer,
  * The component is provided by the Innovation Studio SDK, you can check the available components in the package `@helix/platform/shared/components`,
* `options`: The options for the form control component, it can include:
  * `label`: The label shown in the View Designer for this input parameter,
  * `tooltip`: The tooltip shown in the View Designer for this input parameter,
  * `dataDictionary$`: An observable of the data dictionary, used for expression evaluation,
    * It is nearly always the default value `this.expressionConfigurator.getDataDictionary(),`, it is extremely rare to build a custom data dictionary for a specific input parameter,
  * `operators`: The operators available for expression evaluation,
    * It is nearly always the default value `this.expressionConfigurator.getOperators(),`, it is extremely rare to build custom operators for a specific input parameter,
  * `isRequired`: Whether this input parameter is required or not at design time,
  * This configuration is then cast.

In the following example, a custom input parameter called `customerName` is defined with expression evaluation enabled, it is marked as required and has a tooltip explaining its purpose. The component is `ExpressionFormControlComponent` from `@helix/platform/shared/components`, and the configuration object is cast as `IExpressionFormControlOptions` from `@helix/platform/shared/components` and also listed in the next chapter `Component types and cast selection`:
```typescript
import { ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
// ...
{
  name: 'customerName',
  component: ExpressionFormControlComponent,
  options: {
    label: 'Customer Name',
    isRequired: true,
    dataDictionary$: this.expressionConfigurator.getDataDictionary(),
    operators: this.expressionConfigurator.getOperators()
  } as IExpressionFormControlOptions
}
```

#### Component types and cast selection
Here are the different combinations of component and cast, depending on the type of the input parameter.  
If the input parameter is an expression that will be evaluated at runtime, you will need to use:
* component: `ExpressionFormControlComponent` from `@helix/platform/shared/components`,
* cast: the options object should be cast as `IExpressionFormControlOptions` from `@helix/platform/shared/components`,
  * Example:
    * ```typescript
          import { ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
          import { Tooltip } from '@helix/platform/shared/api';
          // ...
          {
              name: 'customerName',
              component: ExpressionFormControlComponent,
              options: {
                  label: 'Customer Name',
                  tooltip: new Tooltip('The Customer Name is a required property whose value will be displayed at runtime.'),
                  dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                  operators: this.expressionConfigurator.getOperators(),
                  isRequired: true
              } as IExpressionFormControlOptions
          }
       ```

For the other types that are "simple" types (aka values not evaluated as expressions), usually there is no need for the `option` properties `dataDictionary$` and `operators`.  
You can use the following components and casts:
* If the type is `Text` and is not an expression:
  * component: `TextFormControlComponent` from `@helix/platform/shared/components`,
  * cast: no need to cast the options object,
    * Example:
      * ```typescript
              import { TextFormControlComponent, ITextFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'textValue',
                  component: TextFormControlComponent,
                  options: {
                      label: 'Text Value'
                  } as ITextFormControlOptions
              }
         ```
* If the type is `Boolean` (the setting will be displayed as a Checkbox in the View Designer):
  * component: `BooleanFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `ICheckboxFormControlOptions` from `@helix/platform/shared/components`,
    * Example:
      * ```typescript
              import { BooleanFormControlComponent, ICheckboxFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'booleanValue',
                  component: BooleanFormControlComponent,
                  options: {
                      label: 'Boolean Value'
                  } as ICheckboxFormControlOptions
              }
          ```
* If the type is `Boolean` (the setting will be displayed as a Switch in the View Designer):
  * component: `SwitchFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `ISwitcherFormControlOptions` from `@helix/platform/shared/components`,
    * Example:
      * ```typescript
              import { SwitchFormControlComponent, ISwitcherFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'switchValue',
                  component: SwitchFormControlComponent,
                  options: {
                      label: 'Switch Value'
                  } as ISwitcherFormControlOptions
              }
          ```
* If the type is an `Integer` (the setting will be displayed as a Counter in the View Designer):
  * component: `CounterFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `ICounterFormControlOptions` from `@helix/platform/shared/components`,
  * This type requires the options `dataDictionary$` and `operators` to be set, even if you don't need them, you can just set them to the default values `this.expressionConfigurator.getDataDictionary(),` and `this.expressionConfigurator.getOperators(),` respectively,
    * Example:
      * ```typescript
              import { CounterFormControlComponent, ICounterFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'numberValue',
                  component: CounterFormControlComponent,
                  options: {
                      label: 'Number Value',
                      dataDictionary$: this.expressionConfigurator.getDataDictionary(),
                      operators: this.expressionConfigurator.getOperators(),
                  } as ICounterFormControlOptions
              }
          ```
* If the type is `Selection` of values (the setting will be displayed as a Selection in the View Designer):
  * component: `SelectFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `ISelectFormControlOptions` from `@helix/platform/shared/components`,
  * The options object should include:
    * The `options` property which is the list of values to select from, which is an array of objects with `id` and `name` properties, for example:
      ```typescript
         [
           {
               "id": "id1",
               "name": "Large"
           },
           {
               "id": "id2",
               "name": "Normal"
           },
           {
               "id": "id3",
               "name": "Small"
           },
           {
               "id": "id4",
               "name": "Extra Small"
           }
         ]
      ```
    * The property `sortAlphabetically` to specify whether the options should be sorted alphabetically in the View Designer or not,
    * Example:
      * ```typescript
              import { SelectFormControlComponent, ISelectFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'selectValue',
                  component: SelectFormControlComponent,
                  options: {
                      label: 'select Value',
                      options: [
                                {
                                    "id": "id1",
                                    "name": "Large"
                                },
                               {
                                   "id": "id2",
                                   "name": "Normal"
                               },
                               {
                                   "id": "id3",
                                   "name": "Small"
                               },
                               {
                                   "id": "id4",
                                   "name": "Extra Small"
                               }
                             ],
                      sortAlphabetically: false
                  } as ISelectFormControlOptions
              }
          ```
* If the type is `Color` (the setting will be displayed as a Color picker in the View Designer):
  * component: `ColorPickerFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `IColorPickerFormControlOptions` from `@helix/platform/shared/components`,
    * Example:
      * ```typescript
              import { ColorPickerFormControlComponent, IColorPickerFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'colorPickerValue',
                  component: ColorPickerFormControlComponent,
                  options: {
                      label: 'Color Picker Value'
                  } as IColorPickerFormControlOptions
              }
          ```
* If the type is `Tag` (the setting will be displayed as a zone where you can enter Tags):
  * component: `TagsFormControlComponent` from `@helix/platform/shared/components`,
  * cast: the options object should be cast as `ITagsFormControlOptions` from `@helix/platform/shared/components`,
    * Example:
      * ```typescript
              import { TagsFormControlComponent, ITagsFormControlOptions } from '@helix/platform/shared/components';
              // ...
              {
                  name: 'tagsValue',
                  component: TagsFormControlComponent,
                  options: {
                      label: 'Tags Value'
                  } as ITagsFormControlOptions
              }
          ```

There are also some specific components to pick up Innovation Studio objects, such as `Views`, `Processes` etc....
In this case:
* The component is `RxDefinitionPickerComponent` from `@helix/platform/shared/components`,
* The cast as `IDefinitionPickerComponentOptions` from `@helix/platform/shared/components`,
* The Innovation Studio object type is defined as option in `RxDefinitionPickerType.<definition type>` from `@helix/platform/shared/components`:
  * Views: `RxDefinitionPickerType.View`,
  * Processes: `RxDefinitionPickerType.Process`,
  * Associations: `RxDefinitionPickerType.Association`,
  * Named Lists: `RxDefinitionPickerType.NamedList`,
  * Records: `RxDefinitionPickerType.Record`,
    For example here to get a list of `Views` it would be `RxDefinitionPickerType.View`:
```typescript
import { RxDefinitionPickerComponent, IDefinitionPickerComponentOptions, RxDefinitionPickerType } from '@helix/platform/shared/components';
// ...
{
    name: 'viewName', 
    component: RxDefinitionPickerComponent,
    options: {
        label: 'viewName',
        definitionType: RxDefinitionPickerType.View
    } as IDefinitionPickerComponentOptions
}
```

#### Output parameters definition
A View Action can have output parameters that emit events to following actions in the View Designer.  
The output parameters are defined in the design model as well, they are defined in the method `getActionOutputDataDictionary` which returns an object `IViewActionOutputDataDictionary` from `@helix/platform/view/api`.  
To define an output parameter, you need to provide this object with the properties:
* `label`: The label of the property shown in the View Designer when configuring the `SetProperty` action,
* `expression`: The expression that will be evaluated to get the value of this property at runtime, it needs to be the `<outputParameterName>`,
```typescript
{
  label: '<outputParameterLabel>', 
  expression: this.getOutputExpressionForPropertyPath('<outputParameterName>')
}
```
  
For example:
```typescript
import { IViewActionOutputDataDictionary } from '@helix/platform/view/api';
// ..
// Creating the Data Dictionary to define the output parameters ("signature" here).
private getActionOutputDataDictionary(): IViewActionOutputDataDictionary {
  return [
    {
      label: 'Order Id',
      expression: this.getOutputExpressionForPropertyPath('orderId')
    }
  ];
}
```

### Design Manager (input parameters validation) definition (`<view-action-name>-action-design-manager.service.ts`)
The validation rules for the input parameters are defined in the method `validate` in the design manager.  
It takes as input the values of the input parameters via the `actionProperties` parameter, which is typed with the type `I<ViewActionName>ActionDesignProperties` from `<view-action-name>-action-design.types.ts`. This object will contain the current values of the input parameters.  
It returns an Observable of array of `IViewComponentDesignValidationIssue` from `@helix/platform/view/designer`.  
    
You can create validation issues using `validationIssues` object from import `@helix/platform/view/designer`:
* For an error: The `type` should be `ValidationIssueType.Error`,
  * An error will prevent the Innovation Studio view being saved with the current configuration, while a warning will just show a warning message but will not prevent saving.
* For a warning: The `type` should be `ValidationIssueType.Warning`,
  
The different values for the `type` property are in the enum `ValidationIssueType` from `@helix/platform/ui-kit`, which is imported from `@helix/platform/view/designer` in the design manager service:
```typescript
export declare enum ValidationIssueType {
  Warning = "warning",
  Error = "error",
  Info = "info"
}
```
  
_Note:_  
In order to get the label of the View Action to show it in the validation message, you can use the `actionDescriptor` object from the `RxViewActionRegistryService` service from import `@helix/platform/view/api` (`get` method), which contains the metadata of the view action, including the input parameters configuration and the view action label.  
The service `RxViewActionRegistryService` needs to be injected in the constructor of the design manager service.  
You can get the label of the input parameter that triggered the validation using `actionDescriptor.label` property.  
Do not worry about the `propertyName` parameter, it is a system parameter that is automatically set by the View Designer when calling the `validate` method.  

For example:
```typescript
import { Injectable } from '@angular/core';
import { IViewActionDesignManager, RxViewActionRegistryService } from '@helix/platform/view/api';
import { IViewComponentDesignValidationIssue } from '@helix/platform/view/designer';
import { Observable, of } from 'rxjs';
import { IDisplayMessageActionDesignProperties } from './display-message-action-design.types';
import { ValidationIssueType } from '@helix/platform/ui-kit';

@Injectable()
export class DisplayMessageActionDesignManagerService implements IViewActionDesignManager<IDisplayMessageActionDesignProperties> {
  constructor(private rxViewActionRegistryService: RxViewActionRegistryService) {
  }

  // This method will be called automatically to validate view action input parameters.
  validate(actionProperties: IDisplayMessageActionDesignProperties, propertyName: string): Observable<IViewComponentDesignValidationIssue[]> {
    const validationIssues: IViewComponentDesignValidationIssue[] = [];
    // The actionDescriptor will contain the definition of the view action (its label, its input parameters etc...). 
    // actionDescriptor.label will contain the label of the view action as defined in its module, which can be used in the validation messages to make them more user friendly.
    const actionDescriptor = this.rxViewActionRegistryService.get(actionProperties.name);
    
    // Example validation rule for the input parameter "customerName": it should not be empty and should not contain numbers.
    if (!actionProperties.customerName || actionProperties.customerName.trim() === '') {
      validationIssues.push({
        type: ValidationIssueType.Error,
        propertyName: propertyName,
        description: `${actionDescriptor.label}: Customer Name is a required field.`
      });
    }
    
    if (/\d/.test(actionProperties.customerName)) {
      validationIssues.push({
        type: ValidationIssueType.Error,
        propertyName: propertyName,
        description: `${actionDescriptor.label}: Customer Name should not contain numbers.`
      });
    }
    
    return of(validationIssues);
  }
}
```

## Runtime
### View Action Runtime type (`<view-action-name>-action.types.ts`)
The `<view-action-name>-action.types.ts` file contains the type definitions for the View Action inputs (name and type) used at runtime.  
It is virtually identical as the design time type file (`<view-action-name>-action-design.types.ts`), the only difference is that it does not extend `IViewActionDesignProperties`.
```typescript
export interface I<ViewActionName>ActionProperties {
  message: string;
}
```

### Runtime service (`<view-action-name>-action.service.ts`)
The `<view-action-name>-action.service.ts` file contains the runtime service that defines the actual behavior of the View Action. It implements the `IViewActionService` interface from `@helix/platform/view/api` and defines the `execute()` method that will be called when executing the view action at runtime.  
The `execute()` method receives the view action parameters as input and should return an Observable that completes when the view action is completed, it can also throw an error if something goes wrong.  
The view action parameters are received as an object typed with the runtime type `I<ViewActionName>ActionProperties` defined in `<view-action-name>-action.types.ts`.  
To access the input parameters, you can use the `inputParameters` parameter of the `execute()` method, which is typed with the runtime type `I<ViewActionName>ActionProperties` from `<view-action-name>-action.types.ts`. For example, if you have an input parameter called `customerName`, you can access its value using `inputParameters.customerName`.  

Handling output parameters:
* If there are no output parameters:
  * The Observable returned by the `execute()` method can just complete emitting `EMPTY` from `rxjs`, or throwError(null) from `rxjs` if the View Action encountered an exception,
* If there are output parameters:
  * The best practice is to build an object `IPlainObject` from `@helix/platform/shared/api`, where:
    * The keys are the output parameter names,
    * The values **MUST** be wrapped in an Observable using `of()` from `rxjs` — **never assign a raw value directly**,
  * Then return this object wrapped in `forkJoin()` from `rxjs`, which resolves all inner Observables and emits the resulting plain object to the View Designer.

> **⚠️ Critical — Always wrap output parameter values in `of()`:**  
> `forkJoin()` expects every value in the `IPlainObject` to be an Observable. If you assign a raw value instead of wrapping it with `of()`, `forkJoin()` will silently fail to resolve the output and the downstream actions in the View Designer will not receive any value.
>
> ❌ **Wrong** — raw value assigned directly:
> ```typescript
> result['orderId'] = createdRecord.id;         // ❌ NOT an Observable — forkJoin will fail
> return forkJoin(result);
> ```
>
> ✅ **Correct** — value wrapped in `of()`:
> ```typescript
> result['orderId'] = of(createdRecord.id);     // ✅ Observable — forkJoin resolves correctly
> return forkJoin(result);
> ```
  
**Critical Note:**  
By default, the Innovation Studio schematic generates an implementation of type `never` for the output parameters of the `IViewActionService` interface, which means that there are no output parameters:
```typescript
export class DisplayMessageActionService implements IViewActionService<IDisplayMessageActionProperties, never> {
    // ...
    execute(inputParameters: IDisplayMessageActionProperties): Observable<never> {
}
```
If you want to have output parameters, you need to change this type to `any`, else you will have TypeScript errors when trying to return output parameters in the `execute()` method.    
You need to do this in the class declaration and the execute method signature, for example:
```typescript
export class DisplayMessageActionService implements IViewActionService<IDisplayMessageActionProperties, any> {
    // ...
    execute(inputParameters: IDisplayMessageActionProperties): Observable<any> {
}
```
  
For example, if you have an output parameter called `orderId`, you can create an object like this:
```typescript
import { Injectable } from '@angular/core';
import { IViewActionService, RxViewAction } from '@helix/platform/view/api';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IDisplayMessageActionProperties } from './display-message-action.types';
import { IPlainObject } from '@helix/platform/shared/api';

@Injectable()
@RxViewAction({
  name: 'comExampleSampleApplicationDisplayMessage'
})
export class DisplayMessageActionService implements IViewActionService<IDisplayMessageActionProperties, any> {
  constructor() {
  }

  // Implements the runtime behavior of the view action.
  execute(inputParameters: IDisplayMessageActionProperties): Observable<any> {
    const result: IPlainObject = {};
    
    // ⚠️ IMPORTANT: Each output parameter value MUST be wrapped with of() from rxjs.
    // forkJoin() expects Observables as values. Assigning a raw value (e.g. result['orderId'] = someString)
    // will cause forkJoin to silently fail and downstream actions will not receive the output value.
    result['orderId'] = of(inputParameters.message);

    return forkJoin(result);
  }
}
```


## View Action registration
### View Action registration module (`<view-action-name>-action.module.ts`)
The View Action is registered in the file `<view-action-name>-action.module.ts` as an Angular Module.  
This module imports the `RxViewActionRegistryService` from `@helix/platform/view/api` and registers the View Action using the `register()` method.  
Both the design-time models and runtime services are registered together in this module.

Here are the registration properties:
* Some are automatically set by the Schematic when generating the View Action skeleton:
  * `name`: A unique identifier for the View Action, usually in the format `<bundleId><applicationName><viewActionName>` in PascalCase.
    * For example if the bundleId is `com.example`, the application name is `sample-application` and the view action name is `display-message`, the name can be `comExampleSampleApplicationDisplayMessage`,
      * This property is very important and should not be modified,
  * `label`: the label of the View action, that will be displayed in View Designer,
* `service`: The runtime service that will be executed when the View Action is executed.
  * This should not be modified,
* `designManager`: The design-time component class that will be used in the View Designer for the input parameters validation.
  * * This should not be modified,
* `designModel`: The model class that defines the Input and Output parameters for the design-time View Action.
  * * This should not be modified,
* `parameters`: An array defining the input parameters of the View Action,
  * The Input parameters input typing, validation and more details are defined in the file `<view-action-name>-action-design-model.class.ts`,
  * The Output parameters are defined in the file `<view-action-name>-action-design-model.class.ts`,
  * Custom input variables, including their names and whether expression evaluation is enabled:
    * ```typescript
      {
          name: '<inputVariableName>',
          label: '<inputVariableLabel>',
          isRequired: true | false,
          enableExpressionEvaluation: true | false
       }
      ```
    * The property `enableExpressionEvaluation` specifies whether the input variable can be configured using expression evaluation in the View Designer,
      * If set to `true`, the expression stored in this input variable will automatically evaluated at runtime,
        * This can be useful for dynamic values that depend from other View Components for example, in this case the input variable value would be updated automatically when the other View Component value changes,
        * Most of the time, `true` is the recommended value for this property,
      * If set to `false`, the input variable can only be set to static values and will not be automatically evaluated,
    * The property `isRequired` specifies whether the input variable is required or not at design time in the View Designer,
      * If set to `true`, the View Designer will show a validation error if this input variable is not set when configuring the View Action instance in the View Designer,
      * If set to `false`, there will be no validation error if this input variable is not set when configuring the View Action instance in the View Designer,
    * The property `localizable` specifies whether the input variable supports localization,
      * If set to `true`, the input variable can have different values based on the user's locale,
      * If set to `false`, the input variable will have the same value for all locales,
        * Usually an input variable is not localizable,

Here is an example of a registration Module for a View Action where:
* The bundleId would be `com.example`,
* The application name would be `sample-application`,
* The View Action name would be `display-message`,
* One custom input variable called `customerName` is defined with expression evaluation enabled,
```typescript
import { NgModule } from '@angular/core';
import { RxViewActionRegistryService } from '@helix/platform/view/api';
import { DisplayMessageActionDesignManagerService } from './display-message-action-design-manager.service';
import { DisplayMessageActionDesignModel } from './display-message-action-design-model.class';
import { DisplayMessageActionService } from './display-message-action.service';

@NgModule({
  providers: [DisplayMessageActionService, DisplayMessageActionDesignManagerService]
})
export class DisplayMessageActionModule {
  constructor(
          rxViewActionRegistryService: RxViewActionRegistryService,
          displayMessageActionService: DisplayMessageActionService,
          displayMessageActionDesignManagerService: DisplayMessageActionDesignManagerService
  ) {
    rxViewActionRegistryService.register({
      name: 'comExampleSampleApplicationDisplayMessage',
      label: 'Display Message',
      // a service that will execute the view action at runtime
      service: displayMessageActionService,
      // the design manager service responsible for view action parameter validation at design time
      designManager: displayMessageActionDesignManagerService,
      // the design model class responsible for the design time behavior of the view action
      designModel: DisplayMessageActionDesignModel,
      // the list of view action input parameters
      parameters: [
        {
          name: 'customerName',
          label: 'Customer Name',
          isRequired: true,
          enableExpressionEvaluation: true
        }
      ]
    });
  }
}
```

### View Action registration in the main application module
The View Action is automatically registered in the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/<view-component-name>-registration.module.ts` by the Schematic, for example:
```typescript
import { <ViewAction>ActionModule } from './actions/<view-action-name>/<view-action-name>-action.module';
// ...
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    <ViewAction>ActionModule
  ]
})
```
Using the example above with the View Action module `DisplayMessageActionModule`:
```typescript
import { DisplayMessageActionModule } from './actions/display-message/display-message-action.module';
// ...
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DisplayMessageActionModule
  ]
})
```

## Adding new input / outputs for the View Action
It might be necessary to add new Input or Output parameters to the View Action to allow configuration in the View Designer or to output information to other actions, for example getting as input a price, the VAT, and then returning the total price as output.  
You might have to remove the out of the box input parameter `message`, and add new ones in the module, design time and runtime types, design time model and runtime code.  


## Default input parameter `message`
The Innovation Studio schematic will generate a default `message` input parameter for the View Action, this is just an example input parameter to show how to define an input parameter, it can be removed or modified as needed.  
Since it is marked as `required`, it might be necessary to remove this input parameter and its logic from the design-time and runtime if it is not needed, otherwise you will need to provide a value for this input parameter when configuring the View Action instance in the View Designer, otherwise you will get a validation error.  
Pay extra attention to remove the runtime logic, which, out of the box, is to show a modal with the message value, if you keep this logic and just change the input parameter type for example, you might get runtime errors if the logic is not compatible with the new input parameter type.  


# Step-by-Step Checklist for Creating a View Action
Here is a summary checklist of the steps to create a View Action from scratch, after the skeleton has been generated:

1. **Run the schematic** to generate the skeleton: `npx ng g rx-view-action "<view-action-name>"` from `/bundle/src/main/webapp/`,
2. **Remove the default `message` input parameter** from all files if it is not needed (design types, runtime types, design model, design manager, runtime service, module registration),
3. **Define input parameters** in the design types file (`<view-action-name>-action-design.types.ts`),
4. **Define input parameters** in the runtime types file (`<view-action-name>-action.types.ts`),
5. **Update the design model** (`<view-action-name>-action-design-model.class.ts`):
   - Set input parameter defaults in `getInitialProperties`,
   - Register input parameters with their form control components in `getActionEditorConfig`,
   - Define output parameters in `getActionOutputDataDictionary` (if any),
6. **Update the design manager** (`<view-action-name>-action-design-manager.service.ts`) with validation rules for each input parameter,
7. **Update the runtime service** (`<view-action-name>-action.service.ts`):
   - Implement the business logic in `execute()`,
   - If there are output parameters, change the generic type from `never` to `any` in both the class declaration and `execute()` method signature,
   - Return output parameters using `forkJoin()` with an `IPlainObject`,
   - **⚠️ Each output parameter value in the `IPlainObject` MUST be wrapped with `of()` from `rxjs`** (e.g. `result['myOutput'] = of(someValue)`). Assigning a raw value directly will cause `forkJoin()` to silently fail and downstream actions will not receive the output value,
8. **Update the module registration** (`<view-action-name>-action.module.ts`) with the list of input parameters (name, label, isRequired, enableExpressionEvaluation),
9. **Verify the registration** in the main application module (`<application-name>.module.ts`) — this is done automatically by the schematic,

> **Important notes:**
> - Output parameters are **NOT** declared in the module registration. They are only defined in the design model class via `getActionOutputDataDictionary()`.
> - The schematic automatically registers the module in the main application module, so you usually don't need to do that manually.

# Sample code
An example of a View Action is the `calculate-vat` component in the folder [calculate-vat](../Examples/ViewAction/calculate-vat/) (project path: `_instructions/UI/ObjectTypes/Examples/ViewAction/calculate-vat/`), it is a simple View Action that takes as inputs the `price` and `vat` and returns the full price in the `fullPrice` output.
