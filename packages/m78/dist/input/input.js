import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { InputType } from "./types.js";
import { useDerivedStateFromProps, useFn, useFormState, useSelf, useUpdate } from "@m78/hooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { dumpFn, ensureArray, isFunction, isString, keypressAndClick } from "@m78/utils";
import clsx from "clsx";
import { IconSearch } from "@m78/icons/icon-search.js";
import { IconClear } from "@m78/icons/icon-clear.js";
import { IconVisibility } from "@m78/icons/icon-visibility.js";
import { IconVisibilityOff } from "@m78/icons/icon-visibility-off.js";
import { Spin } from "../spin/index.js";
import { Divider } from "../layout/index.js";
import { _useTextAreaCalc } from "./use-text-area-calc.js";
import { _integer, _number, _numberRange, _positive } from "./interceptor.js";
import { _useStepper } from "./use-stepper.js";
export function _Input(_props) {
    var manualChange = /** 手动设置值并通过change()触发更新 */ function manualChange(val) {
        inputRef.current.value = val;
        return change();
    };
    var focusHandle = function focusHandle(e) {
        if (disabled) return;
        onFocus(e);
        setFocus(true);
    };
    var blurHandle = function blurHandle(e) {
        // 数字类型时, 失焦时强制转换为有效数字(处理输入一半特殊数值, 如 `123.`), 其他情况在拦截器中已处理
        if (isNumberType && value) {
            if (value.endsWith(".")) {
                manualChange(value.slice(0, -1));
            }
        }
        onBlur(e);
        setFocus(false);
    };
    var keyDownHandle = function keyDownHandle(e) {
        // 记录变更前的关闭位置
        self.prevCursor = [
            inputRef.current.selectionStart || 0,
            inputRef.current.selectionEnd || 0, 
        ];
        onKeyDown(e);
        if (e.code === "Enter") {
            searchHandle();
            onPressEnter(e);
        }
    };
    var passwordTypeChange = /* 密码开/关 */ function passwordTypeChange() {
        setType(function(prev) {
            return prev === "password" ? "text" : "password";
        });
    };
    var searchHandle = /* 触发搜索 */ function searchHandle() {
        onSearch(inputRef.current.value);
    };
    var clearHandle = /* 清空输入框 */ function clearHandle() {
        var res = manualChange("");
        // 更新被阻止时不通知
        if (res !== false) {
            onClear === null || onClear === void 0 ? void 0 : onClear();
            inputRef.current.focus();
            setTimeout(function() {
                // 清空后、触发搜索，并且在autoSize启用时时更新高度
                searchHandle();
            });
        }
    };
    var getRealType = /** 根据tType设置input实际应该使用的type */ function getRealType() {
        if (isNumberType) {
            // https://github.com/facebook/react/issues/16554#issuecomment-657075924
            // 使用number类型时, 输入是无效数字不会触发onChange, 而我们需要在移动设备上弹出数字键盘, 所以使用tel
            return "tel";
        }
        if (type === InputType.password) return InputType.password;
        return "text";
    };
    var getStyle = function getStyle() {
        return textArea ? {
            height: textAreaHeight,
            overflow: autoSize ? "hidden" : "auto",
            resize: autoSize ? "none" : undefined
        } : {};
    };
    var renderRight = /** 输入框右侧区域 */ function renderRight() {
        var /*#__PURE__*/ _React;
        var nodes = [];
        if (hasClearBtn) {
            nodes.push(/*#__PURE__*/ _jsx(IconClear, {
                onClick: clearHandle,
                className: "m78-input_icon m78-input_icon-clear"
            }));
        }
        if (loading || blockLoading) {
            nodes.push(/*#__PURE__*/ _jsx("span", {
                className: "m78-input_icon",
                children: /*#__PURE__*/ _jsx(Spin, {
                    size: "small",
                    full: blockLoading
                })
            }));
        }
        if (_type === "password" && !textArea) {
            nodes.push(type === "password" ? /*#__PURE__*/ _jsx(IconVisibility, {
                onClick: passwordTypeChange,
                className: "m78-input_icon"
            }) : /*#__PURE__*/ _jsx(IconVisibilityOff, {
                onClick: passwordTypeChange,
                className: "m78-input_icon"
            }));
        }
        if (suffix && !textArea) {
            nodes.push(/*#__PURE__*/ _jsx("span", {
                className: "m78-input_suffix",
                children: suffix
            }));
        }
        if ((textArea || charCount) && value) {
            nodes.push(/*#__PURE__*/ _jsxs("span", {
                className: "m78-input_tip-text",
                children: [
                    value.length,
                    maxLength ? "/".concat(maxLength) : "字"
                ]
            }));
        }
        if (search && !textArea) {
            nodes.push(/*#__PURE__*/ _jsx(IconSearch, _object_spread({
                role: "button",
                "aria-label": "search",
                tabIndex: 0,
                className: "m78-input_icon"
            }, keypressAndClick(searchHandle))));
        }
        if (stepper) {
            nodes.push(stepperNode);
        }
        if (nodes.length && !textArea) {
            nodes.unshift(/*#__PURE__*/ _jsx(Divider, {
                vertical: true,
                margin: 4
            }));
        }
        return (_React = React).createElement.apply(_React, [
            React.Fragment,
            null
        ].concat(_to_consumable_array(nodes)));
    };
    var /* 处理特殊属性 */ className = _props.className, style = _props.style, _disabled = _props.disabled, disabled = _disabled === void 0 ? false : _disabled, _loading = _props.loading, loading = _loading === void 0 ? false : _loading, _blockLoading = _props.blockLoading, blockLoading = _blockLoading === void 0 ? false : _blockLoading, tmp = _props.type, _type = tmp === void 0 ? InputType.text : tmp, /* 组件props */ size = _props.size, _clear = _props.clear, clear = _clear === void 0 ? true : _clear, _onFocus = _props.onFocus, onFocus = _onFocus === void 0 ? dumpFn : _onFocus, _onBlur = _props.onBlur, onBlur = _onBlur === void 0 ? dumpFn : _onBlur, _onKeyDown = _props.onKeyDown, onKeyDown = _onKeyDown === void 0 ? dumpFn : _onKeyDown, _onPressEnter = _props.onPressEnter, onPressEnter = _onPressEnter === void 0 ? dumpFn : _onPressEnter, _onSearch = _props.onSearch, onSearch = _onSearch === void 0 ? dumpFn : _onSearch, status = _props.status, border = _props.border, maxLength = _props.maxLength, _search = _props.search, search = _search === void 0 ? false : _search, prefix = _props.prefix, suffix = _props.suffix, _textArea = _props.textArea, textArea = _textArea === void 0 ? false : _textArea, _autoSize = _props.autoSize, autoSize = _autoSize === void 0 ? true : _autoSize, _charCount = _props.charCount, charCount = _charCount === void 0 ? false : _charCount, innerInputRef = _props.innerInputRef, innerWrapRef = _props.innerWrapRef, onClear = _props.onClear, interceptor = _props.interceptor, readonly = _props.readonly, fullWidth = _props.fullWidth, _value = _props.value, _defaultValue = _props.defaultValue, _onChange = _props.onChange, min = _props.min, max = _props.max, stepper = _props.stepper, props = _object_without_properties(_props, [
        "className",
        "style",
        "disabled",
        "loading",
        "blockLoading",
        "type",
        "size",
        "clear",
        "onFocus",
        "onBlur",
        "onKeyDown",
        "onPressEnter",
        "onSearch",
        "status",
        "border",
        "maxLength",
        "search",
        "prefix",
        "suffix",
        "textArea",
        "autoSize",
        "charCount",
        "innerInputRef",
        "innerWrapRef",
        "onClear",
        "interceptor",
        "readonly",
        "fullWidth",
        "value",
        "defaultValue",
        "onChange",
        "min",
        "max",
        "stepper"
    ]);
    // just fix eslint
    dumpFn(_value, _defaultValue, _onChange, min, max);
    var _inputRef = useRef(null);
    var inputRef = innerInputRef || _inputRef;
    var ref = _sliced_to_array(useFormState(_props, ""), 2), value = ref[0], setValue = ref[1];
    var ref1 = _sliced_to_array(useState(false), 2), focus = ref1[0], setFocus = ref1[1];
    var update = useUpdate();
    /** 内部type */ var ref2 = _sliced_to_array(useDerivedStateFromProps(_type), 2), type = ref2[0], setType = ref2[1];
    var isDisabled = disabled || blockLoading;
    var isNumberType = type === InputType.number || type === InputType.integer || type === InputType.positiveInteger;
    var self = useSelf({
        /** 是否正在进行合成输入, InputEvent.isComposing较onCompositionStart等事件兼容性差了不少, 用后者作为代替 */ isComposing: false,
        /** 若此项存在值, 在下一次值变更时将光标选区设置到此位置 */ cursor: null,
        /** 记录前一个光标位置 */ prevCursor: null
    });
    var ctx = {
        textArea: textArea,
        autoSize: autoSize,
        inputRef: inputRef,
        value: value,
        manualChange: manualChange,
        isDisabled: isDisabled,
        props: _props
    };
    /** 格式化interceptor, 根据props添加内置拦截器 */ var interceptorList = useMemo(function() {
        var iter = ensureArray(interceptor);
        if (isNumberType) {
            iter.unshift(_numberRange);
            // 数值类型输入推入预设的几个拦截器
            if (_type === InputType.number) {
                iter.unshift(_number);
            } else if (_type === InputType.integer) {
                iter.unshift(_number, _integer);
            } else if (_type === InputType.positiveInteger) {
                iter.unshift(_number, _integer, _positive);
            }
        }
        return iter;
    }, [
        interceptor,
        _type
    ]);
    var ref3 = _sliced_to_array(_useTextAreaCalc(ctx), 2), textAreaHeight = ref3[0], calcTextHeight = ref3[1];
    var stepperNode = _useStepper(ctx);
    // 如果存在self.cursor, 使用其对关闭位置进行修正
    useEffect(function() {
        if (self.cursor && isFunction(inputRef.current.setSelectionRange)) {
            var _current;
            (_current = inputRef.current).setSelectionRange.apply(_current, _to_consumable_array(self.cursor));
            self.cursor = null;
        }
    });
    /** 值变更时触发, 如果返回false, 表示更新被阻止, 需要确保组件内部的值变更可以通过manualChange来进行 */ var change = useFn(function(e) {
        var el = inputRef.current;
        var val = el.value;
        // 合成事件时直接进行更新
        if (self.isComposing && !isNumberType) {
            setValue(val);
            return;
        }
        // 如果光标api无效, 后面也不会进行写入, 所以可以直接给0
        var cursor = [
            el.selectionStart || 0,
            el.selectionEnd || 0
        ];
        var cursorIsChange = false;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            // 拦截器执行
            for(var _iterator = interceptorList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var interceptor = _step.value;
                var res = interceptor({
                    cursor: cursor,
                    prevCursor: self.prevCursor,
                    str: val,
                    event: e,
                    props: _props
                });
                if (isString(res)) {
                    val = res;
                    continue;
                }
                // 阻止更新时, 光标保持原样
                if (res === false) {
                    self.cursor = self.prevCursor;
                    update();
                    return false;
                }
                var _res = _sliced_to_array(res, 2), v = _res[0], cur = _res[1];
                val = v;
                cursor = cur;
                cursorIsChange = true;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        if (cursorIsChange) {
            self.cursor = cursor;
        }
        calcTextHeight(val);
        setValue(val);
        // 存在字符处理后和前一个value相同的情况, 需要手动更新来触发光标修复等行为
        if (interceptorList.length && val === value) {
            update();
        }
    });
    /** 动态决定输入框的tag类型 */ var TagType = textArea ? "textarea" : "input";
    /** 时候显示清空按钮 */ var hasClearBtn = clear && !!value && value.length > 3 && !isDisabled && !readonly;
    return /*#__PURE__*/ _jsxs("span", {
        className: clsx("m78 m78-init m78-input", className, status && "__".concat(status), size && "__".concat(size), {
            "__no-border": !textArea && border,
            "__full-width": fullWidth,
            __focus: focus,
            __disabled: isDisabled,
            __textarea: textArea,
            __readonly: readonly
        }),
        style: style,
        ref: innerWrapRef,
        children: [
            prefix && !textArea && /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "m78-input_prefix",
                        children: prefix
                    }),
                    /*#__PURE__*/ _jsx(Divider, {
                        vertical: true,
                        margin: 4
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(TagType, _object_spread_props(_object_spread({}, props), {
                type: getRealType(),
                readOnly: readonly,
                disabled: isDisabled,
                className: "m78-input_inner",
                ref: inputRef,
                value: value,
                onChange: change,
                onFocus: focusHandle,
                onBlur: blurHandle,
                onKeyDown: keyDownHandle,
                onCompositionStart: function() {
                    return self.isComposing = true;
                },
                onCompositionEnd: function(e) {
                    self.isComposing = false;
                    // onCompositionEnd在onChange之后执行, 所以我们要手动触发通知合成事件结束
                    // 两种事件非常相似, 并且用户基本上不需要再额外处理 Composition 事件, 这里使用折中方案强制同步其类型
                    // 实际代码如有需要区分的场景, 使用e.nativeEvent.type
                    change(e);
                },
                style: getStyle()
            })),
            renderRight()
        ]
    });
}
_Input.displayName = "Input";
