import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useFn } from "@m78/hooks";
import React from "react";
import ReactDom, { flushSync } from "react-dom";
import { delay } from "@m78/utils";
// 自定义编辑逻辑
export function _useEditRender(ctx) {
    var state = ctx.state, self = ctx.self, props = ctx.props;
    // 检测单元格是否可编辑
    var interactiveEnableChecker = useFn(function(cell) {
        if (cell.column.isFake || cell.row.isFake) return false;
        return !!cell.column.config.editRender;
    });
    // 自定义编辑渲染
    var interactiveRender = useFn(function(param) {
        var cell = param.cell, value = param.value, done = param.done, node = param.node;
        var editRender = cell.column.config.editRender;
        var time = 0;
        var val = value;
        var arg = {
            cell: cell,
            table: state.instance,
            context: props.context || {},
            value: value,
            form: {},
            change: function(_val) {
                val = _val;
            },
            submit: function() {
                return done();
            },
            cancel: function() {
                return done(false);
            },
            delayClose: function(t) {
                time = t;
            }
        };
        var ret = editRender(arg);
        self.editMap[cell.key] = {
            cell: cell,
            node: node,
            element: ret
        };
        // 清理/状态同步
        var finish = function(isSubmit) {
            delete self.editMap[cell.key];
            if (isSubmit && val !== value) {
                state.instance.setValue(cell, val);
            }
        };
        return function(isSubmit) {
            // 延迟清理
            if (time > 0) {
                return delay(time).then(function() {
                    finish(isSubmit);
                });
            }
            // 正常清理
            finish(isSubmit);
        };
    });
    return {
        interactiveEnableChecker: interactiveEnableChecker,
        interactiveRender: interactiveRender
    };
}
// 自定义编辑渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomEditRender(param) {
    var ctx = param.ctx;
    var self = ctx.self, state = ctx.state;
    var ref = _sliced_to_array(React.useState([]), 2), list = ref[0], setList = ref[1];
    // 更新渲染列表
    var update = useFn(function() {
        var ls = Object.keys(self.editMap).map(function(key) {
            return self.editMap[key];
        });
        if (ctx.props.syncRender) {
            flushSync(function() {
                setList(ls);
            });
        } else {
            setList(ls);
        }
    });
    state.instance.event.interactiveChange.useEvent(update);
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: list.map(function(i) {
            return /*#__PURE__*/ ReactDom.createPortal(i.element, i.node, String(i.cell.key));
        })
    });
}
