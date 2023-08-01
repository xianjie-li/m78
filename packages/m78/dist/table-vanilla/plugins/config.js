import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { isBoolean, isEmpty, omit } from "@m78/utils";
import { TableReloadLevel } from "./life.js";
/** 重置级别2的所有配置, 未在其中的所有配置默认为级别1 */ export var level2ConfigKeys = [
    "data",
    "columns",
    "rows",
    "cells", 
];
/** 不能通过table.config()变更的配置 */ var configCanNotChange = [
    "el",
    "primaryKey",
    "plugins",
    "viewEl",
    "viewContentEl",
    "eventCreator", 
];
export var _TableConfigPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableConfigPlugin, TablePlugin);
    var _super = _create_super(_TableConfigPlugin);
    function _TableConfigPlugin() {
        _class_call_check(this, _TableConfigPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.getConfig = function() {
            return _this.config;
        };
        _this.setConfig = function(config, keepPosition) {
            if (!config) {
                return _this.config;
            }
            var nConf = omit(config, configCanNotChange);
            if (isEmpty(nConf)) return;
            var level = TableReloadLevel.index;
            var hasLevel2Conf = Object.keys(nConf).some(function(key) {
                return level2ConfigKeys.includes(key);
            });
            if (hasLevel2Conf) {
                level = TableReloadLevel.full;
            }
            Object.assign(_this.config, nConf);
            _this.table.reload({
                keepPosition: isBoolean(keepPosition) ? keepPosition : level !== TableReloadLevel.full,
                level: level
            });
        };
        return _this;
    }
    var _proto = _TableConfigPlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "setConfig",
            "getConfig"
        ]);
    };
    return _TableConfigPlugin;
}(TablePlugin);
