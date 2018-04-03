const NodeCache = require('node-cache');

class LocalMemoryCache {

    constructor(logger) {
        this._logger = logger;
        this._cache  = new NodeCache({ stdTTL: 900 }); // time to live -> 900 sec = 15 minutes
        this._logger.debug(`${LocalMemoryCache.name} - constructor`);
    }

    putValueInCache(key, value, ttlSec) {
        this._logger.debug(`${LocalMemoryCache.name} - putValueInCache`);
        return this._cache.set(key, value, ttlSec);
    }

    getCachedValue(key) {
        this._logger.debug(`${LocalMemoryCache.name} - getCachedValue`);
        return this._cache.get(key);
    }

    getTTLByKey(key) {
        this._logger.debug(`${LocalMemoryCache.name} - getCachedValue`);
        return this._cache.getTtl(key);
    }

    updateTTLByKey(key, ttlSec) {
        this._logger.debug(`${LocalMemoryCache.name} - getCachedValue`);
        return this._cache.ttl(key, ttlSec);
    }
}

LocalMemoryCache.diProperties = { name: 'cacheWrapper', type: 'class', singleton: true };
LocalMemoryCache.inject       = ['logger'];

module.exports = LocalMemoryCache;