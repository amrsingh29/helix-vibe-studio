# Java Backend Services

## Overview

Innovation Studio backend extends the platform using Java 17 (OpenJDK), OSGi modules, JAX-RS for REST, Jackson for JSON, Spring for DI, and SLF4J for logging.

## Service Types

| Type | When to Use | Returns |
|------|-------------|---------|
| **Process Activity** | Business logic in BPMN processes, callable from rules | Response DTO |
| **REST API** | Custom endpoints for external/internal HTTP clients | JSON response |
| **Command** | Fire-and-forget operations | Status code |
| **DataPageQuery** | Custom paginated data sources | DataPage object |

## File Location

Java files go in `bundle/src/main/java/com/<group>/<app>/bundle/`:
- `*ProcessActivity.java` — Process activities
- `*ResponsePayload.java` — Response DTOs
- `*Rest.java` — REST API resources
- `MyApplication.java` — Bundle activator (register services here)

## Process Activity

### Template

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.Service;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.AuthorizationLevel;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.LicensingLevel;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import com.bmc.arsys.rx.application.common.ServiceLocator;
import org.springframework.transaction.annotation.Isolation;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class MyProcessActivity implements Service {

    @Action(name = "myAction", scope = Action.Scope.PUBLIC)
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AuthorizationLevel.ValidUser,
        licensing = LicensingLevel.Application,
        checkSchemaForSpecialAccess = true,
        promoteStructAdmin = true
    )
    public MyResponsePayload execute(
        @ActionParameter(name = "inputParam") @NotBlank @NotNull String inputParam
    ) {
        MyResponsePayload response = new MyResponsePayload();
        try {
            // Business logic here
            response.setSuccess(true);
            response.setResult("Processed: " + inputParam);
        } catch (Exception e) {
            ServiceLocator.getLogger().error("Error in myAction: " + e.getLocalizedMessage());
            response.setSuccess(false);
            response.setErrorMessage(e.getLocalizedMessage());
        }
        return response;
    }
}
```

### Response Payload Template

```java
package com.example.bundle;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MyResponsePayload {
    @JsonProperty
    private boolean success;

    @JsonProperty
    private String result;

    @JsonProperty
    private String errorMessage;

    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
```

## REST API

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.common.RestfulResource;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("myapi")
public class MyRestApi implements RestfulResource {

    // URL: /api/<bundleId>/myapi/endpoint/{param}
    @GET
    @Path("/endpoint/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AccessControlledMethod.AuthorizationLevel.ValidUser,
        licensing = AccessControlledMethod.LicensingLevel.Application
    )
    public MyResponsePayload getEndpoint(@PathParam("param") String param) {
        // Business logic
        return new MyResponsePayload();
    }
}
```

## Command

See `.cursor/_instructions/Java/ObjectTypes/command.md` for command implementation details.

## DataPageQuery

See `.cursor/_instructions/Java/ObjectTypes/datapagequery.md` for custom data source implementation.

## Service Registration

**File**: `MyApplication.java` — add in `register()` method, BEFORE `registerStaticWebResource()`:

```java
registerService(new MyProcessActivity());
registerService(new MyRestApi());
```

Do NOT remove existing registrations or commented code.

## Available Platform Services

| Service | Entry Point | Purpose |
|---------|-------------|---------|
| RecordService | `com.bmc.arsys.rx.services.record.RecordService` | CRUD on record instances |
| CacheService | `com.bmc.arsys.rx.services.cache.CacheService` | Bundle-scoped caching |
| Logger | `ServiceLocator.getLogger()` | Logging |

See `.cursor/_instructions/Java/Services/records.md` and `.cursor/_instructions/Java/Services/cache.md` for details.

## Third-Party Libraries

- Add Maven dependencies to `/bundle/pom.xml`
- Must be compatible with OpenJDK 17
- No GPL-licensed libraries
- Add `Embed-Transitive=true` to `maven-bundle-plugin` for OSGi embedding:

```xml
<plugin>
  <groupId>org.apache.felix</groupId>
  <artifactId>maven-bundle-plugin</artifactId>
  <configuration>
    <instructions>
      <Embed-Dependency>*;scope=compile|runtime</Embed-Dependency>
      <Embed-Transitive>true</Embed-Transitive>
    </instructions>
  </configuration>
</plugin>
```

## NPM Third-Party Libraries (Frontend)

- Add to `/bundle/src/main/webapp/libs/<application-name>/package.json` (NOT the root `package.json`)
- Must be compatible with Angular 18.x, TypeScript 5.5.4, RxJS 7.8.1
- Avoid pure JavaScript libraries without TypeScript types
- No GPL-licensed libraries

## Key Rules

- **@RxDefinitionTransactional** — Only on REST endpoints, NOT on internal services called by Rules/Processes
- **Dates** — Always epoch milliseconds (`System.currentTimeMillis()`), never ISO 8601
- **Required fields** — Always set Status (field 7) and Description (field 8) on record creation
- **Attachments** — Persist AFTER parent record creation, never before
- **No threads** — Code must be synchronous; no `Thread`, `sleep`, `synchronized`
- **No file I/O** — Don't read/write filesystem; use RecordService for persistence
- **No static state** — Write stateless code; use CacheService for caching
- **Error handling** — Always log exceptions via `ServiceLocator.getLogger()`, never swallow
