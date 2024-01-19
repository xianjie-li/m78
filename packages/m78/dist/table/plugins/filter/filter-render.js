import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FieldDetector } from "../../../form/index.js";
import React, { useEffect } from "react";
import { useFn, useSelf, useSetState } from "@m78/hooks";
import { _injector } from "../../table.js";
import { _useStateAct } from "../../injector/state.act.js";
import { _useMethodsAct } from "../../injector/methods.act.js";
import { getNamePathValue } from "@m78/utils";
import { TABLE_NS, Translation } from "../../../i18n/index.js";
import { Row } from "../../../layout/index.js";
import { Button, ButtonColor } from "../../../button/index.js";
import { Size } from "../../../common/index.js";
import { _useFilterFormAct } from "./use-filter-form.act.js";
/** 通用筛选弹层渲染逻辑 */ export var _FilterBtnCommon = function(param) {
    var render = param.render, isToolbar = param.isToolbar, children = param.children;
    var renderContent = function renderContent() {
        return /*#__PURE__*/ _jsxs("div", {
            onKeyDown: enterDown,
            children: [
                /*#__PURE__*/ _jsx(FieldDetector, {
                    onChange: function(names) {
                        self.names = names;
                    },
                    children: formNodes
                }),
                /*#__PURE__*/ _jsx(Translation, {
                    ns: TABLE_NS,
                    children: function(t) {
                        return /*#__PURE__*/ _jsxs(Row, {
                            className: "mt-16",
                            mainAlign: "end",
                            children: [
                                /*#__PURE__*/ _jsx(Button, {
                                    size: Size.small,
                                    onClick: reset,
                                    children: t("reset")
                                }),
                                /*#__PURE__*/ _jsx(Button, {
                                    size: Size.small,
                                    color: ButtonColor.primary,
                                    onClick: query,
                                    children: t("query")
                                })
                            ]
                        });
                    }
                })
            ]
        });
    };
    var actState = _injector.useDeps(_useStateAct);
    var methods = _injector.useDeps(_useMethodsAct);
    var form = _injector.useDeps(_useFilterFormAct).form;
    var self = useSelf({
        // 检测子级field
        names: []
    });
    var _useSetState = _sliced_to_array(useSetState({
        open: false,
        // 是否变更
        changed: false
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    useEffect(function() {
        methods.overlayStackChange(state.open);
    }, [
        state.open
    ]);
    if (!render) return null;
    var formNodes = render(form);
    if (!formNodes) return null;
    // 滚动时关闭
    actState.scrollEvent.useEvent(function() {
        if (state.open && !isToolbar) setState({
            open: false
        });
    });
    // 检测变更
    form.events.change.useEvent(function() {
        var changed = self.names.some(function(n) {
            return form.getChanged(n);
        });
        if (changed !== state.changed) {
            setState({
                changed: changed
            });
        }
    });
    var reset = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var defValue, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    defValue = form.getDefaultValues();
                    self.names.forEach(function(name) {
                        form.setValue(name, getNamePathValue(defValue, name));
                    });
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        form.submit()
                    ];
                case 2:
                    _state.sent();
                    setState({
                        open: false
                    });
                    return [
                        3,
                        4
                    ];
                case 3:
                    e = _state.sent();
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    }));
    var query = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        form.submit()
                    ];
                case 1:
                    _state.sent();
                    setState({
                        open: false
                    });
                    return [
                        3,
                        3
                    ];
                case 2:
                    e = _state.sent();
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    }));
    var enterDown = useFn(function(e) {
        if (e.code === "Enter" && state.changed && e.target.tagName !== "BUTTON") {
            query();
        }
    });
    var arg = {
        state: state,
        setState: setState,
        renderContent: renderContent
    };
    return children(arg);
};
