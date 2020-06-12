import React from 'react';
import { FormLikeWithExtra } from '@lxjx/hooks';
import { ComponentBaseProps, DataSourceItem } from '../types/types';

export interface SelectOptionItem<ValType> extends Partial<DataSourceItem<ValType>> {
  /** 是否禁用 */
  disabled?: boolean;
  /** 特殊的选项类型 */
  type?: 'title' | 'divider';
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;
}

export interface SelectProps<ValType> extends ComponentBaseProps, FormLikeWithExtra<ValType> {
  /** [] | 选项数组 */
  options?: SelectOptionItem<ValType>[];
  /** false | 开启多选 */
  multiple?: boolean;
  /** true | 开启虚拟滚动 */
  virtual?: boolean;
  /** 列表加载状态 */
  loading?: boolean;
  /** 列表宽度，默认与输入框等宽 */
  listWidth?: number | string;
  /** 320 | 列表最大高度, 超出时出现滚动条 */
  listMaxHeight?: number | string;
  /** 32 | 虚拟滚动需要确定的高度，如果列表项通过其他配置修改过，通过此项设置修改后的高度 */
  listItemHeight?: number | string;
}
