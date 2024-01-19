import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RCTablePlugin } from "../plugin.js";
import React from "react";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { Divider } from "../../layout/index.js";
export var _CountTextPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_CountTextPlugin, RCTablePlugin);
    var _super = _create_super(_CountTextPlugin);
    function _CountTextPlugin() {
        _class_call_check(this, _CountTextPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_CountTextPlugin, [
        {
            key: "toolbarLeadingCustomer",
            value: function toolbarLeadingCustomer(nodes) {
                nodes.push(/*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }), /*#__PURE__*/ _jsx(CountText, {}));
            }
        }
    ]);
    return _CountTextPlugin;
}(RCTablePlugin);
function CountText() {
    var stateDep = _injector.useDeps(_useStateAct);
    var state = stateDep.state;
    var selectedCount = state.selectedRows.length;
    var count = state.rowCount;
    return /*#__PURE__*/ _jsx("div", {
        className: "color-second fs-12",
        children: /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsxs(Trans, {
                    i18nKey: "count",
                    t: t,
                    count: count,
                    selectedCount: selectedCount,
                    children: [
                        {
                            count: count
                        },
                        " rows / ",
                        {
                            selectedCount: selectedCount
                        },
                        " selected"
                    ]
                });
            }
        })
    });
}
