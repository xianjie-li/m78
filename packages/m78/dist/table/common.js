import { getNamePathValue, isReferenceType } from "@m78/utils";
/** 需要忽略的配置 */ export var _tableOmitConfig = [
    "el",
    "emptyNode",
    "emptySize",
    "interactiveRender",
    "viewEl",
    "viewContentEl",
    "eventCreator", 
];
/** 不需要响应变更的配置 */ export var _tableOmitChangeConfig = [
    "primaryKey",
    // "data",
    // "columns",
    // "rows",
    // "cells",
    // "persistenceConfig",
    "render",
    "texts",
    "plugins",
    "interactive",
    "style",
    "render",
    "emptyNode",
    "wrapClassName",
    "wrapStyle",
    "syncRender",
    "context",
    "onError",
    "onClick",
    "onSelect",
    "onMutation",
    "filterForm",
    "commonFilter",
    "defaultFilter",
    "onFilter",
    "filterSchema",
    "toolBarLeadingCustomer",
    "toolBarTrailingCustomer",
    "dataImport",
    "dataExport",
    "instanceRef", 
];
/** 同tableOmitChangeConfig, 可能是基础类型, 也可能是引用类型的字段, 若是基础类型则校验, 否则跳过 */ export var _tableOmitChangeMixTypeConfig = [
    "rowSelectable",
    "cellSelectable",
    "interactive", 
];
/** 合并处理tableOmitChangeConfig & tableOmitChangeMixTypeConfig */ export var _tableOmitChangeChecker = function(key, value) {
    if (_tableOmitChangeConfig.includes(key)) return true;
    return _tableOmitChangeMixTypeConfig.includes(key) && isReferenceType(value);
};
/** 从table实例中获取tableContext */ export var _getTableCtx = function(instance) {
    return getNamePathValue(instance, "__ctx");
};
