import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import React, { useState, useEffect } from "react";
import { useSelf } from "@m78/hooks";
import { isNumber, isString, isTruthyOrZero } from "@m78/utils";
/** 禁止冒泡的便捷扩展对象 */ export var stopPropagation = {
    onClick: function(e) {
        e.stopPropagation();
    }
};
/** throw error */ export function throwError(errorMsg, namespace) {
    throw new Error("M78\uD83D\uDCA5 -> ".concat(namespace ? "".concat(namespace, " -> ") : "", " ").concat(errorMsg));
}
export function sendWarning(msg, namespace) {
    console.log("M78\uD83D\uDCA2 -> ".concat(namespace ? "".concat(namespace, " -> ") : "", " ").concat(msg));
}
export function useDelayToggle(toggle, options) {
    var ref = options || {}, _leading = ref.leading, leading = _leading === void 0 ? 300 : _leading, _trailing = ref.trailing, trailing = _trailing === void 0 ? 600 : _trailing;
    var isDisabled = !trailing && !leading;
    // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
    var ref1 = _sliced_to_array(useState(!leading ? toggle : false), 2), innerState = ref1[0], setInnerState = ref1[1];
    var self = useSelf({
        toggleTimer: null
    });
    useEffect(function() {
        if (isDisabled) return;
        if (toggle && !leading || !toggle && !trailing) {
            toggle !== innerState && setInnerState(toggle);
            return;
        }
        var d = toggle ? leading : trailing;
        self.toggleTimer = setTimeout(function() {
            setInnerState(toggle);
        }, d);
        return function() {
            self.toggleTimer && clearTimeout(self.toggleTimer);
        };
    }, [
        toggle
    ]);
    return isDisabled ? toggle : innerState;
}
export var DEFAULT_VALUE_KEY = "value";
export var DEFAULT_LABEL_KEY = "label";
export var DEFAULT_CHILDREN_KEY = "children";
/** 从DataSourceItem中获取value, 如果未获取到并且label是字符串时, 使用label作为value, 支持自定义取值的key */ export function getValueByDataSource(item, cus) {
    var valueKey = (cus === null || cus === void 0 ? void 0 : cus.valueKey) || DEFAULT_VALUE_KEY;
    var labelKey = (cus === null || cus === void 0 ? void 0 : cus.labelKey) || DEFAULT_LABEL_KEY;
    if (isTruthyOrZero(item[valueKey])) return item[valueKey];
    if (isString(item[labelKey]) || isNumber(item[labelKey])) {
        return item[labelKey];
    }
    return null;
}
/** 从DataSourceItem中获取label, 如果未获取到并且value是有效时, 使用value作为label, 支持自定义取值的key */ export function getLabelByDataSource(item, cus) {
    var valueKey = (cus === null || cus === void 0 ? void 0 : cus.valueKey) || DEFAULT_VALUE_KEY;
    var labelKey = (cus === null || cus === void 0 ? void 0 : cus.labelKey) || DEFAULT_LABEL_KEY;
    if (isTruthyOrZero(item[labelKey])) return item[labelKey];
    if (isTruthyOrZero(item[valueKey])) {
        return item[valueKey];
    }
    return null;
}
/** 从DataSourceItem中获取children, 支持自定义取值的key */ export function getChildrenByDataSource(item, cus) {
    var childrenKey = (cus === null || cus === void 0 ? void 0 : cus.childrenKey) || DEFAULT_CHILDREN_KEY;
    return item[childrenKey] || [];
}
