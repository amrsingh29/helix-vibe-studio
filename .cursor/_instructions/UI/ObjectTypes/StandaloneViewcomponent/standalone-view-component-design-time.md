# Design time component
The design-time component is implemented in the folder `design/`.
```
<view-component-name>/
├── design/
│   ├── <view-component-name>-design.component.html
│   ├── <view-component-name>-design.component.scss
│   ├── <view-component-name>-design.component.ts
│   ├── <view-component-name>-design.model.ts
│   └── <view-component-name>-design.types.ts
```

## Angular Component (`<view-component-name>-design.component.html`, `<view-component-name>-design.component.scss`, `<view-component-name>-design.component.ts`)
The Design-time component is a regular Angular component that implements the design-time experience of the View Component in the View Designer, it is usually a very simple component as it only needs to provide a preview of the component in the View Designer canvas:
* `<view-component-name>-design.component.html`:
    * The HTML template for the design-time component,
    * It is usually just an icon or a simple text representing the View Component, here an example using an Adapt icon `widget`,
    * ```html
       <p>Customer Name will be displayed here.</p>
      ```
* `<view-component-name>-design.component.scss`: The SCSS styles for the design-time component, usually just for the icon or text styling,
    * ```scss
      p {
          background-color: var(--color-background);
          padding: 10px;
        }
      ```
* `<view-component-name>-design.component.ts`: The TypeScript file for the design-time component, it is a very simple Standalone Angular component. It is rarely necessary to add any logic here, as the design-time component is mainly for preview purposes in the View Designer. It imports the model that will be defined later. Here is an example:
    * ```typescript
      import { Component, Input } from '@angular/core';
      import { <ViewComponentName>DesignModel } from './resize-rtf-field-design.model';
  
      @Component({
        standalone: true,
        selector: '<bundle-id-kebab>-<application-name>-<view-component-name>-design',
        styleUrls: ['./<view-component-name>-design.component.scss'],
        templateUrl: './<view-component-name>-design.component.html'
      })
      export class <ViewComponentName>DesignComponent {
        @Input()
        model: <ViewComponentName>DesignModel;
      }
      ```

# Design Model (`<view-component-name>-design.model.ts`, `<view-component-name>-design.types.ts`)
The design model defines the Input and Output parameters of the View Component that will be available in the View Designer for configuration.

It is implemented in the files `<view-component-name>-design.model.ts` and `<view-component-name>-design.types.ts`.

## Type definitions (`<view-component-name>-design.types.ts`) and (`../<view-component-name>.types.ts`)
The `<view-component-name>-design.types.ts` file contains the type definitions for the View Component inputs (name and type) used in the design model.
* The name property is always present, it is used to identify the View Component instance in the View Designer Data Dictionary,
* The default properties are defined in the interface `IRxStandardProps` from `@helix/platform/view/api`, it includes properties like `visible`, `enabled`, `cssClass`, etc...,
  Here is an example of a design types file with two input parameters, `name` and `customerName`, both of type `string`:
```typescript
import { IRxStandardProps } from '@helix/platform/view/api';

export interface I<ViewComponentName>DesignProperties extends IRxStandardProps {
  name: string;
  customerName: string;
}
```
  
The `../<view-component-name>.types.ts` file contains the type definitions for the View Component inputs (name and type) used both in the design model and at runtime.
* The construction applies the same rules as `<view-component-name>-design.types.ts`,
```typescript
import { IRxStandardProps } from '@helix/platform/view/api';

export interface I<ViewComponentName>Properties extends IRxStandardProps {
  name: string;
  customerName: string;
}
```

_Note:_  
Both files contents are nearly the same, only the Interface name is different, the first one is used for design-time and the second one is used for both design-time and runtime.

**Important note:**  
Do not modify the imported interface `IRxStandardProps` as it comes from the Innovation Studio SDK and it defines the standard properties available for all view components, such as `visible`, `enabled`, `cssClass`, etc...


## Model (`<view-component-name>-design.model.ts`)
This file contains the model class that defines:
* The Input parameters with their types and validation rules,
* The Output parameters with their types,
* The validation rules for the Input parameters during design-time configuration in the View Designer (if a parameter is required, min/max length, regex pattern, etc...),

_Note:_  
The Inputs and Outputs will be available in the View Designer when configuring the View Component instance, in the Data Dictionary.  
The Inputs properties will be available for the `SetProperty` View Action if they are defined as settable in the model.

The model constructor contains multiple sections, registering:
* The input parameters,
* The settable input parameters,
* The output parameters,
* The input parameters validation logic,

## Input parameters default values
The default value of the input parameters are defined in the pre-created `initialComponentProperties` variable, which is typed with the type `I<ViewComponentName>Properties` from `<view-component-name>.types.ts`.
If you add or remove inputs for the view component, do not forget to update this variable.  
For example:
```typescript
import { IPizzaOrderingProperties } from '../pizza-ordering.types';
// ..
const initialComponentProperties: IPizzaOrderingProperties = {
  name: '',
  customerName: ''
};
```

## Input parameters registration
```typescript
sandbox.updateInspectorConfig(this.setInspectorConfig(initialComponentProperties));
```

The method in itself lists the different input parameters with their types and default values, for example here the input parameters `name` and `customerName` are registered with their types (name is an Out Of The Box property):
```typescript
import { IPizzaOrderingProperties } from '../pizza-ordering.types';
import { TextFormControlComponent, ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
// ..
const initialComponentProperties: IPizzaOrderingProperties = {
  name: '',
  customerName: ''
};
// ..
private setInspectorConfig(model: IPizzaOrderingProperties) {
  return {
    inspectorSectionConfigs: [
      {
        label: 'General',
        controls: [
          {
            name: 'name',
            component: TextFormControlComponent,
            options: {
              label: 'Name',
              tooltip: new Tooltip('Enter a name to uniquely identify this view component.')
            }
          },
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
          },
          // Add standard properties available for most view components, such as
          // Hidden, Available on devices, CSS classes.
          ...getStandardPropsInspectorConfigs()
        ]
      }
    ]
  };
}
```   

## Input parameters definition
The structure of each input parameter configuration is as follows:
* `name`: The name of the input parameter, it should match the property name defined in the design types file (`<view-component-name>-design.types.ts`) and in the runtime types file (`../<view-component-name>.types.ts`),
* `component`: The form control component used to configure this input parameter in the View Designer,
    * The component is provided by the Innovation Studio SDK, you can check the available components in the package `@helix/platform/shared/components`, and also listed in the next chapter `Component types and cast selection`,
* `options`: The options for the form control component, it can include:
    * `label`: The label shown in the View Designer for this input parameter,
    * `tooltip`: The tooltip shown in the View Designer for this input parameter,
    * `dataDictionary$`: An observable of the data dictionary, used for expression evaluation,
        * It is nearly always the default value `this.expressionConfigurator.getDataDictionary(),`, it is extremely rare to build a custom data dictionary for a specific input parameter,
    * `operators`: The operators available for expression evaluation,
        * It is nearly always the default value `this.expressionConfigurator.getOperators(),`, it is extremely rare to build custom operators for a specific input parameter,
    * `isRequired`: Whether this input parameter is required or not at design time (this will need also to be reflected in the validation rules section of the model constructor),
    * This configuration is then cast.

In the following example, a custom input parameter called `customerName` is defined with expression evaluation enabled, it is marked as required and has a tooltip explaining its purpose. The component is `ExpressionFormControlComponent` from `@helix/platform/shared/components`, and the configuration object is cast as `IExpressionFormControlOptions` from `@helix/platform/shared/components`:
```typescript
import { ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
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

## Component types and cast selection
Here are the different combinations of component and cast, depending on the type of the input parameter.  
If the input parameter is an expression that will be evaluated at runtime, you will need to use:
* component: `ExpressionFormControlComponent` from `@helix/platform/shared/components`,
* cast: the options object should be cast as `IExpressionFormControlOptions` from `@helix/platform/shared/components`,
    * Example:
        * ```typescript
          import { ExpressionFormControlComponent, IExpressionFormControlOptions } from '@helix/platform/shared/components';
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

## Input parameters current values
The current value of the input parameters are the ones saved in a previous configuration.
They are in the return statement of the method `getInitialProperties` in the design model, which is typed with the type `I<ViewComponentName>Properties` from `<view-component-name>.types.ts`.  It returns the initial properties of the View Component instance, which override default values. The returned type is `I<ViewComponentName>DesignProperties` from `<view-component-name>-design.types.ts`.  
You also need to set the default values of the input parameters here.  
`RX_STANDARD_PROPS_DEFAULT_VALUES` defines the default values for the standard properties available for all view components, such as `visible`, `enabled`, `cssClass`, etc... It is recommended to spread it in the return statement to include these default values.  
For example:
```typescript
import { IPizzaOrderingProperties } from '../pizza-ordering.types';
import { IPizzaOrderingDesignProperties } from './pizza-ordering-design.types';
import { RX_STANDARD_PROPS_DEFAULT_VALUES } from '@helix/platform/view/api';
// ...
// This method is called when a new, or an existing view component is initialized in the view designer.
// It returns values for all properties of the view component.
static getInitialProperties(currentProperties?: IPizzaOrderingProperties): IPizzaOrderingDesignProperties {
  return {
    // initial values for custom properties
    name: '',
    customerName: '',
    // initial values for the standard properties available for all view components
    ...RX_STANDARD_PROPS_DEFAULT_VALUES,
    // property values of an existing view component that are already saved in the view
    ...currentProperties
  };
}
```
If you add or remove inputs for the view component, do not forget to update this method.


#### Input parameters validation
The validation rules for the input parameters are defined in the method `validate` in the design model.  
It takes as input the values of the input parameters via the `model` parameter, which is typed with the type `I<ViewComponentName>DesignProperties` from `<view-component-name>-design.types.ts`. This object will contain the current values of the input parameters.  
It returns an array of `IViewComponentDesignValidationIssue` from `@helix/platform/view/designer`.    
You can create validation issues using:
* For an error: The `sandbox.createError` method, which takes as parameters the error message and the name of the input parameter that has the error,
* For a warning: The `sandbox.createWarning` method, which takes as parameters the warning message and the name of the input parameter that has the warning,
  An error will prevent the Innovation Studio view being saved with the current configuration, while a warning will just show a warning message but will not prevent saving.
  For example:
```typescript
import { IPizzaOrderingDesignProperties } from './pizza-ordering-design.types';
import { IViewComponentDesignSandbox, IViewComponentDesignValidationIssue } from '@helix/platform/view/designer';
// ...
private validate(
        sandbox: IViewComponentDesignSandbox<IPizzaOrderingDesignProperties>,
        model: IPizzaOrderingDesignProperties
): IViewComponentDesignValidationIssue[] {
  const validationIssues: IViewComponentDesignValidationIssue[] = [];

  if (!model.customerName) {
    validationIssues.push(sandbox.createError('Message cannot be blank.', 'message'));
  }

  // Validate standard properties.
  validationIssues.push(...validateStandardProps(model));

  return validationIssues;
}
```
**Important note:**  
Do not remove the Out Of the box validation:
```typescript
  // Validate standard properties.
  validationIssues.push(...validateStandardProps(model));
```


## Settable properties
An input parameter can be settable, which means that it will be available as a target property in the `SetProperty` View Action in the View Designer.  
This is not required for all input parameters, it should be set only for the input parameters that you want to be configurable via the `SetProperty` action in the View Designer.  
The list of settable properties is defined in the method `getSettablePropertiesDataDictionaryBranch` in the design model, it returns an object `IViewComponentDesignSettablePropertiesDataDictionary` from `@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces`.  
To define a settable property, you need to provide this object with the properties:
* `label`: The label of the property shown in the View Designer when configuring the `SetProperty` action,
* `expression`: The expression that will be evaluated to get the value of this property at runtime, it needs to be the `inputParameterName`,
* For example:
```typescript
{
  label: 'Customer Name',
  expression: this.getExpressionForProperty('customerName')
}
```

For example:
```typescript
import {
  IViewComponentDesignSettablePropertiesDataDictionary
} from '@helix/platform/view/designer/public-interfaces/view-component-design-settable-properties-data-dictionary.interfaces';
// ...
private getSettablePropertiesDataDictionaryBranch(): IViewComponentDesignSettablePropertiesDataDictionary {
  return [
    {
      label: 'Hidden',
      expression: this.getExpressionForProperty('hidden')
    },
    {
      label: 'Customer Name',
      expression: this.getExpressionForProperty('customerName')
    }
  ];
}
```

## Output parameters definition
A View Component can have output parameters that emit events to other components in the View Designer.  
The output parameters are defined in the design model as well, they are defined in the method `prepareDataDictionary` which returns an object `IViewComponentDesignCommonDataDictionaryBranch` from `@helix/platform/view/designer`.  
To define an output parameter, you need to provide this object with the properties:
* `label`: The label of the property shown in the View Designer as output of the view component,
* `expression`: The expression that will be evaluated to get the value of this property at runtime, it needs to be the `outputParameterName`,
* For example:
```typescript
{
  label: 'Customer Name',
  expression: this.getExpressionForProperty('customerName')
}
```
For example:
```typescript
import { getStandardPropsInspectorConfigs } from '@helix/platform/view/designer';
// ..
private prepareDataDictionary(componentName: string): IViewComponentDesignCommonDataDictionaryBranch {
  return {
    label: componentName,
    children: [
      {
        label: 'Customer Name',
        expression: this.getExpressionForProperty('customerName')
      }
    ]
  };
}
```
