# Definition
Innovation Studio is a production from BMC Helix.  
A DatapageQuery allows End Users to query data from different data sources, such as BMC Remedy AR System forms, or external databases.  
By default, Innovation Studio provides a set of standard DatapageQuery types, for example to search data in Records, but End Users can create custom DatapageQuery types in Java, to connect to other data sources.  
Usually DatapageQuery types are used in Rest Api endpoints.  
A DatapageQuery returns a DataPage Object, which is a collection of Objects.  
You can check how to create a new DatapageQuery [here](./ObjectTypes/datapagequery.md).


# DataPageQuery
You can create a Java class extending `DataPageQuery` from `com.bmc.arsys.rx.services.common.DataPageQuery`. This class usually contains only one method `execute()` that will be executed when the Command is triggered.  
The name of the datapage query is a combination of the package name and the class name:
* `<packageName>.<className>`,
  * For example:
    * public class SimpleDataPageQuery
      * `com.example.bundle.SimpleDataPageQuery`
The input parameters DataPageQueryParameters from `com.bmc.arsys.rx.services.common.DataPageQueryParameters`  are standard, such as pageSize, pageNumber, sortBy etc... and come in the class constructor method signature.
The constructor is needed and is in charge of collecting the DataPageQueryParameters.  
```java
import com.bmc.arsys.rx.services.common.DataPageQuery;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;

public class SimpleDataPageQuery extends DataPageQuery {
    // Variable that will be modified by the constructor call.
    private int pageSize = 50;
    private int startIndex = 0;
    
    // Constructor.
    // Setting the query parameters and getting required parameters.
    public SimpleDataPageQuery(DataPageQueryParameters dataPageQueryParameters) {
        super(dataPageQueryParameters);

        // Those two parameters are a datapage required parameters.
        pageSize = dataPageQueryParameters.getPageSize();
        startIndex = dataPageQueryParameters.getStartIndex();
    }
}
```

_Note:_  
You can also get the DataPageQueryParameters using the parent class DataPageQuery method `getDataPageQueryParameters()` and its method `getQueryPredicatesByName()` that returns a Map of QueryPredicate objects from `com.bmc.arsys.rx.services.common.QueryPredicate`.  
Then we can leverage the `get()` method to fetch one specific QueryPredicate by its name, and finally get the value using the `getRightOperand()` method. 
  
The available parameters are:
* dataPageType: datapage query name, for example com.example.bundle.SimpleDataPageQuery,
* pageSize: How many records we want to fetch,
  * The best practice is to use the value is -1 constant (infinite) when asked to get all possible record instances,
  ```java
  import com.bmc.arsys.rx.services.common.DataPage;
  int pageSize = DataPage.INFINITE_PAGE_SIZE;
  ```
  * Else you can use 50, which is the default pageSize in Innovation Studio,
* startIndex: Start index, that is used for pagination, it is the index where we will start fetching records from (0 being starting returning from the first record),
* queryExpression: qualification expression for the search,
* sortBy: List of fieldsid used for sorting the results, comma separated, (there is a leading - for descending order),
```java
import com.bmc.arsys.rx.services.common.QueryPredicate;
        
    /**
     * Helper method to extract a parameter value from the query predicates.
     * 
     * @param key - name of the parameter
     * @return - the value
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
```

The `execute()` method will be executed when the DataPageQuery is called. It needs to return a DataPage object from `com.bmc.arsys.rx.services.common.DataPage`.  
As a rule of thumb, some Innovation Studio decorators `@RxDefinitionTransactional` and `@AccessControlledMethod` need to be added as well, to let the method access record instances.  
A DataPage object usually contains a list of instances of a class created by the End User, for example Fruit in the example below, and the collection size.  
```java
import com.bmc.arsys.rx.services.common.DataPage;
import com.bmc.arsys.rx.services.common.DataPageQuery;
import com.bmc.arsys.rx.services.common.DataPageQueryParameters;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import org.springframework.transaction.annotation.Isolation;
import java.util.ArrayList;
import java.util.List;

public class SimpleDataPageQuery extends DataPageQuery {
    // Variable that will be modified by the constructor call.
    private int pageSize = 50;
    private int startIndex = 0;

    // Constructor.
    // Setting the query parameters and getting required parameters.
    public SimpleDataPageQuery(DataPageQueryParameters dataPageQueryParameters) {
        super(dataPageQueryParameters);

        // Those two parameters are a datapage required parameters.
        pageSize = dataPageQueryParameters.getPageSize();
        startIndex = dataPageQueryParameters.getStartIndex();
    }

    @Override
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(authorization = AccessControlledMethod.AuthorizationLevel.SubAdministrator, licensing = AccessControlledMethod.LicensingLevel.Application, checkSchemaForSpecialAccess = true, promoteStructAdmin = true)
    public DataPage execute() {
        List<Fruit> fruitList = new ArrayList<>();

        // Adding a couple of fruits as an example.
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
        
        // Adding fruits to the list.
        fruitList.add(banana);
        fruitList.add(apple);

        // Returns the data, allowing Jackson to serialize it for us.
        return new DataPage(fruitList.size(), fruitList);
    }
}
```

# How to get the list of available record definitions?
The record definitions are stored in the folder `/package/src/main/definitions/db/record/` of your maven project in a `.def` file extension.  
Check the instructions [here](../Services/GettingRecordDefinition.md) to learn how to get the list of available record definitions, and their fieldIds.


# Qualification / expression building
A qualification is used in BPMN process activities to define conditions, for example in an Exclusive Gateway to route the process flow based on the end user intent.  
It is also used in Innovation Studio / AR System Java code to filter data when querying Records or other data sources.  
The qualification is a series of expressions combined using logical operators, and is used to filter data or route the process flow.  
It is a bit tricky to build, you can check how to build a qualification [here](../Services/Qualification.md).


# Code location
The class should be created in the /bundle/src/main/java folder.


# Special instructions
Be careful of the class package name, it should be the one from the file `/bundle/src/main/java/com/example/bundle/MyApplication.java`


# Registration
You need to declare the class in the file `/bundle/src/main/java/com/example/bundle/MyApplication.java` in its `register()` method, leveraging the `registerClass()` method, for example:
```java
    protected void register() {
        //
        // TODO: Register static web resources and framework extensions.
        //
        // registerService(new MyService());
        //

        // Registering custom datapagequery.
        registerClass(SimpleDataPageQuery.class);

        registerStaticWebResource(String.format("/%s", getId()), "/webapp");
    }
```


# Example:
You can find an example of implementation in the folder [Examples/DatapageQuery](./Examples/DataPageQuery/):
* The class [Examples/DataPageQuery/SimpleDataPageQuery.java](./Examples/DataPageQuery/SimpleDataPageQuery.java) implements a simple DataPageQuery that returns a DataPage object.
* The class [Examples/DataPageQuery/Fruit.java](./Examples/DataPageQuery/Fruit.java) implements a simple class that will be used in the DataPage object.


# Allowed Innovation Studio Services
When creating a new Rest Api, you should use the Out Of The Box services provided in Innovation Studio SDK, the list is in the file [services.md](../Services/services-list.md).
