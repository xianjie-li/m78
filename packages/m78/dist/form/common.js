import { isObject } from "@m78/utils";
/** 默认的表单 onChange 值获取器 */ export var _defaultValueGetter = function(value) {
    if (isObject(value) && "target" in value && "value" in value.target) {
        return value.target.value;
    }
    return value;
};
