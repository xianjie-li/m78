import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form.js";
import debounce from "lodash/debounce.js";
import {
  createTrigger,
  TriggerInstance,
  TriggerListener,
  TriggerTargetMeta,
  TriggerType,
} from "../../trigger/index.js";
import { TableCell } from "../types/items.js";
import { BoundSize } from "@m78/utils";
import { TableMutationEvent, TableMutationType } from "./mutation.js";

/** 提供对某些表格元素的交互反馈, 比如单元格包含错误信息或内容超出时, 在选中后为其提供反馈 */
export class _TableFeedbackPlugin extends TablePlugin {
  form: _TableFormPlugin;

  lastEvent: TableFeedbackEvent[] | null = null;

  // 防止键盘交互导致自动滚动时, feedback触发完马上滚动导致关闭
  lastTime = 0;

  // 表头交互提醒
  headerTrigger: TriggerInstance;

  /** mutation value change 提交延迟计时器 */
  valueChangeTimer: any;

  initialized() {
    this.form = this.getPlugin(_TableFormPlugin);
    this.table.event.cellSelect.on(this.cellChange);
    this.table.event.mutation.on(this.mutationHandle);

    this.headerTrigger = createTrigger({
      type: TriggerType.active,
      container: this.config.el,
      active: {
        lastDelay: 0,
      },
    });

    this.headerTrigger.event.on(this.headerTriggerHandle);

    // 滚动时关闭
    this.context.viewEl.addEventListener("scroll", this.scroll);
  }

  beforeDestroy() {
    this.headerTrigger.destroy();

    this.table.event.cellSelect.off(this.cellChange);
    this.table.event.mutation.off(this.mutationHandle);
    this.context.viewEl.removeEventListener("scroll", this.scroll);
    clearTimeout(this.valueChangeTimer);
  }

  rendered() {
    this.renderedDebounce();
  }

  // 渲染完成后, 重新计算表头的触发区域
  renderedDebounce = debounce(
    () => {
      this.updateHeaderTriggerTargets();
    },
    100,
    {
      leading: false,
      trailing: true,
    }
  );

  // 如果有lastEvent, 发出关闭通知
  emitClose() {
    if (this.lastEvent) {
      const diffTime = Date.now() - this.lastTime;

      if (diffTime < 60) return;

      const e: TableFeedbackEvent = {
        type: TableFeedback.close,
        text: "",
      };
      this.lastEvent = null;
      this.table.event.feedback.emit([e]);
    }
  }

  // 滚动时关闭已触发反馈
  scroll = () => {
    this.emitClose();
  };

  // 触发单元格feedback, 默认为选中单元格触发
  cellChange = (cells?: TableCell[]) => {
    if (!cells?.length) {
      cells = this.table.getSelectedCells();
    }

    // 只在选中单条时触发
    if (cells.length !== 1) {
      this.emitClose();
      return;
    }

    const cell = cells[0];

    const events: TableFeedbackEvent[] = [];

    // 内容溢出
    if (this.isCellOverflow(cell)) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.overflow,
        text: cell.text,
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    // form invalid
    if (!this.form.validCheck(cell)) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.disable,
        text: this.context.texts["currently not editable"],
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    const errMsg = this.form.getCellError(cell);

    // form error
    if (errMsg) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.error,
        text: errMsg,
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    // soft remove
    if (this.table.isSoftRemove(cell.row.key)) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.regular,
        text: this.context.texts["soft remove tip"],
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    if (events.length) {
      this.lastEvent = [...events];
      this.lastTime = Date.now();
      this.table.event.feedback.emit(events);
    } else {
      this.emitClose();
    }
  };

  // 单元格提交时, 触发feedback
  mutationHandle = (event: TableMutationEvent) => {
    if (event.type === TableMutationType.value) {
      // 确保在变更并校验完成后触发
      this.valueChangeTimer = setTimeout(() => {
        this.cellChange([event.cell]);
      }, 50);
    }
  };

  // 表头交互
  headerTriggerHandle: TriggerListener = (e) => {
    if (e.type !== TriggerType.active) return;

    if (!e.active) {
      this.emitClose();
      return;
    }

    const bound = (e.target as TriggerTargetMeta).target as BoundSize;

    const cell: TableCell = e.data;

    const events: TableFeedbackEvent[] = [];

    if (cell.column.key === "__RH") {
      const event: TableFeedbackEvent = {
        type: TableFeedback.regular,
        text: this.context.texts.selectAllOrUnSelectAll,
        cell,
        bound,
      };

      events.push(event);
    }

    const isOverflow = this.isCellOverflow(cell);

    if (isOverflow) {
      const event: TableFeedbackEvent = {
        type: TableFeedback.overflow,
        text: cell.text,
        cell,
        bound,
      };

      events.push(event);
    }

    const editStatus = this.form.getEditStatus(cell.column);

    if (editStatus) {
      const event: TableFeedbackEvent = {
        type: TableFeedback.regular,
        text: editStatus.required
          ? this.context.texts["editable and required"]
          : this.context.texts.editable,
        cell,
        bound,
      };

      events.push(event);
    }

    if (events.length) {
      this.lastEvent = [...events];
      this.table.event.feedback.emit(events);
    } else {
      this.emitClose();
      this.lastEvent = null;
    }
  };

  // 更新表头触发区域
  updateHeaderTriggerTargets() {
    const hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];

    const lastColumns = this.context.lastViewportItems?.columns || [];

    this.headerTrigger.clear();

    if (!lastColumns.length) {
      return;
    }

    const headerCells = lastColumns.map((col) =>
      this.table.getCell(hKey, col.key)
    );

    const { left, top } = this.config.el.getBoundingClientRect();

    const x = this.table.getX();

    // 去掉column resize handle的位置
    const adjustSize = 4;

    const targets: TriggerTargetMeta[] = headerCells.map((cell) => {
      const xFix = cell.column.isFixed ? 0 : x;

      return {
        target: {
          width: cell.width - adjustSize * 2,
          height: cell.height,
          left: cell.column.x + left + adjustSize - xFix,
          top: cell.row.y + top,
        },
        zIndex: cell.column.isFixed ? 1 : 0,
        data: cell,
      };
    });

    this.headerTrigger.add(targets);
  }

  // 检测单元格内容是否溢出
  isCellOverflow(cell: TableCell) {
    const dom = cell.dom;

    if (!dom) return false;

    const diffX = dom.scrollWidth - dom.offsetWidth;
    const diffY = dom.scrollHeight - dom.offsetHeight;

    // 阈值
    const threshold = 4;

    return diffX > threshold || diffY > threshold;
  }
}

/** event.feedback的触发类型 */
export enum TableFeedback {
  /** 内容溢出 */
  overflow = "overflow",
  /** 错误 */
  error = "error",
  /** 禁用项 */
  disable = "disable",
  /** 常规提醒 */
  regular = "regular",
  /** 关闭 */
  close = "close",
}

export interface TableFeedbackEvent {
  /** 触发反馈的类型 */
  type: TableFeedback;
  /** 反馈的内容 */
  text: string;
  /** 触发反馈的单元格 */
  cell?: TableCell;
  /** 触发反馈的目标dom */
  dom?: HTMLElement;
  /** 触发反馈的虚拟位置 */
  bound?: BoundSize;
}
