import React from "react";
import { Resource } from "i18next";
import type { RCTableEditAdaptor } from "../table/index.js";
import type { FormAdaptor } from "../form/index.js";
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
    /**
     * 全局注册的 Form/Table 的表单控件适配器, 此配置不响应变更, 应该仅在应用入口设置一次
     *
     * 注意: 设置时应保留现有配置
     * ```
     * m78Config.set({
     *   formAdaptors: [...m78Config.get().formAdaptors, newAdaptors],
     * })
     * ```
     * */
    formAdaptors: FormAdaptors;
}
/** 表单控件适配器配置 */
export type FormAdaptors = FormAdaptorsItem[];
/** 全局或表单级适配器的一项, 用于使自定义或预置表单控件支持Form或Table */
export interface FormAdaptorsItem {
    /** 待适配的表单控件 */
    element: React.ReactElement;
    /** 控制用于From组件时的适配器 */
    formAdaptor?: FormAdaptor;
    /** 控制用于Table组件时的适配器 */
    tableAdaptor?: RCTableEditAdaptor;
    /** 表单的字符串表示, 配置后, 在后续可以通过字符串key来声明该组件. 注意: 不建议使用字符串进行组件声明, 除非你的场景需要将配置以json形式存储和传输. */
    name?: string;
}
export type { FormAdaptor, RCTableEditAdaptor };
//# sourceMappingURL=types.d.ts.map