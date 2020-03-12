import React from 'react';
import { FormLike, FormLikeWithExtra } from '@lxjx/hooks';

export type InputPropsExtends = Omit<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'prefix'>;

export interface InputProps extends
  FormLikeWithExtra<string, React.ChangeEvent<HTMLInputElement>>,
  InputPropsExtends {
  /** 图标和文字的尺寸 */
  size?: 'small' | 'large';
  /** 按下回车的回调，会自动失去焦点 */
  onPressEnter?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
}
