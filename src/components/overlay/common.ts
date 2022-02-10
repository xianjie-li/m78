import { AnyFunction, AnyObject, BoundSize, isNumber, omit, TupleNumber } from '@lxjx/utils';
import { TransitionTypeEnum } from 'm78/transition';
import { Z_INDEX_MODAL } from 'm78/common';
import clamp from 'lodash/clamp';
import { UseTriggerEvent, UseTriggerTypeEnum } from 'm78/hooks';
import { useSame } from '@lxjx/hooks';
import {
  _ArrowBasePosition,
  _ClampBound,
  _Context,
  _DirectionMeta,
  _DirectionMetaMap,
  omitApiProps,
  OverlayDirection,
  OverlayDirectionEnum,
  OverlayDirectionKeys,
  OverlayProps,
  OverlayRenderOption,
} from './types';

export const defaultAlignment: TupleNumber = [0.5, 0.5];

export const defaultProps = {
  namespace: 'overlay',
  transitionType: TransitionTypeEnum.zoom,
  zIndex: Z_INDEX_MODAL,
  clickAwayClosable: true,
  clickAwayQueue: true,
  lockScroll: true,
  arrowSize: [26, 8],
  offset: 0,
  triggerType: UseTriggerTypeEnum.click,
  autoFocus: true,
};

export const transitionConfig = {
  tension: 360,
  friction: 24,
};

/** 箭头和目标之间的补白 */
export const arrowSpace = 4;

/** 检测入参是否为BoundSize */
export function isBound(a: any): a is BoundSize {
  if (!a) return false;
  return isNumber(a.left) && isNumber(a.top) && isNumber(a.width) && isNumber(a.height);
}

/**
 * alignment转换为实际xy
 * @param alignment - align配置
 * @param size - 容器尺寸
 * */
export function calcAlignment(alignment: TupleNumber, size: TupleNumber) {
  const sW = window.innerWidth - size[0];
  const sH = window.innerHeight - size[1];
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}

/** 当要为其他上层组件创建api时, 通过此函数来剔除不必要的props */
export function getApiProps(props: OverlayProps): OverlayRenderOption {
  return omit(props, omitApiProps as any) as OverlayRenderOption;
}

type SameConfig = Parameters<typeof useSame>[1];

/**
 * 所有弹层类组件共享的useSame包装, 用于统一mask显示
 * */
export function useOverlaysMask<Meta = AnyObject>(config?: SameConfig) {
  const [index, list, id] = useSame('m78-overlay-mask', config);

  return {
    index,
    list,
    id,
    isFirst: index === 0,
    isLast: index === list.length - 1,
  };
}

/**
 * 所有弹层类组件共享的useSame包装, 用于统一clickAway
 * */
export function useOverlaysClickAway<Meta = AnyObject>(config?: SameConfig) {
  const [index, list, id] = useSame('m78-overlay-clickAway', config);

  return {
    index,
    list,
    id,
    isFirst: index === 0,
    isLast: index === list.length - 1,
  };
}

/** useTrigger回调 */
export function onTrigger(e: UseTriggerEvent, setShow: AnyFunction, self: _Context['self']) {
  if (e.type === UseTriggerTypeEnum.click) {
    setShow((prev: any) => !prev);
  }

  if (e.type === UseTriggerTypeEnum.focus || e.type === UseTriggerTypeEnum.active) {
    self.currentActiveStatus = e.type === UseTriggerTypeEnum.focus ? e.focus : e.active;

    if (!self.activeContent) {
      setShow(self.currentActiveStatus);
    } else {
      self.shouldCloseFlag = true;
    }
  }

  if (e.type === UseTriggerTypeEnum.contextMenu) {
    setShow(true);
  }
}

/**
 * 根据t, c获取内容在OverlayDirection各个位置上的坐标信息_DirectionMeta
 * */
export function getDirections(
  t: BoundSize,
  c: BoundSize,
  clampBound: _ClampBound,
  offset = 0,
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
    direction: OverlayDirectionEnum.top,
  };

  const topStart = {
    top: top.top,
    left: t.left,
    valid: top.valid,
    direction: OverlayDirectionEnum.topStart,
  };

  const topEnd = {
    top: top.top,
    left: t.left + wDiff,
    valid: top.valid,
    direction: OverlayDirectionEnum.topEnd,
  };

  const _bt = t.top + t.height + offset;

  const bottom = {
    top: _bt,
    left: top.left,
    valid: _bt + c.height <= clampBound.bottom,
    direction: OverlayDirectionEnum.bottom,
  };

  const bottomStart = {
    top: bottom.top,
    left: topStart.left,
    valid: bottom.valid,
    direction: OverlayDirectionEnum.bottomStart,
  };

  const bottomEnd = {
    top: bottom.top,
    left: topEnd.left,
    valid: bottom.valid,
    direction: OverlayDirectionEnum.bottomEnd,
  };

  const _l = t.left - c.width - offset;

  const left = {
    top: yCenter,
    left: t.left - c.width - offset,
    valid: _l >= clampBound.left,
    direction: OverlayDirectionEnum.left,
  };

  const leftStart = {
    top: t.top,
    left: left.left,
    valid: left.valid,
    direction: OverlayDirectionEnum.leftStart,
  };

  const leftEnd = {
    top: t.top + hDiff,
    left: left.left,
    valid: left.valid,
    direction: OverlayDirectionEnum.leftEnd,
  };

  const _r = t.left + t.width + offset;

  const right = {
    top: yCenter,
    left: _r,
    valid: _r + c.width <= clampBound.right,
    direction: OverlayDirectionEnum.right,
  };

  const rightStart = {
    top: t.top,
    left: right.left,
    valid: right.valid,
    direction: OverlayDirectionEnum.rightStart,
  };

  const rightEnd = {
    top: t.top + hDiff,
    left: right.left,
    valid: right.valid,
    direction: OverlayDirectionEnum.rightEnd,
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
  top: ['bottom', 'left', 'right'],
  bottom: ['top', 'left', 'right'],
  left: ['right', 'top', 'bottom'],
  right: ['left', 'top', 'bottom'],
};

/**
 * 接收_DirectionMetaMap和指定的方向, 在该方向不可用时选取相反方向或其他备选方向
 * */
export function flip(direction: OverlayDirectionKeys, directions: _DirectionMetaMap) {
  const current = directions[direction];

  if (current.valid) return current;

  // 从备选方向中挑选出一个来使用
  const d = direction.replace(/Start|End/, '');

  const reverseList = flipReverse[d as 'top'];

  let pickCurrent: _DirectionMeta | null = null;

  for (const item of reverseList) {
    const rKey = direction.replace(d, item);
    const next = directions[rKey as 'top'];
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
 *
 * TODO: 返回各方向是否不可见的信息
 * */
export function preventOverflow(
  dMeta: _DirectionMeta,
  t: BoundSize,
  c: BoundSize,
  clampBound: _ClampBound,
  [w, h]: NonNullable<OverlayProps['arrowSize']>,
): [_DirectionMeta, number, boolean] {
  const direction = dMeta.direction;

  // 超出边界后, 保持此距离可见
  const keepOffset = 0;

  // 四个方向的边线, 超出边线距离则该方向不可见
  const lLine = t.left + t.width - clampBound.left;
  const rLine = clampBound.right - t.left;
  const tLine = t.top + t.height - clampBound.top;
  const bLine = clampBound.bottom - t.top;

  const isXDir = isX(direction);
  const isRT = isRightOrTop(direction);

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
  if (isLTRB(direction)) arrowPosition = targetSize / 2 - w / 2;
  if (isStart(direction)) arrowPosition = 0;
  if (isEnd(direction)) arrowPosition = targetSize - w;

  // 左侧坐标加基础位置
  arrowPosition = t[isXDir ? 'left' : 'top'] + arrowPosition;

  const keepSpace = 4;

  // 箭头位置
  let arrowOffset = clamp(
    arrowPosition - arrowLeftBound,
    keepSpace,
    contSize - w - keepSpace * 2 /* 两侧的和 */,
  );

  if (isRT) arrowOffset = -arrowOffset;

  // xy轴上的箭头和剩余空间
  const yExtraSpace = isXDir ? arrowSpace + h : 0;
  const xExtraSpace = isXDir ? 0 : arrowSpace + h;

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
export function getArrowBasePosition(
  direction: OverlayDirection,
  [w, h]: NonNullable<OverlayProps['arrowSize']>,
): _ArrowBasePosition {
  // 旋转后的偏移值
  const offset = (w - h) / 2;

  if (direction.startsWith(OverlayDirectionEnum.top)) {
    return {
      bottom: -h,
      left: 0,
      rotate: 180,
    };
  }

  if (direction.startsWith(OverlayDirectionEnum.bottom)) {
    return {
      top: -h,
      left: 0,
      rotate: 0,
    };
  }

  if (direction.startsWith(OverlayDirectionEnum.left)) {
    return {
      top: offset,
      right: -offset - h,
      rotate: 90,
    };
  }

  if (direction.startsWith(OverlayDirectionEnum.right)) {
    return {
      top: offset,
      left: -offset - h,
      rotate: -90,
    };
  }

  return (null as any) as _ArrowBasePosition;
}

/** 指定方向是否是x轴 */
export function isX(direction: OverlayDirection) {
  return (
    direction.startsWith(OverlayDirectionEnum.top) ||
    direction.startsWith(OverlayDirectionEnum.bottom)
  );
}

/** 指定的方向是否是右或者上 */
export function isRightOrTop(direction: OverlayDirection) {
  return (
    direction.startsWith(OverlayDirectionEnum.right) ||
    direction.startsWith(OverlayDirectionEnum.top)
  );
}

/** 是否为非Start和End的方向 */
export function isLTRB(direction: OverlayDirection) {
  return !/(End|Start)$/.test(direction);
}

export function isStart(direction: OverlayDirection) {
  return /Start$/.test(direction);
}

export function isEnd(direction: OverlayDirection) {
  return /End$/.test(direction);
}

/** 从一组dom中获取最小bound */
export function getMinClampBound(els: HTMLElement[]): _ClampBound {
  const l: number[] = [0];
  const t: number[] = [0];
  const r: number[] = [window.innerWidth];
  const b: number[] = [window.innerHeight];

  els.forEach(el => {
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
