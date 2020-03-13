import React from 'react';
import { FormLikeWithExtra } from '@lxjx/hooks';
import { Status, Size } from '../types/types';

export type InputPropsExtends = Omit<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'prefix'>;

export interface InputProps extends FormLikeWithExtra<string, React.ChangeEvent<HTMLInputElement>>,
  InputPropsExtends {
  /** 设置加载状态 */
  loading?: boolean;
  /** 设置阻塞型加载 */
  blockLoading?: boolean;
  /** true | 当value存在时出现清空图标 */
  allowClear?: boolean;
  /** 后导图标 */
  prefix?: React.ReactNode;
  /** 前导图标 */
  suffix?: React.ReactNode;
  /** false | 设置为搜索框, 出现搜索按钮、回车时触发onSearch事件 */
  search?: boolean;
  /** 点击搜索按钮/回车/清空时，触发 */
  onSearch?: (value: string) => void;
  /** 输入框状态，不同状态会以不同的功能色展示 */
  status?: Status;
  /** 组件尺寸 */
  size?: Size | 'big';
  /** 按下回车的回调，会自动失去焦点 */
  onPressEnter?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 无边框 */
  notBorder?: boolean;
  /** 只有下边框 */
  underline?: boolean;
}
