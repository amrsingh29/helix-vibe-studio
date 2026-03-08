# BMC Helix Innovation Studio - Java Backend Development Guide

## Overview

BMC Helix Innovation Studio allows developers to extend business process capabilities using Java code. This guide covers all Java-based extensions including Process Activities, REST APIs, Commands, DataPageQueries, and core services.

---

## Important Concepts

### Bundle and Bundle ID

A **bundle** is an Innovation Studio application package containing custom Java code and configurations.

**Bundle ID Format:**
```
<groupId>.<artifactId>
```

**Example from `/bundle/pom.xml`:**
```xml
<groupId>com.example</groupId>
<artifactId>sample-application</artifactId>
```
**Resulting bundleId:** `com.example.sample-application`

**Bundle ID Usage:**
- Identify record definitions: `<bundleId>:<recordDefinitionName>`
- Configure caching services
- Register REST API endpoints: `http{s}://{server}:{port}/api/<bundleId>/<your-path>`

---

## Technology Stack

- **Java Version**: OpenJDK 17
- **Module System**: OSGi
- **REST APIs**: JAX-RS (javax.ws.rs)
- **JSON**: Jackson for serialization/deserialization
- **Dependency Injection**: Spring Framework 5.3.42
- **Logging**: SLF4J
- **Transactions**: Spring @Transactional

---

## Java Extension Types

### 1. Process Activities

Custom BPMN process activities that execute business logic within workflows.

**When to Use:**
- Execute business logic within a BPMN process
- Perform operations as part of a workflow
- Create reusable logic callable from multiple processes
- Return data to the process for decision-making

**Implementation:**

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.Service;
import com.bmc.arsys.rx.services.common.domain.Scope;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SimpleProcessActivity implements Service {
    /**
     * Process activity that generates a password.
     * 
     * @param userName the user name (must not be empty)
     * @return SimpleResponsePayload object with username and password
     */
    @Action(name = "generatePassword", scope = Scope.PUBLIC)
    public SimpleResponsePayload generatePassword(
            @ActionParameter(name = "userName") @NotBlank @NotNull String userName) {
        SimpleResponsePayload response = new SimpleResponsePayload();
        response.setUserName(userName);
        response.setPassword(userName + "_generated_password");
        return response;
    }
}
```

**Response Payload Example:**

```java
package com.example.bundle;

import com.fasterxml.jackson.annotation.JsonProperty;

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

**Scope Options:**
- `Scope.PUBLIC` - All applications can use it
- `Scope.BUNDLE` - Only current bundle can use it

---

### 2. REST APIs

Custom REST API endpoints for external system integration.

**When to Use:**
- Expose functionality to external systems or clients
- Create custom APIs more specific than generic Innovation Studio APIs
- Control exactly what data is exposed and how
- Integrate Innovation Studio with other applications

**Implementation:**

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.common.RestfulResource;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Custom Rest Api
 * 
 * REST root url:
 * http{s}://{server}:{port}/api/<bundleId>/simplerestcall
 */
@Path("simplerestcall")
public class SimpleRest implements RestfulResource {
    /**
     * Generate password endpoint
     * 
     * URL: http{s}://{server}:{port}/api/<bundleId>/simplerestcall/generatepassword/{userName}
     * 
     * @param userName the username
     * @return SimpleResponsePayload object in JSON format
     */
    @GET
    @Path("/generatepassword/{userName}")
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AccessControlledMethod.AuthorizationLevel.ValidUser, 
        licensing = AccessControlledMethod.LicensingLevel.Application
    )
    @Produces(MediaType.APPLICATION_JSON)
    public SimpleResponsePayload generatePassword(@PathParam("userName") String userName) {
        SimpleResponsePayload response = new SimpleResponsePayload();
        response.setUserName(userName);
        response.setPassword(userName + " fooBar");
        return response;
    }
}
```

**HTTP Methods Supported:**
- `@GET` - Retrieve data
- `@POST` - Create data
- `@PUT` - Update data
- `@DELETE` - Delete data

---

### 3. Commands

"Fire and forget" operations that execute without returning data.

**When to Use:**
- Trigger operations that don't need to return data
- Simple actions that don't fit REST API pattern
- Legacy integrations or specific command pattern use cases
- **Note:** REST APIs are generally preferred over commands

**Implementation:**

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

public class SimpleCommand extends Command {
    // Input parameters
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Execute method
    @Override
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AuthorizationLevel.ValidUser, 
        licensing = LicensingLevel.Application, 
        checkSchemaForSpecialAccess = true, 
        promoteStructAdmin = true
    )
    public URI execute(UriInfo arg0) {
        System.out.println("Executing command with username=" + getUsername() + ", password=" + getPassword());
        return null;
    }
}
```

---

### 4. DataPageQuery

Custom data queries from various sources with pagination support.

**When to Use:**
- Query data from external data sources (not Innovation Studio records)
- Transform or aggregate data before returning
- Implement custom pagination or filtering logic
- Create reusable queries consumed by REST APIs or other components

**Implementation:**

```java
package com.example.bundle;

import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQuery;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;
import com.bmc.arsys.rx.services.common.QueryPredicate;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Custom DataPageQuery
 * 
 * Query name: com.example.bundle.SimpleDataPageQuery
 */
public class SimpleDataPageQuery extends DataPageQuery {
    private int pageSize = 50;
    private int startIndex = 0;

    // Constructor - collect parameters
    public SimpleDataPageQuery(DataPageQueryParameters dataPageQueryParameters) {
        super(dataPageQueryParameters);
        
        // Get standard parameters
        pageSize = dataPageQueryParameters.getPageSize();
        startIndex = dataPageQueryParameters.getStartIndex();
    }

    /**
     * Helper method to extract parameter values from query predicates
     */
    private String getParameterValue(String key) {
        Map<String, QueryPredicate> predicates = getDataPageQueryParameters().getQueryPredicatesByName();
        
        if (predicates == null) {
            return null;
        }
        
        QueryPredicate predicate = predicates.get(key);
        
        if (predicate == null) {
            return null;
        }
        
        return predicate.getRightOperand();
    }

    @Override
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(
        authorization = AccessControlledMethod.AuthorizationLevel.SubAdministrator, 
        licensing = AccessControlledMethod.LicensingLevel.Application, 
        checkSchemaForSpecialAccess = true, 
        promoteStructAdmin = true
    )
    public DataPage execute() {
        List<Fruit> fruitList = new ArrayList<>();

        // Create sample data
        Fruit banana = new Fruit();
        banana.setFruit("Banana");
        banana.setDisplayId("Banana");
        banana.setGuid("Banana");
        banana.setPrice("1$");
        
        Fruit apple = new Fruit();
        apple.setFruit("Apple");
        apple.setDisplayId("Apple");
        apple.setGuid("Apple");
        apple.setPrice("2$");
        
        fruitList.add(banana);
        fruitList.add(apple);

        // Return DataPage with size and data
        return new DataPage(fruitList.size(), fruitList);
    }
}
```

**Data Object Example:**

```java
package com.example.bundle;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Fruit {
    @JsonProperty
    private String fruit;
    @JsonProperty
    private String price;
    @JsonProperty
    private String displayId;
    @JsonProperty
    private String guid;

    // Getters and Setters
    public String getFruit() {
        return fruit;
    }

    public void setFruit(String fruit) {
        this.fruit = fruit;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDisplayId() {
        return displayId;
    }

    public void setDisplayId(String displayId) {
        this.displayId = displayId;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }
}
```

**Available DataPageQueryParameters:**
- `dataPageType` - Query type name (e.g., `com.example.bundle.SimpleDataPageQuery`)
- `pageSize` - Number of records to fetch (use `-1` or `DataPage.INFINITE_PAGE_SIZE` for all)
- `startIndex` - Starting index for pagination (0-based)
- `queryExpression` - Qualification expression for filtering
- `sortBy` - Comma-separated field IDs for sorting (prefix with `-` for descending)
- `recorddefinition` - Fully qualified record definition name
- `propertySelection` - Comma-separated field IDs to fetch

---

## Core Services

### RecordService

Service for CRUD operations on Innovation Studio records.

**Entry Point:** `com.bmc.arsys.rx.services.record.RecordService`

**Record Definition Format:**
```
<bundleId>:<recordDefinitionName>
```

**Example:** `com.example.sample-application:Restaurant`

#### 1. Get RecordService

```java
import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.record.RecordService;

RecordService recordService = ServiceLocator.getRecordService();
```

#### 2. Get Record Instance

```java
import com.bmc.arsys.rx.services.record.domain.RecordInstance;

RecordInstance recordInstance = recordService.getRecordInstance(
    "<recordDefinitionName>", 
    "<recordInstanceId>"
);

// Get field value
String value = recordInstance.getFieldValue(<fieldId>);
```

#### 3. Create Record Instance

```java
import com.bmc.arsys.rx.services.record.domain.RecordInstance;

RecordInstance recordInstance = new RecordInstance();
recordInstance.setRecordDefinitionName("com.example.sample-application:Restaurant");

// Set field values
recordInstance.setFieldValue(8, "Description value");
recordInstance.setFieldValue(536870913, "Name value");

// Persist
recordService.createRecordInstance(recordInstance);

// Get the newly created record instance ID
String recordInstanceId = recordInstance.getId();
```

**CRITICAL:** All REQUIRED fields must have values. Check field definitions in `.def` files for:
- `"fieldOption" : "REQUIRED"` - Field is required
- `"defaultValue" : "0"` - Default value if exists

**Alternative: Using FieldInstance/FieldDefinition Pattern**

For more control over record creation (e.g., when working with field definitions directly):

```java
import com.bmc.arsys.rx.services.record.domain.FieldDefinition;
import com.bmc.arsys.rx.services.record.domain.FieldInstance;
import com.bmc.arsys.rx.services.record.domain.RecordDefinition;

RecordDefinition recordDef = recordService.getRecordDefinition(RECORD_DEFINITION_NAME);
RecordInstance recordInstance = new RecordInstance();
recordInstance.setRecordDefinitionName(RECORD_DEFINITION_NAME);

// Helper to add field by ID using definition metadata
FieldDefinition<?> fieldDef = recordDef.getFieldDefinitionById(fieldId);
FieldInstance fieldInstance = new FieldInstance();
fieldInstance.setId(fieldId);
fieldInstance.setValue("some value");
recordInstance.getFieldInstances().put(fieldDef.getId(), fieldInstance);

recordService.createRecordInstance(recordInstance);
```

#### 4. Update Record Instance

```java
// Fetch record instance
RecordInstance recordInstance = recordService.getRecordInstance(
    "<recordDefinitionName>", 
    "<recordInstanceId>"
);

// Modify field value
recordInstance.setFieldValue(<fieldId>, "new value");

// Persist changes
recordService.updateRecordInstance(recordInstance);
```

#### 5. Delete Record Instance

```java
recordService.deleteRecordInstance("<recordDefinitionName>", "<recordInstanceId>");
```

#### 6. Query Multiple Record Instances

```java
import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Build query parameters
Map<String, List<String>> dataPageParams = new HashMap<>();

// DataPageQuery type
dataPageParams.put("dataPageType", 
    new ArrayList<>(Arrays.asList("com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery")));

// Page size
dataPageParams.put("pageSize", new ArrayList<>(Arrays.asList("50")));

// Fields to fetch
List<String> propertySelections = new ArrayList<>();
propertySelections.add("379"); // GUID field
propertySelections.add("8");   // Description field
dataPageParams.put("propertySelection", new ArrayList<>(propertySelections));

// Record definition
dataPageParams.put("recorddefinition", 
    new ArrayList<>(Arrays.asList("com.example.sample-application:Restaurant")));

// Start index
dataPageParams.put("startIndex", new ArrayList<>(Arrays.asList("0")));

// Qualification (filter)
String qualification = "'8' = \"foo\"";
dataPageParams.put("queryExpression", new ArrayList<>(Arrays.asList(qualification)));

// Create parameters object
DataPageQueryParameters queryParams = new DataPageQueryParameters(dataPageParams);

// Execute query
DataPage result = recordService.getRecordInstancesByIdDataPage(queryParams);

// Process results
List<?> records = result.getData();
for (Object record : records) {
    HashMap<String, Object> mappedRecord = (HashMap<String, Object>) record;
    String recordInstanceGuid = mappedRecord.get("379").toString();
    String description = mappedRecord.get("8").toString();
}
```

#### 7. Get Attachment

```java
import com.bmc.arsys.rx.services.record.domain.Attachment;

Attachment attachment = recordService.getAttachment(
    "<recordDefinitionName>", 
    "<recordInstanceId>", 
    "<attachmentFieldId>"
);

// Get attachment properties
String filename = attachment.getFileName();
byte[] content = attachment.getBinaryData();
```

#### 8. Create Attachment

```java
import com.bmc.arsys.rx.services.record.domain.Attachment;
import java.util.Base64;

// Convert base64 to bytes
byte[] decompressedBytes = Base64.getDecoder().decode(base64String);

// Create attachment
Attachment newAttachment = new Attachment(
    "<recordDefinitionName>",     // Fully qualified name
    "<recordInstanceId>",          // Record instance ID
    "my-picture.png",              // Filename
    Integer.parseInt("<fieldId>"), // Attachment field ID
    decompressedBytes              // Bytes content
);

// Persist attachment
recordService.persistAttachment(newAttachment);
```

**Attachment Filename Gotcha:**
The attachment filename may include a MediaType suffix. Strip it before using:

```java
String fileName = attachment.getFileName();
String[] parts = fileName.split(",MediaType");
fileName = parts[0];
```

**Common Field IDs:**
- `1` - Request ID (unique record identifier)
- `2` - Submitter
- `3` - Create Date
- `5` - Last Modified By
- `6` - Modified Date
- `7` - Status
- `8` - Short Description
- `16` - Status History
- `379` - GUID (RecordInstance.RECORD_ID_FIELD_ID)

**Useful Constants:**
- `RecordInstance.RECORD_ID_FIELD_ID` — use instead of hardcoding `379` for the GUID field
- `DataPage.INFINITE_PAGE_SIZE` — pass as `pageSize` to fetch all records without limit

---

### CacheService

Service for storing and retrieving data in memory cache.

**Entry Point:** `com.bmc.arsys.rx.services.cache.CacheService`

**Important:** Cache is bundle-specific. Always initialize for your bundle.

#### Initialize Cache

```java
import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.cache.CacheService;
import com.bmc.arsys.rx.services.cache.CacheConfiguration;

public class BundleCache implements Service {
    // Bundle ID from pom.xml
    public static final String BUNDLE_ID = "com.example.sample-application";
    private final CacheService cacheService = ServiceLocator.getCacheService();

    private void initializeBundleCache() {
        if (!cacheService.cacheExists(BUNDLE_ID)) {
            cacheService.createCache(new CacheConfiguration(BUNDLE_ID));
        }
    }
}
```

#### Store Data in Cache

```java
import com.bmc.arsys.rx.services.cache.Cacheable;

// Create cacheable object
CacheableString cacheableString = new CacheableString(key, value);

// Delete if exists (to avoid exception)
if (cacheService.get(BUNDLE_ID, cacheableString.getId()) != null) {
    cacheService.delete(BUNDLE_ID, cacheableString.getId());
}

// Store in cache
cacheService.create(BUNDLE_ID, cacheableString);
```

#### Retrieve Data from Cache

```java
import com.bmc.arsys.rx.services.cache.Cacheable;

Cacheable cacheableObject = cacheService.get(BUNDLE_ID, key);

if (cacheableObject instanceof CacheableString) {
    String value = ((CacheableString) cacheableObject).getValue();
}
```

#### Implementing a Cacheable Object

The cache service requires objects that implement `Cacheable`. You cannot store raw Strings directly — you need a wrapper class:

```java
import com.bmc.arsys.rx.services.cache.Cacheable;

public class CacheableString implements Cacheable {
    private String id;
    private String value;

    public CacheableString(String id, String value) {
        this.id = id;
        this.value = value;
    }

    @Override
    public String getId() {
        return id;
    }

    public String getValue() {
        return value;
    }
}
```

#### Delete Cache Entry

```java
cacheService.delete(BUNDLE_ID, key);
```

#### Delete All Cache Entries

```java
cacheService.deleteAll(BUNDLE_ID);
```

#### Reset Cache

```java
cacheService.resetCache(BUNDLE_ID);
```

---

### Logger Service

Service for writing logs to Innovation Studio logs.

**Entry Point:** `ServiceLocator.getLogger()`

#### Log Levels

```java
import com.bmc.arsys.rx.application.common.ServiceLocator;

// Debug level
ServiceLocator.getLogger().debug("Debug message");

// Info level
ServiceLocator.getLogger().info("Info message");

// Warning level
ServiceLocator.getLogger().warn("Warning message");

// Error level
ServiceLocator.getLogger().error("Error message");
```

#### Exception Handling

```java
import com.bmc.arsys.rx.services.RxException;
import com.bmc.arsys.rx.application.common.ServiceLocator;

try {
    // Code that may throw exception
} catch (RxException e) {
    ServiceLocator.getLogger().error("Error occurred: " + e.getLocalizedMessage());
}
```

---

## Qualification / Expression Building

Qualifications filter data in BPMN processes and Java code (similar to SQL WHERE clause).

### Expression Structure

- **Left-hand side:** Field ID in single quotes (e.g., `'7'`)
- **Right-hand side:** Value, constant, or field reference

### Operators

**Comparison:**
- `=` (equals)
- `>` (greater than)
- `>=` (greater than or equal)
- `<` (less than)
- `<=` (less than or equal)
- `!=` (not equal)
- `LIKE` (pattern matching with `%` wildcard)

**Logical:**
- `AND`
- `OR`
- `NOT`

**Mathematical:**
- `+` (addition)
- `-` (subtraction)
- `*` (multiplication)
- `/` (division)

**Constants:**
- `NULL`

**Grouping:**
- `(` and `)` for precedence

### Syntax Rules

| Use Case | Syntax | Example |
|----------|--------|---------|
| Search by field ID | `'<fieldId>' = <value>` | `'7' = "New York"` |
| Use another field value | `'<fieldId>' = $<otherFieldId>$` | `'7' = $8$` |
| Use constant | `'<fieldId>' = <CONSTANT>` | `'7' = NULL` |
| Use text value | `'<fieldId>' = "<text>"` | `'7' = "New York"` |
| Use numeric value | `'<fieldId>' = <number>` | `'7' = 42` |
| Use enum/selection value | `'<fieldId>' = <integer>` | `'7' = 0` |

### Examples

**Simple equality:**
```
'8' = "foo"
```

**Multiple conditions:**
```
'8' = "foo" AND '7' > 100
```

**OR operator:**
```
'7' = "New York" OR '7' = "Boston"
```

**Compare two fields:**
```
'7' = $8$
```

**Check for null:**
```
'7' = NULL
```

**Pattern matching (starts with):**
```
'8' LIKE "foo%"
```

**Pattern matching (ends with):**
```
'8' LIKE "%foo"
```

**Pattern matching (contains) - avoid if possible:**
```
'8' LIKE "%foo%"
```

**Complex expression:**
```
('7' = "New York" AND '8' = "Temperature type") OR ('7' = "Santa Clara")
```

---

## Getting Record Definitions

Record definitions are stored in `/package/src/main/definitions/db/record/` as `.def` files.

### Reading .def Files

.def files are JSON formatted with line prefixes that need to be removed.

**Structure:**
```
begin record definition
   name           : com.example.sample-application:Restaurant
   definition     : {
   definition     :   "resourceType" : "com.bmc.arsys.rx.services.record.domain.RegularRecordDefinition",
   definition     :   "fieldDefinitions" : [ {
   definition     :     "id" : 7,
   definition     :     "name" : "Status",
   definition     :     "resourceType" : "com.bmc.arsys.rx.standardlib.record.SelectionFieldDefinition",
   definition     :     "fieldOption" : "REQUIRED",
   definition     :     "defaultValue" : "0",
   definition     :     "optionNamesById" : {
   definition     :       "0" : "New",
   definition     :       "1" : "Assigned"
   definition     :     }
   definition     :   } ]
   definition     : }
end
```

### Important Field Properties

- `id` - Unique integer identifier (field ID)
- `name` - Field name
- `resourceType` - Data type (String, Integer, Selection, etc.)
- `fieldOption` - `REQUIRED` or `OPTIONAL`
- `defaultValue` - Default value if exists
- `optionNamesById` - For selection fields, maps integer IDs to text values

---

## Using Process Activities in Process Designer

After deploying a process activity, use it in a BPMN process:

1. Open **Process Designer** in BMC Helix Innovation Studio
2. Create or edit a process definition
3. Add a **Service Activity** to the process flow
4. In the activity configuration, select your custom service (the `@Action` name)
5. Map input parameters from process variables or constants
6. Map output fields to process variables for downstream use
7. Save and test the process

**Input/Output Mapping Example:**
For a calculator activity with `@Action(name = "calculate")`:
- **Input**: Map `input1` to process variable or constant `3`, `input2` to `4`, `operation` to `"Add"`
- **Output**: Map `result` to store in process variable, `success` for error branching, `errorMessage` for error handling

**Testing Tips:**
- Test all edge cases (e.g., division by zero, null inputs)
- Use the `success` output field for Exclusive Gateway branching
- Check server logs (`ServiceLocator.getLogger()`) if activity fails silently

---

## Registration

All custom Java classes must be registered in `/bundle/src/main/java/com/example/bundle/MyApplication.java`.

### Registration Examples

```java
protected void register() {
    // Register Process Activity (Service)
    registerService(new SimpleProcessActivity());
    
    // Register REST API
    registerRestfulResource(new SimpleRest());
    
    // Register Command
    registerClass(SimpleCommand.class);
    
    // Register DataPageQuery
    registerClass(SimpleDataPageQuery.class);
    
    // Register static web resources
    registerStaticWebResource(String.format("/%s", getId()), "/webapp");
}
```

---

## Required Decorators

### @RxDefinitionTransactional

Enables transactional behavior for data access methods.

**Parameters:**
- `readOnly = true` - For read operations
- `readOnly = false` - For write operations (create/update/delete)
- `isolation = Isolation.DEFAULT` - Transaction isolation level
- `rollbackFor = Exception.class` - Rollback on exceptions

**Import:**
```java
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
```

### @AccessControlledMethod

Enforces security and licensing checks.

**Parameters:**
- `authorization` - Authorization level (e.g., `AuthorizationLevel.ValidUser`, `AuthorizationLevel.SubAdministrator`)
- `licensing` - Licensing level (e.g., `LicensingLevel.Application`)
- `checkSchemaForSpecialAccess = true` - For operations modifying data
- `promoteStructAdmin = true` - For operations modifying data

**Import:**
```java
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.AuthorizationLevel;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod.LicensingLevel;
```

---

## Best Practices

### DO

1. **Use Core Platform Services:** Leverage RecordService, CacheService, Logger
2. **Follow Java Conventions:** Use standard Java coding practices
3. **Use Compatible Java Features:** OpenJDK 17 compatible features only
4. **Log Errors Appropriately:** Use debug level logging for troubleshooting
5. **Use RecordService for Data:** Including attachment fields
6. **Break Long Operations:** Avoid long-running code; break into smaller actions
7. **Always Use Decorators:** `@RxDefinitionTransactional` and `@AccessControlledMethod` for data access
8. **Use Cache Service:** For memory management (don't create custom caching)
9. **Handle Exceptions:** Never swallow exceptions without logging
10. **Use Standard Tech Stack:** Jackson for JSON, SLF4J for logging, Spring for DI

### DON'T

1. **Don't Introduce New Stack Elements:** No additional databases, job schedulers, or caching frameworks
2. **Don't Affect Tech Stack Config:** Don't modify Jersey, Spring, OSGi, or Jetty configurations
3. **Don't Create Cross-Cutting Code:** No aspects, servlets, filters, or interceptors
4. **Don't Use Core AR-API:** Don't use Developer Studio for Forms and Workflow
5. **Don't Swallow Exceptions:** Always log exceptions
6. **Don't Store Data on Filesystem:** Filesystem might be read-only
7. **Don't Use File I/O:** For resources, configuration, or any purpose
8. **Don't Create Threads:** Code should be synchronous
9. **Don't Use Thread Synchronization:** No `synchronized`, `sleep()`, or threading APIs
10. **Don't Block Threads:** Avoid long-running operations or nested loops with unknown iterations
11. **Don't Share Data Across Threads:** Write stateless code
12. **Don't Use Static Variables:** For storing data
13. **Don't Create Member Variables:** For services or JAX-RS resources
14. **Don't Store in Thread Local:** Threads are not allocated to specific tenants
15. **Don't Create Custom Servlets:** Use standard JAX-RS techniques
16. **Don't Create Custom Security:** Use platform security mechanisms
17. **Don't Attempt Authorization Impersonation:** Don't change security context
18. **Don't Use GPL Libraries:** Avoid GPL, LGPL licensed libraries

### MyApplication.java Rules

- **Don't modify existing imports** - Even if unused
- **Don't remove commented code** - It's documentation for developers

---

## Code Location

All Java classes should be created in `/bundle/src/main/java/` folder.

**Package Name:** Must match the package from `/bundle/src/main/java/com/example/bundle/MyApplication.java`

---

## Third-Party Libraries

### Adding Dependencies

Add to `/bundle/pom.xml`:

```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>example-library</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Guidelines

- Use Java 17 compatible libraries
- Avoid too many dependencies (increases package size)
- Prefer libraries already used by Innovation Studio
- Check `/bundle/pom.xml` and `/pom.xml` for existing versions
- **Never use GPL/LGPL licensed libraries** - Not allowed in BMC Helix Agreement

---

## Troubleshooting

### Process Activity Not Visible in Process Designer

**Problem:** After deploying a process activity, it doesn't appear in Process Designer.

**Root Cause:** Process activities must be explicitly registered in `MyApplication.java` using `registerService()`.

**Solution:**

1. **Check Registration in MyApplication.java:**

```java
@Override
protected void register() {
    // Register your process activity
    registerService(new YourProcessActivity());
    
    // Register other services
    registerService(new AnotherProcessActivity());
    
    registerStaticWebResource(String.format("/%s", getId()), "/webapp");
}
```

2. **Rebuild and Redeploy:**

```bash
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app && mvn clean install -Pdeploy -DskipTests"
```

3. **Verify Deployment Status:**
   - Look for `Final Status:Deployed` in the Maven output
   - Check the deployment status URI provided in the logs

4. **Clear Browser Cache:**
   - **Windows/Linux:** `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`
   - **DevTools:** Right-click refresh > "Empty Cache and Hard Reload"

5. **Logout and Login:**
   - Sign out of BMC Helix Innovation Studio
   - Sign back in to refresh the session

6. **Verify Bundle Status:**
   - Go to **Administration > Bundle Management**
   - Verify your bundle (e.g., `com.mycompany.sample-app`) is **Active**
   - If not active, activate it manually

7. **Check Server Logs:**
   - Look for any errors during bundle initialization
   - Check for class loading or dependency issues

**Common Mistakes:**

- Forgot to add `registerService(new YourProcessActivity())` in `MyApplication.java`
- Typo in the class name during registration
- Process activity class doesn't implement `Service` interface
- Missing `@Action` annotation on the method
- Method doesn't have `scope = Scope.PUBLIC` in `@Action` annotation

---

### Build Failures

**Problem:** Maven build fails with compilation errors.

**Common Causes and Solutions:**

1. **Missing Dependencies:**
   - Check `/bundle/pom.xml` for required dependencies
   - Ensure BMC Helix SDK dependencies are present

2. **Import Errors:**
   - Verify all imports are correct
   - Check that you're using the correct package names

3. **Java Version Mismatch:**
   - Ensure code is compatible with OpenJDK 17
   - Avoid using features from newer Java versions

4. **Frontend Build Errors:**
   - Check `/bundle/src/main/webapp` for Angular build issues
   - Run `npm install` if dependencies are missing

**Solution:**

```bash
# Clean build
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app && mvn clean"

# Rebuild
docker exec bmc-helix-innovation-studio bash -c "cd /workspace/sample-app && mvn clean install -DskipTests"
```

---

### Deployment Failures

**Problem:** Deployment fails or shows errors.

**Troubleshooting Steps:**

1. **Check Deployment Status:**
   - Look for the status URI in Maven output
   - Access the URI in a browser (must be logged in)

2. **Verify Package Contents:**
   - Check `/package/target/` for the generated ZIP file
   - Ensure it contains all necessary files

3. **Check Server Connectivity:**
   - Verify the `webUrl` in `/pom.xml` is correct
   - Ensure credentials are valid

4. **Review Server Logs:**
   - Check Innovation Studio server logs for errors
   - Look for bundle activation failures

5. **Verify Definition Files:**
   - Check `/package/src/main/definitions/` for valid definition files
   - Ensure no syntax errors in JSON definitions

**Common Issues:**

- Invalid credentials in `/pom.xml`
- Server URL is incorrect or unreachable
- Bundle ID conflicts with existing bundle
- Invalid definition files (syntax errors)

---

### Process Activity Runtime Errors

**Problem:** Process activity throws errors during execution.

**Debugging Steps:**

1. **Check Logs:**

```java
ServiceLocator.getLogger().error("Error message: " + e.getMessage(), e);
ServiceLocator.getLogger().info("Debug info: " + someVariable);
```

2. **Verify Input Parameters:**
   - Check that all required parameters are provided
   - Validate parameter types match expectations
   - Use `@NotNull` and `@NotBlank` annotations

3. **Test Field IDs:**
   - Verify field IDs are correct for your environment
   - Field IDs may differ between environments
   - Use Record Definition Inspector to find correct IDs

4. **Check Record Definitions:**
   - Ensure record definitions exist
   - Verify record definition names are correct
   - Check permissions on record definitions

5. **Validate Qualifications:**
   - Test qualification strings separately
   - Ensure field IDs in qualifications are correct
   - Check for proper escaping of special characters

**Common Runtime Errors:**

```java
// Error: NullPointerException
// Solution: Check for null before accessing
if (record.get(fieldId) != null) {
    String value = record.get(fieldId).toString();
}

// Error: ClassCastException
// Solution: Use proper casting with type checking
Object obj = record.get(fieldId);
if (obj instanceof String) {
    String value = (String) obj;
}

// Error: Record not found
// Solution: Check qualification and record existence
String qualification = "'" + FIELD_ID + "' = \"" + value + "\"";
// Verify the qualification returns results
```

---

### REST API Not Accessible

**Problem:** Custom REST API endpoints return 404 or are not accessible.

**Solution:**

1. **Verify Registration:**

```java
@Override
protected void register() {
    registerService(new YourRestApiClass());
}
```

2. **Check Path Annotation:**

```java
@Path("your-path")  // Correct
// URL will be: /api/com.mycompany.sample-app/your-path
```

3. **Verify HTTP Method:**

```java
@GET  // or @POST, @PUT, @DELETE
@Path("/endpoint")
```

4. **Check MediaType:**

```java
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
```

5. **Test URL Format:**

```
https://your-server/api/<bundleId>/<your-path>
Example: https://server/api/com.mycompany.sample-app/your-path
```

---

### Data Query Issues

**Problem:** DataPage queries return no results or incorrect data.

**Troubleshooting:**

1. **Verify Record Definition Name:**

```java
String recordDef = "HPD:Help Desk";  // Must match exactly
```

2. **Check Field IDs:**

```java
// Use correct field IDs for your environment
String FIELD_ID = "1000000161";  // Verify in Record Definition
```

3. **Test Qualification:**

```java
// Simple qualification
String qual = "'1000000161' = \"INC000000000001\"";

// Multiple conditions
String qual = "'1000000161' = \"INC000000000001\" AND '7' = \"Assigned\"";

// LIKE operator
String qual = "'1000000161' LIKE \"%INC%\"";
```

4. **Check Property Selection:**

```java
// Include all required fields
propertySelections.add("1");      // Request ID
propertySelections.add("1000000161");  // Your field
```

5. **Verify Permissions:**
   - Ensure user has read access to the record definition
   - Check field-level permissions

---

### Cache Service Issues

**Problem:** Cache not working or returning stale data.

**Solution:**

1. **Verify Cache Configuration:**

```java
CacheConfiguration config = new CacheConfiguration();
config.setBundleId("com.mycompany.sample-app");
config.setCacheName("my-cache");
config.setTimeToLive(3600);  // 1 hour
```

2. **Check Cache Operations:**

```java
// Put
cacheService.put(config, key, value);

// Get
Object value = cacheService.get(config, key);

// Remove
cacheService.remove(config, key);

// Clear
cacheService.clear(config);
```

3. **Verify Cache Scope:**
   - Ensure cache name is unique within bundle
   - Check TTL (Time To Live) settings

---

### Performance Issues

**Problem:** Process activities or REST APIs are slow.

**Optimization Tips:**

1. **Limit Query Results:**

```java
dataPageParams.put("pageSize", new ArrayList<>(Arrays.asList("100")));  // Limit results
```

2. **Use Specific Property Selection:**

```java
// Only fetch required fields
propertySelections.add("1");
propertySelections.add("1000000161");
// Don't fetch all fields if not needed
```

3. **Optimize Qualifications:**

```java
// Use indexed fields in qualifications
// Avoid LIKE with leading wildcards: LIKE "%value"
// Better: LIKE "value%"
```

4. **Use Caching:**

```java
// Cache frequently accessed data
cacheService.put(config, key, value);
```

5. **Avoid Nested Loops:**

```java
// Bad: O(n²)
for (Record r1 : records1) {
    for (Record r2 : records2) {
        // Process
    }
}

// Better: Use Maps for lookups
Map<String, Record> recordMap = new HashMap<>();
for (Record r : records2) {
    recordMap.put(r.getId(), r);
}
for (Record r1 : records1) {
    Record r2 = recordMap.get(r1.getRelatedId());
    // Process
}
```

6. **Log Performance Metrics:**

```java
long startTime = System.currentTimeMillis();
// Your code
long endTime = System.currentTimeMillis();
ServiceLocator.getLogger().info("Operation took: " + (endTime - startTime) + "ms");
```

---

### Transaction Issues

**Problem:** Data not persisted or transaction rollback errors.

**Solution:**

1. **Use @RxDefinitionTransactional:**

```java
@RxDefinitionTransactional(readOnly = false, isolation = Isolation.DEFAULT)
public void updateData() {
    // Your code
}
```

2. **Check Transaction Scope:**
   - Ensure method is called within transaction context
   - Verify isolation level is appropriate

3. **Handle Exceptions Properly:**

```java
try {
    // Transactional code
} catch (Exception e) {
    ServiceLocator.getLogger().error("Transaction failed", e);
    throw e;  // Re-throw to trigger rollback
}
```

---

### Security and Permission Issues

**Problem:** Access denied or permission errors.

**Solution:**

1. **Use @AccessControlledMethod:**

```java
@AccessControlledMethod(
    authorization = AuthorizationLevel.ValidUser,
    licensing = LicensingLevel.Application,
    checkSchemaForSpecialAccess = true,
    promoteStructAdmin = true
)
```

2. **Verify User Permissions:**
   - Check user has access to record definitions
   - Verify field-level permissions
   - Check role-based access controls

3. **Check Bundle Permissions:**
   - Ensure bundle is deployed with correct permissions
   - Verify bundle is active and accessible

---

## Glossary

**Bundle:** Innovation Studio application package containing Java code and configurations (OSGi module)

**Bundle ID (bundleId):** Unique identifier in format `<groupId>.<artifactId>` (e.g., `com.example.sample-application`)

**Record Definition:** Schema defining data structure, identified by `<bundleId>:<recordDefinitionName>`

**Record Instance:** Individual data entry (row) within a Record Definition with unique ID (GUID)

**Field ID (fieldId):** Integer identifier for a field within a Record Definition

**Process Activity:** Reusable Java component callable from BPMN processes (Service with @Action methods)

**DataPageQuery:** Java component that queries data and returns paginated DataPage object

**Qualification:** String-based expression for filtering data (similar to SQL WHERE clause)

**ServiceLocator:** Utility class for accessing Innovation Studio services (RecordService, CacheService, Logger)

---

## Quick Reference

### Common Imports

```java
// Service Locator
import com.bmc.arsys.rx.application.common.ServiceLocator;

// Record Service
import com.bmc.arsys.rx.services.record.RecordService;
import com.bmc.arsys.rx.services.record.domain.RecordInstance;
import com.bmc.arsys.rx.services.record.domain.RecordDefinition;
import com.bmc.arsys.rx.services.record.domain.Attachment;

// Cache Service
import com.bmc.arsys.rx.services.cache.CacheService;
import com.bmc.arsys.rx.services.cache.CacheConfiguration;
import com.bmc.arsys.rx.services.cache.Cacheable;

// Process Activities
import com.bmc.arsys.rx.services.common.Service;
import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.domain.Scope;

// REST APIs
import com.bmc.arsys.rx.services.common.RestfulResource;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

// Commands
import com.bmc.arsys.rx.services.common.Command;
import javax.ws.rs.core.UriInfo;

// DataPageQuery
import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQuery;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;
import com.bmc.arsys.rx.services.common.QueryPredicate;

// Decorators
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import org.springframework.transaction.annotation.Isolation;

// Validation
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

// JSON
import com.fasterxml.jackson.annotation.JsonProperty;

// Exception Handling
import com.bmc.arsys.rx.services.RxException;
```

### Service Locator Methods

```java
// Get RecordService
RecordService recordService = ServiceLocator.getRecordService();

// Get CacheService
CacheService cacheService = ServiceLocator.getCacheService();

// Get Logger
ServiceLocator.getLogger().error("Error message");
ServiceLocator.getLogger().debug("Debug message");
ServiceLocator.getLogger().info("Info message");
ServiceLocator.getLogger().warn("Warning message");
```

---

**Last Updated:** February 5, 2026  
**Version:** 1.1  
**BMC Helix Innovation Studio:** 25.4.00+
