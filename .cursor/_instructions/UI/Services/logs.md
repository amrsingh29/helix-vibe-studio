# Definition
Innovation Studio is a production from BMC Helix.  
When coding in Angular, it is often useful to display logs that can help debugging problems at runtime.    
Innovation Studio provides a Service to help Developers write logs in the web browser console.   
Innovation Studio also provides a Service to help Developers interact with the End Users using Toasts messages, that would be displayed in the web browser.   

# Logging in the web browser console
In order to write logs in the web browser console, you need to use the service `RxLogService` from the import `@helix/platform/shared/api` and declare it in the Component's constructor.  
Then, you can use the different methods of the `RxLogService` to write logs in the web browser console, such as `error()`, `warn()`, `info()`, `debug()` etc...  
The available methods for `RxLogService` are:
* `error` for errors messages,
* `warning` for warnings messages,
* `info` for information messages,
* `debug` for debugging messages,
* `log` for logs messages,
Their signature is the same:
* `error(message: string): void`
  
For example:
```typescript
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxLogService: RxLogService) {
    super();
}
// ...
this.rxLogService.warning(`<warningMessage>`);
```

**Critical:**  
Never use `console` methods like `console.log`, `console.error` directly, always use the `RxLogService` instead.  
  
  
# Interacting with End Users using Toasts messages
In order to display messages to the End User, you need to use the service `RxNotificationService` from the import `@helix/platform/shared/api` and declare it in the Component's constructor.  
Then, you can use the different methods of the `RxNotificationService` to display Toast messages to the End User, such as `error()`, `warn()`, `info()`, `debug()` etc...  
The available methods for `RxLogService` are:
* `addErrorMessage` for error messages,
* `addWarningMessage` for warning messages,
* `addInfoMessage` for information messages,
* `addSuccessMessage` for success messages,
Their signature is the same:
* `addErrorMessage(message: string title?: string): void`

For example:
```typescript
import { RxNotificationService } from '@helix/platform/shared/api';
// ...
constructor(private rxNotificationService: RxNotificationService) {
    super();
}
// ...
this.rxNotificationService.addInfoMessage(`<infoMessage>`, `<title>`);
```


# Trapping Exceptions 
It is recommended to trap exceptions, and handle them appropriately, writing logs in the web browser logs.  
Only display toast messages to the End User if the exception is something that the End User can act on, otherwise, it is better to only write a log in the web browser console, and eventually display a generic error message to the End User.
