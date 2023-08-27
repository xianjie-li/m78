import { getNamePathValue, isReferenceType } from "@m78/utils";
import { TablePluginContext } from "../table-vanilla/types/context.js";

/** 需要忽略的table-vanilla配置 */
export const _tableOmitConfig = [
  "el",
  "emptyNode",
  "emptySize",
  "interactiveRender",
  "viewEl",
  "viewContentEl",
  "eventCreator",
] as const;

/** 需要在变更时更新到table实例的props key */
export const _tableChangedListenKeys = [
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
] as const;

/** 同_tableChangedListenKeys, 可能是基础类型, 也可能是引用类型的字段, 若是基础类型则校验, 否则跳过 */
export const _tableChangedMixTypeConfig = [
  "rowSelectable",
  "cellSelectable",
  "interactive",
] as const;

/** 合并处理_tableChangedListenKeys & _tableChangedMixTypeConfig */
export const _tableChangedIncludeChecker = (key: string, value: any) => {
  if (_tableChangedListenKeys.includes(key as any)) return true;

  return (
    _tableChangedMixTypeConfig.includes(key as any) && !isReferenceType(value)
  );
};

/** 从table实例中获取tableContext */
export const _getTableCtx = (instance: any): TablePluginContext => {
  return getNamePathValue(instance, "__ctx");
};