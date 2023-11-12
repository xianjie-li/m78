import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import { RCTablePlugin } from "../plugin.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { Size } from "../../common/index.js";
import React from "react";
import { IconBackOne as IconUndo } from "@m78/icons/back-one.js";
import { IconGoAhead as IconRedo } from "@m78/icons/go-ahead.js";
import { Divider } from "../../layout/index.js";
export var _RedoAndUndoPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_RedoAndUndoPlugin, RCTablePlugin);
    var _super = _create_super(_RedoAndUndoPlugin);
    function _RedoAndUndoPlugin() {
        _class_call_check(this, _RedoAndUndoPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _RedoAndUndoPlugin.prototype;
    _proto.toolbarLeadingCustomer = function toolbarLeadingCustomer(nodes) {
        nodes.push(/*#__PURE__*/ _jsx(Divider, {
            vertical: true
        }), /*#__PURE__*/ _jsx(RedoBtn, {}), /*#__PURE__*/ _jsx(UndoBtn, {}));
    };
    return _RedoAndUndoPlugin;
}(RCTablePlugin);
function RedoBtn() {
    var stateDep = _injector.useDeps(_useStateAct);
    var table = stateDep.state.instance;
    if (!table) return null;
    var history = table.history;
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsx(Bubble, {
                content: t("redo"),
                children: /*#__PURE__*/ _jsx("span", {
                    children: /*#__PURE__*/ _jsx(Button, {
                        disabled: !history.getPrev(),
                        size: Size.small,
                        squareIcon: true,
                        onClick: function() {
                            return history.undo();
                        },
                        children: /*#__PURE__*/ _jsx(IconUndo, {})
                    })
                })
            });
        }
    });
}
function UndoBtn() {
    var stateDep = _injector.useDeps(_useStateAct);
    var table = stateDep.state.instance;
    if (!table) return null;
    var history = table.history;
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsx(Bubble, {
                content: t("undo"),
                children: /*#__PURE__*/ _jsx("span", {
                    className: "ml-12",
                    children: /*#__PURE__*/ _jsx(Button, {
                        disabled: !history.getNext(),
                        size: Size.small,
                        squareIcon: true,
                        onClick: function() {
                            return history.redo();
                        },
                        children: /*#__PURE__*/ _jsx(IconRedo, {})
                    })
                })
            });
        }
    });
}
