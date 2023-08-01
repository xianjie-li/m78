import { isArray, isFunction } from "@m78/utils";
import isEqual from "lodash/isEqual.js";
import { usePrev } from "../use-prev/use-prev.js";
/**
 * compare props and prev props, return changed props
 *
 * The main use case is to develop react components with the existing js version library
 *
 * return null if equal or first render
 * */ export function usePropsChange(props) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var omit = options.omit, deepEqual = options.deepEqual;
    var prev = usePrev(props);
    // first render return all props directly
    if (!prev) return props;
    var prevKeys = Object.keys(prev);
    var keys = Object.keys(props);
    var keyExistCheck = {};
    var allKeys = [];
    prevKeys.concat(keys).forEach(function(key) {
        if (keyExistCheck[key]) return;
        allKeys.push(key);
        keyExistCheck[key] = true;
    });
    var changes = {};
    var hasChanged = false;
    allKeys.forEach(function(key) {
        var nextValue = props[key];
        if (isArray(omit) && omit.includes(key)) return;
        if (isFunction(omit) && omit(key, nextValue)) return;
        var prevValue = prev[key];
        if (isArray(deepEqual) && deepEqual.includes(key) || isFunction(deepEqual) && deepEqual(key, nextValue)) {
            if (isEqual(prevValue, nextValue)) return;
        } else {
            if (Object.is(prevValue, nextValue)) return;
        }
        hasChanged = true;
        changes[key] = nextValue;
    });
    return hasChanged ? changes : null;
}
