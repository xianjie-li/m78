import React from "react";
import { DataSourceItem, DataSourceItemCustom, ValueType } from "../types/index.js";
/** 禁止冒泡的便捷扩展对象 */
export declare const stopPropagation: {
    onClick(e: React.SyntheticEvent): void;
};
/** throw error */
export declare function throwError(errorMsg: string, namespace?: string): never;
export declare function sendWarning(msg: string, namespace?: string): void;
export declare function useDelayToggle(toggle: boolean, options?: {
    /** 300 | 开启延迟，默认为delay的值, 设置为0禁用 */
    leading?: number;
    /** 600 | 离场延迟，默认为delay的值, 设置为0禁用 */
    trailing?: number;
}): boolean;
export declare const DEFAULT_VALUE_KEY = "value";
export declare const DEFAULT_LABEL_KEY = "label";
export declare const DEFAULT_CHILDREN_KEY = "children";
/** 从DataSourceItem中获取value, 如果未获取到并且label是字符串时, 使用label作为value, 支持自定义取值的key */
export declare function getValueByDataSource(item: DataSourceItem, cus?: DataSourceItemCustom): ValueType | null;
/** 从DataSourceItem中获取label, 如果未获取到并且value是有效时, 使用value作为label, 支持自定义取值的key */
export declare function getLabelByDataSource(item: DataSourceItem, cus?: DataSourceItemCustom): any;
/** 从DataSourceItem中获取children, 支持自定义取值的key */
export declare function getChildrenByDataSource<T = any>(item: T, cus?: DataSourceItemCustom): T[];
//# sourceMappingURL=index.d.ts.map