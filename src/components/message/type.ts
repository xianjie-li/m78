import React from 'react';
import { ReactRenderApiProps } from '@lxjx/react-render-api';

export interface MessageProps extends ReactRenderApiProps {
  /** 提示框的内容 */
  content?: React.ReactNode;
  /** 状态类型 */
  type?:
    | 'success'
    | 'error'
    | 'warning';
  /** 持续时间，如果要一直存在，传Infinity */
  duration?: number;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 设置为加载状态 */
  loading?: boolean;
  /** 是否显示关闭按钮 */
  hasCancel?: boolean;
}
