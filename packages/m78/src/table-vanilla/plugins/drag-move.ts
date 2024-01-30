import { TablePlugin } from "../plugin.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
import {
  DragScroll as PhysicalScroll,
  DragScrollEvent as PhysicalScrollEvent,
  DragScrollEventType as PhysicalScrollEventType,
} from "@m78/smooth-scroll";

/** 拖拽滚动相关功能支持 */
export class _TableDragMovePlugin extends TablePlugin implements TableDragMove {
  ps: PhysicalScroll;

  private enable = false;

  beforeInit() {
    // 在支持触控的设备上默认启用
    this.enable = "ontouchstart" in document;

    this.methodMapper(this.table, ["isDragMoveEnable", "setDragMoveEnable"]);
  }

  mounted() {
    this.ps = new PhysicalScroll({
      el: this.config.el,
      type: [PhysicalScrollEventType.touch, PhysicalScrollEventType.mouse],
      triggerFilter: this.triggerFilter,
      trigger: (e) => {
        this.table.setXY(this.table.getX() + e.x, this.table.getY() + e.y);
      },
    });
  }

  beforeDestroy() {
    this.ps.destroy();
  }

  isDragMoveEnable(): boolean {
    return this.enable;
  }

  setDragMoveEnable(enable: boolean) {
    this.enable = enable;
    this.table.event.dragMoveChange.emit(enable);
  }

  /** 事件过滤 */
  private triggerFilter = (e: PhysicalScrollEvent) => {
    if (!this.enable) return true;

    const interrupt = _triggerFilterList(
      e.target as HTMLElement,
      _tableTriggerFilters,
      this.config.el
    );

    if (interrupt) return true;

    const startPoint = this.table.transformViewportPoint(e.offset);

    const items = this.table.getBoundItems(startPoint.xy);

    const first = items.cells[0];

    // 表头不参与滚动
    if (!first || first.column.isHeader || first.row.isHeader) return true;
  };
}

export interface TableDragMove {
  /** 拖拽移动是否启用 */
  isDragMoveEnable(): boolean;

  /** 设置拖拽移动启用状态 */
  setDragMoveEnable(enable: boolean): void;
}
