import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";
import ReactDom from "react-dom";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
// 自定义渲染单元格
export function _useCustomRender() {
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, self = _injector_useDeps.self, rcPlugins = _injector_useDeps.rcPlugins;
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
    var _props_render;
    var props = args.props, state = args.state, cell = args.cell, rcPlugins = args.rcPlugins;
    var arg = {
        cell: cell,
        context: props.context || {},
        table: state.instance,
        prevElement: null
    };
    // 处理插件render
    rcPlugins.forEach(function(p) {
        var _p_rcCellRender;
        var el = (_p_rcCellRender = p.rcCellRender) === null || _p_rcCellRender === void 0 ? void 0 : _p_rcCellRender.call(p, {
            cell: cell,
            prevElement: arg.prevElement
        });
        if (isTruthyOrZero(el)) {
            arg.prevElement = el;
        }
    });
    // props.render
    var el = (_props_render = props.render) === null || _props_render === void 0 ? void 0 : _props_render.call(props, arg);
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
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, self = _injector_useDeps.self;
    var _React_useState = _sliced_to_array(React.useState([]), 2), list = _React_useState[0], setList = _React_useState[1];
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
