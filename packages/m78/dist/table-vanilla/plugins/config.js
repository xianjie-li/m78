import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { isBoolean, isEmpty, omit } from "@m78/utils";
import { TableReloadLevel } from "./life.js";
/** 重置级别full的所有配置, 未在其中的所有配置默认为index级别 */ export var levelFullConfigKeys = [
    "data",
    "columns",
    "rows",
    "cells"
];
/** 不能通过table.setConfig()变更的配置 */ var configCanNotChange = [
    "el",
    "primaryKey",
    "plugins",
    "viewEl",
    "viewContentEl",
    "eventCreator"
];
export var _TableConfigPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableConfigPlugin, TablePlugin);
    var _super = _create_super(_TableConfigPlugin);
    function _TableConfigPlugin() {
        _class_call_check(this, _TableConfigPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "getConfig", function() {
            return _this.config;
        });
        _define_property(_assert_this_initialized(_this), "setConfig", function(config, keepPosition) {
            if (!config) {
                return _this.config;
            }
            var nConf = omit(config, configCanNotChange);
            if (isEmpty(nConf)) return;
            var level = TableReloadLevel.index;
            var hasLevel2Conf = Object.keys(nConf).some(function(key) {
                return levelFullConfigKeys.includes(key);
            });
            if (hasLevel2Conf) {
                level = TableReloadLevel.full;
            }
            var changeKeys = Object.keys(nConf);
            var changeExist = {};
            Object.assign(_this.config, nConf);
            changeKeys.forEach(function(k) {
                return changeExist[k] = true;
            });
            _this.table.event.configChange.emit(changeKeys, function(k) {
                return !!changeExist[k];
            });
            _this.table.reload({
                keepPosition: isBoolean(keepPosition) ? keepPosition : level !== TableReloadLevel.full,
                level: level
            });
        });
        return _this;
    }
    _create_class(_TableConfigPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    "setConfig",
                    "getConfig"
                ]);
            }
        }
    ]);
    return _TableConfigPlugin;
}(TablePlugin);
