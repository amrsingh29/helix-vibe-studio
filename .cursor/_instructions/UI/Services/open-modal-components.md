# Definition
Innovation Studio is a production from BMC Helix.
Sometimes, you might have to create Angular components that are not views but still need to be opened in a modal window, for example a component that contains a form with input parameters that are not defined as view input parameters, or a component that needs to be opened from another component that is not a view.
The BMC Helix Innovation Studio SDK provides the `RxModalService` that can be used to open an Angular component in a modal window, and pass parameters to it.  


# When to use this solution?
This solution should only be used for complex use cases that can not be handled by the `RxModalService` methods to open pre-defined modal windows (confirmation, alert or prompt), or by opening a view in a modal window using the `RxOpenViewActionService`, and should be used as a last resort, as it requires more development effort and does not provide a consistent user experience across the platform.  


# Opening an Angular component in a modal window
## Configuring the caller component
It is possible to open an Angular component in a modal window using the `AdaptModalService` from the BMC Helix Innovation Studio SDK from import `@bmc-ux/adapt-angular`. This service needs to be injected in the constructor of the component that will open the modal window.  
A configuration object of type `ModalDialog` from import `@bmc-ux/adapt-angular` needs to be created to define the content of the modal window:
* `isDialog`: whether the modal window is a dialog or not, if set to true, the modal window will be displayed as a dialog, if set to false, the modal window will be displayed as a regular modal window.
* `hideBackdrop`: whether to display a backdrop behind the modal window or not.
* `blockKeyboard`: whether to block the keyboard or not, if set to true, the modal window can only be closed by clicking on a button in the modal window, if set to false, the modal window can be closed by clicking on the backdrop or by pressing the Escape key.
* `content`: the Angular component to open in the modal window.
* `title`: the title of the modal window.
* `data`: the data to pass to the component, this data can be accessed in the component using the `AdaptModalService` method `getData()`.
* `size`: (optional) the size of the modal window, can be set to '', 'sm' (for small) or 'lg' (for large),
  * This setting is rarely used as the content of the modal window should be responsive and adapt to the size of the screen, but it can be useful in some cases to force a specific size for the modal window.
You can then use the `open` method of the `AdaptModalService` to open the modal window, this method returns a promise that resolves when the modal window is closed, and returns the data passed when closing the modal window.
  
In this example, we will open a modal window to display a component called `OrderingComponent`:.
```typescript
import { AdaptModalService, ModalDialog, StepsMenuItem } from '@bmc-ux/adapt-angular';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private adaptModalService: AdaptModalService, private rxLogService: RxLogService) {
  super();
}
// ...
const USER_NAME = 'John Doe';
const USER_ID = 'JDoe';
// Opening an Adapt Modal Dialog window to edit / add / remove steps.
const modalDialogConfig: ModalDialog = {
  isDialog: true,
  // Display a backdrop.
  hideBackdrop: false,
  // Allows to dismiss the dialog window using the Escape key.
  blockKeyboard: false,
  content: OrderingComponent,
  title: 'Wizard step editor',
  data: {
    'userName': USER_NAME,
    'userId': USER_ID
  }
};

this.adaptModalService.open(modalDialogConfig).then((result) => {
  this.rxLogService..log('Modal window closed, result: ' + result);
}).catch((cancellationReason) => {
  this.rxLogService.log('End user cancelled the modal for this reason: ' + cancellationReason);
});
```

## Configuring the destination component
The component that will be opened in the modal window needs to consume the `ActiveModalRef` from import `@bmc-ux/adapt-angular` to get the data passed by the caller, and to return data back to the caller.  
The service needs to be injected in the constructor of the component, and should be marked as optional, as the component can also be used outside of a modal window.
 
Available methods for `ActiveModalRef`:
* `getData` used to get the data passed in the configuration object when opening the modal window.
* `close` used to close the modal window and return data to the caller component, this method takes an optional parameter that will be returned to the caller component when the modal window is closed, and can be used to return the result of the operations performed in the modal window to the caller component.  
  * The data can be of any type,
  * It will trigger the `then` callback of the promise returned by the `open` method of the `AdaptModalService`.
* `dismiss()` used to close the modal window when the End User wants to cancel the operation. Data can be returned to the caller component when dismissing the modal window, for example to indicate the reason for the dismissal (user cancelled the operation, validation error etc...), but the data is optional.
  * The data can be of any type,
  * It will trigger the `catch` callback of the promise returned by the `open` method of the `AdaptModalService`.
  
In this example, we will get the data passed in the configuration object when opening the modal window, and return the updated step list to the caller component when closing the modal window:
```typescript
import { Optional } from '@angular/core';
import { ActiveModalRef } from '@bmc-ux/adapt-angular';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(@Optional() public activeModalRef: ActiveModalRef, private rxLogService: RxLogService) {
  // Getting the data payload sent by the caller.
  const data = (this.activeModalRef ? this.activeModalRef.getData() : null) || null;
  
  if (data) {
    this.rxLogService.log('Data passed to the modal window, user name: ' + data.userName + ', user id: ' + data.userId);
  }
}

// Method to close the modal window and return data to the caller component.
returnValue(): void {
  this.activeModalRef.dismiss('Order id is 12345');
}

// Example of method that would close the modal window without returning data to the caller component, for example when clicking on a cancel button.
cancel(): void {
  this.activeModalRef.dismiss('User cancelled the operation.');
}
```

