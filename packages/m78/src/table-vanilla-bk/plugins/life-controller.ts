import { TablePlugin } from "../plugin.js";
import { TableReloadOptions } from "../types.js";
import { _TableInitPlugin } from "./init.js";
import { getNamePathValue, setNamePathValue } from "@m78/utils";
import {
  _getSizeString,
  _privateScrollerDomKey,
  _removeNode,
} from "../common.js";
import { _TableViewportPlugin } from "./viewport.js";

/** 表格生命周期相关控制 */
export class _TableLifeController extends TablePlugin {
  reload({ keepPosition }: TableReloadOptions = {}) {
    const ctx = this.context;
    const viewport = this.getPlugin(_TableViewportPlugin);

    this.commonAction();

    if (!keepPosition) {
      ctx.viewEl.scrollTop = 0;
      ctx.viewEl.scrollLeft = 0;
    }

    this.getPlugin(_TableInitPlugin)?.preHandle();

    if (viewport) {
      viewport.updateSize();
    }

    this.table.render();
  }

  /** 解除所有事件/引用类型占用 */
  beforeDestroy() {
    const ctx = this.context;

    this.restoreWrapSize();

    this.commonAction();

    // 如果是内部创建的dom容器, 将其移除
    if (getNamePathValue(ctx.viewEl, _privateScrollerDomKey)) {
      _removeNode(this.context.viewEl);
    } else {
      ctx.viewContentEl.style.width = "auto";
      ctx.viewContentEl.style.height = "auto";
    }

    setNamePathValue(this.table, "canvasElement", undefined);
    setNamePathValue(ctx, "domEl", undefined);
    setNamePathValue(ctx, "domContentEl", undefined);
  }

  commonAction() {
    const ctx = this.context;

    ctx.lastViewportItems = undefined;
    ctx.dataFixedSortList = [];
    ctx.columnsFixedSortList = [];
    ctx.topFixedMap = {};
    ctx.bottomFixedMap = {};
    ctx.leftFixedMap = {};
    ctx.rightFixedMap = {};
    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};
    ctx.lastMergeXMap = {};
    ctx.lastMergeYMap = {};
    ctx.rowCache = {};
    ctx.columnCache = {};
    ctx.cellCache = {};

    ctx.stageEL.innerHTML = ""; // 清空
  }

  /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */
  restoreWrapSize() {
    const config = this.config;
    const context = this.context;

    if (context.restoreWidth) {
      // 恢复尺寸
      config.el.style.width =
        config.width !== undefined
          ? _getSizeString(config.width)
          : context.restoreWidth;
      context.restoreWidth = undefined;
    }

    if (context.restoreHeight) {
      // 恢复尺寸
      config.el.style.height =
        config.height !== undefined
          ? _getSizeString(config.height)
          : context.restoreHeight;
      context.restoreHeight = undefined;
    }
  }
}
