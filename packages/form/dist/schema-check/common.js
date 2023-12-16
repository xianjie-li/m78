import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isArray, isFunction, isObject, stringifyNamePath } from "@m78/utils";
import { _ROOT_SCHEMA_NAME } from "../common.js";
/** 去除无效项, 并处理empty后返回验证器数组 */ export function _fmtValidator(validator, isEmpty) {
    if (isFunction(validator)) {
        // 需要进行空校验或非空时
        if (validator.checkEmpty || !isEmpty) {
            return [
                validator
            ];
        }
        return [];
    }
    if (isArray(validator)) {
        return validator.filter(function(i) {
            if (!i) return false;
            return i.checkEmpty || !isEmpty;
        });
    }
    return [];
}
/** 是否为ErrorTemplateInterpolate对象 */ export function _isErrorTemplateInterpolate(obj) {
    return isObject(obj) && "errorTemplate" in obj && "interpolateValues" in obj;
}
/** 根据schema配置和传入值检测是否有schema配置之外的值存在, 返回额外值的key字符串数组 */ export function _getExtraKeys(name, schema, value) {
    var ref;
    var extraKeys = [];
    // 如果是eachSchema或者未传入schema, 则不检测
    if (schema.eachSchema || !((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length)) return extraKeys;
    // 外部确保了name是数组
    if (!isArray(name)) return extraKeys;
    var isObjOrArr = isObject(value) || isArray(value);
    // 只对对象和数组进行检测
    if (!isObjOrArr) return extraKeys;
    var childSchema = schema.schema;
    var keys = [];
    if (isArray(value)) {
        value.map(function(_, i) {
            return keys.push(i);
        });
    } else {
        keys = Object.keys(value);
    }
    // 去除占位用的根name
    var nameClone = name.slice();
    var ind = nameClone.indexOf(_ROOT_SCHEMA_NAME);
    if (ind !== -1) {
        nameClone.splice(ind, 1);
    }
    keys.forEach(function(key) {
        var cur = childSchema.find(function(i) {
            if (i.name === undefined) return true;
            return i.name === key;
        });
        if (!cur) {
            extraKeys.push(stringifyNamePath(_to_consumable_array(nameClone).concat([
                key
            ])));
        }
    });
    return extraKeys;
}
