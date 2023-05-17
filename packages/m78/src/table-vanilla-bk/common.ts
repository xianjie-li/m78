import clsx from "clsx";
import { isNumber } from "@m78/utils";

/** 用于在config.el上存储当前实例 */
export const _privateInstanceKey = "__M78TableInstance";

/** 用于在domEl上挂载是否为其是否为内部创建的信息 */
export const _privateScrollerDomKey = "__M78PrivateScrollerDom";

export function _removeNode(node?: Node) {
  if (!node || !node.parentNode) return;
  node.parentNode.removeChild(node);
}

/** 为节点添加className */
export function _addCls(el: HTMLElement, cls: string) {
  if (!el.className.includes(cls)) {
    el.className = clsx(el.className, cls);
  }
}

/** 解析rowIndex_columnIndex格式的字符串为[rowIndex, columnIndex], 数组长度为2表示解析正常 */
export function _getStrCellKey(s?: string) {
  if (!s) return [];
  return s
    .split("_")
    .map(Number)
    .filter((i) => !isNaN(i));
}

export const _getSizeString = (size: number | string) => {
  return isNumber(size) ? `${size}px` : size;
};
