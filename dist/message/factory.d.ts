import React from 'react';
import { ReactRenderApiProps } from '@lxjx/react-render-api';
import { MessageProps } from './type';
export declare type MessageOption = Omit<MessageProps, keyof ReactRenderApiProps>;
declare const messageApi: ({ singleton, ...props }: Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel"> & import("@lxjx/react-render-api/dist").ReactRenderApiExtraProps) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel">>, string];
export declare type TipsOption = Omit<MessageOption, 'loading' | 'hasCancel' | 'loadingDelay'>;
/** 文本提示 */
declare const tips: ({ ...options }: TipsOption) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel">>, string];
export declare type LoadingOption = Omit<MessageOption, 'type' | 'loading' | 'hasCancel'>;
/** 加载中提示 */
declare const loading: ({ ...options }?: Pick<Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel">, "mask" | "content" | "loadingDelay" | "duration">) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel">>, string];
export interface NotifyOption extends Omit<MessageOption, 'loading' | 'loadingDelay'> {
    /** 标题 */
    title?: React.ReactNode;
    /** 详细内容 */
    desc?: React.ReactNode;
    /** 底部显示的内容 */
    foot?: React.ReactNode;
}
/** 轻通知，包含的配置项: content, duration, type, mask, singleton, singleton */
declare const notify: ({ title, desc, foot, content, ...options }: NotifyOption) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<Pick<MessageProps, "loading" | "mask" | "content" | "loadingDelay" | "type" | "duration" | "hasCancel">>, string];
export { tips, loading, notify };
export default messageApi;
