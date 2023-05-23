import { clamp } from "@m78/utils/number.js";
import { TablePlugin } from "../plugin.js";
import { _TableViewportPlugin } from "./viewport.js";
export class _TableZoomPlugin extends TablePlugin {
  static MIN_ZOOM = 0.8;
  static MAX_ZOOM = 1.5;

  init() {
    // 映射实现方法
    this.methodMapper(this.table, ["zoom"]);
  }

  zoom(zoom?: number) {
    zoom = clamp(zoom, _TableZoomPlugin.MIN_ZOOM, _TableZoomPlugin.MAX_ZOOM);

    // 只支持等比缩放, 所以取一个方向即可
    if (zoom === undefined) return this.context.zoom;

    const domEl = this.context.viewEl;
    const contentEl = this.context.viewContentEl;
    const stageEL = this.context.stageEL;

    const beforeSize = contentEl.getBoundingClientRect().width;

    this.context.zoom = zoom;

    // 变更dom容器尺寸
    stageEL.style.transform = `scale(${zoom})`;
    stageEL.style.transformOrigin = `left top`;

    this.getPlugin(_TableViewportPlugin).updateDom();

    const afterSize = contentEl.getBoundingClientRect().width;

    this.table.render();

    // dom容器尺寸变化比例
    const diffRatio = afterSize / beforeSize;

    // 还原比例
    domEl.scrollLeft = domEl.scrollLeft * diffRatio;
    domEl.scrollTop = domEl.scrollTop * diffRatio;

    this.table.event.zoom.emit(zoom);
  }
}
