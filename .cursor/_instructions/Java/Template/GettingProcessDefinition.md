# Definition
Innovation Studio is a production from BMC Helix.  
BMC Innovation Studio leverages BPM (Business Process Model) to allow users to design and automate their business processes, in a Process Definition.    
A process is a set of actions that are executed in a specific order, it can be used to automate a business process, for example to automate the onboarding of a new employee, or to automate the incident management process.    
A process can have input parameters that can be provided when triggering the process, and output parameters that can be retrieved after the process execution is completed.  
  
In order to use the process definition in the code you will generate, you need to be able to discover which process definitions are available.  
The process definitions are stored in the folder `/package/src/main/definitions/db/process/` of your maven project in a `.def` file extension.  

## How to read a process definition .def file?
A .def file is a json formatted file that contains all the information about the process definition, however, it contains on most of its line a prefix that needs to be removed if you want to parse it as json.  
* The file contains
  * A header, `begin process definition`,
  * A name property that contains the fully qualified name of the process definition, for example `   name           : com.example.sample-application:ordering-pizza`,
    * A json object defining the object, however each line is prefixed by `   definition     : ` that needs to be removed to parse the json object, for example
      ```
          definition     : {
          definition     :   "version" : null,
          definition     :   "lastUpdateTime" : 1771051215174,
          definition     :   "lastChangedBy" : "ARSERVER",
          definition     :   "owner" : "Demo",
          definition     :   "name" : "com.example.sample-application:ordering-pizza",
          definition     :   "tags" : null,
          definition     :   "description" : "",
          definition     :   "overlayGroupId" : "1",
      ```
      * A footer, `end`,

Truncated example of a .def file type `process`:  
```
begin process definition
   name           : com.example.sample-application:ordering-pizza
   definition     : {
   definition     :   "owner" : "Demo",
   definition     :   "name" : "com.example.sample-application:ordering-pizza",
   definition     : }
end
```

## How to retrieve information necessary for your code?
1. Open the folder `/package/src/main/definitions/db/process/` of your maven project,
2. List `<process definition name>.def` files available,
3. For each process definition file
   * Open it, you can access / see the different properties:
      * Process definition name: it is the name of the file without the `.def` extension,
        * You can find the fully qualified name (`<bundleId>:<processDefinitionName>`) in the `name` property next to the `begin process definition` zone,
          * The fully qualified name is the one you are supposed to use in the Java or UI code,
        * For example:
```
begin process definition
   name           : com.example.sample-application:ordering-pizza
```

### Process input parameters
The Process definition input parameters are defined in the process definition in the `inputParams` section, for example:
`definition     :   "inputParams" : [ {`
* Each process input parameter has some important properties:
  * `resourceType`: the type of the process input parameter, for example `com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition` for a string input parameter, or `com.bmc.arsys.rx.standardlib.record.IntegerFieldDefinition` for a number input parameter, etc... This is important to know in order to provide the right type of value when triggering the process in the code you will generate.
  * `name`: the name of the process input parameter, this is important to know in order to provide the value with the right key when triggering the process in the code you will generate, for example if the process definition contains an input parameter named "customerName", you need to provide the value with the key "customerName" when triggering the process,
  * `description`: the description of the process input parameter, it can be helpful to understand what is the purpose of the process input parameter and what kind of value is expected for this parameter when triggering the process in the code you will generate.
  * `fieldOption`: it can be either "REQUIRED" or "OPTIONAL",
    * If the fieldOption is "REQUIRED" it means that you must provide a value for this input parameter when triggering the process,
      * Check the `defaultValue` property for this input parameter,
    * If it is "OPTIONAL" it means that you can choose to provide a value or not when triggering the process in the code you will generate,
      * Check the `defaultValue` property for this input parameter,
  * `defaultValue`: it is the default value for this input parameter, if you choose not to provide a value for this input parameter when triggering the process, the process will use the default value defined in the process definition, if there is no default value defined it will use null as default value.
    * If the fieldOption is "REQUIRED" and there is a defaultValue defined, then and you choose not to provide a value for this input parameter when triggering the process, the process will use the default value defined in the process definition,
```
   definition     :   {
   definition     :     "resourceType" : "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
   definition     :     "name" : "Customer Name",
   definition     :     "description" : "",
   definition     :     "id" : 536870913,
   definition     :     "fieldOption" : "OPTIONAL",
   definition     :     "maxLength" : 0,
   definition     :     "defaultValue" : null,
   definition     :   }
```

### Process output parameters
The Process definition output parameters are defined in the process definition in the `outputParams` section, for example:
`definition     :   "outputParams" : [ {`
* Each process output parameter has some important properties:
  * `resourceType`: the type of the process output parameter, for example `com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition` for a string output parameter, or `com.bmc.arsys.rx.standardlib.record.IntegerFieldDefinition` for a number output parameter, etc... This is important to know in order to provide the right type of value when triggering the process in the code you will generate.
  * `name`: the name of the process output parameter, this is important to know when retrieving the process output parameters after the process execution, since you will need to access the output parameter value with the right key, for example if the process definition contains an output parameter named "orderId", you need to access the value with the key "orderId" after the process execution,
  * `description`: the description of the process output parameter, it can be helpful to understand what is the purpose of the process output parameter and what kind of value is expected for this parameter when triggering the process in the code you will generate.
```
   definition     :   {
   definition     :     "resourceType" : "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
   definition     :     "name" : "fruit summary",
   definition     :     "description" : "",
   definition     :   }
```

### Process variables types
The process input and output parameters types are defined in the process definition, you can find them by looking at the `resourceType` property of the process input and output parameters, for example:
* com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition: Text,
* com.bmc.arsys.rx.standardlib.record.DecimalFieldDefinition: Decimal number,
* com.bmc.arsys.rx.standardlib.record.DateOnlyFieldDefinition: Date without time,
* com.bmc.arsys.rx.standardlib.record.DateTimeFieldDefinition: Date / time,
* com.bmc.arsys.rx.standardlib.record.BooleanFieldDefinition: Boolean,
* com.bmc.arsys.rx.standardlib.record.SelectionFieldDefinition: Integer,
* com.bmc.arsys.rx.standardlib.record.RealFieldDefinition: Real number,
* com.bmc.arsys.rx.standardlib.record.IntegerFieldDefinition: Integer,
* com.bmc.arsys.rx.standardlib.record.TimeOnlyFieldDefinition: Time,
* com.bmc.arsys.rx.standardlib.record.DecimalFieldDefinition: Decimal,
* com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition: json object (stringified), 
