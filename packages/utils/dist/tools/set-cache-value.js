var CACHE_PREFIX = "__M78SetCacheKey";
/**
 * Set a value for the object and cache the value. In subsequent settings, a comparison will be made with the cached value, and if there is no change, the setting action will be skipped.
 *
 * If passed in cb, the value is no longer set directly internally, but is set by the user in the callback
 *  */ export function setCacheValue(obj, key, val, cb) {
    var k = "".concat(CACHE_PREFIX, "__").concat(key);
    var cache = obj[k];
    // 设置新值
    if (cache === undefined || cache !== val) {
        if (cb) cb();
        else obj[key] = val;
        obj[k] = val;
        return;
    }
// 缓存相同, 跳过
}
