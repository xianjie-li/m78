import { SmoothTrigger, SmoothTriggerOption } from "./smooth-trigger.js";

export interface SmoothWheelOpt extends SmoothTriggerOption {
  /** 绑定wheel事件的节点 */
  el: HTMLElement;
}

/**
 * 提供平滑处理的 onwheel 事件, 在鼠标/触控板等方式触发wheel时均能增强滚动体验
 * */
export class SmoothWheel {
  /** 平滑触发器 */
  st: SmoothTrigger;

  constructor(public opt: SmoothWheelOpt) {
    this.st = new SmoothTrigger({
      trigger: opt.trigger,
    });

    opt.el.addEventListener("wheel", this.handle as any);
  }

  destroy() {
    this.opt.el.removeEventListener("wheel", this.handle as any);
  }

  // 正在滚动中
  get wheeling() {
    return this.st.running;
  }

  private handle = (e: WheelEvent) => {
    e.preventDefault();

    // 按下shiftKey时, 横向滚动
    const shiftKey = e.shiftKey;

    const deltaY = shiftKey ? 0 : e.deltaY;
    const deltaX = shiftKey ? e.deltaY || e.deltaX : e.deltaX; // 部分设备按下shiftKey不会自动切换到deltaY

    this.st.trigger({
      deltaY,
      deltaX,
    });
  };
}
