import React from 'react';
interface NoSSRProps {
    /** 不在SSR节点渲染的节点 */
    children?: React.ReactNode;
    /** 作为回退的内容, 在服务端渲染 */
    feedback?: React.ReactNode;
}
/**
 * 获取一个用于识别并跳过SSR渲染的变量
 * @param force - 开启执行环境监测
 * 这会减少一次render的触发，但是由于执行`hydrate()`时服务端节点和客户端节点不一致，会触发`Warning: Expected server HTML to contain a matching <*> in <*>`警告, 如果对render次数很敏感且不在意开此警告可开启(此警告不会影响生产环境)。
 * @return - 一个用于标识并跳过服务端渲染的变量
 * */
export declare function useNoSSR(force?: boolean): boolean;
export default function NoSSR({ children, feedback }: NoSSRProps): React.FunctionComponentElement<{}>;
export {};
