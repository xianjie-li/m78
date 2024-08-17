import { EmptyFunction } from "@m78/utils";
import { raf } from "./raf.js";

/**
 * 接收每次x/y轴的偏移, 根据触发的区间进行补帧后平滑的触发trigger, 使用者可在trigger事件中更新实际的位置, 它是DragScroll和SmoothWheel的底层实现
 * */
export class SmoothTrigger {
  constructor(public opt: SmoothTriggerOption) {}

  // 待移动的y轴位置
  yAll = 0;

  // 待移动的x轴位置
  xAll = 0;

  running = false;

  // 滚动距离递减率, 越大滚动越快
  private static DECLINE_RATE = 0.16;

  // 当前raf清理函数
  private rafClear?: EmptyFunction;

  trigger({ deltaX, deltaY }: { deltaX: number; deltaY: number }) {
    if (!deltaX && !deltaY) return;

    this.yAll += deltaY;
    this.xAll += deltaX;

    // 切换滚动方向时, 将值尽快重置到对应方向, 防止粘滞感
    if (deltaY > 0) {
      if (this.yAll < 0) this.yAll = 0;
    } else if (deltaY < 0) {
      if (this.yAll > 0) this.yAll = 0;
    }

    if (deltaX > 0) {
      if (this.xAll < 0) this.xAll = 0;
    } else if (deltaX < 0) {
      if (this.xAll > 0) this.xAll = 0;
    }

    if (!this.running && (this.xAll || this.yAll)) {
      this.running = true;
      this.run();
    }
  }

  destroy() {
    if (this.rafClear) this.rafClear();
  }

  /** 根据当前的xAll/yAll开始触发滚动 */
  private run() {
    this.rafClear?.();

    this.rafClear = raf(() => {
      const y = this.movementCalc(true);
      const x = this.movementCalc(false);

      if (x || y) {
        this.opt.trigger({
          x,
          y,
        });
      }

      this.rafClear = undefined;

      if (this.xAll || this.yAll) {
        this.run();
      } else {
        this.running = false;
      }
    });
  }

  /** 移动距离计算 */
  private movementCalc(isY: boolean) {
    let all = isY ? this.yAll : this.xAll;

    if (all !== 0) {
      let move = 0;
      const distance = Math.max(Math.abs(all) * SmoothTrigger.DECLINE_RATE, 1);

      if (all > 0) {
        all -= distance;
        move = distance;

        // 对应方向无值时重置
        if (all < 0) {
          move -= all;
          all = 0;
        }
      }

      if (all < 0) {
        all += distance;
        move = -distance;

        if (all > 0) {
          move += all;
          all = 0;
        }
      }

      isY ? (this.yAll = all) : (this.xAll = all);

      return move;
    }

    return 0;
  }
}

export interface SmoothTriggerOption {
  /** 触发器 */
  trigger: (e: SmoothTriggerEvent) => void;
}

export interface SmoothTriggerEvent {
  /** x轴移动距离 */
  x: number;
  /** y轴移动距离 */
  y: number;
}
