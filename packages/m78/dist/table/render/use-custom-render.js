import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";
import ReactDom from "react-dom";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
// 自定义渲染单元格
export function _useCustomRender() {
    var ref = _injector.useDeps(_useStateAct), state = ref.state, self = ref.self, rcPlugins = ref.rcPlugins;
    var props = _injector.useProps();
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
    // 覆盖并扩展table.config.render
    var render = useFn(function(cell, _ctx) {
        var arg = renderCommonHandle({
            props: props,
            state: state,
            cell: cell,
            rcPlugins: rcPlugins
        });
        if (isTruthyOrZero(arg.prevElement)) {
            _ctx.disableDefaultRender = true;
            self.renderMap[cell.key] = {
                cell: cell,
                element: arg.prevElement
            };
            return;
        }
    });
    return {
        render: render
    };
}
/** 自定义render处理 插件render/config render/column render */ export function renderCommonHandle(args) {
    var ref;
    var props = args.props, state = args.state, cell = args.cell, rcPlugins = args.rcPlugins;
    var arg = {
        cell: cell,
        context: props.context || {},
        table: state.instance,
        prevElement: null
    };
    // 处理插件render
    rcPlugins.forEach(function(p) {
        var ref;
        var el = (ref = p.rcCellRender) === null || ref === void 0 ? void 0 : ref.call(p, {
            cell: cell,
            prevElement: arg.prevElement
        });
        if (isTruthyOrZero(el)) {
            arg.prevElement = el;
        }
    });
    // props.render
    var el = (ref = props.render) === null || ref === void 0 ? void 0 : ref.call(props, arg);
    if (isTruthyOrZero(el)) {
        arg.prevElement = el;
    }
    // 处理column.render
    if (cell.column.config.render && !cell.row.isFake) {
        var el1 = cell.column.config.render(arg);
        if (isTruthyOrZero(el1)) {
            arg.prevElement = el1;
        }
    }
    return arg;
}
// 自定义渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomRender() {
    var ref = _injector.useDeps(_useStateAct), state = ref.state, self = ref.self;
    var ref1 = _sliced_to_array(React.useState([]), 2), list = ref1[0], setList = ref1[1];
    // 更新渲染列表
    var update = useFn(function() {
        var ls = Object.keys(self.renderMap).map(function(key) {
            return self.renderMap[key];
        });
        setList(ls);
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
