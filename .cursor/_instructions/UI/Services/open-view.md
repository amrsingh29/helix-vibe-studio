# Definition
Innovation Studio is a production from BMC Helix.  
A view is a combination of UI element that can interact with each other and that can display data from record definitions for example. It is used as a User Interface the End User can interact with. It can be a console displaying a list of orders, or a form allowing to create a new order, or anything else.  
A view can have input parameters that can be provided when opening the view, and output parameters that can be retrieved after the view is closed.  


# How to get the list of available view definitions and their input / output parameters?
The process definitions are stored in the folder `/package/src/main/definitions/db/view/` of your maven project in a `.def` file extension.  
Check the instructions [here](./GettingViewDefinition.md) to learn how to get the list of available view definitions, and their input / output parameters.


# Opening an Innovation Studio view
It is possible to open a View in Angular code, using the `RxOpenViewActionService` from the import `@helix/platform/view/actions`. This service allows you to open a view, by its name, and with optional parameters.  
The service must be injected in the constructor of the Angular component.  
Like a record definition name, a view definition needs to be fully qualified with its bundle id `<bundleId>:<view name>`, for example `com.example.sample-application:order-details` for a view named `order-details` in the bundle `com.example.sample.application`.  
Usually the view name is hardcoded or provided as a view component input parameter.  
  
A parameter object `IOpenViewActionParams` from import `@helix/platform/view/actions/open-view/open-view-action.types` must be prepared to be passed to the `RxOpenViewActionService` when opening the view, it contains the following properties:
* `presentation`: An object that defines how the view will be displayed, it contains the following properties:
  * `type`: The type of presentation, it can be one of the following values from the enum `OpenViewActionType` from import `@helix/platform/view/api`:
    * `FullWidth`: The view will take the full width of the web browser.
    * `CenteredModal`: The view will be displayed as a modal window, centered.
    * `DockedLeftModal`: The view will be displayed as a modal docked to the left side of the screen. The main view will not be accessible until the modal is closed, a drop shadow will be displayed on the main view to indicate that it is not accessible.
    * `DockedRightModal`: The view will be displayed as a modal docked to the right side of the screen. The main view will not be accessible until the modal is closed, a drop shadow will be displayed on the main view to indicate that it is not accessible.
  * `title`: (Optional) The title of the view, it will be displayed in the header of the view.
  * `launchBehavior`: (Optional), this is only applicable if the `type` is `OpenViewActionType.FullWidth`,
    * It is a value from the `OpenViewActionLaunchBehavior` enum from import `@helix/platform/view/api` it is used to tell how the view should be opened,
      * `SameWindow`: The view will replace the current view,
      * `NewWindow`: The view will be opened in a new browser window or tab, depending on the browser settings.
  * `modalSize`: (Optional), this is only applicable if the `type` is not `OpenViewActionType.FullWidth`, so only for modal or docked views,
      * It is a value from the `OpenViewActionModalSize` enum from import `@helix/platform/view/api` it is used to tell how large should the view should be displayed,
        * `Xsmall`: The view will be displayed in a very small size, it can be used for example for a confirmation message.
        * `Small`: The view will be displayed in a small size, it can be used for example for a form with only one or two input parameters.
        * `Medium`: The view will be displayed in a medium size, it can be used for example for a form with few input parameters.
        * `Large`: The view will be displayed in a large size, it can be used for example for a form with many input parameters.
        * `Xlarge`: The view will be displayed in a very large size, it can be used for example for a view that needs to display a lot of information.
        * `Xxlarge`: The view will be displayed in a very large size, it can be used for example for a view that needs to display a lot of information.
        * `FullSize`: The view will take all the available space, it can be used for example for a view that needs to display a lot of information.
* `viewDefinitionName`: The fully qualified name of the view to open, in the format `<bundleId>:<view name>`.
* `viewParams`: An object that contains the view input parameters, if any, in the format of key value pairs, where the key is the name of the view input parameter, and the value is the value of the view input parameter. The view input parameters must be defined in the view definition to be used in the view.
  
Once the `IOpenViewActionParams` object is prepared, the view can be opened by calling the `execute` method of the `rxOpenViewActionService` and passing the `IOpenViewActionParams` object as a parameter.  
The `execute` method will return an observable that will emit a value when the view is closed, the emitted value will be the output parameters of the view if there are any, in the format of key value pairs, where the key is the name of the view output parameter, and the value is the value of the view output parameter. The view output parameters must be defined in the view definition to be used in the view.  
You can use the `catchError` operator from RxJS to catch the case where the view has been closed using a cancel button or by clicking outside the view, in this case the observable will emit an error that you can catch and handle accordingly.  
  
For example here a view is opened and returns one output parameter when it is closed:
```typescript
import { IOpenViewActionParams } from '@helix/platform/view/actions/open-view/open-view-action.types';
import { OpenViewActionType } from '@helix/platform/view/api';
import { RxOpenViewActionService } from '@helix/platform/view/actions';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxOpenViewActionService: RxOpenViewActionService, private rxLogService: RxLogService) {
    super();
}
// ...
const VIEW_NAME = "com.example.sample-application:order-details";
const VIEW_TITLE = "Order details";

const viewParameters: IOpenViewActionParams = {
    presentation: {
        type: OpenViewActionType.DockedRightModal,
        title: VIEW_TITLE
    },
    viewDefinitionName: VIEW_NAME,
    // view input parameters.
    viewParams: {
        "first name":"John",
        "last name":"Wick"
    }
};

this.rxOpenViewActionService
    .execute(viewParameters)
    .pipe(
        // This code will be used if the view is closed by a button with an action "Close View"
        // with "act as cancel".
        catchError((error) => {
            this.viewResult = 'The view has been closed, with Cancel action.';

            return EMPTY;
        })
    ).subscribe((viewOutput) => {
    // viewOutput would contain the view output parameters with this format:
    // {
    //   "view output parameter 1":"value",
    //   "view output parameter 2":"value"
    // }
    //
    // In this example we are assuming that the view has an output parameter named "full name" that returns the full name of the person.
    this.rxLogService.log('The view has been closed and returned as full name', get(viewOutput, 'full name'));
});
```
  
**Important:**.   
The module `OpenViewActionModule` needs to be imported in the view component Angular registration module (`<view-component-name>-registration.module.ts`) to avoid dependency errors at runtime.  
For example:
```typescript
import { NgModule } from '@angular/core';
import { RX_STANDARD_PROPS_DESC, RxViewComponentRegistryService } from '@helix/platform/view/api';
import { PizzaOrderingDesignComponent } from './design/pizza-ordering-design.component';
import { PizzaOrderingDesignModel } from './design/pizza-ordering-design.model';
import { PizzaOrderingComponent } from './runtime/pizza-ordering.component';
import { OpenViewActionModule } from '@helix/platform/view/actions';

@NgModule({
    imports: [OpenViewActionModule]
})
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
