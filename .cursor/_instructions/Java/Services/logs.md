# Definition
Innovation Studio is a production from BMC Helix.  
When coding in Java, it is often useful to write logs that can help debugging problems at runtime.  
Innovation Studio provides a Service to help Developers write logs. 

# Service and usage
In order to write logs, you need to locate the service `getLogger()` from the BMC Helix SDK, then call the different log levels methods (debug, info, warning, error) directly, passing the error message:
```java
import com.bmc.arsys.rx.application.common.ServiceLocator;
// ...
ServiceLocator.getLogger().error("This is an error message.");
```


# Trapping Exceptions 
It is recommended to trap `RxException` from `com.bmc.arsys.rx.services.RxException` Innovation Studio objects by using try-catch blocks, and handle them appropriately.  
To get the RxException message, you can use its `getLocalizedMessage()` method:
```java
import com.bmc.arsys.rx.services.RxException;
import com.bmc.arsys.rx.application.common.ServiceLocator;

try {
    // Your code that may throw an RxException
}
catch (RxException e) {
  ServiceLocator.getLogger().error("<errorMessage> " + e.getLocalizedMessage());
}
```
