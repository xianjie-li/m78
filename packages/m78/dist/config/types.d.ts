import React from "react";
import { Resource } from "i18next";
export interface M78SeedConfig {
    /** 黑暗模式 */
    darkMode?: boolean;
    /**
     * 国际化配置
     * - 传入string时, 表示为语言key, 如zh-Hands, en, 需要已加载对应语言包
     * - 如果要添加语言包, 请使用数组形式, [lang, Resource]
     * */
    i18n?: string | [string, Resource];
    /** empty组件特有配置 */
    empty: {
        /** 全局配置Empty组件的空状态图片 */
        emptyNode?: React.ReactElement;
    };
    picture: {
        /** Picture组件加载图片错误时的默认占位图 */
        errorImg?: string;
    };
}
//# sourceMappingURL=types.d.ts.map