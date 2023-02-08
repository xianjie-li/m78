import { RefObject, useEffect, useRef } from "react";

import { isNumber, isDom } from "@m78/utils";
import _clamp from "lodash/clamp.js";
import { getRefDomOrDom, useSelf, useThrottle } from "../../index.js";
import { useSpring, config, UseSpringProps } from "react-spring";

interface UseScrollOptions {
  /** 指定滚动元素或ref，el、el.current、ref.current取值，只要有任意一个为dom元素则返回, 默认的滚动元素是documentElement */
  el?: HTMLElement | RefObject<any>;

  /** 滚动时触发 */
  onScroll?(meta: UseScrollMeta): void;

  /** 100 | 配置了onScroll时，设置throttle时间, 单位(ms) */
  throttleTime?: number;
  /** 0 | 滚动偏移值, 使用scrollToElement时，会根据此值进行修正 */
  offset?: number;
  /** y轴的偏移距离，优先级高于offset */
  offsetX?: number;
  /** x轴的偏移距离，优先级高于offset */
  offsetY?: number;
  /** 0 | touch系列属性的触发修正值 */
  touchOffset?: number;
}

export interface UseScrollSetArg {
  /** 指定滚动的x轴 */
  x?: number;
  /** 指定滚动的y轴 */
  y?: number;
  /** 以当前滚动位置为基础进行增减滚动 */
  raise?: boolean;
  /** 为true时阻止动画 */
  immediate?: boolean;
  /** 动画配置 */
  config?: UseSpringProps;
}

export interface UseScrollMeta {
  /** 滚动元素 */
  el: HTMLElement;
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
  /** 是否是x轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过该api控制滚动式 */
  isScrollX: boolean;
  /** 是否是y轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过该api控制滚动式 */
  isScrollY: boolean;
}

interface UseScrollPosBase {
  x?: number;
  y?: number;
}

export function useScroll<ElType extends HTMLElement>(
  {
    el,
    onScroll,
    throttleTime = 100,
    offset = 0,
    offsetX,
    offsetY,
    touchOffset = 0,
  } = {} as UseScrollOptions
) {
  // 用于返回的节点获取ref
  const ref = useRef<ElType>(null);

  // 获取documentElement和body, 放到useEffect以兼容SSR
  const self = useSelf({
    docEl: null! as HTMLElement,
    bodyEl: null! as HTMLElement,
    lastX: 0,
    lastY: 0,
  });

  const [spValue, spApi] = useSpring<{ y: number; x: number }>(() => ({
    y: 0,
    x: 0,
    config: { clamp: true, ...config.stiff },
  }));

  /** 滚动处理 */
  const scrollHandle = useThrottle(() => {
    onScroll && onScroll(get());
  }, throttleTime);

  /** 初始化获取根节点 */
  useEffect(() => {
    self.docEl = document.documentElement;
    self.bodyEl = document.body;
  }, []);

  /** 绑定滚动事件 */
  useEffect(() => {
    const sEl = getEl();

    /* 坑: 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上 */
    const scrollEl = elIsDoc(sEl) ? window : sEl;

    scrollEl.addEventListener("scroll", scrollHandle);

    return () => {
      scrollEl.removeEventListener("scroll", scrollHandle);
    };
  }, [el, ref.current]);

  /** 记录初始化滚动位置, 用于计算滚动方向 */
  useEffect(() => {
    const meta = get();
    self.lastX = meta.x;
    self.lastY = meta.y;
  }, [el, ref.current]);

  /** 执行滚动、拖动操作时，停止当前正在进行的滚动操作 */
  useEffect(() => {
    const sEl = getEl();

    function wheelHandle() {
      if (spValue.x.isAnimating || spValue.y.isAnimating) {
        spApi.stop();
      }
    }

    sEl.addEventListener("wheel", wheelHandle);
    sEl.addEventListener("touchmove", wheelHandle);

    return () => {
      sEl.removeEventListener("wheel", wheelHandle);
      sEl.removeEventListener("touchmove", wheelHandle);
    };
  }, [el, ref.current]);

  /** 检测元素是否是body或html节点 */
  function elIsDoc(_el?: HTMLElement) {
    const sEl = _el || getEl();
    return sEl === self.docEl || sEl === self.bodyEl;
  }

  /** 根据参数获取滚动元素，默认为文档元素 */
  function getEl(): HTMLElement {
    return getRefDomOrDom(el, ref) || self.docEl;
  }

  /** 动画滚动到指定位置 */
  function animateTo(
    sEl: HTMLElement,
    next: UseScrollPosBase,
    now: UseScrollPosBase,
    other?: any
  ) {
    const isDoc = elIsDoc(sEl);

    spApi.stop().start({
      ...next,
      ...other,
      from: now,
      onChange(result: any) {
        const x = result.value.x;
        const y = result.value.y;

        if (isDoc) {
          setDocPos(x, y);
        } else {
          sEl.scrollTop = y;
          sEl.scrollLeft = x;
        }
      },
    });
  }

  /** 根据传入的x、y值设置滚动位置 */
  function set({ x, y, raise, immediate, config }: UseScrollSetArg) {
    const scroller = getEl();

    const { xMax, yMax, x: oldX, y: oldY } = get();

    const nextPos: UseScrollPosBase = {};
    const nowPos: UseScrollPosBase = {
      x: oldX,
      y: oldY,
    };

    if (isNumber(x)) {
      let nextX = x;

      if (raise) {
        nextX = _clamp(oldX + x, 0, xMax);
      }

      if (nextX !== oldX) {
        nextPos.x = nextX;
      }
    }

    if (isNumber(y)) {
      let nextY = y;

      if (raise) {
        nextY = _clamp(oldY + y, 0, yMax);
      }

      if (nextY !== oldY) {
        nextPos.y = nextY;
      }
    }

    if ("x" in nextPos || "y" in nextPos) {
      const isDoc = elIsDoc(scroller);

      if (immediate) {
        spApi.stop();

        if (isNumber(nextPos.x)) {
          if (isDoc) {
            setDocPos(nextPos.x);
          } else {
            scroller.scrollLeft = nextPos.x;
          }
        }
        if (isNumber(nextPos.y)) {
          if (isDoc) {
            setDocPos(undefined, nextPos.y);
          } else {
            scroller.scrollTop = nextPos.y;
          }
        }
      } else {
        animateTo(scroller, nextPos, nowPos, config);
      }
    }
  }

  /**
   * 传入选择器或者dom元素
   * @param selector | target
   *    selector - 滚动到以该选择器命中的第一个元素
   *    element - 滚动到指定元素
   * @param immediate - 是否跳过动画
   * */
  function scrollToElement(selector: string, immediate?: boolean): void;
  function scrollToElement(element: HTMLElement, immediate?: boolean): void;
  function scrollToElement(arg: string | HTMLElement, immediate?: boolean) {
    const sEl = getEl();
    const isDoc = elIsDoc(sEl);

    let targetEl: HTMLElement | null;

    if (!sEl.getBoundingClientRect) {
      console.warn("The browser does not support `getBoundingClientRect` API");
      return;
    }

    if (typeof arg === "string") {
      targetEl = getEl().querySelector(arg);
    } else {
      targetEl = arg;
    }

    if (!isDom(targetEl)) return;

    const { top: cTop, left: cLeft } = targetEl.getBoundingClientRect();
    const { top: fTop, left: fLeft } = sEl.getBoundingClientRect();

    /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */
    const xOffset = offsetX || offset;
    const yOffset = offsetY || offset;

    set({
      x: cLeft - fLeft + xOffset,
      y: cTop - fTop + yOffset,
      raise: !isDoc, // 如果滚动节点为html元素, 可以直接取计算结果
      immediate,
    });
  }

  /** 获取各种有用的滚动信息 */
  function get(): UseScrollMeta {
    const isDoc = elIsDoc();

    const sEl = getEl();

    let x = isDoc
      ? self.docEl.scrollLeft + self.bodyEl.scrollLeft
      : sEl.scrollLeft;
    let y = isDoc
      ? self.docEl.scrollTop + self.bodyEl.scrollTop
      : sEl.scrollTop;

    /* chrome高分屏+缩放时，滚动值会是小数，向上取整防止计算错误 */
    x = Math.ceil(x);
    y = Math.ceil(y);

    const height = sEl.clientHeight;
    const width = sEl.clientWidth;
    const { scrollHeight } = sEl;
    const { scrollWidth } = sEl;

    /* chrome下(高分屏+缩放),无滚动的情况下scrollWidth会大于width */
    const xMax = Math.max(0, scrollWidth - width);
    const yMax = Math.max(0, scrollHeight - height);

    const isScrollX = x !== self.lastX;
    const isScrollY = y !== self.lastY;

    self.lastX = x;
    self.lastY = y;

    return {
      el: sEl,
      x,
      y,
      xMax,
      yMax,
      height,
      width,
      scrollHeight,
      scrollWidth,
      touchBottom: yMax - y - touchOffset <= 0,
      touchLeft: x <= touchOffset,
      touchRight: xMax - x - touchOffset <= 0, // 总宽度 - 宽度 = 滚动条实际宽度
      touchTop: y <= touchOffset,
      offsetWidth: sEl.offsetWidth,
      offsetHeight: sEl.offsetHeight,
      isScrollX,
      isScrollY,
    };
  }

  /** 设置根级的滚动位置 */
  function setDocPos(x?: number, y?: number) {
    if (isNumber(x)) {
      // 只有一个会生效
      self.bodyEl.scrollLeft = x;
      self.docEl.scrollLeft = x;
    }

    if (isNumber(y)) {
      self.bodyEl.scrollTop = y;
      self.docEl.scrollTop = y;
    }
  }

  return {
    set,
    get,
    scrollToElement,
    ref,
  };
}
