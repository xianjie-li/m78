import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState, useRef } from "react";
import { useUpdateEffect } from "../../index.js";
import { isFunction, defer } from "@m78/utils";
import _isEqual from "lodash/isEqual.js";
/** 便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景 */ export function useFormState(/** 透传消费组件的props，该组件需要实现FormLike接口 */ props, /** 默认值，会被value与defaultValue覆盖 */ defaultValue, /** 其他配置 */ config) {
    var ref = config || {}, _valueKey = ref.valueKey, valueKey = _valueKey === void 0 ? "value" : _valueKey, _defaultValueKey = ref.defaultValueKey, defaultValueKey = _defaultValueKey === void 0 ? "defaultValue" : _defaultValueKey, _triggerKey = ref.triggerKey, triggerKey = _triggerKey === void 0 ? "onChange" : _triggerKey, deep = ref.deep;
    var value = props[valueKey], onChange = props[triggerKey], propDefaultValue = props[defaultValueKey];
    // 用于在一些特定的位置能立即获取到`state
    var stateRef = useRef();
    // 设置表单状态
    var ref1 = _sliced_to_array(useState(function() {
        // 初始状态获取说明: value > defaultValue > useFormState中配置的defaultValue
        var val = defaultValue;
        if (valueKey in props) {
            val = props[valueKey] === undefined ? defaultValue : value;
        }
        if (defaultValueKey in props) {
            val = props[defaultValueKey] === undefined ? defaultValue : propDefaultValue;
        }
        return stateRef.current = val;
    }), 2), state = ref1[0], setState = ref1[1];
    /* 为受控组件同步状态 */ useUpdateEffect(function() {
        if (valueKey in props) {
            if (deep) {
                !_isEqual(value, stateRef.current) && setState(stateRef.current = value);
            } else {
                value !== stateRef.current && setState(stateRef.current = value);
            }
        }
    }, [
        value
    ]);
    /* 处理修改表单值 */ var setFormState = function(patch, extra) {
        /* 是受控组件则将新值通过onChange回传即可，非受控组件设置本地状态并通过onChange通知 */ var hasValue = valueKey in props;
        if (isFunction(patch)) {
            if (!hasValue) {
                setState(function(prev) {
                    var patchResult = patch(prev);
                    defer(function() {
                        onChange && onChange(patchResult, extra);
                    });
                    return patchResult;
                });
            } else {
                var patchResult = patch(stateRef.current);
                onChange && onChange(patchResult, extra);
            }
        } else {
            onChange && onChange(patch, extra);
            if (!hasValue) {
                setState(patch);
            }
        }
    };
    return [
        state,
        setFormState
    ];
}
// 别名
export { useFormState as useControllableValue };
