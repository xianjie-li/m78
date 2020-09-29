import React from 'react';
import { Position, Size } from 'm78/util';
import { TabItem } from 'm78/tab';
import { ComponentBaseProps } from '../types/types';

export type TabItemElement = React.ReactElement<TabItemProps, typeof TabItem>;

export interface TabProps {
  /** 当前索引 */
  index?: number;
  /** 索引改变 */
  onChange?: (index: number, value: string | number) => void;
  /** 初始默认索引，优先级小于index */
  defaultIndex?: number;
  /** 一组TabItem */
  children?: TabItemElement[] | TabItemElement;
  /** tab的尺寸 */
  size?: Size;
  /** tab的位置 */
  position?: Position;
  /** tab项的每一项平分宽度，如果tab过多不建议开启, position为left和right时无效 */
  flexible?: boolean;
  /** 高度，position为left和right时必传 */
  height?: number | string;
  /** 无限滚动，页面内容过于复杂时不建议开启，因为需要复制页面帮助完成滚动动画 */
  loop?: boolean;

  /** 禁用 */
  disabled?: boolean;
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;
  /** tab会在滚动隐藏时固定到顶部 */
  affix?: boolean;
  /** 将不可见内容卸载，只保留空容器(由于存在动画，当前项的前后容器总是会保持装载状态, 启用loop时会有额外规则，见注意事项) */
  invisibleUnmount?: boolean;
  /** 元素不可见时，将其display设置为node(需要保证每项只包含一个子元素且能够设置style，注意事项与invisibleUnmount一致) */
  invisibleHidden?: boolean;
}

export interface TabItemProps extends ComponentBaseProps {
  /** tab文本 */
  label: string;
  /** 表示该项的唯一值 */
  value: string | number;
  /** 禁用 */
  disabled?: boolean;
  /** 内容 */
  children?: React.ReactNode;
}
