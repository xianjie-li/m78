import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { isObject } from "@m78/utils";
/** 默认的表单 onChange 值获取器 */ export var _defaultValueGetter = function(value) {
    if (isObject(value) && "target" in value && "value" in value.target) {
        return value.target.value;
    }
    return value;
};
/** 默认适配器 */ export var _defaultAdaptor = function(args) {
    if (!args.element) return null;
    return args.binder(args.element, _object_spread({}, args.element.props, args.bind));
};
export var EMPTY_NAME = "__EMPTY_NAME__";
export var EMPTY_LIST_NAME = "__EMPTY_LIST_NAME__";
