# Definition
Innovation Studio is a production from BMC Helix.  
A DatapageQuery allows End Users to query data from different data sources, such as BMC Remedy AR System forms, or external databases.  
By default, Innovation Studio provides a set of standard DatapageQuery types, for example to search data in Records, but Developers can create custom DatapageQuery types in Java, to connect to other data sources.  
Usually datapagequery types are used in Rest Api endpoints.  
A DatapageQuery returns a DataPage Object, which is a collection of record instances.
  

# Calling a custom DataPageQuery from Angular code
## Custom Service extending `DataPage`
The BMC Innovation Studio SDK provides a service `RxRecordInstanceDataPageService` that can only query Innovation Studio Records.  
You need to create a custom Angular service extending `DataPage` from `@helix/platform/shared/api` that will call the custom Java DataPageQuery.  
It is recommended to create the file in the UI View Component folder where it is going to be used. For example, if the DataPageQuery is going to be used in the View Component runtime, put it in the `runtime` folder of the view component (Standalone of Record Editor field types):
```
<view-component-name>/
├── runtime/
```
For a View Action, the service should simply be in the view action folder: 
```
<view-component-name>/
```
  
The name of the file should be `<view-component-name>-data-page.service.ts`.
The name of the class should be `<NameOfTheDataPageQuery>DataPageService`.  

**Important:**  
The name of the DataPageQuery is the fully qualified name of the Java class, that is the package name + class name.  
For example, if the Java class is in the package `com.example.bundle` and the class name is `SimpleDataPageQuery`, the DataPageQuery name will be `com.example.bundle.SimpleDataPageQuery`.  
  
For example, if the DataPageQuery Java class name is `SimpleDataPageQuery`, the Angular service class name should be `SimpleDataPageQueryDataPageService`:
```typescript
import { Injectable, Injector } from '@angular/core';
import { DataPage } from '@helix/platform/shared/api';

// Declaring the custom datapage query.
@Injectable({
  providedIn: 'root'
})
export class SimpleDataPageQueryDataPageService extends DataPage {
  constructor(injector: Injector) {
    const DATAPAGE_QUERY_NAME = 'com.example.bundle.SimpleDataPageQuery';

    super(injector, DATAPAGE_QUERY_NAME);
  }
}
```

## Consuming the new Angular DataPageQuery Service
Once the service is created, you can import it into the View Component or View Action where you want to use it. It needs to be injected into the constructor.  
The consumption is very similar to the one of `RxRecordInstanceDataPageService`, which is a special DataPageQuery fetching record instances, since the custom service extends `DataPage`.
  
You need to provide a configuration Object `IDataPageParams` from `@helix/platform/shared/api`:
* The list of fieldIds to fetch in `propertySelection` as an array of fieldIds,
* The qualification to apply to search the values, as a string in `queryExpression`,
* The record definition to search
  * In this specific use case, it is not important since the record definition is specified in the Java class, but it is still a required parameter, so you can put any string value in `recorddefinition`,
* The `startIndex`, that is used for pagination, it is the index where we will start fetching records from (0 being the first record),
* The `pageSize`, that is used to tell how many records we want to fetch,
    * -1 means all records,
  
_Note:_  
Even if those settings are required in the `IDataPageParams` object, it is important to check the Java class implementation of the DataPageQuery to know which parameters are really used, and if there are some specific values to set for those parameters.  
  
For example:
```typescript
import { IDataPageParams } from '@helix/platform/shared/api';
// ...
const RECORD_DEFINITION_NAME = 'NA'; // not used in this case since the record definition is specified in the Java class, but it is a required parameter, so you can put any string value here.
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
  
Once this object is created, you can call the new DataPageQuery service method `post()`. It needs to be declared in the Component constructor. The results are not record instances objects, but an array of object where the keys are the fieldIds (or whatever was defined in the Java coded DataPageQuery), and the values are the values.  
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
An object will only contain the fieldIds that you specified in the `propertySelection` parameter of the `IDataPageParams` object (if implemented in the Java coded DataPageQuery).  
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

For example, to call the coded Java DataPageQuery `SimpleDataPageQuery` we created an Angular service `SimpleDataPageQueryDataPageService`:
```typescript
import { IDataPageParams, IDataPageResult } from '@helix/platform/shared/api';
import { KeyValueObject } from '@bmc-ux/adapt-angular';
import { SimpleDataPageQueryDataPageService } from 'pizza-ordering-data-page.service.ts';
import { RxLogService } from '@helix/platform/shared/api';
// ...
constructor(private simpleDataPageQueryDataPageService: SimpleDataPageQueryDataPageService, private rxLogService: RxLogService) {
    super();
}
// ...
const RECORD_DEFINITION_NAME = 'NA'; // not used in this case since the record definition is specified in the Java class, but it is a required parameter, so you can put any string value here.
const QUALIFICATION = '\'7\' = "New"'; // example qualification, here fieldId 7 (Status) = "New"
const descriptionFieldId = 8; // example fieldId for the description field

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

// Getting the record instances
this.simpleDataPageQueryDataPageService.post({params}).subscribe((results: IDataPageResult) => {
    const dataPageQueryResults: KeyValueObject[] = [];
    dataPageQueryResults = results.data;
    
    // Outputing in the console the description field (8) for all records found.
    dataPageQueryResults.forEach((dataPageQueryResult: KeyValueObject) => {
      this.rxLogService.log('Description field value for this record instance is: ' + dataPageQueryResult[descriptionFieldId]);
    });
});
```

_Note:_  
You will need to refer to the Java class implementation of the DataPageQuery to know:
* Which parameters are required and how to use them and how to build them (record definition name, qualification format etc...),
* The format of the results returned (keys for example),
