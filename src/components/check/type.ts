import { ComponentBaseProps } from 'm78/types';
import React from 'react';
import { CheckCustom } from './check';

export interface CheckProps<Val> extends ComponentBaseProps {
  /** 显示的样式 */
  type?: 'radio' | 'checkbox' | 'switch';
  /** 在视觉上设置为 `待定`，用于全选等操作满足部分条件的情况， 只限于type=checkbox,优选级小于checked */
  partial?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 渲染时自动获取焦点 */
  autoFocus?: boolean;
  /** 表单值，在onChange时以第二个参数传入 */
  value?: Val;
  /** 后置label文本 */
  label?: React.ReactNode;
  /** 前置label文本 */
  beforeLabel?: React.ReactNode;
  /** type=switch时生效，设置开启状态的handle文本, 一个汉字或4个字母以内 */
  switchOn?: string;
  /** type=switch时生效，设置关闭状态的handle文本, 一个汉字或4个字母以内 */
  switchOff?: string;
  /** 单行显示 */
  block?: boolean;
  /** 同原生组件的`name` */
  name?: string;
  /** 用于定制组件样式 */
  customer?: CheckCustom;
  /** 是否选中 */
  checked?: boolean;
  /** 非受控模式下使用 */
  defaultChecked?: boolean;
  /** checked触发改变的钩子，回传值为checked状态和value(未传入时为'') */
  onChange?: (checked: boolean, value: Val) => void;
}
