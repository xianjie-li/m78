import { TablePlugin } from "../plugin.js";
import { EmptyFunction } from "@m78/utils";
import { _TableFormPlugin } from "./form/form.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";
import { type RafFunction } from "@m78/animate-tools";
/** 表格生命周期相关控制 */
export declare class _TableLifePlugin extends TablePlugin {
    /** 优化reload函数 */
    rafCaller: RafFunction;
    /** 清理raf */
    rafClear?: EmptyFunction;
    formPlugin: InstanceType<typeof _TableFormPlugin>;
    softRemove: _TableSoftRemovePlugin;
    beforeInit(): void;
    init(): void;
    initialized(): void;
    /** 解除所有事件/引用类型占用 */
    beforeDestroy(): void;
    /** 核心reload逻辑 */
    reload({ keepPosition, level, }?: TableReloadOptions): void;
    /** 实现table.reload() */
    reloadHandle(opt?: TableReloadOptions): void;
    /** reloadHandle的同步版本 */
    reloadSync(opt?: TableReloadOptions): void;
    /** 触发插件reload */
    reloadMain(opt?: TableReloadOptions): void;
    /** 实现table.destroy() */
    destroyHandle(): void;
    takeover: TableLife["takeover"];
    /** 是否正在执行takeover */
    isTaking(): boolean;
    resetStatus(): void;
    /** 对不同的reloadOpt进行特殊合并 */
    private mergeTakeReloadOptions;
    private commonAction;
}
/** 重载级别, 更高的级别会包含低级别的重载内容 */
export declare enum TableReloadLevel {
    /** 基础信息计算, 比如固定/合并/尺寸等信息, 计算比较快速 */
    base = 0,
    /** 重新计算索引, 通常在组件内部备份的data和columns顺序变更时使用, 组件使用者很少会使用到此级别, 由于包含了对data/column的遍历, 性能消耗会更高 */
    index = 1,
    /** 重要配置发生了变更, 比如data/column完全改变, 会执行初始化阶段的大部分操作 */
    full = 2
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
//# sourceMappingURL=life.d.ts.map