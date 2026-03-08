# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to extend the capabilities of Business Processes using Java code, here are the different possible extensions.

# How to Use This Documentation

**If you are an AI Agent**, follow this approach:

1. **READ THIS FILE COMPLETELY** before taking any action
   - Understand all available Java object types (Process Activities, REST APIs, Commands, DataPageQuery)
   - Learn about the bundle structure and bundleId concept
   - Identify what services are available (RecordService, CacheService, etc.)

2. **ASSESS THE REQUIREMENT** and decide which object type to create:
   - Need to execute logic in a BPMN process? → [Process Activity](#process-activities)
   - Need to expose a custom API endpoint? → [REST API](#rest-api)
   - Need a fire-and-forget operation? → [Command](#commands)
   - Need to query custom data sources? → [DataPageQuery](#new-datapagequery-types)
   - **Need to create a BPMN Process Definition that uses a Process Activity?** → [Create Process Definition](./Template/create-process-definition.md)

3. **PLAN YOUR IMPLEMENTATION**:
   - What object(s) will you create?
   - What services will you use? (Check [Services](./Services/services-list.md))
   - Will you need to query records? (Check [Record Service](./Services/records.md))
   - Will you need qualifications for filtering? (Check [Qualification](./Services/Qualification.md))
   - What third-party libraries (if any) are needed?

4. **READ THE SPECIFIC DOCUMENTATION** for your object type:
   - Go to the `ObjectTypes/` folder and read the detailed instructions
   - Go to the `Services/` folder for service usage details
   - Review the [Best Practices](#best-practices--coding-rules-in-java) in this file

5. **IMPLEMENT** following the documentation precisely:
   - Use exact import statements and patterns from the documentation
   - Follow the coding rules (decorators, error handling, etc.)
   - Apply the Do's and Don'ts
   - Test your implementation

**Remember**: Do NOT assume how things work. Always reference the documentation for imports, service usage, decorators, and code patterns.


# Important Concepts

## Bundle and Bundle ID
A **bundle** is an Innovation Studio application package that contains your custom Java code and configurations.  
Each bundle has a unique identifier called **bundleId** (also referred to as **bundle ID**).

The bundleId format is:
```
<groupId>.<artifactId>
```

Where:
* `groupId` is defined in the `/bundle/pom.xml` file (e.g., `com.example`)
* `artifactId` is defined in the `/bundle/pom.xml` file (e.g., `sample-application`)
* The resulting bundleId would be: `com.example.sample-application`

**Example from pom.xml:**
```xml
<groupId>com.example</groupId>
<artifactId>sample-application</artifactId>
```
**Resulting bundleId:** `com.example.sample-application`

The bundleId is used throughout your code to:
* Identify record definitions (format: `<bundleId>:<recordDefinitionName>`)
* Configure caching services
* Register REST API endpoints (URLs will be: `http{s}://{server}:{port}/api/<bundleId>/<your-path>`)


# Process Activities
Innovation Studio allows Developers to create Business Processes using BPMN 2.0 process activities.  
Innovation Studio provides a set of standard process activities, but also allows Developers to create custom process activities, in Java.  

**When to use Process Activities:**
* When you need to execute business logic within a BPMN process
* When you need to perform operations that are part of a workflow
* When you want to create reusable logic that can be called from multiple processes
* When you need to return data to the process for decision-making

You can check how to create a new Java process activity [here](./ObjectTypes/process-activity.md).

**📌 Note**: After creating a Process Activity, you may also want to create a **Process Definition** (BPMN workflow) that uses it, if the end user requested so. See the [Creating an Innovation Studio Process Definition](#creating-an-innovation-studio-process-definition-bpmn-process) section below for details.


# Rest Api  
When Developers want a third party system to interact with Innovation Studio Business Processes, they can use the Innovation Studio REST API, however those are very generic, and might expose more than anticipated, or might be harder to use.
The Innovation Studio SDK allows Developers to create custom REST API endpoints, in Java.  
You can also create a Rest Api that would be called internally by Angular code in an Innovation Studio coded UI element (View component or View action).  
  
**When to use REST APIs:**
* When you need to expose functionality to external systems or clients
* When you need a custom API that is more specific than the generic Innovation Studio APIs
* When you want to control exactly what data is exposed and how
* When you need to integrate Innovation Studio with other applications

You can check how to create a new Rest API [here](./ObjectTypes/rest-api.md).


# Commands
Commands are used to execute operations on Innovation Studio, mostly as "fire and forget" operations.  
Commands usually don't return any data, just a status code, they should not be used as rest apis are preferred.      

**When to use Commands:**
* When you need to trigger an operation that doesn't need to return data
* When you need a simple action that doesn't fit the REST API pattern
* For legacy integrations or specific use cases where a command pattern is needed
* Note: REST APIs are generally preferred over commands for most use cases

You can check how to create a new Command [here](./ObjectTypes/command.md).


# New DatapageQuery types  
A DatapageQuery allows End Users to query data from different data sources, such as BMC Remedy AR System forms, or external databases.  
By default, Innovation Studio provides a set of standard DatapageQuery types, for example to search data in Records, but Developers can create custom DatapageQuery types in Java, to connect to other data sources.  
Usually DatapageQuery types are used in Rest Api endpoints.  
A DatapageQuery returns a DataPage Object, which is a usually a collection of objects.  

**When to use DataPageQuery:**
* When you need to query data from external data sources (not Innovation Studio records)
* When you need to transform or aggregate data before returning it
* When you need custom pagination or filtering logic
* When you want to create a reusable query that can be consumed by REST APIs or other components

You can check how to create a new DatapageQuery [here](./ObjectTypes/datapagequery.md).


# Qualification / expression building
A qualification is used in BPMN process activities to define conditions, for example in an Exclusive Gateway to route the process flow based on the end user intent.  
It is also used in Innovation Studio / AR System Java code to filter data when querying Records or other data sources.  
The qualification is a series of expressions combined using logical operators, and is used to filter data or route the process flow.  
It is a bit tricky to build, you can check how to build a qualification [here](./Services/Qualification.md).


# Best practices / coding rules in Java  
Here are a list of best practices / does / don't when creating Java code for Innovation Studio extensions.

## Technology stack
* Innovation Studio is built using Java 17 (OpenJDK 17), so make sure to use language features compatible with this version,
* Innovation Studio uses OSGi as the module system, so make sure to understand how OSGi works,
* Innovation Studio uses the following key technologies:
  * **JAX-RS** (javax.ws.rs) for REST APIs,
  * **Jackson** for JSON serialization/deserialization,
  * **Spring Framework** (version 5.3.42) for dependency injection and transactions,
  * **SLF4J** for logging,

## Third party libraries
* You can use third party libraries (maven libraries), but make sure they are compatible with the Java version used by Innovation Studio (OpenJDK 17),
* Avoid using too many third party libraries, as they will increase the size of the deployment package, and might cause conflicts,
* Prefer using libraries already used by Innovation Studio, to avoid conflicts,
  * You can check the list of libraries used by Innovation Studio in the /bundle/pom.xml file,
  * Some versions are defined in the main pom.xml file, located in /pom.xml,
* Do not use libraries that have a GPL type license (GPL, LGPL etc...), as those are not allowed in the BMC Helix Agreement,

If you need to use a new third party library:
* Define it in the /bundle/pom.xml file, and make sure to use a version compatible with the other libraries used by Innovation Studio.  
* Add the dependency in the main <dependencies> section, for example:
```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>example-library</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Error handling and logging
* Never "swallow" exceptions without at least logging them.
* Leverage RxException to catch the exceptions, for example:
```java
import com.bmc.arsys.rx.services.RxException;
import com.bmc.arsys.rx.application.common.ServiceLocator;
// ...
try {
    // Code to try
}
catch (RxException e) {
    // Logger
    ServiceLocator.getLogger().error("error message, detailed error is " + e.getLocalizedMessage());
}
```

## Dos
* Use the core platform services and extend them, if needed.
* Use the standard platform technology stack as much as possible (like Jackson for JSON serialization/deserialization, SLF4J for logging, etc.).
* Follow standard Java coding conventions and best practices.
* Innovation Studio supports OpenJDK 17, so make sure to use language features compatible with this version.
* Make sure that the code logs all errors appropriately. Implement debug level logging to provide sufficient information to troubleshoot problems,
* To persist data, use the RecordService, including Attachment Fields,
* Avoid code that can take a long time to execute. Instead, break long background processing into smaller actions or processes.
  * The Developer will then consume those different actions in a process for example.
* Always use proper decorators on methods that access data:
  * Use `@RxDefinitionTransactional` to enable transactional behavior
    * Include parameters: `readOnly = true` (for read operations), `isolation = Isolation.DEFAULT`, `rollbackFor = Exception.class`
    * Requires import: `org.springframework.transaction.annotation.Isolation`
  * Use `@AccessControlledMethod` to enforce proper security
    * Include parameters: `authorization` (e.g., `AuthorizationLevel.ValidUser`), `licensing` (e.g., `LicensingLevel.Application`)
    * For operations that modify data, also include: `checkSchemaForSpecialAccess = true`, `promoteStructAdmin = true`
* Memory management best practices:
  * Leverage the Cache Service provided by the Innovation Studio SDK (`com.bmc.arsys.rx.services.cache.CacheService`), see the ./Services/cache.md file,

## Don'ts
* Do not introduce new elements to the BMC Helix Innovation Studio container technology stack that run out of processor start threads, such as the following elements:
  * another database
  * job scheduler
  * caching framework (different from the one approved by BMC)
* Do not affect the configuration of the technology stack, such as with Jersey, Spring, OSGi, or Jetty configurations.
* Do not create any code that would affect other code in some cross-cutting transparent manner.
* Do not use aspects.
* Do not write your own servlets, servlet filters, Jersey filters, or interceptors.
* Do not use Core AR-API or API-Clients (other than Mid Tier for configuration cases). That is, do not use Developer Studio to create Forms and Workflow.
* Do not install or use a version prior to the current version to attempt to connect to BMC Helix Innovation Studio.
* Do not resolve error conditions without logging them.
* Do not log an error level to any information that is not an error.
* Do not log an info level to any information that might log a large number of entries and negatively impact performance.
* Do not store data on the filesystem as it might be read only,
* Avoid executing scripts or code on the filesystem,
* Do not read or write from File I/O streams, for resources, configuration, or any other purpose, for example, do not do this:
```java
BufferedReader br = new BufferedReader(new FileReader(FILENAME));

while ((sCurrentLine = br.readLine()) != null) {
    // do something with sCurrentLine
}
```
* For threads / concurrency:
  * The code should be synchronous,
  * If you need to have something done asynchronously, do not do it in code, the developer can do it in an Innovation Studio process.
  * Do not start threads, for example, this is forbidden:
```java
(new Thread(new MyRunnable())).start();
```
  * Do not extend threads, for example, this is forbidden:
```java
public class HelloThread extends Thread { .. . . }
```
  * Do not use thread synchronization mechanisms, such as sleep / thread.sleep or the synchronized keyword. Do not interact with threading APIs for any other reason.
  * Do not use the synchronized keyword, or sleep() for your current thread, for example this is forbidden:
```java
public class SynchronizedCounter {
    private int c = 0;
    public synchronized void increment() {
       c++;
    }
    public int getCount() { return c; }
}
```
  * Do not block threads on any long-running operation.
    * For example, avoid nested loops where the number of iterations is unknown in advance.
    * Additionally, do not block a thread waiting for a long time for a response from a network resource.
* Memory management best practices:
  * Do not allow information to be shared across threads or client requests. Write a code that is stateless.
  * Do not store data in static variables.
  * Do not create a data caching mechanism, leverage the one provided by the Innovation Studio SDK (`com.bmc.arsys.rx.services.cache.CacheService`), see the ./Services/cache.md file,
  * Do not create member variables for services or JAX-RS resources.
  * Do not store information in members of your Service or JAX-RS resource as displayed in the following example,
  * Do not minimize the loading of large amount of data into memory.
  * Do not interact with thread local storage.
    * Thread local storage is just as ineffective as using a static variable. That is because threads are not allocated to a particular tenant and must not share any state.
* Network best practices: 
  * Use standard, supported JAX/RS techniques for custom REST interfaces.
  * Do not include additional servlet containers or legacy Mid Tier HTTP services.
* Security:
  * Do not create your own permission enforcement mechanism, for example, do not attempt to parse group lists and implement a new model.
  * Do not attempt authorization impersonation or any other changes to any security context.
  * Do not attempt permission elevation.


## Rules for the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`
* Do not modify the existing imports of the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`, even if they are not used,
* Do not remove commented code in the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`, it is explanation for the developer,


# How to get the list of available record definitions?
The record definitions are stored in the folder `/package/src/main/definitions/db/record/` of your maven project in a `.def` file extension.  
Check the instructions [here](./Services/GettingRecordDefinition.md) to learn how to get the list of available record definitions, and their fieldIds.


# Qualification / expression building
A qualification is used in BPMN process activities to define conditions, for example in an Exclusive Gateway to route the process flow based on the end user intent.  
It is also used in Innovation Studio / AR System Java code to filter data when querying Records or other data sources.  
The qualification is a series of expressions combined using logical operators, and is used to filter data or route the process flow.  
It is a bit tricky to build, you can check how to build a qualification [here](./Services/Qualification.md).


# Creating an Innovation Studio Process Definition (BPMN Process)

**Important**: This section is about creating a **Process Definition** (BPMN workflow), NOT about creating a **Process Activity** (Java code).

BMC Innovation Studio leverages BPM (Business Process Model) to allow users to design and automate their business processes in a **Process Definition**.    
A process is a set of actions that are executed in a specific order, it can be used to automate a business process, for example to automate the onboarding of a new employee, or to automate the incident management process.    
A process can have input parameters that can be provided when triggering the process, and output parameters that can be retrieved after the process execution is completed.

**When to create a Process Definition:**
* After creating a Process Activity (Java code), when you want to make it callable as a complete workflow
* When a user asks to "create a process that uses" or "leverages" a specific Process Activity
* When you need a BPMN workflow that orchestrates one or more Process Activities
* When you need a reusable workflow that can be triggered from UI components or other processes

**Process Definition vs Process Activity:**
* **Process Activity** = Java code that performs business logic (created in `/bundle/src/main/java/...`)
* **Process Definition** = BPMN workflow that uses Process Activities (created in `/package/src/main/definitions/db/process/...`)

**How to create a Process Definition:**
If the user asks you to create a process definition that leverages a Process Activity you've created (or that already exists), follow the detailed instructions in **[this documentation](./Template/create-process-definition.md)**.

The process definition will be saved in: `/package/src/main/definitions/db/process/<ProcessName>.def`

**Quick checklist before creating a Process Definition:**
1. ✅ The Process Activity already exists (Java code is created)
2. ✅ You know the Process Activity's `@Action` name and `@ActionParameter` names
3. ✅ You have a unique name for the Process Definition
4. ✅ You can generate unique UUIDs for all process elements

👉 **[Read the full Process Definition creation guide here](./Template/create-process-definition.md)**


# Glossary of Key Terms

## Bundle
A bundle is an Innovation Studio application package that contains your custom Java code, configurations, and resources. Each bundle is an OSGi module.

## Bundle ID (bundleId)
A unique identifier for your bundle in the format `<groupId>.<artifactId>` (e.g., `com.example.sample-application`). Used to identify resources and APIs within Innovation Studio.

## Record Definition
A schema that defines the structure of data in Innovation Studio, similar to a database table. Identified by a fully qualified name: `<bundleId>:<recordDefinitionName>`.

## Record Instance
An individual data entry (row) within a Record Definition. Each record instance has a unique ID (GUID) and field values.

## Field ID (fieldId)
An integer identifier for a field within a Record Definition. Used in code to reference specific fields (e.g., fieldId `379` is typically the GUID field, fieldId `8` is often a Description field).

## Process Activity
A reusable Java component that can be called from BPMN processes to execute business logic. Implemented as a Service with methods decorated with `@Action`.

## DataPageQuery
A Java component that queries data from various sources and returns paginated results as a DataPage object.

## Qualification
A string-based expression used to filter data, similar to a WHERE clause in SQL. Uses field IDs and operators to define search criteria.

## ServiceLocator
A utility class (`com.bmc.arsys.rx.application.common.ServiceLocator`) used to access Innovation Studio services like RecordService, CacheService, and Logger.
