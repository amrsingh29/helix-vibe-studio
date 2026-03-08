# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to extend the capabilities of UI elements using Typescript code, leveraging Angular 18.x and TypeScript 5.5.4, here are the different possible extensions.

# How to Use This Documentation

**If you are an AI Agent**, follow this approach:

1. **READ THIS FILE COMPLETELY** before taking any action
   - Understand all available UI object types (View Components, View Actions, Services)
   - Learn about the code structure and organization
   - Identify what services and UI components are available

2. **ASSESS THE REQUIREMENT** and decide which object type to create:
   - Need a reusable UI element? → [Standalone View Component](#standalone-view-components)
   - Need a custom field in a record editor? → [Record Editor Field View Component](#record-editor-field-view-components)
   - Need to perform an action on user interaction? → [View Actions](#view-actions)
   - Need shared business logic? → [Angular Services](#angular-services)
   - Need to create a new Innovation Studio view? [Create View Definition](./Template/create-view-definition.md)

3. **CHECK PRE-REQUISITES** by reading [pre-requisites.md](./pre-requisites.md):
   - Verify Node.js version (20.15.1)
   - Verify Yarn version (1.22.22)
   - Verify Java version (17.0.x)
   - Check environment variables (RX_SDK_HOME, JAVA_HOME)

4. **PLAN YOUR IMPLEMENTATION**:
   - What object(s) will you create?
   - What services will you use? (Check [Services](./Services/services-list.md))
   - What Adapt UI components will you use? (Check [Adapt Components](./AdaptComponents/adapt-components.md))
   - What third-party libraries (if any) are needed?

5. **READ THE SPECIFIC DOCUMENTATION** for your object type:
   - Go to the `ObjectTypes/` folder and read the detailed instructions
   - Go to the `Services/` folder for service usage details
   - Go to the `AdaptComponents/` folder for UI component details
   - Follow the [Best Practices](./ui-best-practices.md)

6. **IMPLEMENT** following the documentation precisely:
   - Use exact import statements from the documentation
   - Follow the file structure specified
   - Run the generation commands as documented
   - Test your implementation

**Remember**: Do NOT assume how things work. Always reference the documentation for imports, service usage, and code patterns.


# Important Concepts

## Application Name
An **application name** is the name of the application.  
This **application name** is used to define the path where the Angular code is located:
```
/bundle/src/main/webapp/libs/<application-name>/
```
You can find the application name in `/bundle/src/main/webapp/angular.json` under the `projects` property. The application name is the key of the project. It is also in this object `prefix` property.
**Example from `/bundle/src/main/webapp/angular.json`:**
```json
"projects": {
    "com-example-sample-application": {
        "projectType": "library",
        "root": "./libs/com-example-sample-application",
        "sourceRoot": "./libs/com-example-sample-application/src",
        "prefix": "com-example-sample-application",
        "architect": {}
    }
}
```
**Resulting application name:** `com-example-sample-application`.

The Application Name is used throughout your code to:
* Build the path where the UI code will be stored (format: `/bundle/src/main/webapp/libs/<application-name>`)
  * In this example `/bundle/src/main/webapp/libs/com-example-sample-application/`,

## Code structure
Here is the code structure of an Innovation Studio maven project, with comment on the important folders and files:
```
<Project main folder>/
├── pom.xml
└── bundle/
    ├── pom.xml
    └── src/
        └── main/
            ├── resources/
            │   └── localized-strings.properties
            └── webapp/
                ├── angular.json  # Main project angular.json, belongs to BMC Helix, should not be modified.
                ├── package.json  # Main project package.json, belongs to BMC Helix, should not be modified.
                └── libs/
                    └── <application-name>/
                        ├── package.json  # package.json from the coded components, this one can be modified to declare necessary third-party NPM packages.
                        └── src/
                            └── lib/
                                ├── <application-name>.module.ts  # Main module file, View components and View Actions should be registered here.
                                ├── actions/  # Folder where View Actions are stored.
                                ├── assets/   # Folder where Asset fields are stored (pictures, fonts etc...).
                                ├── i18n/
                                │   └── localized-strings.json  # File that contains the strings used by the Angular localization service.
                                ├── styles/
                                │   └── <application-name>.scss  # File where the global scss styles are defined.
                                └── view-components/  # Folder where View Components are stored (Standalone and Record Field types). The Angular Services can also be stored there.
```


# UI Coded component types
There are two main types of Components you can create, view components and view actions which are the main building blocks of an Innovation Studio view.  
The views can codelessly be created and edited in the view designer which is part of the BMC Helix Innovation Studio.  
The view components are implemented as regular Angular components. They extend classes, implement interfaces, and use services provided in BMC Helix Innovation Studio SDK. To make a view component available in the View designer, it must be registered using RxViewComponentRegistryService.  
A view action is a service that implements the execute method. The method receives the view action parameters and returns an Observable that should be completed when the view action is completed. It can also throw an error if something goes wrong. When a view action throws an error, the following view actions will not be executed.  
The view actions can be executed when a user interacts with a view component, e.g. when an action button is clicked, or a grid (table) row action is activated.  
The view actions are implemented as regular Angular services. Each runtime view action service must implement the execute method. To make a view action available in the view designer, it must be registered using RxViewActionRegistryService.  

There are two types of view components that can be created: standalone, and record editor fields:
* A standalone view component can be used by itself,
* A record editor field view component is designed to be used within a record editor and is mapped to one of record definition fields.

For most view components, there are two Angular components created, a design time component and a runtime component:
* The design time component is used by the view designer,
  * This component is displayed on the view designer canvas. It is responsible for collecting, validating, and persisting the view component configuration properties.
* The runtime component is used by the application. This is the component with which the end users interact.


# Standalone View Components
**When to use a Standalone View Component:**
* When you need a reusable UI component that can be used across multiple views,
* When you want to encapsulate complex UI logic or behavior,
* When you need to create a custom visualization or interaction that is not provided by default,
* When you want to create a component that can be easily configured and customized by end users,
* When it is not tied to a specific record definition field,

It could be for example:
* A custom chart or graph,
* A Barcode scanner,

A View Component can have inputs and outputs to interact with other components in the view.
You can check how to create a new Standalone View Component [here](./ObjectTypes/StandaloneViewcomponent/standalone-view-component.md).


# Record Editor Field View Components
**When to use a Record Editor Field View Components:**
* When you need to create a custom field type for a record editor,
* When you want to enhance the user experience for specific fields in a record editor,
* When you need to implement custom validation or formatting for a field,
* When you want to create a field that can interact with other fields in the record editor,
* When the component is specifically tied to a record definition field,

It could be for example:
* A custom date picker tied to a date/time field,
* A rich text editor tied to a text field,
* A Star rating component tied to a numeric field,

A View Component can have inputs and outputs to interact with other components in the view.
You can check how to create a new Record Editor Field View Component [here](./ObjectTypes/record-editor-field-view-component.md).


# View Actions
**When to use a View Action:**
* When you need to perform an operation in response to a user action in a view component,
* When you want to encapsulate business logic that can be reused across multiple view components,
* When you need to interact with backend services or APIs from a view component,
* When you want to create an action that can be easily configured and customized by end users,

It could be for example:
* An action to display a toast notification,
* An action to open a dialog,
* An action to perform calculations based on field values,

A View Action can have inputs and outputs to interact with other actions in the view.
You can check how to create a new View Action [here](./ObjectTypes/ViewAction/view-action.md).

# Angular Services
Angular Services are singleton classes that provide specific functionality and can be injected into other components or services using Angular's dependency injection system.  
Services are used to encapsulate business logic, data access, or utility functions that can be shared across multiple components.  
Services are typically decorated with the `@Injectable` decorator, which allows them to be injected into other classes.  

**When to use Angular Services:**
* When you need to share data or functionality across multiple components,
* When you want to encapsulate business logic or data access,
* When you need to interact with backend services or APIs,
* When you want to create reusable utility functions,

You can check how to create a new Angular Service [here](./ObjectTypes/angular-service.md).


# Adapt UI elements
The Adapt library provides a set of pre-built UI components, scss classes, icons, and other UI elements that can be used in your Angular code to build your view components and view actions.  
You can check the available Adapt UI elements and how to use them in your Angular code in this documentation [here](./AdaptComponents/adapt-components.md).


# Qualification / expression building
A qualification is used in BPMN process activities to define conditions, for example in an Exclusive Gateway to route the process flow based on the end user intent.  
It is also used in Innovation Studio / AR System Java code to filter data when querying Records or other data sources.  
The qualification is a series of expressions combined using logical operators, and is used to filter data or route the process flow.  
It is a bit tricky to build, you can check how to build a qualification [here](./Services/Qualification.md).


# Best practices / coding rules in Angular / TypeScript
Please follow the best practices and coding rules below when creating Java code for Innovation Studio extensions as defined in this [document](ui-best-practices.md).

## Rules for the file `/bundle/src/main/webapp/libs/<application-name>/src/lib/<application-name>.module.ts`
* Do not modify the existing imports of the file `<application-name>.module.ts`, even if they are not used,
* Do not remove commented code in the file `<application-name>.module.ts`, it is explanation for the developer,


# How to get the list of available record definitions?
The record definitions are stored in the folder `/package/src/main/definitions/db/record/` of your maven project in a `.def` file extension.  
Check the instructions [here](./Services/GettingRecordDefinition.md) to learn how to get the list of available record definitions, and their fieldIds.


# How to get the list of available process definitions?
The process definitions are stored in the folder `/package/src/main/definitions/db/process/` of your maven project in a `.def` file extension.  
Check the instructions [here](./Services/GettingProcessDefinition.md) to learn how to get the list of available process definitions, and their input / output parameters.


# How to get the list of available view definitions?
The view definitions are stored in the folder `/package/src/main/definitions/db/view/` of your maven project in a `.def` file extension.  
Check the instructions [here](./Services/GettingViewDefinition.md) to learn how to get the list of available view definitions, and their input / output parameters.


# How to interact with Java backend coded elements?
There are different types of Java backend coded elements that you can interact with from your Angular code, such as:
* Process Activity: A reusable Java component that can be called from BPMN processes to execute business logic,
  * Angular code cannot interact with those directly, as a process activity needs to be embedded in a BPMN process definition,
* Rest Api: The Innovation Studio SDK allows Developers to create custom REST API endpoints, in Java,
  * Angular code can access those through HTTP calls,
    * Check the instructions [here](./Services/CallingJavaRestApi.md) ,
* DataPageQuery: A Java component that queries data from various sources and returns paginated results as a DataPage object,
  * Angular code can interact with a coded DataPageQuery,
  * Check the instructions [here](./Services/CallingDataPageQuery.md),


# Localization and Translations
When displaying messages in the UI or in the web browser console, keep in mind that those strings can be localized in different languages. Avoid hardcoding strings in your code.  
The BMC Helix Innovation Studio SDK provides a way to manage localized strings.  
As seen earlier in the project structure, you have a folder `bundle/src/main/webapp/libs/<application-name>/src/lib/i18n/` that contains the file `localized-strings.json`. This file contains the localized strings used by the application, for the English locale:

```
<Project main folder>/
└── bundle/
    └── src/
        └── main/
            └── webapp/
                └── libs/
                    └── <application-name>/
                        └── src/
                            └── lib/
                                ├── i18n/
                                │   └── localized-strings.json  # File that contains the strings used by the Angular localization service.
```
It is a json file with this structure, where the keys are built using the following pattern:
```json
{
  "<bundleId>.view-components.<viewComponentName>.<stringId>": "<Message in English>"
}
```
For example, for a view component named `pizza-ordering`, in the bundle `com.example.sample-application`, to define a string with the id `welcome-message`, you would add this entry in the `localized-strings.json` file:
```json
{
  "com.example.pizza-ordering.view-components.pizza-ordering.welcome-message": "Welcome to the Pizza Ordering console!"
}
```

In the Angular code, you can use the `TranslateService` from `@ngx-translate/core` to get the localized string by its key, for example in a typescript file:
```typescript
import { TranslateService } from '@ngx-translate/core';
// ...
constructor(private translateService: TranslateService) {
    super();
}
// ...
const welcomeMessage = this.translateService.instant('com.example.pizza-ordering.view-components.pizza-ordering.welcome-message');
```
Or using the `TranslatePipe` in an html template:
```html
<h1>{{ 'com.example.pizza-ordering.view-components.pizza-ordering.welcome-message' | translate }}</h1>
```

**Critical**:  
Always use the localized strings in the typescript code and html template, do not use hardcoded strings. Innovation Studio will automatically serve the localized strings stored in the file `localized-strings.json`.  
If you added first the strings in the typescript code or html template, then modify the code and html to use the localized strings.  
  
_Note:_  
Do not worry about the localization of the strings in other languages, as Innovation Studio provides a way to translate those strings in different languages using the BMC Helix Translation Service in Innovation Studio itself.


# Using Assets (pictures, fonts etc...)
## Asset storage location
When you need to use assets such as pictures, fonts, or other static files in your Angular code, you should store those assets in the `bundle/src/main/webapp/libs/<application-name>/src/lib/assets/` folder of your application:
```
<Project main folder>/
└── bundle/
    └── src/
        └── main/
            └── webapp/
                └── libs/
                    └── <application-name>/
                        └── src/
                            └── lib/
                                ├── assets/   # Folder where Asset fields are stored (pictures, fonts etc...).
```
It is recommended to create subfolders in the `assets/` folder to organize your assets, for example `/assets/images/` for pictures, `/assets/fonts/` for fonts etc...  

## Assets declaration in `angular.json`
There is no need to modify the main `angular.json` `assets` section file located in `bundle/src/main/webapp/` since there is already an entry for it under `/projects/shell/architect/build/options/assets`:
```json
              {
  "glob": "**/*",
  "input": "libs/<application-name>/src/lib/assets/",
  "output": "assets/libs/<short-application-name>/resources/"
}
```
The `short-application-name` is the `application name` without the `/bundle/pom.xml` `groupId` property.  
For example, if your application name is `com.example.sample-application` (`<groupId>.<artifactId>`, the bundle the short application will be `sample-application`:
```xml
<groupId>com.example</groupId>
<artifactId>sample-application</artifactId>
```

## Usage in html and typescript code
The assets "root" path will be available at runtime under the following path pattern `/<applicationName>/scripts/assets/resources/`. 
For example, if a picture named `pizza.jpg` is stored in the `assets/images/` folder of your application, the path to access it at runtime will be:
```
/<applicationName>/scripts/assets/resources/images/pizza.jpg
```
Where the `application name` is `<groupId>.<artifactId>` from the `bundle/pom.xml` file. For example, if the application name is `com.example.sample-application`, the path to access the picture will be:
```html
<img src="/com.example.sample-application/scripts/assets/resources/images/pizza.jpg"/>
```

# Creating an Innovation Studio view
A view is a combination of UI element that can interact with each other and that can display data from record definitions for example. It is used as a User Interface the End User can interact with. It can be a console displaying a list of orders, or a form allowing to create a new order, or anything else.    
If the developer asks in the prompt to create a view in addition that would leverage the coded View Components and View Actions that you generated, you can create the view definition in the `package/src/main/definitions/db/view/` folder of your maven project in a `.def` file extension, following the instructions in [this documentation](./Template/create-view-definition.md).

  
# Glossary of Key Terms
## Application Name
An **application name** is the name of the application.  
This **application name** is used to define the path where the Angular code is located.

## Bundle
A bundle is an Innovation Studio application package that contains your custom Java code, configurations, and resources. Each bundle is an OSGi module.

## Bundle ID (bundleId)
A unique identifier for your bundle in the format `<groupId>.<artifactId>` (e.g., `com.example.sample-application`). Used to identify resources and APIs within Innovation Studio.

## Data Dictionary
View Components and View Actions often interact with each others, having their own inputs and outputs.  
In View Designer, the Developer will have access to the input and output parameters of those components and actions, along with the ones coming from the Out Of The Box components and actions provided by Innovation Studio.  
For example, a View could display data from a Record Definition in a grid (table, Out Of The Box component), and we would like to use one column of a selected row to pass it as input to a Standalone View Component (custom coded component).  
To achieve that, Innovation Studio View Designer provides a visual way to map those inputs and outputs together, displaying on the right side of an expression builder a treeview of the different Components, along with their inputs and outputs.  
This is called the Data Dictionary.

## Settable properties
Settable properties are the configurable properties of a View Component or a View Action that can be set by the end user in the view designer using an Out Of The Box View Action `SetProperty`. This View Action allows, on a button click, to set a View Component Input to a specific value, or to set a View Component Input to the output of another View Action.  
A View Component Input does not have to be necessarily settable, it depends on the implementation of the component. If the input is settable, it will be displayed in the data dictionary when selecting the `SetProperty` View Action.

## Record Definition
A schema that defines the structure of data in Innovation Studio, similar to a database table. Identified by a fully qualified name: `<bundleId>:<recordDefinitionName>`.

## Record Instance
An individual data entry (row) within a Record Definition. Each record instance has a unique ID (GUID) and field values.

## Field ID (fieldId)
An integer identifier for a field within a Record Definition. Used in code to reference specific fields (e.g., fieldId `379` is typically the GUID field, fieldId `8` is often a Description field).

## Standalone View Component
A view components is implemented as regular Angular components. They extend classes, implement interfaces, and use services provided in BMC Helix Innovation Studio SDK. To make a view component available in the View designer, it must be registered using RxViewComponentRegistryService.  
A Standalone View Component can be used by itself.

## Record Editor Field View Component
A view components is implemented as regular Angular components. They extend classes, implement interfaces, and use services provided in BMC Helix Innovation Studio SDK. To make a view component available in the View designer, it must be registered using RxViewComponentRegistryService.  
A record editor field view component is designed to be used within a record editor and is mapped to one of record definition fields.

## View Action
The view actions can be executed when a user interacts with a view component, e.g. when an action button is clicked, or a grid (table) row action is activated.  
The view actions are implemented as regular Angular services. Each runtime view action service must implement the execute method. To make a view action available in the view designer, it must be registered using RxViewActionRegistryService.

## Angular Service
A standard Angular singleton class that provides specific functionality and can be injected into other components or services using Angular's dependency injection system.
