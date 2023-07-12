import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { isBoolean, isEmpty, omit } from "@m78/utils";
import { _configCanNotChange, _level2ConfigKeys } from "../common.js";
import { TableReloadLevel } from "./life.js";
export var _TableConfigPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableConfigPlugin, TablePlugin);
    var _super = _create_super(_TableConfigPlugin);
    function _TableConfigPlugin() {
        _class_call_check(this, _TableConfigPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.configHandle = function(config, keepPosition) {
            if (!config) {
                return _this.config;
            }
            var nConf = omit(config, _configCanNotChange);
            if (isEmpty(nConf)) return;
            var level = TableReloadLevel.base;
            var hasLevel2Conf = Object.keys(nConf).some(function(key) {
                return _level2ConfigKeys.includes(key);
            });
            if (hasLevel2Conf) {
                level = TableReloadLevel.full;
            }
            Object.assign(_this.config, nConf);
            console.log(level, hasLevel2Conf, nConf);
            _this.table.reload({
                keepPosition: isBoolean(keepPosition) ? keepPosition : level !== TableReloadLevel.full,
                level: level
            });
        };
        return _this;
    }
    var _proto = _TableConfigPlugin.prototype;
    _proto.init = function init() {
        this.methodMapper(this.table, [
            [
                "configHandle",
                "config"
            ]
        ]);
    };
    return _TableConfigPlugin;
}(TablePlugin);
