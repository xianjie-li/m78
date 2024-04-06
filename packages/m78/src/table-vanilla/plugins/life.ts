import { TablePlugin } from "../plugin.js";
import { _TableInitPlugin } from "./init.js";
import {
  createRandString,
  EmptyFunction,
  getNamePathValue,
  isNumber,
  rafCaller,
  RafFunction,
  setNamePathValue,
} from "@m78/utils";
import { _privateInstanceKey, _privateScrollerDomKey } from "../common.js";
import { _TableRenderPlugin } from "./render.js";
import { removeNode } from "../../common/index.js";
import { _TableFormPlugin } from "./form/form";
import { _TableSoftRemovePlugin } from "./soft-remove.js";

/** 表格生命周期相关控制 */
export class _TableLifePlugin extends TablePlugin {
  /** 优化reload函数 */
  rafCaller: RafFunction;
  /** 清理raf */
  rafClear?: EmptyFunction;

  formPlugin: InstanceType<typeof _TableFormPlugin>;

  softRemove: _TableSoftRemovePlugin;

  beforeInit() {
    this.methodMapper(this.table, [
      ["reloadHandle", "reload"],
      ["destroyHandle", "destroy"],
      "reloadSync",
      "takeover",
      "isTaking",
      "resetStatus",
    ]);
  }

  init() {
    this.formPlugin = this.getPlugin(_TableFormPlugin);
    this.softRemove = this.getPlugin(_TableSoftRemovePlugin);

    this.context.lastReloadKey = createRandString();

    this.rafCaller = rafCaller();
  }

  initialized() {
    // 在节点上写入实例信息, 防止热重载等场景下反复创建实例
    setNamePathValue(this.config.el, _privateInstanceKey, this.table);
  }

  /** 解除所有事件/引用类型占用 */
  beforeDestroy() {
    if (this.rafClear) this.rafClear();

    const ctx = this.context;

    this.getPlugin(_TableRenderPlugin).restoreWrapSize();

    ctx.data = [];
    ctx.columns = [];
    ctx.rows = {};
    ctx.cells = {};
    ctx.rowCache = {};
    ctx.columnCache = {};
    ctx.cellCache = {};
    ctx.yHeaderKeys = [];
    ctx.ignoreXList = [];
    ctx.ignoreYList = [];

    this.commonAction();

    // 如果是内部创建的dom容器, 将其移除
    if (getNamePathValue(ctx.viewEl, _privateScrollerDomKey)) {
      removeNode(this.context.viewEl);
    } else {
      ctx.viewContentEl.style.width = "auto";
      ctx.viewContentEl.style.height = "auto";
    }

    setNamePathValue(this.table, "history", undefined);
    setNamePathValue(this.table, "canvasElement", undefined);
    setNamePathValue(ctx, "domEl", undefined);
    setNamePathValue(ctx, "domContentEl", undefined);
  }

  /** 核心reload逻辑 */
  reload({
    keepPosition,
    level = TableReloadLevel.base,
  }: TableReloadOptions = {}) {
    const ctx = this.context;
    const viewport = this.getPlugin(_TableRenderPlugin);

    ctx.lastReloadKey = createRandString();

    this.commonAction();

    if (!keepPosition) {
      ctx.viewEl.scrollTop = 0;
      ctx.viewEl.scrollLeft = 0;
    }

    const initPlugin = this.getPlugin(_TableInitPlugin);

    if (level === TableReloadLevel.base) {
      initPlugin.baseHandle();
    } else if (level === TableReloadLevel.index) {
      initPlugin.indexHandle();
    } else {
      this.table.history.reset();
      initPlugin.fullHandle();
    }

    viewport.updateDom();

    viewport.renderSync();
  }

  /** 实现table.reload() */
  reloadHandle(opt?: TableReloadOptions) {
    // 实现 takeover
    if (this.context.takeKey) {
      this.context.takeReload = true;
      this.mergeTakeReloadOptions(opt);
      return;
    }

    this.rafCaller(() => this.reloadMain(opt));
  }

  /** reloadHandle的同步版本 */
  reloadSync(opt?: TableReloadOptions) {
    // 实现 takeover
    if (this.context.takeKey) {
      this.context.takeReload = true;
      this.context.takeSyncReload = true;
      this.mergeTakeReloadOptions(opt);
      return;
    }

    this.reloadMain(opt);
  }

  /** 触发插件reload */
  reloadMain(opt: TableReloadOptions = {}) {
    this.plugins.forEach((plugin) => {
      plugin.reload?.(opt);
    });

    this.table.event.reload.emit(opt);
  }

  /** 实现table.destroy() */
  destroyHandle() {
    setNamePathValue(this.config.el, _privateInstanceKey, undefined);

    /* # # # # # # # beforeDestroy # # # # # # # */
    this.plugins.forEach((plugin) => {
      if (plugin === this) return; // 当前组件需要最后执行beforeDestroy
      plugin.beforeDestroy?.();
    });

    this.beforeDestroy();

    this.table.event.beforeDestroy.emit();
  }

  takeover: TableLife["takeover"] = (cb) => {
    const ctx = this.context;

    const obtain = !ctx.takeKey;

    if (obtain) {
      ctx.takeKey = createRandString(2);
    }

    cb();

    if (obtain) {
      this.context.takeKey = undefined;

      if (this.context.takeReload) {
        if (this.context.takeSyncReload) {
          this.table.reloadSync(this.context.takeReloadOptions);
        } else {
          this.table.reload(this.context.takeReloadOptions);
        }
      } else {
        if (this.context.takeSyncRender) {
          this.table.renderSync();
        } else {
          this.table.render();
        }
      }

      this.context.takeReload = false;
      this.context.takeSyncReload = false;
      this.context.takeSyncRender = false;
      this.context.takeReloadOptions = undefined;
    }
  };

  /** 是否正在执行takeover */
  isTaking() {
    return !!this.context.takeKey;
  }

  resetStatus() {
    this.table.takeover(() => {
      this.formPlugin.resetStatus();
      this.softRemove.confirmSoftRemove();
      this.table.history.reset();

      this.table.render();
    });
  }

  /** 对不同的reloadOpt进行特殊合并 */
  private mergeTakeReloadOptions(opt?: TableReloadOptions) {
    const ctxOpt = this.context.takeReloadOptions;

    if (!ctxOpt && opt) {
      this.context.takeReloadOptions = opt;
      return;
    }

    if (!ctxOpt) return;

    const level = opt?.level;
    const keepPosition = opt?.keepPosition;

    // 取最高的level
    if (isNumber(level)) {
      if (level >= (ctxOpt.level || 0)) {
        ctxOpt.level = level;
      }
    }

    // 有任意一次不保持位置, 则不保持位置
    if (ctxOpt.keepPosition === false) return;
    ctxOpt.keepPosition = keepPosition;
  }

  private commonAction() {
    const ctx = this.context;

    ctx.lastViewportItems = undefined;
    ctx.lastMountRows = {};
    ctx.lastMountColumns = {};
    ctx.topFixedMap = {};
    ctx.bottomFixedMap = {};
    ctx.leftFixedMap = {};
    ctx.rightFixedMap = {};
    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};
    ctx.lastMergeXMap = {};
    ctx.lastMergeYMap = {};

    ctx.stageEL.innerHTML = ""; // 清空
  }
}

// 添加一个重置级别,  FullIndex,  介于full与index之间, 根据ctx.data等数据重新出来大部分缓存, 比如合并配置, 计算fixed项,
// 但保留history/缓存等信息

/** 重载级别, 更高的级别会包含低级别的重载内容 */
export enum TableReloadLevel {
  /** 基础信息计算, 比如固定/合并/尺寸等信息, 计算比较快速 */
  base,
  /** 重新计算索引, 通常在组件内部备份的data和columns顺序变更时使用, 组件使用者很少会使用到此级别, 由于包含了对data/column的遍历, 性能消耗会更高 */
  index,
  /** 重要配置发生了变更, 比如data/column完全改变, 会执行初始化阶段的大部分操作 */
  full,
}

export type TableReloadLevelKeys = keyof typeof TableReloadLevel;
export type TableReloadLevelUnion = TableReloadLevel | TableReloadLevelKeys;

/** 重置配置 */
export interface TableReloadOptions {
  /** 为true时, 保持当前滚动位置 */
  keepPosition?: boolean;
  /** TableReloadLevel.base | 重置级别 */
  level?: TableReloadLevel;
}

export interface TableLife {
  /**
   * 重载表格
   * - 大部分情况下, 仅需要使用 render() 方法即可, 它有更好的性能
   * - 另外, 在必要配置变更后, 会自动调用 reload() 方法, 你只在极少情况下会使用它
   * - reload包含一个opt.level属性, 不同的配置项变更会对应不同的级别, 在渲染十万以上级别的数据时尤其值得关注, 通过table.config()修改配置时会自动根据修改内容选择重置级别
   * */
  reload(opt?: TableReloadOptions): void;

  /** reload()的同步版本, 没有requestAnimationFrame调用 */
  reloadSync(opt?: TableReloadOptions): void;

  /** 销毁表格, 解除所有引用/事件 */
  destroy(): void;

  /**
   * 用于合并复数的render/reload操作, 回调执行期间, 所有的render/reload操作会被暂时拦截, 在回调结束后如果开启了autoTrigger(默认为true), 将根据期间的render/reload调用自动进行更新
   *
   * ## example
   * ```ts
   * table.takeover(() => {
   *   // 所有操作都不会触发更新
   *   doSomething();
   * });
   * // 调用完成后会自动触发更新
   * ```
   * */
  takeover(cb: EmptyFunction, autoTrigger?: boolean): void;

  /** 是否正在执行takeover */
  isTaking(): boolean;

  /**
   * 重置表格状态, 执行后:
   * - 新增 / 删除 / 更新 / 排序 等操作会被视为已提交, 不再显示变更标记
   * - 验证 / 操作历史等会被重置
   *
   * - 使用场景: 执行提交等操作后, 若不想完全重新拉取数据并reload表格, 可调用此方法来重置状态, 并复用现有数据
   * */
  resetStatus(): void;
}
