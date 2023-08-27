import React from "react";
import {
  AnyFunction,
  BoundSize,
  dumpFn,
  isNumber,
  omit,
  TupleNumber,
} from "@m78/utils";
import { config } from "react-spring";
import { TransitionType } from "../transition/index.js";
import { Z_INDEX_MODAL } from "../common/index.js";
import clamp from "lodash/clamp.js";
import { useSame } from "@m78/hooks";
import {
  _ArrowBasePosition,
  _ClampBound,
  _OverlayContext,
  _DirectionMeta,
  _DirectionMetaMap,
  _DragContext,
  omitApiProps,
  OverlayDirection,
  OverlayDirectionKeys,
  OverlayDirectionUnion,
  OverlayProps,
  OverlayRenderOption,
} from "./types.js";
import { TriggerEvent, TriggerType } from "../trigger/index.js";
import { _Methods } from "./use-methods.js";

export const _defaultAlignment: TupleNumber = [0.5, 0.5];

export const _defaultProps = {
  namespace: "overlay",
  transitionType: TransitionType.fade,
  zIndex: Z_INDEX_MODAL,
  clickAwayClosable: true,
  clickAwayQueue: true,
  lockScroll: true,
  arrowSize: [26, 8],
  offset: 0,
  triggerType: TriggerType.click,
  autoFocus: true,
  escapeClosable: true,
};

export const overlayTransitionConfig = config.stiff;

/** 箭头和目标之间的补白 */
export const _arrowSpace = 4;

export const dragContext = React.createContext<_DragContext>({
  onDrag: dumpFn,
  getXY: dumpFn,
  getBound: dumpFn,
});

/** 检测入参是否为BoundSize */
export function isBound(a: any): a is BoundSize {
  if (!a) return false;
  return (
    isNumber(a.left) &&
    isNumber(a.top) &&
    isNumber(a.width) &&
    isNumber(a.height)
  );
}

/**
 * alignment转换为实际xy
 * @param alignment - align配置
 * @param size - 容器尺寸
 * */
export function _calcAlignment(alignment: TupleNumber, size: TupleNumber) {
  const sW = window.innerWidth - size[0];
  const sH = window.innerHeight - size[1];
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}

/** 当要为其他上层组件创建api时, 通过此函数来剔除不必要的props */
export function getOverlayApiProps(props: OverlayProps): OverlayRenderOption {
  return omit(props, omitApiProps as any) as OverlayRenderOption;
}

type SameConfig = Parameters<typeof useSame>[1];

/**
 * 所有弹层类组件共享的useSame包装, 用于统一mask显示
 * */
export function useOverlaysMask(config?: SameConfig) {
  const [index, list, id] = useSame("m78-overlay-mask", config);

  return {
    index,
    list,
    id,
    isFirst: index === 0,
    isLast: index === list.length - 1,
  };
}

const defaultClickAwaySameNameSpace = "m78-overlay-clickAway";

/**
 * 所有弹层类组件共享的useSame包装, 用于统一clickAway
 * */
export function useOverlaysClickAway(config?: SameConfig, namespace?: string) {
  const [index, list, id] = useSame(
    namespace || defaultClickAwaySameNameSpace,
    config
  );

  return {
    index,
    list,
    id,
    isFirst: index === 0,
    isLast: index === list.length - 1,
  };
}

/**
 * 所有弹层类组件共享的useSame包装, 用于统一escapeClosable
 * */
export function useEscapeCloseable(config?: SameConfig) {
  const [index, list, id] = useSame("m78-overlay-escape-closeable", config);

  return {
    index,
    list,
    id,
    isFirst: index === 0,
    isLast: index === list.length - 1,
  };
}

/** useTrigger回调 */
export function _onTrigger(e: TriggerEvent, ctx: _OverlayContext) {
  const { props, self, setOpen, methods } = ctx;

  props.onTrigger?.(e);

  if (e.type === TriggerType.click) {
    if (self.lastFocusTime) {
      // focus和click前后间隔400ms才触发
      const diff = Date.now() - self.lastFocusTime;
      if (diff > 400) {
        setOpen((prev: any) => {
          const next = !prev;
          if (next) {
            props.onOpenTrigger?.(e);
          }
          return next;
        });
      }
    } else {
      setOpen((prev: any) => {
        const next = !prev;
        if (next) {
          props.onOpenTrigger?.(e);
        }
        return next;
      });
    }
  }

  // 标记正常触发focus, 并在open改变时取消
  if (e.type === TriggerType.focus && e.focus) {
    self.lastFocusTime = Date.now();
  }

  if (e.type === TriggerType.focus || e.type === TriggerType.active) {
    self.currentActiveStatus =
      e.type === TriggerType.focus ? e.focus : e.active;

    if (!self.activeContent || self.currentActiveStatus) {
      if (self.currentActiveStatus) {
        props.onOpenTrigger?.(e);
      }
      setOpen(self.currentActiveStatus);
    } else {
      self.shouldCloseFlag = true;
    }
  }

  if (e.type === TriggerType.contextMenu) {
    methods.updateXY([e.x, e.y], true);
    props.onOpenTrigger?.(e);
    setOpen(true);
  }

  if (e.type === TriggerType.move) {
    if (!e.last) {
      clearTimeout(self.lastMoveCloseTimer);

      methods.updateXY([e.x, e.y], true);

      if (e.first) {
        props.onOpenTrigger?.(e);
      }

      if (!ctx.open) {
        setOpen(true);
      }
    } else {
      self.lastMoveCloseTimer = setTimeout(() => {
        setOpen(false);
      }, 80);
    }
  }
}

/**
 * 根据t, c获取内容在OverlayDirection各个位置上的坐标信息_DirectionMeta
 * */
export function _getDirections(
  t: BoundSize,
  c: BoundSize,
  clampBound: _ClampBound,
  offset = 0
): _DirectionMetaMap {
  // 目标和内容的宽度差异的
  const wDiff = t.width - c.width;
  const xCenter = wDiff / 2 + t.left;

  const hDiff = t.height - c.height;
  const yCenter = hDiff / 2 + t.top;

  const _t = t.top - c.height - offset;

  const top = {
    top: _t,
    left: xCenter,
    valid: _t >= clampBound.top,
    direction: OverlayDirection.top,
  };

  const topStart = {
    top: top.top,
    left: t.left,
    valid: top.valid,
    direction: OverlayDirection.topStart,
  };

  const topEnd = {
    top: top.top,
    left: t.left + wDiff,
    valid: top.valid,
    direction: OverlayDirection.topEnd,
  };

  const _bt = t.top + t.height + offset;

  const bottom = {
    top: _bt,
    left: top.left,
    valid: _bt + c.height <= clampBound.bottom,
    direction: OverlayDirection.bottom,
  };

  const bottomStart = {
    top: bottom.top,
    left: topStart.left,
    valid: bottom.valid,
    direction: OverlayDirection.bottomStart,
  };

  const bottomEnd = {
    top: bottom.top,
    left: topEnd.left,
    valid: bottom.valid,
    direction: OverlayDirection.bottomEnd,
  };

  const _l = t.left - c.width - offset;

  const left = {
    top: yCenter,
    left: t.left - c.width - offset,
    valid: _l >= clampBound.left,
    direction: OverlayDirection.left,
  };

  const leftStart = {
    top: t.top,
    left: left.left,
    valid: left.valid,
    direction: OverlayDirection.leftStart,
  };

  const leftEnd = {
    top: t.top + hDiff,
    left: left.left,
    valid: left.valid,
    direction: OverlayDirection.leftEnd,
  };

  const _r = t.left + t.width + offset;

  const right = {
    top: yCenter,
    left: _r,
    valid: _r + c.width <= clampBound.right,
    direction: OverlayDirection.right,
  };

  const rightStart = {
    top: t.top,
    left: right.left,
    valid: right.valid,
    direction: OverlayDirection.rightStart,
  };

  const rightEnd = {
    top: t.top + hDiff,
    left: right.left,
    valid: right.valid,
    direction: OverlayDirection.rightEnd,
  };

  return {
    top,
    topStart,
    topEnd,
    bottom,
    bottomStart,
    bottomEnd,
    left,
    leftStart,
    leftEnd,
    right,
    rightStart,
    rightEnd,
  };
}

const flipReverse = {
  top: ["bottom", "left", "right"],
  bottom: ["top", "left", "right"],
  left: ["right", "top", "bottom"],
  right: ["left", "top", "bottom"],
};

/**
 * 接收_DirectionMetaMap和指定的方向, 在该方向不可用时依次选取 lastDirection > 相反方向 > 其他备选方向
 * @param direction - 指定方向
 * @param directions - 所有可用方向
 * @param lastDirection - 最后一次使用的方向
 * */
export function _flip(
  direction: OverlayDirectionKeys,
  directions: _DirectionMetaMap,
  lastDirection?: OverlayDirectionKeys
) {
  const current = directions[direction];

  if (current.valid) return current;

  if (lastDirection) {
    const lastCurrent = directions[lastDirection];
    if (lastCurrent.valid) return lastCurrent;
  }

  // 从备选方向中挑选出一个来使用
  const d = direction.replace(/Start|End/, "");

  const reverseList = flipReverse[d as "top"];

  let pickCurrent: _DirectionMeta | null = null;

  for (const item of reverseList) {
    const rKey = direction.replace(d, item);
    const next = directions[rKey as "top"];
    if (next && next.valid) {
      pickCurrent = next;
      break;
    }
  }

  if (pickCurrent) return pickCurrent;

  // 没有可用的备选方向是, 使用原方向
  return current;
}

/**
 * 在所在轴超出窗口时, 修正位置避免遮挡
 * number为监听的实际偏移值
 * boolean表示气泡是否应该隐藏或弱化显示, 超出可见区域一个t尺寸时为true
 * */
export function _preventOverflow(
  dMeta: _DirectionMeta,
  t: BoundSize,
  c: BoundSize,
  clampBound: _ClampBound,
  [w, h]: NonNullable<OverlayProps["arrowSize"]>
): [_DirectionMeta, number, boolean] {
  const direction = dMeta.direction;

  // 超出边界后, 保持此距离可见
  const keepOffset = 0;

  // 四个方向的边线, 超出边线距离则该方向不可见
  const lLine = t.left + t.width - clampBound.left;
  const rLine = clampBound.right - t.left;
  const tLine = t.top + t.height - clampBound.top;
  const bLine = clampBound.bottom - t.top;

  const isXDir = _isX(direction);
  const isRT = _isRightOrTop(direction);

  let left = dMeta.left;
  let top = dMeta.top;

  // 各轴上默认情况下的最大最小可用位置
  let xMax = clampBound.right - c.width;
  let yMax = clampBound.bottom - c.height;
  let xMin = clampBound.left;
  let yMin = clampBound.top;

  // x或y轴时候超出
  const xOverflow = lLine < 0 || rLine < 0;
  const yOverflow = tLine < 0 || bLine < 0;

  // 目标和内容的右侧区域
  const contentRight = dMeta.left + c.width;
  const targetRight = t.left + t.width;
  const contentBottom = dMeta.top + c.height;
  const targetBottom = t.top + t.height;

  // 目标超出区域, 添加位置修正
  if (xOverflow) {
    xMax += c.width - keepOffset;
    xMin -= c.width - keepOffset;

    // 修正的轴
    const isXLine = isXDir;

    // 超出边
    if (isXLine && rLine < 0) {
      // 到这里, left已经比实际的少了: c的宽度 + (目标left - 实际left) 即目标和内容在对立方向的差值
      // 其他三个方向大致同理
      left -= c.width + (dMeta.left - t.left);
    }

    if (isXLine && lLine < 0) {
      left += c.width + (targetRight - contentRight);
    }
  }

  if (yOverflow) {
    yMin -= c.height - keepOffset;
    yMax += c.height - keepOffset;

    const isYLine = !isXDir;

    if (isYLine && bLine < 0) {
      top -= c.height + (dMeta.top - t.top);
    }

    if (isYLine && tLine < 0) {
      top += c.height + (targetBottom - contentBottom);
    }
  }

  const finalLeft = clamp(left, xMin, xMax);
  const finalTop = clamp(top, yMin, yMax);

  /** # 箭头处理 */
  // 箭头的最左侧坐标
  const arrowLeftBound = isXDir ? finalLeft : finalTop;
  // 内容在其对应轴的尺寸
  const contSize = isXDir ? c.width : c.height;
  // 目标在其对应轴的尺寸
  const targetSize = isXDir ? t.width : t.height;
  // 箭头位置
  let arrowPosition = 0;

  // 基础位置
  if (_isLTRB(direction)) arrowPosition = targetSize / 2 - w / 2;
  if (_isStart(direction)) arrowPosition = 0;
  if (_isEnd(direction)) arrowPosition = targetSize - w;

  // 左侧坐标加基础位置
  arrowPosition = t[isXDir ? "left" : "top"] + arrowPosition;

  const keepSpace = 4;

  // 箭头位置
  let arrowOffset = clamp(
    arrowPosition - arrowLeftBound,
    keepSpace,
    contSize - w - keepSpace * 2 /* 两侧的和 */
  );

  if (isRT) arrowOffset = -arrowOffset;

  // xy轴上的箭头和剩余空间
  const yExtraSpace = isXDir ? _arrowSpace + h : 0;
  const xExtraSpace = isXDir ? 0 : _arrowSpace + h;

  // 是否已隐藏, 超出可见区域一个target尺寸视为不可见
  const isHidden =
    lLine + xExtraSpace < -c.width ||
    rLine + xExtraSpace < -c.width ||
    tLine + yExtraSpace < -c.height ||
    bLine + yExtraSpace < -c.height;

  return [
    {
      ...dMeta,
      left: finalLeft,
      top: finalTop,
    },
    arrowOffset,
    isHidden,
  ];
}

/**
 * 获取箭头的的基础位置
 * */
export function _getArrowBasePosition(
  direction: OverlayDirectionUnion,
  [w, h]: NonNullable<OverlayProps["arrowSize"]>
): _ArrowBasePosition {
  // 旋转后的偏移值
  const offset = (w - h) / 2;

  if (direction.startsWith(OverlayDirection.top)) {
    return {
      bottom: -h,
      left: 0,
      rotate: 180,
    };
  }

  if (direction.startsWith(OverlayDirection.bottom)) {
    return {
      top: -h,
      left: 0,
      rotate: 0,
    };
  }

  if (direction.startsWith(OverlayDirection.left)) {
    return {
      top: offset,
      right: -offset - h,
      rotate: 90,
    };
  }

  if (direction.startsWith(OverlayDirection.right)) {
    return {
      top: offset,
      left: -offset - h,
      rotate: -90,
    };
  }

  return null as any as _ArrowBasePosition;
}

/** 指定方向是否是x轴 */
export function _isX(direction: OverlayDirectionUnion) {
  return (
    direction.startsWith(OverlayDirection.top) ||
    direction.startsWith(OverlayDirection.bottom)
  );
}

/** 指定的方向是否是右或者上 */
export function _isRightOrTop(direction: OverlayDirectionUnion) {
  return (
    direction.startsWith(OverlayDirection.right) ||
    direction.startsWith(OverlayDirection.top)
  );
}

/** 是否为非Start和End的方向 */
export function _isLTRB(direction: OverlayDirectionUnion) {
  return !/(End|Start)$/.test(direction);
}

export function _isStart(direction: OverlayDirectionUnion) {
  return /Start$/.test(direction);
}

export function _isEnd(direction: OverlayDirectionUnion) {
  return /End$/.test(direction);
}

/** 从一组dom中获取最小bound */
export function _getMinClampBound(els: HTMLElement[]): _ClampBound {
  const l: number[] = [0];
  const t: number[] = [0];
  const r: number[] = [window.innerWidth];
  const b: number[] = [window.innerHeight];

  els.forEach((el) => {
    const bound = el.getBoundingClientRect();
    l.push(bound.left);
    t.push(bound.top);
    r.push(bound.right);
    b.push(bound.bottom);
  });

  return {
    left: Math.max(...l),
    top: Math.max(...t),
    right: Math.min(...r),
    bottom: Math.min(...b),
  };
}
