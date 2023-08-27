import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";
import { Bubble, BubbleType } from "../../bubble/index.js";
import { OverlayDirection } from "../../overlay/index.js";
import { Row } from "../../layout/index.js";
import { useFn, useSelf, useSetState } from "@m78/hooks";
import clsx from "clsx";
import { FieldDetector } from "../../form/index.js";
import { getNamePathValue } from "@m78/utils";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { IconSync } from "@m78/icons/icon-sync.js";
import { IconManageSearch } from "@m78/icons/icon-manage-search.js";
import { Trigger, TriggerType } from "../../trigger/index.js";
/** 工具栏查询按钮 */ export function _renderToolBarQueryBtn(ctx) {
    return /*#__PURE__*/ _jsxs(Button, {
        text: true,
        onClick: function() {
            return ctx.filterForm.submit();
        },
        children: [
            /*#__PURE__*/ _jsx(IconManageSearch, {
                className: "color-second fs-16"
            }),
            /*#__PURE__*/ _jsx(Translation, {
                ns: TABLE_NS,
                children: function(t) {
                    return t("query");
                }
            })
        ]
    });
}
/** 工具栏重置按钮 */ export function _ToolBarFilterBtn(param) {
    var ctx = param.ctx;
    var ref = _sliced_to_array(useState(false), 2), changed = ref[0], setChanged = ref[1];
    ctx.filterForm.events.change.useEvent(function() {
        var c = ctx.filterForm.getFormChanged();
        if (changed !== c) {
            setChanged(c);
        }
    });
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsx(Bubble, {
                content: t("reset filter"),
                children: /*#__PURE__*/ _jsx(Button, {
                    disabled: !changed,
                    squareIcon: true,
                    onClick: function() {
                        ctx.filterForm.reset();
                    },
                    children: /*#__PURE__*/ _jsx(IconSync, {
                        className: "color-second"
                    })
                })
            });
        }
    });
}
/** 表头右侧的字段筛选按钮 */ export var _FilterBtn = /*#__PURE__*/ React.memo(function(param) {
    var ctx = param.ctx, cell = param.cell;
    var column = cell.column;
    return /*#__PURE__*/ _jsx(_FilterBtnCommon, {
        ctx: ctx,
        render: column.config.filterRender,
        isToolbar: false,
        children: function(param) {
            var state = param.state, setState = param.setState, renderContent = param.renderContent;
            return /*#__PURE__*/ _jsx(Bubble, {
                open: state.open,
                onChange: function(open) {
                    return setState({
                        open: open
                    });
                },
                type: BubbleType.popper,
                direction: OverlayDirection.bottom,
                content: renderContent(),
                autoFocus: true,
                children: /*#__PURE__*/ _jsx(Button, {
                    className: "color-second",
                    size: Size.small,
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconFilterAlt, {
                        className: clsx("fs-12", state.changed && "color")
                    })
                })
            });
        }
    });
});
/** 工具类公共筛选按钮 */ export function _ToolbarCommonFilter(param) {
    var ctx = param.ctx;
    var bubble1 = useRef(null);
    var bubble2 = useRef(null);
    // bubble触发器
    var trigger = useFn(function(e) {
        if (e.type === TriggerType.active) {
            bubble1.current.trigger(e);
        }
        if (e.type === TriggerType.click) {
            bubble2.current.trigger(e);
        }
    });
    return /*#__PURE__*/ _jsx(_FilterBtnCommon, {
        ctx: ctx,
        render: ctx.props.commonFilter,
        isToolbar: true,
        children: function(param) {
            var state = param.state, setState = param.setState, renderContent = param.renderContent;
            return /*#__PURE__*/ _jsx(Translation, {
                ns: TABLE_NS,
                children: function(t) {
                    return /*#__PURE__*/ _jsxs(_Fragment, {
                        children: [
                            /*#__PURE__*/ _jsx(Bubble, {
                                instanceRef: bubble1,
                                content: t("common filter")
                            }),
                            /*#__PURE__*/ _jsx(Bubble, {
                                instanceRef: bubble2,
                                content: renderContent(),
                                type: BubbleType.popper,
                                direction: OverlayDirection.bottomStart,
                                autoFocus: true,
                                open: state.open,
                                onChange: function(open) {
                                    return setState({
                                        open: open
                                    });
                                }
                            }),
                            /*#__PURE__*/ _jsx(Trigger, {
                                type: [
                                    TriggerType.active,
                                    TriggerType.click
                                ],
                                onTrigger: trigger,
                                children: /*#__PURE__*/ _jsx(Button, {
                                    squareIcon: true,
                                    children: /*#__PURE__*/ _jsx(IconFilterAlt, {
                                        className: clsx("color-second", state.changed && "color")
                                    })
                                })
                            })
                        ]
                    });
                }
            });
        }
    });
}
/** 通用筛选弹层渲染逻辑 */ export var _FilterBtnCommon = function(param) {
    var ctx = param.ctx, render = param.render, isToolbar = param.isToolbar, children = param.children;
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
    var self = useSelf({
        // 检测子级field
        names: []
    });
    var ref = _sliced_to_array(useSetState({
        open: false,
        // 是否变更
        changed: false
    }), 2), state = ref[0], setState = ref[1];
    useEffect(function() {
        ctx.state.instance.isActive(!state.open);
    }, [
        state.open
    ]);
    if (!render) return null;
    var formNodes = render(ctx.filterForm);
    if (!formNodes) return null;
    // 滚动时关闭
    ctx.scrollEvent.useEvent(function() {
        if (state.open && !isToolbar) setState({
            open: false
        });
    });
    // 检测变更
    ctx.filterForm.events.change.useEvent(function() {
        var changed = self.names.some(function(n) {
            return ctx.filterForm.getChanged(n);
        });
        if (changed !== state.changed) {
            setState({
                changed: changed
            });
        }
    });
    var reset = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var defValue, _tmp, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    defValue = ctx.filterForm.getDefaultValues();
                    self.names.forEach(function(name) {
                        ctx.filterForm.setValue(name, getNamePathValue(defValue, name));
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
                        ctx.filterForm.submit()
                    ];
                case 2:
                    _state.sent();
                    _tmp = {};
                    setState((_tmp.open = false, _tmp));
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
        var _tmp, e;
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
                        ctx.filterForm.submit()
                    ];
                case 1:
                    _state.sent();
                    _tmp = {};
                    setState((_tmp.open = false, _tmp));
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
