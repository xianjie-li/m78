import { isReferenceType } from "@m78/utils";
import { RCTableProps } from "./types.js";
import { RCTablePlugin } from "./plugin.js";

/** 需要忽略的table-vanilla配置 */
export const _tableOmitConfig = [
  "el",
  "emptyNode",
  "emptySize",
  "interactiveRender",
  "viewEl",
  "viewContentEl",
  "eventCreator",
  "persistenceConfig",
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
  "schemas",
  "dataOperations",
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

/** 由于plugin.rcRuntime等api必须与组件同步运行(包含hooks), 在初始化时将RCTablePlugin插件进行预先实例化 */
export const preInstantiationRCPlugin = (
  plugins: NonNullable<RCTableProps["plugins"]>
) => {
  const fakeConf: any = {
    table: {},
    plugins: [],
    context: {},
    config: {},
  };

  return plugins.map((p) => {
    // 若是RCTablePlugin的子类, 预先对其实例化
    if (Object.getPrototypeOf(p.prototype) === RCTablePlugin.prototype) {
      return new p(fakeConf);
    }
    return p;
  });
};
