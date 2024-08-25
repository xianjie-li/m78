import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState } from "react";
import { Button } from "../../../button/index.js";
import { Size } from "../../../common/index.js";
import { IconFilter } from "@m78/icons/filter.js";
import { Bubble, BubbleType } from "../../../bubble/index.js";
import { OverlayDirection } from "../../../overlay/index.js";
import { useFn } from "@m78/hooks";
import clsx from "clsx";
import { TABLE_NS, Translation } from "../../../i18n/index.js";
import { IconRefresh } from "@m78/icons/refresh.js";
import { IconFind } from "@m78/icons/find.js";
import { TriggerType } from "@m78/trigger";
import { _injector } from "../../table.js";
import { _FilterBtnCommon } from "./filter-render.js";
import { _useFilterFormAct } from "./use-filter-form.act.js";
import { Trigger } from "@m78/trigger/react/trigger.js";
/** 工具栏查询按钮 */ export function _ToolBarQueryBtn() {
    var form = _injector.useDeps(_useFilterFormAct).form;
    return /*#__PURE__*/ _jsxs(Button, {
        size: Size.small,
        onClick: function() {
            return form.submit();
        },
        children: [
            /*#__PURE__*/ _jsx(IconFind, {
                className: "fs-16"
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
/** 工具栏重置按钮 */ export function _ToolBarFilterBtn() {
    var form = _injector.useDeps(_useFilterFormAct).form;
    var _useState = _sliced_to_array(useState(false), 2), changed = _useState[0], setChanged = _useState[1];
    form.events.change.useEvent(function() {
        var c = form.getFormChanged();
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
                        form.reset();
                    },
                    children: /*#__PURE__*/ _jsx(IconRefresh, {})
                })
            });
        }
    });
}
/** 表头右侧的字段筛选按钮 */ export var _FilterBtn = /*#__PURE__*/ React.memo(function(param) {
    var cell = param.cell;
    var column = cell.column;
    return /*#__PURE__*/ _jsx(_FilterBtnCommon, {
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
                    size: Size.small,
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconFilter, {
                        theme: state.changed ? "filled" : "outline",
                        className: clsx("fs-12", state.changed && "color")
                    })
                })
            });
        }
    });
});
/** 工具栏公共筛选按钮 */ export function _ToolbarCommonFilterBtn() {
    var props = _injector.useProps();
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
    if (!props.commonFilter) return null;
    return /*#__PURE__*/ _jsx(_FilterBtnCommon, {
        render: props.commonFilter,
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
                                    children: /*#__PURE__*/ _jsx(IconFilter, {
                                        theme: state.changed ? "filled" : "outline",
                                        className: clsx(state.changed && "color")
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
