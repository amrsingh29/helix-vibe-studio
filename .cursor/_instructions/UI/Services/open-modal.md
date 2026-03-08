# Definition
Innovation Studio is a production from BMC Helix.  
Sometimes, you need to interact with the End User, to display information, prompting for information or asking for its confiration.  
Instead of creating custom Angular components for these use cases, the BMC Helix Innovation Studio SDK provides the `RxModalService` that can be used to open a modal window with a message and configuration, and get the user response when the modal window is closed.


# Interacting with the End User using pre-defined modal windows 
There are three possible methods to open a modal window using the `RxModalService`:
* `confirm`: opens a modal window for confirmation use case.
  * The method signature is `confirm(modalConfig: IModalConfig, allowDismiss?: boolean)` and returns a Promise of type `boolean`,
* `alert`: opens a modal window with an alert message and configuration.
  * The method signature is `alert(modalConfig: IModalConfig)` and returns a Promise that implements the 'resolve' and 'reject' functions, that can be used to handle the user action on the alert modal window to determine if the End User closed the alert modal window or if the alert was rejected.
* `prompt`: opens a modal window with a prompt message and configuration,
  * The method signature is `prompt(config: IModalConfig)` and returns an Promise of type `IPromptResponse` from import `@helix/platform/ui-kit/modal/modal.config.interfaces`,
    * The `IPromptResponse` object contains the following properties:
      * `response`: a boolean value that indicates if the user confirmed the prompt or not,
      * `answer`: (optional) a string value that contains the user input in the prompt modal window, if any.
  
The configuration object `IModalConfig` comes from the import `@helix/platform/ui-kit` and is used to configure the modal window. It contains the following properties:
* `title`: the title of the modal window,
* `modalStyle`: (optional) the style of the modal window, which can be one of the following values from the `RX_MODAL` from import `@helix/platform/ui-kit` with the following possible values from its `modalStyles` property:
  * `primary`: should be used for standard modal windows,
  * `info`: should be used for information messages,
  * `success`: should be used for success messages,
  * `warning`: should be used to display warnings,
  * `danger`: should be used to display error messages,
* `message`: (optional) the message to display in the modal window,
* `isDialog`: (optional) a boolean value that indicates if the modal is a dialog or not,
* `buttons`: (optional) an object that contains the labels of the buttons to display in the modal window, with the following properties:
  * `confirmButton`: the label of the confirm button,
  * `dismissButton`: (optional) the label of the dismiss button,


# Examples
Example of use of the `confirm` method to open a modal window with a prompt message and configuration, and get the user input when the modal is closed:
```typescript
import { IModalConfig, RX_MODAL, RxModalService } from '@helix/platform/ui-kit';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxModalService: RxModalService, private rxLogService: RxLogService) {
    super();
}
// ...
const TITLE = 'Please confirm your choice';
const MESSAGE = 'Are you sure you want to proceed?';

const params: IModalConfig = {
    title: TITLE,
    modalStyle: RX_MODAL.modalStyles.primary,
    message: MESSAGE
};

this.rxModalService.confirm(params).then((result: boolean) => {
    if (result) {
      this.rxLogService.log('User confirmed the action');
    } else {
      this.rxLogService.log('User dismissed the confirmation');
    }
});
```
  
Example for a prompt modal window:
```typescript
import { IModalConfig, RX_MODAL, RxModalService } from '@helix/platform/ui-kit';
import { IPromptResponse } from '@helix/platform/ui-kit/modal/modal.config.interfaces';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxModalService: RxModalService, private rxLogService: RxLogService) {
    super();
}
// ...
const TITLE = 'Your order has been placed';
const MESSAGE = 'Your order has been placed';

const params: IModalConfig = {
    title: TITLE,
    modalStyle: RX_MODAL.modalStyles.success,
    message: MESSAGE
};

this.rxModalService.confirm(params).then((response: IPromptResponse) => {
  this.rxLogService.log('User response:', response.answer, 'User confirmed:', response.response);
});
```
  
Example for an alert modal window:
```typescript
import { IModalConfig, RX_MODAL, RxModalService } from '@helix/platform/ui-kit';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxModalService: RxModalService, private rxLogService: RxLogService) {
    super();
}
// ...
const TITLE = 'Error placing the order';
const MESSAGE = 'We could not process your order, please try again later';

const params: IModalConfig = {
    title: TITLE,
    modalStyle: RX_MODAL.modalStyles.danger,
    message: MESSAGE
};

this.rxModalService.alert(params).then((result) => {
    // Handle resolve (user closed the alert)
  this.rxLogService.log('Alert resolved:', result);
}).catch((reason) => {
    // Handle reject (if alert was rejected / the user clicked on a dismiss button if any)
  this.rxLogService.error('Alert rejected:', reason);
});
```
