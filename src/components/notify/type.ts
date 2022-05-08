import React from 'react';
import { StatusUnion } from 'm78/common';
import { RenderApiComponentProps } from '@m78/render-api';
import { SpringRef } from 'react-spring';
import { UseMeasureBound } from '@lxjx/hooks';

/** notify的可用显示方向 */
export enum NotifyPosition {
  top = 'top',
  bottom = 'bottom',
  center = 'center',
  leftTop = 'leftTop',
  leftBottom = 'leftBottom',
  rightTop = 'rightTop',
  rightBottom = 'rightBottom',
}

export type NotifyPositionKeys = keyof typeof NotifyPosition;

export type NotifyPositionUnion = NotifyPosition | NotifyPositionKeys;

export interface NotifyState {
  /** 显示的内容, 传入一个函数时会完全替换默认节点, 用于高度定制 */
  content?: React.ReactNode | (() => React.ReactNode);
  /** 'info' | 状态 */
  status?: StatusUnion;
  /** 标题 */
  title?: React.ReactNode;
  /** 'center' | 显示的位置 */
  position?: NotifyPositionUnion;
  /** 1000 | 持续时间，如果不需要自动关闭，传Infinity */
  duration?: number;
  /** 渲染操作栏, 可通过props.onChange(false)来主动关闭, props.onUpdate(newState)来更新状态 */
  actions?: (props: NotifyProps) => React.ReactNode;
  /** 显示关闭按钮 */
  cancel?: boolean;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 设置为加载状态 */
  loading?: boolean;
  /** 触摸或光标移动到上方时是否暂停notify动画计时, tips和notify类型默认为true */
  interactive?: boolean;
  /** 隐藏的延迟, 用于loading()实现, 防止loading状态一闪而过 */
  hideDelay?: boolean;
}

export interface NotifyProps extends NotifyState, Required<RenderApiComponentProps<NotifyState>> {}

/** loading配置, 默认会有500ms的hideDelay */
export interface LoadingOption extends Pick<NotifyState, 'position' | 'mask' | 'hideDelay'> {
  /** loading提示文本 */
  text?: React.ReactNode;
}

export interface _Share {
  hasDuration: boolean;
  duration: number;
  position: NotifyPositionUnion;
  show: boolean;
  api: SpringRef<{ process: number; height: number; opacity: number; transform: string }>;
  props: NotifyProps;
  bound: UseMeasureBound;
}
