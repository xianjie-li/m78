import type { EmptyFunction, XY } from "@m78/utils";
import { isNumber, isDom, TupleNumber } from "@m78/utils";
import _clamp from "lodash/clamp.js";
import _throttle from "lodash/throttle.js";
import { curveRun } from "@m78/animate-tools";

/** 创建配置 */
export interface ScrollTriggerOption {
  /** 要监听的滚动目标, 默认的滚动元素是documentElement */
  target?: HTMLElement;
  /** 滚动时触发 */
  handle: (event: ScrollTriggerState) => void;
  /** 设置handle的throttle间隔, 单位(ms) */
  throttleTime?: number;
  /** 使用scrollToElement api定位时的偏移值, 传入单个值时应用于两个方向, 两个值时分别表示 x, y */
  offset?: number | TupleNumber;
  /** touch系列属性的触发修正值 */
  touchOffset?: number | TupleNumber;
}

/** 调整滚动位置时的配置对象 */
export interface ScrollTriggerArg {
  /** 指定滚动的x轴 */
  x?: number;
  /** 指定滚动的y轴 */
  y?: number;
  /** 以当前滚动位置为基础进行增减滚动 */
  raise?: boolean;
  /** 为true时阻止动画 */
  immediate?: boolean;
}

/** 事件对象 */
export interface ScrollTriggerState {
  /** 滚动元素 */
  target: HTMLElement;
  /** x轴位置 */
  x: number;
  /** y轴位置 */
  y: number;
  /** 可接受的x轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
  xMax: number;
  /** 可接受的y轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
  yMax: number;
  /** 元素高度 */
  height: number;
  /** 元素宽度 */
  width: number;
  /** 元素实际高度(包含边框/滚动条/内边距等) */
  offsetWidth: number;
  /** 元素实际宽度(包含边框/滚动条/内边距等) */
  offsetHeight: number;
  /** 元素总高度 */
  scrollHeight: number;
  /** 元素总宽度 */
  scrollWidth: number;
  /** 滚动条位于最底部 */
  touchBottom: boolean;
  /** 滚动条位于最右侧 */
  touchRight: boolean;
  /** 滚动条位于最顶部 */
  touchTop: boolean;
  /** 滚动条位于最左侧 */
  touchLeft: boolean;
  /** 是否是x轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
  isScrollX: boolean;
  /** 是否是y轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
  isScrollY: boolean;
}

/** 滚动实例 */
export interface ScrollTriggerInstance {
  /** 设置滚动位置 */
  scroll: (arg: ScrollTriggerArg) => void;
  /** 滚动到指定的元素, 可传入一个dom节点或一个选择器, 设置 immediate 为 true 可跳过动画 */
  scrollToElement: (arg: string | HTMLElement, immediate?: boolean) => void;
  /** 获取和当前滚动状态有关的信息, 与handle中传入的事件对象一致 */
  get: () => ScrollTriggerState;
  /** 销毁实例 */
  destroy(): void;
}

export function createScrollTrigger(
  option: ScrollTriggerOption
): ScrollTriggerInstance {
  const {
    target,
    handle,
    throttleTime = 0,
    offset = 0,
    touchOffset = 0,
  } = option;

  const docEl = document.documentElement;
  const bodyEl = document.body;

  const [offsetX, offsetY] = isNumber(offset) ? [offset, offset] : offset;

  const [touchOffsetX, touchOffsetY] = isNumber(touchOffset)
    ? [touchOffset, touchOffset]
    : touchOffset;

  // 滚动目标, 默认为document
  const scrollTarget = target || docEl;

  // 元素是否是body或html节点
  const isDoc = scrollTarget === docEl || scrollTarget === bodyEl;

  // 滚动事件的绑定目标, 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上, 所以某些情况会使用window
  const actualTarget: EventTarget = isDoc ? window : scrollTarget;

  // 最后滚动位置
  let lastX = 0;
  let lastY = 0;

  const scrollHandle = throttleTime
    ? _throttle(_scrollHandle, throttleTime)
    : _scrollHandle;

  init();

  // 初始化
  function init() {
    actualTarget.addEventListener("scroll", scrollHandle);
    actualTarget.addEventListener("wheel", stopAnimate);
    actualTarget.addEventListener("touchstart", stopAnimate);

    /** 记录初始化滚动位置, 用于计算滚动方向 */
    const state = get();

    lastX = state.x;
    lastY = state.y;
  }

  // 滚动处理
  function _scrollHandle() {
    handle(get());
  }

  let animateCleanup: EmptyFunction | null = null;

  // 取消进行中的滚动动画
  function stopAnimate() {
    if (animateCleanup) {
      animateCleanup();
      animateCleanup = null;
    }
  }

  // 动画滚动到指定位置
  function animateTo(sEl: HTMLElement, next: XY, now: XY) {
    stopAnimate();

    const diffX = next.x - now.x;
    const diffY = next.y - now.y;

    // 根据移动距离增加动画持续时间, 最大不超过2.5s, 最小不低于800
    const diff = Math.max(Math.abs(diffX), Math.abs(diffY));

    const duration = _clamp((Math.abs(diff) / 100) * 20, 800, 1200);

    animateCleanup = curveRun({
      duration: duration,
      onChange(value) {
        const x = now.x + diffX * value;
        const y = now.y + diffY * value;

        if (isDoc) {
          setDocPos(x, y);
        } else {
          sEl.scrollTop = y;
          sEl.scrollLeft = x;
        }
      },
    });
  }

  // 获取滚动信息
  function get(): ScrollTriggerState {
    let x = isDoc
      ? docEl.scrollLeft + bodyEl.scrollLeft
      : scrollTarget.scrollLeft;
    let y = isDoc ? docEl.scrollTop + bodyEl.scrollTop : scrollTarget.scrollTop;

    /* chrome高分屏+缩放时，滚动值会是小数，向上取整防止计算错误 */
    x = Math.ceil(x);
    y = Math.ceil(y);

    const height = scrollTarget.clientHeight;
    const width = scrollTarget.clientWidth;
    const { scrollHeight } = scrollTarget;
    const { scrollWidth } = scrollTarget;

    /* chrome下(高分屏+缩放),无滚动的情况下scrollWidth会大于width */
    const xMax = Math.max(0, scrollWidth - width);
    const yMax = Math.max(0, scrollHeight - height);

    const isScrollX = x !== lastX;
    const isScrollY = y !== lastY;

    lastX = x;
    lastY = y;

    return {
      target: scrollTarget,
      x,
      y,
      xMax,
      yMax,
      height,
      width,
      scrollHeight,
      scrollWidth,
      touchBottom: yMax - y - touchOffsetY <= 0,
      touchLeft: x <= touchOffsetX,
      touchRight: xMax - x - touchOffsetX <= 0, // 总宽度 - 宽度 = 滚动条实际宽度
      touchTop: y <= touchOffsetY,
      offsetWidth: scrollTarget.offsetWidth,
      offsetHeight: scrollTarget.offsetHeight,
      isScrollX,
      isScrollY,
    };
  }

  // 设置滚动位置
  function scroll(arg: ScrollTriggerArg) {
    const { x, y, raise, immediate } = arg;

    const { xMax, yMax, x: oldX, y: oldY } = get();

    const nextPos = {
      x: oldX,
      y: oldY,
    };
    const nowPos: XY = {
      x: oldX,
      y: oldY,
    };

    let hasChange = false;

    if (isNumber(x)) {
      let nextX = x;

      if (raise) {
        nextX = _clamp(oldX + x, 0, xMax);
      }

      if (nextX !== oldX) {
        nextPos.x = nextX;
        hasChange = true;
      }
    }

    if (isNumber(y)) {
      let nextY = y;

      if (raise) {
        nextY = _clamp(oldY + y, 0, yMax);
      }

      if (nextY !== oldY) {
        nextPos.y = nextY;
        hasChange = true;
      }
    }

    if (hasChange) {
      if (immediate) {
        stopAnimate();

        if (isNumber(nextPos.x)) {
          if (isDoc) {
            setDocPos(nextPos.x);
          } else {
            scrollTarget.scrollLeft = nextPos.x;
          }
        }
        if (isNumber(nextPos.y)) {
          if (isDoc) {
            setDocPos(undefined, nextPos.y);
          } else {
            scrollTarget.scrollTop = nextPos.y;
          }
        }
      } else {
        animateTo(scrollTarget, nextPos, nowPos);
      }
    }
  }

  // 滚动到指定dom
  function scrollToElement(arg: string | HTMLElement, immediate?: boolean) {
    let targetEl: HTMLElement | null;

    if (typeof arg === "string") {
      targetEl = scrollTarget.querySelector(arg);
    } else {
      targetEl = arg;
    }

    if (!isDom(targetEl)) return;

    const { top: cTop, left: cLeft } = targetEl.getBoundingClientRect();
    const { top: fTop, left: fLeft } = scrollTarget.getBoundingClientRect();

    /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */
    scroll({
      x: cLeft - fLeft + offsetX,
      y: cTop - fTop + offsetY,
      raise: !isDoc, // 如果滚动节点为html元素, 可以直接取计算结果
      immediate,
    });
  }

  /** 设置根级的滚动位置 */
  function setDocPos(x?: number, y?: number) {
    if (isNumber(x)) {
      // 只有一个会生效
      bodyEl.scrollLeft = x;
      docEl.scrollLeft = x;
    }

    if (isNumber(y)) {
      bodyEl.scrollTop = y;
      docEl.scrollTop = y;
    }
  }

  function destroy() {
    actualTarget.removeEventListener("scroll", scrollHandle);
    actualTarget.removeEventListener("wheel", stopAnimate);
    actualTarget.removeEventListener("touchstart", stopAnimate);
  }

  return {
    get,
    scroll,
    scrollToElement,
    destroy,
  };
}
