import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { getNamePathValue, setNamePathValue } from "./object.js";
import { isArray, isObject } from "./is.js";
/**
 * return the 'global' object according to different JS running environments
 * */ export function getGlobal() {
    // eslint-disable-next-line no-restricted-globals
    if (typeof self !== "undefined") {
        // eslint-disable-next-line no-restricted-globals
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    // @ts-ignore
    if (typeof global !== "undefined") {
        // @ts-ignore
        return global;
    }
    throw new Error("unable to locate global object");
}
export var __GLOBAL__ = getGlobal();
/**
 * create a CustomEvent
 * */ export function createEvent() {
    var listeners = [];
    function on(listener, filter) {
        setNamePathValue(listener, "__eventFilter", filter);
        listeners.push(listener);
    }
    function off(listener) {
        var ind = listeners.indexOf(listener);
        if (ind !== -1) {
            var del = listeners.splice(ind, 1);
            setNamePathValue(del[0], "__eventFilter", undefined);
        }
    }
    function emit() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        listeners.forEach(function(listener) {
            var filter = getNamePathValue(listener, "__eventFilter");
            if (filter && !filter.apply(void 0, _to_consumable_array(args))) return;
            listener.apply(void 0, _to_consumable_array(args));
        });
    }
    function empty() {
        listeners.length = 0;
    }
    return {
        on: on,
        off: off,
        emit: emit,
        empty: empty,
        get length () {
            return listeners.length;
        }
    };
}
/** 抛出错误 */ export function throwError(msg, prefix) {
    throw new Error("".concat(prefix ? "".concat(prefix, ":: ") : "").concat(msg));
}
/** Deep cloning implemented using JSON.parse/stringify */ export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * "Deep clone" given value
 *
 * All arrays/objects will be expanded and cloned, while all other types of values will remain unchanged.
 * */ export function simplyDeepClone(value) {
    if (isObject(value)) {
        var newObj = {};
        Object.keys(value).forEach(function(k) {
            newObj[k] = simplyDeepClone(value[k]);
        });
        return newObj;
    }
    if (isArray(value)) {
        var newArr = value.slice();
        newArr.forEach(function(i, ind) {
            newArr[ind] = simplyDeepClone(i);
        });
        return newArr;
    }
    return value;
}
