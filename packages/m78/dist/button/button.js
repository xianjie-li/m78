import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import cls from "clsx";
import { Spin } from "../spin/index.js";
import { m78Config as config } from "../config/index.js";
import { FullSize } from "../common/index.js";
import { _formatChildren } from "./utils.js";
import { useFn } from "@m78/hooks";
import { isPromiseLike } from "@m78/utils";
function _Button(btnProps) {
    var /*#__PURE__*/ _React;
    var size = btnProps.size, color = btnProps.color, circle = btnProps.circle, outline = btnProps.outline, block = btnProps.block, icon = btnProps.icon, squareIcon = btnProps.squareIcon, disabled = btnProps.disabled, _loading = btnProps.loading, children = btnProps.children, className = btnProps.className, text = btnProps.text, href = btnProps.href, innerRef = btnProps.innerRef, props = _object_without_properties(btnProps, [
        "size",
        "color",
        "circle",
        "outline",
        "block",
        "icon",
        "squareIcon",
        "disabled",
        "loading",
        "children",
        "className",
        "text",
        "href",
        "innerRef"
    ]);
    var darkMode = config.useState(function(state) {
        return state.darkMode;
    });
    // 由内部控制的加载状态
    var _useState = _sliced_to_array(useState(false), 2), innerLoading = _useState[0], setInnerLoading = _useState[1];
    var loading = _loading || innerLoading;
    // 配置了color切是text/icon以外的按钮类型, 或是无color且darkMode下，直接使用亮色水波纹
    var isLightEffect = !!color && !text && !icon || !color && darkMode;
    var _obj;
    var classNames = cls("m78 m78-init m78-btn", "m78-effect", "__md", (_obj = {}, _define_property(_obj, "__".concat(color), color), _define_property(_obj, "__".concat(size), size), _define_property(_obj, "__circle", circle), _define_property(_obj, "__outline", outline), _define_property(_obj, "__block", block), _define_property(_obj, "__text", text), _define_property(_obj, "__icon", icon || squareIcon), _define_property(_obj, "__square-icon", squareIcon), _define_property(_obj, "__light", isLightEffect), _define_property(_obj, "__disabled", disabled || loading), _obj), className);
    var newChildren = useMemo(function() {
        return _formatChildren(children);
    }, [
        children
    ]);
    var isLink = !!href;
    var onClick = useFn(function(e) {
        var _btnProps_onClick;
        // 如果用户点击事件返回了promise like, 自动设置loading状态
        var res = (_btnProps_onClick = btnProps.onClick) === null || _btnProps_onClick === void 0 ? void 0 : _btnProps_onClick.call(btnProps, e);
        if (isPromiseLike(res)) {
            setInnerLoading(true);
            res.finally(function() {
                setInnerLoading(false);
            });
        }
    });
    return (_React = React).createElement.apply(_React, [
        isLink ? "a" : "button",
        _object_spread_props(_object_spread({
            type: isLink ? undefined : "button",
            href: href
        }, props), {
            className: classNames,
            disabled: !!disabled || loading,
            ref: innerRef,
            onClick: onClick
        }),
        /*#__PURE__*/ _jsx(Spin, {
            open: loading,
            size: FullSize.small,
            full: true
        })
    ].concat(_to_consumable_array(newChildren)));
}
_Button.displayName = "Button";
export { _Button };
