import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { jsx as _jsx } from "react/jsx-runtime";
import { RCTablePlugin } from "../../plugin.js";
import React from "react";
import { _Feedback } from "./feedback-component.js";
export var _FeedBackPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_FeedBackPlugin, RCTablePlugin);
    var _super = _create_super(_FeedBackPlugin);
    function _FeedBackPlugin() {
        _class_call_check(this, _FeedBackPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_FeedBackPlugin, [
        {
            key: "rcExtraRender",
            value: function rcExtraRender() {
                return /*#__PURE__*/ _jsx(_Feedback, {});
            }
        }
    ]);
    return _FeedBackPlugin;
}(RCTablePlugin);
