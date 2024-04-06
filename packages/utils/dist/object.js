import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _construct } from "@swc/helpers/_/_construct";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { isArray, isEmpty, isNumber, isObject, isString, isFunction } from "./is.js";
import { ensureArray } from "./array.js";
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
/**
 * Get value on obj through NamePath
 *
 * When name pass `[]`, will return obj directly
 * */ export function getNamePathValue(obj, name) {
    if (!_instanceof(obj, Object)) return undefined; // 过滤掉数字/字符串等
    if (isString(name) || isNumber(name)) {
        return obj === null || obj === void 0 ? void 0 : obj[name];
    }
    if (isArray(name)) {
        if (name.length) {
            return name.reduce(function(p, i) {
                return p === null || p === void 0 ? void 0 : p[i];
            }, obj);
        } else {
            return obj;
        }
    }
    return undefined;
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
 * If val is undefined, will delete the value specified by name like deleteNamePathValue() do
 * */ export function setNamePathValue(obj, name, val, skipExist) {
    if (val === undefined) {
        deleteNamePathValue(obj, name);
        return;
    }
    if (isString(name) || isNumber(name)) {
        obj[name] = val;
        return;
    }
    if (isArray(name) && name.length) {
        var _getLastObj = _sliced_to_array(getLastObj(obj, name), 2), lastObj = _getLastObj[0], n = _getLastObj[1];
        if (skipExist && lastObj[n] !== undefined) return;
        lastObj[n] = val;
    }
}
/**
 * Delete value on obj through NamePath
 * */ export function deleteNamePathValue(obj, name) {
    var prevObj;
    var lastName;
    var arrName = ensureArray(name).slice();
    if (arrName.length > 1) {
        lastName = arrName.pop();
        prevObj = getNamePathValue(obj, arrName);
    } else {
        lastName = arrName[0];
        prevObj = obj;
    }
    if (isObject(prevObj) && isString(lastName)) {
        delete prevObj[lastName];
        return;
    }
    if (isArray(prevObj) && isNumber(lastName)) {
        prevObj.splice(lastName, 1);
        return;
    }
}
var ROOT_KEY = "__DeleteNamePathValuesRootKey";
/** Delete multiple value on obj, through nameList, ensures no index misalignment when deleting the same array content multiple times */ export function deleteNamePathValues(obj, nameList) {
    // 数组为了保证索引一致, 需要特殊处理
    var arrMap = {};
    nameList.forEach(function(name) {
        var namePath = ensureArray(name).slice();
        var last = namePath.pop();
        if (last === undefined) return;
        // 记录数组
        if (isNumber(last)) {
            var k = namePath.length ? stringifyNamePath(namePath) : ROOT_KEY;
            var map = arrMap[k];
            if (!map) {
                map = {
                    name: namePath,
                    indexes: []
                };
                arrMap[k] = map;
            }
            map.indexes.push(last);
        } else {
            deleteNamePathValue(obj, name);
        }
    });
    Object.entries(arrMap).map(function(param) {
        var _param = _sliced_to_array(param, 2), _ = _param[0], val = _param[1];
        var curObj;
        if (val.name.length === 0) {
            // 根对象
            curObj = obj;
        } else {
            curObj = getNamePathValue(obj, val.name);
        }
        if (!isArray(curObj) || curObj.length === 0) return;
        // 从大到小排序索引
        var sortIndexes = val.indexes.sort(function(c, d) {
            return d - c;
        });
        // 过滤重复索引
        var removeMark = {};
        sortIndexes.forEach(function(ind) {
            if (removeMark[ind]) return;
            removeMark[ind] = true;
            curObj.splice(ind, 1);
        });
    });
}
/** 从对象中获取用于设置值的对象, 和最后一个name, 获取期间, 不存在的路径会自动创建 */ function getLastObj(obj, names) {
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
        // 不是则为对象
        } else if (!isObject(lastObj[n])) {
            lastObj[n] = {};
        }
        lastObj = lastObj[n];
    }
    throw new Error("Names can't be empty");
}
/**
 * 将首个类之外的类混入到主类中
 *
 * - 为了更好的可读性和可维护性, 若存在同名的属性/方法会抛出错误
 * - 主类/混合类的构造函数内均不能访问其他类的属性/方法, 因为尚未初始化完成
 * - 被混合类不支持继承, 继承项会直接忽略
 * - 不会处理静态方法/属性, 应统一维护到主类
 * */ export function applyMixins(MainConstructor) {
    for(var _len = arguments.length, constructors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        constructors[_key - 1] = arguments[_key];
    }
    var list = [
        MainConstructor
    ].concat(_to_consumable_array(constructors));
    if (list.length < 2) return MainConstructor;
    // 方法名: descriptor
    var methodMap = Object.create(null);
    list.forEach(function(Constr) {
        Object.getOwnPropertyNames(Constr.prototype).forEach(function(name) {
            if (methodMap[name]) {
                throw Error("Mixin: Contains duplicate method declarations -> ".concat(name, "()"));
            }
            var cur = Object.getOwnPropertyDescriptor(Constr.prototype, name);
            if (!cur) return;
            if (name !== "constructor" && (isFunction(cur.value) || isFunction(cur.get) || isFunction(cur.set))) {
                methodMap[name] = cur;
            }
        });
    });
    // 记录写入过的属性
    var propertyExist = {};
    // 待合并的属性
    var propertyMap = {};
    var Mixin = /*#__PURE__*/ function(MainConstructor) {
        "use strict";
        _inherits(Mixin, MainConstructor);
        var _super = _create_super(Mixin);
        function Mixin() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            _class_call_check(this, Mixin);
            var _this;
            _this = _super.call.apply(_super, [
                this
            ].concat(_to_consumable_array(args)));
            constructors.forEach(function(Con) {
                var ins = _construct(Con, _to_consumable_array(args));
                Object.keys(ins).forEach(function(k) {
                    if (propertyExist[k]) {
                        throw Error("Mixin: Contains duplicate property declarations -> ".concat(k));
                    }
                    if (k in _assert_this_initialized(_this)) {
                        propertyExist[k] = true;
                        return;
                    }
                    propertyMap[k] = ins[k];
                    propertyExist[k] = true;
                });
            });
            Object.assign(_assert_this_initialized(_this), propertyMap);
            return _this;
        }
        return Mixin;
    }(MainConstructor);
    Object.defineProperties(Mixin.prototype, methodMap);
    return Mixin;
}
