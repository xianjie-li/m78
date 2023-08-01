import { getNamePathValue, isReferenceType } from "@m78/utils";
import { TablePluginContext } from "../table-vanilla/types/context.js";

/** 需要忽略的配置 */
export const _tableOmitConfig = [
  "el",
  "emptyNode",
  "emptySize",
  "interactiveRender",
  "viewEl",
  "viewContentEl",
  "eventCreator",
] as const;

/** 不需要响应变更的配置 */
export const _tableOmitChangeConfig = [
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
  "onFilter",
  "autoFilter",
  "commonFilter",
  "defaultParams",
  "toolBarLeadingCustomer",
  "toolBarTrailingCustomer",
  "dataImport",
  "dataExport",
  "filterSchema",
] as const;

/** 同tableOmitChangeConfig, 可能是基础类型, 也可能是引用类型的字段, 若是基础类型则校验, 否则跳过 */
export const _tableOmitChangeMixTypeConfig = [
  "rowSelectable",
  "cellSelectable",
  "interactive",
] as const;

/** 合并处理tableOmitChangeConfig & tableOmitChangeMixTypeConfig */
export const _tableOmitChangeChecker = (key: string, value: any) => {
  if (_tableOmitChangeConfig.includes(key as any)) return true;

  return (
    _tableOmitChangeMixTypeConfig.includes(key as any) && isReferenceType(value)
  );
};

/** 从table实例中获取tableContext */
export const _getTableCtx = (instance: any): TablePluginContext => {
  return getNamePathValue(instance, "__ctx");
};
