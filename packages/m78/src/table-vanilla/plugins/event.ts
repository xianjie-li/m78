import { TablePlugin } from "../plugin.js";
import {
  AnyFunction,
  CustomEvent,
  EmptyFunction,
  getEventOffset,
  rafCaller,
  RafFunction,
} from "@m78/utils";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import debounce from "lodash/debounce.js";

import { TableMutationEvent } from "./mutation.js";
import { TableReloadOptions } from "./life.js";
import { TableFeedbackEvent } from "./feedback.js";
import { SmoothTriggerEvent, SmoothWheel } from "@m78/smooth-scroll";
import { CustomEventWithHook } from "@m78/hooks";

/**
 * 内部事件绑定, 外部事件派发
 * */
export class _TableEventPlugin extends TablePlugin {
  /** 在某些时候可以通过此项禁用内部的scroll监听, 防止重复触发 */
  disableScrollListener = false;

  /** 处理onwheel在平滑滚动, 主要是针对鼠标 */
  smoothWheel: SmoothWheel;

  /** 优化render函数 */
  scrollRafCaller: RafFunction;
  scrollRafClear: EmptyFunction;

  init() {
    this.scrollRafCaller = rafCaller();
  }

  initialized() {
    this.config.el.addEventListener("click", this.onClick);
    this.config.el.addEventListener("contextmenu", this.onContext);
    this.context.viewEl.addEventListener("scroll", this.onScroll);

    this.smoothWheel = new SmoothWheel({
      el: this.context.viewEl,
      trigger: this.onWheel,
    });
  }

  beforeDestroy() {
    if (this.scrollRafClear) this.scrollRafClear();

    this.config.el.removeEventListener("click", this.onClick);
    this.config.el.removeEventListener("contextmenu", this.onContext);
    this.context.viewEl.removeEventListener("scroll", this.onScroll);
    this.smoothWheel.destroy();
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
  onWheel = (e: SmoothTriggerEvent) => {
    this.table.setXY(this.table.getX() + e.x, this.table.getY() + e.y);
  };

  /** 操作滚动条时同步滚动位置 */
  onScroll = () => {
    if (this.disableScrollListener) return;

    const el = this.context.viewEl;

    this.scrollRafClear = this.scrollRafCaller(() => {
      this.context.xyShouldNotify = true;
      this.table.setXY(el.scrollLeft, el.scrollTop);
      this.context.xyShouldNotify = false;
    });
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
  /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
  click: CustomEvent<(cell: TableCell, event: Event) => void>;
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

  //* # # # # # # # 以下为部分对外暴露的插件生命周期事件或仅对库开发者有用的事件 # # # # # # # */
  /** 初始化阶段触发 */
  init: CustomEvent<EmptyFunction>;
  /** 初始化完成触发 */
  initialized: CustomEvent<EmptyFunction>;
  /** 首次渲染完成 */
  mounted: CustomEvent<EmptyFunction>;
  /** 每次开始前触发 */
  beforeRender: CustomEvent<EmptyFunction>;
  /** 渲染中, 本阶段内部渲染基本上已完成, 可以再次附加自定义的渲染 */
  rendering: CustomEvent<EmptyFunction>;
  /** 每次渲染完成后触发 */
  rendered: CustomEvent<EmptyFunction>;
  /** 重载表格时触发 */
  reload: CustomEvent<(opt: TableReloadOptions) => void>;
  /** 卸载前触发 */
  beforeDestroy: CustomEvent<EmptyFunction>;
  /** 在rendering触发前, 但在每个单元格渲染后触发 */
  cellRendering: CustomEvent<(cell: TableCell) => void>;
  /** 在rendering触发前触发, 主要用于通知所有该次render显示的行, 触发时并不意味着行内所有单元格均已渲染 */
  rowRendering: CustomEvent<(row: TableRow) => void>;
  /** 在rendering触发前触发, 主要用于通知所有该次render显示的列, 触发时并不意味着行内所有单元格均已渲染 */
  columnRendering: CustomEventWithHook<(column: TableColumn) => void>;

  /** 单元格的挂载状态变更 (mount状态可以理解为单元格是否在表格视口内并被渲染, 可通过cell.isMount获取) */
  mountChange: CustomEvent<(cell: TableCell) => void>;
  /** 单元格交互状态发生变更, show - 显示还是关闭, isSubmit - 提交还是取消 */
  interactiveChange: CustomEvent<
    (cell: TableCell, show: boolean, isSubmit: boolean) => void
  >;
  /** 表格容器尺寸/所在窗口位置变更时, 这对插件作者应该会有用 */
  resize: CustomEvent<ResizeObserverCallback>;
  /**
   * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" / "不支持粘贴板api" 等
   * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
   * */
  error: CustomEvent<(msg: string) => void>;
  /** 需要进行一些反馈操作时触发, 比如点击了包含验证错误/禁用/内容不能完整显示的行, 如果项包含多个反馈, 则event包含多个事件项 */
  feedback: CustomEvent<(event: TableFeedbackEvent[]) => void>;
  /** 拖拽移动启用状态变更时触发 */
  dragMoveChange: CustomEvent<(enable: boolean) => void>;
  /** 常规配置(非持久化配置)变更时触发, 接收所有变更key的数组changeKeys, 和isChange, 用于检测key是否包含在该次变更中 */
  configChange: CustomEvent<
    (changeKeys: string[], isChange: (key: string) => boolean) => void
  >;
}

export interface TableEvent {
  /** 所有可用事件 */
  event: TableEvents;
}
