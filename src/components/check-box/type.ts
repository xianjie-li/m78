import { FormLike } from '@lxjx/hooks';
import { CheckCustom } from 'm78/check';
import React from 'react';

export interface CheckOptionItem<Val> {
  label?: React.ReactNode;
  beforeLabel?: React.ReactNode;
  value: Val;
  disabled?: boolean;
}

export interface CheckBoxProps<Val> extends FormLike<Val[]> {
  /** 传递给原生组件 */
  name?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 单行显示 */
  block?: boolean;
  /** 用于定制选框样式 */
  customer?: CheckCustom;
  /** 透传至Check组件的选项 */
  options: Array<CheckOptionItem<Val>>;
}
