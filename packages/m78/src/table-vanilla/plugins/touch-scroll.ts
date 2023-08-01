import { TablePlugin } from "../plugin.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
import {
  PhysicalScroll,
  PhysicalScrollEvent,
  PhysicalScrollEventType,
} from "@m78/utils";

/** 将touch事件模拟为滚动 */
export class _TableTouchScrollPlugin extends TablePlugin {
  ps: PhysicalScroll;

  mounted() {
    this.ps = new PhysicalScroll({
      el: this.config.el,
      type: [PhysicalScrollEventType.touch],
      onlyNotify: true,
      triggerFilter: this.triggerFilter,
      positionGetter: () => this.table.getXY(),
      onScroll: ([x, y], isAutoScroll) => {
        if (isAutoScroll) {
          // 这里需要同步更新滚动位置
          this.table.takeover(() => {
            this.table.setXY(x, y);
            this.table.renderSync();
          });
        } else {
          this.table.setXY(x, y);
        }
      },
    });
  }

  beforeDestroy() {
    this.ps.destroy();
  }

  /** 事件过滤 */
  triggerFilter = (e: PhysicalScrollEvent) => {
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
