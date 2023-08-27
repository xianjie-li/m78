import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";
import ReactDom, { flushSync } from "react-dom";
import { _FilterBtn } from "./filter/filter-btn.js";
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
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        children: cell.text
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "m78-table_header-icons",
                        children: /*#__PURE__*/ _jsx(_FilterBtn, {
                            ctx: ctx,
                            cell: cell
                        })
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
        update();
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
