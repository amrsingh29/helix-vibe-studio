# Definition
Innovation Studio is a production from BMC Helix.  
A process is a set of actions that are executed in a specific order, it can be used to automate a business process, for example to automate the onboarding of a new employee, or to automate the incident management process.  
It is possible to trigger a process from a custom component, this could be helpful to trigger a process after a specific action in the component, for example after clicking on a button to send an email, or to create a new item in the CMDB.   
A process can have input parameters that can be provided when triggering the process, and output parameters that can be retrieved after the process execution is completed.  


# How to get the list of available process definitions and their input / output parameters?
The process definitions are stored in the folder `/package/src/main/definitions/db/process/` of your maven project in a `.def` file extension.  
Check the instructions [here](./GettingProcessDefinition.md) to learn how to get the list of available process definitions, and their input / output parameters.
  
  
# Executing a process
It is possible to execute a Process in Angular code, using the `RxLaunchProcessViewActionService` from the import `@helix/platform/view/actions`. This service allows you to execute a process, by its name, and with optional parameters.
Like a record definition name, a process definition needs to be fully qualified with its bundle id `<bundleId>:<process name>`, for example `com.example.sample-application:order-pizza` for a process named `order-pizza` in the bundle `com.example.sample.application`.  
Usually the process name is hardcoded or provided as a view component input parameter.  

A parameter object `ILaunchProcessViewActionParams` from import `@helix/platform/view/actions/launch-process/launch-process-view-action.types` must be prepared to be passed to the `RxLaunchProcessViewActionService` when executing the process. Here is the import statement for the `ILaunchProcessViewActionParams` interface:
* `processDefinitionName`: The fully qualified name of the process to execute, in the format `<bundleId>:<process name>`,
* `waitForProcessCompletion`: A boolean that indicates whether to wait for the process execution to complete,
  * If set to `true`, the process execution will wait for the process execution, and return the result of the process execution,
    * This should be the default value, since in most of the cases we want to get the result of the process execution, and to do that we need to wait for the process execution to complete in order to get the results.
  * If set to `false`, the process execution will not wait for the process execution, and return immediately after triggering the process, in this case the process result will not be returned.
* `actionProcessInputParams`: An object that contains the process input parameters, if any, in the format of key value pairs, where the key is the name of the process input parameter, and the value is the value of the process input parameter.
```typescript
export interface ILaunchProcessViewActionParams {
    processDefinitionName: string;
    waitForProcessCompletion: boolean;
    actionProcessInputParams: IPlainObject;
}
export interface IPlainObject<TValue = any> {
    [name: string]: TValue;
}
```
  
_Note:_  
If a process input parameter is defined as `REQUIRED` in the process definition, it must be provided in the `ILaunchProcessViewActionParams` object when executing the process, otherwise the process execution will fail.  
The only exception in this rule is when the process input parameter is defined as `REQUIRED` but has a default value, in this case the process execution will not fail if the process input parameter is not provided in the `ILaunchProcessViewActionParams` object, since the default value will be used for the process execution.  
    
To execute the process, use the `execute` method of the `RxLaunchProcessViewActionService` with the parameters object type `ILaunchProcessViewActionParams` as parameter. It will return an observable that will emit a value type `IPlainObject` from `@helix/platform/shared/api` when the process execution is completed.  
The emitted value will be the output parameters of the process if there are any, in the format of key value pairs, where the key is the name of the process output parameter, and the value is the value of the process output parameter:
```typescript
import { RxLaunchProcessViewActionService } from '@helix/platform/view/actions';
import { ILaunchProcessViewActionParams } from '@helix/platform/view/actions/launch-process/launch-process-view-action.types';
// ...
constructor(private rxLaunchProcessViewActionService: RxLaunchProcessViewActionService) {
    super();
}
// ... 
// Process definition name, it should be in the format <bundleId>:<process name>
const PROCESS_DEFINITION_NAME = "com.example.sample-application:order-pizza";

// Process input parameters, it should be in the format of key value pairs, where the key is the name of the process input parameter, and the value is the value of the process input parameter. The process input parameters must be defined in the process definition to be used in the process. For example, if the process definition contains an input parameter named "customerName" of type string, another named "orderedPizza" of type string, and another named "quantity" of type number, we can prepare the process input parameters like this:
const processParameters: ILaunchProcessViewActionParams = {
    processDefinitionName: PROCESS_DEFINITION_NAME,
    waitForProcessCompletion: true,
    actionProcessInputParams: {
        customerName: 'John Doe',
        orderedPizza: 'Calzone',
        quantity: 1
    }
};

// Executing the process, and reading the output parmameters when the process execution is completed, the process output parameters must be defined in the process definition to be used in the process. For example, if the process definition contains an output parameter named "orderId" of type string, and another named "readyTime" of type Date, we can read the process output parameters like this: 
this.rxLaunchProcessViewActionService.execute(processParameters).subscribe((processResponse: IPlainObject) => {
    // In our example, we have two process output parmeters, the order id and the date/time when the pizza will be ready.
    // We can access them using the key of the output parameters, for example if the process definition contains an output parameter named "orderId" and another named "readyTime", we can access them like this:
    const orderId = processResponse['orderId'];
    const readyTime = processResponse['eadyTime'];
});
```
