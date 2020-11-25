import React from 'react';
import { ComponentBaseProps } from 'm78/types';
interface ErrorBoundaryState {
    /** 错误对象 */
    error: Error | null;
    /** 当前是否存在错误 */
    hasError: boolean;
    /** 是否是支持location以及其reload方法的环境 */
    hasLocation: boolean;
    /** 一个模拟的加载状态，仅用于提升用户体验 */
    loading: boolean;
}
export interface ErrorBoundaryCustomInfos {
    /** 错误对象 */
    error: Error | null;
    /** 重新加载组件 */
    reset: () => void;
    /** 重载页面的方法 */
    reload: () => void;
}
export declare enum ErrorBoundaryType {
    simple = "simple",
    full = "full"
}
interface ErrorBoundaryProps extends ComponentBaseProps {
    /** 显示类型, 简洁模式和完整模式 */
    type?: 'simple' | 'full' | ErrorBoundaryType;
    /** false | full模式时，显示错误堆栈信息 */
    stack?: boolean;
    /** 自定义错误反馈内容 */
    customer?: (infos: ErrorBoundaryCustomInfos) => React.ReactNode;
    /** 自定义重载时显示的加载指示器 */
    customLoadingNode?: React.ReactNode;
    /** 发生错误时触发，可用于向服务器上报错误信息 */
    onError?: (error: Error, errorInfo: any) => void;
}
declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    componentDidCatch(error: Error, errorInfo: any): void;
    reset: () => void;
    reload: () => void;
    renderWrap(child: React.ReactNode): JSX.Element;
    renderErrorNode(): {} | null | undefined;
    render(): {} | null | undefined;
}
export default ErrorBoundary;
