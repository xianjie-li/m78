import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { isArray, isFunction, isString, throwError } from "@m78/utils";
import { _prefix } from "./common.js";
/**
 * 插件类, 用于扩展table的功能
 * - 注意: 在关键配置(data/columns/rows等)变更后, init/initialized/mount/beforeDestroy 是会被重新执行的, 整个表格生命周期并不是只有一次
 * */ export var TablePlugin = /*#__PURE__*/ function() {
    "use strict";
    function TablePlugin(config) {
        _class_call_check(this, TablePlugin);
        /** table实例 */ _define_property(this, "table", void 0);
        /** 当前注册的所有plugin */ _define_property(this, "plugins", void 0);
        /** 同table.config */ _define_property(this, "config", void 0);
        /** 用来挂载自定义字段 */ _define_property(this, "state", {});
        /** 在不同插件间共享的上下文对象 */ _define_property(this, "context", {});
        this.table = config.table;
        this.plugins = config.plugins;
        this.config = config.config;
        this.context = config.context;
    }
    _create_class(TablePlugin, [
        {
            /**
   * 工具函数, 将当对象上的指定函数映射到指定对象上
   * - 默认情况下, 将methods的每一项同名方法映射到table实例上, 可通过数组指定别名, 如: [['conf', 'config']] 表示将conf方法映射到config上
   * */ key: "methodMapper",
            value: function methodMapper(obj, methods) {
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
            }
        },
        {
            /** 获取指定插件类的实例, 不存在对应类型的插件时, 抛出异常 */ key: "getPlugin",
            value: function getPlugin(pluginClass) {
                var ins = this.plugins.find(function(p) {
                    return _instanceof(p, pluginClass);
                });
                if (!ins) {
                    throwError("No plugin of type ".concat(pluginClass.name, " was found."), _prefix);
                }
                return ins;
            }
        }
    ]);
    return TablePlugin;
}();
export var TableLoadStage;
(function(TableLoadStage) {
    /* # # # # # # # Full Reload # # # # # # # */ /** 执行full reload */ TableLoadStage["fullHandle"] = "fullHandle";
    /** 基础数据(data/column等)克隆并写入context, 以及其他基础信息的初始化设置 */ TableLoadStage["initBaseInfo"] = "initBaseInfo";
    /** 格式化data/column等数据为内部格式, 并预处理固定项等内容 */ TableLoadStage["formatBaseInfo"] = "formatBaseInfo";
    /* # # # # # # # Index Reload # # # # # # # */ /** 执行indexHandle */ TableLoadStage["indexHandle"] = "indexHandle";
    /** 合并持久化配置到当前配置 */ TableLoadStage["mergePersistenceConfig"] = "mergePersistenceConfig";
    /** 更新index索引, 并预处理合并项 */ TableLoadStage["updateIndexAndMerge"] = "updateIndexAndMerge";
    /* # # # # # # # Base Reload # # # # # # # */ /** 执行baseHandle */ TableLoadStage["baseHandle"] = "baseHandle";
    /** 重置缓存, 如合并项/固定项等 */ TableLoadStage["resetCache"] = "resetCache";
    /** 预处理尺寸/固定项相关信 */ TableLoadStage["preHandleSize"] = "preHandleSize";
})(TableLoadStage || (TableLoadStage = {}));
