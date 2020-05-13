import { isDom } from '@lxjx/utils';

/** 用来描述尺寸信息 */
interface GetPopperMetasSource {
  width: number;
  height: number;
}

/** 描述位置和尺寸 */
export interface GetPopperMetasBound {
  width: number;
  height: number;
  left: number;
  top: number;
}

/** 配置 */
interface GetPopperMetasOptions {
  /** 设置包裹元素，默认为窗口 */
  wrap?: HTMLElement | GetPopperMetasBound;
  /** 0 | 偏移距离，对于左/上是减少距离，右/下是增加距离 */
  offset?: number;
  /** top | 预设方向 */
  direction?: GetBoundMetasDirectionKeys;
  /** 前一个方向，用于推测出当前更适合放置气泡的方向, 不传时取 direction */
  prevDirection?: GetBoundMetasDirectionKeys;
}

/** 所有可能出现的方向 */
export type GetBoundMetasDirectionKeys =
  | 'topStart'
  | 'top'
  | 'topEnd'
  | 'leftStart'
  | 'left'
  | 'leftEnd'
  | 'bottomStart'
  | 'bottom'
  | 'bottomEnd'
  | 'rightStart'
  | 'right'
  | 'rightEnd';

/** 提供给外部适用的一下方向和位置信息 */
export interface GetBoundDirectionItem {
  /** 该方向是否安全可用 */
  safe: boolean;
  /** 改元素在x轴上放置的位置 */
  x: number;
  /** 改元素在x轴上放置的位置 */
  y: number;
  [key: string]: any;
}

/** 表示一个可用位置 */
interface Degrade {
  direction: 'top' | 'right' | 'bottom' | 'left';
  x: number;
  y: number;
  arrowX: number;
}

/** 表示当前所有方向有关信息的对象 */
export type GetBoundMetas = {
  [key in GetBoundMetasDirectionKeys]: GetBoundDirectionItem;
};

export interface getPopperMetasReturns {
  /** 所有方向的描述对象 */
  metas: GetBoundMetas;
  /** 气泡是否可见 */
  visible: boolean;
  /** 气泡应显示的位置 */
  currentDirection: GetBoundDirectionItem;
  /** 表示currentDirection的key */
  currentDirectionKey: GetBoundMetasDirectionKeys;
  /** 所有理想位置都不可用，但存在的其他可用位置 */
  degrade?: Degrade;
  /** 没有可用理想位置 */
  notValidDirection?: boolean;
}

/** 关联的方向，用于帮助猜测下一个Direction的合理位置 */
const relateDirectionMap: { [key in GetBoundMetasDirectionKeys]: GetBoundMetasDirectionKeys[] } = {
  topStart: ['top', 'topEnd', 'bottomStart'],
  top: ['topStart', 'topEnd'],
  topEnd: ['top', 'topStart', 'bottomEnd'],
  leftStart: ['left', 'leftEnd', 'bottom'],
  left: ['leftStart', 'left', 'leftEnd', 'bottom'],
  leftEnd: ['left', 'leftStart', 'top'],
  bottomStart: ['bottom', 'bottomEnd', 'topStart'],
  bottom: ['bottomStart', 'bottomEnd'],
  bottomEnd: ['bottom', 'bottomStart', 'topEnd'],
  rightStart: ['right', 'rightEnd', 'bottom'],
  right: ['rightStart', 'rightEnd', 'bottom'],
  rightEnd: ['right', 'rightStart', 'top'],
};

const defaultOptions = {
  offset: 0,
  direction: 'top' as GetBoundMetasDirectionKeys,
};

/**
 * 根据目标元素和气泡元素的尺寸等获取气泡在目标各位置上的位置和可用信息、是否可见、以及推测当前合适的位置
 * @param source - 气泡元素的dom节点或虚拟尺寸信息
 * @param target - 目标元素的dom节点或虚拟位置信息
 * @param options - 一些额外配置
 * @returns - popper在各个方向上的位置信息和可用情况
 * */
export function getPopperMetas(
  source: HTMLElement | GetPopperMetasSource,
  target: HTMLElement | GetPopperMetasBound,
  options?: GetPopperMetasOptions,
): getPopperMetasReturns {
  const { wrap, offset, direction, prevDirection } = {
    ...defaultOptions,
    ...options,
  };
  const wH = window.innerHeight;
  const wW = window.innerWidth;

  /** 取值, dom > GetPopperMetasBound > 默认(窗口) */
  const wrapB = isDom(wrap)
    ? wrap.getBoundingClientRect()
    : wrap || {
        top: 0,
        left: 0,
        width: wW,
        height: wH,
      };

  const sourceB = isDom(source) ? source.getBoundingClientRect() : source;
  const targetB = isDom(target) ? target.getBoundingClientRect() : target;

  /* ########## 基础依赖值 ######### */

  /** 目标元素 + 气泡元素的总尺寸 */
  const allHeight = targetB.height + sourceB.height;
  const allWidth = targetB.width + sourceB.width;

  /** 包裹元素距离窗口底部的距离 */
  const WrapOffsetToBottom = wH - wrapB.top - wrapB.height;
  /** 包裹元素距离窗口右边的距离 */
  const WrapOffsetToRight = wW - wrapB.left - wrapB.width;

  /** 气泡元素尺寸减去目标元素尺寸 */
  const targetOverWidth = sourceB.width - targetB.width;
  const targetOverHeight = sourceB.height - targetB.height;

  /** 气泡元素尺寸减去目标元素尺寸的一半 */
  const targetOverWidthHalf = targetOverWidth / 2;
  const targetOverHeightHalf = targetOverHeight / 2;

  /* ######### 联动判断处理 ########## */

  /** 上下基础启用规则 */
  const TBEnableBaseLeft = targetB.left - wrapB.left;
  const TBEnableBaseRight = targetB.left + WrapOffsetToRight + targetB.width;

  /** 启用top、bottom的额外条件 */
  const enableTB =
    /*  */
    TBEnableBaseLeft - targetOverWidthHalf > 0 &&
    /*  */
    TBEnableBaseRight + targetOverWidthHalf < wW;

  /** 启用topStart、bottomStart的额外条件 */
  const enableTEBE =
    /*  */
    TBEnableBaseLeft - targetOverWidth - offset > 0 &&
    /*  */
    TBEnableBaseRight - offset < wW;

  /** 启用topStart、bottomStart的额外条件 */
  const enableTSBS =
    /*  */
    TBEnableBaseLeft + offset > 0 &&
    /*  */
    TBEnableBaseRight + targetOverWidth + offset < wW;

  /** 左右基础启用规则 */
  const LREnableBaseTop = targetB.top - wrapB.top;
  const LREnableBaseBottom = targetB.top + WrapOffsetToBottom + targetB.height;

  /** 启用left、right的额外条件 */
  const enableLR =
    /* 目标顶边距 - 包裹顶边距 > 0 */
    LREnableBaseTop - targetOverHeightHalf > 0 &&
    /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
    LREnableBaseBottom + targetOverWidthHalf < wH;

  // 启用leftEnd、rightEnd的额外条件
  const enableLERE =
    /* 目标顶边距 - 包裹顶边距 > 0 */
    LREnableBaseTop - targetOverHeight - offset > 0 &&
    /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
    LREnableBaseBottom - offset < wH;

  // 启用leftStart、rightStart的额外条件
  const enableLSRS =
    /* 目标顶边距 - 包裹顶边距 > 0 */
    LREnableBaseTop - offset > 0 &&
    /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
    LREnableBaseBottom + targetOverHeight - offset < wH;

  /* ########### 基础位置计算 ########## */

  const topBase =
    /* 目标顶边距 - 容器顶边距 > 气泡高度 */
    targetB.top - wrapB.top - offset > sourceB.height &&
    /* 目标顶边距 - 包裹元素底边距 - 窗口高度 */
    targetB.top + WrapOffsetToBottom - wH - offset < 0;

  const bottomBase =
    /* 窗口高 - 目标上边距 - 包裹元素低边距 > 总高度 */
    wH - targetB.top - WrapOffsetToBottom - offset > allHeight &&
    /* 目标上边距 - 包裹元素上边距 + 总高度 */
    targetB.top - wrapB.top + targetB.height + offset > 0;

  const leftBase =
    /*  */
    targetB.left - wrapB.left - offset > sourceB.width &&
    /*  */
    targetB.left + WrapOffsetToRight - offset - wW < 0;

  const rightBase =
    /*  */
    wW - targetB.left - WrapOffsetToRight - offset > allWidth &&
    /*  */
    targetB.left - wrapB.left + targetB.width + offset > 0;

  const winSt = document.documentElement.scrollTop + document.body.scrollTop;
  const winSl = document.documentElement.scrollLeft + document.body.scrollLeft;

  const topYBase = targetB.top - sourceB.height + winSt;
  const bottomYBase = targetB.top + targetB.height + winSt + offset;

  const LeftXBase = targetB.left - sourceB.width + winSl - offset;
  const rightXBase = targetB.left + targetB.width + winSl + offset;
  const rightLeftYBase = targetB.top - (sourceB.height - targetB.height) / 2 + winSt;
  const rightLeftEndYBase = targetB.top + targetB.height - sourceB.height + winSt;
  const topBottomEndYBase = targetB.left + targetB.width - sourceB.width + winSl;
  const topBottomXBase = targetB.left - targetOverWidthHalf + winSl;

  const dMeta = {
    top: {
      safe: topBase && enableTB,
      x: topBottomXBase,
      y: topYBase - offset,
    },
    topEnd: {
      safe: topBase && enableTEBE,
      x: topBottomEndYBase,
      y: topYBase - offset,
    },
    topStart: {
      safe: topBase && enableTSBS,
      x: targetB.left + winSl,
      y: topYBase - offset,
    },
    bottomEnd: {
      safe: bottomBase && enableTEBE,
      x: topBottomEndYBase,
      y: bottomYBase,
    },
    bottomStart: {
      safe: bottomBase && enableTSBS,
      x: targetB.left + winSl,
      y: bottomYBase,
    },
    bottom: {
      safe: bottomBase && enableTB,
      x: topBottomXBase,
      y: bottomYBase,
    },
    left: {
      safe: leftBase && enableLR,
      x: LeftXBase,
      y: rightLeftYBase,
    },
    leftStart: {
      safe: leftBase && enableLSRS,
      x: LeftXBase,
      y: targetB.top + winSt,
    },
    leftEnd: {
      safe: leftBase && enableLERE,
      x: LeftXBase,
      y: rightLeftEndYBase,
    },
    right: {
      safe: rightBase && enableLR,
      x: rightXBase,
      y: rightLeftYBase,
    },
    rightStart: {
      safe: rightBase && enableLSRS,
      x: rightXBase,
      y: targetB.top + winSt,
    },
    rightEnd: {
      safe: rightBase && enableLERE,
      x: rightXBase,
      y: rightLeftEndYBase,
    },
  };

  const current = getPopperDirectionForMeta(dMeta, direction, prevDirection || direction);
  let currentMeta = current[0];
  let currentDirection = current[1];
  const notValidDirection = current[2];

  const cL = currentMeta.x;
  const cT = currentMeta.y;
  const cW = sourceB.width;
  const ch = sourceB.height;

  // 传递给其他函数来拆分函数
  const passData = {
    targetB,
    wrapB,
    sourceB,
    winSt,
    winSl,
    offset,
  };

  const hidden =
    /* left */
    cL + cW < wrapB.left + winSl ||
    /* top */
    cT + ch < wrapB.top + winSt ||
    /* bottom */
    cT > wrapB.top + wrapB.height + winSt ||
    /* right */
    cL > wrapB.left + wrapB.width + winSl;

  let degrade: Degrade | undefined;

  if (notValidDirection && sourceB.width / wrapB.width > 0.7) {
    degrade = getDegrade(passData);
    if (degrade) {
      currentMeta = {
        x: degrade.x,
        y: degrade.y,
        safe: true,
        arrowX: degrade.arrowX,
      };
      currentDirection = degrade.direction;
    }
  }

  return {
    metas: dMeta,
    currentDirection: currentMeta,
    currentDirectionKey: currentDirection,
    visible: !hidden,
    degrade,
    notValidDirection,
  };
}

interface GetDegradeArg {
  targetB: GetPopperMetasBound;
  wrapB: GetPopperMetasBound;
  sourceB: GetPopperMetasSource;
  winSt: number;
  winSl: number;
  offset: number;
}

/** 所有位置都不存在时，获取一个可用的回退位置 */
function getDegrade(arg: GetDegradeArg): Degrade | undefined {
  const { targetB, wrapB, sourceB, winSt, winSl, offset } = arg;

  const validArea = {
    top: targetB.top - wrapB.top,
    left: targetB.left - wrapB.left,
    right: wrapB.left + wrapB.width - targetB.left - targetB.width,
    bottom: wrapB.top + wrapB.height - targetB.top - targetB.height,
  };

  const xValid = wrapB.width >= sourceB.width;

  const a = wrapB.width - (wrapB.width - targetB.left);
  const b = wrapB.width - targetB.left;
  const c = sourceB.width - b;

  // const xPos = (wrapB.width - sourceB.width) / 2 + winSl;
  const xPos = a - c - 16 - winSl;
  const arrowX = targetB.left - xPos + targetB.width / 2;

  if (validArea.top - offset >= sourceB.height && xValid) {
    return {
      direction: 'top',
      x: xPos,
      y: targetB.top - sourceB.height - offset + winSt,
      arrowX,
    };
  }

  if (validArea.bottom + offset >= sourceB.height && xValid) {
    return {
      direction: 'bottom',
      x: xPos,
      y: targetB.top + targetB.height + offset + winSt,
      arrowX,
    };
  }
}

/**
 * 根据GetBoundMetasReturns和当前位置、前一个位置来从meta中挑选下一个合适的方向, 当返回值3位true时，表示没有可用的位置
 * @param meta - getPopperMetas函数的返回值
 * @param direction - 预设位置, 优先选取
 * @param prevDirection - 表示前一个位置的key
 * */
export function getPopperDirectionForMeta(
  meta: GetBoundMetas,
  direction: GetBoundMetasDirectionKeys,
  prevDirection: GetBoundMetasDirectionKeys,
): [GetBoundDirectionItem, GetBoundMetasDirectionKeys, boolean?] {
  // 当前位置可用时优先选取
  if (meta[direction].safe) {
    return [meta[direction], direction];
  }

  // 前一位可用时选取
  if (meta[prevDirection].safe) {
    return [meta[prevDirection], prevDirection];
  }

  // 为top、bottom时优先取方向
  if (direction === 'top' && meta.bottom.safe) {
    return [meta.bottom, 'bottom'];
  }

  if (direction === 'bottom' && meta.top.safe) {
    return [meta.top, 'top'];
  }

  // 从关联方向中取第一个方向
  const relates = relateDirectionMap[prevDirection];
  const current = relates.reduce<undefined | [GetBoundDirectionItem, GetBoundMetasDirectionKeys]>(
    (prev, key) => {
      if (meta[key].safe && !prev) {
        return [meta[key], key];
      }
      return prev;
    },
    undefined,
  );

  if (current) {
    return current;
  }

  // 从可用方向中挑选第一个
  for (const [key, val] of Object.entries(meta)) {
    if (val.safe) {
      return [val, key] as [GetBoundDirectionItem, GetBoundMetasDirectionKeys];
    }
  }

  // 默认前一个方向
  return [meta[prevDirection], prevDirection, true];
}
