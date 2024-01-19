import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { jsx as _jsx } from "react/jsx-runtime";
import { RCTablePlugin } from "../plugin.js";
import { IconFiveFive } from "@m78/icons/five-five.js";
import React, { useState } from "react";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Button } from "../../button/index.js";
import { Bubble } from "../../bubble/index.js";
import { Divider } from "../../layout/index.js";
import clsx from "clsx";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { useFn } from "@m78/hooks";
/** 拖拽滚动相关 */ export var _DragMovePlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_DragMovePlugin, RCTablePlugin);
    var _super = _create_super(_DragMovePlugin);
    function _DragMovePlugin() {
        _class_call_check(this, _DragMovePlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_DragMovePlugin, [
        {
            key: "toolbarLeadingCustomer",
            value: function toolbarLeadingCustomer(nodes) {
                nodes.push(/*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }), /*#__PURE__*/ _jsx(DragMoveBtn, {}));
            }
        }
    ]);
    return _DragMovePlugin;
}(RCTablePlugin);
function DragMoveBtn() {
    var state = _injector.useDeps(_useStateAct).state;
    var _useState = _sliced_to_array(useState(function() {
        return state.instance.isDragMoveEnable();
    }), 2), enable = _useState[0], setEnable = _useState[1];
    state.instance.event.dragMoveChange.useEvent(function(enable) {
        setEnable(enable);
    });
    var change = useFn(function() {
        state.instance.setDragMoveEnable(!enable);
    });
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsx(Bubble, {
                content: t("enable drag scroll"),
                style: {
                    maxWidth: 260
                },
                children: /*#__PURE__*/ _jsx(Button, {
                    squareIcon: true,
                    onClick: change,
                    children: /*#__PURE__*/ _jsx(IconFiveFive, {
                        className: clsx(enable && "color")
                    })
                })
            });
        }
    });
}
