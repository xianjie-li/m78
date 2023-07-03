import React, { useEffect, useState } from "react";
import { useSelf } from "@m78/hooks";
import {
  DataSourceItem,
  DataSourceItemCustom,
  ValueType,
} from "../types/index.js";
import { isNumber, isString, isTruthyOrZero } from "@m78/utils";

/** 禁止冒泡的便捷扩展对象 */
export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/** throw error */
export function throwError(errorMsg: string, namespace?: string): never {
  throw new Error(
    `M78💥 -> ${namespace ? `${namespace} -> ` : ""} ${errorMsg}`
  );
}

export function sendWarning(msg: string, namespace?: string) {
  console.log(`M78💢 -> ${namespace ? `${namespace} -> ` : ""} ${msg}`);
}

export function useDelayToggle(
  toggle: boolean,
  options?: {
    /** 300 | 开启延迟，默认为delay的值, 设置为0禁用 */
    leading?: number;
    /** 600 | 离场延迟，默认为delay的值, 设置为0禁用 */
    trailing?: number;
  }
): boolean {
  const { leading = 300, trailing = 600 } = options || {};

  const isDisabled = !trailing && !leading;

  // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
  const [innerState, setInnerState] = useState(!leading ? toggle : false);

  const self = useSelf({
    toggleTimer: null as any,
  });

  useEffect(() => {
    if (isDisabled) return;

    if ((toggle && !leading) || (!toggle && !trailing)) {
      toggle !== innerState && setInnerState(toggle);
      return;
    }

    const d = toggle ? leading : trailing;

    self.toggleTimer = setTimeout(() => {
      setInnerState(toggle);
    }, d);

    return () => {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle]);

  return isDisabled ? toggle : innerState;
}

export const DEFAULT_VALUE_KEY = "value";
export const DEFAULT_LABEL_KEY = "label";
export const DEFAULT_CHILDREN_KEY = "children";

/** 从DataSourceItem中获取value, 如果未获取到并且label是字符串时, 使用label作为value, 支持自定义取值的key */
export function getValueByDataSource(
  item: DataSourceItem,
  cus?: DataSourceItemCustom
): ValueType | null {
  const valueKey = cus?.valueKey || DEFAULT_VALUE_KEY;
  const labelKey = cus?.labelKey || DEFAULT_LABEL_KEY;

  if (isTruthyOrZero(item[valueKey])) return item[valueKey];
  if (isString(item[labelKey]) || isNumber(item[labelKey])) {
    return item[labelKey] as ValueType;
  }

  return null;
}

/** 从DataSourceItem中获取label, 如果未获取到并且value是有效时, 使用value作为label, 支持自定义取值的key */
export function getLabelByDataSource(
  item: DataSourceItem,
  cus?: DataSourceItemCustom
): any {
  const valueKey = cus?.valueKey || DEFAULT_VALUE_KEY;
  const labelKey = cus?.labelKey || DEFAULT_LABEL_KEY;

  if (isTruthyOrZero(item[labelKey])) return item[labelKey];
  if (isTruthyOrZero(item[valueKey])) {
    return item[valueKey];
  }
  return null;
}

/** 从DataSourceItem中获取children, 支持自定义取值的key */
export function getChildrenByDataSource<T = any>(
  item: T,
  cus?: DataSourceItemCustom
): T[] {
  const childrenKey = cus?.childrenKey || DEFAULT_CHILDREN_KEY;

  return (item as any)[childrenKey] || [];
}

/** 为节点添加className */
export function addCls(el: HTMLElement, cls: string) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    const currentClassName = el.className;
    const regex = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
    if (!regex.test(currentClassName)) {
      el.className = (currentClassName + " " + cls).trim();
    }
  }
}

/** 为节点移除className */
export function removeCls(el: HTMLElement, cls: string) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    const currentClassName = el.className;
    const regex = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
    el.className = currentClassName.replace(regex, " ").trim();
  }
}

/** 若存在, 从节点的父节点将其删除 */
export function removeNode(node?: Node) {
  if (!node || !node.parentNode) return;
  node.parentNode.removeChild(node);
}
