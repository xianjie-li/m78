import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useFn } from "../../index.js";
import { __GLOBAL__ } from "@m78/utils";
import { useState } from "react";
/** 缓存key前缀 */ var BASE_KEY = "USE_STORAGE_CACHE";
var getCacheKey = function(key) {
    return "".concat(BASE_KEY, "_").concat(key.toUpperCase());
};
var getCacheTimeKey = function(key) {
    return "".concat(BASE_KEY, "_").concat(key.toUpperCase(), "_AT");
};
/** 用于缓存的环境api */ var storageMethod = {
    local: __GLOBAL__.localStorage,
    session: __GLOBAL__.sessionStorage
};
function setStorage(key, val) {
    var type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "session";
    if (val === undefined) return;
    var method = storageMethod[type];
    if (!method) return;
    method.setItem(getCacheKey(key), JSON.stringify(val));
    method.setItem(getCacheTimeKey(key), String(Date.now()));
}
function getStorage(key) {
    var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "session", validTime = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    var method = storageMethod[type];
    if (!method) return null;
    var cache = method.getItem(getCacheKey(key));
    if (cache === null) return null;
    var cacheTime = Number(method.getItem(getCacheTimeKey(key)));
    var data = JSON.parse(cache);
    if (!validTime || Number.isNaN(cacheTime) || !cacheTime) return data;
    var diff = Date.now() - (validTime + cacheTime);
    if (diff > 0) {
        remove(key, type);
        return null;
    }
    return data;
}
function remove(key) {
    var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "session";
    var method = storageMethod[type];
    if (!method) return;
    method.removeItem(getCacheKey(key));
    method.removeItem(getCacheTimeKey(key));
}
var defaultOptions = {
    type: "session",
    disabled: false,
    validTime: 0
};
/**
 * 基础缓存逻辑实现
 * */ function useStorageBase(key, initState, options) {
    var opt = _object_spread({}, defaultOptions, options);
    var _useState = _sliced_to_array(useState(function() {
        if (!opt.disabled) {
            var cache = getStorage(key, opt.type, options === null || options === void 0 ? void 0 : options.validTime);
            if (cache !== null) {
                // null以外的值都视为缓存
                return cache;
            }
        }
        if (_instanceof(initState, Function)) {
            var _initState = initState();
            !opt.disabled && setStorage(key, _initState, opt.type);
            return _initState;
        }
        !opt.disabled && setStorage(key, initState, opt.type);
        return initState;
    }), 2), state = _useState[0], setState = _useState[1];
    var memoSetState = useFn(function(patch) {
        if (_instanceof(patch, Function)) {
            setState(function(prev) {
                var patchRes = patch(prev);
                !opt.disabled && setStorage(key, patchRes, opt.type);
                return patchRes;
            });
        } else {
            !opt.disabled && setStorage(key, patch, opt.type);
            setState(patch);
        }
    });
    return [
        state,
        memoSetState
    ];
}
/**
 * useState的storage版本
 * */ export var useStorageState = Object.assign(useStorageBase, {
    get: getStorage,
    set: setStorage,
    remove: remove
});
