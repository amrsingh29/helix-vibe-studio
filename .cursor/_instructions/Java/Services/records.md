# Definition
Innovation Studio is a production from BMC Helix.  
Data are stored in Records.  
Records are the basic unit of data storage in Innovation Studio.  
A Record Definition is defined by several properties:
* Its name (record definition name),
* Its fields (field definitions),
  * A fieldId is an integer,
  
The **fully qualified record definition name** follows this format:
```
<bundleId>:<recordDefinitionName>
```

Where `bundleId` is a combination of the maven project groupId and artifactId from `/bundle/pom.xml`:
```
<groupId>.<artifactId>
```

**Example:**
If your `/bundle/pom.xml` has:
```xml
<groupId>com.example</groupId>
<artifactId>sample-application</artifactId>
```
And your record definition is named `Restaurant`, then:
* **bundleId** = `com.example.sample-application`
* **fully qualified record definition name** = `com.example.sample-application:Restaurant`

This fully qualified name is what you must use in Java code when working with records.

Entries in a record definition are called record instances. 
Each record instance is identified by a unique record instance ID (GUID).


# How to get the list of available record definitions?
The record definitions are stored in the folder `/package/src/main/definitions/db/record/` of your maven project in a `.def` file extension.  
Check the instructions [here](./GettingRecordDefinition.md) to learn how to get the list of available record definitions, and their fieldIds.  


# Service
In order to create, update, delete one record instance, you need to import the service `com.bmc.arsys.rx.services.record.RecordService` from the BMC Helix SDK:
```java
import com.bmc.arsys.rx.services.record.RecordService;
import com.bmc.arsys.rx.services.record.domain.RecordInstance;
import com.bmc.arsys.rx.application.common.ServiceLocator;
```

# Usage
1. Locate service
You need first to locate the service:
```java
RecordService recordService = ServiceLocator.getRecordService();
```

2. Get a record instance
To get a record instance, you need to provide the record definition name and the record instance ID. 
The method getRecordInstance returns a RecordInstance object that represents the record instance.  
```java
RecordInstance recordInstance = recordService.getRecordInstance(<recordDefinitionName>, <recordInstanceId>);
```
In order to get the value of a field, you need to use the `getFieldValue()` method, passing the fieldId you want to fetch, for example:
```java
String descriptionFieldValue = recordInstance.getFieldValue(<fieldId>);
```

3. Update a record instance
To update a record instance, you need to provide a RecordInstance object, usually you need first to fetch a record instance as seen in 2., then modify some of its values using the `setFieldValue()` method, and persisting the values using the `updateRecordInstance()` method:
```java
// Fetch a record instance
RecordInstance recordInstance = recordService.getRecordInstance(<recordDefinitionName>, <recordInstanceId>);
// Updating the value of the field fieldId:
recordInstance.setFieldValue(<fieldId>, "foo");
// Persisting the values:
recordService.updateRecordInstance(recordInstance);
```

4. Deleting a record instance
To Delete a record instance, you need to provide the record definition name and the record instance ID.
```java
recordService.deleteRecordInstance(<recordDefinitionName>, <recordInstanceId>);
```

5. Fetching multiple record instances
In order to fetch multiple record instances, you need to consume a datapagequery, providing a configuration:
* Number of records to fetch,
* Which datapagequerytype to use, most of the time you will use the standard one to fetch record instances: `com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery`,
* The list of fieldIds to fetch,
* The list of fields used for sorting,
* The qualification to apply to search the record instances (see [Qualification documentation](./Qualification.md)),
* The record definition to search (fully qualified name: `<bundleId>:<recordDefinitionName>`),
* The startIndex, that is used for pagination, it is the index where we will start fetching records from (0 being the first record),
* The pageSize, that is used to tell how many records we want to fetch,

Those parameters are stored in a `DataPageQueryParameters` from `com.bmc.arsys.rx.services.common.DataPageQueryParameters`, storing the different values, as per this example:
```java
import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Initializing the list of parameters
Map<String, List<String>> dataPageParams = new HashMap<String, List<String>>();

// We are using the standard data page query type to get record instances.
dataPageParams.put("dataPageType", new ArrayList<String>(Arrays.asList("com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery")));

// How many record instances should we retrieve, here we return 50 record instances
dataPageParams.put("pageSize", new ArrayList<String>(Arrays.asList("50")));

//List of fields to fetch:
List<String> propertySelections = new ArrayList<String>();
// Guid field Id (379)
propertySelections.add("379");
// Description field Id (8)
propertySelections.add("8");
// Adding the list of fields to fetch to the propertySelection:
dataPageParams.put("propertySelection", new ArrayList<String>(propertySelections));

// Record definition name to query (must be fully qualified: <bundleId>:<recordDefinitionName>):
dataPageParams.put("recorddefinition", new ArrayList<String>(Arrays.asList(<recordDefinitionName>)));

// We start at index 0 (first "page"):
dataPageParams.put("startIndex", new ArrayList<String>(Arrays.asList("0")));

// Qualification, here we search the value written by the other method, here we are looking all record instances where the values of field 8 is "foo":
String qualification = "'8' = \"foo\" ";
dataPageParams.put("queryExpression", new ArrayList<String>(Arrays.asList(qualification)));


// Final object storing the data page query parameters:
DataPageQueryParameters dataPageQueryParameters = new DataPageQueryParameters(dataPageParams);
```

Once this object is created, you can fetch the record instances leveraging the method `getRecordInstancesByIdDataPage()`. It returns a DataPage object from `com.bmc.arsys.rx.services.common.DataPage`, which we can iterate as a collection of Objects, getting each fieldId value using a `get()` method:
```java
import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;

// Executing the datapagequery call
DataPage result = recordService.getRecordInstancesByIdDataPage(dataPageQueryParameters);

// Fetching results.
List<?> records = result.getData();

// We iterate through the list of record instances.
for (Object record : records) {
    HashMap<String, Object> mappedRecord = (HashMap<String, Object>) record;

    // We get the record instance Id (379).
    String recordInstanceGuid = mappedRecord.get("379").toString();
}
```

6. Getting an attachment
To get a record instance attachment, you need to provide the record definition name (fully qualified), the record instance ID, and the fieldId of the Attachment.  
The method getAttachment returns an Attachment object that represents the attachment.
```java
import com.bmc.arsys.rx.services.record.domain.Attachment;

Attachment attachment = recordService.getAttachment(<recordDefinitionName>, <recordInstanceId>, <attachmentFieldId>);
```
By default the content of the Attachment is in bytes, we can get several properties from the Attachment object:
* filename: `String filename = attachment.getFileName()`
* content in bytes: `byte[] content = attachment.getBinaryData()`


7. Creating an attachment
To create a record instance attachment, you need to provide the record definition name (fully qualified), the record instance ID, and the fieldId of the Attachment.  
The method persistAttachment persists an Attachment object. The content of the Attachment itself must be in bytes.  
In the example below, we get a base64 String and converts it into bytes:   
```java
import com.bmc.arsys.rx.services.record.domain.Attachment;
import java.util.Base64;

byte[] decompressedBytes = Base64.getDecoder().decode(base64String);

Attachment newAttachment = new Attachment(
        <recordDefinitionName>,   // RecordDefinitionName (fully qualified)
        <recordInstanceId>,       // RecordInstanceId
        <fileName>,               // Filename of the attachment, for example "my-picture.png".
        Integer.parseInt(attachmentFieldId),    // fieldId of the Attachment
        <decompressedBytes>       // Bytes (attachment content)
);
```
Persisting the Attachment:
```java
recordService.persistAttachment(newAttachment);
```


8. Creating a record instance
To create a record instance, you need to provide:
* The record definition name (fully qualified name format: `<bundleId>:<recordDefinitionName>`, example: `com.example.sample-application:Restaurant`),

You then need to:
* Get the Record Service `RecordService` from `com.bmc.arsys.rx.services.record.RecordService`,
* Instantiate a new RecordInstance object from `com.bmc.arsys.rx.services.record.domain.RecordInstance`,
* Set the record definition name using the recordInstance `setRecordDefinitionName()` method
    * `setRecordDefinitionName(<recordDefinitionName>)`,
  * Set the field values using the recordInstance `setFieldValue()` method
    * `setFieldValue(<fieldId>, <value>)`,
* Persist the record instance using the RecordService method `createRecordInstance()`,
  
_Note:_  
If you want to get the record instance ID of the newly created record instance, you can get it from the `recordInstance` object after it has been saved. The `createRecordInstance()` method does NOT return the record instance ID, but it is set in the `recordInstance` object. Use the RecordInstance method `getId()`:
  
In the example below, we save a record instance for a record definition named `com.example.sample-application:TestRecordDefinition`, saving two fields values, 8 and 510008:
```java
import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.record.RecordService;
import com.bmc.arsys.rx.services.record.domain.RecordInstance;

// Get the Record Service
RecordService recordService = ServiceLocator.getRecordService();

// Creating a new RecordInstance object
RecordInstance recordInstance = new RecordInstance();

// Preparing a new RecordInstance Object
// Here we are setting two fields with some values.
recordInstance.setRecordDefinitionName("com.example.sample-application:TestRecordDefinition");

// Setting field values
recordInstance.setFieldValue(8, "foo");
recordInstance.setFieldValue(510008, "bar");

// Persisting the new record instance
recordService.createRecordInstance(recordInstance);

// Getting the record instance ID of the newly created record instance
String recordInstanceId = recordInstance.getId();
```

**CRITICAL**:    
When creating a record instance, all REQUIRED fields must have a value.
You can get the list of fields from a record definition using the [documentation](./GettingRecordDefinition.md) to learn how to get the list of available record definitions, and their fieldIds.  
You will need to check that REQUIRED fields have adequate values. This information is stored in the property `fieldOption`:
```
   definition     :     "fieldOption" : "REQUIRED",
```
You will need to set a value for the REQUIRED fields that you identified, IF the field does not have a default value. If the field has a default value, and you did not use the field in your code, you can just ignore it.  
The default value, if it exists, is stored in the property:
```
definition     :     "defaultValue" : "0",
```


# Code samples
You can find examples in the file `./Examples/RecordInstance.java`.
