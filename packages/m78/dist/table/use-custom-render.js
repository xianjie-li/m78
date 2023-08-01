import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";
import { Button } from "../button/index.js";
import { addCls, removeCls, Size } from "../common/index.js";
import SortBtn from "./simple-widgets/sort-btn.js";
import ReactDom, { flushSync } from "react-dom";
// 自定义渲染
export function _useCustomRender(ctx) {
    var props = ctx.props, self = ctx.self, state = ctx.state;
    // mountChange触发时, 清理renderMap中已卸载的单元格
    useEffect(function() {
        if (!state.instance) return;
        var handle = function(cell) {
            if (!cell.isMount) {
                delete self.renderMap[cell.key];
            }
        };
        state.instance.event.mountChange.on(handle);
        return function() {
            state.instance.event.mountChange.off(handle);
        };
    }, [
        state.instance
    ]);
    // 表头绘制控制, 添加过滤/排序按钮
    var headerRender = useFn(function(param) {
        var cell = param.cell;
        var column = cell.column;
        if (cell.row.isHeader && !column.isHeader) {
            var sort = column.config.sort;
            if (sort) {
                addCls(cell.dom, "__sort");
            } else {
                removeCls(cell.dom, "__sort");
            }
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        children: cell.text
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                        className: "m78-table_header-icons",
                        children: [
                            sort && /*#__PURE__*/ _jsx(SortBtn, {}),
                            column.config.filterRender && /*#__PURE__*/ _jsx(Button, {
                                className: "color-disabled",
                                size: Size.small,
                                squareIcon: true,
                                children: /*#__PURE__*/ _jsx(IconFilterAlt, {
                                    className: "fs-12"
                                })
                            })
                        ]
                    })
                ]
            });
        }
    });
    // 覆盖并扩展table.config.render
    var render = useFn(function(cell, _ctx) {
        var ref;
        var arg = {
            cell: cell,
            context: props.context || {},
            table: state.instance
        };
        if (cell.column.config.render && !cell.row.isFake) {
            _ctx.disableDefaultRender = true;
            self.renderMap[cell.key] = {
                cell: cell,
                element: cell.column.config.render(arg)
            };
            return;
        }
        var ret = (ref = props.render) === null || ref === void 0 ? void 0 : ref.call(props, arg);
        if (!isTruthyOrZero(ret)) {
            ret = headerRender(arg);
        }
        if (isTruthyOrZero(ret)) {
            _ctx.disableDefaultRender = true;
            self.renderMap[cell.key] = {
                cell: cell,
                element: ret
            };
            return;
        }
    });
    return {
        render: render
    };
}
// 自定义渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomRender(param) {
    var ctx = param.ctx;
    var state = ctx.state, self = ctx.self;
    var ref = _sliced_to_array(React.useState([]), 2), list = ref[0], setList = ref[1];
    // 更新渲染列表
    var update = useFn(function() {
        var ls = Object.keys(self.renderMap).map(function(key) {
            return self.renderMap[key];
        });
        if (ctx.props.syncRender) {
            flushSync(function() {
                setList(ls);
            });
        } else {
            setList(ls);
        }
    });
    useEffect(function() {
        if (!state.instance) return;
        state.instance.event.rendered.on(update);
        setTimeout(function() {
            update();
        });
        return function() {
            state.instance.event.rendered.off(update);
        };
    }, [
        state.instance
    ]);
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: list.map(function(i) {
            return /*#__PURE__*/ ReactDom.createPortal(i.element, i.cell.dom, i.cell.key);
        })
    });
}
