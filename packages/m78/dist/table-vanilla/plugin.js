import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { isArray, isFunction, isString, throwError } from "@m78/utils";
import { _prefix } from "./common.js";
/**
 * 插件类, 用于扩展table的功能
 * - 注意: 在关键配置(data/columns/rows等)变更后, init/initialized/mount/beforeDestroy 是会被重新执行的, 整个表格生命周期并不是只有一次
 * */ export var TablePlugin = /*#__PURE__*/ function() {
    "use strict";
    function TablePlugin(config) {
        _class_call_check(this, TablePlugin);
        /** 用来挂载自定义字段 */ this.state = {};
        /** 在不同插件间共享的上下文对象 */ this.context = {};
        this.table = config.table;
        this.plugins = config.plugins;
        this.config = config.config;
        this.context = config.context;
    }
    var _proto = TablePlugin.prototype;
    /**
   * 工具函数, 将当对象上的指定函数映射到指定对象上
   * - 默认情况下, 将methods的每一项同名方法映射到table实例上, 可通过数组指定别名, 如: [['conf', 'config']] 表示将conf方法映射到config上
   * */ _proto.methodMapper = function methodMapper(obj, methods) {
        var _this = this;
        methods.forEach(function(m) {
            var methodName = ""; // 方法名
            var aliseName = ""; // 别名
            if (isString(m)) {
                methodName = m;
                aliseName = m;
            } else if (isArray(m)) {
                methodName = m[1];
                aliseName = m[0];
            }
            // @ts-ignore
            if (isFunction(_this[aliseName])) {
                // @ts-ignore
                obj[methodName] = _this[aliseName].bind(_this);
            }
        });
    };
    /** 获取指定插件类的实例, 不存在对应类型的插件时, 抛出异常 */ _proto.getPlugin = function getPlugin(pluginClass) {
        var ins = this.plugins.find(function(p) {
            return p instanceof pluginClass;
        });
        if (!ins) {
            throwError("No plugin of type ".concat(pluginClass.name, " was found."), _prefix);
        }
        return ins;
    };
    return TablePlugin;
}();
