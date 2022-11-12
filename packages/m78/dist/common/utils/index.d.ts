import React from "react";
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
//# sourceMappingURL=index.d.ts.map