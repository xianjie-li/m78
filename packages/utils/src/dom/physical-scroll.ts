// 轻扫: 事件小于一定比例时算作轻扫, 添加惯性滚动效果
// 惯性滚动距离: 根据滑动距离而定, 越大则滚动越远
// 惯性滚动持续时间: 根据滑动距离而定, 越大则持续时间越久
// 重新开始拖动时, 停止之前的惯性滚动

// 触发阈值, 用于用户操作移动幅度过小时跳过惯性
import { raf } from "../bom.js";
import { getEventOffset } from "../dom.js";
import { TupleNumber, EmptyFunction } from "../types.js";
import { clamp } from "../number.js";

const triggerThreshold = 2;
// 轻扫触发的时间阈值, ms
const lightSweep = 280;

// 最小动画时间
const minDuration = 600;
// 最大动画时间
const maxDuration = 2200;
// 假设的最大移动距离
const maxDistance = 1600;

// 略过过小的移动
const ignoreMove = 30;

/** 支持的事件处理类型 */
export enum PhysicalScrollEventType {
  /** 针对鼠标事件进行模拟 */
  mouse = "mouse",
  /** 针对触摸事件进行模拟 */
  touch = "touch",
}

/** 根据不同事件生产的混合事件 */
export interface PhysicalScrollEvent {
  /** 光标的客户端坐标 */
  xy: TupleNumber;
  /** 触发事件的节点 */
  target: HTMLElement;
  /** 光标相对绑定事件元素左上角的距离 */
  offset: TupleNumber;
}

/**
 * 在指定元素上模拟拖拽滚动的物理效果
 *
 * 前置条件:
 * - 滚动容器必须设置为overflow: hidden, 并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */
export class PhysicalScroll {
  // 前一次触发的xy位置
  prevX?: number;
  prevY?: number;
  // 事件开始触发时的xy位置
  startX?: number;
  startY?: number;
  // 事件开始时间
  startTime?: number;

  // 自动滚动的raf清理函数
  rafClear: EmptyFunction;
  // 自动滚动开始的时间
  autoScrollStartTime?: number;
  // 自动滚动最后一次的移动距离
  lastDistanceX: any;
  lastDistanceY: any;

  // 每次开始事件后记录每一次移动的距离, 在结束后取尾端项作为样本判断手势意图
  moveXList: [number, number][] = [];
  moveYList: [number, number][] = [];

  mouseEnable: boolean;
  touchEnable: boolean;

  /** 最后绑定touch事件的节点 */
  lastBindTarget?: HTMLElement;

  constructor(
    public config: {
      /** 绑定事件的元素 */
      el: HTMLElement;
      /** 绑定的事件类型 */
      type: PhysicalScrollEventType[];
      /** 滚动触发,  */
      onScroll?: (xy: TupleNumber, isAutoScroll: boolean) => void;
      /** 若传入true, 滚动将仅通过onScroll通知, 内部不再主动更新滚动位置, 交由用户更新 */
      onlyNotify?: boolean;
      /** 可用于在某些节点情况下阻止事件触发(返回true) */
      triggerFilter?: (e: PhysicalScrollEvent) => true | void;
      /** 自定义获取滚动位置, 省略时将取el.scrollTop/Left */
      positionGetter?: () => TupleNumber;
      /** 指定如何设置滚动位置, 省略时设置el.scrollTop/Left */
      positionSetter?: (xy: TupleNumber) => void;
    }
  ) {
    this.touchEnable = config.type.includes(PhysicalScrollEventType.touch);
    this.mouseEnable = config.type.includes(PhysicalScrollEventType.mouse);

    this.mount();
  }

  private mount() {
    if (this.mouseEnable) {
      this.config.el.addEventListener("mousedown", this.mouseStart);
      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseEnd);
    }

    if (this.touchEnable) {
      this.config.el.addEventListener("touchstart", this.touchStart);
    }
  }

  // 销毁
  destroy() {
    this.config.el.removeEventListener("mousedown", this.mouseStart);
    document.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseEnd);

    this.config.el.removeEventListener("touchstart", this.touchStart);

    if (this.lastBindTarget) {
      this.unBindTouchEvent(this.lastBindTarget);
      this.lastBindTarget = undefined;
    }
  }

  private mouseStart = (e: MouseEvent) => {
    this.start(this.getEventByMouse(e));
  };

  private mouseMove = (e: MouseEvent) => {
    this.move(this.getEventByMouse(e));
  };

  private mouseEnd = (e: MouseEvent) => {
    this.end(this.getEventByMouse(e));
  };

  private touchStart = (e: TouchEvent) => {
    this.start(this.getEventByTouch(e));
  };

  private touchMove = (e: TouchEvent) => {
    this.move(this.getEventByTouch(e));
  };

  private touchEnd = (e: TouchEvent) => {
    this.end(this.getEventByTouch(e));
  };

  // 如果e.target在拖动期间被移除, touchend不会触发, 需要再每次事件开始后进行绑定
  // https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
  private bindTouchEvent = (target: HTMLElement) => {
    target.addEventListener("touchmove", this.touchMove);
    target.addEventListener("touchend", this.touchEnd);
    this.lastBindTarget = target;
  };

  private unBindTouchEvent = (target: HTMLElement) => {
    target.removeEventListener("touchmove", this.touchMove);
    target.removeEventListener("touchend", this.touchEnd);
  };

  private getEventByMouse(e: MouseEvent): PhysicalScrollEvent {
    return {
      xy: [e.clientX, e.clientY],
      offset: getEventOffset(e, this.config.el),
      target: e.target as HTMLElement,
    };
  }

  private getEventByTouch(e: TouchEvent): PhysicalScrollEvent {
    const point = e.changedTouches[0];
    return {
      xy: [point.clientX, point.clientY],
      offset: getEventOffset(e, this.config.el),
      target: e.target as HTMLElement,
    };
  }

  private start = (e: PhysicalScrollEvent) => {
    const [clientX, clientY] = e.xy;

    if (this.config.triggerFilter) {
      const interrupt = this.config.triggerFilter(e);

      if (interrupt) return;
    }

    // 清理之前的状态
    this.clear();

    // 记录信息
    this.prevX = clientX;
    this.prevY = clientY;
    this.startX = clientX;
    this.startY = clientY;
    this.startTime = Date.now();

    if (this.touchEnable) {
      this.bindTouchEvent(e.target);
    }
  };

  private move = (e: PhysicalScrollEvent) => {
    if (this.prevX === undefined || this.prevY === undefined) return;

    const [clientX, clientY] = e.xy;

    const offsetX = clientX - this.prevX;
    const offsetY = clientY - this.prevY;

    let [x, y] = this.getScrollPosition();

    x = x - offsetX;
    y = y - offsetY;

    if (!this.config.onlyNotify) {
      this.setScrollPosition([x, y]);
    }

    this.config.onScroll?.([x, y], false);

    const now = Date.now();

    this.moveXList.push([offsetX, now]);
    this.moveYList.push([offsetY, now]);

    this.prevX = clientX;
    this.prevY = clientY;
  };

  private end = (e: PhysicalScrollEvent) => {
    if (this.touchEnable) {
      this.unBindTouchEvent(e.target);
    }

    if (this.prevX === undefined || this.prevY === undefined) return;

    const [clientX, clientY] = e.xy;

    let offsetX = clientX - this.startX!;
    let offsetY = clientY - this.startY!;

    const duration = Date.now() - this.startTime!;

    this.prevX = undefined;
    this.prevY = undefined;
    this.startY = undefined;
    this.startY = undefined;

    const absX = Math.abs(offsetX);
    const absY = Math.abs(offsetY);

    // 样本截取开始事件
    const sampleTimeStart = this.startTime! + duration * 0.8;

    // 用于检测拖动结尾时的停顿, 若有明显停顿不应触发惯性
    const endXSvgMove = Math.abs(
      this.getSampleOffset(sampleTimeStart, this.moveXList) || 0
    );
    const endYSvgMove = Math.abs(
      this.getSampleOffset(sampleTimeStart, this.moveYList) || 0
    );

    if (
      duration > lightSweep ||
      (endXSvgMove < triggerThreshold && endYSvgMove < triggerThreshold)
    ) {
      return;
    }

    // 不同轴的惯性移动距离倍数, 移动距离约远惯性倍数越大
    const timesX = clamp(Math.abs(offsetX) / 100, 2, 10);
    const timesY = clamp(Math.abs(offsetY) / 100, 2, 10);

    // 略过过小的移动
    if (absY < ignoreMove) offsetY = 0;
    if (absX < ignoreMove) offsetX = 0;

    const movementX = offsetX * timesX;
    const movementY = offsetY * timesY;

    // x或y轴移动距离中较大的一个
    const maxMovement = Math.max(Math.abs(movementX), Math.abs(movementY));

    // 动画时间, 移动距离越大则约长
    let animationDuration = maxDuration * (maxMovement / maxDistance);

    animationDuration = clamp(animationDuration, minDuration, maxDuration);

    this.autoScroll(movementX, movementY, animationDuration);
  };

  /** 根据对应轴的移动距离和持续时间执行自动滚动 */
  private autoScroll(xDistance: number, yDistance: number, duration: number) {
    this.rafClear = raf((t) => {
      if (!this.autoScrollStartTime) this.autoScrollStartTime = t;

      const cost = t - this.autoScrollStartTime;

      if (cost > duration) {
        this.autoScrollStartTime = undefined;
        return;
      }

      // 当前在持续时间的比例
      const timeRatio = Math.min(cost / duration, 1);

      // 缓动基数, 越靠近动画结束越慢
      const base = 1 - Math.pow(2, -10 * timeRatio);

      const distanceX = xDistance * base;
      const distanceY = yDistance * base;

      if (!this.lastDistanceX) this.lastDistanceX = distanceX;
      if (!this.lastDistanceY) this.lastDistanceY = distanceY;

      const moveX = distanceX - this.lastDistanceX;
      const moveY = distanceY - this.lastDistanceY;

      let [x, y] = this.getScrollPosition();

      x = x - moveX;
      y = y - moveY;

      // 这里需要同步更新滚动位置
      if (!this.config.onlyNotify) {
        this.setScrollPosition([x, y]);
      }

      this.config.onScroll?.([x, y], true);

      this.lastDistanceX = distanceX;
      this.lastDistanceY = distanceY;

      this.autoScroll(xDistance, yDistance, duration);
    });
  }

  /** 清理当前状态/自动滚动 */
  private clear = () => {
    if (this.rafClear) this.rafClear();
    this.autoScrollStartTime = undefined;
    this.lastDistanceY = undefined;
    this.lastDistanceX = undefined;

    this.prevX = undefined;
    this.prevY = undefined;
    this.startY = undefined;
    this.startY = undefined;

    this.moveXList = [];
    this.moveYList = [];
  };

  private getScrollPosition(): TupleNumber {
    const conf = this.config;
    if (conf.positionGetter) return conf.positionGetter();
    return [conf.el.scrollLeft, conf.el.scrollTop];
  }

  private setScrollPosition(xy: TupleNumber) {
    const conf = this.config;
    if (conf.positionSetter) {
      conf.positionSetter(xy);
      return;
    }
    conf.el.scrollLeft = xy[0];
    conf.el.scrollTop = xy[1];
  }

  /** 根据一组[offset, time]和提供的起始时间获取该时间之后移动距离的平均值, 如果最后一段时间未移动, 可能返回undefined */
  private getSampleOffset(startTime: number, list: [number, number][]) {
    let svg: number | undefined;

    for (let i = list.length - 1; i >= 0; i--) {
      const [offset, time] = list[i];
      if (time < startTime) {
        if (svg !== undefined) {
          svg = svg / (list.length - 1 - i);
        }

        break;
      }

      if (svg === undefined) {
        svg = offset;
      } else {
        svg += offset;
      }
    }

    return svg;
  }
}
