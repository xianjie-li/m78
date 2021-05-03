import React from 'react';
import { TileProps } from 'm78/layout';
import { SizeEnum, SizeKeys, ComponentBaseProps } from 'm78/types';

export enum ListViewItemStyleEnum {
  splitLine = 'splitLine',
  border = 'border',
  none = 'none',
}

export interface ListViewProps extends ComponentBaseProps {
  /** 内容, 通常是一组ListViewItem */
  children: React.ReactNode;
  /** 多列模式 */
  column?: number;
  /** 调整布局紧凑程度、字号等 */
  size?: SizeEnum | SizeKeys;
  /** false | 列表容器显示边框 */
  border?: boolean;
  /**
   * 'splitLine' | 项的基础样式类型
   * - splitLine模式在开启了多列的情况下无效
   * */
  itemStyle?: 'splitLine' | 'border' | 'none' | ListViewItemStyleEnum;
  /** true | 列表项交互效果 */
  effect?: boolean;
}

export interface ListViewItemProps extends TileProps {
  /** 主要内容 */
  title: React.ReactNode;
  /** 显示右侧箭头 */
  arrow?: boolean;
  /** 禁用（视觉禁用） */
  disabled?: boolean;
  /** 1 | 标题最大行数 */
  titleEllipsis?: number;
  /** 2 | 描述区域最大行数 */
  descEllipsis?: number;
}

export interface ListViewTitleProps {
  /** 是否是子标题 */
  subTile?: boolean;
  /** 标题内容 */
  children?: React.ReactNode;
  /** 描述信息 */
  desc?: React.ReactNode;
}
