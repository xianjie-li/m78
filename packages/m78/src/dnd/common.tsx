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
  _AutoScrollCtx,
} from "./types.js";
import {
  AnyObject,
  Bound,
  hasScroll,
  isBoolean,
  isFunction,
  isObject,
  raf,
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
  // 所有被光标命中且进过启用检测的节点
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

/** 在距离边缘此比例时即开始滚动(比例) */
const AUTO_SCROLL_OFFSET = 0.1;

/** 根据AUTO_SCROLL_OFFSET计算后的距离不大于此值(px) */
const AUTO_SCROLL_OFFSET_MAX = 40;

/** 自动滚动的基准距离, 越大则滚动速度越快 */
const AUTO_SCROLL_BASE_OFFSET = 16;

/**
 * 计算光标在某个元素四个方向的自定滚动比例 0-1,
 * 不包含滚动条的方向返回值始终为0,
 * 元素不包含滚动条时无返回,
 * 同时只会有一个方向有值
 * */
export function _getAutoScrollStatus(
  el: HTMLElement,
  x: number,
  y: number,
  checkOverflowAttr = true
) {
  const isDocOrBody = el === document.documentElement || el === document.body;

  const si = hasScroll(el, checkOverflowAttr);

  if (!isDocOrBody && !si.x && !si.y) return;

  // 滚动容器为body或html根时, 取窗口尺寸
  // eslint-disable-next-line prefer-const
  let { left, top, right, bottom, width, height } = isDocOrBody
    ? {
        left: 0,
        top: 0,
        bottom: window.innerHeight,
        right: window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    : el.getBoundingClientRect();

  // 取最小、最大触发位置
  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);

  const xTriggerOffset = Math.min(
    AUTO_SCROLL_OFFSET_MAX,
    width * AUTO_SCROLL_OFFSET
  );
  const yTriggerOffset = Math.min(
    AUTO_SCROLL_OFFSET_MAX,
    height * AUTO_SCROLL_OFFSET
  );

  // 计算偏移
  left += xTriggerOffset;
  top += yTriggerOffset;
  right -= xTriggerOffset;
  bottom -= yTriggerOffset;

  let t = 0;
  let r = 0;
  let b = 0;
  let l = 0;

  // 在y轴范围内, 且在可触发自动滚动的范围内(边界前后 yTriggerOffset 范围)
  if (x > left && x < right) {
    if (y < top && y > top - yTriggerOffset * 2) {
      t = Math.min(1, (top - y) / yTriggerOffset);
    }

    if (y > bottom && y < bottom + yTriggerOffset * 2) {
      b = Math.min(1, (y - bottom) / yTriggerOffset);
    }
  }

  // 在x轴范围内
  if (y > top && y < bottom) {
    if (x < left && x > left - xTriggerOffset * 2) {
      l = Math.min(1, (left - x) / xTriggerOffset);
    }

    if (x > right && x < right + xTriggerOffset * 2) {
      r = Math.min(1, (x - right) / xTriggerOffset);
    }
  }

  return {
    top: si.y ? t : 0,
    bottom: si.y ? b : 0,
    left: si.x ? l : 0,
    right: si.x ? r : 0,
  };
}

/**
 * 根据getAutoScrollStatus的返回值滚动元素
 *
 * @param element 滚动元素
 * @param enable status有效时, 是否启用自动滚动, 若滚动一开始, 至少需要传入一次false来关闭自动滚动
 * @param status 光标在模板元素边缘的信息, getAutoScrollStatus的返回值
 * */
export function _autoScrollByStatus(
  element: HTMLElement,
  enable: boolean,
  status: ReturnType<typeof _getAutoScrollStatus>
) {
  const el = element as HTMLElement & { ctx: _AutoScrollCtx };

  // 滚动元素本身是一个非常理想的存储局部滚动状态的对象
  if (!el.ctx) {
    el.ctx = {} as _AutoScrollCtx;
  }

  el.ctx.autoScrollDown = enable;

  if (!el || !status) return;

  // 基础滚动距离
  el.ctx.autoScrollVal = 1;

  if (status.bottom) {
    el.ctx.autoScrollPosKey = "scrollTop";
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.bottom * AUTO_SCROLL_BASE_OFFSET;
  }

  if (status.left) {
    el.ctx.autoScrollPosKey = "scrollLeft";
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.left * AUTO_SCROLL_BASE_OFFSET;
  }

  if (status.top) {
    el.ctx.autoScrollPosKey = "scrollTop";
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.top * AUTO_SCROLL_BASE_OFFSET;
  }

  if (status.right) {
    el.ctx.autoScrollPosKey = "scrollLeft";
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.right * AUTO_SCROLL_BASE_OFFSET;
  }

  // 根据状态开关滚动动画
  if (!(status.bottom || status.top || status.left || status.right)) {
    el.ctx.autoScrollToggle = false;
  } else {
    if (!el.ctx.autoScrollToggle) {
      autoScroll(el);
    }
    el.ctx.autoScrollToggle = true;
  }
}

/** 根据当前的AutoScrollCtx来自动滚动目标元素 */
function autoScroll(el: HTMLElement & { ctx: _AutoScrollCtx }) {
  raf(() => {
    if (el.ctx.autoScrollType === 1) {
      el[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal;

      // 处理浏览器兼容
      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal;
      }
    } else {
      el[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal;

      // 处理浏览器兼容
      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal;
      }
    }

    if (!el.ctx.autoScrollDown || !el.ctx.autoScrollToggle) return;

    autoScroll(el);
  });
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
