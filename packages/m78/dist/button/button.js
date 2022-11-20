import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import cls from "clsx";
import { Spin } from "../spin";
import { m78Config as config } from "../config";
import { FullSize } from "../common";
import { formatChildren } from "./utils";
import { useFn } from "@m78/hooks";
import { isPromiseLike } from "@m78/utils";
function Button(btnProps) {
    var /*#__PURE__*/ _React;
    var size = btnProps.size, color = btnProps.color, circle = btnProps.circle, outline = btnProps.outline, block = btnProps.block, icon = btnProps.icon, disabled = btnProps.disabled, _loading = btnProps.loading, children = btnProps.children, className = btnProps.className, text = btnProps.text, href = btnProps.href, innerRef = btnProps.innerRef, props = _object_without_properties(btnProps, [
        "size",
        "color",
        "circle",
        "outline",
        "block",
        "icon",
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
    var ref = _sliced_to_array(useState(false), 2), innerLoading = ref[0], setInnerLoading = ref[1];
    var loading = _loading || innerLoading;
    // 配置了color切是text/icon以外的按钮类型, 或是无color且darkMode下，直接使用亮色水波纹
    var isLightEffect = !!color && !text && !icon || !color && darkMode;
    var _obj;
    var classNames = cls("m78 m78-init m78-btn", "m78-effect", "__md", (_obj = {}, _define_property(_obj, "__".concat(color), color), _define_property(_obj, "__".concat(size), size), _define_property(_obj, "__circle", circle), _define_property(_obj, "__outline", outline), _define_property(_obj, "__block", block), _define_property(_obj, "__text", text), _define_property(_obj, "__icon", icon), _define_property(_obj, "__light", isLightEffect), _define_property(_obj, "__disabled", disabled || loading), _obj), className);
    var newChildren = useMemo(function() {
        return formatChildren(children);
    }, [
        children
    ]);
    var isLink = !!href;
    var onClick = useFn(function(e) {
        var ref;
        // 如果用户点击事件返回了promise like, 自动设置loading状态
        var res = (ref = btnProps.onClick) === null || ref === void 0 ? void 0 : ref.call(btnProps, e);
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
            disabled: !!disabled || !!loading,
            ref: innerRef,
            onClick: onClick
        }),
        /*#__PURE__*/ _jsx(Spin, {
            open: !!loading,
            size: FullSize.small,
            full: true
        })
    ].concat(_to_consumable_array(newChildren)));
}
export { Button };
