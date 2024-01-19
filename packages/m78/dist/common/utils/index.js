import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import React, { useEffect, useState } from "react";
import { useSelf } from "@m78/hooks";
import { isNumber, isString, isTruthyOrZero } from "@m78/utils";
/** 禁止冒泡的便捷扩展对象 */ export var stopPropagation = {
    onClick: function onClick(e) {
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
    var _ref = options || {}, _ref_leading = _ref.leading, leading = _ref_leading === void 0 ? 300 : _ref_leading, _ref_trailing = _ref.trailing, trailing = _ref_trailing === void 0 ? 600 : _ref_trailing;
    var isDisabled = !trailing && !leading;
    // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
    var _useState = _sliced_to_array(useState(!leading ? toggle : false), 2), innerState = _useState[0], setInnerState = _useState[1];
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
    var v = item[valueKey];
    if (isTruthyOrZero(v)) return v;
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
/** 为节点添加className */ export function addCls(el, cls) {
    if (el.classList) {
        el.classList.add(cls);
    } else {
        var currentClassName = el.className;
        var regex = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
        if (!regex.test(currentClassName)) {
            el.className = (currentClassName + " " + cls).trim();
        }
    }
}
/** 为节点移除className */ export function removeCls(el, cls) {
    if (el.classList) {
        el.classList.remove(cls);
    } else {
        var currentClassName = el.className;
        var regex = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
        el.className = currentClassName.replace(regex, " ").trim();
    }
}
/** 若存在, 从节点的父节点将其删除 */ export function removeNode(node) {
    if (!node || !node.parentNode) return;
    node.parentNode.removeChild(node);
}
