# Definition
Innovation Studio is a production from BMC Helix.  
Innovation Studio allows End Users to extend the capabilities of Business Processes using Java code, here are the different possible extensions.  
Innovation Studio allows Developer to store data in a memory cache. The cache size is however limited.


# CacheService
The CacheService allows Developer to store and retrieve data in the Innovation Studio cache, for a specific bundle.  
The CacheService is located in the package `com.bmc.arsys.rx.services.cache.CacheService`.  

## Initialize the CacheService
To use the CacheService, you need to inject it in your Java class, and initialize it for the current bundle (this is very important), as the data will be stored in the context of the bundle.    
The bundleId is a combination of the maven project groupId and artifactId from `/bundle/pom.xml`:
```
<groupId>.<artifactId>
```
You can find the groupId and artifactId in the `/bundle/pom.xml` file.

**Example:**
If your `/bundle/pom.xml` has:
```xml
<groupId>com.example</groupId>
<artifactId>sample-application</artifactId>
```
Then your bundleId will be: `com.example.sample-application`

Initialization example, here, as part of a [process activity](../ObjectTypes/process-activity.md):
```java
package com.example.bundle;

import com.bmc.arsys.rx.services.cache.CacheService;
import com.bmc.arsys.rx.services.cache.CacheConfiguration;
import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.common.Service;
// ...

public class BundleCache implements Service {
    // Bundle name, it will be used to configure the cache.
    public static final String BUNDLE_ID = "com.example.sample-application";
    private final CacheService cacheService = ServiceLocator.getCacheService();

    /**
     * Creating the cache for the bundle, if necessary. Might be necessary in
     * server group systems.
     */
    private void initializeBundleCache() {
        if (!cacheService.cacheExists(BUNDLE_ID)) {
            cacheService.createCache(new CacheConfiguration(BUNDLE_ID));
        }
    }
}
```

## Store data in the cache
To store data in the cache:
* You first need to check the cache is initialized for the bundle (here calling the `initializeBundleCache()` method),
* Prepare a cacheable object, implementing `Cacheable` from `com.bmc.arsys.rx.services.cache.Cacheable`,
  * The Cacheable object must have a unique id, used to retrieve it later,
  * Here is an example of a Cacheable object storing a String value:
```java
import com.bmc.arsys.rx.services.cache.Cacheable;
// ...
CacheableString cacheableString = new CacheableString(key, value);
```
* Delete the existing entry, if it exists, and then add it to the cache:
```java
        // If the cache entry already exists it will trigger an exception, we need to delete it.
        if (cacheService.get(BUNDLE_ID, cacheableString.getId()) != null) {
            cacheService.delete(BUNDLE_ID, cacheableString.getId());
        }

        cacheService.create(BUNDLE_ID, cacheableString);
```

```java
import com.bmc.arsys.rx.services.cache.Cacheable;
import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.common.domain.Scope;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
// ...

    /**
     * Process activity, can only be used in this bundle.
     * Stores a String in the bundle cache service under an Id.
     *
     * @param key   String, id of the cache entry.
     * @param value String, value that will be stored in the Cache
     */
    @Action(name = "cacheString", scope = Scope.BUNDLE)
    public void cacheString(
            @ActionParameter(name = "key") @NotBlank @NotNull String key,
            @ActionParameter(name = "value") @NotBlank @NotNull String value
    ) {
        initializeBundleCache();

        CacheableString cacheableString = new CacheableString(key, value);

        // If the cache entry already exists it will trigger an exception, we need to delete it.
        if (cacheService.get(BUNDLE_ID, cacheableString.getId()) != null) {
            cacheService.delete(BUNDLE_ID, cacheableString.getId());
        }

        cacheService.create(BUNDLE_ID, cacheableString);
    }
```

## Delete cache entry
To delete a cache entry, you can use the `delete()` method of the CacheService, providing the bundleId and the id of the cacheable object.
```java
cacheService.delete(BUNDLE_ID, key);
```
Here is an example, based on a process activity:
```java
    /**
     * Process activity, can only be used in this bundle.
     * Deletes a Cached entry, matching the id stored in key.
     *
     * @param key String, id of the cache entry.
     */
    @Action(name = "deleteCachedString", scope = Scope.BUNDLE)
    public void deleteCachedString(
            @ActionParameter(name = "key") @NotBlank @NotNull String key
    ) {
        initializeBundleCache();

        cacheService.delete(BUNDLE_ID, key);
    }
```

## Delete all cache
To delete all cache entries, you can use the `deleteAll()` method of the CacheService, providing the bundleId.
```java
cacheService.deleteAll(BUNDLE_ID);
```
Here is an example, based on a process activity:
```java
    /**
     * Process activity, can only be used in this bundle.
     * Deletes all cached entries.
     */
    @Action(name = "deleteAllCachedString", scope = Scope.BUNDLE)
    public void deleteAllCachedString() {
        initializeBundleCache();

        cacheService.deleteAll(BUNDLE_ID);
    }
```

## Reset all cache
To reset all cache entries, you can use the `resetCache()` method of the CacheService, providing the bundleId.
```java
cacheService.resetCache(BUNDLE_ID);
```
Here is an example, based on a process activity:
```java
    /**
     * Process activity, can only be used in this bundle.
     * Resets all cached entries (no idea what this does, same thing as deleteAll
     * or does it delete the cache for the bundle too).
     */
    @Action(name = "resetCachedStrings", scope = Scope.BUNDLE)
    public void resetCachedStrings() {
        initializeBundleCache();

        cacheService.resetCache(BUNDLE_ID);
    }
```

## Fetch a cache entry
To fetch one data entry stored in the cache, you need to pass the bundleId and the id of the cacheable object to the `get()` method of the CacheService:
```java
Cacheable cacheableObject = cacheService.get(BUNDLE_ID, key);

if (cacheableObject instanceof CacheableString) {
    return ((CacheableString) cacheableObject).getValue();
}
```
Here is an example, based on a process activity:
```java
    /**
     * Process activity, can only be used in this bundle.
     * Fetches a String in the bundle cache service stored under an Id.
     *
     * @param key String, id of the cache entry.
     * @return String, value of the cache entry matching the Id (key). null if not found.
     */
    @Action(name = "getCachedString", scope = Scope.BUNDLE)
    public String getCachedString(
            @ActionParameter(name = "key") @NotBlank @NotNull String key
    ) {
        initializeBundleCache();

        Cacheable cacheableObject = cacheService.get(BUNDLE_ID, key);

        if (cacheableObject instanceof CacheableString) {
            return ((CacheableString) cacheableObject).getValue();
        }

        return null;
    }
```


# Code sample
You can see a full code sample of a process activity using the CacheService in the [BundleCache.java](./Examples/BundleCache.java) file.
