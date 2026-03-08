package com.example.bundle;

import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.action.domain.Action;
import com.bmc.arsys.rx.services.action.domain.ActionParameter;
import com.bmc.arsys.rx.services.cache.CacheConfiguration;
import com.bmc.arsys.rx.services.cache.CacheService;
import com.bmc.arsys.rx.services.cache.Cacheable;
import com.bmc.arsys.rx.services.common.Service;
import com.bmc.arsys.rx.services.common.domain.Scope;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * The idea here is to provide process activities (helpers) that will store in the
 * bundle cache some String entries.
 * The BMC documentation is misleading and is what it is, ThreadLocalContext is not exposed to the SDK for example:
 * https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/BMC-Helix-Innovation-Suite/is252/Developing-applications-by-using-BMC-Helix-Innovation-Studio/Developing-and-deploying-code-based-applications/Using-Data-Caching-Service/
 * <p>
 * The idea is we store in the bundle cache service a String entry with an Id.
 * We cannot directly save a String in the cache, we need a Cacheable object, hence the CacheableString class.
 */
public class BundleCache implements Service {
    // Bundle name, it will be used to configure the cache.
    public static final String BUNDLE_ID = "com.bmc.dsm.ask-ed";
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

    /**
     * Process activity, can only be used in this bundle.
     * Deletes all cached entries.
     */
    @Action(name = "deleteAllCachedString", scope = Scope.BUNDLE)
    public void deleteAllCachedString() {
        initializeBundleCache();

        cacheService.deleteAll(BUNDLE_ID);
    }


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
}