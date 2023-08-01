import {
  BoundSize,
  Point,
  createEvent,
  CustomEvent,
  TupleNumber,
  isNumber,
} from "@m78/utils";
import { Gesture, FullGestureState } from "@use-gesture/vanilla";

export interface VirtualBoundItem extends BoundSize {
  /** 节点层级, 决定了事件覆盖 */
  zIndex: number;
  /** 根据此标识判断bound的类型 */
  type: any;
  /** 块的光标类型 */
  cursor?: string;
  /** 触发hover时的光标类型 */
  hoverCursor?: string;
  /** 通常是跟该bound关联的数据 */
  data?: any;
}

export interface VirtualBoundClickEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
  event: Event;
}

export type VirtualBoundClickListener = (ev: VirtualBoundClickEvent) => void;

export interface VirtualBoundHoverEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 是否触发hover */
  hover: boolean;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
  event?: Event;
}

export type VirtualBoundHoverListener = (ev: VirtualBoundHoverEvent) => void;

export interface VirtualBoundDragEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 相对上一次的移动距离 */
  delta: TupleNumber;
  /** 总的移动距离 */
  movement: TupleNumber;
  /** 指针位置 */
  xy: TupleNumber;
  /** 是否首次触发 */
  first: boolean;
  /** 是否最后一次触发 */
  last: boolean;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse/touch事件 */
  event: Event;
}

export type VirtualBoundDragListener = (ev: VirtualBoundDragEvent) => void;

// 在单独的模块提供
export class VirtualBound {
  constructor(conf: {
    /** 挂载事件的节点 */
    el: HTMLDivElement;
    /** 30 | hover延迟触发时间, 单位为ms */
    hoverDelay?: number;
    /** 触发hover前的校验, 返回true时停止事件触发, ev为原始事件对象 */
    hoverPreCheck?: (ev: Event) => boolean;
    /** 触发drag前的校验, 返回true时停止事件触发, ev为原始事件对象 */
    dragPreCheck?: (ev: Event) => boolean;
  }) {
    this.el = conf.el;
    this.hoverDelay = isNumber(conf.hoverDelay) ? conf.hoverDelay : 30;
    this.hoverPreCheck = conf.hoverPreCheck;
    this.dragPreCheck = conf.dragPreCheck;

    this.click = createEvent();
    this.hover = createEvent();
    this.drag = createEvent();

    this.bindEvents();
  }

  private el: HTMLDivElement;

  private gesture: Gesture;

  hoverDelay: number;

  hoverPreCheck?: (ev: Event) => boolean;

  dragPreCheck?: (ev: Event) => boolean;

  /** 所有bound */
  bounds: VirtualBoundItem[] = [];

  /** 虚拟节点click事件 */
  click: CustomEvent<VirtualBoundClickListener>;

  /** 虚拟节点hover事件 */
  hover: CustomEvent<VirtualBoundHoverListener>;

  /** 虚拟节点drag事件 */
  drag: CustomEvent<VirtualBoundDragListener>;

  /** 拖动中 */
  dragging = false;

  /** 设置为false时, 将停止事件派发 */
  private _enable = true;
  /** 当前光标 */
  private _cursor: string | null;
  /** 最后触发hover的bound */
  private lastMoveEnterBound: VirtualBoundItem | null = null;
  /** 延迟触发计时器 */
  private delayHoverTimer: any;
  /** 当前拖动的bound */
  private currentDragBound: VirtualBoundItem | null = null;
  /** 最后一次drag完成的时间, 用于现在drag后一定时间内不触发hover, 防止同时包含两个事件的bound在拖动完成后立即触发hover */
  private lastDragEndTime = 0;

  /** 清理所有占用 */
  destroy() {
    this.el.removeEventListener("mouseleave", this.triggerUnHover);
    this.gesture.destroy();
    this.click.empty();
    this.hover.empty();
    this.drag.empty();
    this.bounds = [];
    this.el = null!;
  }

  get enable() {
    return this._enable;
  }

  set enable(v) {
    this._enable = v;
    if (!v && this._enable) {
      this.cursor = null;
      this.triggerUnHover();
    }
  }

  /** 获取当前光标类型 */
  get cursor() {
    return this._cursor;
  }

  /** 设置当前光标类型 */
  set cursor(v) {
    this._cursor = v;
    this.el.style.cursor = v ? v : "";
  }

  /** 获取指定点的所有bound, 传入zIndexCheck可以在点上有多个bound时获取层级最高的那个 */
  getBound(xy: Point, zIndexCheck?: boolean) {
    const bounds = this.bounds.filter((i) => this.inBoundCheck(xy, i));

    if (!zIndexCheck || bounds.length <= 1) return bounds;

    let bound: VirtualBoundItem | undefined = undefined;
    let max = 0;

    bounds.forEach((i) => {
      if (i.zIndex >= max) {
        max = i.zIndex;
        bound = i;
      }
    });

    return bound ? [bound] : [];
  }

  /** 指定点是否包含bound */
  hasBound(xy: Point) {
    for (let i = 0; i < this.bounds.length; i++) {
      const cur = this.bounds[i];
      if (this.inBoundCheck(xy, cur)) return true;
    }

    return false;
  }

  /** 绑定事件 */
  private bindEvents() {
    this.gesture = new Gesture(
      this.el,
      {
        onMove: this.moveHandle,
        onDrag: this.dragHandle,
      },
      {
        drag: {
          filterTaps: true,
          tapsThreshold: 1,
        },
      }
    );

    this.el.addEventListener("mouseleave", this.triggerUnHover);
  }

  /** 监听move, 处理hover */
  private moveHandle = (e: FullGestureState<"move">) => {
    if (this.delayHoverTimer) {
      clearTimeout(this.delayHoverTimer);
      this.delayHoverTimer = null;
    }

    if (e.type === "pointerleave" || e.type === "mouseleave") {
      this.triggerUnHover(e.event);
      return;
    }

    if (!this.enable || this.dragging) return;

    if (this.lastDragEndTime) {
      const diff = Date.now() - this.lastDragEndTime;
      if (diff < 200) return; // drag完成 200ms内不能触发hover
    }

    const bounds = this.getBound(e.xy, true);

    const bound: VirtualBoundItem | undefined = bounds[0];

    if (this.lastMoveEnterBound && this.lastMoveEnterBound !== bound) {
      this.triggerUnHover(e.event);
      return;
    }

    if (bound && this.lastMoveEnterBound !== bound) {
      this.delayHover(bound, e);
    }
  };

  /** 取消hover */
  private triggerUnHover = (event?: Event) => {
    if (!this.lastMoveEnterBound) return;

    this.hover.emit({
      bound: this.lastMoveEnterBound,
      hover: false,
      event,
    });
    this.lastMoveEnterBound = null;

    if (!this.dragging) {
      this.cursor = null;
    }
  };

  /** 延迟触发hover */
  private delayHover = (
    bound: VirtualBoundItem,
    e: FullGestureState<"move">
  ) => {
    this.delayHoverTimer = setTimeout(() => {
      const bounds = this.getBound(e.xy, true);

      const _bound: VirtualBoundItem | undefined = bounds[0];

      // 最新的hover项已经不是该项
      if (!_bound || bound !== _bound) return;

      const ev = {
        bound,
        hover: true,
        event: e.event,
      };

      if (this.hoverPreCheck && this.hoverPreCheck(e.event)) return;

      this.lastMoveEnterBound = bound;

      this.hover.emit(ev);
      if (bound.hoverCursor) this.cursor = bound.hoverCursor;
    }, this.hoverDelay);
  };

  private dragHandle = (e: FullGestureState<"drag">) => {
    if (!this.enable) {
      e.cancel();
      return;
    }

    if (e.tap) {
      const bounds = this.getBound(e.xy, true);
      if (!bounds.length) return;

      this.click.emit({ bound: bounds[0], event: e.event });

      return;
    }

    if (e.canceled) return;

    if (e.first) {
      if (this.dragPreCheck && this.dragPreCheck(e.event)) {
        e.cancel();
        return;
      }

      const curBound = this.getBound(e.xy, true);

      if (!curBound.length) {
        e.cancel();
        return;
      }

      this.dragging = true;
      this.cursor = "grabbing";
      this.currentDragBound = curBound[0];
    }

    this.drag.emit({
      bound: this.currentDragBound!,
      delta: e.delta,
      movement: e.movement,
      xy: e.xy,
      first: e.first,
      last: e.last,
      event: e.event,
    });

    if (e.last) {
      this.cursor = null;
      this.currentDragBound = null;
      this.dragging = false;
      this.lastDragEndTime = Date.now();
    }
  };

  /** xy是否在bound内 */
  private inBoundCheck(xy: Point, bound: VirtualBoundItem) {
    const [x, y] = xy;
    const { left, top, width, height } = bound;
    return x >= left && x <= left + width && y >= top && y <= top + height;
  }
}
