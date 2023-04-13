import { clamp } from "@m78/utils/number.js";
import { TablePlugin } from "../plugin.js";
export class TableZoomPlugin extends TablePlugin {
  static MIN_ZOOM = 0.5;
  static MAX_ZOOM = 2;

  init() {
    // 映射实现方法
    this.methodMapper(this.table, ["zoom"]);
  }

  zoom(zoom?: number) {
    zoom = clamp(zoom, TableZoomPlugin.MIN_ZOOM, TableZoomPlugin.MAX_ZOOM);

    // 只支持等比缩放, 所以取一个方向即可
    if (zoom === undefined) return this.table.stage.scale()?.x || 1;

    const domEl = this.context.domEl;
    const contentEl = this.context.domContentEl;

    const beforeSize = contentEl.getBoundingClientRect().width;

    // 变更dom容器尺寸
    contentEl.style.transform = `scale(${zoom})`;
    contentEl.style.transformOrigin = `left top`;

    const afterSize = contentEl.getBoundingClientRect().width;

    // 变更画布
    this.table.stage.scale({
      x: zoom,
      y: zoom,
    });

    this.table.render();

    // dom容器尺寸变化比例
    const diffRatio = afterSize / beforeSize;

    // 还原比例
    domEl.scrollLeft = domEl.scrollLeft * diffRatio;
    domEl.scrollTop = domEl.scrollTop * diffRatio;
  }
}
