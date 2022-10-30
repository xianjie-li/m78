import { isArray, isFunction, isObject } from "@m78/utils";
/** 根schema的默认name */ export var SOURCE_ROOT_NAME = "M78_VERIFY_ROOT_NAME";
/** 格式化并返回验证器数组 */ export function fmtValidator(validator, isEmpty) {
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
/** 是否为ErrorTemplateInterpolate对象 */ export function isErrorTemplateInterpolate(obj) {
    return isObject(obj) && "errorTemplate" in obj && "interpolateValues" in obj;
}
