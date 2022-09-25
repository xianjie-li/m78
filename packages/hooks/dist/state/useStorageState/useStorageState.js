import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useFn } from "../../";
import { __GLOBAL__ } from "@m78/utils";
import { useState } from "react";
var BASE_KEY = "USE_STORAGE_CACHE";
var storagMethod = {
    local: __GLOBAL__.localStorage,
    session: __GLOBAL__.sessionStorage
};
function setStorage(key, val) {
    var type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "session";
    if (val === undefined) return;
    var method = storagMethod[type];
    if (!method) return;
    method.setItem("".concat(BASE_KEY, "_").concat(key.toUpperCase()), JSON.stringify(val));
}
function getStorage(key) {
    var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "session";
    var method = storagMethod[type];
    if (!method) return;
    var cache = method.getItem("".concat(BASE_KEY, "_").concat(key.toUpperCase()));
    return cache === null ? cache : JSON.parse(cache);
}
function remove(key) {
    var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "session";
    var method = storagMethod[type];
    if (!method) return;
    method.removeItem("".concat(BASE_KEY, "_").concat(key.toUpperCase()));
}
var defaultOptions = {
    type: "session",
    disabled: false
};
function useStorageBase(/** 缓存key */ key, /** 初始状态 */ initState, /** 其他选项 */ options) {
    var opt = _object_spread({}, defaultOptions, options);
    var ref = _sliced_to_array(useState(function() {
        if (!opt.disabled) {
            var cache = getStorage(key, opt.type);
            if (cache !== null) {
                // null以外的值都视为缓存
                return cache;
            }
        }
        if (initState instanceof Function) {
            var _initState = initState();
            !opt.disabled && setStorage(key, _initState, opt.type);
            return _initState;
        }
        !opt.disabled && setStorage(key, initState, opt.type);
        return initState;
    }), 2), state = ref[0], setState = ref[1];
    var memoSetState = useFn(function(patch) {
        if (patch instanceof Function) {
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
export var useStorageState = Object.assign(useStorageBase, {
    get: getStorage,
    set: setStorage,
    remove: remove
});
