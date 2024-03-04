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
/**
 * Deep check values is equal
 *
 * All arrays/objects will be expanded and check, while all other types of values will just check reference.
 * */ export function simplyEqual(value, value2) {
    if (isObject(value)) {
        var keys1 = Object.keys(value);
        if (!isObject(value2)) return false;
        var keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length) return false;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = keys1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var k = _step.value;
                var v = value[k];
                var v2 = value2[k];
                var equal = simplyEqual(v, v2);
                if (!equal) return false;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return true;
    }
    if (isArray(value)) {
        if (!isArray(value2)) return false;
        if (value.length !== value2.length) return false;
        for(var i = 0; i < value.length; i++){
            var v1 = value[i];
            var v21 = value2[i];
            var equal1 = simplyEqual(v1, v21);
            if (!equal1) return false;
        }
        return true;
    }
    return value === value2;
}
