import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
    var _proto = _FeedBackPlugin.prototype;
    _proto.rcExtraRender = function rcExtraRender() {
        return /*#__PURE__*/ _jsx(_Feedback, {});
    };
    return _FeedBackPlugin;
}(RCTablePlugin);
