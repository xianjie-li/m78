import { TablePlugin } from "../plugin.js";
import { EmptyFunction, RafFunction } from "@m78/utils";
import { TableCell, TableCellWithDom } from "../types/items.js";
import { TableRenderCtx } from "../types/base-type.js";
import { _TableEventPlugin } from "./event.js";
/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */
export declare class _TableViewportPlugin extends TablePlugin {
    /** 优化render函数 */
    rafCaller: RafFunction;
    /** 清理raf */
    rafClear?: EmptyFunction;
    /** 用于滚动订阅优化 */
    event: _TableEventPlugin;
    init(): void;
    beforeDestroy(): void;
    /** 合并实现plugin.cellRender和config.render */
    cellRenderImpl(cell: TableCellWithDom, ctx: TableRenderCtx): void;
    width(width?: number | string): number | undefined;
    height(height?: number | string): number | undefined;
    contentWidth(): number;
    contentHeight(): number;
    x(x?: number): number | undefined;
    y(y?: number): number | undefined;
    xy(x?: number, y?: number): number[] | undefined;
    maxX(): number;
    maxY(): number;
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
    /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */
    restoreWrapSize(): void;
    /** 获取1和2的差异, 并从视口清除2中已不存在的项 */
    removeHideNodes(items1?: TableCell[], items2?: TableCell[]): void;
    isColumnVisible: TableViewPort["isColumnVisible"];
    isRowVisible: TableViewPort["isRowVisible"];
    isCellVisible: TableViewPort["isCellVisible"];
    /** isColumnVisible/isRowVisible通用逻辑 */
    private visibleCommon;
}
export interface TableViewPort {
    /** 获取x */
    x(): number;
    /** 更新x */
    x(x: number): void;
    /** 获取y */
    y(): number;
    /** 更新y */
    y(y: number): void;
    /** 获取y */
    xy(): [number, number];
    /** 更新y */
    xy(x: number, y: number): void;
    /** 获取x最大值 */
    maxX(): number;
    /** 过去y最大值 */
    maxY(): number;
    /** 获取宽度 */
    width(): number;
    /** 设置宽度 */
    width(width: number | string): void;
    /** 获取高度 */
    height(): number;
    /** 设置高度 */
    height(height: number | string): void;
    /** 内容区域宽度 */
    contentWidth(): number;
    /** 内容区域高度 */
    contentHeight(): number;
    /** 重绘表格. 注: 表格会在需要时自动进行重绘, 大部分情况不需要手动调用 */
    render(): void;
    /** render()的同步版本, 没有requestAnimationFrame调用 */
    renderSync(): void;
    /** 指定列是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isColumnVisible(key: string, partial?: boolean): boolean;
    /** 指定行是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isRowVisible(key: string, partial?: boolean): boolean;
    /** 指定单元格是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isCellVisible(rowKey: string, columnKey: string, partial?: boolean): boolean;
}
//# sourceMappingURL=viewport.d.ts.map