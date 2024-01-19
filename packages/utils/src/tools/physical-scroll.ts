import { SmoothTrigger, SmoothTriggerOption } from "./smooth-trigger.js";
import { TupleNumber } from "../types.js";
import { isNumber } from "../is.js";
import { getEventOffset } from "../dom.js";

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

export interface PhysicalScrollOption extends SmoothTriggerOption {
  /** 绑定事件的元素 */
  el: HTMLElement;
  /** 绑定的事件类型 */
  type: PhysicalScrollEventType[];
  /** 可用于在某些节点情况下阻止事件触发(返回true) */
  triggerFilter?: (e: PhysicalScrollEvent) => true | void;
}

/**
 * 实现具有物理惯性效果的平滑滚动
 *
 * 前置条件:
 * - 滚动容器必须满足滚动条件, 设置overflow并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */
export class PhysicalScroll {
  /** 触发惯性滚动的阈值, 拖动速度大于此值时触发额外的惯性滚动 */
  static INERTIA_TRIGGER_THRESHOLD = 2.6;

  /** 计算惯性移动距离时的衰减率 */
  static DECAY_FACTOR = 0.7;

  // 实际移动距离 = 拖动距离 * SCALE_RATIO, 值越大, 则滚动越灵敏
  static SCALE_RATIO = 1.2;

  // 小于此距离视为tap, 不触发滚动
  static TAP_DISTANCE = 5;

  // 前一次触发的xy位置
  prevX?: number;
  prevY?: number;

  // 事件开始触发时的xy位置
  startX?: number;
  startY?: number;

  // 事件开始时间
  startTime?: number;

  // 根据配置设置的mouse事件启用状态
  mouseEnable: boolean;

  // 根据配置设置的touch事件启用状态
  touchEnable: boolean;

  /** 最后绑定touch事件的节点 */
  lastBindTarget?: HTMLElement;

  /** 平滑滚动 */
  st: SmoothTrigger;

  constructor(public config: PhysicalScrollOption) {
    this.touchEnable = config.type.includes(PhysicalScrollEventType.touch);
    this.mouseEnable = config.type.includes(PhysicalScrollEventType.mouse);

    this.mount();
  }

  /** 正在执行滚动 */
  get scrolling() {
    return this.st.running;
  }

  private mount() {
    this.st = new SmoothTrigger({
      trigger: this.config.trigger,
    });

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

    this.st.destroy();
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

  /** 真实的起始位置, 用于过滤掉点击和细微的移动 */
  private realPrevX?: number;
  private realPrevY?: number;

  private start = (e: PhysicalScrollEvent) => {
    const [clientX, clientY] = e.xy;

    if (this.config.triggerFilter) {
      const interrupt = this.config.triggerFilter(e);

      if (interrupt) return;
    }

    // 立即停止当前滚动
    this.st.xAll = 0;
    this.st.yAll = 0;

    this.realPrevX = clientX;
    this.realPrevY = clientY;

    if (this.touchEnable) {
      this.bindTouchEvent(e.target);
    }
  };

  private realStart = (e: PhysicalScrollEvent) => {
    const [clientX, clientY] = e.xy;

    // 记录信息
    this.prevX = clientX;
    this.prevY = clientY;
    this.startX = clientX;
    this.startY = clientY;
    this.realPrevX = undefined;
    this.realPrevY = undefined;
    this.startTime = Date.now();
  };

  private move = (e: PhysicalScrollEvent) => {
    const [clientX, clientY] = e.xy;

    // 处理tap过滤
    if (isNumber(this.realPrevX) && isNumber(this.realPrevY)) {
      const diffX = Math.abs(this.realPrevX - clientX);
      const diffY = Math.abs(this.realPrevY - clientY);

      if (
        diffX > PhysicalScroll.TAP_DISTANCE ||
        diffY > PhysicalScroll.TAP_DISTANCE
      ) {
        this.realStart(e);
      }

      return;
    }

    // 实际的move逻辑

    if (this.prevX === undefined || this.prevY === undefined) return;

    const deltaX = (this.prevX - clientX) * PhysicalScroll.SCALE_RATIO;
    const deltaY = (this.prevY - clientY) * PhysicalScroll.SCALE_RATIO;

    this.prevX = clientX;
    this.prevY = clientY;

    if (deltaY || deltaX) {
      this.st.trigger({
        deltaX,
        deltaY,
      });
    }
  };

  private end = (e: PhysicalScrollEvent) => {
    if (this.touchEnable) {
      this.unBindTouchEvent(e.target);
    }

    this.realPrevX = undefined;
    this.realPrevY = undefined;

    if (this.prevX === undefined || this.prevY === undefined) return;

    const [clientX, clientY] = e.xy;

    const duration = Date.now() - this.startTime!;

    const movementX = this.startX! - clientX;
    const movementY = this.startY! - clientY;

    // 距离
    const totalDistance = Math.sqrt(movementX ** 2 + movementY ** 2);
    // 平均速度
    const averageSpeed = totalDistance / duration;

    // 大于阈值, 需要添加额外的惯性移动距离
    if (averageSpeed > PhysicalScroll.INERTIA_TRIGGER_THRESHOLD) {
      // // 惯性距离占实际移动距离的比例
      const ratio =
        (averageSpeed / PhysicalScroll.INERTIA_TRIGGER_THRESHOLD) *
        PhysicalScroll.DECAY_FACTOR;

      const distanceX = movementX * ratio;
      const distanceY = movementY * ratio;

      this.st.trigger({
        deltaX: distanceX,
        deltaY: distanceY,
      });
    }

    this.prevX = undefined;
    this.prevY = undefined;
    this.startX = undefined;
    this.startY = undefined;
    this.startTime = undefined;

    return;
  };
}
