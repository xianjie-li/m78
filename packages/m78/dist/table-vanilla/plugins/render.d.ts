import { TablePlugin } from "../plugin.js";
import { EmptyFunction } from "@m78/utils";
import { RafFunction } from "@m78/animate-tools";
import { _TableGetterPlugin } from "./getter.js";
import { TableCell, TableCellWithDom } from "../types/items.js";
import { TablePointInfo, TablePosition, TableRenderCtx } from "../types/base-type.js";
import { _TableEventPlugin } from "./event.js";
/**
 * 渲染核心逻辑
 * */
export declare class _TableRenderPlugin extends TablePlugin implements TableRender {
    /** 优化render函数 */
    rafCaller: RafFunction;
    /** 清理raf */
    rafClear?: EmptyFunction;
    /** 用于滚动订阅优化 */
    event: _TableEventPlugin;
    getter: _TableGetterPlugin;
    beforeInit(): void;
    init(): void;
    beforeDestroy(): void;
    /** 合并实现plugin.cellRender和config.render */
    cellRenderImpl(cell: TableCellWithDom, ctx: TableRenderCtx): void;
    render(): void;
    /** render的同步版本 */
    renderSync(): void;
    /** render核心逻辑 */
    renderMain(): void;
    /** 绘制单元格 */
    renderCell(cells: TableCell[]): void;
    /** 若不存在则初始化cell.dom, 每次reload后会在已有dom上更新 */
    initCellDom(cell: TableCell): void;
    /** 根据配置更新各种容器尺寸相关的内容 */
    updateDom(): void;
    /** 更新容器尺寸信息 */
    updateWrapSize(): void;
    /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */
    restoreWrapSize(): void;
    /** 获取1和2的差异, 并从视口清除2中已不存在的项 */
    removeHideNodes(items1?: TableCell[], items2?: TableCell[]): void;
    transformViewportPoint([x, y]: TablePosition, fixedOffset?: number): TablePointInfo;
    transformContentPoint(pos: TablePosition): TablePointInfo;
    private getBorderSize;
}
export interface TableRender {
    /**
     * 重绘表格. 注: 表格会在需要时自动进行重绘, 大部分情况不需要手动调用
     *
     * 多次调用的render会合并为一次并在浏览器的下一个渲染帧执行, 如果需要同步执行, 请使用renderSync
     * */
    render(): void;
    /** render()的同步版本 */
    renderSync(): void;
    /**
     * 根据表格视区内的点获取基于内容尺寸的点, 传入点的区间为: [0, 表格容器尺寸].
     * - 可传入fixedOffset来对fixed项的判定区域增加或减少
     * */
    transformViewportPoint([x, y]: TablePosition, fixedOffset?: number): TablePointInfo;
    /**
     * 转换内容区域的点为表格视区内的点, 传入点的区间为: [0, 表格内容尺寸].
     * 包含了对缩放的处理
     * */
    transformContentPoint([x, y]: TablePosition): TablePointInfo;
}
//# sourceMappingURL=render.d.ts.map