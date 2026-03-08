# Definition
Innovation Studio is a production from BMC Helix.  
A view is a combination of UI element that can interact with each other and that can display data from record definitions for example. It is used as a User Interface the End User can interact with. It can be a console displaying a list of orders, or a form allowing to create a new order, or anything else.  
The goal of this instruction is to explain how to create a new Innovation Studio view by using a template json file, and by filling the variable list explained below.


# Pre-Creation Checklist

Before creating a view definition, verify the following to prevent common errors:

- [ ] **View name is unique**
  - Check: List all `.def` files in `/package/src/main/definitions/db/view/`
  - Ensure your intended view name doesn't already exist
  - Command: `find /package/src/main/definitions/db/view/ -name "*.def" -exec grep -H "name.*:" {} \;`

- [ ] **View GUID will be unique**
  - Generate a new UUID/GUID (don't reuse existing ones)
  - Command to check: `find /package/src/main/definitions/db/view/ -name "*.def" -exec grep -H "<your-guid>" {} \;`
  - Should return no results

- [ ] **Component GUID will be unique**
  - Generate a separate UUID/GUID (different from view GUID)
  - Verify it's not used anywhere in the system

- [ ] **Component type exists and is correct**
  - Verify the component is registered in the bundle
  - Check: `/bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/<component-name>/<component-name>-registration.module.ts`
  - Note the `type` property value from `rxViewComponentRegistryService.register()`

- [ ] **Input parameters match component definition**
  - Verify parameter names in the component's registration module
  - Check the `properties` array in the registration
  - Ensure spelling and casing match exactly

- [ ] **Timestamp is current**
  - Use `Date.now()` or equivalent to get current milliseconds since epoch
  - Should be a reasonable value close to current time

- [ ] **File naming is correct**
  - Format: `<ViewName>.def` (use the view name without bundle ID prefix)
  - Location: `/package/src/main/definitions/db/view/`
  - Example: For view `com.example.sample-application:Message Display Demo`, filename is `Message Display Demo.def`


# Template files description
The templates files are json files that contains the definition of an Innovation Studio view and a view component, with some variables to fill in.  
The variables are explained in the variable list section below.  
Here are the different template files:
* `view.json`: can be used as a starting point to create a new Innovation Studio view, by filling in the variables with the appropriate values, and by modifying the view definition as needed, 
  * The template file can be found in the same folder as this instruction file, with the name `view.json`.
* `view-component.json`: template for one view component,
  * One view can have multiple view components,

## View properties (`view.json`)
Here are the important properties of the view definition:
* `name`: The fully qualified name of the view, in the format `<bundleId>:<view name>`,
* `guid`: The guid of the view, it should be a unique identifier,
* `layout`: The layout of the view, it defines the structure of the view and the components that are used in the view,
* `componentDefinitions`: The list of view components that are used in the view,
  * Its content will be described in the next chapter,

For example:
```json
{
  "version": null,
  "lastUpdateTime": "<timestamp>",
  "lastChangedBy": "Demo",
  "owner": "Demo",
  "name": "<viewFullyQualifiedName>",
  "tags": null,
  "description": null,
  "overlayGroupId": "1",
  "scope": "BUNDLE",
  "internal": false,
  "guid": "<viewGuid>",
  "layout": "{\"outlets\":[{\"name\":\"DEFAULT\",\"columns\":[{\"children\":[\"<viewComponentGuid>\"]}]}]}",
  "inputParams": [],
  "outputParams": [],
  "componentDefinitions": [<viewComponentDefinition>],
  "permissions": [
    {
      "ownerId": {
        "value": 0,
        "type": "GROUP",
        "name": "Public"
      },
      "type": "VISIBLE"
    }
  ],
  "localizableStringsByComponentId": {},
  "overlayDescriptor": {
    "parentOverlayGroupId": null
  },
  "allowOverlay": false,
  "type": "REGULAR",
  "styles": null,
  "targetViewDefinitionName": null,
  "targetExtensionContainerGuid": null
}
```

## View components (`view-component.json`)
A view component is a reusable UI element that can be used in different views. The goal here is to add a view component to the view, and to set its properties. The view component is defined in the `componentDefinitions` array of the view definition, and it has the following important properties:
* `name`: The guid of the view component, it should be a unique identifier,
* `type`: The selector of the runtime view component,

For example:
```json
{
      "resourceType": "com.bmc.arsys.rx.services.view.domain.ViewComponentDefinition",
      "lastUpdateTime": "<timestamp>",
      "lastChangedBy": "Demo",
      "owner": "Demo",
      "name": "<viewComponentGuid>",
      "tags": null,
      "description": null,
      "overlayGroupId": "1",
      "internal": false,
      "guid": "<viewComponentGuid>",
      "type": "<viewComponentSelector>",
      "propertiesByName": {
        "availableOnDevices": "[\"desktop\",\"tablet\",\"mobile\"]",
        "styles": null,
        "message": "\"BMC Helix\"",
        "hidden": "0"
      },
      "permissions": [
        {
          "ownerId": {
            "value": 0,
            "type": "GROUP",
            "name": "Public"
          },
          "type": "VISIBLE"
        }
      ]
}
```

## Building a full view definition
To build a full view definition, you can start from the `view.json` template file, and fill in the variables with the appropriate values. Then, you can add a view component definition to the `componentDefinitions` array of the view definition, by using the `view-component.json` template file, and by filling in the variables with the appropriate values. You can add as many view components as needed to the view definition, by adding multiple view component definitions to the `componentDefinitions` array.  


# Variable list to create a new Innovation Studio View from this template
## View Template file (`view.json`)
You can read a template of an Innovation Studio view instruction file here: [Template File](./view.json),

### Variable list
* <timestamp>: when the view is created, it should be the current timestamp as milliseconds since Unix epoch (January 1, 1970, 00:00:00 UTC),
  * **Format**: A number like `1771460504496` (not an ISO date string)
  * **How to generate**: 
    * JavaScript/TypeScript: `Date.now()`
    * Command line (macOS/Linux): `date +%s%3N`
    * Command line (Windows PowerShell): `[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()`
  * **Example**: `1771460504496` represents 2026-02-19T00:21:44.496Z
* <viewFullyQualifiedName>: The fully qualified name of the view that you will create, in the format `<bundleId>:<view name>`,
  * **Critical** :
    * The view name should be unique across all views in the system, otherwise the view creation will fail. You can check if the view name already exists by listing all views in the folder `/package/src/main/definitions/db/view/`,
    * You can check the instruction file [GettingViewDefinition.md](../Services/GettingViewDefinition.md) for more information.
* <viewGuid>: The guid of the view, it should be a unique identifier, it should have this format `008904ea-fb8e-41a1-84ce-1b64f8e7a754`,
  * **How to generate**: You can use any UUID v4 generator:
    * TypeScript: `crypto.randomUUID()`
    * Command line (macOS/Linux): `uuidgen | tr '[:upper:]' '[:lower:]'`
    * Command line (Windows PowerShell): `[guid]::NewGuid().ToString().ToLower()`
    * Online: https://www.uuidgenerator.net/
  * **Critical** :
    * The view guid should be unique across all views in the system, otherwise the view creation will fail. You can check if a view guid already exists by checking view guids listing all views in the folder `/package/src/main/definitions/db/view/`,
    * You can check the instruction file [GettingViewDefinition.md](../Services/GettingViewDefinition.md) for more information.
* <viewComponentDefinition>: View component definition, it is defined in the `componentDefinitions` array of the view definition, check the chapter `View Component Template file` below for more information on how to create a view component definition, and on the variables to fill in the view component template file `view-component.json`.
* <viewComponentGuid>: The guid of the view component that you will add to the view, check the chapter `View Component Template file` below for more information,

## View Component Template file (`view-component.json`)
You can read a template of an Innovation Studio view instruction file here: [Template File](./view-component.json),

### Variable list
* <timestamp>: when the view component is created, it should be the same value as set for the view above,
* <viewComponentGuid>: The guid of the view component, it should be a unique identifier, it should have this format `008904ea-fb8e-41a1-84ce-1b64f8e7a754`,
  * **How to generate**: Use the same method as for view GUID (see above)
    * TypeScript: `crypto.randomUUID()`
    * Command line (macOS/Linux): `uuidgen | tr '[:upper:]' '[:lower:]'`
    * Command line (Windows PowerShell): `[guid]::NewGuid().ToString().ToLower()`
  * **Critical** :
    * The view component guid should be unique across all view components in the system, otherwise the view creation will fail. You can check if a view component guid already exists by checking view component guids listing all views in the folder `/package/src/main/definitions/db/view/`,
    * The view component GUID must be different from the view GUID
    * You can check the instruction file [GettingViewDefinition.md](../Services/GettingViewDefinition.md) for more information.
* <viewComponentSelector>: The selector of the runtime view component, it is defined in the view component `<view-component-name>/<view-component-name>-registration.module.ts` file, in the `type` property of the `rxViewComponentRegistryService.register()` parameter,
  * The view components are stored in the folder `/bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/`, and each view component has its own folder, for example `/bundle/src/main/webapp/libs/<application-name>/src/lib/view-components/pizza-ordering/` for the pizza ordering view component,
  * In the following example, the selector would be `com-example-sample-application-pizza-ordering`:
    * ```typescript
      import { NgModule } from '@angular/core';
      import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
      import { PizzaOrderingDesignComponent } from './design/pizza-ordering-design.component';
      import { PizzaOrderingDesignModel } from './design/pizza-ordering-design.model';
      import { PizzaOrderingComponent } from './runtime/pizza-ordering.component';
  
      @NgModule()
      export class PizzaOrderingRegistrationModule {
        constructor(rxViewComponentRegistryService: RxViewComponentRegistryService) {
          rxViewComponentRegistryService.register({
            type: 'com-example-sample-application-pizza-ordering',
            name: 'Pizza Ordering',
            group: 'SampleApplication',
            icon: 'wall',
            component: PizzaOrderingComponent,
            designComponent: PizzaOrderingDesignComponent,
            designComponentModel: PizzaOrderingDesignModel,
            properties: [
              {
                name: 'customerName',
                localizable: true,
                enableExpressionEvaluation: true
              },
              ...RX_STANDARD_PROPS_DESC
            ]
          });
        }
      }
      ```

### View component input parameters
A View Component can have input parameters, which are defined in the `properties` array of the `rxViewComponentRegistryService.register()` parameter.  
In this example:
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
            type: 'com-example-sample-application-pizza-ordering',
            name: 'Pizza Ordering',
            group: 'SampleApplication',
            icon: 'wall',
            component: PizzaOrderingComponent,
            designComponent: PizzaOrderingDesignComponent,
            designComponentModel: PizzaOrderingDesignModel,
            properties: [
              {
                name: 'customerName',
                localizable: true,
                enableExpressionEvaluation: true
              },
              ...RX_STANDARD_PROPS_DESC
            ]
          });
        }
      }
```
The View component input parameter would be `customerName`.
  

### Input Parameter Value Formatting

Input parameter values must be **JSON-escaped strings** in the view definition. This is because the properties are stored as JSON strings within the view definition.

**Formatting Rules:**

| Value Type     | Example Value                     | Format in propertiesByName          | Explanation                                                          |
|----------------|-----------------------------------|-------------------------------------|----------------------------------------------------------------------|
| String literal | `Hello World`                     | `"\"Hello World\""`                 | Outer quotes = property value, inner escaped quotes = string literal |
| Number         | `42`                              | `"42"`                              | Numbers as string (no inner quotes)                                  |
| Boolean        | `true`                            | `"true"`                            | Booleans as string (no inner quotes)                                 |
| Expression     | `${view.components.input1.value}` | `"${view.components.input1.value}"` | Expressions as-is                                                    |
| Null           | `null`                            | `null`                              | null                                                                 |
| Array          | `["desktop", "tablet"]`           | `"[\"desktop\",\"tablet\"]"`        | Escaped JSON array                                                   |
| Object         | `{"key": "value"}`                | `"{\"key\":\"value\"}"`             | Escaped JSON object                                                  |

**Why the extra quotes?**
- The outer quotes (`"`) indicate it's a string property value in JSON
- The inner escaped quotes (`\"`) are part of the actual value that will be evaluated

**Examples:**
In the view component template json file, you can set the value of the input parameter in the `propertiesByName` object of the view definition, as key / value pairs, where the key is the name of the input parameter, and the value is the value of the input parameter:
* <viewComponentInputParameter>: the view component input parameter name,
* <ViewComponentInputParameterValue>: the value of the view component input parameter,
```json
"propertiesByName": {
  "availableOnDevices": "[\"desktop\",\"tablet\",\"mobile\"]",
  "styles": null,
  "<viewComponentInputParameter>": "<ViewComponentInputParameterValue>",
  "hidden": "0"
},
```

For example, if you want to set the value of the `customerName` input parameter to `John Doe`, you would add the following key / value pair to the `propertiesByName` object of the view component definition in the view definition json file:
```json
"propertiesByName": {
  "availableOnDevices": "[\"desktop\",\"tablet\",\"mobile\"]",
  "styles": null,
  "customerName": "\"John Doe\"",
  "hidden": "0"
},
```

If the View component has multiple input parameters, you can set the value of each input parameter in the same way, by adding a key / value pair to the `propertiesByName` object of the view component definition in the view definition json file, where the key is the name of the input parameter, and the value is the value of the input parameter.


# Saving the view definition file
Once you have filled in the variables in the view definition template file, and in the view component definition template file, you can save the view definition file in the folder `/package/src/main/definitions/db/view/` of your bundle, with the name `<view name>.def`, where `<view name>` is the name of the view that you have set in the variable `<viewFullyQualifiedName>` above, without the bundle id, for example `Pizza Ordering View.def` for a view with the name `Pizza Ordering View` and a fully qualified view name `com.example.sample-application:Pizza Ordering View`.  
The content of the .def file is not exactly a json file, it is a text file with these properties:
```text
begin view definition
   name           : <viewFullyQualifiedName>
<viewDefinitionContent>
end
```
How to build <viewDefinitionContent>:
It is the content of the view definition json file that you have created by filling in the variables in the template files, and by adding the view component definition to the `componentDefinitions` array of the view definition, however, each line begins by the suffix:
`   definition     : `
For example this json:
```json
{
  "version" : null,
  "lastUpdateTime" : 1771460504496,
  "lastChangedBy" : "Demo",
  "owner" : "Demo",
  "name" : "com.example.sample-application:Order pizza",
  "tags" : null,
  "description" : null,
  "overlayGroupId" : "1",
  "scope" : "BUNDLE",
  "internal" : false,
  "guid" : "008904ea-fb8e-41a1-84ce-1b64f8e7a754",
  "layout" : "{\"outlets\":[{\"name\":\"DEFAULT\",\"columns\":[{\"children\":[\"6d6d5603-7caf-462d-a092-89f300251d1c\"]}]}]}",
  "inputParams" : [ ],
  "outputParams" : [ ],
  "componentDefinitions" : [ {
    "resourceType" : "com.bmc.arsys.rx.services.view.domain.ViewComponentDefinition",
    "lastUpdateTime" : 1771460504496,
    "lastChangedBy" : "Demo",
    "owner" : "Demo",
    "name" : "6d6d5603-7caf-462d-a092-89f300251d1c",
    "tags" : null,
    "description" : null,
    "overlayGroupId" : "1",
    "internal" : false,
    "guid" : "6d6d5603-7caf-462d-a092-89f300251d1c",
    "type" : "com-example-sample-application-ordering-pizza",
    "propertiesByName" : {
      "availableOnDevices" : "[\"desktop\",\"tablet\",\"mobile\"]",
      "styles" : null,
      "customerName" : "\"John Doe\"",
      "hidden" : "0"
    },
    "permissions" : [ {
      "ownerId" : {
        "value" : 0,
        "type" : "GROUP",
        "name" : "Public"
      },
      "type" : "VISIBLE"
    } ]
  } ],
  "permissions" : [ {
    "ownerId" : {
      "value" : 0,
      "type" : "GROUP",
      "name" : "Public"
    },
    "type" : "VISIBLE"
  } ],
  "localizableStringsByComponentId" : null,
  "overlayDescriptor" : {
    "parentOverlayGroupId" : null
  },
  "allowOverlay" : false,
  "type" : "REGULAR",
  "styles" : null,
  "targetViewDefinitionName" : null,
  "targetExtensionContainerGuid" : null
}
```

Would actually look like this in the .def file:
```text
   definition     : {
   definition     :   "version" : null,
   definition     :   "lastUpdateTime" : 1771460504496,
   definition     :   "lastChangedBy" : "Demo",
   definition     :   "owner" : "Demo",
   definition     :   "name" : "com.example.sample-application:Order Pizza",
   definition     :   "tags" : null,
   definition     :   "description" : null,
   definition     :   "overlayGroupId" : "1",
   definition     :   "scope" : "BUNDLE",
   definition     :   "internal" : false,
   definition     :   "guid" : "008904ea-fb8e-41a1-84ce-1b64f8e7a754",
   definition     :   "layout" : "{\"outlets\":[{\"name\":\"DEFAULT\",\"columns\":[{\"children\":[\"6d6d5603-7caf-462d-a092-89f300251d1c\"]}]}]}",
   definition     :   "inputParams" : [ ],
   definition     :   "outputParams" : [ ],
   definition     :   "componentDefinitions" : [ {
   definition     :     "resourceType" : "com.bmc.arsys.rx.services.view.domain.ViewComponentDefinition",
   definition     :     "lastUpdateTime" : 1771460504496,
   definition     :     "lastChangedBy" : "Demo",
   definition     :     "owner" : "Demo",
   definition     :     "name" : "6d6d5603-7caf-462d-a092-89f300251d1c",
   definition     :     "tags" : null,
   definition     :     "description" : null,
   definition     :     "overlayGroupId" : "1",
   definition     :     "internal" : false,
   definition     :     "guid" : "6d6d5603-7caf-462d-a092-89f300251d1c",
   definition     :     "type" : "com-example-sample-application-ordering-pizza",
   definition     :     "propertiesByName" : {
   definition     :       "availableOnDevices" : "[\"desktop\",\"tablet\",\"mobile\"]",
   definition     :       "styles" : null,
   definition     :       "customerName" : "\"John Doe\"",
   definition     :       "hidden" : "0"
   definition     :     },
   definition     :     "permissions" : [ {
   definition     :       "ownerId" : {
   definition     :         "value" : 0,
   definition     :         "type" : "GROUP",
   definition     :         "name" : "Public"
   definition     :       },
   definition     :       "type" : "VISIBLE"
   definition     :     } ]
   definition     :   } ],
   definition     :   "permissions" : [ {
   definition     :     "ownerId" : {
   definition     :       "value" : 0,
   definition     :       "type" : "GROUP",
   definition     :       "name" : "Public"
   definition     :     },
   definition     :     "type" : "VISIBLE"
   definition     :   } ],
   definition     :   "localizableStringsByComponentId" : null,
   definition     :   "overlayDescriptor" : {
   definition     :     "parentOverlayGroupId" : null
   definition     :   },
   definition     :   "allowOverlay" : false,
   definition     :   "type" : "REGULAR",
   definition     :   "styles" : null,
   definition     :   "targetViewDefinitionName" : null,
   definition     :   "targetExtensionContainerGuid" : null
   definition     : }
```

The full definition file would then be:
```text
begin view definition
   name           : com.example.sample-application:Poem
   definition     : {
   definition     :   "version" : null,
   definition     :   "lastUpdateTime" : 1771460504496,
   definition     :   "lastChangedBy" : "Demo",
   definition     :   "owner" : "Demo",
   definition     :   "name" : "com.example.sample-application:Poem",
   definition     :   "tags" : null,
   definition     :   "description" : null,
   definition     :   "overlayGroupId" : "1",
   definition     :   "scope" : "BUNDLE",
   definition     :   "internal" : false,
   definition     :   "guid" : "008904ea-fb8e-41a1-84ce-1b64f8e7a754",
   definition     :   "layout" : "{\"outlets\":[{\"name\":\"DEFAULT\",\"columns\":[{\"children\":[\"6d6d5603-7caf-462d-a092-89f300251d1c\"]}]}]}",
   definition     :   "inputParams" : [ ],
   definition     :   "outputParams" : [ ],
   definition     :   "componentDefinitions" : [ {
   definition     :     "resourceType" : "com.bmc.arsys.rx.services.view.domain.ViewComponentDefinition",
   definition     :     "lastUpdateTime" : 1771460504496,
   definition     :     "lastChangedBy" : "Demo",
   definition     :     "owner" : "Demo",
   definition     :     "name" : "6d6d5603-7caf-462d-a092-89f300251d1c",
   definition     :     "tags" : null,
   definition     :     "description" : null,
   definition     :     "overlayGroupId" : "1",
   definition     :     "internal" : false,
   definition     :     "guid" : "6d6d5603-7caf-462d-a092-89f300251d1c",
   definition     :     "type" : "com-example-sample-application-love-message-display",
   definition     :     "propertiesByName" : {
   definition     :       "availableOnDevices" : "[\"desktop\",\"tablet\",\"mobile\"]",
   definition     :       "styles" : null,
   definition     :       "customerName" : "\"John Doe\"",
   definition     :       "hidden" : "0"
   definition     :     },
   definition     :     "permissions" : [ {
   definition     :       "ownerId" : {
   definition     :         "value" : 0,
   definition     :         "type" : "GROUP",
   definition     :         "name" : "Public"
   definition     :       },
   definition     :       "type" : "VISIBLE"
   definition     :     } ]
   definition     :   } ],
   definition     :   "permissions" : [ {
   definition     :     "ownerId" : {
   definition     :       "value" : 0,
   definition     :       "type" : "GROUP",
   definition     :       "name" : "Public"
   definition     :     },
   definition     :     "type" : "VISIBLE"
   definition     :   } ],
   definition     :   "localizableStringsByComponentId" : null,
   definition     :   "overlayDescriptor" : {
   definition     :     "parentOverlayGroupId" : null
   definition     :   },
   definition     :   "allowOverlay" : false,
   definition     :   "type" : "REGULAR",
   definition     :   "styles" : null,
   definition     :   "targetViewDefinitionName" : null,
   definition     :   "targetExtensionContainerGuid" : null
   definition     : }
end
```
