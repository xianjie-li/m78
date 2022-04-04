import React from 'react';
import { FullSizeKeys, FullSize } from 'm78/common';
import { ComponentBaseProps } from '@lxjx/utils';

export interface SpinProps extends ComponentBaseProps {
  /** 大小 */
  size?: FullSize | FullSizeKeys;
  /** 内联模式 */
  inline?: boolean;
  /** '加载中' | 提示文本 */
  text?: React.ReactNode;
  /** 使spin充满父元素(需要父元素是static以外的定位元素) */
  full?: boolean;
  /** true | 是否显示加载状态 */
  show?: boolean;
  /** 包裹组件样式 */
  style?: React.CSSProperties;
  /** 包裹组件的类名 */
  className?: string;
  /** 300 | 延迟显示/隐藏loading的毫秒数 */
  loadingDelay?: number;
}
