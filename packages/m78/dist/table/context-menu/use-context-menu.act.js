import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useRef, useState } from "react";
import { Menu } from "../../menu/index.js";
import { useFn, useSelf } from "@m78/hooks";
import { Trigger, TriggerType } from "../../trigger/index.js";
import { _useCellMenu } from "./use-cell-menu.js";
import { _injector } from "../table.js";
import { _useMethodsAct } from "../injector/methods.act.js";
import { _useStateAct } from "../injector/state.act.js";
export var _useContextMenuAct = function() {
    var renderTrigger = function renderTrigger(child) {
        return /*#__PURE__*/ _jsx(Trigger, {
            type: TriggerType.contextMenu,
            onTrigger: trigger,
            children: child
        });
    };
    var state = _injector.useDeps(_useStateAct).state;
    var methods = _injector.useDeps(_useMethodsAct);
    var ref = useRef(null);
    var self = useSelf({
        /** 最后开启菜单的回调 */ callback: null
    });
    var _useState = _sliced_to_array(useState([]), 2), options = _useState[0], setOptions = _useState[1];
    var cellMenuGet = _useCellMenu();
    // 在指定位置开启menu, 传入menu可替换当前菜单
    var open = useFn(function(opt) {
        var menu = opt.menu, xy = opt.xy, cb = opt.cb;
        self.callback = cb || null;
        if (menu) {
            setOptions(menu);
        }
        ref.current.updateXY(xy, true);
        ref.current.setOpen(true);
    });
    var confirm = useFn(function(val, option) {
        var _self_callback;
        (_self_callback = self.callback) === null || _self_callback === void 0 ? void 0 : _self_callback.call(self, val, option);
    });
    var trigger = useFn(function(e) {
        if (state.initializing) return;
        var cellOpenOpt = cellMenuGet(e);
        if (cellOpenOpt) {
            open(cellOpenOpt);
            return;
        }
    });
    return {
        open: open,
        node: /*#__PURE__*/ _jsx(Menu, {
            instanceRef: ref,
            options: options,
            onConfirm: confirm,
            onChange: methods.overlayStackChange
        }),
        renderTrigger: renderTrigger
    };
};
