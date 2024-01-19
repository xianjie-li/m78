import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Row } from "../../layout/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
export function _Toolbar() {
    var props = _injector.useProps();
    var stateDep = _injector.useDeps(_useStateAct);
    var state = stateDep.state;
    function renderLeading() {
        var /*#__PURE__*/ _React;
        if (!state.instance) return null;
        var nodes = [];
        stateDep.rcPlugins.forEach(function(p) {
            var _p_toolbarLeadingCustomer;
            return (_p_toolbarLeadingCustomer = p.toolbarLeadingCustomer) === null || _p_toolbarLeadingCustomer === void 0 ? void 0 : _p_toolbarLeadingCustomer.call(p, nodes);
        });
        if (props.toolBarLeadingCustomer) {
            props.toolBarLeadingCustomer(nodes, state.instance);
        }
        return (_React = React).createElement.apply(_React, [
            React.Fragment,
            null
        ].concat(_to_consumable_array(nodes)));
    }
    function renderTrailing() {
        var /*#__PURE__*/ _React;
        if (!state.instance) return null;
        var nodes = [];
        stateDep.rcPlugins.forEach(function(p) {
            var _p_toolbarTrailingCustomer;
            return (_p_toolbarTrailingCustomer = p.toolbarTrailingCustomer) === null || _p_toolbarTrailingCustomer === void 0 ? void 0 : _p_toolbarTrailingCustomer.call(p, nodes);
        });
        if (props.toolBarTrailingCustomer) {
            props.toolBarTrailingCustomer(nodes, state.instance);
        }
        return (_React = React).createElement.apply(_React, [
            React.Fragment,
            null
        ].concat(_to_consumable_array(nodes)));
    }
    return /*#__PURE__*/ _jsxs(Row, {
        className: "m78-table_toolbar",
        mainAlign: "between",
        children: [
            /*#__PURE__*/ _jsx(Row, {
                crossAlign: "center",
                children: renderLeading()
            }),
            /*#__PURE__*/ _jsx(Row, {
                crossAlign: "center",
                children: renderTrailing()
            })
        ]
    });
}
