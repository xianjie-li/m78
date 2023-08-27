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
    var include = options.include, exclude = options.exclude, deepEqual = options.deepEqual, skipReferenceType = options.skipReferenceType;
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
        var hasInclude = false;
        if (isArray(include)) {
            if (include.includes(key)) {
                hasInclude = true;
            } else {
                return;
            }
        } else if (isFunction(include)) {
            if (include(key, nextValue)) {
                hasInclude = true;
            } else {
                return;
            }
        }
        var prevValue = prev[key];
        if (!hasInclude) {
            if (isArray(include) && !include.includes(key)) return;
            if (isFunction(include) && !include(key, nextValue)) return;
            if (isArray(exclude) && exclude.includes(key)) return;
            if (isFunction(exclude) && exclude(key, nextValue)) return;
            if (skipReferenceType) {
                if (typeof prevValue === "object" && typeof nextValue === "object") return;
            }
        }
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
