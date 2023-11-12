import { getNamePathValue, isReferenceType } from "@m78/utils";
import { RCTablePlugin } from "./plugin.js";
/** 需要忽略的table-vanilla配置 */ export var _tableOmitConfig = [
    "el",
    "emptyNode",
    "emptySize",
    "interactiveRender",
    "viewEl",
    "viewContentEl",
    "eventCreator", 
];
/** 需要在变更时更新到table实例的props key */ export var _tableChangedListenKeys = [
    "data",
    "columns",
    "rows",
    "cells",
    "height",
    "width",
    "autoSize",
    "rowHeight",
    "columnWidth",
    "stripe",
    "persistenceConfig",
    "rowSelectable",
    "cellSelectable",
    "dragSortRow",
    "dragSortColumn",
    "interactive",
    "schema", 
];
/** 同_tableChangedListenKeys, 可能是基础类型, 也可能是引用类型的字段, 若是基础类型则校验, 否则跳过 */ export var _tableChangedMixTypeConfig = [
    "rowSelectable",
    "cellSelectable",
    "interactive", 
];
/** 合并处理_tableChangedListenKeys & _tableChangedMixTypeConfig */ export var _tableChangedIncludeChecker = function(key, value) {
    if (_tableChangedListenKeys.includes(key)) return true;
    return _tableChangedMixTypeConfig.includes(key) && !isReferenceType(value);
};
/** 从table实例中获取tableContext */ export var _getTableCtx = function(instance) {
    return getNamePathValue(instance, "__ctx");
};
/** 由于plugin.rcRuntime等api必须与组件同步运行(包含hooks), 在初始化时将RCTablePlugin插件进行预先实例化 */ export var preInstantiationRCPlugin = function(plugins) {
    var fakeConf = {
        table: {},
        plugins: [],
        context: {},
        config: {}
    };
    return plugins.map(function(p) {
        // 若是RCTablePlugin的子类, 预先对其实例化
        if (Object.getPrototypeOf(p.prototype) === RCTablePlugin.prototype) {
            return new p(fakeConf);
        }
        return p;
    });
};
