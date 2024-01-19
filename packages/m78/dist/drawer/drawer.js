import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo } from "react";
import clsx from "clsx";
import { omitApiProps, Overlay } from "../overlay/index.js";
import { isFunction, omit } from "@m78/utils";
import { Position, Z_INDEX_DRAWER } from "../common/index.js";
import upperFirst from "lodash/upperFirst.js";
import createRenderApi from "@m78/render-api";
import { omitDrawerOverlayProps } from "./types.js";
var _obj;
var positionMap = (_obj = {}, _define_property(_obj, Position.top, [
    0.5,
    0
]), _define_property(_obj, Position.right, [
    1,
    0.5
]), _define_property(_obj, Position.bottom, [
    0.5,
    1
]), _define_property(_obj, Position.left, [
    0,
    0.5
]), _obj);
var defaultProps = {
    position: Position.bottom,
    namespace: "DRAWER",
    mask: true,
    zIndex: Z_INDEX_DRAWER
};
var DrawerBase = function(props) {
    var renderContent = function renderContent(meta) {
        var content = isFunction(props.content) ? props.content(meta) : props.content;
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                header && /*#__PURE__*/ _jsx("div", {
                    className: "m78-drawer_header",
                    children: header
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "m78-drawer_content",
                    children: content
                }),
                footer && /*#__PURE__*/ _jsx("div", {
                    className: "m78-drawer_footer",
                    children: footer
                })
            ]
        });
    };
    var className = props.className, position = props.position, header = props.header, footer = props.footer, other = _object_without_properties(props, [
        "className",
        "position",
        "header",
        "footer"
    ]);
    var overlayProps = useMemo(function() {
        return omit(other, omitDrawerOverlayProps);
    }, [
        props
    ]);
    return /*#__PURE__*/ _jsx(Overlay, _object_spread_props(_object_spread({}, overlayProps), {
        className: clsx("m78 m78-drawer", "__".concat(position), footer && "__footer", className),
        alignment: positionMap[position],
        transitionType: "slide".concat(upperFirst(position)),
        content: renderContent,
        springProps: {
            config: props.springProps
        }
    }));
};
DrawerBase.defaultProps = defaultProps;
var api = createRenderApi({
    component: DrawerBase,
    defaultState: {
        mountOnEnter: true,
        unmountOnExit: true
    },
    omitState: function(state) {
        return omit(state, omitApiProps);
    }
});
var _Drawer = Object.assign(DrawerBase, api);
export { _Drawer };
