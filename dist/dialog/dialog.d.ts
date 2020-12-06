import React from 'react';
import 'm78/base';
import { ButtonPropsWithHTMLButton } from 'm78/button';
import { ModalBaseProps } from '../modal/types';
export interface DialogProps extends Omit<ModalBaseProps, 'children' | 'onClose'> {
    /** 内容区域的最大宽度, 默认为360 */
    maxWidth?: number | string;
    /** '提示' | 标题文本 */
    title?: string;
    /** 内容区域 */
    children?: React.ReactNode;
    /** 默认的关闭按钮/确认按钮/右上角关闭按钮点击, 或触发了clickAway时，如果是通过确认按钮点击的，isConfirm为true */
    onClose?(isConfirm?: boolean): void;
    /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
    close?: boolean | string;
    /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
    confirm?: boolean | string;
    /** true | 是否显示关闭图标 */
    closeIcon?: boolean;
    /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止clickAwayClosable) */
    loading?: boolean;
    /** 设置Dialog的状态 */
    status?: 'success' | 'error' | 'warning';
    /** 启用响应式按钮，按钮会根据底部的宽度平分剩余宽度 */
    flexBtn?: boolean;
    /** true | 点击默认的确认按钮时，是否关闭弹窗 */
    confirmClose?: boolean;
    /** 自定义顶部内容，会覆盖title的配置 */
    header?: React.ReactNode;
    /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
    footer?: React.ReactNode;
    /** 通过配置设置按钮组 */
    btns?: (Pick<ButtonPropsWithHTMLButton, 'color' | 'children' | 'onClick' | 'disabled' | 'icon'> & {
        text: string;
    })[];
    /** 内容区域class */
    contentClassName?: string;
    /** 头部区域class */
    headerClassName?: string;
    /** 脚部区域class */
    footerClassName?: string;
}
export interface DialogApi extends Omit<DialogProps, 'children' | 'defaultShow' | 'show' | 'triggerNode' | 'mountOnEnter' | 'unmountOnExit' | 'onRemove' | 'onRemoveDelay'> {
    content: ModalBaseProps['children'];
}
declare const DialogBase: React.FC<DialogProps>;
declare const api: ({ singleton, ...props }: DialogApi & import("@lxjx/react-render-api/dist").ReactRenderApiExtraProps) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<DialogApi>, string];
declare type Dialog = typeof DialogBase;
interface DialogWithApi extends Dialog {
    api: typeof api;
}
declare const Dialog: DialogWithApi;
export default Dialog;
