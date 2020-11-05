import React from 'react';
import { ComponentBaseProps } from 'm78/types';

export interface EmptyProps extends ComponentBaseProps {
  /** 描述 */
  desc?: React.ReactNode;
  /** 操作区域的内容 */
  children?: React.ReactNode;
  /** 图标和文字的尺寸 */
  size?: 'small' | 'large';
  /** 占位区域内容 */
  emptyNode?: React.ReactElement;
}
