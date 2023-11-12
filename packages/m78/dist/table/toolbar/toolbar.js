import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Row } from "../../layout/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
export function _Toolbar() {
    var renderLeading = function renderLeading() {
        var /*#__PURE__*/ _React;
        if (!state.instance) return null;
        var nodes = [];
        stateDep.rcPlugins.forEach(function(p) {
            var ref;
            return (ref = p.toolbarLeadingCustomer) === null || ref === void 0 ? void 0 : ref.call(p, nodes);
        });
        var node;
        if (props.toolBarLeadingCustomer) {
            props.toolBarLeadingCustomer(nodes, state.instance);
        }
        return (_React = React).createElement.apply(_React, [
            React.Fragment,
            null
        ].concat(_to_consumable_array(nodes)));
    };
    var renderTrailing = function renderTrailing() {
        var /*#__PURE__*/ _React;
        if (!state.instance) return null;
        var nodes = [];
        stateDep.rcPlugins.forEach(function(p) {
            var ref;
            return (ref = p.toolbarTrailingCustomer) === null || ref === void 0 ? void 0 : ref.call(p, nodes);
        });
        if (props.toolBarTrailingCustomer) {
            props.toolBarTrailingCustomer(nodes, state.instance);
        }
        return (_React = React).createElement.apply(_React, [
            React.Fragment,
            null
        ].concat(_to_consumable_array(nodes)));
    };
    var props = _injector.useProps();
    var stateDep = _injector.useDeps(_useStateAct);
    var state = stateDep.state;
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
