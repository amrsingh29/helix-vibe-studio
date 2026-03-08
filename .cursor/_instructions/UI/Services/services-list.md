# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to extend the capabilities of UI elements Angular code, here are the different possible extensions.  
Several services are provided by the Innovation Studio SDK, and should be used in your Angular code to interact with Innovation Studio features, such as data access, logging, security etc...

# Services list
Here is a non-exhaustive list of the main services provided by the Innovation Studio SDK, and their entry points to get information on them:
* **RxLogService** and **RxNotificationService**: Used to log messages in the web browser console and toasts messages.
  * Import: `@helix/platform/shared/api`
  * Documentation: [Logging and sending feedback to End User](./logs.md)
* **RxRecordInstanceService** and **RxRecordInstanceDataPageService**: Used to create, read, update, delete records in BMC Remedy AR System forms or Innovation Studio Record Definitions.  
  * Import: `@helix/platform/record/api`  
  * Documentation: [RecordService](./records.md)
* **RxCurrentUserService**: Used to get currently user information (username, userId etc...),
  * Import: `@helix/platform/shared/api`  
  * Documentation: [User information](./user-information.md)
* **RxOpenViewActionService**: used to open an Innovation Studio view, by its name, and with optional parameters.
  * Import: `@helix/platform/view/actions`  
  * Documentation: [Opening an Innovation Studio view](./open-view.md)
* **RxModalService**: used to interact with the End User to display modal messages (alert, prompt or confirmation window).
  * Import: `@helix/platform/ui-kits`  
  * Documentation: [Opening an Innovation Studio view](./open-modal.md)
* **AdaptModalService**: used to open an Angular Component in a modal window.
  * Import: `@bmc-ux/adapt-angular`  
  * Documentation: [Opening an Innovation Studio view](./open-modal-components.md)
* **RxLaunchProcessViewActionService**: used to execute an Innovation Studio process, by its name, and with optional parameters.
  * Import: `@helix/platform/view/actions`  
  * Documentation: [Execute an Innovation Studio process](./launch-process.md)


# **Important** How to use services in View Components and View Actions?
Most of the time, the services need to be imported in the constructor of your Angular component or service, and then you can call the different methods they provide, for example to get the current user information, you can do:
```typescript
import { RxCurrentUserService } from '@helix/platform/shared/api';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxCurrentUserService: RxCurrentUserService, private rxLogService: RxLogService) {}
// ...
ngOnInit() {
  this.rxLogService.log(this.rxCurrentUserService.get().userId);
}
```
  
However, for a View Component design model (`<view-component-name>-design.model.ts`), you cannot import the services in the constructor, because the design model is created by Innovation Studio, not by Angular Dependency Injection.  
In this case, you need to use the Angular `Injector` from `@angular/core` which is already available in the constructor to inject the services you need, for example injecting the `RxCurrentUserService`:
```typescript
import { Injector } from '@angular/core';
// ...
import { RxCurrentUserService } from '@helix/platform/shared/api';
import { RxLogService } from '@helix/platform/shared/api';
// ...
private rxCurrentUserService = this.injector.get<RxCurrentUserService>(RxCurrentUserService);
private rxLogService = this.injector.get<RxLogService>(RxLogService);
// ...
constructor(protected injector: Injector, 
    readonly sandbox: IViewActionDesignSandbox<IFruitPickerActionDesignProperties>) {
    // ...
    // Display current user Id
  this.rxLogService.log(this.rxCurrentUserService.get().userId);
}
```
