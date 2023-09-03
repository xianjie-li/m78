import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form.js";
import { TableFeedback, TableFeedbackEvent } from "./event.js";
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

  // 如果有lastEvent, 发出关闭通知
  emitClose() {
    if (this.lastEvent) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.close,
        text: "",
      };
      this.lastEvent = null;
      this.table.event.feedback.emit([e]);
    }
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

    if (this.isCellOverflow(cell)) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.overflow,
        text: cell.text,
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    // 禁用检测
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

    // 错误检测
    if (errMsg) {
      const e: TableFeedbackEvent = {
        type: TableFeedback.error,
        text: errMsg,
        cell,
        dom: cell.dom,
      };

      events.push(e);
    }

    if (events.length) {
      this.lastEvent = [...events];
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
        text: "全选/反选",
        cell,
        bound,
      };

      events.push(event);
    }

    if (this.isCellOverflow(cell)) {
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
