import React from 'react';
import { ComponentBaseProps } from '@lxjx/utils';
import { PopperPropsCustom } from 'm78/popper';
import { TileProps } from 'm78/layout';

export interface ContextMenuProps extends ComponentBaseProps {
  /** 一个接收onContextMenu事件的子节点 */
  children: JSX.Element;
  /** 内容 */
  content: React.ReactNode | ((props: PopperPropsCustom) => React.ReactNode);
  /** 完全定制样式 */
  customer?(props: PopperPropsCustom): JSX.Element;
}

export interface ContextMenuItemProps extends TileProps {
  /** 添加禁用样式 */
  disabled?: boolean;
}
