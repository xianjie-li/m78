import {
  _TriggerContext,
  _TriggerTargetData,
  TriggerEvent,
  TriggerTarget,
  TriggerTargetMeta,
} from "./types.js";
import { BoundSize, isNumber } from "@m78/utils";
import { addCls, removeCls } from "../common/index.js";

/** 根据当前的ctx.type更新typeEnableMap */
export function _updateTypeEnableMap(ctx: _TriggerContext) {
  ctx.typeEnableMap = {};

  ctx.type.forEach((key) => {
    ctx.typeEnableMap[key] = true;
  });
}

/** 更新所有项的bound */
export function _updateAllBound(ctx: _TriggerContext) {
  ctx.targetList.forEach(_updateBound);
}

// 更新targetList
export function _updateTargetList(ctx: _TriggerContext) {
  ctx.targetList = Array.from(ctx.eventMap.values());
}

/** 更新传入项的bound */
export function _updateBound(data: _TriggerTargetData) {
  const { isBound, dom } = data;

  if (isBound) {
    data.bound = data.meta.target as BoundSize;
  } else {
    const rect = dom.getBoundingClientRect();

    data.bound = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }
}

/** 通过TriggerTarget初始化data */
export function _targetInit(target: TriggerTarget): _TriggerTargetData {
  const isMetaObj = "target" in target;

  let meta: TriggerTargetMeta;

  let dom: HTMLElement;
  let bound: BoundSize = { left: 0, top: 0, width: 0, height: 0 };

  let isBound = false;

  if (isMetaObj) {
    meta = target;

    if (_isBound(target.target)) {
      bound = target.target;
      isBound = true;
    } else {
      dom = target.target as HTMLElement;
    }
  } else {
    meta = {
      target,
    };

    if (_isBound(target)) {
      bound = target;
      isBound = true;
    } else {
      dom = target as HTMLElement;
    }
  }

  return {
    meta: {
      zIndex: 0,
      ...meta,
    },
    origin: target,
    isBound,
    bound,
    dom: dom!,
  };
}

/** 构建一个所有项均为初始值的TriggerEvent */
export function _buildEvent(
  initProp: {
    type: TriggerEvent["type"];
    nativeEvent: TriggerEvent["nativeEvent"];
    target: TriggerEvent["target"];
  } & Partial<TriggerEvent>
): TriggerEvent {
  return {
    first: true,
    last: false,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    active: false,
    focus: false,
    isInteractiveFocus: false,
    movementX: 0,
    movementY: 0,
    deltaX: 0,
    deltaY: 0,
    ...initProp,
    data: initProp.data || {},
  };
}

/** 检测节点是否为boundSize对象 */
export function _isBound(target: any): target is BoundSize {
  return (
    isNumber(target.left) &&
    isNumber(target.top) &&
    isNumber(target.width) &&
    isNumber(target.height)
  );
}

/** 添加用于禁用默认touch行为的各种css */
export function _addPreventCls(dom: HTMLElement) {
  addCls(dom, "m78-trigger_prevent");
}

/** 移除用于禁用默认touch行为的各种css */
export function _removePreventCls(dom: HTMLElement) {
  removeCls(dom, "m78-trigger_prevent");
}
