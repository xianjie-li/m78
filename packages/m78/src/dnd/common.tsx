import { createContext, useMemo } from "react";
import {
  _DNDMapEntry,
  _GroupState,
  DNDEnableInfos,
  DNDNode,
  DNDPosition,
  DNDProps,
  DNDStatus,
  _Context,
  _PendingItem,
  _LevelContext,
} from "./types.js";
import {
  AnyObject,
  Bound,
  isBoolean,
  isFunction,
  isObject,
  TupleNumber,
} from "@m78/utils";
import { createEvent } from "@m78/hooks";
import isEqual from "lodash/isEqual.js";

export const _DEFAULT_GROUP = "M78-DND-DEFAULT-GROUP";

/** 所有分组数据 */
export const _groupMap: { [key: string]: _GroupState } = {
  [_DEFAULT_GROUP]: {
    scrollParents: [],
    dndMap: {},
  },
};

/** 用于为dnd标记层级关系的context */
export const _levelContext = createContext<_LevelContext>({
  level: 0,
  isDefault: true,
});

/** 在此比例内的区域视为边缘 */
export const EDGE_RATIO = 0.24;

export const _defaultDNDStatus: DNDStatus = {
  dragging: false,
  over: false,
  regular: true,
  left: false,
  right: false,
  top: false,
  bottom: false,
  center: false,
  hasDragging: false,
};

export const _defaultDNDEnableInfos: DNDEnableInfos = {
  enable: true,
  all: true,
  left: true,
  right: true,
  top: true,
  bottom: true,
  center: true,
};

export function _useGroup(groupId?: string) {
  return useMemo(() => {
    if (!groupId) {
      return _groupMap[_DEFAULT_GROUP];
    }
    if (!_groupMap[groupId]) {
      _groupMap[groupId] = {
        scrollParents: [],
        dndMap: {},
      };
    }
    return _groupMap[groupId];
  }, [groupId]);
}

/** 判断x, y 是否在指定的DOMRect区间中 */
export function _isBetweenBound(
  { left, top, right, bottom }: Bound,
  x: number,
  y: number
) {
  return x > left && x < right && y > top && y < bottom;
}

/**
 * 通知所有dnd进行状态重置, 应跳过ignoreIds指定的节点, 且状态有变时才进行重置, 否则会造成高频更新,
 * 传入skipEnableReset时, 跳过enables状态的重置
 * */
export const _resetEvent =
  createEvent<(ignoreIds?: string[], skipEnableReset?: boolean) => void>();

/** 通知所有dnd同步位置尺寸信息 */
export const _updateEvent =
  createEvent<(useThrottle: boolean, groupId?: string) => void>();

/** 用于处理draggingListen, 通知所有dnd更新 */
export const _draggingEvent =
  createEvent<(id: string, dragging: boolean, groupId?: string) => void>();

export const _allValueIsTrue = (obj: AnyObject) => {
  return Object.values(obj).every((v) => v === true);
};

export const _someValueIsTrue = (obj: AnyObject) => {
  return Object.values(obj).some((v) => v === true);
};

export const _getObjectByNewValues = (obj: AnyObject, value: boolean) => {
  const newObj: AnyObject = {};
  Object.keys(obj).forEach((key) => {
    newObj[key] = value;
  });
  return newObj;
};

/** 根据enableDrop获取DNDEnableInfos */
export const _enableDropProcess = (
  enableDrop: DNDProps["enableDrop"],
  current: DNDNode,
  source: DNDNode
): DNDEnableInfos => {
  const enable = isFunction(enableDrop)
    ? enableDrop({ current, source })
    : enableDrop;

  let enables = {
    ..._getObjectByNewValues(_defaultDNDEnableInfos, false),
  } as DNDEnableInfos;

  if (isBoolean(enable)) {
    if (enable) {
      return {
        left: true,
        top: true,
        right: true,
        bottom: true,
        center: true,
        enable: true,
        all: true,
      };
    } else {
      return enables;
    }
  } else if (isObject(enable)) {
    enables = {
      ...enables,
      ...enable,
    };
  }

  return {
    ...enables,
    enable: _someValueIsTrue(enables),
    all: _allValueIsTrue(enables),
  };
};

/** 处理并获取DNDStatus */
export const _statusProcess = (
  dnd: _DNDMapEntry,
  enables: DNDEnableInfos,
  x: number,
  y: number
) => {
  const posEnableInfo = _calcOverStatus(dnd, x, y);

  const status: DNDStatus = {
    dragging: false,
    over: true,
    regular: false,
    top: posEnableInfo.top && enables.top,
    bottom: posEnableInfo.bottom && enables.bottom,
    left: posEnableInfo.left && enables.left,
    right: posEnableInfo.right && enables.right,
    center: posEnableInfo.center && enables.center,
    hasDragging: false,
  };

  status.over =
    status.top || status.bottom || status.left || status.right || status.center;

  if (!status.over) {
    status.regular = true;
  }

  return status;
};

/** 计算元光标和指定元素的覆盖状态, 此函数假设光标已在bound范围内 */
export function _calcOverStatus(
  bound: Bound,
  x: number,
  y: number
): DNDPosition {
  const { left, top, right, bottom } = bound;

  // 尺寸
  const width = right - left;
  const height = bottom - top;

  // 触发边缘放置的偏移距离
  const triggerXOffset = width * EDGE_RATIO;
  const triggerYOffset = height * EDGE_RATIO;

  // 各方向上的拖动状态
  const dragTop = y < top + triggerYOffset;
  const dragBottom = !dragTop && y > bottom - triggerYOffset;

  const nextShouldPass = !dragTop && !dragBottom;

  const dragRight = nextShouldPass && x > right - triggerXOffset;
  const dragLeft = nextShouldPass && x < left + triggerXOffset;
  const dragCenter = nextShouldPass && !dragRight && !dragLeft;

  return {
    top: dragTop,
    bottom: dragBottom,
    left: dragLeft,
    right: dragRight,
    center: dragCenter,
  };
}

/** 根据启用和放置状态判定是否可触发Accept */
export function _checkIfAcceptable(
  enables: DNDEnableInfos,
  status: DNDStatus
): boolean {
  if (status.regular) return false;

  if (enables.all && status.over) {
    return true;
  }

  if (enables.left && status.left) return true;
  if (enables.right && status.right) return true;
  if (enables.top && status.top) return true;
  if (enables.bottom && status.bottom) return true;
  return enables.center && status.center;
}

/**
 * 过滤并处理所有在光标区域内的可用dnd节点, 并主要进行以下操作:
 * - 筛选可用并覆盖了光标的dnd
 * - 在初次点击时, 更新所有可见dnd的enable状态
 * - 为满足条件的dnd生成各位置的status
 * */
export function _filterInBoundDNDs(
  ctx: _Context,
  first: boolean,
  xy: TupleNumber
) {
  // 所有被光标命中经过启用检测的节点
  const inBoundList: _PendingItem[] = [];

  for (const [id, dnd] of Object.entries(ctx.group.dndMap)) {
    if (id === ctx.id) continue;

    // 不可见
    if (!dnd.visible) continue;

    const { enableDrop } = dnd.props;

    const current = dnd.ctx.node;

    const enables = _enableDropProcess(enableDrop, current, ctx.node);

    // 在确认拖动节点后设置到对应dnd状态
    if (first && !isEqual(dnd.ctx.state.enables, enables)) {
      dnd.ctx.setState({
        enables,
      });
    }

    if (!enables.enable) continue;

    // 光标是否在目标区域内
    const inBound = _isBetweenBound(dnd, xy[0], xy[1]);

    // 未在目标区域内
    if (!inBound) continue;

    const status = _statusProcess(dnd, enables, xy[0], xy[1]);

    inBoundList.push({
      dnd,
      enables,
      status,
    });
  }

  return inBoundList;
}

/**
 * 从一组同时命中的dnd中按照指定规则取出一个作为命中点
 * - 规则: 获取level最高的放置点, 若依然存在多个, 获取挂载时间最靠后的一个
 * */
export function _getCurrentTriggerByMultipleTrigger(
  inBoundList: _PendingItem[]
) {
  let current: _PendingItem;

  if (inBoundList.length === 1) {
    current = inBoundList[0];
  } else {
    const list: _PendingItem[] = [];
    let max = 0;

    // 获取level最高的放置点
    for (const item of inBoundList) {
      const level = item.dnd.ctx.level;
      if (level > max) {
        list.splice(0, list.length);
        max = level;
        list.push(item);
        continue;
      }

      if (level === max) {
        list.push(item);
      }
    }

    // 若依然存在多个, 获取挂载时间最靠后的一个
    if (list.length > 1) {
      current = list.reduce((prev, curr) => {
        if (curr.dnd.ctx.mountTime > prev.dnd.ctx.mountTime) return curr;
        return prev;
      }, list[0]);
    } else {
      current = list[0];
    }
  }

  return current;
}

/** 禁止拖动的元素tagName */
const ignoreReg = /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO)$/;

/**  根据事件元素类型决定是否禁止拖动 */
export function _isIgnoreEl(event?: any, ignoreElFilter?: DNDProps["ignore"]) {
  const el = event?.target;

  if (!el) return false;

  const tagName = el.tagName || "";

  if (ignoreReg.test(tagName)) return true;

  const editable = el.getAttribute && el.getAttribute("contenteditable");

  if (editable) return true;

  if (ignoreElFilter) {
    return ignoreElFilter(el);
  }

  return false;
}
