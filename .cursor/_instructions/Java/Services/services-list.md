# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to extend the capabilities of Business Processes using Java code, here are the different possible extensions.  
Several services are provided by the Innovation Studio SDK, and should be used in your Java code to interact with Innovation Studio features, such as data access, logging, security etc...

# Services list
Here is a non-exhaustive list of the main services provided by the Innovation Studio SDK, and their entry points to get information on them:
* **ServiceLocator.getLogger()**: Used to log messages in the Innovation Studio logs.
  * Documentation: [Creating logs](./logs.md)
* **RecordService**: Used to create, read, update, delete records in BMC Helix Innovation Studio Record Definitions and BMC Remedy AR System forms.  
  * Entry point: `com.bmc.arsys.rx.services.record.RecordService`  
  * Documentation: [RecordService](./records.md)
* **CacheService**: Used to store and retrieve data in the Innovation Studio cache, for a specific bundle.  
  * Entry point: `com.bmc.arsys.rx.services.cache.CacheService`  
  * Documentation: [CacheService](./cache.md)
