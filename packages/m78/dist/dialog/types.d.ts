import React from "react";
import { OverlayProps } from "../overlay/index.js";
import { StatusUnion } from "../common/index.js";
export type DialogCloseHandle = (isConfirm?: boolean) => Promise<void>;
/** 快捷询问, promise成功表示确认, 失败表示关闭或取消 */
export interface DialogQuicker {
    (content: DialogProps["content"], title?: DialogProps["title"], cancel?: DialogProps["cancel"]): Promise<void>;
}
export interface DialogProps extends Omit<OverlayProps, "content"> {
    /** 360 | 内容区域的宽度 */
    width?: number | string;
    /** '提示' | 标题文本 */
    title?: string;
    /** 内容区域 */
    content: React.ReactNode | ((close: DialogCloseHandle) => React.ReactNode);
    /**
     * 默认的关闭按钮/确认按钮/右上角关闭按钮/自定义render的close参数, 或触发了clickAway时调用, 不同的返回类型会有不同的效果
     * - 返回false, 阻止默认的关闭行为
     * - 返回一个Promise, dialog进入加载状态, 如果promise resolve的值为false或抛出异常并阻止关闭
     * */
    onClose?(isConfirm?: boolean): any;
    /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
    cancel?: boolean | string;
    /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
    confirm?: boolean | string;
    /** true | 是否显示关闭图标 */
    closeIcon?: boolean;
    /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止clickAwayClosable) */
    loading?: boolean;
    /** 设置Dialog的状态 */
    status?: StatusUnion;
    /** 按钮会根据底部的宽度平分剩余宽度 */
    flexBtn?: boolean;
    /** 对话框是否可拖动 */
    draggable?: boolean;
    /** 自定义顶部内容，会覆盖title的配置 */
    header?: React.ReactNode | ((close: DialogCloseHandle) => React.ReactNode);
    /** 自定义底部内容，与其他底部相关配置的优先级为 footer > confirm、close */
    footer?: React.ReactNode | ((close: DialogCloseHandle) => React.ReactNode);
    /** 自定义内容区域props */
    contentProps?: JSX.IntrinsicElements["div"];
    /** 自定义头部区域props */
    headerProps?: JSX.IntrinsicElements["div"];
    /** 自定义脚部区域props */
    footerProps?: JSX.IntrinsicElements["div"];
}
//# sourceMappingURL=types.d.ts.map