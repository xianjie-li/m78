import { TablePlugin } from "../plugin.js";
import { _removeNode } from "../common.js";

export class _TableScrollMarkPlugin extends TablePlugin {
  /** 容器 */
  wrapNode: HTMLDivElement;

  tEl: HTMLDivElement;
  rEl: HTMLDivElement;
  bEl: HTMLDivElement;
  lEl: HTMLDivElement;

  mount() {
    const wrapNode = document.createElement("div");
    wrapNode.className = "m78-table_scroll-mark-wrap";

    this.tEl = document.createElement("div");
    this.rEl = document.createElement("div");
    this.bEl = document.createElement("div");
    this.lEl = document.createElement("div");

    this.tEl.className = "m78-table_scroll-mark __top";
    this.rEl.className = "m78-table_scroll-mark __right";
    this.bEl.className = "m78-table_scroll-mark __bottom";
    this.lEl.className = "m78-table_scroll-mark __left";

    wrapNode.appendChild(this.tEl);
    wrapNode.appendChild(this.rEl);
    wrapNode.appendChild(this.bEl);
    wrapNode.appendChild(this.lEl);

    this.config.el.appendChild(wrapNode);

    this.updateBound();
    this.updateVisible();
  }

  initialized() {
    this.context.viewEl.addEventListener("scroll", this.updateVisible);
    this.table.event.zoom.on(this.handleZoomChange);
  }

  beforeDestroy() {
    this.context.viewEl.removeEventListener("scroll", this.updateVisible);
    this.table.event.zoom.off(this.handleZoomChange);

    _removeNode(this.wrapNode);
  }

  reload() {
    this.updateBound();
    this.updateVisible();
  }

  handleZoomChange = () => {
    this.updateBound();
    this.updateVisible();
  };

  /** 可见性更新 */
  updateVisible = () => {
    const ctx = this.context;
    const x = this.table.x();
    const y = this.table.y();
    const touchTop = y === 0;
    const touchBottom = Math.ceil(y) >= this.table.maxY(); // 为什么会出现小数?
    const touchLeft = x === 0;
    const touchRight = Math.ceil(x) >= this.table.maxX();

    this.tEl.style.opacity = touchTop || !ctx.topFixedHeight ? "0" : "1";
    this.bEl.style.opacity = touchBottom || !ctx.bottomFixedHeight ? "0" : "1";
    this.lEl.style.opacity = touchLeft || !ctx.leftFixedWidth ? "0" : "1";
    this.rEl.style.opacity = touchRight || !ctx.rightFixedWidth ? "0" : "1";
  };

  /** 位置尺寸更新 */
  updateBound() {
    const ctx = this.context;
    const zoom = this.table.zoom();

    const left = ctx.leftFixedWidth * zoom;
    const top = ctx.topFixedHeight * zoom;
    const right = ctx.rightFixedWidth * zoom;
    const bottom = ctx.bottomFixedHeight * zoom;

    // 下面的1px为修正位置, 使阴影看起来更贴合边缘
    this.tEl.style.top = `${top - 1}px`;
    this.bEl.style.bottom = `${bottom - 1}px`;
    this.rEl.style.right = `${right - 1}px`;
    this.lEl.style.left = `${left - 1}px`;
  }
}
