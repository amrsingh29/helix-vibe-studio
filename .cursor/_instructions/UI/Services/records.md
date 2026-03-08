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
In order to create, update, delete one record instance, you need to import the service `RxRecordInstanceService` from `@helix/platform/record/api` from the BMC Helix SDK:
```typescript
import { RxRecordInstanceService } from '@helix/platform/record/api';
```

The best practice is to declare this service as a dependency in the constructor of your class, and let the framework inject it for you, for example:
```typescript
import { RxRecordInstanceService } from '@helix/platform/record/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService) {
  super();
}
```


# Usage
1. Import and declare the service
You need first to import and declare the service as seen earlier:
```typescript
import { RxRecordInstanceService } from '@helix/platform/record/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService) {
  super();
}
```

2. Get a record instance
To get a record instance, you need to provide the `record definition name` and the `record instance Id`. 
The method `get` is an Observable that needs to be subscribed to get the `RecordInstance` object from `@helix/platform/record/api` that represents the record instance.  
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService) {
  super();
}
// ..
this.recordInstance = null;

this.rxRecordInstanceService.get('<record definition name>', '<record instance Id>').subscribe((recordInstance: RecordInstance) => {
  this.recordInstance = recordInstance;
});
```
In order to get the value of a field, you need to access the `fieldInstances` property of the `RecordInstance` which has this format:
```typescript
{
  [fieldId: number]: IFieldInstance;
}
```
Where `IFieldInstance` is an interface from the SDK:
```typescript
export interface IFieldInstance {
  resourceType: string;
  id: number;
  value: any;
  permissionType?: 'CHANGE' | 'VIEW';
  valueByLocale?: IPlainObject;
  hideCurrentLocale?: boolean;
  file?: File;
}
```

So, to access a field value, you can do following our example:
```typescript
const fieldId = 8; // example fieldId
const fieldValue = this.recordInstance.fieldInstances[fieldId].value;
```


3. Update a record instance
To update a record instance:
* You need to provide a `RecordInstance` object,
  * Usually you need first to fetch a record instance as seen in 2., 
* Modify some of its values using its `setFieldValue()` method,
  * The method signature is `setFieldValue(fieldId: number, value: any)`, where `fieldId` is the field you want to update, and `value` is the new value you want to set for this field,
* Persist the values using the `save` method,
The method `save` is an Observable that needs to be subscribed to, and it does not return any value.  
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService, private rxLogService: RxLogService) {
  super();
}
// ..
this.recordInstance = null;

// Fetch a record instance
this.rxRecordInstanceService.get('<record definition name>', '<record instance Id>').subscribe((recordInstance: RecordInstance) => {
  // Update the field Id 8 value
  const fieldId = 8;
  recordInstance.setFieldValue(fieldId, 'Updated the ' + Date.now());

  // Updating the record instance
  this.rxRecordInstanceService.save(recordInstance).subscribe(() => {
    this.rxLogService.log('Record instance updated successfully.');
  });
});
```

4. Deleting a record instance
To Delete a record instance, you need to provide the `record definition name` and the `record instance Id` and call the method `delete` from `RxRecordInstanceService` imported from `@helix/platform/record/api`.  
The method `delete` is an Observable that needs to be subscribed to actually delete the record instance. For example:
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService, private rxLogService: RxLogService) {
  super();
}
// ..

this.rxRecordInstanceService.delete('<record definition name>', '<record instance Id>').subscribe((recordInstance: RecordInstance) => {
  this.rxLogService.log('Record instance deleted successfully.');
});
```

5. Fetching multiple record instances
In order to fetch multiple record instances, you need to perform a `RxRecordInstanceDataPageService` call, providing a configuration Object `IDataPageParams` from `@helix/platform/shared/api`:
* The list of fieldIds to fetch in `propertySelection` as an array of fieldIds,
* The qualification to apply to search the record instances (see [Qualification documentation](./Qualification.md)) as a string in `queryExpression`,
* The record definition to search (fully qualified name: `<bundleId>:<recordDefinitionName>`) in `recorddefinition`,
* The `startIndex`, that is used for pagination, it is the index where we will start fetching records from (0 being the first record),
* The `pageSize`, that is used to tell how many records we want to fetch,
  * -1 means all records,
  
For example:
```typescript
import { IDataPageParams } from '@helix/platform/shared/api';
// ...
const RECORD_DEFINITION_NAME = 'com.example.sample-application:TestRecordDefinition';
const QUALIFICATION = '\'7\' = "New"'; // example qualification, here fieldId 7 (Status) = "New"

// Building the parameter list
const params: IDataPageParams = {
  // Record Definition to fetch data into.
  recorddefinition: RECORD_DEFINITION_NAME,
  // List of field Ids we want to fetch. This is an array of field Ids, here fieldIds 8, 510008 and 379.
  propertySelection: [8, 510008, 379],
  // Page size (-1 = all possible records).
  pageSize: -1,
  // Start Index (if we want to handle the pagination), 0 means we want to get
  // from the first record instance.
  startIndex: 0,
  // Query criteria. Here we want to fetch the record instances where
  // 'Status' = "New", so once using the field Ids and the status values:
  // '7' = "0"
  queryExpression: QUALIFICATION
};
```

Once this object is created, you can fetch the record information leveraging the method `post()` from `RxRecordInstanceDataPageService` from import `@helix/platform/record/api`. It needs to be declared in the Component constructor and injected by the framework as seen in the previous examples. The records are not record instances, but an array of object where the keys are the fieldIds, and the values are the field values.  
It returns a `IDataPageResult` object from `@helix/platform/shared/api` which has this structure, where:
* data: contains the list of record instances fetched,
* totalSize: is the total number of record instances that match the qualification, it is useful when you want to implement pagination, 
```typescript
{
  data: T[];
  totalSize?: number;
  cursor?: string;
}
```
`data` is an array of objects where the keys are the fieldIds, and the values are the field values.  
An object will only contain the fieldIds that you specified in the `propertySelection` parameter of the `IDataPageParams` object.  
For example, if we fetch fieldIds 8 and 510008, the data array will have this format:
```typescript
[
  {
    '8': 'field 8 value for record instance 1',
    '510008': 'field 510008 value for record instance 1'
  },
  {
    '8': 'field 8 value for record instance 2',
    '510008': 'field 510008 value for record instance 2'
  },
  // ...
]
```
To easy the manipulation of the data, you can use the `KeyValueObject` type from `@bmc-ux/adapt-angular`.  

For example, to fetch the record instances that match the qualification defined in the previous example, and to output in the console the description field (fieldId 8) for all records found, you can do:
```typescript
import { RxRecordInstanceDataPageService } from '@helix/platform/record/api';
import { IDataPageParams, IDataPageResult } from '@helix/platform/shared/api';
import { KeyValueObject } from '@bmc-ux/adapt-angular';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxRecordInstanceDataPageService: RxRecordInstanceDataPageService, private rxLogService: RxLogService) {
  super();
}
// ...
const RECORD_DEFINITION_NAME = 'com.example.sample-application:TestRecordDefinition';
const QUALIFICATION = '\'7\' = "New"'; // example qualification, here fieldId 7 (Status) = "New"
const descriptionFieldId = 8; // example fieldId of the description field

// Building the parameter list
const params: IDataPageParams = {
  // Record Definition to fetch data into.
  recorddefinition: RECORD_DEFINITION_NAME,
  // List of field Ids we want to fetch. This is an array of field Ids, here fieldIds 8, 510008 and 379.
  propertySelection: [8, 510008, 379],
  // Page size (-1 = all possible records).
  pageSize: -1,
  // Start Index (if we want to handle the pagination), 0 means we want to get
  // from the first record instance.
  startIndex: 0,
  // Query criteria. Here we want to fetch the record instances where 'Status' = "New", so once using the field Ids and the status values:
  // '7' = "0"
  queryExpression: QUALIFICATION
};

// Getting the record instances
this.rxRecordInstanceDataPageService.post(params).subscribe((results: IDataPageResult) => {
    const recordInstances: KeyValueObject[] = [];
    recordInstances = results.data;
    
    // Outputing in the console the description field (8) for all records found.
    recordInstances.forEach((recordResult: KeyValueObject) => {
      this.rxLogService.log('Description field value for this record instance is: ' + recordResult[descriptionFieldId]);
    });
});
```

6. Fetch or Trigger the download of an attachment
To trigger the download a record instance attachment, you need to provide the record definition name (fully qualified), the record instance ID, the fieldId of the Attachment and its filename.  
The method `downloadAttachment` from the `RxRecordInstanceService` from import `@helix/platform/record/api` will trigger the download of the attachment.  
In the following example:
* We get the record instance to get the filename of the attachment,
* We trigger the download of the attachment using the `downloadAttachment` method,
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService) {
  super();
}
// ...
const RECORD_DEFINITION_NAME = 'com.example.sample-application:TestRecordDefinition';
const attachmentFieldId = 510009; // example fieldId of the attachment field
const recordInstanceId = '<record instance Id>';
// This method will try to download the attachment from the web browser.
// we need first to get the record Instance to get the right filename.
this.rxRecordInstanceService.get(RECORD_DEFINITION_NAME, recordInstanceId).subscribe((recordInstance: RecordInstance) => {
  const filename = recordInstance.getFieldValue(attachmentFieldId);

  this.rxRecordInstanceService.downloadAttachment(RECORD_DEFINITION_NAME, attachmentFieldId, recordInstanceId, filename);
});
```
  
To get the content of the record instance attachment in bytes, you can use the method `getAttachment` from the `RxRecordInstanceService` from import `@helix/platform/record/api`, you need to provide the record definition name (fully qualified), the record instance ID and the fieldId of the Attachment.  
The method `getAttachment` is an Observable that needs to be subscribed to, and it returns a Blob object that contains the content of the attachment in bytes.  
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
// ...
const RECORD_DEFINITION_NAME = 'com.example.sample-application:TestRecordDefinition';
const attachmentFieldId = 510009; // example fieldId of the attachment field
const recordInstanceId = '<record instance Id>';

this.rxRecordInstanceService.getAttachment(RECORD_DEFINITION_NAME, attachmentFieldId, recordInstanceId).subscribe((attachmentContent: Blob) => {
  // Here we have the content of the attachment in bytes in the attachmentContent variable.
});
```

7. Creating a record instance
To create a record instance, you need to provide:
* The record definition name (fully qualified name format: `<bundleId>:<recordDefinitionName>`, example: `com.example.sample-application:Restaurant`),
* A `RecordInstance` object from `@helix/platform/record/api`,

You then need to:
* Import and declare the Record Service `RxRecordInstanceService` from `@helix/platform/record/api`,
* Get a new `RecordInstance` object from `@helix/platform/record/api` from the method `getNew()` from `RxRecordInstanceService` from `@helix/platform/record/api`, providing the fully qualified record definition name,
  * This method is an Observable that needs to be subscribed to, and it will return a `RecordInstance` object with default values set if they exist,
* In the new Record Instance object, you can set the field values using the `RecordInstance` object `setFieldValue()` method
  * `recordInstance.setFieldValue(<fieldId>, <fieldIdValue>);`,
* Persist the record instance using the `RxRecordInstanceService` method `create()`,
  * The method `create()` is an Observable of `ICreatedRecordInstance` from `@helix/platform/record/api/record-instance.types` that needs to be subscribed to return information about the created record instance, such as its record instance Id (`id` property) and its URL (`url` property):
```typescript
export interface ICreatedRecordInstance {
  id?: string;
  url?: string;
}
```
  
In the example below, we save a record instance for a record definition named `com.example.sample-application:TestRecordDefinition`, saving two fields values, 8 and 510008, and we display the record instance Id in the console after the record instance is created:
```typescript
import { RxRecordInstanceService, RecordInstance } from '@helix/platform/record/api';
import { ICreatedRecordInstance } from '@helix/platform/record/api/record-instance.types';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private rxRecordInstanceService: RxRecordInstanceService, private rxLogService: RxLogService) {
  super();
}
// ..
const RECORD_DEFINITION_NAME = 'com.example.sample-application:TestRecordDefinition';
// ...
// Getting a New record instance object, with its default values set.
this.rxRecordInstanceService.getNew(RECORD_DEFINITION_NAME).subscribe((recordInstance: RecordInstance) => {
  // Setting field values:
  recordInstance.setFieldValue(8, 'Test value');
  recordInstance.setFieldValue(510008, 'Test value 2');

  // Creating the record instance:
  this.rxRecordInstanceService.create(recordInstance).subscribe((createdRecordInstance: ICreatedRecordInstance) => {
    // Getting the record instance Id:
    const recordInstanceId = createdRecordInstance.id;
    this.rxLogService.log('The record instance Id is: ' + recordInstanceId);
  });
});

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
You can find examples in the file `./Examples/Records.ts`.
