# Definition
Innovation Studio is a production from BMC Helix.  
When End Users want a third party system to interact with Innovation Studio Business Processes, they can use the Innovation Studio REST API, however those are very generic, and might expose more than anticipated, or might be harder to use.
The Innovation Studio SDK allows End Users to create custom REST API endpoints, in Java.  
The Rest Api in itself leverages standard `javax.ws.rs` library.  


# Rest API
You can create a Java class implementing `RestfulResource` from `com.bmc.arsys.rx.services.common.RestfulResource`. This class can contains multiple methods, each one of them can be a rest api endpoint.  
You must defined the main rest api path, using the `@Path` decorator from `javax.ws.rs.Path`, for example:
```java
import com.bmc.arsys.rx.services.common.RestfulResource;
import javax.ws.rs.Path;

/**
 * Custom Rest Api used in the view component example "generate-password".
 *
 * REST root url:
 * http{s}://{server}:{port}/api/<bundleId>/simplerestcall
 */
@Path("simplerestcall")
public class SimpleRest implements RestfulResource {
}
```

Each rest endpoint is a class method that needs to be decorated using `javax.ws.rs` method and path decorators.  
The rest endpoint can have different HTTP methods, such as `GET`, `POST`, `PUT`, `DELETE` etc..., input parameters, and return types.  
This is standard JAX-RS development.  
As a rule of thumb, some Innovation Studio decorators `@RxDefinitionTransactional` and `@AccessControlledMethod` need to be added as well, to let the method access record instances.  
For example:
```java
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
// ...
/**
 * @return SimpleResponsePayload    (JSON)      SimpleResponsePayload object in JSON format.
 * Url to call:
 * http{s}://{server}:{port}/api/<bundleId>/simplerestcall/generatepassword/{userName}
 * @summary Returns a SimpleResponsePayload object.
 * @statuscode 200 If the fetch is successful.
 */
@GET
@Path("/generatepassword/{userName}")
@RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
@AccessControlledMethod(authorization = AccessControlledMethod.AuthorizationLevel.ValidUser, licensing = AccessControlledMethod.LicensingLevel.Application)
@Produces(MediaType.APPLICATION_JSON)
public SimpleResponsePayload generateReportEvents(@PathParam("userName") String userName) {
  SimpleResponsePayload simpleResponsePayload = new SimpleResponsePayload();

  simpleResponsePayload.setUserName(userName);
  simpleResponsePayload.setPassword(userName + " fooBar");

  return simpleResponsePayload;
}
```

# Code location
The class should be created in the /bundle/src/main/java folder.


# Special instructions
Be careful of the class package name, it should be the one from the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`


# Registration
You need to declare the class in the file `/bundle/src/main/java/com/example/bundle/MyApplication.java` in its `register()` method, leveraging the `registerRestfulResource()` method, for example:
```java
    protected void register() {
        //
        // TODO: Register static web resources and framework extensions.
        //
        // registerService(new MyService());
        //

        // Registering custom rest apis.
        registerRestfulResource(new SimpleRest());

        registerStaticWebResource(String.format("/%s", getId()), "/webapp");
    }
```


# Example:
You can find an example of implementation in the folder [Examples/RestApi](./Examples/RestApi/):
* The class [Examples/RestApi/SimpleRest.java](./Examples/RestApi/SimpleRest.java) implements a simple rest api endpoint that generates a password based on a user name.
* The class [Examples/RestApi/SimpleResponsePayload.java](./Examples/RestApi/SimpleResponsePayload.java) is a simple POJO used to return data in JSON format.


# Allowed Innovation Studio Services
When creating a new Rest Api, you should use the Out Of The Box services provided in Innovation Studio SDK, the list is in the file [services.md](../Services/services-list.md).

