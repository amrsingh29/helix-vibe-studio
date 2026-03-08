# Definition
Innovation Studio is a production from BMC Helix.  
Data are stored in Records.  
Records are the basic unit of data storage in Innovation Studio.  
A Record Definition is defined by several properties:
* It's name (record definition name),
* It's fields (field definitions),
    * A fieldId is an integer,
  
In order to use the record definition in the code you will generate, you need to be able to discover which record definitions are available.  
The record definitions are stored in the folder `/package/src/main/definitions/db/record/` of your maven project in a `.def` file extension.  

## How to read a record definition .def file?
A .def file is a json formatted file that contains all the information about the record definition, however, it contains on most of its line a prefix that needs to be removed if you want to parse it as json.  
* The file contains
  * A header, `begin record definition`,
  * A name property that contains the fully qualified name of the record definition, for example `   name           : com.example.test210500:Restaurant`,
    * A json object defining the object, however each line is prefixed by `   definition     : ` that needs to be removed to parse the json object, for example
      ```
         definition     : {
         definition     :   "resourceType" : "com.bmc.arsys.rx.services.record.domain.RegularRecordDefinition",
         definition     :   "version" : null,
         definition     :   "lastUpdateTime" : 1710367114000,
         definition     :   "isSharedInstanceStorage" : false,
         definition     :   "isAbstract" : false,
         definition     :   "isFinal" : false,
         definition     :   "securityTable" : false
         definition     : }
      ```
      * A footer, `end`,

Truncated example of a .def file type `record`:  
```
begin record definition
   name           : com.example.test210500:Restaurant
   definition     : {
   definition     :   "resourceType" : "com.bmc.arsys.rx.services.record.domain.RegularRecordDefinition",
   definition     :   "version" : null,
   definition     :   "lastUpdateTime" : 1710367114000,
   definition     :   "isSharedInstanceStorage" : false,
   definition     :   "isAbstract" : false,
   definition     :   "isFinal" : false,
   definition     :   "securityTable" : false
   definition     : }
end
```

## How to retrieve information necessary for your code?
1. Open the folder `/package/src/main/definitions/db/record/` of your maven project,
2. List `<record definition name>.def` files available,
3. For each record definition file
   * Open it, you can access / see the different properties:
      * Record definition name: it is the name of the file without the `.def` extension,
        * You can find the fully qualified name (`<bundleId>:<recordDefinitionName>`) in the `name` property next to the `begin record definition` zone,
          * The fully qualified name is the one you are supposed to use in the Java or UI code,
        * For example:
```
begin record definition
     name           : com.example.sample-application:Restaurant
```
4. Record definition fields: you can see the list of fields defined in the record definition in the `fieldDefinitions` section, for example:
`definition     :   "fieldDefinitions" : [ {`
    * Each field has some important properties:
       * `id`: the unique integer identifier of the field,
       * `name`: the name of the field,
       * `resourceType`: the data type of the field (String, Integer, Date, etc...),
       * `fieldOption`: indicates if the field is required, optional, etc...,
       * For example: here:
         * `resourceType` is `com.bmc.arsys.rx.standardlib.record.SelectionFieldDefinition`, it is a Selection field,
         * `fieldId` is the `id` property, so `7` here, `"id" : 7,`
         * `name` is the name of the field, so `"Status"` here, `"name" : "Status",`
         * `fieldOption` tells if the field is required or optional, so here it is `"REQUIRED"`, `"fieldOption" : "REQUIRED",`
         * If the field is a selection field, you can see the different options available in the `optionNamesById` property, for example:
           * "New" with id `0`,
           * "Assigned" with id `1`,
           * "Fixed" with id `2`,
           * "Rejected" with id `3`,
           * "Closed" with id `4`,
         * The default value is in the `defaultValue` property, so here it is `0`, `"defaultValue" : "0",`
```
{
   definition     :     "resourceType" : "com.bmc.arsys.rx.standardlib.record.SelectionFieldDefinition",
   definition     :     "name" : "Status",
   definition     :     "id" : 7,
   definition     :     "fieldOption" : "REQUIRED",
   definition     :     "defaultValue" : "0",
   definition     :     "optionNamesById" : {
   definition     :       "0" : "New",
   definition     :       "1" : "Assigned",
   definition     :       "2" : "Fixed",
   definition     :       "3" : "Rejected",
   definition     :       "4" : "Closed"
   definition     :     }
   definition     :   }

```
