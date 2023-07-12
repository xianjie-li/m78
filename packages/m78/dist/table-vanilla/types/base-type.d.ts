import { Point } from "@m78/utils";
/** 表示单元格位置的元组, 分别表示 x轴索引, y轴索引 */
export declare type TablePosition = Point;
/** 表示列或行的key */
export declare type TableKey = string | number;
/** 内部会向data/column或其他对象中注入的一些私有标记 */
export declare enum _TablePrivateProperty {
    /** 表示是由table注入的数据 */
    fake = "__M78TableFake",
    /** 表示关联数据或对其的引用 */
    ref = "__M78TableRef",
    /** 该条数据需要在计算/渲染时被忽略 */
    ignore = "__M78TableIgnore",
    /** 该条数据需要在计算/渲染时被忽略, 用于区分与ignore不同的场景 */
    hide = "__M78TableHide",
    /** 与对象有关的某个timer */
    timer = "__M78TableTimer",
    /** 记录当前reloadKey */
    reloadKey = "__M78TableReloadKey",
    /** 挂载渲染标记 */
    renderFlag = "__M78TableRenderFlag"
}
/** 表格内指定点和其相关属性 */
export interface TablePointInfo {
    x: number;
    y: number;
    xy: TablePosition;
    leftFixed: boolean;
    topFixed: boolean;
    rightFixed: boolean;
    bottomFixed: boolean;
    /** 转换之前的x */
    originX: number;
    /** 转换之前的y */
    originY: number;
}
/** 自定义渲染的上下文对象 */
export interface TableRenderCtx {
    isFirstRender: boolean;
    disableDefaultRender: boolean;
    disableLaterRender: boolean;
}
/** 支持的行固定位置 */
export declare enum TableRowFixed {
    top = "top",
    bottom = "bottom"
}
export declare type TableRowFixedKeys = keyof typeof TableRowFixed;
export declare type TableRowFixedUnion = TableRowFixed | TableRowFixedKeys;
/** 支持的列固定位置 */
export declare enum TableColumnFixed {
    left = "left",
    right = "right"
}
export declare type TableColumnFixedKeys = keyof typeof TableColumnFixed;
export declare type TableColumnFixedUnion = TableColumnFixed | TableColumnFixedKeys;
//# sourceMappingURL=base-type.d.ts.map