import React from 'react';
import { AnyFunction } from '@lxjx/utils';
import { ComponentBaseProps } from 'm78/types';

export interface ForkProps extends ComponentBaseProps {
  /** 是否有数据用于显示, 当为truthy值且无其他非常规状态时时，显示子元素 */
  hasData: any;
  /** 当没有任何非常规状态时，显示的内容，如果需要惰性加载节点，可以传入函数, 开启forceRender时，无论出于任何状态，children都会渲染 */
  children: React.ReactNode | (() => React.ReactNode);
  /** 是否包含错误, 如果是一个对象且包含message属性，则会用其作为反馈显示 */
  error?: any;
  /** 是否超时 */
  timeout?: boolean;
  /** 是否正在请求 */
  loading?: boolean;

  /** 当包含异常时(error | timeout), 通过此方法让用户进行更新请求, 传入后会在错误和无数据时显示重新加载按钮 */
  send?: AnyFunction;
  /**
   * 强制渲染内容
   * - 默认情况下，处在任意反馈状态时，实际内容都不会渲染，启用此项后，反馈节点会和内容一起渲染
   * - 通常用于将反馈节点固定显示到某一位置而不影响实际内容
   * */
  forceRender?: boolean;

  /** 默认loading以占位节点形式显示，传入此项会使其脱离文档流并填满父元素, 需要父元素非常规定位元素(position非static) */
  loadingFull?: boolean;
  /** '加载中' | 加载提示文本 */
  loadingText?: React.ReactNode;
  /** '暂无数据' | 空提示文本 */
  emptyText?: React.ReactNode;
  /** 请求异常 | 请求错误提示文本 */
  errorText?: React.ReactNode;
  /** 请求超时 | 请求超时提示文本   */
  timeoutText?: React.ReactNode;
  /** extend | 反馈节点包裹容器的类名 */
  // className?: string;
  /** extend | 反馈节点包裹容器的类名 */
  // style?: React.CSSProperties;

  /** 自定义加载提示节点 */
  customLoading?: React.ReactNode;
  /** 自定义信息提示条, title为表示错误类型的标题，message为错误消息(根据error获取, 可能不存在) */
  customNotice?: (title: React.ReactNode, message?: React.ReactNode) => React.ReactNode;
  /** 自定义空数据节点 */
  customEmpty?: React.ReactNode;
}

export interface IfProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children?: React.ReactNode;
}

export interface ToggleProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children: React.ReactNode;
}

export interface SwitchProps {
  children: React.ReactElement[];
}
