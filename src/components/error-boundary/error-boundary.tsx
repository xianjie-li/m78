import React from 'react';
import { isFunction } from '@lxjx/utils';
import { ComponentBaseProps } from 'm78/types';
import cls from 'classnames';
import Spin from 'm78/spin';
import Result from 'm78/result';
import Button from 'm78/button';

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

export enum ErrorBoundaryType {
  simple = 'simple',
  full = 'full',
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

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    loading: false,
    hasError: false,
    hasLocation: typeof location !== 'undefined' && isFunction(location?.reload),
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
    });

    this.props.onError?.(error, errorInfo);

    if (process.env.NODE_ENV === 'production') {
      console.warn('ErrorBoundary:error ->', error);
      console.warn('ErrorBoundary:info ->', errorInfo);
    }
  }

  reset = () => {
    this.setState({
      loading: true,
    });

    // 模拟一个延迟, 否则错误组件响应过快会导致用户以为自己的点击没有生效
    setTimeout(() => {
      this.setState({
        error: null,
        hasError: false,
        loading: false,
      });
    }, 500);
  };

  reload = () => {
    location.reload();
  };

  renderWrap(child: React.ReactNode) {
    return (
      <div className={cls('m78-error-boundary', this.props.className)} style={this.props.style}>
        {child}
      </div>
    );
  }

  renderErrorNode() {
    const { error, hasLocation } = this.state;
    const { customer, type, stack } = this.props;

    if (customer) {
      return customer({
        error,
        reload: this.reload,
        reset: this.reset,
      });
    }

    if (type === ErrorBoundaryType.full) {
      return this.renderWrap(
        <Result
          type="error"
          title={error?.message}
          desc="😭 加载数据时发生了一些错误"
          actions={
            <>
              {hasLocation && <Button onClick={this.reload}>刷新页面</Button>}
              <Button onClick={this.reset} color="primary">
                重新加载
              </Button>
            </>
          }
        >
          {stack && error?.stack ? (
            <pre className="m78-error-boundary_pre m78-scrollbar">{error?.stack}</pre>
          ) : null}
        </Result>,
      );
    }

    return this.renderWrap(
      <>
        {error && error.message && <div className="m78-error-boundary_title">{error.message}</div>}
        <div>
          😭 发生了一些错误，请尝试
          <span>
            <a onClick={this.reset}> 重新加载 </a>{' '}
            {this.state.hasLocation && (
              <span>
                或<a onClick={this.reload}> 刷新页面 </a>
              </span>
            )}
          </span>
        </div>
      </>,
    );
  }

  render() {
    const { loading } = this.state;
    const { customLoadingNode } = this.props;

    if (loading) {
      return customLoadingNode || this.renderWrap(<Spin text="重载中" inline size="small" />);
    }

    if (this.state.hasError) {
      return this.renderErrorNode();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
