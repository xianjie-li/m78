import { BoundSize, isNumber } from "@m78/utils";
import { TableKey, TablePosition } from "./types/base-type.js";
import { TableConfig } from "./types/config.js";

export const _prefix = "m78-table";

/** 用于在config.el上存储当前实例 */
export const _privateInstanceKey = "__M78TableInstance";

/** 用于在domEl上挂载是否为其是否为内部创建的信息 */
export const _privateScrollerDomKey = "__M78PrivateScrollerDom";

export const _defaultTexts = {
  pasteUnalignedRow: "Pasted rows does not match the number of selected rows.",
  pasteUnalignedColumn:
    "Pasted column does not match the number of selected column.",
  pasteSingleValueLimit: "Paste single value can't exceed {num} cell.",
} as const;

/** 重置级别3的所有配置, 未在其中的所有配置默认为级别1 */
export const _level2ConfigKeys: (keyof TableConfig)[] = [
  "data",
  "columns",
  "rows",
  "cells",
];

/** 不能通过table.config()变更的配置 */
export const _configCanNotChange = [
  "el",
  "primaryKey",
  "plugins",
  "viewEl",
  "viewContentEl",
  "eventCreator",
] as const;

/** 解析rowKey##columnKey格式的字符串为[rowKey, columnKey], 数组长度为2表示解析正常 */
export function _getCellKeysByStr(s?: string) {
  if (!s) return [];
  return s.split("##");
}

/** 根据行列索引获取其字符串形式的ind */
export function _getCellKey(rowKey: TableKey, columnKey: TableKey) {
  return `${rowKey}##${columnKey}`;
}

/** 若是数字, 返回`${size}px`, 是字符串直接返回 */
export function _getSizeString(size: number | string) {
  return isNumber(size) ? `${size}px` : size;
}

/** 根据n个点获取最大Bound */
export function _getBoundByPoint(...pointers: TablePosition[]): BoundSize {
  const [p1, p2] = _getMaxPointByPoint(...pointers);

  const left = p1[0];
  const top = p1[1];

  return {
    left,
    top,
    width: p2[0] - left,
    height: p2[1] - top,
  };
}

/** 根据n个点获取可以组成最大矩形的两个点 */
export function _getMaxPointByPoint(
  ...pointers: TablePosition[]
): TablePosition[] {
  const allX: number[] = [];
  const allY: number[] = [];

  pointers.forEach((p) => {
    if (p.length === 2) {
      allX.push(p[0]);
      allY.push(p[1]);
    }
  });

  // 最小和最大的四个点
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  const maxX = Math.max(...allX);
  const maxY = Math.max(...allY);

  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

/** 用于在正在交互的节点符合条件时跳过table内部的选取/聚焦等事件, 返回true表示需要跳过内部事件 */
type TableEventFilter = (target: HTMLElement) => void | boolean;

/** 节点树包含这些className时应跳过事件 */
export const _tableInterruptTriggerClassName =
  /m78-scroll_bar|m78-table_hide-expand/;

/** 节点树包含这些类型的节点时应跳过事件 */
export const _tableInterruptTriggerTagName =
  /INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO/;

/** 内置事件过滤器 */
export const _tableTriggerFilters = [
  (target: HTMLElement) => {
    if (_tableInterruptTriggerClassName.test(target.className)) return true;
    if (_tableInterruptTriggerTagName.test(target.tagName)) return true;
  },
];

/** 执行一组过滤器, 若该节点需要跳过则返回true, 内部会递归对target所有父级进行校验, 直到stopNode节点为止 */
export function _triggerFilterList(
  target: HTMLElement,
  list: TableEventFilter[],
  stopNode: HTMLElement
): boolean {
  let cur: HTMLElement | null;

  cur = target;

  while (cur !== null) {
    for (let i = 0; i < list.length; i++) {
      const res = list[i](target);
      if (res) return true;
    }

    const parent = cur.parentNode as HTMLElement;

    if (!parent || parent === stopNode) {
      return false;
    }

    cur = parent;
  }

  return false;
}

/** 检测传入的事件是否是touch事件 */
export function isTouch(e: Event) {
  return e.type.startsWith("touch") || (e as any).pointerType === "touch";
}
