import { isString, isArray, isNumber, isWeakNumber, isObject } from "./is.js";
/**
 * Delete all falsy values of the object (except 0)
 * @param source - Target object
 * @return - Processed original object
 */ export var shakeFalsy = function(source) {
    Object.keys(source).forEach(function(key) {
        var val = source[key];
        if (!val && val !== 0) {
            delete source[key];
        }
    });
    return source;
};
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
/**
 * Get value on obj through NamePath
 *
 * 通过NamePath在obj上获取值
 * */ export function getNamePathValue(obj, name) {
    if (isString(name)) {
        return obj === null || obj === void 0 ? void 0 : obj[name];
    }
    if (isArray(name) && name.length) {
        return name.reduce(function(p, i) {
            return p === null || p === void 0 ? void 0 : p[i];
        }, obj);
    }
}
/**
 * Convert NamePath to character form
 *
 * 将NamePath转换为字符形式
 * */ export function stringifyNamePath(name) {
    if (isString(name)) return name;
    return name.reduce(function(p, i) {
        if (isNumber(Number(i))) {
            return "".concat(p, "[").concat(i, "]");
        }
        if (isString(i)) {
            return p.length ? "".concat(p, ".").concat(i) : i;
        }
        return p;
    }, "");
}
/**
 * Set value on obj through NamePath
 *
 * 通过NamePath在obj上设置值
 * */ export function setNamePathValue(obj, name, val) {
    if (isString(name)) {
        obj[name] = val;
    }
    if (isArray(name) && name.length) {
        var lastObj = obj;
        for(var i = 0; i < name.length; i++){
            var n = name[i]; // 当前name
            var nextN = name[i + 1]; // 下一个name
            var hasNextN = nextN !== undefined; // 是否有下个
            if (!hasNextN) {
                lastObj[n] = val;
                return;
            }
            // 确保要操作的对象存在
            if (isWeakNumber(nextN)) {
                if (!isArray(lastObj[n])) {
                    lastObj[n] = [];
                }
            // 不是数字的话则为对象
            } else if (!isObject(lastObj[n])) {
                lastObj[n] = {};
            }
            lastObj = lastObj[n];
        }
    }
}
