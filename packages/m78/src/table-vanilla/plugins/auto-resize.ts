import ResizeObserver from "resize-observer-polyfill";
import throttle from "lodash/throttle.js";
import { TablePlugin } from "../plugin.js";

export class _TableAutoResizePlugin extends TablePlugin {
  ob: ResizeObserver;

  isFirst = true;

  mounted() {
    this.ob = new (ResizeObserver as any)(this.handleResize);

    this.ob.observe(this.config.el);
  }

  beforeDestroy() {
    this.ob.disconnect();
  }

  handleResize: ResizeObserverCallback = throttle((e, ob) => {
    if (this.isFirst) {
      this.isFirst = false;
      return;
    }

    this.table.event.resize.emit(e, ob);

    this.table.reload({ keepPosition: true });
  }, 16);
}
