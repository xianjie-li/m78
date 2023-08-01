import { TablePlugin } from "../plugin.js";
import {
  AnyFunction,
  CustomEvent,
  EmptyFunction,
  getEventOffset,
} from "@m78/utils";
import { WheelEvent } from "react";
import { TableCell } from "../types/items.js";
import debounce from "lodash/debounce.js";

import { TableMutationEvent } from "./mutation.js";
import { TableReloadOptions } from "./life.js";

/**
 * 内部事件绑定, 外部事件派发
 * */
export class _TableEventPlugin extends TablePlugin {
  /** 在某些时候可以通过此项禁用内部的scroll监听, 防止重复触发 */
  disableScrollListener = false;

  initialized() {
    this.config.el.addEventListener("click", this.onClick);
    this.config.el.addEventListener("contextmenu", this.onContext);
    this.context.viewEl.addEventListener("wheel", this.onWheel as any);
    this.context.viewEl.addEventListener("scroll", this.onScroll);
  }

  beforeDestroy() {
    this.config.el.removeEventListener("click", this.onClick);
    this.config.el.removeEventListener("contextmenu", this.onContext);
    this.context.viewEl.removeEventListener("wheel", this.onWheel as any);
    this.context.viewEl.removeEventListener("scroll", this.onScroll);
  }

  onContext = (e: MouseEvent) => {
    e.preventDefault();
  };

  onClick = (e: MouseEvent) => {
    const pInfo = this.table.transformViewportPoint(
      getEventOffset(e, this.config.el)
    );

    const event = this.table.event;

    const items = this.table.getAreaBound(pInfo.xy);

    if (items.cells.length) {
      event.click.emit(items.cells[0], e);
    }
  };

  /** 滚动 */
  onWheel = (e: WheelEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (e.shiftKey) {
      this.table.setX(this.table.getX() + e.deltaY);
    } else {
      this.table.setXY(
        this.table.getX() + e.deltaX,
        this.table.getY() + e.deltaY
      );
    }
  };

  /** 操作滚动条时同步滚动位置 */
  onScroll = () => {
    if (this.disableScrollListener) return;

    const el = this.context.viewEl;

    this.context.xyShouldNotify = true;
    this.table.setXY(el.scrollLeft, el.scrollTop);
    this.context.xyShouldNotify = false;
  };

  /** 延迟100毫秒后将disableScrollListener设置为false, 内置防抖逻辑, 可以多次调用 */
  scrollEndTrigger = debounce(
    () => {
      this.disableScrollListener = false;
    },
    100,
    { leading: false, trailing: true }
  );

  /** 用于手动设置滚动位置时, 在回调期间内防止触发内部onScroll事件 */
  scrollAction = (cb: AnyFunction) => {
    this.disableScrollListener = true;
    cb();
    this.scrollEndTrigger();
  };
}

export interface TableEvents {
  /**
   * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
   * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
   * */
  error: CustomEvent<(msg: string) => void>;
  /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
  click: CustomEvent<(cell: TableCell, event: Event) => void>;
  /** 表格容器尺寸/所在窗口位置变更时, 这对插件作者应该会有用 */
  resize: CustomEvent<ResizeObserverCallback>;
  /** 任意选中项变更 */
  select: CustomEvent<EmptyFunction>;
  /** 开始选取 */
  selectStart: CustomEvent<EmptyFunction>;
  /** 行选中变更 */
  rowSelect: CustomEvent<EmptyFunction>;
  /** 单元格选中变更 */
  cellSelect: CustomEvent<EmptyFunction>;
  /** 配置/数据等变更, 通常意味需要持久化的一些信息发生了改变 */
  mutation: CustomEvent<(event: TableMutationEvent) => void>;
  /** 单元格的挂载状态变更 (mount状态可以理解为单元格是否在表格视口内并被渲染, 可通过cell.isMount获取) */
  mountChange: CustomEvent<(cell: TableCell) => void>;
  /** 单元格交互状态发生变更, show - 显示还是关闭, isSubmit - 提交还是取消 */
  interactiveChange: CustomEvent<
    (cell: TableCell, show: boolean, isSubmit: boolean) => void
  >;

  //* # # # # # # # 以下为部分对外暴露的插件生命周期事件 # # # # # # # */
  /** 初始化阶段触发 */
  init: CustomEvent<EmptyFunction>;
  /** 初始化完成触发 */
  initialized: CustomEvent<EmptyFunction>;
  /** 首次渲染完成 */
  mounted: CustomEvent<EmptyFunction>;
  /** 渲染中, 本阶段内部渲染基本上已完成, 可以再次附加自定义的渲染 */
  rendering: CustomEvent<EmptyFunction>;
  /** 每次渲染完成后触发 */
  rendered: CustomEvent<EmptyFunction>;
  /** 重载表格时触发 */
  reload: CustomEvent<(opt: TableReloadOptions) => void>;
  /** 卸载前触发 */
  beforeDestroy: CustomEvent<EmptyFunction>;
}

export interface TableEvent {
  /** 所有可用事件 */
  event: TableEvents;
}
