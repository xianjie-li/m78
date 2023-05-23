import { TablePlugin } from "../plugin.js";
import { createEvent } from "@m78/utils";
import { _getOffset } from "../common.js";
import { WheelEvent } from "react";

/**
 * 内部事件绑定, 外部事件派发
 * */
export class _TableEventPlugin extends TablePlugin {
  initialized() {
    const eventCreator = this.config.eventCreator
      ? this.config.eventCreator
      : createEvent;

    this.table.event = {
      error: eventCreator(),
      click: eventCreator(),
      zoom: eventCreator(),
      resize: eventCreator(),
      select: eventCreator(),
      rowSelect: eventCreator(),
      cellSelect: eventCreator(),
      mutation: eventCreator(),
    };

    this.config.el.addEventListener("click", this.onClick);
    this.context.viewEl.addEventListener("wheel", this.onWheel as any);
    this.context.viewEl.addEventListener("scroll", this.onScroll);
  }

  beforeDestroy() {
    this.config.el.removeEventListener("click", this.onClick);
    this.context.viewEl.removeEventListener("wheel", this.onWheel as any);
    this.context.viewEl.removeEventListener("scroll", this.onScroll);
  }

  onClick = (e: MouseEvent) => {
    const pInfo = this.table.transformViewportPoint(
      _getOffset(e, this.config.el)
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

    this.table.xy(this.table.x() + e.deltaX, this.table.y() + e.deltaY);
  };

  /** 操作滚动条时同步滚动位置 */
  onScroll = () => {
    const el = this.context.viewEl;
    this.table.xy(el.scrollLeft, el.scrollTop);
  };
}
