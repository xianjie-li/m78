import { BoundSize } from "@m78/utils";
import { TableKey, TablePosition } from "./types/base-type.js";
import { TableConfig } from "./types/config.js";
export declare const _prefix = "m78-table";
/** 用于在config.el上存储当前实例 */
export declare const _privateInstanceKey = "__M78TableInstance";
/** 用于在domEl上挂载是否为其是否为内部创建的信息 */
export declare const _privateScrollerDomKey = "__M78PrivateScrollerDom";
export declare const _defaultTexts: {
    readonly sortMergeColumn: "Can not sort column when has merge header";
};
/** 重置级别3的所有配置, 未在其中的所有配置默认为级别1 */
export declare const _level2ConfigKeys: (keyof TableConfig)[];
/** 不能通过table.config()变更的配置 */
export declare const _configCanNotChange: readonly ["el", "primaryKey", "plugins", "viewEl", "viewContentEl", "eventCreator"];
/** 解析rowKey##columnKey格式的字符串为[rowKey, columnKey], 数组长度为2表示解析正常 */
export declare function _getCellKeysByStr(s?: string): string[];
/** 根据行列索引获取其字符串形式的ind */
export declare function _getCellKey(rowKey: TableKey, columnKey: TableKey): string;
/** 若是数字, 返回`${size}px`, 是字符串直接返回 */
export declare function _getSizeString(size: number | string): string;
/** 根据n个点获取最大Bound */
export declare function _getBoundByPoint(...pointers: TablePosition[]): BoundSize;
/** 根据n个点获取可以组成最大矩形的两个点 */
export declare function _getMaxPointByPoint(...pointers: TablePosition[]): TablePosition[];
/** 用于在正在交互的节点符合条件时跳过table内部的选取/聚焦等事件, 返回true表示需要跳过内部事件 */
declare type TableEventFilter = (target: HTMLElement) => void | boolean;
/** 节点树包含这些className时应跳过事件 */
export declare const _tableInterruptTriggerClassName: RegExp;
/** 节点树包含这些类型的节点时应跳过事件 */
export declare const _tableInterruptTriggerTagName: RegExp;
/** 内置事件过滤器 */
export declare const _tableTriggerFilters: ((target: HTMLElement) => true | undefined)[];
/** 执行一组过滤器, 若该节点需要跳过则返回true, 内部会递归对target所有父级进行校验, 直到stopNode节点为止 */
export declare function _triggerFilterList(target: HTMLElement, list: TableEventFilter[], stopNode: HTMLElement): boolean;
/** 检测传入的事件是否是touch事件 */
export declare function isTouch(e: Event): boolean;
export {};
//# sourceMappingURL=common.d.ts.map