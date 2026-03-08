# Definition
Innovation Studio is a production from BMC Helix.  
When End Users want a third party system to interact with Innovation Studio Business Processes, they can use the Innovation Studio REST API, however those are very generic, and might expose more than anticipated, or might be harder to use.  
Commands are used to execute operations on Innovation Studio, mostly as "fire and forget" operations.    
Commands usually don't return any data, just a status code, they should not be used as rest apis are preferred.  


# Command
You can create a Java class extending `Command` from `com.bmc.arsys.rx.services.common.Command`. This class usually contains only one method `execute()` that will be executed when the Command is triggered:
```java
import com.bmc.arsys.rx.services.common.Command;

public class SimpleCommand extends Command{
    
}
```
  
The `execute()` method will be executed when the Command is called.  
If there are some input parameters, you need to:
* Create private variables for each parameter,
* Create a Getter and Setter for each parameter,
  
As a rule of thumb, some Innovation Studio decorators `@RxDefinitionTransactional` and `@AccessControlledMethod` need to be added as well, to let the method access record instances.  
For example:
```java
package com.example.bundle;

import java.net.URI;
import javax.ws.rs.core.UriInfo;
import org.springframework.transaction.annotation.Isolation;

import com.bmc.arsys.rx.services.common.Command;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.AuthorizationLevel;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.LicensingLevel;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;

// The class extends BMC object Command
public class SimpleCommand extends Command{
    // Parameters
    private String username;		// input parameter
    private String password;		// input parameter

    // automatic getter (username)
    public String getUsername() {
        return username;
    }

    // automatic setter (username)
    // sent by postman for example (?).
    public void setUsername(String username) {
        this.username = username;
    }

    // automatic getter
    public String getPassword() {
        return password;
    }

    // automatic setter
    // sent by postman for example (?).
    public void setPassword(String password) {
        this.password = password;
    }

    // Code executed when command is called.
    // This example is very simple, usually a Command does an action and does not send back any result.
    @Override
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(authorization = AuthorizationLevel.ValidUser, licensing = LicensingLevel.Application, checkSchemaForSpecialAccess = true, promoteStructAdmin = true)
    public URI execute(UriInfo arg0) {
        System.out.println("hello world :) username="+getUsername()+", password="+getPassword());

        return null;
    }
}
```

# Code location
The class should be created in the /bundle/src/main/java folder.


# Special instructions
Be careful of the class package name, it should be the one from the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`


# Registration
You need to declare the class in the file `/bundle/src/main/java/com/example/bundle/MyApplication.java` in its `register()` method, leveraging the `registerClass()` method, for example:
```java
    protected void register() {
        //
        // TODO: Register static web resources and framework extensions.
        //
        // registerService(new MyService());
        //

        // Registering custom command.
        registerClass(SimpleCommand.class);

        registerStaticWebResource(String.format("/%s", getId()), "/webapp");
    }
```


# Example:
You can find an example of implementation in the folder [Examples/Command](./Examples/Command/):
* The class [Examples/Command/SimpleCommand.java](./Examples/Command/SimpleCommand.java) implements a simple command that returns the given inputs.


# Allowed Innovation Studio Services
When creating a new Command, you should use the Out Of The Box services provided in Innovation Studio SDK, the list is in the file [services.md](../Services/services-list.md).

