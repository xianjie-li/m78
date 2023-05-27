import { hasScroll } from "../../dist/index.js";
import { raf } from "../bom.js";
import { Bound, EmptyFunction } from "../types.js";

/** 在多个滚动帮助函数间共享 */
export interface AutoScrollCtx {
  /** 自动滚动的开关 */
  autoScrollToggle: boolean;
  /** 要设置滚动位置的key */
  autoScrollPosKey: "scrollLeft" | "scrollTop";
  /** 每次滚动距离 */
  autoScrollVal: number;
  /** 清理函数 */
  clearFn?: EmptyFunction;
}

export interface AutoScrollConfig {
  /** 待检测和滚动的节点 */
  el: HTMLElement;
  /** 16 | 自动滚动的基准距离, 越大则滚动越快, 最终滚动距离为 baseOffset * 超出触发距离的系数 */
  baseOffset?: number;
  /** 0.16 | 在距离边缘此比例时即开始滚动(相对于元素尺寸的比例) */
  triggerOffset?: number;
  /** 50 | 根据triggerOffset计算后的触发距离最大不超过此值 */
  maxTriggerOffset?: number;
  /** true | 在检测目标元素是否是滚动元素时, 除了有可用滚动距离外, 是否需要额外检测 overflow 值是否等于 scroll 或 auto */
  checkOverflowAttr?: boolean;
  /** 在经过triggerOffset确认位置后, 再次对触发自动滚动的边界进行调整 */
  adjust?: {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
  };
  /** 用于计算容器位置的节点, 默认为config.el, 当前滚动容器和用于测量位置的节点不同时, 可能会需要此配置 */
  boundElement?: HTMLElement;
  /** 自动滚动时触发, 可用isX判断x/y轴, offset为该次滚动的距离 */
  onScroll?: (isX: boolean, offset: number) => void;
}

/** 方向禁用配置 */
export type AutoScrollDisableConfig = {
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
  top?: boolean;
};

export type AutoScroll = ReturnType<typeof createAutoScroll>;

/** 一个光标在目标边缘时自动滚动节点的工具 */
export function createAutoScroll(config: AutoScrollConfig) {
  const defConf = {
    baseOffset: 16,
    triggerOffset: 0.16,
    maxTriggerOffset: 50,
    checkOverflowAttr: true,
    adjust: {} as NonNullable<AutoScrollConfig["adjust"]>,
  };

  const conf = {
    ...defConf,
    ...config,
    boundElement: config.boundElement || config.el,
  };

  const isDocOrBody =
    conf.el === document.documentElement || conf.el === document.body;

  const ctx = {
    autoScrollToggle: false,
  } as AutoScrollCtx;

  /** 获取光标和目标位置的边缘覆盖状态 */
  function getAutoScrollStatus(
    x: number,
    y: number,
    disableConf: AutoScrollDisableConfig = {}
  ) {
    const scrollData = hasScroll(conf.el, conf.checkOverflowAttr);

    if (!isDocOrBody && !scrollData.x && !scrollData.y) return;

    // 是否在指定边最大/小处
    const touchLeft = conf.el.scrollLeft === 0;
    const touchRight =
      conf.el.scrollLeft >= conf.el.scrollWidth - conf.el.clientWidth;
    const touchTop = conf.el.scrollTop === 0;
    const touchBottom =
      conf.el.scrollTop >= conf.el.scrollHeight - conf.el.clientHeight;

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
      : conf.boundElement.getBoundingClientRect();

    // 根据窗口和当前元素取最小、最大触发位置
    left = Math.max(left, 0);
    top = Math.max(top, 0);
    right = Math.min(right, window.innerWidth);
    bottom = Math.min(bottom, window.innerHeight);

    const xTriggerOffset = Math.min(
      conf.maxTriggerOffset,
      width * conf.triggerOffset
    );
    const yTriggerOffset = Math.min(
      conf.maxTriggerOffset,
      height * conf.triggerOffset
    );

    const leftAdjust = conf.adjust.left || 0;
    const rightAdjust = conf.adjust.right || 0;
    const topAdjust = conf.adjust.top || 0;
    const bottomAdjust = conf.adjust.bottom || 0;

    // 原始边界位置备份, 在某些时候需要以远位置做基准计算
    const beforeLeft = left;
    const beforeRight = right;
    const beforeTop = top;
    const beforeBottom = bottom;

    // 计算偏移
    left = left + xTriggerOffset + leftAdjust;
    top = top + yTriggerOffset + topAdjust;
    right = right - xTriggerOffset - rightAdjust;
    bottom = bottom - yTriggerOffset - bottomAdjust;

    let t = 0;
    let r = 0;
    let b = 0;
    let l = 0;

    // y轴处理, 使用beforeXXX是因为leftAdjust/xTriggerOffset修正后会出现不能触发自动滚动的死角
    if (x > beforeLeft && x < beforeRight) {
      if (y < top) {
        t = Math.min(1, (top - y) / yTriggerOffset);
      }

      if (y > bottom) {
        b = Math.min(1, (y - bottom) / yTriggerOffset);
      }
    }

    // x轴处理
    if (y > beforeTop && y < beforeBottom) {
      if (x < left) {
        l = Math.min(1, (left - x) / xTriggerOffset);
      }

      if (x > right) {
        r = Math.min(1, (x - right) / xTriggerOffset);
      }
    }

    return {
      top: scrollData.y && !touchTop && !disableConf.top ? t : 0,
      bottom: scrollData.y && !touchBottom && !disableConf.bottom ? b : 0,
      left: scrollData.x && !touchLeft && !disableConf.left ? l : 0,
      right: scrollData.x && !touchRight && !disableConf.right ? r : 0,
    };
  }

  /**
   * 根据getAutoScrollStatus的返回值决定是否要自动滚动滚动元素
   *
   * @param status 光标在模板元素边缘的信息, getAutoScrollStatus的返回值, 若不传则会停止当前的自动滚动
   * */
  function autoScrollByStatus(status?: ReturnType<typeof getAutoScrollStatus>) {
    if (!conf.el || !status) {
      clear();
      return;
    }

    if (!(status.bottom || status.top || status.left || status.right)) {
      clear();
      return;
    }

    // 基础滚动距离
    ctx.autoScrollVal = 0;

    if (status.bottom) {
      ctx.autoScrollPosKey = "scrollTop";
      ctx.autoScrollVal = status.bottom * conf.baseOffset;
    }

    if (status.left) {
      ctx.autoScrollPosKey = "scrollLeft";
      ctx.autoScrollVal = status.left * -conf.baseOffset;
    }

    if (status.top) {
      ctx.autoScrollPosKey = "scrollTop";
      ctx.autoScrollVal = status.top * -conf.baseOffset;
    }

    if (status.right) {
      ctx.autoScrollPosKey = "scrollLeft";
      ctx.autoScrollVal += status.right * conf.baseOffset;
    }

    // 开启滚动
    if (!ctx.autoScrollToggle) {
      ctx.autoScrollToggle = true;

      autoScroll(conf.el);
    }
  }

  function autoScroll(el: HTMLElement) {
    raf(() => {
      if (!ctx.autoScrollToggle) return;

      el[ctx.autoScrollPosKey] += ctx.autoScrollVal;

      // 处理浏览器兼容
      if (el === document.documentElement) {
        document.body[ctx.autoScrollPosKey] += ctx.autoScrollVal;
      }

      if (conf.onScroll) {
        const isX = ctx.autoScrollPosKey === "scrollLeft";
        conf.onScroll(isX, ctx.autoScrollVal);
      }

      autoScroll(el);
    });
  }

  /** 清理计时器, 如果当前正在滚动则停止 */
  function clear() {
    if (ctx.clearFn) {
      ctx.clearFn();
      ctx.clearFn = undefined;
    }
    ctx.autoScrollToggle = false;
  }

  function trigger(
    x: number,
    y: number,
    disableConf?: AutoScrollDisableConfig
  ) {
    const status = getAutoScrollStatus(x, y, disableConf);
    autoScrollByStatus(status);
  }

  return {
    /** 根据当前的AutoScrollCtx来自动滚动目标元素 */
    clear,
    /** 根据指定的位置进行滚动触发 */
    trigger,
    /** 是否正在滚动 */
    get scrolling() {
      return ctx.autoScrollToggle;
    },
    /** 更新配置, 后续trigger以配置进行 */
    updateConfig(newConf: Partial<AutoScrollConfig>) {
      Object.assign(conf, newConf);
    },
  };
}
