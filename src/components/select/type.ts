import React from 'react';
import { FormLikeWithExtra } from '@lxjx/hooks';
import { ComponentBaseProps, DataSourceItem } from '../types/types';

interface SelectOptionItem {
  /** 选项名 */
  label: string;
  /** 选项值, 默认与label相同 */
  value?: any;
  /** 是否禁用 */
  disabled?: boolean;
  /** 特殊的选项类型 */
  type?: 'title' | 'divider';
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;
}

export interface SelectProps extends ComponentBaseProps, FormLikeWithExtra<SelectOptionItem> {
  /** 选项数组 */
  options?: DataSourceItem[];
  /** false | 开启多选 */
  multiple?: boolean;
  /** true | 开启虚拟滚动 */
  virtual?: boolean;
  /** 列表宽度，默认与输入框等宽 */
  listWidth?: number | string;
  /** 320 | 列表最大高度, 超出时出现滚动条 */
  listMaxHeight?: number | string;
  /** 虚拟滚动需要确定的高度，如果列表项通过其他配置修改过，通过此项设置修改后的高度 */
  listItemHeight?: number | string;
}