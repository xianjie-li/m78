import { BoundSize, isNumber } from "@m78/utils";
import { TableConfig, TableKey, TablePosition } from "./types.js";

export const _prefix = "m78-table";

/** 用于在config.el上存储当前实例 */
export const _privateInstanceKey = "__M78TableInstance";

/** 用于在domEl上挂载是否为其是否为内部创建的信息 */
export const _privateScrollerDomKey = "__M78PrivateScrollerDom";

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

/** 若存在, 从节点的父节点将其删除 */
export function _removeNode(node?: Node) {
  if (!node || !node.parentNode) return;
  node.parentNode.removeChild(node);
}

/** 解析rowIndex##columnIndex格式的字符串为[rowIndex, columnIndex], 数组长度为2表示解析正常 */
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

/** 根据鼠标/触摸/指针事件获取offsetSize, 也就是点击位置相距目标左上角的偏移 */
export function _getOffset(
  e: MouseEvent | TouchEvent | PointerEvent,
  target: HTMLElement
): [number, number] {
  const touch = (e as TouchEvent).changedTouches;
  let clientX = 0;
  let clientY = 0;

  if (touch) {
    clientX = touch[0].clientX;
    clientY = touch[0].clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }

  const { left, top } = target.getBoundingClientRect();
  return [clientX - left, clientY - top];
}
