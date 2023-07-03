import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isArray, isEmpty, isNumber, isObject, isString } from "./is.js";
/**
 * Delete all empty values (except 0) of the object/array
 * @param source - Target object/array
 * @return - Processed original object/array
 *
 * empty values: undefined, null ,'', NaN, [], {}
 */ export function shakeEmpty(source) {
    if (isArray(source)) {
        var _source;
        var res = source.filter(function(i) {
            return !isEmpty(i) || i === 0 || i === false;
        });
        source.length = 0;
        (_source = source).splice.apply(_source, [
            0,
            0
        ].concat(_to_consumable_array(res)));
        return source;
    }
    Object.keys(source).forEach(function(key) {
        var i = source[key];
        if (isEmpty(i) && i !== 0 && i !== false) {
            delete source[key];
        }
    });
    return source;
}
/**
 * Recursion delete all empty values of the object/array, use shakeEmpty() internally, return the processed original object/array
 * */ export function recursionShakeEmpty(source) {
    var handle = function(i) {
        if (isObject(i) || isArray(i)) {
            recursionShakeEmpty(i);
        }
    };
    if (isArray(source)) {
        source.forEach(handle);
    }
    if (isObject(source)) {
        Object.keys(source).forEach(function(k) {
            return handle(source[k]);
        });
    }
    return shakeEmpty(source);
}
function pickOrOmit(obj, props) {
    var isPick = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    if (isString(props)) {
        props = props.split(",").map(function(key) {
            return key.trim();
        });
    }
    var keys = Object.keys(obj);
    var result = {};
    keys.forEach(function(item) {
        var cond = isPick ? props.indexOf(item) !== -1 : props.indexOf(item) === -1;
        if (cond) {
            result[item] = obj[item];
        }
    });
    return result;
}
/**
 * Deletes the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be removed, comma separated string or string array
 * @return - New object after removal
 * */ export function omit(obj, props) {
    return pickOrOmit(obj, props);
}
/**
 * Pick the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be selected, comma separated string or string array
 * @return - A new object containing the selection key value
 * */ export function pick(obj, props) {
    return pickOrOmit(obj, props, true);
}
/** Get value on obj through NamePath */ export function getNamePathValue(obj, name) {
    if (!(obj instanceof Object)) return undefined; // 过滤掉数字/字符串等
    if (isString(name) || isNumber(name)) {
        return obj === null || obj === void 0 ? void 0 : obj[name];
    }
    if (isArray(name) && name.length) {
        return name.reduce(function(p, i) {
            return p === null || p === void 0 ? void 0 : p[i];
        }, obj);
    }
}
/** Convert NamePath to string */ export function stringifyNamePath(name) {
    if (isString(name) || isNumber(name)) return String(name);
    return name.reduce(function(p, i) {
        if (isNumber(i)) {
            return p.length ? "".concat(p, "[").concat(i, "]") : String(i);
        }
        if (isString(i)) {
            return p.length ? "".concat(p, ".").concat(i) : i;
        }
        return p;
    }, "");
}
/**
 * Set value on obj through NamePath, if skipExist is passed in, the value will be skipped if it already exists
 *
 * 通过NamePath在obj上设置值, 如果传入skipExist, 在值已存在时会跳过
 * */ export function setNamePathValue(obj, name, val, skipExist) {
    if (isString(name) || isNumber(name)) {
        obj[name] = val;
        return;
    }
    if (isArray(name) && name.length) {
        var ref = _sliced_to_array(getLastObj(obj, name), 2), lastObj = ref[0], n = ref[1];
        if (skipExist && lastObj[n] !== undefined) return;
        lastObj[n] = val;
    }
}
/**
 * Delete value on obj through NamePath
 *
 * 通过NamePath在obj上删除值
 * */ export function deleteNamePathValue(obj, name) {
    if (isString(name)) {
        delete obj[name];
        return;
    }
    if (isNumber(name)) {
        obj.splice(name, 1);
        return;
    }
    if (isArray(name) && name.length) {
        var ref = _sliced_to_array(getLastObj(obj, name), 2), lastObj = ref[0], n = ref[1];
        isNumber(n) ? lastObj.splice(n, 1) : delete lastObj[n];
    }
}
/** 从对象中获取用于设置值的对象, 和最后一个name */ function getLastObj(obj, names) {
    var lastObj = obj;
    for(var i = 0; i < names.length; i++){
        var n = names[i]; // 当前name
        var nextN = names[i + 1]; // 下一个name
        var hasNextN = nextN !== undefined; // 是否有下个
        if (!hasNextN) {
            return [
                lastObj,
                n
            ];
        }
        // 确保要操作的对象存在
        if (isNumber(nextN)) {
            if (!isArray(lastObj[n])) {
                lastObj[n] = [];
            }
        // 不是数字的话则为对象
        } else if (!isObject(lastObj[n])) {
            lastObj[n] = {};
        }
        lastObj = lastObj[n];
    }
    throw new Error("Names can't be empty");
}
