import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useRef } from "react";
import { useFn, useSetState } from "../../index.js";
import { isFunction } from "@m78/utils";
/**
 * 便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景
 * @param props - 透传消费组件的props，该组件需要实现FormLike接口
 * @param defaultValue - 默认值，会作为value或defaultValue的回退值
 * @param config - 其他配置
 * */ export function useFormState(props, defaultValue, config) {
    var _ref = config || {}, _ref_valueKey = _ref.valueKey, valueKey = _ref_valueKey === void 0 ? "value" : _ref_valueKey, _ref_defaultValueKey = _ref.defaultValueKey, defaultValueKey = _ref_defaultValueKey === void 0 ? "defaultValue" : _ref_defaultValueKey, _ref_triggerKey = _ref.triggerKey, triggerKey = _ref_triggerKey === void 0 ? "onChange" : _ref_triggerKey;
    var isControllable = valueKey in props; // 允许 props[valueKey] === undefined
    var value = props[valueKey], onChange = props[triggerKey], propDefaultValue = props[defaultValueKey];
    // 实时存储value
    var stateRef = useRef(value);
    stateRef.current = value;
    // 非受控时使用的表单状态
    var _useSetState = _sliced_to_array(useSetState(function() {
        return {
            value: propDefaultValue === undefined ? defaultValue : propDefaultValue
        };
    }), 2), innerState = _useSetState[0], setInnerState = _useSetState[1];
    /**
   * 处理修改表单值,
   * 受控组件则将新值通过onChange回传，非受控组件设置本地状态并通过onChange通知
   * */ var setFormState = useFn(function(patch, extra) {
        if (isFunction(patch)) {
            // patch函数处理
            if (isControllable) {
                var patchResult = patch(stateRef.current);
                onChange && onChange(patchResult, extra);
            } else {
                var patchResult1 = patch(innerState.value);
                setInnerState({
                    value: patchResult1
                });
                onChange && onChange(patchResult1, extra);
            }
        } else {
            // 直接设置
            if (!isControllable) {
                setInnerState({
                    value: patch
                });
            }
            onChange && onChange(patch, extra);
        }
    });
    var v = isControllable ? value : innerState.value;
    if (v === undefined) {
        v = defaultValue;
    }
    return [
        v,
        setFormState
    ];
}
