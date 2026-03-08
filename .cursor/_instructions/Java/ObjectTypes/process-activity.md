# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to create Business Processes using BPMN 2.0 process activities.  
Innovation Studio provides a set of standard process activities, but also allows End Users to create custom process activities, in Java.  


# Process Activity
You can create a Java class implementing `Service` from `com.bmc.arsys.rx.services.common.Service`. This class can contains multiple methods, each one of them can be a process activity.    
```java
import com.bmc.arsys.rx.services.common.Service;

public class SimpleProcessActivity implements Service {
    
}
```

Each process activity method needs to be decorated using `@Action` from `com.bmc.arsys.rx.services.action.domain.Action` where you can define:
* The name of the process activity (usually the method name),
* The scope (PUBLIC means all applications can use it, BUNDLE means only the current bundle can use it),
The method can return simple types, such as String, but also classes, here it returns the class SimpleResponsePayload:
```java
package com.example.bundle;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Object used in the SimpleProcessActivity example.
 */
public class SimpleResponsePayload {
    @JsonProperty
    private String userName = "";
    @JsonProperty
    private String password = "";

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```
The method can have inputs, defined using the decorator `@ActionParameter` from `com.bmc.arsys.rx.services.action.domain.ActionParameter`:
* The name property is the name of the variable,
  * Usually for String types you need to add `@NotBlank` from `javax.validation.constraints.NotBlank` and `@NotNull` from `javax.validation.constraints.NotNull` to ensure the variable is not empty,
  * **Important**: For numeric values (Double, Integer, etc.), always use `String` as the parameter type and parse them inside the method. Do not use primitive types or wrapper types (Double, Integer, etc.) directly as `@ActionParameter` types.

```java
import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.domain.Scope;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

// ...
    @Action(name = "generatePassword", scope = Scope.PUBLIC)
    public SimpleResponsePayload generatePassword(@ActionParameter(name = "userName") @NotBlank @NotNull String userName) {
        // Implementation here
        SimpleResponsePayload response = new SimpleResponsePayload();
        response.setUserName(userName);
        response.setPassword(userName + "_generated_password");
        return response;
    }
```


# Handling Numeric Parameters

**Critical**: When your process activity needs numeric inputs (prices, quantities, rates, etc.), always use `String` as the parameter type and parse them internally.

**Why?** Process parameters from the BPMN engine are passed as strings, not as native Java types. Using `Double`, `Integer`, or other numeric types directly will cause runtime errors.

## Example: Correct Way to Handle Numeric Parameters

```java
@Action(name = "calculatePrice", scope = Scope.PUBLIC)
public PriceResult calculatePrice(
        @ActionParameter(name = "basePrice") @NotBlank @NotNull String basePriceString,
        @ActionParameter(name = "quantity") @NotBlank @NotNull String quantityString) {
    
    try {
        // Parse string parameters to numeric values
        double basePrice = basePriceString != null ? Double.parseDouble(basePriceString) : 0.0;
        int quantity = quantityString != null ? Integer.parseInt(quantityString) : 0;
        
        // Perform calculations
        double totalPrice = basePrice * quantity;
        
        // Return result
        PriceResult result = new PriceResult();
        result.setTotalPrice(totalPrice);
        return result;
        
    } catch (NumberFormatException e) {
        ServiceLocator.getLogger().error("Invalid numeric input: " + e.getMessage());
        throw new RuntimeException("Invalid numeric value provided", e);
    }
}
```

## Example: Incorrect Way (DO NOT USE)

```java
// ❌ WRONG - DO NOT USE Double/Integer directly
@Action(name = "calculatePrice", scope = Scope.PUBLIC)
public PriceResult calculatePrice(
        @ActionParameter(name = "basePrice") @NotNull Double basePrice,  // ❌ WRONG
        @ActionParameter(name = "quantity") @NotNull Integer quantity) { // ❌ WRONG
    // This will fail at runtime!
}
```

## Key Points for Numeric Parameters:

1. **Always use `String` type** for `@ActionParameter` when expecting numeric values
2. **Parse inside the method** using `Double.parseDouble()`, `Integer.parseInt()`, etc.
3. **Add error handling** with `try-catch (NumberFormatException)` to handle invalid inputs
4. **Use `@NotBlank @NotNull`** validation annotations for String parameters
5. **Log errors** appropriately when parsing fails
```

# Code location
The class should be created in the /bundle/src/main/java folder.


# Special instructions
Be careful of the class package name, it should be the one from the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`


# Registration
You need to declare the class in the file `/bundle/src/main/java/com/example/bundle/MyApplication.java` in its `register()` method, leveraging the `registerService()` method, for example:
```java
    protected void register() {
        //
        // TODO: Register static web resources and framework extensions.
        //
        // registerService(new MyService());
        //

        // Registering custom process activities.
        registerService(new SimpleProcessActivity());

        registerStaticWebResource(String.format("/%s", getId()), "/webapp");
    }
```

# Example:
Here is a very simple example of a process activity, returning a SimpleResponsePayload class in the folder [Examples/ProcessActivity](./Examples/ProcessActivity/):
* The class [Examples/ProcessActivity/SimpleProcessActivity.java](./Examples/ProcessActivity/SimpleProcessActivity.java) implements a simple process activity.
* The class [Examples/ProcessActivity/SimpleResponsePayload.java](./Examples/ProcessActivity/SimpleResponsePayload.java) is a simple POJO used to return data.


# Allowed Innovation Studio Services
When creating a new process activity, you should use the Out Of The Box services provided in Innovation Studio SDK, the list is in the file [services.md](../Services/services-list.md).

