# Definition
Innovation Studio is a production from BMC Helix.  
A view is a combination of UI element that can interact with each other and that can display data from record definitions for example. It is used as a User Interface the End User can interact with. It can be a console displaying a list of orders, or a form allowing to create a new order, or anything else.  
A view can have input parameters that can be provided when opening the view, and output parameters that can be retrieved after the view is closed.  

In order to use the view definition in the code you will generate, you need to be able to discover which view definitions are available.  
The view definitions are stored in the folder `/package/src/main/definitions/db/view/` of your maven project in a `.def` file extension.

## How to read a view definition .def file?
A .def file is a json formatted file that contains all the information about the view definition, however, it contains on most of its line a prefix that needs to be removed if you want to parse it as json.
* The file contains
    * A header, `begin view definition`,
    * A name property that contains the fully qualified name of the view definition, for example `   name           : com.example.sample-application:Pizza console`,
        * A json object defining the object, however each line is prefixed by `   definition     : ` that needs to be removed to parse the json object, for example
          ```
            begin view definition
            name           : com.example.sample-application:Pizza console
            definition     : {
            definition     :   "version" : null,
            definition     :   "lastUpdateTime" : 1771051215311,
            definition     :   "lastChangedBy" : "ARSERVER",
            definition     :   "owner" : "ARSERVER",
            definition     :   "name" : "com.example.sample-application:Pizza console",
          ```
            * A footer, `end`,

Truncated example of a .def file type `view`:
```
begin view definition
   name           : com.example.sample-application:Pizza console
   definition     : {
   definition     :   "name" : "com.example.sample-application:Pizza console",
   definition     : }
end

```

## How to retrieve information necessary for your code?
1. Open the folder `/package/src/main/definitions/db/view/` of your maven project,
   2. Ignore the file `BMC Modern Shell.def` which is actually the menu definition file (shell displayed on top of the other views),
2. List `<view definition name>.def` files available,
3. For each view definition file
    * Open it, you can access / see the different properties:
        * View definition name: it is the name of the file without the `.def` extension,
            * You can find the fully qualified name (`<bundleId>:<processDefinitionName>`) in the `name` property next to the `begin view definition` zone,
                * The fully qualified name is the one you are supposed to use in the UI code,
            * For example:
```
begin view definition
   name           : com.example.sample-application:Pizza console
```

### View definition input parameters
The View definition input parameters are defined in the view definition in the `inputParams` section, for example:
`definition     :   "inputParams" : [ {`
* Each view input parameter has some important properties:
  * `name`: the name of the view input parameter, this is important to know in order to provide the value with the right key when triggering the view in the code you will generate, for example if the view definition contains an input parameter named "customerName", you need to provide the value with the key "customerName" when opening the view,
```
   definition     :   {
   definition     :     "name" : "customerName"
   definition     :   }
```
  
_Note:_  
The view input parameters are always optional and without type, so assume the type is `text`.

### View definition output parameters
The view definition output parameters are defined in the view definition in the `outputParams` section, for example:
`definition     :   "outputParams" : [ {`
* Each view output parameter has some important properties:
  * `name`: the name of the view output parameter, this is important to know when retrieving the view output parameters after the view is closed, since you will need to access the output parameter value with the right key, for example if the view definition contains an output parameter named "orderId", you need to access the value with the key "orderId" after the view is closed,
```
   definition     :   {
   definition     :     "name" : "orderId",
   definition     :   }
```
  
_Note:_  
The view output parameters are always optional and without type, so assume the type is `text`.
